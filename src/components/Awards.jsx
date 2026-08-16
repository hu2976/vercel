import { useState } from 'react'
import config from '../config'
import ImageFrame from './ImageFrame'

/**
 * 奖项
 *
 * 左边一列条目，鼠标扫到哪条右边就换成哪张图（也能点，键盘 focus 同样触发，
 * 移动端没有 hover 就退回点击）。右边不做框——没有边框也没有底色，
 * 图片直接浮在留白里，换图时上移淡入。容器高度固定，所以横竖图交替也不会让版面上下跳。
 */
export default function Awards() {
  const awards = config.awards || []
  const [active, setActive] = useState(0)
  const current = awards[active]

  const shot = (a) => (
    <ImageFrame
      /* 换条目时重新挂载，好让淡入动画重播。
         前缀不能省 —— 图片和下面的图注是同层级兄弟，
         用同一个 key 会让 React 的 reconciliation 错乱、旧图卸载不掉 */
      key={`shot-${a.text}`}
      src={a.image}
      alt={a.text}
      label="图片待补充"
      className="award-shot"
      placeholderClassName="grid h-52 w-72 place-items-center rounded-lg"
    />
  )

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_0.9fr] md:gap-10">
      <ul className="flex flex-col">
        {awards.map((a, i) => (
          <li key={a.text} className={i > 0 ? 'border-t' : undefined} style={i > 0 ? { borderColor: 'var(--border)' } : undefined}>
            <button
              type="button"
              className="award-item"
              data-on={active === i}
              aria-pressed={active === i}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <span className="award-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="award-text">{a.text}</span>
            </button>

            {/* 窄屏没有 hover，图片就地展开在被点的那条下面 */}
            {active === i && (
              <div className="mb-4 flex justify-center md:hidden">{shot(a)}</div>
            )}
          </li>
        ))}
      </ul>

      {/* 桌面：右侧跟着走的图片位 */}
      <div className="hidden md:block">
        <div className="award-stage">
          {shot(current)}
          <p key={`cap-${current.text}`} className="award-cap">{current.text}</p>
        </div>
      </div>
    </div>
  )
}
