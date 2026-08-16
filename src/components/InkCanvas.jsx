import { useEffect, useRef } from 'react'

/**
 * 水墨层
 *
 * 铺在全站内容之下的一张 fixed canvas。三样东西叠出「墨在纸上化开」的感觉：
 *   1. 笔触 —— 鼠标轨迹画成平滑曲线，走得快线细、走得慢线粗，像提按
 *   2. 墨点 —— 沿轨迹撒出的软圆，一边飘一边扩大变淡
 *   3. 游墨 —— 十来颗常驻的极淡墨滴慢慢游走，鼠标不动时页面也不死
 *
 * 画布从不整屏清除，每帧只做一次极轻的淡出，笔迹于是自然累积又慢慢褪去。
 * 日间靠 CSS 的 mix-blend-mode: multiply 让墨渗进白纸，夜间换成 screen 变成辉光。
 */

const PALETTE_DARK = ['#ff6fa3', '#ffb35c', '#3be7b8', '#5cc8ff', '#b47bf0']
const PALETTE_LIGHT = ['#1a1d22', '#1a1d22', '#1a1d22', '#c2426a', '#3f6fa8']

const MAX_DOTS = 240
const DRIFTERS = 12

export default function InkCanvas({ dark }) {
  const canvasRef = useRef(null)
  const darkRef = useRef(dark)
  darkRef.current = dark

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0
    let running = true

    /* ---- 软圆 sprite：每种颜色预渲染一张，绘制时只 drawImage，够快 ----
       两种衰减：dot 中心结实（墨点），haze 从圆心就开始散（雾气） */
    let sprites = new Map()
    const spriteFor = (color, kind = 'dot') => {
      const key = kind + '|' + color
      let s = sprites.get(key)
      if (s) return s
      const size = 128
      const off = document.createElement('canvas')
      off.width = off.height = size
      const c = off.getContext('2d')
      const g = c.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
      g.addColorStop(0, color)
      if (kind === 'dot') g.addColorStop(0.42, color)
      g.addColorStop(1, 'transparent')
      c.fillStyle = g
      c.beginPath()
      c.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
      c.fill()
      sprites.set(key, off)
      return off
    }

    const palette = () => (darkRef.current ? PALETTE_DARK : PALETTE_LIGHT)
    const inkColor = () => (darkRef.current ? '#dfe6f5' : '#161a20')

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    /* ---- 状态 ---- */
    const dots = []
    let px = -1 // 上一个鼠标点
    let py = -1
    let cx = -1 // 平滑后的当前笔尖
    let cy = -1
    let speed = 0
    let pointerLive = false

    const drifters = Array.from({ length: DRIFTERS }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      seed: Math.random() * 1000,
      r: 110 + Math.random() * 150,
      sp: 0.5 + Math.random() * 0.7,
      hue: i % 5,
    }))

    const addDot = (x, y, opts = {}) => {
      if (dots.length >= MAX_DOTS) dots.shift()
      const pal = palette()
      dots.push({
        x,
        y,
        vx: (Math.random() - 0.5) * (opts.spread ?? 0.5),
        vy: (Math.random() - 0.5) * (opts.spread ?? 0.5) - 0.08,
        life: 0,
        span: opts.span ?? 70 + Math.random() * 80,
        r0: opts.r0 ?? 1.5 + Math.random() * 3,
        r1: opts.r1 ?? 12 + Math.random() * 34,
        // 大多数是墨色，少数取一枚炫彩，别让页面变成彩虹糖
        color: Math.random() < (opts.colorChance ?? 0.22) ? pal[(Math.random() * pal.length) | 0] : inkColor(),
        alpha: opts.alpha ?? 0.055 + Math.random() * 0.05,
      })
    }

    /* ---- 输入 ---- */
    const onMove = (e) => {
      const x = e.clientX
      const y = e.clientY
      if (px < 0) { px = cx = x; py = cy = y; pointerLive = true; return }
      const dx = x - px
      const dy = y - py
      speed = Math.min(Math.hypot(dx, dy), 60)
      px = x
      py = y
      pointerLive = true
      // 走得越快撒得越密，笔锋才跟得上
      if (Math.random() < 0.34 + speed / 160) {
        addDot(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10)
      }
    }
    const onDown = (e) => {
      // 点一下：一滴重墨落下，向外炸开一圈
      addDot(e.clientX, e.clientY, { r0: 4, r1: 82, span: 130, alpha: 0.1, spread: 0.2, colorChance: 0.5 })
      for (let i = 0; i < 14; i++) {
        const a = (Math.PI * 2 * i) / 14 + Math.random() * 0.4
        const d = 6 + Math.random() * 16
        addDot(e.clientX + Math.cos(a) * d, e.clientY + Math.sin(a) * d, {
          r1: 16 + Math.random() * 22, span: 80, spread: 1.6, colorChance: 0.45,
        })
      }
    }
    const onLeave = () => { pointerLive = false; px = py = -1 }
    const onVis = () => {
      running = !document.hidden
      if (running) { last = performance.now(); raf = requestAnimationFrame(frame) }
      else cancelAnimationFrame(raf)
    }

    /* ---- 主循环 ---- */
    let last = performance.now()
    const frame = (now) => {
      if (!running) return
      const dt = Math.min((now - last) / 16.67, 3)
      last = now

      // 极轻的淡出：笔迹留三四秒后自行消失
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = `rgba(0,0,0,${0.014 * dt})`
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'source-over'

      // 1) 笔触：笔尖追着鼠标走，追的过程本身就是平滑
      if (pointerLive && px >= 0) {
        const nx = cx + (px - cx) * 0.28
        const ny = cy + (py - cy) * 0.28
        const seg = Math.hypot(nx - cx, ny - cy)
        if (seg > 0.4) {
          // 慢 = 粗（按），快 = 细（提）
          const w = Math.max(0.6, 6.4 - speed * 0.13)
          const ink = inkColor()
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          // 外圈淡墨晕
          ctx.strokeStyle = ink
          ctx.globalAlpha = 0.035
          ctx.lineWidth = w * 2.6
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny); ctx.stroke()
          // 内圈实墨
          ctx.globalAlpha = 0.1
          ctx.lineWidth = w
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny); ctx.stroke()
          ctx.globalAlpha = 1
        }
        cx = nx
        cy = ny
        speed *= 0.9
      }

      // 2) 墨点：飘、扩、淡
      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i]
        d.life += dt
        const t = d.life / d.span
        if (t >= 1) { dots.splice(i, 1); continue }
        d.x += d.vx * dt
        d.y += d.vy * dt
        d.vx *= 0.985
        d.vy = d.vy * 0.985 - 0.004 * dt // 墨气微微上浮
        const ease = 1 - Math.pow(1 - t, 2.6) // 先快后慢地化开
        const r = d.r0 + (d.r1 - d.r0) * ease
        ctx.globalAlpha = d.alpha * (1 - t) * (1 - t)
        const sp = spriteFor(d.color)
        ctx.drawImage(sp, d.x - r, d.y - r, r * 2, r * 2)
      }
      ctx.globalAlpha = 1

      // 3) 游墨：鼠标不动时的呼吸
      //    画布是累积的，每帧那点 alpha 会攒到 (每帧值 / 淡出率) 的平衡浓度。
      //    这里刻意压到千分之几，让它停在「几乎看不见的一层雾」而不是烧出实心圆盘。
      const pal = palette()
      const hazeAlpha = darkRef.current ? 0.0006 : 0.0004
      for (const g of drifters) {
        g.seed += 0.004 * g.sp * dt
        g.x += Math.sin(g.seed * 1.3) * g.sp * dt
        g.y += Math.cos(g.seed) * g.sp * 0.7 * dt
        const m = g.r + 40
        if (g.x < -m) g.x = width + m
        if (g.x > width + m) g.x = -m
        if (g.y < -m) g.y = height + m
        if (g.y > height + m) g.y = -m
        ctx.globalAlpha = hazeAlpha
        ctx.drawImage(spriteFor(pal[g.hue % pal.length], 'haze'), g.x - g.r, g.y - g.r, g.r * 2, g.r * 2)
      }
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
      sprites = new Map()
    }
  }, [])

  // 切主题时把已有笔迹抹掉，免得白纸上留着夜间的亮墨
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    ctx?.clearRect(0, 0, c.width, c.height)
  }, [dark])

  return <canvas ref={canvasRef} className="ink-canvas" aria-hidden="true" />
}
