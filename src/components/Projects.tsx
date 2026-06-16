import SectionHeader from './SectionHeader';
import { PROJECTS } from '../data';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useState, useEffect, MouseEvent } from 'react';

function ProjectCard({ p, index, onClick }: { p: any, index: number, onClick: () => void, key?: string | number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      whileHover={{ y: -4, boxShadow: '0 16px 48px var(--color-brand-glow)' }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[14px] p-6 border transition-all duration-300 cursor-pointer ${
        p.highlight ? 'bg-brand/5 border-brand/20' : 'bg-card-bg border-border-subtle'
      } hover:border-[rgba(192,78,16,0.35)] hover:bg-card-hover`}
    >
      {p.highlight && (
        <span className="absolute top-3 right-3 font-mono text-[0.58rem] py-[2px] px-2 rounded-[3px] bg-brand/10 text-brand border border-brand/20 tracking-[0.1em]">
          FEATURED
        </span>
      )}
      
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-[linear-gradient(90deg,transparent,var(--color-brand),transparent)] opacity-0 group-hover:opacity-50 transition-opacity duration-350" />
      
      <div className="text-[1.6rem] mb-3">{p.icon}</div>
      <h3 className="font-mono text-[0.88rem] text-text-main mb-2.5 tracking-[0.01em]">{p.title}</h3>
      <p className="text-[0.78rem] text-text-muted leading-[1.72] mb-4 font-sans line-clamp-3">{p.desc}</p>
      
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {p.tags.map((tag: string) => (
          <span 
            key={tag} 
            className="font-mono text-[0.6rem] py-[2px] px-2 rounded bg-brand/10 text-brand border border-brand/20 tracking-[0.07em]"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function ProjectModal({ p, onClose }: { p: any, onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!p) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 pointer-events-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-4xl bg-bg-main border border-border-subtle rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] pointer-events-auto"
      >
        {/* Image side */}
        {p.image && (
          <div className="md:w-1/2 bg-card-bg border-b md:border-b-0 md:border-r border-border-subtle overflow-hidden relative group min-h-[200px]">
             <img src={p.image.replace('|auto', '&auto=format')} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
             <div className="absolute bottom-6 left-6 text-4xl drop-shadow-md">{p.icon}</div>
          </div>
        )}
        
        {/* Content side */}
        <div className="p-8 md:p-10 md:w-1/2 flex flex-col overflow-y-auto">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-border-subtle/30 text-text-muted hover:text-text-main hover:bg-border-subtle transition-colors z-20"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 1L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <h2 className="text-[1.6rem] sm:text-[1.8rem] font-mono font-bold text-text-main mb-6 tracking-tight leading-[1.2] mt-2 pr-6">
            {p.title}
          </h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {p.tags.map((tag: string) => (
              <span key={tag} className="font-mono text-[0.65rem] py-1 px-2.5 rounded bg-brand/10 text-brand border border-brand/20 tracking-[0.05em] uppercase">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="text-text-muted font-sans leading-[1.8] flex-1">
            <p className="whitespace-pre-line text-[0.9rem]">{p.desc}</p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border-subtle flex justify-end gap-3">
             {p.github && (
               <a 
                 href={p.github}
                 target="_blank"
                 rel="noreferrer"
                 className="px-6 py-2.5 bg-brand text-white font-mono text-[0.7rem] rounded-md tracking-[0.08em] uppercase transition-all hover:shadow-[0_4px_16px_var(--color-brand-glow)] flex items-center gap-2"
               >
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                 View Code
               </a>
             )}
             <button 
               onClick={onClose}
               className="px-6 py-2.5 bg-card-bg border border-border-subtle text-text-main font-mono text-[0.7rem] rounded-md tracking-[0.08em] uppercase transition-colors hover:border-brand hover:text-brand"
             >
               Close
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))];

  const filteredProjects = activeCategory === 'All' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 px-10 max-w-[1000px] mx-auto z-10 relative">
      <SectionHeader num="3" tag="projects" title="What I've Built" />
      
      <div className="flex flex-wrap gap-2.5 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full font-mono text-[0.7rem] uppercase tracking-[0.08em] transition-all duration-300 ${
              activeCategory === cat 
                ? 'bg-brand/10 text-brand border border-brand/30 shadow-[0_0_12px_rgba(192,78,16,0.15)]' 
                : 'bg-card-bg text-text-muted border border-border-subtle hover:border-[rgba(192,78,16,0.35)] hover:text-text-main'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div layout className="grid md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((p, i) => (
            <motion.div
              key={p.title}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard p={p} index={i} onClick={() => setSelectedProject(p)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal p={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
