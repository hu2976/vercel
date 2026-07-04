// 使用 Vite 的 import.meta.glob 加载 Markdown 博客文章

const modules = import.meta.glob('/content/blog/*.md', { query: '?raw', import: 'default' });

export async function getAllPosts() {
  const posts = [];

  for (const [path, loader] of Object.entries(modules)) {
    const raw = await loader();
    const { frontmatter, content } = parseFrontMatter(raw);
    const slug = path.replace('/content/blog/', '').replace('.md', '');

    posts.push({
      slug,
      title: frontmatter.title || slug,
      date: frontmatter.date || '',
      excerpt: frontmatter.excerpt || '',
      tags: frontmatter.tags || [],
      content,
    });
  }

  // 按日期降序排列
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

export async function getPostBySlug(slug) {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}

function parseFrontMatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, content: raw };
  }

  const frontmatter = {};
  const yaml = match[1];

  // 简单的 YAML front-matter 解析
  for (const line of yaml.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // 去掉引号
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // tags 数组
    if (key === 'tags' && value.startsWith('[')) {
      frontmatter[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''));
    } else {
      frontmatter[key] = value;
    }
  }

  return { frontmatter, content: match[2] || '' };
}
