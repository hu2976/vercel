import { useState, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import InkCanvas from './InkCanvas'
import { IriDefs } from './Glyphs'

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
      {/* 全站图标共用的炫彩渐变定义 */}
      <IriDefs />
      {/* 水墨层：铺在所有内容之下，鼠标经过留笔迹 */}
      <InkCanvas dark={dark} />

      <Header dark={dark} onToggleTheme={() => setDark(d => !d)} />
      <main className="above-ink flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
