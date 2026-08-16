import { NavLink, Link } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/design', label: 'Design' },
  { to: '/vibecoding', label: 'Vibecoding' },
];

export default function Header({ dark, onToggleTheme }) {
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--bg) 84%, transparent)' }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
        {/* 一枚炫彩小印 + 宋体名字 */}
        <Link to="/" className="group flex items-center gap-2.5">
          <span
            className="grid h-6 w-6 place-items-center rounded-[0.3rem] text-[0.7rem] font-bold text-white transition-transform group-hover:rotate-[-6deg]"
            style={{ backgroundImage: 'linear-gradient(135deg, var(--i1), var(--i2) 55%, var(--i5))' }}
          >
            胡
          </span>
          {/* 窄屏只留那枚印章，把横向空间让给导航 */}
          <span className="hidden font-serif-cn text-[1.05rem] tracking-[0.14em] text-body sm:inline">胡静函</span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-7">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="nav-item">
              {link.label}
            </NavLink>
          ))}

          <button
            onClick={onToggleTheme}
            className="grid h-8 w-8 place-items-center rounded-full text-faint transition-colors hover:text-body"
            aria-label={dark ? '切换到日间模式' : '切换到夜间模式'}
            title={dark ? '切换到日间模式' : '切换到夜间模式'}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </nav>
      </div>

      <style>{`
        .nav-item {
          position: relative;
          padding: 0.35rem 0;
          font-size: 0.83rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--text-faint);
          transition: color .25s ease;
        }
        .nav-item:hover { color: var(--text-soft); }
        .nav-item.active { color: var(--text); }
        .nav-item::after {
          content: "";
          position: absolute;
          left: 0; right: 0; bottom: -0.15rem;
          height: 1.5px; border-radius: 2px;
          transform: scaleX(0); transform-origin: left;
          background-image: linear-gradient(90deg, var(--i1), var(--i2), var(--i5));
          transition: transform .35s cubic-bezier(.2,.8,.3,1);
        }
        .nav-item.active::after { transform: scaleX(1); }
      `}</style>
    </header>
  );
}
