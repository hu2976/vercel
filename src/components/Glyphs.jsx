/**
 * 炫彩线稿图标集
 *
 * 全站图标统一用 stroke="url(#g-xxx)" 引用下面 IriDefs 注入的渐变，
 * 于是「白底 / 黑底 + 炫彩图标」这件事只由图标承担，背景可以一直保持干净。
 * 每个图标里带 an-* 类名的元素，由 index.css 在父卡片 hover 时驱动动画。
 */

// 一次性注入全站渐变定义（挂在 Layout 里，整个文档只有一份）
export function IriDefs() {
  const ramps = [
    ['g-iri', ['#ff4d8d', '#ff9e44', '#3ab7f0']],
    ['g-book', ['#5b6bff', '#9b5de5']],
    ['g-film', ['#9b5de5', '#ff4d8d']],
    ['g-coffee', ['#ff9e44', '#f2c14e']],
    ['g-paint', ['#ff4d8d', '#ff9e44', '#f2c14e']],
    ['g-flower', ['#ff4d8d', '#ff8fc0']],
    ['g-drama', ['#d6355b', '#f2c14e']],
    ['g-mic', ['#06d6a0', '#3ab7f0']],
    ['g-doc', ['#3ab7f0', '#5b6bff']],
    ['g-plane', ['#ff4d8d', '#ff9e44', '#3ab7f0']],
    ['g-spotlight', ['#ff4d8d', '#ff9e44']],
    ['g-rocket', ['#3ab7f0', '#5b6bff']],
    ['g-flask', ['#06d6a0', '#3ab7f0']],
    ['g-case', ['#9b5de5', '#ff4d8d']],
  ]
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <defs>
        {ramps.map(([id, stops]) => (
          <linearGradient key={id} id={id} x1="0" y1="0" x2="1" y2="1">
            {stops.map((c, i) => (
              <stop key={c + i} offset={`${(i / (stops.length - 1)) * 100}%`} stopColor={c} />
            ))}
          </linearGradient>
        ))}
      </defs>
    </svg>
  )
}

