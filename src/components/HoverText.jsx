import { useState } from 'react'

// 悬停时把英文原文替换为中文，鼠标离开恢复英文。
// 用 as 指定渲染标签（默认 span），其余 props（className 等）透传。
export default function HoverText({ en, zh, as: Tag = 'span', className = '', ...rest }) {
  const [hover, setHover] = useState(false)

  return (
    <Tag
      className={className}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={zh}
      {...rest}
    >
      {hover ? zh : en}
    </Tag>
  )
}
