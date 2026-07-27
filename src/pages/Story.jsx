import { useParams, Link } from 'react-router-dom'
import { useRef, useState, useEffect, useMemo } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import config from '../config'
import ImageFrame from '../components/ImageFrame'

const bubbleGradients = {
  spotlight: ['#ff5f9e', '#ff9d5c'],
  partner: ['#4d8bff', '#5566ff'],
  'flavor-lab': ['#25d07f', '#12c2c2'],
  intern: ['#a24dff', '#e15bff'],
}

const norm = (item) => (typeof item === 'string' ? { src: item, ar: 1.25 } : { src: item?.src || null, ar: item?.ar || 1.25 })
const gallery = (story) => (story.gallery || []).map(norm)

// Justified 相册：每行等高，按真实比例分配不同宽度（大小不一），整行撑满 → 边齐无缺角、不裁切
function JustifiedGallery({ items, targetHeight = 200, gap = 10, className = '' }) {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(el.clientWidth)
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const rows = useMemo(() => {
    if (!width || !items.length) return []
    const fit = (arr) => (width - gap * (arr.length - 1)) / arr.reduce((s, x) => s + x.a, 0)
    const out = []
    let row = [], sumA = 0
    for (const it of items) {
      const a = 1 / it.ar // 宽高比 w/h
      row.push({ it, a })
      sumA += a
      if (sumA * targetHeight + gap * (row.length - 1) >= width) {
        out.push({ items: row, h: fit(row) })
        row = []; sumA = 0
      }
    }
    if (row.length) {
      // 末行只剩 1 张时，从上一行借一张，避免出现「缺一块」的孤图
      if (row.length === 1 && out.length) {
        const prev = out.pop()
        row.unshift(prev.items.pop())
        out.push({ items: prev.items, h: fit(prev.items) })
      }
      const full = fit(row)
      out.push({ items: row, h: Math.min(full, targetHeight * 1.55) })
    }
    return out
  }, [width, items, targetHeight, gap])

  return (
    <div ref={ref} className={className}>
      {rows.map((r, ri) => (
        <div key={ri} style={{ display: 'flex', gap, marginBottom: gap }}>
          {r.items.map(({ it, a }, k) => (
            <div
              key={k}
              className="group overflow-hidden rounded-xl shadow-md"
              style={{ width: a * r.h, height: r.h, flexShrink: 0 }}
            >
              <ImageFrame
                src={it.src}
                label=""
                className="block h-full w-full"
                imgClassName="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function Paragraphs({ paragraphs, className = '' }) {
  return (
    <div className={className}>
      {paragraphs.map((p, i) => (
        <p key={i} className="mb-5 text-[1.02rem] leading-loose text-soft last:mb-0">{p}</p>
      ))}
    </div>
  )
}

/* 布局 A —— 聚光灯：文字居中 + 下方图片墙 */
function LayoutCentered({ story }) {
  return (
    <div className="mx-auto max-w-4xl">
      <Paragraphs paragraphs={story.paragraphs} className="mx-auto mb-10 max-w-2xl text-center" />
      <JustifiedGallery items={gallery(story)} targetHeight={210} />
    </div>
  )
}

/* 布局 B/C —— 一侧文字，一侧图片墙 */
function LayoutSide({ story, imagesLeft = false }) {
  const text = <Paragraphs paragraphs={story.paragraphs} className="lg:pt-2" />
  const wall = <JustifiedGallery items={gallery(story)} targetHeight={155} />
  return (
    <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
      {imagesLeft ? <>{wall}{text}</> : <>{text}{wall}</>}
    </div>
  )
}

/* 布局 D —— 职场练习生：上方图片墙 + 文字 + 下方图片墙 */
function LayoutTopBottom({ story }) {
  const items = gallery(story)
  const h = Math.ceil(items.length / 2)
  return (
    <div className="mx-auto max-w-4xl">
      <JustifiedGallery items={items.slice(0, h)} targetHeight={190} className="mb-10" />
      <Paragraphs paragraphs={story.paragraphs} className="mx-auto max-w-2xl" />
      <JustifiedGallery items={items.slice(h)} targetHeight={190} className="mt-10" />
    </div>
  )
}

function StoryBody({ story }) {
  switch (story.slug) {
    case 'spotlight': return <LayoutCentered story={story} />
    case 'partner': return <LayoutSide story={story} imagesLeft={false} />
    case 'flavor-lab': return <LayoutSide story={story} imagesLeft={true} />
    case 'intern': return <LayoutTopBottom story={story} />
    default: return <Paragraphs paragraphs={story.paragraphs} className="mx-auto max-w-2xl" />
  }
}

export default function Story() {
  const { slug } = useParams()
  const stories = config.stories || []
  const idx = stories.findIndex((s) => s.slug === slug)
  const story = stories[idx]

  if (!story) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="mb-4 text-2xl font-bold text-body">页面不存在</h1>
        <Link to="/" className="btn-accent">返回首页<ArrowRight size={16} /></Link>
      </div>
    )
  }

  const [c1, c2] = bubbleGradients[story.slug] || ['#5b8cff', '#7b5bff']
  const next = stories[(idx + 1) % stories.length]

  return (
    <div className="relative overflow-hidden">
      {/* 顶部渐变横幅 */}
      <div className="relative" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
        <div className="mx-auto max-w-4xl px-4 py-10 text-center text-white sm:py-14">
          <Link to="/" className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/30">
            <ArrowLeft size={15} /> 返回首页
          </Link>
          <div className="text-5xl">{story.emoji}</div>
          <h1 className="mt-2 text-3xl font-extrabold drop-shadow-sm sm:text-4xl">{story.title}</h1>
          <p className="mx-auto mt-2 max-w-xl text-white/90">{story.tagline}</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* 关键词 */}
        <div className="mb-8 flex flex-wrap justify-center gap-2.5">
          {story.keywords.map((k) => (
            <span key={k} className="rounded-full px-3.5 py-1.5 text-sm font-semibold" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>{k}</span>
          ))}
        </div>

        {/* 各自不同的正文布局 */}
        <StoryBody story={story} />

        {/* 下一篇 */}
        <div className="mt-14 flex justify-center">
          <Link to={`/story/${next.slug}`} className="btn-ghost">下一个：{next.emoji} {next.title} <ArrowRight size={16} /></Link>
        </div>
      </div>
    </div>
  )
}
