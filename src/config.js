// ============================================
// Personal Config — edit here to customize
// =============================================

const config = {
  // Personal info
  name: "Hujinghan",
  nameZh: "胡静函",
  title: "Developer / Tech Enthusiast / Nutrition Enthusiast",
  titleZh: "开发者 / 科技爱好者 / 营养爱好者",
  tagline: "Building interesting things with code",
  taglineZh: "用代码创造有趣的东西",
  bio: `Hi, I'm Hu Jinghan, a person who falls in love with iced Americano. Welcome to my world.

I enjoy deep chatting and taking walks. I keep an eye on the development of nutrition and tech, and I love exploring all new things. Because I believe that learning is a lifelong process, and curiosity keeps life vibrant.

In my spare time, I will update my various hobbies and achievements here. I believe that both you who are browsing my page and I who created it will have the future we envision.`,

  // 个人简介中文（About 模块悬停时浮现）
  bioZh: `你好，我是胡静函，一个冰美式唯粉。欢迎来到我的世界。

我喜欢深度的交谈与漫步。我关注营养与科技的发展，热爱探索一切新鲜事物。因为我相信，学习是一生的旅程，而好奇心让生活始终鲜活。

闲暇时，我会在这里更新我各种各样的爱好与成就。我相信，正在浏览这个页面的你，和创建它的我，都会拥有我们所憧憬的未来。`,

  // Social links
  social: {
    github: "https://github.com/hu2976",
    email: "13521752976@163.com",
  },

  // Skills —（en 英文默认展示，zh 悬停时浮现）
  skills: [
    { en: "Knowledge of Nutrition", zh: "营养学知识" },
    { en: "English", zh: "英语" },
    { en: "Public Speaking", zh: "公开演讲" },
    { en: "Hosting Interviews", zh: "主持采访" },
    { en: "Copywriting", zh: "文案写作" },
    { en: "Event Planning", zh: "活动策划" },
    { en: "Interdepartmental Communication", zh: "跨部门沟通" },
    { en: "Innovative Thinking", zh: "创新思维" },
    { en: "Vibe Coding", zh: "氛围编程" },
  ],

  // Rewards / Honors —（en 英文默认展示，zh 悬停时浮现）
  rewards: [
    { en: "TEDx speaker", zh: "TEDx 演讲者" },
    { en: "Four invention patents", zh: "四项发明专利" },
    { en: "First-class Scholarship", zh: "一等奖学金" },
    {
      en: "The Special Prize, First Prize and Second Prize of the National Challenge Cup Competition",
      zh: "全国“挑战杯”竞赛特等奖、一等奖及二等奖",
    },
    {
      en: "First place in the Beijing Nutritionist Skills Competition",
      zh: "北京市营养师技能大赛第一名",
    },
    {
      en: "More than ten awards at the provincial level or above……",
      zh: "十余项省部级及以上奖项……",
    },
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
