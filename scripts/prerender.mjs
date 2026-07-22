// 构建后为每个前端路由生成静态 index.html 外壳。
// GitHub Pages 无 SPA rewrite：没有实体文件的深链会命中 404.html。
// 这里把 dist/index.html 复制到每个路由目录下，使深链直接 200 返回，
// 消除“软 404 + 跳首页闪烁”。新增作品/博客会被自动枚举。
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const shell = readFileSync(join(dist, 'index.html'), 'utf8')

const routes = new Set(['/blog', '/works'])

// 作品路由：读取 src/config.js
const cfg = (await import(pathToFileURL(join(root, 'src/config.js')).href)).default
for (const w of cfg.works || []) if (w.slug) routes.add('/works/' + w.slug)

// 博客路由：读取 content/blog/*.md
const blogDir = join(root, 'content/blog')
if (existsSync(blogDir)) {
  for (const f of readdirSync(blogDir)) {
    if (f.endsWith('.md')) routes.add('/blog/' + f.replace(/\.md$/, ''))
  }
}

let n = 0
for (const r of routes) {
  const outDir = join(dist, r.replace(/^\//, ''))
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), shell)
  n++
}
console.log(`[prerender] 生成 ${n} 个路由外壳: ${[...routes].join(', ')}`)
