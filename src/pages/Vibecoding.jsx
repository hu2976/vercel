import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'
import config from '../config'
import ImageFrame from '../components/ImageFrame'

/**
 * Vibecoding
 *
 * 两个 Tab：
 *   造物间 —— 纯粹想做才做的，置顶一件大卡，是这一页的门面
 *   工具箱 —— 为学习和工作造的趁手工具，一件不删，只是不站在最前面；
 *             更早的几件收进折叠区，想翻随时能翻到
 */

const TABS = [
  { key: 'play', label: '造物间', en: 'Playground', blurb: '不为交付，也不为考试。只是想看看它做出来是什么样子。' },
  { key: 'tool', label: '工具箱', en: 'Toolbox', blurb: '为了把手头的事做快一点、做准一点，顺手造的东西。' },
]

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('zh-CN') : '')

// 普通作品卡
function WorkCard({ work, compact = false }) {
  return (
    <Link to={`/vibecoding/${work.slug}`} className="card card-hover group block px-5 py-5 sm:px-6">
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <h3 className={`font-serif-cn text-body transition-colors group-hover:text-accent ${compact ? 'text-base' : 'text-lg'}`}>
          {work.title}
        </h3>
        <span className="shrink-0 text-[0.7rem] tabular-nums text-faint">{fmtDate(work.date)}</span>
      </div>
      {work.description && (
        <p className={`leading-relaxed text-soft ${compact ? 'line-clamp-2 text-[0.82rem]' : 'text-[0.88rem]'}`}>
          {work.description}
        </p>
      )}
      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        {work.tags?.map((t) => <span key={t} className="chip">{t}</span>)}
        <span className="ml-auto inline-flex items-center gap-1 text-[0.8rem] font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
          打开 <ArrowRight size={13} />
        </span>
      </div>
    </Link>
  )
}

export default function Vibecoding() {
  const works = config.works || []
  const [params, setParams] = useSearchParams()
  const active = params.get('t') === 'tool' ? 'tool' : 'play'
  const [openArchive, setOpenArchive] = useState(false)

  const play = works.filter((w) => (w.kind || 'tool') === 'play')
  const tools = works.filter((w) => (w.kind || 'tool') === 'tool')
  const recent = tools.filter((w) => !w.archived)
  const archived = tools.filter((w) => w.archived)

  const featured = play.find((w) => w.featured) || play[0]
  const restPlay = play.filter((w) => w !== featured)
  const tab = TABS.find((t) => t.key === active)

  const switchTab = (key) => {
    const next = new URLSearchParams(params)
    if (key === 'play') next.delete('t')
    else next.set('t', key)
    setParams(next, { replace: true })
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:py-16">
      <header className="mb-10">
        <span className="eyebrow">Made with code</span>
        <h1 className="sec-title mt-3 text-[2rem] sm:text-[2.4rem]">Vibecoding</h1>
      </header>

      {/* Tab */}
      <div className="mb-8 flex items-center gap-8 border-b" style={{ borderColor: 'var(--border)' }}>
        {TABS.map((t) => {
          const n = t.key === 'play' ? play.length : tools.length
          return (
            <button key={t.key} onClick={() => switchTab(t.key)} className="tab-btn" data-active={active === t.key}>
              {t.label}
              <span className="tab-count">{n}</span>
            </button>
          )
        })}
      </div>

      <p className="mb-10 text-[0.86rem] leading-relaxed text-faint">{tab.blurb}</p>

      {/* ===== 造物间 ===== */}
      {active === 'play' && (
        <div className="space-y-10">
          {featured ? (
            <>
              <Link to={`/vibecoding/${featured.slug}`} className="hero-work group">
                <ImageFrame
                  src={featured.cover}
                  alt={featured.title}
                  label="预览图待补充"
                  className="block w-full"
                  imgClassName="hero-work-shot"
                  placeholderClassName="aspect-[16/9]"
                />
                <div className="px-6 py-6 sm:px-8 sm:py-7">
                  <div className="mb-2.5 flex items-baseline justify-between gap-4">
                    <h2 className="font-serif-cn text-2xl text-body transition-colors group-hover:text-accent">
                      {featured.title}
                    </h2>
                    <span className="shrink-0 text-[0.7rem] tabular-nums text-faint">{fmtDate(featured.date)}</span>
                  </div>
                  {featured.oneLiner && <p className="mb-4 text-[0.95rem] text-soft">{featured.oneLiner}</p>}
                  {featured.description && (
                    <p className="text-[0.86rem] leading-[1.85] text-soft">{featured.description}</p>
                  )}
                  {featured.note && (
                    <p className="mt-4 border-l-2 pl-3 text-[0.8rem] leading-relaxed text-faint" style={{ borderColor: 'var(--i2)' }}>
                      {featured.note}
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {featured.tags?.map((t) => <span key={t} className="chip">{t}</span>)}
                    <span className="link-underline ml-auto text-[0.85rem]">
                      走进地图 <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>

              {restPlay.length > 0 && (
                <div className="space-y-4">
                  {restPlay.map((w) => <WorkCard key={w.slug} work={w} />)}
                </div>
              )}

              <p className="pt-2 text-center text-xs leading-relaxed text-faint">
                还在造下一个。想到什么好玩的就会出现在这里。
              </p>
            </>
          ) : (
            <div className="card px-10 py-14 text-center text-sm text-faint">还在造，很快就有。</div>
          )}
        </div>
      )}

      {/* ===== 工具箱 ===== */}
      {active === 'tool' && (
        <div className="space-y-4">
          {recent.map((w) => <WorkCard key={w.slug} work={w} />)}

          {archived.length > 0 && (
            <div className="pt-6">
              <button onClick={() => setOpenArchive((v) => !v)} className="archive-toggle">
                <ChevronRight size={14} className="archive-chevron" data-open={openArchive} />
                更早的练习（{archived.length}）
              </button>

              {openArchive && (
                <div className="archive-body mt-4 space-y-3">
                  {archived.map((w, i) => (
                    <div key={w.slug} style={{ animationDelay: `${i * 60}ms` }}>
                      <WorkCard work={w} compact />
                    </div>
                  ))}
                  <p className="pt-2 text-center text-xs text-faint">刚开始学着造东西时的作业，留个记录。</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
