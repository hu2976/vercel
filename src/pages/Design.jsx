import { Palette } from 'lucide-react'
import config from '../config'
import ImageFrame from '../components/ImageFrame'

export default function Design() {
  const designs = config.designs || []

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:py-16">
      <div className="mb-12 text-center">
        <div className="mb-3 flex items-center justify-center gap-3">
          <Palette size={28} className="text-accent" />
          <h1 className="text-3xl font-extrabold text-body sm:text-4xl">Design 设计作品</h1>
        </div>
        <p className="text-soft">海报、视觉、美工设计的一些小尝试</p>
      </div>

      {/* 瀑布流：海报按原始比例完整展示 */}
      <div className="columns-1 sm:columns-2 lg:columns-3" style={{ columnGap: '1.25rem' }}>
        {designs.map((d, i) => (
          <div key={i} className="mb-5 break-inside-avoid">
            <div className="card card-hover group overflow-hidden">
              <ImageFrame
                src={d.image}
                alt={d.title}
                label="设计作品待补充"
                className="block w-full overflow-hidden transition-transform duration-500 group-hover:scale-[1.03]"
                imgClassName="block h-auto w-full"
                placeholderClassName="aspect-[3/4]"
              />
              <div className="px-5 py-4">
                <h3 className="font-bold text-body">{d.title}</h3>
                {d.description && <p className="mt-1 text-sm text-soft">{d.description}</p>}
                {d.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {d.tags.map((t) => (
                      <span key={t} className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
