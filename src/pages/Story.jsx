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

const rotSeq = [-5, 4, -3, 5, -4, 3, -6, 4, -4]

// 取第 i 张配图（没有则占位）
const img = (story, i) => (story.gallery && story.gallery[i]) || null

// 小图：外层漂浮（translateY），内层轻微旋转，互不冲突
function Thumb({ src, i = 0, aspect = 'aspect-square' }) {
  return (
    <div className="floaty inline-block w-full" style={{ animationDuration: `${5.4 + (i % 4) * 0.5}s`, animationDelay: `${(i % 3) * 0.3}s` }}>
      <div style={{ transform: `rotate(${rotSeq[i % rotSeq.length]}deg)` }}>
        <ImageFrame
          src={src}
          label=""
          className={`${aspect} w-full overflow-hidden rounded-xl shadow-lg`}
          imgClassName="h-full w-full rounded-xl object-cover"
        />
      </div>
    </div>
  )
}

// 小图网格（默认渲染至少 6 张，gallery 更多则全展示）
function PhotoGrid({ story, cols = 'grid-cols-2', min = 6, start = 0 }) {
  const total = Math.max(min, (story.gallery?.length || 0) - start)
  return (
    <div className={`grid ${cols} gap-3`}>
      {Array.from({ length: total }).map((_, k) => (
        <Thumb key={k} src={img(story, start + k)} i={start + k} />
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

/* 布局 A —— 聚光灯：文字居中，两侧各 3 张小图 */
function LayoutCentered({ story }) {
  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.7fr_0.72fr] lg:items-center">
        <div className="hidden flex-col gap-4 lg:flex">
          {[0, 1, 2].map((i) => <Thumb key={i} src={img(story, i)} i={i} />)}
        </div>
        <Paragraphs paragraphs={story.paragraphs} className="mx-auto max-w-xl" />
        <div className="hidden flex-col gap-4 lg:flex">
          {[3, 4, 5].map((i) => <Thumb key={i} src={img(story, i)} i={i} />)}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-3 lg:hidden">
        {[0, 1, 2, 3, 4, 5].map((i) => <Thumb key={i} src={img(story, i)} i={i} />)}
      </div>
    </>
  )
}

/* 布局 B/C —— 一侧整块文字，一侧 6+ 张小图网格 */
function LayoutSide({ story, imagesLeft = false }) {
  const text = <Paragraphs paragraphs={story.paragraphs} />
  const grid = <PhotoGrid story={story} cols="grid-cols-3" min={6} />
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
      {imagesLeft ? <>{grid}{text}</> : <>{text}{grid}</>}
    </div>
  )
}

/* 布局 D —— 职场练习生：文字整块居中，图片在上、下方 */
function LayoutTopBottom({ story }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mx-auto mb-8 grid max-w-xl grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => <Thumb key={i} src={img(story, i)} i={i} aspect="aspect-[4/3]" />)}
      </div>
      <Paragraphs paragraphs={story.paragraphs} className="mx-auto max-w-2xl" />
      <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-3">
        {[3, 4, 5].map((i) => <Thumb key={i} src={img(story, i)} i={i} aspect="aspect-[4/3]" />)}
      </div>
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
        <div className="mx-auto max-w-4xl px-4 py-12 text-center text-white sm:py-16">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/30">
            <ArrowLeft size={15} /> 返回首页
          </Link>
          <div className="text-6xl">{story.emoji}</div>
          <h1 className="mt-3 text-3xl font-extrabold drop-shadow-sm sm:text-4xl">{story.title}</h1>
          <p className="mx-auto mt-3 max-w-xl text-white/90">{story.tagline}</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* 关键词 */}
        <div className="mb-10 flex flex-wrap justify-center gap-2.5">
          {story.keywords.map((k) => (
            <span key={k} className="rounded-full px-3.5 py-1.5 text-sm font-semibold" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>{k}</span>
          ))}
        </div>

        {/* 各自不同的正文布局 */}
        <StoryBody story={story} />

        {/* 下一篇 */}
        <div className="mt-16 flex justify-center">
          <Link to={`/story/${next.slug}`} className="btn-ghost">下一个：{next.emoji} {next.title} <ArrowRight size={16} /></Link>
        </div>
      </div>
    </div>
  )
}
