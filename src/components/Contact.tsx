import SectionHeader from './SectionHeader';
import { CONTACTS } from '../data';
import { motion } from 'motion/react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 md:px-10 max-w-[1000px] mx-auto z-10 relative">
      <SectionHeader num="4" tag="contact" title="Get in Touch" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="p-6 md:p-10 bg-card-bg border border-border-subtle rounded-[14px] flex flex-col gap-8"
      >
        <div>
          <h3 className="text-[1.2rem] mb-2 text-text-main font-sans font-medium tracking-tight">Let's collaborate</h3>
          <p className="text-text-muted text-[0.85rem] leading-[1.6] max-w-[600px]">
            Whether you have a project in mind, need help with Reverse Engineering, or just want to chat backend tech — my inbox is open.
          </p>
        </div>
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {CONTACTS.map((c, i) => (
            <motion.a 
              key={c.label} 
              href={c.href} 
              target="_blank" 
              rel="noreferrer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}
              className="flex items-center gap-3 p-4 bg-bg-main border border-border-subtle rounded-lg text-text-main transition-colors hover:border-[rgba(192,78,16,0.35)] hover:text-brand"
            >
              <span className="text-[1.2rem]">{c.icon}</span>
              <div className="flex flex-col">
                <span className="font-mono text-[0.6rem] text-text-muted uppercase tracking-[0.06em] mb-0.5">{c.label}</span>
                <span className="font-mono text-[0.8rem] tracking-[0.01em]">{c.val}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
