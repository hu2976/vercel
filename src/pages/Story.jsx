import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import config from '../config'
import ImageFrame from '../components/ImageFrame'

const bubbleGradients = {
  spotlight: ['#ff6b9d', '#ffa63d'],
  partner: ['#5b8cff', '#7b5bff'],
  'flavor-lab': ['#2fc39a', '#46d5ff'],
  intern: ['#a06bff', '#ff5ccd'],
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
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <ArrowLeft size={15} /> 返回首页
          </Link>
          <div className="text-6xl">{story.emoji}</div>
          <h1 className="mt-3 text-3xl font-extrabold drop-shadow-sm sm:text-4xl">{story.title}</h1>
          <p className="mx-auto mt-3 max-w-xl text-white/90">{story.tagline}</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* 关键词 */}
        <div className="mb-9 flex flex-wrap justify-center gap-2.5">
          {story.keywords.map((k) => (
            <span
              key={k}
              className="rounded-full px-3.5 py-1.5 text-sm font-semibold"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              {k}
            </span>
          ))}
        </div>

        {/* 封面 */}
        <ImageFrame
          src={story.cover}
          alt={story.title}
          label={`${story.title} · 配图待补充`}
          className="mb-10 aspect-[16/9] w-full rounded-3xl"
          imgClassName="h-full w-full rounded-3xl object-cover"
        />

        {/* 正文 */}
        <article className="mx-auto max-w-2xl">
          {story.paragraphs.map((p, i) => (
            <p key={i} className="mb-5 text-lg leading-loose text-soft">{p}</p>
          ))}
        </article>

        {/* 相册 */}
        {story.gallery && story.gallery.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {story.gallery.map((g, i) => (
              <ImageFrame
                key={i}
                src={g}
                label="配图"
                className="aspect-square w-full rounded-2xl"
                imgClassName="h-full w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        )}

        {/* 下一篇 */}
        <div className="mt-14 flex justify-center">
          <Link to={`/story/${next.slug}`} className="btn-ghost">
            下一个：{next.emoji} {next.title} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
