import { useParams, Link } from 'react-router-dom'
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

// 按宽高比把图片平衡分配到 cols 列（每张放进当前最矮的一列 → 列底对齐）
function distribute(items, cols) {
  const columns = Array.from({ length: cols }, () => ({ items: [], h: 0 }))
  for (const it of items) {
    let m = 0
    for (let i = 1; i < cols; i++) if (columns[i].h < columns[m].h) m = i
    columns[m].items.push(it)
    columns[m].h += it.ar + 0.06 // 0.06 ≈ gap 归一化
  }
  return columns
}

// 平衡瀑布流：图片按原始比例完整显示（不裁切），列底对齐
function Collage({ items, cols = 2, className = '' }) {
  const columns = distribute(items, cols)
  return (
    <div className={`flex gap-3 ${className}`}>
      {columns.map((col, ci) => (
        <div key={ci} className="flex flex-1 flex-col gap-3">
          {col.items.map((it, k) => (
            <div key={k} className="group overflow-hidden rounded-xl shadow-md">
              <ImageFrame
                src={it.src}
                label=""
                className="block w-full transition-transform duration-500 group-hover:scale-[1.03]"
                imgClassName="block h-auto w-full"
                placeholderClassName="aspect-[3/4]"
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

/* 布局 A —— 聚光灯：文字居中 + 下方平衡瀑布流画廊 */
function LayoutCentered({ story }) {
  return (
    <div className="mx-auto max-w-4xl">
      <Paragraphs paragraphs={story.paragraphs} className="mx-auto mb-10 max-w-2xl text-center" />
      <Collage items={gallery(story)} cols={3} />
    </div>
  )
}

/* 布局 B/C —— 一侧文字，一侧平衡瀑布流照片墙 */
function LayoutSide({ story, imagesLeft = false }) {
  const text = <Paragraphs paragraphs={story.paragraphs} className="lg:pt-2" />
  const wall = <Collage items={gallery(story)} cols={2} />
  return (
    <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
      {imagesLeft ? <>{wall}{text}</> : <>{text}{wall}</>}
    </div>
  )
}

/* 布局 D —— 职场练习生：上方照片墙 + 文字 + 下方照片墙 */
function LayoutTopBottom({ story }) {
  const items = gallery(story)
  const h = Math.ceil(items.length / 2)
  return (
    <div className="mx-auto max-w-4xl">
      <Collage items={items.slice(0, h)} cols={3} className="mb-10" />
      <Paragraphs paragraphs={story.paragraphs} className="mx-auto max-w-2xl" />
      <Collage items={items.slice(h)} cols={3} className="mt-10" />
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
