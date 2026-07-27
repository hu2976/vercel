import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, Copy, Check, ArrowRight, Trophy, Sparkles, GraduationCap, Lock } from 'lucide-react'
import config from '../config'
import ImageFrame from '../components/ImageFrame'

// 小红书图标（lucide 无，简单 SVG）
const XhsIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm3.2 4.2H5.8v5.6h1.4v-2.2h1v2.2h1.4V9.2H9.2v2h-1v-2Zm4.3 0h-1.4v5.6h3.4v-1.3h-2V9.2Zm4.9 0h-1.9v5.6h1.4v-1.8h.5c1.2 0 2-.7 2-1.9s-.8-1.9-2-1.9Zm-.1 2.7h-.4v-1.5h.4c.5 0 .8.3.8.8s-.3.7-.8.7Z" />
  </svg>
)

// 四维泡泡的渐变配色
const bubbleGradients = {
  spotlight: ['#ff6b9d', '#ffa63d'],
  partner: ['#5b8cff', '#7b5bff'],
  'flavor-lab': ['#2fc39a', '#46d5ff'],
  intern: ['#a06bff', '#ff5ccd'],
}

// 联系方式方框：默认显示标签，点击浮现内容；已浮现再点则复制
function ContactCard({ icon, label, value, copyable = true }) {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  const handle = () => {
    if (!revealed) { setRevealed(true); return }
    if (copyable && navigator.clipboard) {
      navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <button
      onClick={handle}
      className="card card-hover group flex w-full items-center gap-3 px-4 py-3.5 text-left"
      title={revealed ? (copyable ? '点击复制' : label) : '点击查看'}
    >
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
        style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
      >
        {copied ? <Check size={18} /> : icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-faint">{label}</span>
        <span className="block truncate font-semibold text-body">
          {revealed ? value : '点击查看'}
        </span>
      </span>
      {revealed && copyable && (
        <Copy size={15} className="shrink-0 text-faint opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  )
}

export default function Home() {
  const [bioHover, setBioHover] = useState(false)
  const { greeting, contact, timeline } = config
  const bioText = (bioHover ? config.bioZh : config.bio)
    .split('\n')
    .filter((p) => p.trim() !== '')

  return (
    <div className="relative overflow-hidden">
      {/* 背景光晕 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-32 left-[8%] h-[420px] w-[420px] rounded-full blur-3xl"
          style={{ background: 'var(--page-glow-1)' }}
        />
        <div
          className="absolute top-40 right-[4%] h-[380px] w-[380px] rounded-full blur-3xl"
          style={{ background: 'var(--page-glow-2)' }}
        />
      </div>

      {/* ===== Hero ===== */}
      <section className="mx-auto max-w-5xl px-4 pt-12 pb-16 sm:pt-16">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
          {/* 左侧：花体字问候 + 联系方式 */}
          <div className="flex flex-col gap-6">
            <div className="script-panel px-7 py-9 sm:px-9 sm:py-11">
              <p className="font-script text-5xl leading-tight sm:text-6xl">{greeting.hi}</p>
              <p className="font-script mt-1 text-5xl leading-tight sm:text-6xl">{greeting.intro}</p>
            </div>

            <div className="flex flex-col gap-3">
              <ContactCard icon={<Phone size={18} />} label="电话 Phone" value={contact.phone} />
              <ContactCard icon={<Mail size={18} />} label="邮箱 Email" value={contact.email} />
              <ContactCard icon={<XhsIcon />} label="小红书 RED" value={contact.xiaohongshu} copyable={false} />
            </div>
          </div>

          {/* 右侧：照片 + 个人介绍 */}
          <div className="flex flex-col gap-6">
            <ImageFrame
              src={config.photo}
              alt={config.nameZh}
              label="个人照片待补充"
              className="aspect-[4/5] w-full rounded-3xl sm:aspect-[3/4]"
              imgClassName="h-full w-full rounded-3xl object-cover"
            />

            <div
              onMouseEnter={() => setBioHover(true)}
              onMouseLeave={() => setBioHover(false)}
              className="card relative px-6 py-7 sm:px-7"
            >
              <span
                className="pointer-events-none absolute -top-4 left-5 font-script text-6xl leading-none opacity-30"
                style={{ color: 'var(--accent)' }}
              >
                &ldquo;
              </span>
              <div className="mb-2 flex items-center gap-2">
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
        </div>
      </section>

      {/* ===== 四维泡泡 ===== */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="mb-2 text-center">
          <span className="section-eyebrow">Four Sides of Me</span>
        </div>
        <h2 className="mb-10 text-center text-2xl font-bold text-body sm:text-3xl">
          四个<span className="text-gradient">我</span> · 点击进入
        </h2>
        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {config.stories.map((s, i) => {
            const [c1, c2] = bubbleGradients[s.slug] || ['#5b8cff', '#7b5bff']
            return (
              <Link key={s.slug} to={`/story/${s.slug}`} className="group flex flex-col items-center text-center">
                <span
                  className="floaty grid aspect-square w-28 place-items-center rounded-full text-4xl shadow-lg transition-transform duration-300 group-hover:scale-110 sm:w-32"
                  style={{
                    background: `linear-gradient(140deg, ${c1}, ${c2})`,
                    boxShadow: `0 12px 34px -10px ${c1}aa`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                >
                  {s.emoji}
                </span>
                <h3 className="mt-4 font-bold text-body transition-colors group-hover:text-accent">{s.title}</h3>
                <p className="mt-1 px-1 text-xs leading-relaxed text-faint">{s.tagline}</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ===== 教育背景时间线 ===== */}
      <section className="border-y py-14" style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}>
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-8 flex items-center gap-3">
            <GraduationCap size={24} className="text-accent" />
            <h2 className="title-bar text-2xl font-bold text-body">我的背景</h2>
            <span
              className="ml-2 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              目前已解锁
            </span>
          </div>

          {/* 时间线 */}
          <div className="flex flex-wrap items-stretch gap-4">
            {/* 小/初/高：装饰性小节点 */}
            <div className="flex items-center gap-3 self-center">
              {timeline.minor.map((m, i) => (
                <div key={m.label} className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1.5 opacity-60">
                    <span className="h-3 w-3 rounded-full" style={{ background: 'var(--accent-2)' }} />
                    <span className="text-xs text-faint">{m.label}</span>
                  </div>
                  {i < timeline.minor.length - 1 && (
                    <span className="h-px w-5 self-start" style={{ marginTop: '0.35rem', background: 'var(--border-strong)' }} />
                  )}
                </div>
              ))}
              <span className="h-px w-6 self-center" style={{ background: 'var(--border-strong)' }} />
            </div>

            {/* 本科：详细卡片 */}
            <div
              className="card flex-1 min-w-[260px] px-6 py-5"
              style={{ borderColor: 'var(--accent)', boxShadow: 'var(--glow)' }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--accent)' }} />
                <span className="text-sm font-bold text-accent">{timeline.current.stage} · 已解锁</span>
              </div>
              <p className="text-lg font-bold text-body">{timeline.current.school}</p>
              <p className="mt-1 text-soft">{timeline.current.college}</p>
              <p className="text-soft">专业：{timeline.current.major}</p>
            </div>

            {/* 硕士 / 未来：待解锁 */}
            <div className="flex items-center gap-3 self-center">
              <span className="h-px w-6 self-center" style={{ background: 'var(--border-strong)' }} />
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

      {/* ===== 技能 ===== */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="mb-7 flex items-center gap-3">
          <Sparkles size={24} className="text-accent" />
          <h2 className="title-bar text-2xl font-bold text-body">我的技能</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {config.skills.map((skill) => (
            <span key={skill} className="chip">{skill}</span>
          ))}
        </div>
      </section>

      {/* ===== 荣誉奖项 ===== */}
      <section className="mx-auto max-w-5xl px-4 pb-20 pt-2">
        <div className="mb-7 flex items-center gap-3">
          <Trophy size={24} className="text-accent" />
          <h2 className="title-bar text-2xl font-bold text-body">我的奖项</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {config.awards.map((award) => (
            <div key={award} className="card card-hover flex items-start gap-3 px-5 py-4">
              <Trophy size={18} className="mt-0.5 shrink-0 text-accent" />
              <span className="leading-relaxed text-soft">{award}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 底部去 Vibecoding / Design ===== */}
      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/design" className="btn-ghost">看看我的设计 Design<ArrowRight size={16} /></Link>
          <Link to="/vibecoding" className="btn-accent">看看我的代码作品 Vibecoding<ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  )
}
