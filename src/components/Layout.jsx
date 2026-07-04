import { useState, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ children }) {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header dark={dark} onToggleTheme={() => setDark(d => !d)} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
