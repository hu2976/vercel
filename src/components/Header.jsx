import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/blog', label: '博客' },
];

export default function Header({ dark, onToggleTheme }) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-md dark:border-gray-800/60 dark:bg-gray-950/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          hujinghan
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={onToggleTheme}
            className="ml-2 rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            aria-label={dark ? '切换到亮色模式' : '切换到暗色模式'}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
