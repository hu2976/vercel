// ============================================
// 个人网站内容配置 —— 想改文案/图片，改这里就行
// 图片放到 public/images/ 下，然后把对应字段填成 "/images/xxx.jpg"
// 字段留空（null 或 ""）会自动显示占位图，不会报错
// =============================================

const config = {
  // 基本信息
  name: "Hujinghan",
  nameZh: "胡静函",

  // 首页左侧花体字问候语
  greeting: {
    hi: "Hi，你好",
    intro: "我是胡静函",
  },

  // 首页右侧个人照片（放到 public/images/ 后填路径，如 "/images/portrait.jpg"）
  photo: "/images/portrait.jpg",

  // 个人简介：英文默认展示，鼠标悬停浮现中文
  bio: `Hi, I'm Hu Jinghan — a devoted fan of iced Americano, and you're warmly welcome to my little world.

I find joy in deep conversations and unhurried walks. I keep a curious eye on nutrition and technology, and I fall for almost every new thing I meet — because I believe learning is a lifelong journey, and curiosity is what keeps life vivid.

In my spare time, I gather my hobbies and small victories right here. And I truly believe that both you, reading this page, and I, who built it, are walking toward the future we imagine.`,

  bioZh: `你好，我是胡静函，一个冰美式唯粉，欢迎来到我的小世界。

我喜欢深度的交谈与漫无目的的散步。我关注营养与科技的发展，热爱探索一切新鲜事物——因为我相信，学习是一生的旅程，而好奇心让生活始终鲜活。

闲暇时，我会把我的爱好与一个个小成就都收藏在这里。我也真心相信：正在浏览这个页面的你，和亲手创建它的我，都会走向我们所憧憬的未来。`,

  // 联系方式（首页点击方框浮现）
  contact: {
    phone: "13521752976",
    email: "13521752976@163.com",
    xiaohongshu: "小猫酥皮酱",
  },

  social: {
    github: "https://github.com/hu2976",
    email: "13521752976@163.com",
  },

  // 教育背景时间线：小学/初中/高中为装饰性小节点；本科为详细卡片；硕士及未来待解锁
  timeline: {
    minor: [
      { label: "小学" },
      { label: "初中" },
      { label: "高中" },
    ],
    current: {
      stage: "本科",
      school: "北京工商大学",
      college: "食品与健康学院",
      major: "食品营养与健康",
    },
    future: [
      { label: "硕士" },
      { label: "……" },
    ],
    note: "期待解锁未来更加丰富的自己",
  },

  // 技能（首页以标签展示，中文）
  skills: [
    "营养学知识",
    "公开演讲",
    "主持采访",
    "文案写作",
    "活动策划",
    "跨部门沟通",
    "创新思维",
    "氛围编程 Vibe Coding",
    "美工设计 Design",
    "普通话一级乙等",
    "计算机二级",
    "英语六级",
  ],

  // 荣誉奖项（中文）
  awards: [
    "TEDx 演讲者",
    "四项发明专利",
    "一等奖学金",
    "全国「挑战杯」竞赛特等奖、一等奖及二等奖",
    "北京市营养师技能大赛第一名",
    "十余项省部级及以上奖项……",
  ],

  // 四维度个人故事：首页四个泡泡 → 点击进入 /story/:slug 独立页面
  stories: [
    {
      slug: "spotlight",
      title: "聚光灯下的独白",
      emoji: "🎤",
      tagline: "从 TEDx 红毯到晚会舞台，用声音去影响人",
      cover: null, // "/images/story-spotlight.jpg"
      gallery: [
        "/images/spotlight-1.jpg",
        "/images/spotlight-2.jpg",
        "/images/spotlight-3.jpg",
        "/images/spotlight-4.jpg",
        "/images/spotlight-5.jpg",
        "/images/spotlight-6.jpg",
        "/images/spotlight-7.jpg",
        "/images/spotlight-8.jpg",
        "/images/spotlight-9.jpg",
      ],
      paragraphs: [
        "站在 TEDx 那个标志性的红圆毯上，灯光打下来，台下是几百双期待的眼睛。那一刻，我讲的不是专业术语，而是「拒绝被定义，挣脱完美身材的枷锁」。是的，我是那个站上世界级思想分享舞台的演讲者，也是拿下两项市级演讲比赛银奖的分享者。",
        "聚光灯下的我，有多种多样的身份。我是房山区公安反诈短剧里的新手骗子，是学校话剧《龙须沟畔的读书声》里的女主角大妞子，是学校所有晚会那个永远不会消失的主持人，周末还会跑去相声园子串场主持。",
        "作为味来 π 宣讲团的团长，我带着团队从全市 88 所高校 200 支队伍里冲出来，拿下了北京市科学家精神宣讲优秀团队。站在台上，我学会了如何用声音去影响人，更懂得了如何用表达去点亮世界。聚光灯于我，不是炫耀，而是一种分享的邀请。",
      ],
      keywords: ["TEDx 演讲者", "市级演讲银奖", "话剧女主角", "反诈宣传员", "宣讲团团长"],
    },
    {
      slug: "partner",
      title: "青春合伙人",
      emoji: "🚀",
      tagline: "从校园媒体到乡村振兴，敢想敢干的「爱折腾」合伙人",
      cover: null,
      gallery: [
        "/images/partner-1.jpg",
        "/images/partner-2.jpg",
        "/images/partner-3.jpg",
        "/images/partner-4.jpg",
        "/images/partner-5.jpg",
        "/images/partner-6.jpg",
        "/images/partner-7.jpg",
      ],
      paragraphs: [
        "如果说校园是一个微缩的社会，那我大概是那个最「爱折腾」的合伙人。我的「商业版图」从校园媒体延伸到科研一线：作为学通社副社长和广播台录播部部长，我用声音和文字串联起校园的每个角落；作为食品科研社的副社长，我带着 200 多名社员去北京中医药大学跨校交流，在感官评价里寻找科学的乐趣。",
        "我从不满足于纸上谈兵——大二暑假，我作为「金穗银康」实践团的本科生团长，带着 15 名队员一头扎进平谷和大兴的村子里，待了整整两个月，给洪水受灾群众做营养支持，写出的调研报告不仅被《前线》杂志报道，还让村委会采纳了我们的建议。",
        "在科创这条路上，我同样「卷」得风生水起：作为多个省部级创赛项目的负责人，我还是学校科创导师团里最年轻的国奖负责人。青春合伙人的底色，就是敢想敢干。",
      ],
      keywords: ["学通社副社长", "食品科研社副社长", "乡村振兴实践团长", "科创项目负责人", "斜杠青年"],
    },
    {
      slug: "flavor-lab",
      title: "风味实验室",
      emoji: "🔬",
      tagline: "试管、天平与舌尖上的万般风味，「没有坏食物，只有坏认知」",
      cover: null,
      gallery: [
        "/images/flavor-lab-1.jpg",
        "/images/flavor-lab-2.jpg",
        "/images/flavor-lab-3.jpg",
        "/images/flavor-lab-4.jpg",
        "/images/flavor-lab-5.jpg",
        "/images/flavor-lab-6.jpg",
        "/images/flavor-lab-7.jpg",
      ],
      paragraphs: [
        "我的实验室里，不只有试管和天平，还有舌尖上的万般风味。作为北京市营养师技能大赛学生组的第一名，我信仰一句话：「没有坏食物，只有坏认知。」我把这个信念揉进了我的竞赛项目里——作为负责人拿下「挑战杯」揭榜挂帅国赛一等奖的《粮芯稻》，我们用多模态 AI 给大米的风味做基因级别的质控；作为答辩人拿下主赛道国赛二等奖的《新膳》，我们解锁如何用重组蛋白为糖尿病患者点亮控糖的新可能。",
        "我的毕设方向是咖啡，在中粮营养健康研究院的感官实验室里，我每天泡在咖啡杯测桌上，设计水质对照实验，用 QDA（定量描述分析）去拆解一杯咖啡风味的成因。除此之外，我还在「中国好原料」「口服美容」「Proveg」等食品创新大赛里拿奖拿到手软，从酵母蛋白到富色食品，从质构改良到新蛋白应用，几乎把食品创新的各个赛道都跑了一遍。风味实验室，就是我的游乐场。",
      ],
      keywords: ["北京市营养师第一", "「挑战杯」国赛一/二等奖", "咖啡毕设研究者", "中粮感官评价员", "食品创新大赛奖项收割机"],
    },
    {
      slug: "intern",
      title: "职场练习生",
      emoji: "💼",
      tagline: "从实验室到互联网大厂，每一段实习都是不同颜色的拼图",
      cover: null,
      gallery: [
        "/images/intern-1.jpg",
        "/images/intern-2.jpg",
        "/images/intern-3.jpg",
        "/images/intern-4.jpg",
        "/images/intern-5.jpg",
        "/images/intern-6.jpg",
        "/images/intern-7.jpg",
        "/images/intern-8.jpg",
      ],
      paragraphs: [
        "走出校园，步入实习，每一段都是不同颜色的拼图。食品研发员的身份让我接触产业视角；感官评测员的身份让我解锁风味轮盘；随后在东方甄选，我变身稽查员，每天和海量资质文件、市场监管条例打交道，利用 AI 工具批量筛查风险，建立了对食品行业规则的敬畏。",
        "但真正让我爆发式成长的，是在 Keep（AI 平台事业部）的运营实习。当我发现 Keep 的食物库里中餐几乎一片空白时，我决定从 0 到 1 自己干。我搭建了覆盖煎炒炸的中餐食物库框架，设计了「生食材 × 烹调系数」的自动化营养计算模型，甚至还用 Claude Code 写了批量处理脚本。最终，12 万条数据被成功审核上线，处理效率提升了 60%。",
        "从实验室到质检部，再到互联网大厂，每一段经历都在拓展我的无限可能。",
      ],
      keywords: ["Keep 运营实习生", "搭建 12 万条中餐食物库", "东方甄选食品合规", "中粮感官评价员", "数据分析与 AI 提效"],
    },
  ],

  // Design 设计作品（等作品文件夹到位后补充，图片放 public/images/ 下）
  designs: [
    { title: "视觉设计 ①", image: "/images/design-1.jpg", tags: ["平面设计"] },
    { title: "视觉设计 ②", image: "/images/design-2.jpg", tags: ["平面设计"] },
    { title: "新质蛋白肉", image: "/images/design-3.jpg", tags: ["海报设计"] },
    { title: "植得吃", image: "/images/design-4.jpg", tags: ["海报设计"] },
    { title: "粮芯稻", image: "/images/design-5.jpg", tags: ["海报设计"] },
    { title: "新膳", image: "/images/design-6.jpg", tags: ["海报设计"] },
    { title: "红壶相声社", image: "/images/design-7.jpg", tags: ["视觉设计"] },
    { title: "咖佤艺", image: "/images/design-8.jpg", tags: ["视觉设计"] },
    { title: "黔品", image: "/images/design-9.jpg", tags: ["视觉设计"] },
  ],

  // Vibecoding 作品集（原 Works）。file 指向 public/works 下的静态页面，在 /vibecoding/:slug 内嵌展示
  works: [
    {
      slug: "nutrition-exam-practice",
      title: "2026 注册营养师 · 考点配套练习",
      description: "把「注册营养师考试宝典」全 159 个考点的配套习题整理成一套可交互刷题页：按 7 大板块（营养学基础、食物营养价值、特殊人群与环境营养、公共营养、临床营养、营养与慢性病、食品卫生）分类，共 730 道真题。默认只显示题干与选项，点「查看答案及解析」逐题展开答案与解析；选项可点选，展开后自动标注正误。纯前端单文件实现。",
      tags: ["Nutrition", "Quiz", "练习题"],
      file: "/works/files/nutrition-exam-practice.html",
      date: "2026-07-22",
    },
    {
      slug: "global-mortality-race",
      title: "近30年全球全因死亡率 · 动态排行",
      description: "基于 IHME 全球疾病负担研究（GBD 2023）的年龄标准化全因死亡率，1994–2023 逐年 Top 15 国家的条形图竞赛动画：按地区着色、含国旗、名次与地区构成变化，直观呈现撒哈拉以南非洲与冲突国家长期高居榜首。数据经 Our World in Data 指标接口获取，纯前端单文件实现。",
      tags: ["Data Viz", "GBD", "Bar Chart Race"],
      file: "/works/files/global-mortality-race.html",
      date: "2026-07-16",
    },
    {
      slug: "nutrition-engine-eval",
      title: "食物营养估算引擎 · 评测仪表盘",
      description: "一套针对「食物营养估算」大模型能力的评测方案：覆盖多种烹饪方式对热量的影响，含测试用例、真值标注与自动评分，最终汇总成可交互的评测看板。",
      tags: ["Nutrition", "LLM Eval", "Dashboard"],
      file: "/works/files/nutrition-engine-eval.html",
      date: "2026-07-06",
    },
  ],

  // 站点信息
  site: {
    title: "胡静函 | 个人主页",
    description: "胡静函的个人主页 —— 营养、科技、生活与热爱",
    domain: "hujinghan0312.top",
  },
};

export default config;
