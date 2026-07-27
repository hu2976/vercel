import { NavLink, Link } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import config from '../config'

const navLinks = [
  { to: '/', label: 'HOME', end: true },
  { to: '/design', label: 'Design' },
  { to: '/vibecoding', label: 'Vibecoding' },
];

export default function Header({ dark, onToggleTheme }) {
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--bg) 82%, transparent)' }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-body">
          <span className="grid h-7 w-7 place-items-center rounded-lg text-sm text-white" style={{ backgroundImage: 'linear-gradient(140deg, var(--accent), var(--accent-2))' }}>胡</span>
          <span>胡静函</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-semibold tracking-wide transition-colors ${
                  isActive ? 'nav-active' : 'nav-idle'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <button
            onClick={onToggleTheme}
            className="ml-1 grid h-9 w-9 place-items-center rounded-full transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--accent)', boxShadow: 'var(--glow)' }}
            aria-label={dark ? '切换到日间模式' : '切换到夜间模式'}
            title={dark ? '切换到日间模式' : '切换到夜间模式'}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>
      </div>

      <style>{`
        .nav-idle { color: var(--text-soft); }
        .nav-idle:hover { color: var(--accent); }
        .nav-active { color: var(--accent-contrast); background-image: linear-gradient(135deg, var(--accent), var(--accent-2)); box-shadow: var(--glow); }
      `}</style>
    </header>
  );
}
