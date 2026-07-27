import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Phone, Mail, Copy, Check, ArrowRight, Sparkles,
  GraduationCap, Lock, Crown, Award, Medal, Trophy, Star, Gem,
} from 'lucide-react'
import config from '../config'
import ImageFrame from '../components/ImageFrame'

// 小红书图标
const XhsIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm3.2 4.2H5.8v5.6h1.4v-2.2h1v2.2h1.4V9.2H9.2v2h-1v-2Zm4.3 0h-1.4v5.6h3.4v-1.3h-2V9.2Zm4.9 0h-1.9v5.6h1.4v-1.8h.5c1.2 0 2-.7 2-1.9s-.8-1.9-2-1.9Zm-.1 2.7h-.4v-1.5h.4c.5 0 .8.3.8.8s-.3.7-.8.7Z" />
  </svg>
)

// 四维气泡的渐变配色 + 错落尺寸/偏移
const bubbleStyles = {
  spotlight:   { c1: '#ff7eb3', c2: '#ff9d5c', size: 176, offset: 0 },
  partner:     { c1: '#6aa0ff', c2: '#8b6bff', size: 132, offset: 60 },
  'flavor-lab':{ c1: '#3ad6a8', c2: '#4ad6ff', size: 162, offset: 22 },
  intern:      { c1: '#b17bff', c2: '#ff6bd0', size: 122, offset: 74 },
}

// 技能标签的错落字号（rem）
const skillSizes = [1.15, 0.9, 1.35, 0.95, 1.1, 0.85, 1.25, 1.0, 1.4, 0.9, 1.05, 1.2]
const awardIcons = [Crown, Award, Medal, Trophy, Star, Gem]

