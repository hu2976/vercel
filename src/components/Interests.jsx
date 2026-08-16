import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import config from '../config'
import { hobbyGlyphs } from './Glyphs'
import ImageFrame from './ImageFrame'

/**
 * 「我喜欢的」
 *
 * 八张卡，图标是各自的炫彩线稿，鼠标停上去各动各的：书翻页、胶片走带、
 * 咖啡冒气、颜料点亮、花瓣开合、幕布拉开、声波扩散、光圈旋转。
 * 卡片本身保持素白／素黑，颜色只在描边和图标上出现。
 *
 * 八格之后接住「咖啡」那一格，把咖啡地图引出来 —— 作品是从爱好里长出来的，
 * 不是硬塞进主页的一块广告。
 */
export default function Interests() {
  const items = config.interests || []
  const featured = (config.works || []).find((w) => w.featured)

  return (
    <section className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
      <div className="mb-3 flex justify-center">
        <span className="eyebrow">Off the clock</span>
      </div>
      <h2 className="sec-title mb-3 text-center">我喜欢的</h2>
      <p className="mx-auto mb-14 max-w-md text-center text-sm leading-relaxed text-faint">
        专业之外，这些东西占据了我剩下的时间
      </p>

      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-4">
        {items.map((it, i) => {
          const Glyph = hobbyGlyphs[it.key]
          return (
            <div
              key={it.key}
              className="hobby"
              style={{
                '--hc1': it.c1,
                '--hc2': it.c2,
                // 上下错开一点，避免八格排成一张规整的表格
                marginTop: `${[0, 16, 0, 16][i % 4]}px`,
              }}
            >
              <span className="mb-0.5">{Glyph && <Glyph size={27} />}</span>
              <span className="hobby-name">{it.name}</span>
              <span className="hobby-note">{it.note}</span>
            </div>
          )
        })}
      </div>

      {/* 从「咖啡」延伸到那张地图 */}
      {featured && (
        <div className="mt-20">
          <p className="mb-6 text-center text-sm text-faint">
            其中<span className="mx-1 font-semibold text-body">「咖啡」</span>这一格，我把它做成了一整张地图
          </p>

          <Link
            to={`/vibecoding/${featured.slug}`}
            className="card card-hover group grid overflow-hidden md:grid-cols-[1.05fr_1fr]"
          >
            <div className="relative overflow-hidden">
              <ImageFrame
                src={featured.cover}
                alt={featured.title}
                label="地图预览图待补充"
                className="block h-full w-full"
                imgClassName="block h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                placeholderClassName="aspect-[16/10]"
              />
            </div>

            <div className="flex flex-col justify-center gap-3 px-6 py-7 sm:px-8 sm:py-9">
              <span className="eyebrow">Playground · 01</span>
              <h3 className="font-serif-cn text-2xl leading-snug text-body">{featured.title}</h3>
              <p className="text-sm leading-relaxed text-soft">{featured.oneLiner}</p>
              {featured.note && (
                <p className="border-l-2 pl-3 text-xs leading-relaxed text-faint" style={{ borderColor: 'var(--i2)' }}>
                  {featured.note}
                </p>
              )}
              <span className="link-underline mt-1 self-start text-sm">
                走进地图 <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      )}
    </section>
  )
}
