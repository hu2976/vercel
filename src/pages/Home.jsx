import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, Copy, Check, ArrowRight, Crown, Award, Medal, Trophy, Star, Gem } from 'lucide-react'
import config from '../config'
import ImageFrame from '../components/ImageFrame'
import FlightTimeline from '../components/FlightTimeline'
import Interests from '../components/Interests'
import { storyGlyphs } from '../components/Glyphs'

// 小红书图标
const XhsIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm3.2 4.2H5.8v5.6h1.4v-2.2h1v2.2h1.4V9.2H9.2v2h-1v-2Zm4.3 0h-1.4v5.6h3.4v-1.3h-2V9.2Zm4.9 0h-1.9v5.6h1.4v-1.8h.5c1.2 0 2-.7 2-1.9s-.8-1.9-2-1.9Zm-.1 2.7h-.4v-1.5h.4c.5 0 .8.3.8.8s-.3.7-.8.7Z" />
  </svg>
)

// 四维气泡：尺寸错落、漂浮时长各异
const bubbleStyles = {
  spotlight: { c1: '#ff4d8d', c2: '#ff9e44', size: 172, offset: 0, dur: 6.5 },
  partner: { c1: '#3ab7f0', c2: '#5b6bff', size: 128, offset: 58, dur: 5.2 },
  'flavor-lab': { c1: '#06d6a0', c2: '#3ab7f0', size: 154, offset: 18, dur: 7.2 },
  intern: { c1: '#9b5de5', c2: '#ff4d8d', size: 120, offset: 72, dur: 5.8 },
}

// 技能：字号错落 + 少量带彩，其余素色
const skillStyle = [
  { fs: 1.1, tone: 't2', dur: 6.4 }, { fs: 0.92, tone: '', dur: 7.2 },
  { fs: 1.3, tone: 't4', dur: 5.8 }, { fs: 0.95, tone: '', dur: 7.6 },
  { fs: 1.05, tone: 't3', dur: 6.6 }, { fs: 0.88, tone: '', dur: 6.9 },
  { fs: 1.18, tone: '', dur: 6.1 }, { fs: 1.0, tone: 't3', dur: 7.4 },
  { fs: 1.32, tone: 't4', dur: 5.6 }, { fs: 0.9, tone: '', dur: 7.0 },
  { fs: 1.02, tone: '', dur: 6.3 }, { fs: 1.12, tone: 't2', dur: 6.8 },
]
const awardIcons = [Crown, Award, Medal, Trophy, Star, Gem]

