import { useEffect, useRef, useState } from 'react'
import config from '../config'

/**
 * 教育航线
 *
 * 原来是一条直线加几个圆点，太像模板。改成一条穿过所有节点的平滑曲线
 * （Catmull-Rom 样条，所以节点一定落在线上），一架纸飞机滚动到这里时
 * 起飞，沿航线一路把实线「拉」出来，停在「本科」——也就是现在的位置。
 * 再往后是虚线和上锁的节点，留给还没发生的事。
 *
 * 桌面横向蜿蜒上升，手机竖向盘旋向上，两套坐标各自排布，不是简单缩放。
 */

// 桌面：从左下飞到右上，中间在「高中」处有一个小回落
const DESKTOP = {
  box: [900, 300],
  nodes: [
    { x: 66, y: 250 }, { x: 212, y: 214 }, { x: 368, y: 232 },
    { x: 530, y: 150 }, { x: 700, y: 122 }, { x: 846, y: 62 },
  ],
  labelDy: 30,
  plane: 30,
}
// 手机：蛇形向上
const MOBILE = {
  box: [340, 560],
  nodes: [
    { x: 66, y: 512 }, { x: 244, y: 424 }, { x: 88, y: 336 },
    { x: 252, y: 240 }, { x: 92, y: 148 }, { x: 250, y: 56 },
  ],
  labelDy: 0,
  plane: 27,
}

const PER = 48 // 每段采样点数
const CURRENT = 3 // 「本科」在节点数组里的下标 —— 飞机的终点

function crPoint(p0, p1, p2, p3, t) {
  const t2 = t * t
  const t3 = t2 * t
  return {
    x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  }
}

function sampleCurve(nodes) {
  const ext = [nodes[0], ...nodes, nodes[nodes.length - 1]]
  const pts = []
  for (let i = 0; i < ext.length - 3; i++) {
    for (let j = 0; j < PER; j++) pts.push(crPoint(ext[i], ext[i + 1], ext[i + 2], ext[i + 3], j / PER))
  }
  pts.push(nodes[nodes.length - 1])
  return pts
}

// 累积弧长，让飞机匀速而不是按参数走（参数速度在弯道会忽快忽慢）
function arcLengths(pts) {
  const acc = [0]
  for (let i = 1; i < pts.length; i++) {
    acc.push(acc[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y))
  }
  return acc
}

const toPoints = (pts) => pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')

