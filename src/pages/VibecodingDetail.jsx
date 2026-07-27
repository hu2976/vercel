import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import config from '../config'

export default function VibecodingDetail() {
  const { slug } = useParams()
  const work = (config.works || []).find((w) => w.slug === slug)

  if (!work) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="mb-4 text-2xl font-bold text-body">作品不存在</h1>
        <p className="mb-8 text-soft">你要找的作品不存在或已被移除。</p>
        <Link to="/vibecoding" className="btn-accent"><ArrowLeft size={16} /> 返回 Vibecoding</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link to="/vibecoding" className="inline-flex items-center gap-2 text-sm font-medium text-soft transition-colors hover:text-accent">
          <ArrowLeft size={16} /> 返回 Vibecoding
        </Link>
        <a href={work.file} target="_blank" rel="noopener noreferrer" className="btn-ghost">
          <ExternalLink size={14} /> 新标签页打开
        </a>
      </div>

      <header className="mb-6">
        <h1 className="mb-3 text-2xl font-extrabold text-body sm:text-3xl">{work.title}</h1>
        {work.description && <p className="leading-relaxed text-soft">{work.description}</p>}
      </header>

      <div className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--border)' }}>
        <iframe src={work.file} title={work.title} className="h-[80vh] w-full bg-white" loading="lazy" />
      </div>
    </div>
  )
}