// 进入视口就淡入上移，一次性
function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } },
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${className}`} data-shown={shown} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

// 联系方式：点一下露出，再点一下复制
function ContactPill({ icon, label, value, copyable = true }) {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)
  const handle = () => {
    if (!revealed) { setRevealed(true); return }
    if (copyable && navigator.clipboard) {
      navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    }
  }
  return (
    <button onClick={handle} className="contact-pill" title={revealed ? (copyable ? '点击复制' : label) : '点击查看'}>
      {copied ? <Check size={15} /> : icon}
      <span>{revealed ? value : label}</span>
      {revealed && copyable && !copied && <Copy size={12} className="opacity-60" />}
    </button>
  )
}

export default function Home() {
  const [bioHover, setBioHover] = useState(false)
  const { greeting, contact, timeline } = config
  const bioText = (bioHover ? config.bioZh : config.bio).split('\n').filter((p) => p.trim() !== '')

  return (
    <div className="relative">
      {/* 极淡的两团光斑，只在首屏 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[92vh] overflow-hidden">
        <div className="absolute -top-28 left-[2%] h-[460px] w-[460px] rounded-full blur-3xl" style={{ background: 'var(--page-glow-1)' }} />
        <div className="absolute top-36 right-[-6%] h-[420px] w-[420px] rounded-full blur-3xl" style={{ background: 'var(--page-glow-2)' }} />
      </div>

      {/* ===== 首屏 ===== */}
      <section
        className="mx-auto flex max-w-5xl flex-col justify-center px-5 py-10"
        style={{ minHeight: 'calc(100vh - 61px)' }}
      >
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.82fr] lg:gap-14">
          <div>
            <p className="eyebrow mb-6">Nutrition · Tech · Expression</p>

            <h1 className="font-script leading-[1.08]">
              <span className="block text-5xl text-body sm:text-6xl">{greeting.hi}</span>
              <span className="mt-1 block text-6xl text-gradient sm:text-7xl">{greeting.intro}</span>
            </h1>

            <div
              onMouseEnter={() => setBioHover(true)}
              onMouseLeave={() => setBioHover(false)}
              className="mt-8 max-w-[48ch]"
            >
              <div className="mb-3 flex items-center gap-2.5">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-faint">About</span>
                <span className="h-px w-7" style={{ backgroundImage: 'linear-gradient(90deg, var(--i1), var(--i5))' }} />
                <span className="text-[0.7rem] text-faint">悬停显示中文</span>
              </div>
              {bioText.map((p, i) => (
                <p
                  key={i}
                  className={`mb-2.5 text-justify text-[0.94rem] leading-[1.85] text-soft last:mb-0 ${bioHover ? 'serif-body' : 'bio-serif'}`}
                >
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <ContactPill icon={<Phone size={15} />} label="电话" value={contact.phone} />
              <ContactPill icon={<Mail size={15} />} label="邮箱" value={contact.email} />
              <ContactPill icon={<XhsIcon />} label="小红书" value={contact.xiaohongshu} copyable={false} />
            </div>
          </div>

          <div className="portrait-stage mx-auto w-full max-w-[340px]">
            <div className="portrait-blob" />
            <ImageFrame
              src={config.photo}
              alt={config.nameZh}
              label="个人照片待补充"
              className="relative z-10 w-full"
              imgClassName="portrait-fade block h-auto w-full [filter:drop-shadow(0_16px_26px_rgba(0,0,0,0.24))]"
              placeholderClassName="aspect-[4/5] overflow-hidden rounded-[2rem]"
            />
          </div>
        </div>

        <p className="mt-12 text-center text-[0.7rem] tracking-[0.2em] text-faint">向下滚动 ↓</p>
      </section>

      {/* ===== 四维度 ===== */}
      <section className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
        <Reveal>
          <div className="mb-3 flex justify-center"><span className="eyebrow">Four sides of me</span></div>
          <h2 className="sec-title mb-3 text-center">
            四个维度的我
          </h2>
          <p className="mb-16 text-center text-sm text-faint">扫过气泡看简介，点进去是完整的故事</p>
        </Reveal>

        <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-10 sm:gap-x-12">
          {config.stories.map((s, i) => {
            const st = bubbleStyles[s.slug] || { c1: '#5b6bff', c2: '#9b5de5', size: 140, offset: 0, dur: 6 }
            const Glyph = storyGlyphs[s.slug]
            return (
              <Reveal key={s.slug} delay={i * 90}>
                <Link
                  to={`/story/${s.slug}`}
                  className="bubble-wrap group flex w-36 flex-col items-center text-center sm:w-40"
                  style={{ marginTop: `${st.offset}px` }}
                >
                  <span className="floaty inline-block" style={{ animationDuration: `${st.dur}s` }}>
                    <span className="bubble" style={{ width: st.size, height: st.size, '--b1': st.c1, '--b2': st.c2 }}>
                      <span className="bubble-glyph">{Glyph && <Glyph size={Math.round(st.size * 0.3)} />}</span>
                    </span>
                  </span>
                  <h3 className="font-serif-cn mt-4 text-[1.05rem] text-body transition-colors group-hover:text-accent">{s.title}</h3>
                  <p className="bubble-caption mt-1.5 px-1 text-xs leading-relaxed text-soft">{s.tagline}</p>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ===== 教育航线 ===== */}
      <section className="border-y py-20 sm:py-24" style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}>
        <div className="mx-auto max-w-4xl px-5">
          <Reveal>
            <div className="mb-3 flex justify-center"><span className="eyebrow">Flight log</span></div>
            <h2 className="sec-title mb-3 text-center">我飞到哪儿了</h2>
            <p className="mb-12 text-center text-sm text-faint">实线是已经飞过的，虚线还没解锁</p>
          </Reveal>

          <FlightTimeline />

          <Reveal>
            <div className="mx-auto mt-10 max-w-sm text-center">
              <p className="font-serif-cn text-xl text-body">{timeline.current.school}</p>
              <p className="mt-1.5 text-sm text-soft">{timeline.current.college}</p>
              <p className="text-sm text-soft">{timeline.current.major}</p>
              <span className="sec-rule mx-auto mt-5" />
              <p className="mt-5 text-xs text-faint">{timeline.note}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== 技能 ===== */}
      <section className="mx-auto max-w-4xl px-5 py-20 sm:py-24">
        <Reveal>
          <div className="mb-3 flex justify-center"><span className="eyebrow">Toolkit</span></div>
          <h2 className="sec-title mb-16 text-center">我会的</h2>
        </Reveal>
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-7 sm:gap-x-9">
          {config.skills.map((skill, i) => {
            const st = skillStyle[i % skillStyle.length]
            const jitter = [6, -11, 14, -5, 10, -13, 4, -9, 12, -4, 8, -12]
            return (
              <span
                key={skill}
                className="skill-float"
                style={{ '--dur': `${st.dur}s`, animationDelay: `${(i % 5) * 0.5}s`, marginTop: `${jitter[i % jitter.length]}px` }}
              >
                <span
                  className={`skill-tag ${st.tone}`}
                  style={{ fontSize: `${st.fs}rem`, padding: `${st.fs * 0.42}rem ${st.fs * 0.85}rem` }}
                >
                  {skill}
                </span>
              </span>
            )
          })}
        </div>
      </section>

      {/* ===== 奖项 ===== */}
      <section className="mx-auto max-w-2xl px-5 pb-20 sm:pb-24">
        <Reveal>
          <div className="mb-3 flex justify-center"><span className="eyebrow">Along the way</span></div>
          <h2 className="sec-title mb-14 text-center">拿过的</h2>
        </Reveal>
        <div className="flex flex-col">
          {config.awards.map((award, i) => {
            const Icon = awardIcons[i % awardIcons.length]
            const featured = i === 0
            return (
              <Reveal key={award} delay={i * 60}>
                <div
                  className={`award-row flex items-center gap-4 ${featured ? 'pb-6' : 'py-4'} ${i > 0 ? 'border-t' : ''}`}
                  style={i > 0 ? { borderColor: 'var(--border)' } : undefined}
                >
                  <span className="award-badge" style={featured ? { width: '3.2rem', height: '3.2rem' } : undefined}>
                    <Icon size={featured ? 24 : 18} style={{ stroke: 'url(#g-iri)' }} />
                  </span>
                  <div className="min-w-0">
                    {featured && <span className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-faint">代表性荣誉</span>}
                    <span className={`leading-relaxed text-body ${featured ? 'font-serif-cn text-xl' : 'text-[0.95rem]'}`}>{award}</span>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ===== 我喜欢的 + 咖啡地图 ===== */}
      <div className="border-t" style={{ borderColor: 'var(--border)' }}>
        <Interests />
      </div>

      {/* ===== 底部入口 ===== */}
      <section className="mx-auto max-w-5xl px-5 pb-24">
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/design" className="btn-ghost">看看我的设计<ArrowRight size={15} /></Link>
          <Link to="/vibecoding" className="btn-accent">看看我造的东西<ArrowRight size={15} /></Link>
        </div>
      </section>
    </div>
  )
}
