import config from '../config'

export default function Footer() {
  return (
    <footer className="above-ink mt-auto border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center gap-3 text-sm sm:flex-row sm:justify-between">
          <div className="text-soft">
            小红书 · {config.contact.xiaohongshu} &nbsp;|&nbsp; {config.contact.email}
          </div>
          <div className="text-faint">
            © {new Date().getFullYear()} {config.nameZh} · {config.site.domain}
          </div>
        </div>
      </div>
    </footer>
  );
}
