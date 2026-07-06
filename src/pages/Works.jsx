import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Tag as TagIcon, LayoutGrid } from 'lucide-react'
import config from '../config'

export default function Works() {
  const works = config.works || [];

  return (
    <div className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <LayoutGrid size={28} className="text-primary-500" />
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Works
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">A collection of things I've built</p>
        </div>

        {works.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No works yet. Stay tuned!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {works.map((work) => (
              <article key={work.slug}>
                <Link
                  to={`/works/${work.slug}`}
                  className="group block rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all"
                >
                  <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {work.title}
                  </h2>

                  {work.description && (
                    <p className="mb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                      {work.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                    {work.date && (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(work.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                    {work.tags?.length > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <TagIcon size={14} />
                        {work.tags.join(', ')}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    View
                    <ArrowRight size={14} />
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
