import { useState } from 'react'
import config from '../config'
import { Mail, ArrowRight, BookOpen, Code, Sparkles, Copy, Check } from 'lucide-react'
import { Link } from 'react-router-dom'

// 品牌图标（lucide-react 不包含，使用 SVG）
const GithubIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

export default function Home() {
  const [showEmail, setShowEmail] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleContact = () => {
    if (!showEmail) {
      setShowEmail(true);
      return;
    }
    navigator.clipboard.writeText(config.social.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          {/* Avatar */}
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-4xl font-bold text-white shadow-lg ring-4 ring-primary-100 dark:ring-primary-900/50 sm:h-28 sm:w-28">
            {config.name.charAt(0)}
          </div>

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            {config.name}
          </h1>

          <p className="mx-auto mb-4 max-w-lg text-lg text-gray-500 dark:text-gray-400">
            {config.title}
          </p>

          <p className="mx-auto mb-8 max-w-md text-gray-600 dark:text-gray-300">
            {config.tagline}
          </p>

          {/* CTA 按钮 */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-medium text-white shadow-md hover:bg-primary-700 transition-colors"
            >
              <BookOpen size={16} />
              Blog
              <ArrowRight size={16} />
            </Link>
            {config.social.github && (
              <a
                href={config.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-700 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <GithubIcon />
                GitHub
              </a>
            )}
            {config.social.email && (
              <button
                onClick={handleContact}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-700 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Mail size={16} />}
                {showEmail ? config.social.email : "Contact"}
                {showEmail && !copied && (
                  <Copy size={14} className="text-gray-400" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* 背景装饰 */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-100/50 to-transparent blur-3xl dark:from-primary-900/20" />
        </div>
      </section>

      {/* 关于我 */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex items-center gap-3">
            <Sparkles size={24} className="text-primary-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About</h2>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-900/50 sm:p-8">
            {config.bio.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 技能 */}
      <section className="px-4 py-16 sm:py-20 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center gap-3">
            <Code size={24} className="text-primary-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skills</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {config.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 项目 */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center gap-3">
            <Code size={24} className="text-primary-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {config.projects.map((project) => (
              <a
                key={project.title}
                href={project.link}
                className="group rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all"
              >
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {project.title}
                </h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 博客预览 */}
      <section className="px-4 py-16 sm:py-20 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Latest Posts</h2>
          <p className="mb-8 text-gray-500 dark:text-gray-400">Sharing tech insights and life updates</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
          >
            Blog
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
