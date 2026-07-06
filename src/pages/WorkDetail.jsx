import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import config from '../config'

export default function WorkDetail() {
  const { slug } = useParams();
  const work = (config.works || []).find((w) => w.slug === slug);

  if (!work) {
    return (
      <div className="px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Work Not Found</h1>
          <p className="mb-8 text-gray-500">The work you are looking for does not exist or has been removed.</p>
          <Link
            to="/works"
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Works
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-5xl">
        {/* 顶部导航 */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/works"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Works
          </Link>
          <a
            href={work.file}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ExternalLink size={14} />
            Open in new tab
          </a>
        </div>

        {/* 标题 */}
        <header className="mb-6">
          <h1 className="mb-3 text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
            {work.title}
          </h1>
          {work.description && (
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{work.description}</p>
          )}
        </header>

        {/* 内嵌作品 */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <iframe
            src={work.file}
            title={work.title}
            className="h-[80vh] w-full bg-white"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