// 联系方式小胶囊：点击浮现内容；可复制的再点复制
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
    <div className="relative overflow-hidden">
      {/* 背景光晕 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-[6%] h-[420px] w-[420px] rounded-full blur-3xl" style={{ background: 'var(--page-glow-1)' }} />
        <div className="absolute top-52 right-[2%] h-[380px] w-[380px] rounded-full blur-3xl" style={{ background: 'var(--page-glow-2)' }} />
      </div>

      {/* ===== Hero ===== */}
      <section className="mx-auto max-w-5xl px-4 pt-12 pb-14 sm:pt-16">
        <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* 左：花体字问候 + About（移到问候下方） */}
          <div className="flex flex-col gap-6">
            <div className="script-panel px-7 py-8 sm:px-9 sm:py-10">
              <p className="font-script text-5xl leading-[1.15] sm:text-6xl">{greeting.hi}</p>
              <p className="font-script mt-1 text-5xl leading-[1.15] sm:text-6xl">{greeting.intro}</p>
            </div>

            <div
              onMouseEnter={() => setBioHover(true)}
              onMouseLeave={() => setBioHover(false)}
              className="card relative px-6 py-7 sm:px-7"
            >
              <span className="pointer-events-none absolute -top-3 left-5 font-script text-6xl leading-none opacity-25" style={{ color: 'var(--accent)' }}>&ldquo;</span>
              <div className="mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-accent" />
                <span className="section-eyebrow">About Me</span>
                <span className="ml-auto text-xs text-faint">悬停显示中文 ✦</span>
              </div>
              {bioText.map((p, i) => (
                <p key={i} className="mb-3 leading-relaxed text-soft last:mb-0">{p}</p>
              ))}
              <p className="font-script mt-4 text-right text-2xl text-accent">— {config.nameZh}</p>
            </div>
          </div>

          {/* 右：抠图人像 + 小巧联系方式 */}
          <div className="flex flex-col items-center gap-6">
            <div className="portrait-stage aspect-[4/5] w-full max-w-[360px]">
              <div className="portrait-blob" />
              {/* 抠图 PNG 到位后可把 object-cover 改为 object-contain */}
              <ImageFrame
                src={config.photo}
                alt={config.nameZh}
                label="个人照片待补充（抠图）"
                className="relative z-10 h-[92%] w-[92%] rounded-[2rem]"
                imgClassName="h-full w-full rounded-[2rem] object-cover drop-shadow-2xl"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2.5">
              <ContactPill icon={<Phone size={15} />} label="电话" value={contact.phone} />
              <ContactPill icon={<Mail size={15} />} label="邮箱" value={contact.email} />
              <ContactPill icon={<XhsIcon />} label="小红书" value={contact.xiaohongshu} copyable={false} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== 四维仿真气泡 ===== */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-2 text-center"><span className="section-eyebrow">Four Sides of Me</span></div>
        <h2 className="mb-4 text-center text-2xl font-bold text-body sm:text-3xl">
          了解<span className="text-gradient">四维度</span>的我
        </h2>
        <p className="mb-12 text-center text-sm text-faint">鼠标扫过气泡看简介 · 点击进入完整故事</p>

        <div className="flex flex-wrap items-start justify-center gap-x-6 gap-y-10 sm:gap-x-10">
          {config.stories.map((s) => {
            const st = bubbleStyles[s.slug] || { c1: '#6aa0ff', c2: '#8b6bff', size: 140, offset: 0 }
            return (
              <Link
                key={s.slug}
                to={`/story/${s.slug}`}
                className="bubble-wrap group flex w-36 flex-col items-center text-center sm:w-40"
                style={{ marginTop: `${st.offset}px` }}
              >
                <span
                  className="floaty bubble"
                  style={{ width: st.size, height: st.size, '--b1': st.c1, '--b2': st.c2 }}
                >
                  <span className="bubble-emoji">{s.emoji}</span>
                </span>
                <h3 className="mt-4 font-bold text-body transition-colors group-hover:text-accent">{s.title}</h3>
                <p className="bubble-caption mt-1.5 px-1 text-xs leading-relaxed text-soft">{s.tagline}</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ===== 教育背景时间线 ===== */}
      <section className="mt-4 border-y py-14" style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}>
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <GraduationCap size={24} className="text-accent" />
            <h2 className="title-bar text-2xl font-bold text-body">我的背景</h2>
            <span className="ml-1 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>目前已解锁</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 self-center">
              {timeline.minor.map((m, i) => (
                <div key={m.label} className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1.5 opacity-60">
                    <span className="h-3 w-3 rounded-full" style={{ background: 'var(--accent-2)' }} />
                    <span className="text-xs text-faint">{m.label}</span>
                  </div>
                  {i < timeline.minor.length - 1 && <span className="h-px w-5" style={{ marginTop: '-0.9rem', background: 'var(--border-strong)' }} />}
                </div>
              ))}
              <span className="h-px w-6 self-center" style={{ marginTop: '-0.9rem', background: 'var(--border-strong)' }} />
            </div>

            <div className="card min-w-[260px] flex-1 px-6 py-5" style={{ borderColor: 'var(--accent)', boxShadow: 'var(--glow)' }}>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--accent)' }} />
                <span className="text-sm font-bold text-accent">{timeline.current.stage} · 已解锁</span>
              </div>
              <p className="text-lg font-bold text-body">{timeline.current.school}</p>
              <p className="mt-1 text-soft">{timeline.current.college}</p>
              <p className="text-soft">专业：{timeline.current.major}</p>
            </div>

            <div className="flex items-center gap-3 self-center">
              <span className="h-px w-6" style={{ background: 'var(--border-strong)' }} />
              {timeline.future.map((f) => (
                <div key={f.label} className="flex flex-col items-center gap-1.5 opacity-50">
                  <span className="grid h-7 w-7 place-items-center rounded-full" style={{ border: '1px dashed var(--border-strong)' }}>
                    <Lock size={12} className="text-faint" />
                  </span>
                  <span className="text-xs text-faint">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-sm text-faint">✧ {timeline.note}</p>
        </div>
      </section>

      {/* ===== 技能标签墙 ===== */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="mb-9 flex items-center justify-center gap-3">
          <Sparkles size={24} className="text-accent" />
          <h2 className="text-2xl font-bold text-body">我的技能</h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {config.skills.map((skill, i) => {
            const fs = skillSizes[i % skillSizes.length]
            return (
              <span
                key={skill}
                className="skill-tag"
                style={{ fontSize: `${fs}rem`, padding: `${fs * 0.42}rem ${fs * 0.9}rem` }}
              >
                {skill}
              </span>
            )
          })}
        </div>
      </section>

      {/* ===== 荣誉奖项 ===== */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="mb-9 flex items-center justify-center gap-3">
          <Trophy size={24} className="text-accent" />
          <h2 className="text-2xl font-bold text-body">我的奖项</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {config.awards.map((award, i) => {
            const Icon = awardIcons[i % awardIcons.length]
            const featured = i === 0
            return (
              <div key={award} className={`award-card ${featured ? 'featured' : ''}`}>
                <span className="award-badge" style={featured ? { width: '3.25rem', height: '3.25rem' } : undefined}>
                  <Icon size={featured ? 24 : 20} />
                </span>
                <div className="min-w-0">
                  {featured && <span className="mb-0.5 block text-xs font-semibold text-accent">代表性荣誉</span>}
                  <span className={`leading-relaxed text-body ${featured ? 'font-bold' : 'font-medium'}`}>{award}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ===== 底部入口 ===== */}
      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/design" className="btn-ghost">看看我的设计 Design<ArrowRight size={16} /></Link>
          <Link to="/vibecoding" className="btn-accent">看看我的代码作品 Vibecoding<ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  )
}
