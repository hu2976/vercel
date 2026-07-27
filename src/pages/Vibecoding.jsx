import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Tag as TagIcon, Code2 } from 'lucide-react'
import config from '../config'

export default function Vibecoding() {
  const works = config.works || []

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:py-16">
      <div className="mb-12 text-center">
        <div className="mb-3 flex items-center justify-center gap-3">
          <Code2 size={28} className="text-accent" />
          <h1 className="text-3xl font-extrabold text-body sm:text-4xl">Vibecoding</h1>
        </div>
        <p className="text-soft">用代码和 AI 一起做出来的一些有趣东西</p>
      </div>

      {works.length === 0 ? (
        <div className="card px-12 py-12 text-center text-soft">暂无作品，敬请期待！</div>
      ) : (
        <div className="space-y-6">
          {works.map((work) => (
            <Link
              key={work.slug}
              to={`/vibecoding/${work.slug}`}
              className="card card-hover group block px-6 py-6"
            >
              <h2 className="mb-3 text-xl font-bold text-body transition-colors group-hover:text-accent">
                {work.title}
              </h2>
              {work.description && (
                <p className="mb-4 leading-relaxed text-soft">{work.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-faint">
                {work.date && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(work.date).toLocaleDateString('zh-CN')}
                  </span>
                )}
                {work.tags?.length > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <TagIcon size={14} />
                    {work.tags.join(' · ')}
                  </span>
                )}
                <span className="ml-auto inline-flex items-center gap-1 font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  查看 <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
