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

const range = (a, b) => Array.from({ length: Math.max(0, b - a) }, (_, i) => a + i)
const img = (story, i) => (story.gallery && story.gallery[i]) || null

// bento 拼图的大小模式（列跨度, 行跨度）——循环使用，制造大小不一
const bentoSpans = [[2, 2], [1, 1], [1, 1], [1, 2], [2, 1], [1, 1], [1, 1], [2, 1], [1, 1]]

// 有边界的 bento 拼图墙：大小不一但总高度可控，能塞进一屏
function Bento({ story, indices, cols = 3, rowH = 116, className = '' }) {
  return (
    <div
      className={className}
      style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gridAutoRows: `${rowH}px`, gridAutoFlow: 'dense', gap: '0.6rem' }}
    >
      {indices.map((idx, k) => {
        const [c, r] = bentoSpans[k % bentoSpans.length]
        return (
          <div
            key={idx}
            className="group overflow-hidden rounded-xl shadow-md"
            style={{ gridColumn: `span ${Math.min(c, cols)}`, gridRow: `span ${r}` }}
          >
            <ImageFrame
              src={img(story, idx)}
              label=""
              className="h-full w-full transition-transform duration-500 group-hover:scale-105"
              imgClassName="h-full w-full object-cover"
            />
          </div>
        )
      })}
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

const galLen = (s) => s.gallery?.length || 0

/* 布局 A —— 聚光灯：文字居中 + 下方整片 bento 画廊 */
function LayoutCentered({ story }) {
  const n = Math.min(Math.max(8, galLen(story)), 9)
  return (
    <div className="mx-auto max-w-4xl">
      <Paragraphs paragraphs={story.paragraphs} className="mx-auto mb-10 max-w-2xl text-center" />
      <Bento story={story} indices={range(0, n)} cols={4} rowH={120} />
    </div>
  )
}

/* 布局 B/C —— 一侧文字，一侧 bento（两者等高，同屏协调） */
function LayoutSide({ story, imagesLeft = false }) {
  const n = Math.min(Math.max(6, galLen(story)), 7)
  const text = <Paragraphs paragraphs={story.paragraphs} />
  const wall = <Bento story={story} indices={range(0, n)} cols={3} rowH={118} />
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      {imagesLeft ? <>{wall}{text}</> : <>{text}{wall}</>}
    </div>
  )
}

/* 布局 D —— 职场练习生：上方 bento + 文字 + 下方 bento（≥6 张） */
function LayoutTopBottom({ story }) {
  const n = Math.min(Math.max(8, galLen(story)), 8)
  const h = Math.ceil(n / 2)
  return (
    <div className="mx-auto max-w-4xl">
      <Bento story={story} indices={range(0, h)} cols={4} rowH={108} className="mb-9" />
      <Paragraphs paragraphs={story.paragraphs} className="mx-auto max-w-2xl" />
      <Bento story={story} indices={range(h, n)} cols={4} rowH={108} className="mt-9" />
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
