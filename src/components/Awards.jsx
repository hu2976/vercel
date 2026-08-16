import { useState } from 'react'
import config from '../config'
import ImageFrame from './ImageFrame'

/**
 * 奖项
 *
 * 左边一列可点的条目，右边跟着换图。桌面上图片是 sticky 的，
 * 顺着列表往下点，图不会跑出视野；窄屏放不下两栏，就把图挪到
 * 被点那一条的正下方展开。图片还没到位时显示占位框，不影响先上线。
 */
export default function Awards() {
  const awards = config.awards || []
  const [active, setActive] = useState(0)
  const current = awards[active]

  // 固定 4:3 的框 + object-contain：竖版奖状和横版合影都能完整显示，
  // 而且换条目时版面高度不会跳
  const shot = (a) => (
    <div key={a.text} className="award-shot aspect-[4/3] w-full">
      <ImageFrame
        src={a.image}
        alt={a.text}
        label="图片待补充"
        className="block h-full w-full"
        imgClassName="block h-full w-full object-contain"
        placeholderClassName="h-full w-full"
      />
    </div>
  )

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_0.82fr] md:gap-10">
      <ul className="flex flex-col">
        {awards.map((a, i) => (
          <li key={a.text} className={i > 0 ? 'border-t' : undefined} style={i > 0 ? { borderColor: 'var(--border)' } : undefined}>
            <button
              type="button"
              className="award-item"
              data-on={active === i}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            >
              <span className="award-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="award-text">{a.text}</span>
            </button>

            {/* 窄屏：图片就地展开在这一条下面 */}
            {active === i && (
              <div className="mb-3 overflow-hidden rounded-lg border md:hidden" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
                {shot(a)}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* 桌面：右侧固定的图片位 */}
      <div className="hidden md:block">
        <div className="award-stage">
          {shot(current)}
          <p className="px-4 py-3 text-xs leading-relaxed text-faint">{current.text}</p>
        </div>
      </div>
    </div>
  )
}
