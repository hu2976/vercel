// ============================================
// Personal Config — edit here to customize
// =============================================

const config = {
  // Personal info
  name: "Hujinghan",
  title: "Developer / Tech Enthusiast / Nutrition Enthusiast",
  tagline: "Building interesting things with code",
  bio: `Hi, I'm Hu Jinghan, a person who falls in love with iced Americano. Welcome to my world.

I enjoy deep chatting and taking walks. I keep an eye on the development of nutrition and tech, and I love exploring all new things. Because I believe that learning is a lifelong process, and curiosity keeps life vibrant.

In my spare time, I will update my various hobbies and achievements here. I believe that both you who are browsing my page and I who created it will have the future we envision.`,

  // Social links
  social: {
    github: "https://github.com/hu2976",
    email: "13521752976@163.com",
  },

  // Skills
  skills: [
    "Knowledge of Nutrition",
    "English",
    "Public Speaking",
    "Hosting Interviews",
    "Copywriting",
    "Event Planning",
    "Interdepartmental Communication",
    "Innovative Thinking",
    "Vibe Coding",
  ],

  // Projects
  projects: [
    {
      title: "Personal Website",
      description: "A personal blog built with React + Vite + Tailwind CSS, with Markdown posts and dark mode.",
      tags: ["React", "Vite", "Tailwind CSS"],
    },
  ],

  // Work Set — 作品集。file 指向 public/works 下的静态页面，在 /works/:slug 内嵌展示
  works: [
    {
      slug: "nutrition-engine-eval",
      title: "食物营养估算引擎 · 评测仪表盘",
      description: "一套针对「食物营养估算」大模型能力的评测方案：覆盖多种烹饪方式对热量的影响，含测试用例、真值标注与自动评分，最终汇总成可交互的评测看板。",
      tags: ["Nutrition", "LLM Eval", "Dashboard"],
      file: "/works/files/nutrition-engine-eval.html",
      date: "2026-07-06",
    },
  ],

  // Site info
  site: {
    title: "Hujinghan | Personal Site",
    description: "Personal site of Hujinghan — tech, life, and thoughts",
    domain: "hujinghan0312.top",
  },
};

export default config;