export default function FlightTimeline() {
  const { timeline } = config
  const wrapRef = useRef(null)
  const planeRef = useRef(null)
  const trailRef = useRef(null)
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches
  )
  const [landed, setLanded] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const on = (e) => setMobile(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const L = mobile ? MOBILE : DESKTOP
  const all = sampleCurve(L.nodes)
  const cut = CURRENT * PER // 实线／虚线的分界，正好落在「本科」节点上
  const solid = all.slice(0, cut + 1)
  const dashed = all.slice(cut)
  const acc = arcLengths(solid)
  const flownLen = acc[acc.length - 1]

  const labels = [
    ...timeline.minor.map((m) => ({ label: m.label, state: 'past' })),
    { label: timeline.current.stage, state: 'current' },
    ...timeline.future.map((f) => ({ label: f.label, state: 'locked' })),
  ]

  // 滚动到这一段才起飞，只飞一次
  useEffect(() => {
    const el = wrapRef.current
    const plane = planeRef.current
    const trail = trailRef.current
    if (!el || !plane || !trail) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const place = (t) => {
      const target = flownLen * t
      let i = 1
      while (i < acc.length - 1 && acc[i] < target) i++
      const p = solid[i]
      const prev = solid[Math.max(0, i - 4)]
      const deg = (Math.atan2(p.y - prev.y, p.x - prev.x) * 180) / Math.PI
      plane.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${deg})`)
      trail.style.strokeDashoffset = String(flownLen * (1 - t))
    }

    trail.style.strokeDasharray = String(flownLen)
    if (reduce) {
      place(1)
      setLanded(true)
      return
    }
    place(0)
    plane.style.opacity = '0'

    let raf = 0
    let started = false
    const DUR = 2500

    const run = (t0) => {
      const step = (now) => {
        const t = Math.min((now - t0) / DUR, 1)
        const e = 1 - Math.pow(1 - t, 3) // easeOutCubic：起飞猛，落地稳
        place(e)
        if (t < 1) raf = requestAnimationFrame(step)
        else setLanded(true)
      }
      raf = requestAnimationFrame(step)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return
        started = true
        io.disconnect()
        plane.style.opacity = '1'
        run(performance.now())
      },
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
    // 依赖只列 mobile / flownLen：solid 和 acc 都由 mobile 唯一决定，
    // 每次渲染虽然是新数组但内容不变，列进去只会让飞机反复重飞。
  }, [mobile, flownLen])

  return (
    <div ref={wrapRef} className="mx-auto w-full max-w-4xl">
      <svg
        viewBox={`0 0 ${L.box[0]} ${L.box[1]}`}
        className="w-full"
        style={{ overflow: 'visible' }}
        role="img"
        aria-label="教育经历航线：小学、初中、高中、本科（当前）、硕士及以后"
      >
        <defs>
          <linearGradient id="routeGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--i7)" />
            <stop offset="38%" stopColor="var(--i1)" />
            <stop offset="70%" stopColor="var(--i2)" />
            <stop offset="100%" stopColor="var(--i5)" />
          </linearGradient>
        </defs>

        {/* 还没飞到的那一段：虚线 */}
        <polyline
          className="route-line"
          points={toPoints(dashed)}
          stroke="var(--border-strong)"
          strokeWidth="1.6"
          strokeDasharray="1 9"
          opacity="0.9"
        />

        {/* 已经飞过的航迹 —— 由飞机一路拉出来 */}
        <polyline
          ref={trailRef}
          className="route-line"
          points={toPoints(solid)}
          stroke="url(#routeGrad)"
          strokeWidth="2.4"
        />

        {/* 节点 */}
        {L.nodes.map((n, i) => {
          const meta = labels[i]
          const isCurrent = meta.state === 'current'
          const isLocked = meta.state === 'locked'
          // 桌面标签压在节点正下方；手机放节点侧边，靠哪边看它在左半还是右半
          const rightHalf = n.x > L.box[0] / 2
          const anchor = mobile ? (rightHalf ? 'end' : 'start') : 'middle'
          const tx = mobile ? n.x + (rightHalf ? -22 : 22) : n.x
          const ty = mobile ? n.y + 5 : n.y + L.labelDy

          return (
            <g key={meta.label + i}>
              {isCurrent && landed && (
                <circle cx={n.x} cy={n.y} r="9" fill="none" stroke="var(--i1)" strokeWidth="1.4" className="node-pulse" />
              )}
              {isCurrent ? (
                <>
                  <circle cx={n.x} cy={n.y} r="8" fill="var(--bg)" stroke="url(#routeGrad)" strokeWidth="2.4" />
                  <circle cx={n.x} cy={n.y} r="3.1" fill="var(--i1)" />
                </>
              ) : isLocked ? (
                <circle cx={n.x} cy={n.y} r="5" fill="var(--bg)" stroke="var(--border-strong)" strokeWidth="1.3" strokeDasharray="2 2.4" />
              ) : (
                <circle cx={n.x} cy={n.y} r="4.2" fill="var(--bg)" stroke="var(--border-strong)" strokeWidth="1.6" />
              )}

              <text
                x={tx}
                y={ty}
                className="route-node-label"
                textAnchor={anchor}
                fill={isCurrent ? 'var(--text)' : 'var(--text-faint)'}
                fontSize={isCurrent ? 15 : 13}
                opacity={isLocked ? 0.65 : 1}
              >
                {meta.label}
              </text>
            </g>
          )
        })}

        {/* 纸飞机 */}
        <g ref={planeRef} style={{ transition: 'opacity .3s ease' }}>
          <g
            // 沿机头方向再推出去一点，免得停下时压在「本科」那个节点上
            transform={`translate(${-L.plane / 2 + 12} ${-L.plane / 2}) scale(${L.plane / 24})`}
            style={landed ? { animation: 'planeBob 3s ease-in-out infinite' } : undefined}
          >
            <path d="M22 2.6L2.4 10.4l7.1 2.6 2.6 7.1z" fill="url(#routeGrad)" />
            <path d="M22 2.6L9.5 13" fill="none" stroke="var(--bg)" strokeWidth="1.3" strokeLinecap="round" opacity="0.9" />
          </g>
        </g>
      </svg>
    </div>
  )
}
