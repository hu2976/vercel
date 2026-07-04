import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Tag as TagIcon } from 'lucide-react'
import { getAllPosts } from '../utils/posts'

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="mt-4 text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            博客
          </h1>
          <p className="text-gray-500 dark:text-gray-400">技术分享和生活记录</p>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">还没有文章，敬请期待！</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group block rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all"
                >
                  <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="mb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                    {post.date && (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(post.date).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                    {post.tags.length > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <TagIcon size={14} />
                        {post.tags.join(', ')}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    阅读全文
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
