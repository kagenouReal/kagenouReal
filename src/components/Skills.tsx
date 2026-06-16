import SectionHeader from './SectionHeader';
import { SKILLS } from '../data';
import { motion } from 'motion/react';

function SkillBar({ name, pct, cat, delay }: { name: string, pct: number, cat: string, delay: number }) {
  const colorClass = cat === 'Language' ? 'bg-brand' : 'bg-brand-soft';
  const textColorClass = cat === 'Language' ? 'text-brand' : 'text-brand-soft';
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.001, duration: 0.5 }}
      className="mb-[1rem]"
    >
      <div className="flex justify-between items-center mb-[0.3rem]">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-[1px] ${colorClass} rotate-45 inline-block`}></span>
          <span className="font-mono text-[0.7rem] sm:text-[0.78rem] text-text-main tracking-[0.02em]">{name}</span>
        </div>
        <span className={`font-mono text-[0.65rem] sm:text-[0.7rem] ${textColorClass} opacity-85`}>{pct}%</span>
      </div>
      <div className="h-[2px] bg-border-subtle rounded-[2px] overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: delay * 0.001, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-[2px] ${colorClass}`}
        />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const otherSkills = [
    "REST API", "Web Scraping", "API Reverse Eng.", "Automation", 
   "Data extraction", "Termux - Ubuntu Chroot"
  ];

  return (
    <section id="skills" className="py-20 px-6 md:px-10 border-y border-border-subtle/50 transition-colors">
      <div className="max-w-[1000px] mx-auto z-10 relative">
        <SectionHeader num="2" tag="skills" title="Tech Stack" />

        <div className="flex gap-4 md:gap-6 mb-8 flex-wrap">
          {[
            ["Language", "bg-brand"],
            ["Framework", "bg-brand-soft"]
          ].map(([cat, c]) => (
            <div key={cat} className="flex items-center gap-[7px]">
              <span className={`w-2 h-2 rounded-[2px] ${c} rotate-45 inline-block`}></span>
              <span className="font-mono text-[0.6rem] sm:text-[0.67rem] text-text-muted opacity-80">{cat}</span>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-x-12 md:gap-x-16 gap-y-1">
          {SKILLS.map((s, i) => (
            <SkillBar key={s.name} {...s} delay={i * 80} />
          ))}
        </div>

        <div className="mt-10 p-6 bg-card-bg border border-border-subtle rounded-xl">
          <p className="font-mono text-[0.65rem] text-text-muted opacity-80 tracking-[0.14em] uppercase mb-[1rem]">
            Also working with
          </p>
          <div className="flex flex-wrap gap-[0.5rem]">
            {otherSkills.map(s => (
              <span 
                key={s} 
                className="font-mono text-[0.63rem] py-1 px-3 rounded-md bg-border-subtle/50 text-text-muted border border-border-subtle tracking-[0.04em]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
