import { motion, useScroll, useSpring } from 'motion/react';
import { STACK_ICONS } from '../data';

export function SectionHeader({ tag, num, title }: { tag: string; num: string; title: string }) {
  return (
    <motion.div 
      initial={{ x: -20 }}
      whileInView={{ x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mb-6"
    >
      <span className="font-mono text-[0.65rem] text-brand tracking-[0.22em] uppercase">
        // {num}. {tag}
      </span>
      <h2 className="font-mono text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold text-text-main m-0 mt-1.5 tracking-tight leading-[1.1]">
        {title}
      </h2>
    </motion.div>
  );
}

export function Marquee() {
  const items = [...STACK_ICONS, ...STACK_ICONS, ...STACK_ICONS];
  
  return (
    <div className="w-full overflow-hidden border-y border-border-subtle py-3.5 my-0 flex">
      <div className="flex gap-10 whitespace-nowrap animate-[marquee_22s_linear_infinite] w-max">
        {items.map((item, i) => (
          <span key={i} className="font-mono text-[0.72rem] text-text-muted tracking-[0.12em]">
            <span className="text-brand mr-2">◆</span>{item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
}

export function ScrollProgressBar() {
  const {scrollYProgress} = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-brand origin-left z-[100] will-change-transform"
      style={{scaleX}}
    />
  );
}