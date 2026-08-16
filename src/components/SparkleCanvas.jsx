import { useEffect, useRef } from 'react'

/**
 * 星光层
 *
 * 铺在全站内容之下的一张 fixed canvas。三样东西：
 *   1. 星尘 —— 鼠标划过沿轨迹洒下的四角星，缓缓上浮、自转、淡出
 *   2. 常驻微光 —— 十来颗几乎不动的小星在原地呼吸，鼠标不动时页面也不死
 *   3. 蝴蝶 —— 隔一会儿有一只扇着翅膀从屏幕一侧飘过，是彩蛋不是主角
 *
 * 关键：每帧 clearRect 整屏重画。上一版水墨是「不清屏、只淡出」，笔迹会
 * 层层叠加糊成一片（就是那股霉斑感）；这里所有东西都有干净的边缘，画完就没。
 */

const HUES = ['#ff4d8d', '#ff9e44', '#f2c14e', '#06d6a0', '#3ab7f0', '#5b6bff', '#9b5de5']

const MAX_DUST = 130
const RESIDENT = 14

// 四角星：四条尖角 + 收得很紧的腰，是那种「叮」一下的闪光形状
function starPath(ctx, r) {
  const k = r * 0.13
  ctx.beginPath()
  ctx.moveTo(0, -r)
  ctx.quadraticCurveTo(k, -k, r, 0)
  ctx.quadraticCurveTo(k, k, 0, r)
  ctx.quadraticCurveTo(-k, k, -r, 0)
  ctx.quadraticCurveTo(-k, -k, 0, -r)
  ctx.closePath()
}

