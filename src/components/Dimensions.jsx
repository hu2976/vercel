import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import config from '../config'
import { storyGlyphs } from './Glyphs'

/**
 * 四个维度的我
 *
 * 原来是四个糖果玻璃球，跟页面其余部分（宋体、细线、留白）完全不是一套。
 * 改成 2×2 的杂志式版面：编号 + 宋体标题 + 一句话 + 关键词，
 * 那枚炫彩线稿图标放大到 150px 压在右下角、越出边界被裁掉，只当版面装饰，
 * 不再当主角。信息也不藏了 —— 简介和关键词直接可见，不用悬停才出来。
 */

const TONES = {
  spotlight: { c1: '#ff4d8d', c2: '#ff9e44' },
  partner: { c1: '#3ab7f0', c2: '#5b6bff' },
  'flavor-lab': { c1: '#06d6a0', c2: '#3ab7f0' },
  intern: { c1: '#9b5de5', c2: '#ff4d8d' },
}

export default function Dimensions() {
  const stories = config.stories || []

  return (
    <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
      {stories.map((s, i) => {
        const Glyph = storyGlyphs[s.slug]
        const t = TONES[s.slug] || { c1: '#5b6bff', c2: '#9b5de5' }
        return (
          <Link
            key={s.slug}
            to={`/story/${s.slug}`}
            className="dim group"
            style={{ '--hc1': t.c1, '--hc2': t.c2 }}
          >
            {/* 压在右下角、越出卡片被裁掉的大图标 */}
            <span className="dim-glyph" aria-hidden="true">
              {Glyph && <Glyph size={150} sw={1} />}
            </span>

            <span className="dim-index">{String(i + 1).padStart(2, '0')}</span>

            <h3 className="dim-title">{s.title}</h3>
            <p className="dim-tagline">{s.tagline}</p>

            <span className="dim-keys">
              {s.keywords?.slice(0, 3).map((k) => (
                <span key={k} className="dim-key">{k}</span>
              ))}
            </span>

            <span className="dim-more">
              读这段故事 <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        )
      })}
    </div>
  )
}
