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

// 大小不一的宽高比 + 轻微旋转，营造错落灵动感
const aspects = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[4/3]', 'aspect-[5/6]', 'aspect-square', 'aspect-[3/4]', 'aspect-[5/4]']
const rotSeq = [-4, 3, -3, 4, -2, 3, -5, 2, -3]
const range = (a, b) => Array.from({ length: Math.max(0, b - a) }, (_, i) => a + i)
const img = (story, i) => (story.gallery && story.gallery[i]) || null

// 瀑布流拼贴墙：数量自适应、尺寸错落、旋转+漂浮
function Collage({ story, indices, className = '' }) {
  return (
    <div className={className} style={{ columnGap: '0.75rem' }}>
      {indices.map((idx, k) => (
        <div key={idx} className="mb-3 break-inside-avoid">
          <div className="floaty" style={{ animationDuration: `${5.2 + (k % 4) * 0.6}s`, animationDelay: `${(k % 3) * 0.35}s` }}>
            <div style={{ transform: `rotate(${rotSeq[k % rotSeq.length]}deg)` }}>
              <ImageFrame
                src={img(story, idx)}
                label=""
                className="block w-full overflow-hidden rounded-xl shadow-lg"
                imgClassName="block h-auto w-full rounded-xl"
                placeholderClassName={aspects[k % aspects.length]}
              />
            </div>
          </div>
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

const galLen = (s) => s.gallery?.length || 0

/* 布局 A —— 聚光灯：文字居中，拼贴图片分列两侧（四周环绕） */
function LayoutCentered({ story }) {
  const total = Math.max(8, galLen(story))
  const h = Math.ceil(total / 2)
  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.55fr_0.85fr] lg:items-start">
      <Collage story={story} indices={range(0, h)} className="columns-2 lg:columns-1" />
      <Paragraphs paragraphs={story.paragraphs} className="mx-auto max-w-xl lg:pt-8" />
      <Collage story={story} indices={range(h, total)} className="columns-2 lg:columns-1" />
    </div>
  )
}

/* 布局 B/C —— 一侧整块文字，一侧瀑布流拼贴 */
function LayoutSide({ story, imagesLeft = false }) {
  const total = Math.max(7, galLen(story))
  const text = <Paragraphs paragraphs={story.paragraphs} className="lg:pt-4" />
  const wall = <Collage story={story} indices={range(0, total)} className="columns-2 sm:columns-3 lg:columns-2" />
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
      {imagesLeft ? <>{wall}{text}</> : <>{text}{wall}</>}
    </div>
  )
}

/* 布局 D —— 职场练习生：文字整块居中，拼贴图片在上、下方 */
function LayoutTopBottom({ story }) {
  const total = Math.max(8, galLen(story))
  const h = Math.ceil(total / 2)
  return (
    <div className="mx-auto max-w-4xl">
      <Collage story={story} indices={range(0, h)} className="mb-10 columns-3 sm:columns-4" />
      <Paragraphs paragraphs={story.paragraphs} className="mx-auto max-w-2xl" />
      <Collage story={story} indices={range(h, total)} className="mt-10 columns-3 sm:columns-4" />
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
