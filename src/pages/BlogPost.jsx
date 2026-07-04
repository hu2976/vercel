import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Tag as TagIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPostBySlug } from '../utils/posts'

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPostBySlug(slug).then((data) => {
      setPost(data);
      setLoading(false);
    });
  }, [slug]);

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

  if (!post) {
    return (
      <div className="px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">文章未找到</h1>
          <p className="mb-8 text-gray-500">你访问的文章不存在或已被删除。</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft size={16} />
            返回博客
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-16 sm:py-20">
      <article className="mx-auto max-w-2xl">
        {/* 返回链接 */}
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft size={16} />
          返回博客列表
        </Link>

        {/* 文章头部 */}
        <header className="mb-10">
          <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            {post.title}
          </h1>

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
        </header>

        {/* 文章内容 */}
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* 底部导航 */}
        <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={16} />
            返回博客列表
          </Link>
        </div>
      </article>
    </div>
  );
}
