export const SKILLS = [
  { name: "JavaScript", pct: 80, cat: "Language", icon: "⬢" },
    { name: "TypeScript", pct: 75, cat: "Language", icon: "⬢" },
   { name: "Html", pct: 55, cat: "Language", icon: "⬢" },
   { name: "Css", pct: 50, cat: "Language", icon: "⬢" },
   { name: "Dart", pct: 70, cat: "Language", icon: "⬢" },
  { name: "Node.js", pct: 85, cat: "Framework", icon: "⬢" },
  { name: "Next.js", pct: 75, cat: "Framework", icon: "⬢" },
  { name: "Flutter", pct: 65, cat: "Framework", icon: "⬢" },
];

export const STATS = [
  { val: "10+", label: "Projects" },
  { val: "8 Yrs", label: "Self-Taught" },
];

export const PROJECTS = [
  {
    title: "Zqwis - Frontend",
    desc: "A sleek cross-platform mobile application developed with Flutter and Dart. It serves as the primary interface for the Zqwis API ecosystem, featuring real-time monitoring, state management with Provider, and smooth animations. Supports complex data visualization and secure API key management.",
    tags: ["Flutter", "Dart", "Dio"],
    category: "Mobile",
    icon: "⬡",
    highlight: true,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    github: "https://github.com/kagenouReal/zqwis-mobile"
  },
  {
    title: "Zqwis - Backend",
desc: "A REST API ecosystem built with Next.js and TypeScript. Features bot automation via Baileys/Telegraf, reverse API integration for accessing external service endpoints, and web scraping using Cheerio/Axios. Includes user authentication with Next-Auth and data storage using Better-SQLite3. Built for practical API development and automation workflows.",
    tags: ["Next.js", "TypeScript", "SQLite"],
    category: "Backend",
    icon: "⬡",
    highlight: true,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    github: "https://github.com/kagenouReal/Zqwis-Apis-Backend"
  }
];

export const CONTACTS = [
  { label: "GitHub", val: "kagenouReal", href: "https://github.com/kagenouReal", icon: "⬡" },
  { label: "Telegram", val: "@kagenouonly", href: "https://t.me/kagenouonly", icon: "◎" },
  { label: "WhatsApp", val: "+60 111-226-0297", href: "https://wa.me/601112260297", icon: "◉" },
  { label: "TikTok", val: "@veryy_lazyy", href: "https://www.tiktok.com/@veryy_lazyy", icon: "◈" },
];

export const STACK_ICONS = [
  "JavaScript", "TypeScript", "Html", "Css", " Dart", "Node.js", "Next.js", "Flutter", "Linux"
];

export const PLAYLIST = [
  {
    title: "Multo",
    artist: "Cup of Joe",
    url: "/music/multo.mp3",
    cover: "/music/multo.jpg"
  },
  {
    title: "Multo (Indo Cover)",
    artist: "Darlyne Nightbloom",
    url: "/music/multo-cover.mp3",
    cover: "/music/multo-cover.jpg"
  }
];
