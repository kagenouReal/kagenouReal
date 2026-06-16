import { motion } from 'motion/react';
import Glitch from './Glitch';
import { useState, useEffect } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function Hero() {
  const fullText = "Vibe Coder | Backend & Frontend";
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    setTyped("");
    const id = setInterval(() => {
      if (i <= fullText.length) { 
        setTyped(fullText.slice(0, Math.floor(i))); 
        i += 0.5;
      } else {
        clearInterval(id);
      }
    }, 30);
    return () => clearInterval(id);
  }, []);

  return (
    <section 
      id="hero"
      className="min-h-[70vh] md:min-h-[80vh] flex items-center px-6 md:px-10 relative max-w-[1200px] mx-auto z-10 pt-12 md:pt-20"
    >
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center w-full">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full text-left"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded border border-brand">
            <span className="font-mono text-[0.6rem] sm:text-[0.64rem] text-text-muted tracking-[0.1em] uppercase">// Just'a Vibe Coder  From — Kelantan, MY</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-[clamp(2.5rem,10vw,5.5rem)] font-mono font-bold leading-[1] mb-5 tracking-[-0.03em] text-text-main"
          >
            <Glitch text="Kagenou" />
            <br />
            <span className="text-[clamp(0.85rem,3vw,1.3rem)] text-text-muted font-normal tracking-[0.01em] leading-none">
              {typed}<span className="animate-[blink_1s_step-end_infinite] text-brand">_</span>
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-[0.95rem] text-text-muted max-w-[500px] leading-[1.8] mb-10 font-sans"
          >
            Breaking down complex API architectures, bypassing security restrictions, and building practical automation ecosystems. Turning deep-dive research into scalable technical solutions.
          </motion.p>
          
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="hidden lg:block relative"
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-brand-glow),transparent)] rounded-2xl blur-3xl opacity-50"></div>
          <div className="relative bg-[#111111] rounded-xl border border-[#333] shadow-2xl overflow-hidden font-mono text-xs text-[#a3a3a3]">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#222] bg-[#0c0c0c]">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="text-[0.65rem] tracking-wider uppercase opacity-50">kernel_task</div>
            </div>
            {/* Terminal Body */}
            <div className="p-5 flex flex-col gap-2">
              <div className="flex gap-4">
                <span className="text-[#444] select-none">1</span>
                <div><span className="text-[#845ef7]">const</span> <span className="text-[#339af0]">developer</span> = <span className="text-[#845ef7]">await</span> <span className="text-[#339af0]">Developer</span>.<span className="text-[#fab005]">init</span>({"{"}</div>
              </div>
              <div className="flex gap-4">
                <span className="text-[#444] select-none">2</span>
                <div className="pl-6"><span className="text-[#a5d8ff]">name:</span> <span className="text-[#69db7c]">'Kagenou'</span>,</div>
              </div>
              <div className="flex gap-4">
                <span className="text-[#444] select-none">3</span>
                <div className="pl-6"><span className="text-[#a5d8ff]">age:</span> <span className="text-[#ffd43b]">16</span>,</div>
              </div>
              <div className="flex gap-4">
                <span className="text-[#444] select-none">4</span>
                <div className="pl-6"><span className="text-[#a5d8ff]">focus:</span> [<span className="text-[#69db7c]">'Reverse Eng'</span>, <span className="text-[#69db7c]">'Backend API'</span>],</div>
              </div>
              <div className="flex gap-4">
                <span className="text-[#444] select-none">5</span>
                <div>{"}"});</div>
              </div>
              <div className="flex gap-4 mt-2">
                <span className="text-[#444] select-none">6</span>
                <div><span className="text-[#845ef7]">if</span> (<span className="text-[#339af0]">developer</span>.<span className="text-[#a5d8ff]">ready</span>) {"{"}</div>
              </div>
              <div className="flex gap-4">
                <span className="text-[#444] select-none">7</span>
                <div className="pl-6"><span className="text-[#339af0]">console</span>.<span className="text-[#fab005]">log</span>(<span className="text-[#69db7c]">'Ready to ship. 🚀'</span>);</div>
              </div>
              <div className="flex gap-4">
                <span className="text-[#444] select-none">8</span>
                <div>{"}"}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
