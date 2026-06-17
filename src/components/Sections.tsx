import { motion, Variants, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useState, useEffect, MouseEvent } from 'react';
import { SKILLS, PROJECTS, CONTACTS, STACK_ICONS } from '../data';
import { SectionHeader } from './DisplayUtils';
import { Glitch } from './VisualEffects';

// --- SHARED VARIANTS ---
const container: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.1 
    } 
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring",
      stiffness: 260,
      damping: 20
    } 
  }
};

const softInfinite: Variants = {
  animate: {
    y: [0, -4, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// --- HERO SECTION ---
export function Hero() {
  const fullText = "Vibe Coder | Backend & Frontend";
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTyped(fullText.slice(0, Math.ceil(i)));
      i += 0.5;
      if (i > fullText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="flex items-center px-6 md:px-10 max-w-[1100px] mx-auto z-10 py-6">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid lg:grid-cols-2 gap-4 items-center w-full"
      >
        <div>
          <motion.div variants={item} className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-lg border border-brand bg-brand/5 shadow-[0_0_15px_rgba(139,157,119,0.1)]">
            <span className="font-mono text-[0.6rem] text-brand tracking-[0.1em] uppercase animate-pulse">// Just'a Vibe Coder From — Kelantan, MY</span>
          </motion.div>
          
          <motion.div variants={item}>
            <motion.h1 
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="text-[clamp(3rem,8vw,5rem)] font-bold leading-[0.9] mb-4 tracking-tighter text-text-main will-change-transform"
            >
              <Glitch text="Kagenou" />
              <motion.div 
                className="mt-8 text-[clamp(1rem,2.5vw,1.2rem)] text-text-muted font-mono font-medium flex items-center gap-2 will-change-transform"
              >
                <span className="w-2 h-2 rounded-full bg-brand animate-ping"></span>
                {typed}<span className="animate-pulse text-brand">_</span>
              </motion.div>
            </motion.h1>
          </motion.div>

          <motion.p 
            variants={item}
            className="text-[0.9rem] text-text-muted max-w-[480px] leading-relaxed mb-2 border-l-2 border-brand/20 pl-4 will-change-[opacity,transform]"
          >
            Breaking down complex API architectures, bypassing security restrictions, and building practical automation ecosystems. Turning deep-dive research into scalable technical solutions.
          </motion.p>
        </div>

        <motion.div 
          variants={item}
          className="hidden lg:block"
        >
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 0.5, 0, -0.5, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative group will-change-transform"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-brand to-brand-soft rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-card-bg backdrop-blur-xl border border-border-subtle rounded-xl shadow-2xl overflow-hidden font-mono text-[0.7rem] text-text-muted">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border-subtle bg-bg-sub/50">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50 animate-pulse"></div>
                </div>
                <div className="text-[0.55rem] uppercase opacity-40 ml-2 font-bold tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand/50 animate-ping"></span>
                  ssh root@kagenou
                </div>
              </div>
              <div className="p-6 space-y-2">
                <div className="flex gap-3"><span className="opacity-20">01</span><p><span className="text-brand">class</span> <span className="text-text-main font-bold">Developer</span> {"{"}</p></div>
                <div className="flex gap-3"><span className="opacity-20">02</span><p className="pl-4"><span className="text-text-main">constructor</span>() {"{"}</p></div>
                <div className="flex gap-3"><span className="opacity-20">03</span><p className="pl-8"><span className="text-brand italic">this</span>.<span className="text-text-main">alias</span> = <span className="text-brand-soft font-medium">'Kagenou'</span>;</p></div>
                <div className="flex gap-3"><span className="opacity-20">04</span><p className="pl-8 text-text-muted italic">// Age — 16 years old / 2010</p></div>
                <div className="flex gap-3"><span className="opacity-20">05</span><p className="pl-8"><span className="text-brand italic">this</span>.<span className="text-text-main">status</span> = <span className="text-brand-soft animate-pulse">'Always Coding'</span>;</p></div>
                <div className="flex gap-3"><span className="opacity-20">06</span><p className="pl-8"><span className="text-brand italic">this</span>.<span className="text-text-main">focus</span> = [<span className="text-brand-soft">'API'</span>, <span className="text-brand-soft">'Automation'</span>];</p></div>
                <div className="flex gap-3"><span className="opacity-20">07</span><p className="pl-4">{"}"}</p></div>
                <div className="flex gap-3"><span className="opacity-20">08</span><p>{"}"}</p></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// --- ABOUT SECTION ---
export function About() {
  const paragraphs = [
"I'm a self-taught full-stack developer who enjoys building and experimenting with code. After leaving formal school at age 8, I went through a period of regret about stepping away from education. In 2024, I decided to turn that experience into motivation, fully dedicating myself to learning software development and treating technology as my main creative space.",

"I work across both backend and frontend development, using technologies like Node.js, Flutter (Dart), Next.js, HTML, and CSS. A big part of my workflow involves building automation tools, web scraping, and analyzing third-party APIs to understand and extend their functionality. I also actively use AI tools such as ChatGPT, Gemini, Claude, and DeepSeek to speed up learning, improve problem-solving, and enhance productivity."
  ];

  const info = [
    ["Name", "Irsyad Adam Hakimi"],
    ["age", "16 years old / 2010"],
    ["Location", "Kelantan, Malaysia"],
    ["Focus", "Backend Automation"],
  ];

  return (
    <section id="about" className="py-6 px-6 md:px-10 max-w-[1000px] mx-auto z-10 relative">
      <SectionHeader num="1" tag="about" title="Who am I" />
      <div className="flex flex-col gap-8">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 gap-3"
        >
          {info.map(([k, v], i) => (
            <motion.div 
              key={k} 
              variants={item}
              whileHover={{ scale: 1.02, y: -2 }}
              className="flex flex-col justify-center gap-0.5 px-3 py-2 rounded-lg border border-brand/40 bg-brand/5 w-full shadow-[0_0_10px_rgba(139,157,119,0.05)] will-change-transform transition-colors hover:border-brand"
            >
              <span className="font-mono text-[0.45rem] text-text-muted tracking-[0.1em] uppercase">// {k} —</span>
              <span className="font-mono text-[0.65rem] sm:text-[0.6rem] text-brand font-medium tracking-wide">{v}</span>
            </motion.div>
          ))}
        </motion.div>
        <div className="space-y-6 max-w-[800px]">
          {paragraphs.map((p, i) => (
            <motion.p 
              key={i} 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="text-text-muted leading-relaxed text-[0.95rem] border-l-2 border-brand/10 pl-6"
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- SKILLS SECTION ---
function SkillBar({ name, pct, cat, delay }: { name: string, pct: number, cat: string, delay: number }) {
  const colorClass = cat === 'Language' ? 'bg-brand' : 'bg-brand-soft';
  const textColorClass = cat === 'Language' ? 'text-brand' : 'text-brand-soft';
  return (
    <motion.div variants={item} className="mb-[1rem]">
      <div className="flex justify-between items-center mb-[0.3rem]">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-[1px] ${colorClass} rotate-45 inline-block`}></span>
          <span className="font-mono text-[0.7rem] sm:text-[0.78rem] text-text-main tracking-[0.02em]">{name}</span>
        </div>
        <span className={`font-mono text-[0.65rem] sm:text-[0.7rem] ${textColorClass} opacity-85`}>{pct}%</span>
      </div>
      <div className="h-[2px] bg-border-subtle rounded-[2px] overflow-hidden relative">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }} 
          viewport={{ once: false }}
          transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.2 }}
          className={`h-full rounded-[2px] ${colorClass} relative`}
        >
          <motion.div 
            animate={{ left: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Skills() {
  const otherSkills = ["Termux", "MT Manager", "Reqable", "Eruda", "Gemini", "Claude"];
  return (
    <section id="skills" className="py-6 px-6 md:px-10 border-y border-border-subtle/50 transition-colors">
      <div className="max-w-[1000px] mx-auto z-10 relative">
        <SectionHeader num="2" tag="skills" title="Tech Stack" />
        <div className="flex gap-4 md:gap-6 mb-4 flex-wrap">
          {[["Language", "bg-brand"], ["Framework", "bg-brand-soft"]].map(([cat, c]) => (
            <div key={cat} className="flex items-center gap-[7px]">
              <span className={`w-2 h-2 rounded-[2px] ${c} rotate-45 inline-block`}></span>
              <span className="font-mono text-[0.6rem] sm:text-[0.67rem] text-text-muted opacity-80">{cat}</span>
            </div>
          ))}
        </div>
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 gap-x-4 gap-y-1"
        >
          {SKILLS.map((s, i) => <SkillBar key={s.name} {...s} delay={i * 80} />)}
        </motion.div>
        <div className="mt-4">
          <p className="font-mono text-[0.65rem] text-text-muted opacity-80 tracking-[0.14em] uppercase mb-[1.5rem]">Also working with</p>
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {otherSkills.map((s, i) => (
              <motion.div 
                key={s} 
                variants={item}
                whileHover={{ y: -3, scale: 1.02 }}
                className="flex flex-col justify-center gap-0.5 px-3 py-2 rounded-lg border border-brand/40 bg-brand/5 shadow-[0_0_10px_rgba(139,157,119,0.05)] w-full will-change-transform transition-colors hover:border-brand"
              >
                <span className="font-mono text-[0.45rem] text-text-muted tracking-[0.1em] uppercase">// {['Gemini', 'Claude'].includes(s) ? 'Helper' : 'Tool'} —</span>
                <span className="font-mono text-[0.65rem] text-brand font-medium tracking-wide">{s}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --- PROJECTS SECTION ---
function ProjectCard({ p, index, onClick }: { p: any, index: number, onClick: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  return (
    <motion.div 
      variants={item}
      whileHover={{ y: -8, scale: 1.01 }} 
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={() => { x.set(0); y.set(0); }} 
      onClick={onClick} 
      className="group relative overflow-hidden rounded-xl p-7 border transition-all duration-300 cursor-pointer border-brand bg-brand/5 hover:border-brand/60 hover:bg-brand/10 will-change-transform shadow-[0_0_15px_rgba(139,157,119,0.1)]"
    >
      {p.highlight && <span className="absolute top-4 right-4 font-mono text-[0.5rem] py-1 px-2.5 rounded border border-brand/30 text-text-muted tracking-[0.1em] font-medium uppercase">// FEATURED</span>}
      <div className="flex items-center gap-3 mb-3">
        <div className="text-xl group-hover:scale-110 transition-transform duration-300">{p.icon}</div>
        <h3 className="font-bold text-[1rem] text-brand tracking-tight">{p.title}</h3>
      </div>
      <p className="text-[0.8rem] text-text-muted leading-relaxed mb-6 line-clamp-2 opacity-80">{p.desc}</p>
      <div className="flex flex-wrap gap-2">
        {p.tags.slice(0, 3).map((tag: any) => <span key={tag} className="font-mono text-[0.5rem] py-1 px-2.5 rounded border border-brand/30 bg-brand/5 text-text-muted transition-colors uppercase tracking-wider">{tag}</span>)}
      </div>
    </motion.div>
  );
}

function ProjectModal({ p, onClose }: { p: any, onClose: () => void }) {
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-none">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-bg-main/60 backdrop-blur-md cursor-pointer pointer-events-auto" />
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative w-full max-w-4xl bg-card-bg/80 backdrop-blur-2xl border border-brand/20 rounded-3xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.2)] flex flex-col md:flex-row max-h-[90vh] pointer-events-auto">
        <div className="md:w-[45%] bg-bg-sub/30 relative min-h-[200px] md:min-h-full overflow-hidden border-b md:border-b-0 md:border-r border-brand/10">
          {p.image && <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100" />}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-main/40 via-transparent to-transparent" />
        </div>
        <div className="p-6 md:p-10 md:w-[55%] flex flex-col overflow-y-auto custom-scrollbar">
          <div className="mb-6 mt-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(139,157,119,0.4)]">{p.icon}</span>
              <h2 className="text-2xl md:text-3xl font-bold text-brand animate-pulse tracking-tighter">{p.title}</h2>
            </div>
            <div className="flex flex-wrap gap-2">{p.tags.map((tag: any) => <span key={tag} className="font-mono text-[0.6rem] py-1 px-3 rounded-lg bg-brand/10 text-brand border border-brand/10 uppercase tracking-widest font-bold">{tag}</span>)}</div>
          </div>
          <div className="prose prose-sm max-w-none"><p className="text-[0.9rem] text-text-muted leading-relaxed mb-8 opacity-90 border-l-2 border-brand/20 pl-4">{p.desc}</p></div>
          <div className="mt-auto pt-6 border-t border-brand/10 flex items-center justify-between gap-4">
            {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 px-6 py-2.5 bg-brand text-bg-main font-bold rounded-xl hover:shadow-[0_10px_20px_rgba(139,157,119,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg><span className="text-sm">Source Code</span></a>}
            <div className="ml-auto"><button onClick={onClose} className="text-text-muted font-bold text-sm hover:text-brand transition-colors px-4 py-2 hover:bg-brand/5 rounded-lg">Close</button></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Projects() {
  const [selected, setSelected] = useState<any>(null);
  const [cat, setCat] = useState('All');
  const categories = ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))];
  const filtered = cat === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === cat);
  return (
    <section id="projects" className={`py-6 px-6 md:px-10 max-w-[1100px] mx-auto relative transition-all duration-300 ${selected ? 'z-[100]' : 'z-10'}`}>
      <SectionHeader num="3" tag="projects" title="Featured Works" />
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(c => <button key={c} onClick={() => setCat(c)} className={`px-5 py-2 rounded-xl font-mono text-[0.65rem] uppercase tracking-widest transition-all ${cat === c ? 'bg-brand text-bg-main shadow-lg shadow-brand/20' : 'bg-card-bg text-text-muted border border-border-subtle hover:border-brand/30 hover:text-text-main'}`}>{c}</button>)}
      </div>
      <motion.div 
        layout 
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid md:grid-cols-2 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div 
              key={p.title} 
              layout 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              transition={{ duration: 0.3 }}
            >
              <ProjectCard p={p} index={i} onClick={() => setSelected(p)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>{selected && <ProjectModal p={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </section>
  );
}

// --- CONTACT SECTION ---
const CONTACT_ICONS: Record<string, React.ReactNode> = {
  GitHub: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>,
  TikTok: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>,
  Telegram: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  WhatsApp: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
};

export function Contact() {
  return (
    <section id="contact" className="py-6 px-6 md:px-10 max-w-[1000px] mx-auto z-10 relative">
      <SectionHeader num="4" tag="contact" title="Get in Touch" />
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="p-6 md:p-8 border-brand bg-brand/5 rounded-xl flex flex-col gap-6 border shadow-[0_0_15px_rgba(139,157,119,0.1)] will-change-transform"
      >
        <div><h3 className="text-[1.2rem] mb-2 text-brand font-sans font-bold tracking-tight">Let's collaborate</h3><p className="text-text-muted text-[0.85rem] leading-[1.6] max-w-[600px] border-l-2 border-brand/20 pl-4">Have a project in mind or just want to chat backend tech? My inbox is open.</p></div>
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          className="grid grid-cols-2 gap-4"
        >
          {CONTACTS.map((c: any, i: number) => (
            <motion.a 
              key={c.label} 
              href={c.href} 
              target="_blank" 
              rel="noreferrer" 
              variants={item}
              whileHover={{ y: -3, scale: 1.02 }} 
              className="flex items-center gap-2.5 p-2.5 bg-brand/5 border border-brand/30 rounded-lg text-text-main transition-all hover:border-brand/60 hover:bg-brand/10 hover:text-brand will-change-transform"
            >
              <span className="text-[1.1rem] filter drop-shadow-[0_0_8px_rgba(139,157,119,0.3)] shrink-0">{CONTACT_ICONS[c.label] || c.icon}</span>
              <div className="flex flex-col min-w-0 flex-1"><span className="font-mono text-[0.5rem] text-text-muted uppercase tracking-[0.1em] mb-0.5">// {c.label}</span><span className="font-mono text-[0.7rem] tracking-[0.01em] font-medium truncate">{c.val}</span></div>
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}