// 所有图标共用的外壳
function Glyph({ id, size = 26, sw = 1.5, children, className = '' }) {
  return (
    <svg
      className={`iri-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke={`url(#${id})`}
      strokeWidth={sw}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

/* ---------------- 八个爱好 ---------------- */

export const BookGlyph = (p) => (
  <Glyph id="g-book" {...p}>
    <path d="M11.4 6.1C8.9 4.5 6.1 4.3 3.4 5.2v12.6c2.7-.9 5.5-.7 8 .9" />
    <path className="an-page" d="M12.6 6.1c2.5-1.6 5.3-1.8 8-.9v12.6c-2.7-.9-5.5-.7-8 .9" />
    <path d="M12 6.4v12.3" />
  </Glyph>
)

export const FilmGlyph = (p) => (
  <Glyph id="g-film" {...p}>
    <rect x="2.6" y="4.6" width="18.8" height="14.8" rx="2.2" />
    <path d="M2.6 8.6h18.8M2.6 15.4h18.8" />
    <g className="an-perf">
      <path d="M5.2 6.6v0M8.4 6.6v0M11.6 6.6v0M14.8 6.6v0M18 6.6v0" strokeWidth="1.8" />
      <path d="M5.2 17.4v0M8.4 17.4v0M11.6 17.4v0M14.8 17.4v0M18 17.4v0" strokeWidth="1.8" />
    </g>
    <path d="M10.4 9.9l4 2.1-4 2.1z" />
  </Glyph>
)

export const CoffeeGlyph = (p) => (
  <Glyph id="g-coffee" {...p}>
    <path className="an-steam" d="M7.6 5.9c0-1.1 1-1.4 1-2.6" />
    <path className="an-steam-2" d="M11 5.9c0-1.1 1-1.4 1-2.6" />
    <path className="an-steam-3" d="M14.4 5.9c0-1.1 1-1.4 1-2.6" />
    <path d="M4.2 9.2h12.4v4.9a4.5 4.5 0 0 1-4.5 4.5H8.7a4.5 4.5 0 0 1-4.5-4.5z" />
    <path d="M16.6 10.6h1.5a2.4 2.4 0 0 1 0 4.8h-1.5" />
    <path d="M2.8 21.2h15.6" />
  </Glyph>
)

export const PaintGlyph = (p) => (
  <Glyph id="g-paint" {...p}>
    <path d="M12 3.2a8.8 8.8 0 0 0 0 17.6c1 0 1.7-.7 1.7-1.6 0-.4-.16-.78-.42-1.05a1.5 1.5 0 0 1 1.08-2.55h1.72A4.94 4.94 0 0 0 21 10.7c0-4.14-4.03-7.5-9-7.5z" />
    <circle className="an-dab" cx="7.6" cy="11.4" r="1.15" fill="#ff4d8d" stroke="none" />
    <circle className="an-dab an-dab-2" cx="9.9" cy="7.6" r="1.15" fill="#f2c14e" stroke="none" />
    <circle className="an-dab an-dab-3" cx="14.4" cy="7.9" r="1.15" fill="#3ab7f0" stroke="none" />
  </Glyph>
)

export const FlowerGlyph = (p) => (
  <Glyph id="g-flower" {...p}>
    <g className="an-petal">
      <ellipse cx="12" cy="4.9" rx="1.85" ry="2.7" />
      <ellipse cx="12" cy="4.9" rx="1.85" ry="2.7" transform="rotate(72 12 8.6)" />
      <ellipse cx="12" cy="4.9" rx="1.85" ry="2.7" transform="rotate(144 12 8.6)" />
      <ellipse cx="12" cy="4.9" rx="1.85" ry="2.7" transform="rotate(216 12 8.6)" />
      <ellipse cx="12" cy="4.9" rx="1.85" ry="2.7" transform="rotate(288 12 8.6)" />
    </g>
    <circle cx="12" cy="8.6" r="1.5" />
    <path d="M12 11.6v9.6" />
    <path d="M12 16.4c-2.5 0-3.8-1.5-3.8-3.2 2.5 0 3.8 1.5 3.8 3.2z" />
  </Glyph>
)

export const DramaGlyph = (p) => (
  <Glyph id="g-drama" {...p}>
    <path d="M2.4 4.1h19.2" />
    <path className="an-curtain-l" d="M4.6 4.4v12.4c2.5 0 4-1.5 4-3.6V4.4z" />
    <path className="an-curtain-r" d="M19.4 4.4v12.4c-2.5 0-4-1.5-4-3.6V4.4z" />
    <path d="M12 9.6l.95 1.95 2.15.31-1.55 1.52.37 2.14L12 14.51l-1.92 1.01.37-2.14-1.55-1.52 2.15-.31z" />
    <path d="M8.4 20.4h7.2" />
  </Glyph>
)

export const MicGlyph = (p) => (
  <Glyph id="g-mic" {...p}>
    <rect x="9.4" y="2.4" width="5.2" height="10.2" rx="2.6" />
    <path d="M5.9 11.1a6.1 6.1 0 0 0 12.2 0" />
    <path d="M12 17.2v3.1M9.1 20.6h5.8" />
    <path className="an-wave" d="M4.1 8.3a8.4 8.4 0 0 0 0 4.6" />
    <path className="an-wave an-wave-2" d="M19.9 8.3a8.4 8.4 0 0 1 0 4.6" />
  </Glyph>
)

export const DocGlyph = (p) => (
  <Glyph id="g-doc" {...p}>
    <circle cx="12" cy="12" r="8.9" />
    <g className="an-iris">
      <path d="M12 3.1l4.45 7.71M20.9 12h-8.9M16.45 19.71L12 12M7.55 19.71L12 12M3.1 12h8.9M7.55 4.29L12 12" />
    </g>
    <circle cx="12" cy="12" r="2.2" />
  </Glyph>
)

/* ---------------- 四维故事 ---------------- */

export const SpotlightGlyph = (p) => (
  <Glyph id="g-spotlight" sw={1.4} {...p}>
    <path d="M9.2 2.6h5.6l1.2 2.9H8z" />
    <path d="M8 5.5h8l3.5 13.4H4.5z" />
    <path d="M10.9 9.2l-1.2 5.4M13.1 9.2l1.2 5.4" opacity="0.5" />
    <path d="M3 21.4h18" />
  </Glyph>
)

export const RocketGlyph = (p) => (
  <Glyph id="g-rocket" sw={1.4} {...p}>
    <path d="M12 2.4c3.1 2.5 4.7 6 4.7 10.1l-1.9 3.5H9.2l-1.9-3.5c0-4.1 1.6-7.6 4.7-10.1z" />
    <circle cx="12" cy="9.6" r="1.9" />
    <path d="M7.3 11.4L4.4 14.3v3.2l2.9-1.9M16.7 11.4l2.9 2.9v3.2l-2.9-1.9" />
    <path d="M10.2 18.4c.6 1.7 1.2 2.7 1.8 3.2.6-.5 1.2-1.5 1.8-3.2" />
  </Glyph>
)

export const FlaskGlyph = (p) => (
  <Glyph id="g-flask" sw={1.4} {...p}>
    <path d="M9.6 2.8v6.1L4.4 18.2c-.8 1.4.2 3 1.8 3h11.6c1.6 0 2.6-1.6 1.8-3L14.4 8.9V2.8" />
    <path d="M8.6 2.8h6.8" />
    <path d="M7.2 14.4h9.6" />
    <circle cx="10.4" cy="17.4" r="1" />
    <circle cx="13.9" cy="18.6" r="0.7" />
  </Glyph>
)

export const CaseGlyph = (p) => (
  <Glyph id="g-case" sw={1.4} {...p}>
    <rect x="2.6" y="7.1" width="18.8" height="13.3" rx="2.2" />
    <path d="M8.7 7.1V5.2a2 2 0 0 1 2-2h2.6a2 2 0 0 1 2 2v1.9" />
    <path d="M2.6 12.6c3 1.4 6.1 2.1 9.4 2.1s6.4-.7 9.4-2.1" />
    <path d="M10.6 13.9h2.8" />
  </Glyph>
)

/* ---------------- 纸飞机（教育航线） ---------------- */

export function PlaneGlyph({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" overflow="visible">
      <path d="M22 2.6L2.4 10.4l7.1 2.6 2.6 7.1z" fill="url(#g-plane)" opacity="0.92" />
      <path d="M22 2.6L9.5 13" fill="none" stroke="var(--bg)" strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />
    </svg>
  )
}

export const hobbyGlyphs = {
  book: BookGlyph,
  film: FilmGlyph,
  coffee: CoffeeGlyph,
  paint: PaintGlyph,
  flower: FlowerGlyph,
  drama: DramaGlyph,
  mic: MicGlyph,
  doc: DocGlyph,
}

export const storyGlyphs = {
  spotlight: SpotlightGlyph,
  partner: RocketGlyph,
  'flavor-lab': FlaskGlyph,
  intern: CaseGlyph,
}
