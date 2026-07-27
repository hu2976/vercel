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

// 散落图片：外层漂浮（translateY），内层旋转，互不冲突
function StoryImg({ src, label, rotate = 0, dur = 6, className = '', aspect = 'aspect-[4/5]' }) {
  return (
    <div className="floaty inline-block w-full" style={{ animationDuration: `${dur}s` }}>
      <div style={{ transform: `rotate(${rotate}deg)` }}>
        <ImageFrame
          src={src}
          label={label}
          className={`w-full overflow-hidden rounded-2xl shadow-xl ${aspect} ${className}`}
          imgClassName="h-full w-full rounded-2xl object-cover"
        />
      </div>
    </div>
  )
}

// 取第 i 张配图（没有则占位）
const img = (story, i) => (story.gallery && story.gallery[i]) || null

function Paragraphs({ paragraphs, className = '' }) {
  return (
    <div className={className}>
      {paragraphs.map((p, i) => (
        <p key={i} className="mb-5 text-[1.02rem] leading-loose text-soft last:mb-0">{p}</p>
      ))}
    </div>
  )
}

/* ---------- 布局 A：文章居中，图片四周散落 ---------- */
function LayoutCentered({ story }) {
  const L = story.title
  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.7fr_0.85fr] lg:items-center">
        <div className="hidden flex-col gap-10 lg:flex">
          <StoryImg src={img(story, 0)} label={L} rotate={-6} dur={6.4} />
          <StoryImg src={img(story, 1)} label={L} rotate={5} dur={7.1} aspect="aspect-square" />
        </div>
        <Paragraphs paragraphs={story.paragraphs} className="mx-auto max-w-xl" />
        <div className="hidden flex-col gap-10 lg:flex">
          <StoryImg src={img(story, 2)} label={L} rotate={6} dur={6.8} aspect="aspect-square" />
          <StoryImg src={img(story, 3)} label={L} rotate={-5} dur={5.9} />
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:hidden">
        {[0, 1, 2, 3].map((i) => <StoryImg key={i} src={img(story, i)} label={L} aspect="aspect-square" />)}
      </div>
    </>
  )
}

/* ---------- 布局 B / C：一侧文字，一侧散落图片 ---------- */
function LayoutSide({ story, imagesLeft = false }) {
  const L = story.title
  const cluster = (
    <div className="flex flex-col gap-8">
      <div className="w-[78%]" style={{ transform: 'translateX(4%)' }}><StoryImg src={img(story, 0)} label={L} rotate={-5} dur={6.5} /></div>
      <div className="w-[70%] self-end" style={{ transform: 'translateX(-6%)' }}><StoryImg src={img(story, 1)} label={L} rotate={6} dur={7.2} aspect="aspect-square" /></div>
      <div className="w-[64%]" style={{ transform: 'translateX(18%)' }}><StoryImg src={img(story, 2)} label={L} rotate={-4} dur={6.0} aspect="aspect-[5/4]" /></div>
    </div>
  )
  const text = <Paragraphs paragraphs={story.paragraphs} />
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      {imagesLeft ? <>{cluster}{text}</> : <>{text}{cluster}</>}
    </div>
  )
}

/* ---------- 布局 D：图文交替 zigzag ---------- */
function LayoutZigzag({ story }) {
  const L = story.title
  return (
    <div className="flex flex-col gap-14">
      {story.paragraphs.map((p, i) => {
        const image = <div className="w-full lg:w-[46%]"><StoryImg src={img(story, i)} label={L} rotate={i % 2 ? 4 : -4} dur={6 + i * 0.4} aspect="aspect-[5/4]" /></div>
        const text = <p className="text-[1.02rem] leading-loose text-soft lg:w-[54%]">{p}</p>
        return (
          <div key={i} className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
            {i % 2 === 0 ? <>{text}{image}</> : <>{image}{text}</>}
          </div>
        )
      })}
    </div>
  )
}

function StoryBody({ story }) {
  switch (story.slug) {
    case 'spotlight': return <LayoutCentered story={story} />
    case 'partner': return <LayoutSide story={story} imagesLeft={false} />
    case 'flavor-lab': return <LayoutSide story={story} imagesLeft={true} />
    case 'intern': return <LayoutZigzag story={story} />
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
        <div className="mx-auto max-w-4xl px-4 py-14 text-center text-white sm:py-20">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/30">
            <ArrowLeft size={15} /> 返回首页
          </Link>
          <div className="text-6xl">{story.emoji}</div>
          <h1 className="mt-3 text-3xl font-extrabold drop-shadow-sm sm:text-4xl">{story.title}</h1>
          <p className="mx-auto mt-3 max-w-xl text-white/90">{story.tagline}</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-14">
        {/* 关键词 */}
        <div className="mb-12 flex flex-wrap justify-center gap-2.5">
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
