import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

// 图片框：有图显示图片，无图或加载失败时显示优雅占位图。
// props: src, alt, label(占位文案), className, imgClassName
//        placeholderClassName —— 仅占位时额外附加（如固定宽高比），真实图片保留自然比例
export default function ImageFrame({ src, alt = '', label = '照片待补充', className = '', imgClassName = '', placeholderClassName = '' }) {
  const [failed, setFailed] = useState(false)
  const showPlaceholder = !src || failed

  if (showPlaceholder) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center gap-2 overflow-hidden ${className} ${placeholderClassName}`}
        style={{
          background:
            'linear-gradient(135deg, var(--accent-soft), color-mix(in srgb, var(--accent-2) 14%, transparent))',
          border: '1px dashed var(--border-strong)',
        }}
      >
        <ImageIcon size={30} className="text-accent opacity-70" />
        <span className="text-faint text-xs sm:text-sm">{label}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${className} ${imgClassName}`}
    />
  )
}