export default function SparkleCanvas({ dark }) {
  const canvasRef = useRef(null)
  const darkRef = useRef(dark)
  darkRef.current = dark

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let raf = 0
    let running = true

    // 光晕 sprite：每色一张，绘制时只 drawImage
    let glows = new Map()
    const glowFor = (color) => {
      let g = glows.get(color)
      if (g) return g
      const size = 64
      const off = document.createElement('canvas')
      off.width = off.height = size
      const c = off.getContext('2d')
      const grad = c.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
      grad.addColorStop(0, color)
      grad.addColorStop(0.35, color)
      grad.addColorStop(1, 'transparent')
      c.fillStyle = grad
      c.beginPath()
      c.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
      c.fill()
      glows.set(color, off)
      return off
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    /* ---------- 状态 ---------- */
    const dust = []
    const resident = Array.from({ length: RESIDENT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 2.3 + Math.random() * 3.2,
      color: HUES[(Math.random() * HUES.length) | 0],
      phase: Math.random() * Math.PI * 2,
      speed: 0.006 + Math.random() * 0.01,
      drift: 0.04 + Math.random() * 0.06,
      rot: Math.random() * Math.PI,
    }))

    let px = -1
    let py = -1
    let butterfly = null
    let nextFly = 9000 + Math.random() * 8000 // 首只出现得早一点，让人知道有这回事

    const addDust = (x, y, opts = {}) => {
      if (dust.length >= MAX_DUST) dust.shift()
      dust.push({
        x, y,
        vx: (Math.random() - 0.5) * (opts.spread ?? 0.55),
        vy: (Math.random() - 0.5) * (opts.spread ?? 0.55) - 0.14, // 略微上飘
        life: 0,
        span: opts.span ?? 62 + Math.random() * 48,
        r: opts.r ?? 2.2 + Math.random() * 4.2,
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.035,
        color: HUES[(Math.random() * HUES.length) | 0],
      })
    }

    /* ---------- 蝴蝶 ---------- */
    const spawnButterfly = () => {
      const ltr = Math.random() < 0.5
      const baseY = height * (0.18 + Math.random() * 0.6)
      butterfly = {
        ltr,
        x: ltr ? -60 : width + 60,
        baseY,
        t: 0,
        speed: 0.55 + Math.random() * 0.45, // px/帧
        amp: 26 + Math.random() * 46,
        freq: 0.006 + Math.random() * 0.005,
        scale: 0.95 + Math.random() * 0.5, // 翼展约 48–72px
        phase: 0,
        flapRate: 0.19 + Math.random() * 0.08,
        c1: HUES[(Math.random() * HUES.length) | 0],
        c2: HUES[(Math.random() * HUES.length) | 0],
        y: baseY,
        angle: 0,
      }
    }

    // 单侧翅膀（右半）：上翅大、前缘向外上冲出，下翅小一圈收成圆尾，
    // 两片在身体处相接 —— 分离的四片会看成一朵花，这是关键
    const wingPath = (s) => {
      ctx.beginPath()
      ctx.moveTo(0, -4 * s)
      ctx.bezierCurveTo(2 * s, -21 * s, 15 * s, -23 * s, 21 * s, -14 * s)
      ctx.bezierCurveTo(25 * s, -8 * s, 20 * s, -1.5 * s, 11 * s, 0.5 * s)
      ctx.bezierCurveTo(5 * s, 1.5 * s, 1 * s, -0.5 * s, 0, -4 * s)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(6 * s, 1 * s, 13 * s, 4.5 * s, 13.5 * s, 10.5 * s)
      ctx.bezierCurveTo(13.8 * s, 15.5 * s, 8.5 * s, 18.5 * s, 4.5 * s, 15 * s)
      ctx.bezierCurveTo(1.5 * s, 12 * s, 0.4 * s, 6 * s, 0, 0)
      ctx.fill()
    }

    const drawButterfly = (b) => {
      const s = b.scale
      const flap = 0.24 + 0.76 * Math.abs(Math.sin(b.phase))
      const body = darkRef.current ? '#e6ebf5' : '#2a2f38'
      ctx.save()
      ctx.translate(b.x, b.y)
      // 身体顺着飞行方向；翅膀在身体两侧张开，所以整体再转 90°
      ctx.rotate(b.angle + Math.PI / 2)
      ctx.globalAlpha = darkRef.current ? 0.92 : 0.82

      for (const side of [1, -1]) {
        ctx.save()
        ctx.scale(side * flap, 1) // 扇翅就是把半边翅膀横向压扁
        const g = ctx.createLinearGradient(0, -14 * s, 22 * s, 16 * s)
        g.addColorStop(0, b.c1)
        g.addColorStop(1, b.c2)
        ctx.fillStyle = g
        wingPath(s)
        ctx.fillStyle = 'rgba(255,255,255,.5)' // 翼尖小斑
        ctx.beginPath(); ctx.ellipse(15 * s, -12 * s, 2.6 * s, 2 * s, -0.5, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
      }

      // 身体：头胸腹三段收细
      ctx.fillStyle = body
      ctx.beginPath()
      ctx.moveTo(0, -8 * s)
      ctx.bezierCurveTo(2 * s, -7 * s, 2.2 * s, 2 * s, 0.9 * s, 12 * s)
      ctx.bezierCurveTo(0.4 * s, 15 * s, -0.4 * s, 15 * s, -0.9 * s, 12 * s)
      ctx.bezierCurveTo(-2.2 * s, 2 * s, -2 * s, -7 * s, 0, -8 * s)
      ctx.fill()
      ctx.beginPath(); ctx.arc(0, -8.5 * s, 1.9 * s, 0, Math.PI * 2); ctx.fill()

      // 触角
      ctx.strokeStyle = body
      ctx.lineWidth = 0.75 * s
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(0.5 * s, -9.5 * s); ctx.quadraticCurveTo(4 * s, -14 * s, 6.5 * s, -15.5 * s)
      ctx.moveTo(-0.5 * s, -9.5 * s); ctx.quadraticCurveTo(-4 * s, -14 * s, -6.5 * s, -15.5 * s)
      ctx.stroke()
      ctx.restore()
    }

    /* ---------- 输入 ---------- */
    const onMove = (e) => {
      const x = e.clientX
      const y = e.clientY
      if (px < 0) { px = x; py = y; return }
      const d = Math.hypot(x - px, y - py)
      px = x
      py = y
      // 走得越快撒得越密，但整体克制：慢慢挪基本不出星
      if (d > 2 && Math.random() < Math.min(0.1 + d / 90, 0.55)) {
        addDust(x + (Math.random() - 0.5) * 16, y + (Math.random() - 0.5) * 16)
      }
    }
    const onDown = (e) => {
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI * 2 * i) / 10 + Math.random() * 0.5
        const dd = 4 + Math.random() * 12
        addDust(e.clientX + Math.cos(a) * dd, e.clientY + Math.sin(a) * dd, {
          spread: 2.4, r: 2.6 + Math.random() * 4.5, span: 55 + Math.random() * 35,
        })
      }
    }
    const onVis = () => {
      running = !document.hidden
      if (running) { last = performance.now(); raf = requestAnimationFrame(frame) }
      else cancelAnimationFrame(raf)
    }

    /* ---------- 主循环 ---------- */
    let last = performance.now()
    const frame = (now) => {
      if (!running) return
      const dt = Math.min((now - last) / 16.67, 3)
      last = now

      ctx.clearRect(0, 0, width, height) // 每帧重画，绝不累积
      const isDark = darkRef.current
      ctx.globalCompositeOperation = isDark ? 'lighter' : 'source-over'

      // 1) 常驻微光：原地呼吸
      for (const s of resident) {
        s.phase += s.speed * dt
        s.rot += 0.002 * dt
        s.y -= s.drift * dt
        if (s.y < -20) { s.y = height + 20; s.x = Math.random() * width }
        const puls = 0.5 + 0.5 * Math.sin(s.phase)
        const a = (isDark ? 0.5 : 0.24) * (0.25 + 0.75 * puls)
        const r = s.r * (0.8 + 0.35 * puls)
        ctx.globalAlpha = a * 0.3
        const gsz = r * 2.7
        ctx.drawImage(glowFor(s.color), s.x - gsz, s.y - gsz, gsz * 2, gsz * 2)
        ctx.globalAlpha = a
        ctx.fillStyle = s.color
        ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.rot); starPath(ctx, r); ctx.fill(); ctx.restore()
      }

      // 2) 星尘
      for (let i = dust.length - 1; i >= 0; i--) {
        const p = dust[i]
        p.life += dt
        const t = p.life / p.span
        if (t >= 1) { dust.splice(i, 1); continue }
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.vx *= 0.982
        p.vy = p.vy * 0.982 - 0.006 * dt
        p.rot += p.spin * dt
        // 快速亮起、慢慢熄灭
        const fade = t < 0.16 ? t / 0.16 : 1 - (t - 0.16) / 0.84
        const a = fade * (isDark ? 0.95 : 0.72)
        const r = p.r * (0.55 + 0.45 * Math.sin(Math.min(t, 1) * Math.PI))
        ctx.globalAlpha = a * 0.42
        const gsz = r * 2.5
        ctx.drawImage(glowFor(p.color), p.x - gsz, p.y - gsz, gsz * 2, gsz * 2)
        ctx.globalAlpha = a
        ctx.fillStyle = p.color
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); starPath(ctx, r); ctx.fill(); ctx.restore()
      }
      ctx.globalAlpha = 1

      // 3) 蝴蝶：隔一阵子来一只
      if (!reduce) {
        if (!butterfly) {
          nextFly -= dt * 16.67
          if (nextFly <= 0) { spawnButterfly(); nextFly = 26000 + Math.random() * 26000 }
        } else {
          const b = butterfly
          b.t += dt
          b.phase += b.flapRate * dt
          const step = b.speed * dt * (b.ltr ? 1 : -1)
          b.x += step
          const prevY = b.y
          b.y = b.baseY + Math.sin(b.x * b.freq) * b.amp
          b.angle = Math.atan2(b.y - prevY, step || 0.001)
          ctx.globalCompositeOperation = 'source-over' // 蝴蝶要实心，别被 lighter 冲淡
          drawButterfly(b)
          ctx.globalCompositeOperation = isDark ? 'lighter' : 'source-over'
          if ((b.ltr && b.x > width + 70) || (!b.ltr && b.x < -70)) butterfly = null
        }
      }

      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    if (!reduce) {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerdown', onDown, { passive: true })
    }
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
      glows = new Map()
    }
  }, [])

  return <canvas ref={canvasRef} className="sparkle-canvas" aria-hidden="true" />
}
