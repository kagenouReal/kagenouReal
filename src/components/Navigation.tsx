import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { Music } from 'lucide-react';
import { PROJECTS, SKILLS } from '../data';
import { BackgroundGrid } from './VisualEffects';

const navLinks = [
{name: 'About', href: '#about'},
{name: 'Skills', href: '#skills'},
{name: 'Projects', href: '#projects'},
{name: 'Contact', href: '#contact'},
];

// --- NAVBAR ---
export function Navbar({ onOpenMusic }: { onOpenMusic: () => void }) {
const { scrollY } = useScroll();
const shadow = useTransform(scrollY, [0, 50], ['none', '0 4px 6px -1px rgba(0, 0, 0, 0.05)']);
const [isDarkMode, setIsDarkMode] = useState(false);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
useEffect(() => {
const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
if (isDark) { document.documentElement.classList.add('dark'); setIsDarkMode(true); } else { document.documentElement.classList.remove('dark'); setIsDarkMode(false); }
}, []);
const toggleDarkMode = () => {
if (isDarkMode) { document.documentElement.classList.remove('dark'); localStorage.theme = 'light'; setIsDarkMode(false); } else { document.documentElement.classList.add('dark'); localStorage.theme = 'dark'; setIsDarkMode(true); }
};
return (
<>
<motion.nav className="sticky top-0 z-50 backdrop-blur-md bg-bg-main/40 border-b border-border-subtle/30 will-change-transform" style={{ boxShadow: shadow }} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
<div className="max-w-[1000px] mx-auto px-6 md:px-10 py-4 flex justify-between items-center z-10 relative">
<motion.div className="text-[1.1rem] font-bold font-mono tracking-tighter flex items-center gap-1 group cursor-pointer" whileHover={{ scale: 1.05 }}><span className="text-brand text-[1.15rem]">//</span><span className="text-text-main group-hover:text-brand transition-colors">kagenou_</span></motion.div>
<div className="flex items-center gap-4 md:gap-8">
<div className="hidden md:flex items-center gap-8">
{navLinks.map((link) => (
<motion.a key={link.name} href={link.href} className="font-mono text-[0.68rem] text-text-muted hover:text-brand transition-colors font-bold uppercase tracking-[0.2em] relative group" whileHover={{ y: -2 }}><span className="text-border-subtle opacity-0 group-hover:opacity-100 transition-opacity mr-0.5">./</span>{link.name}</motion.a>
))}
</div>
<div className="flex items-center gap-2 md:gap-4 border-l border-border-subtle pl-4">
<button onClick={toggleDarkMode} className="text-[0.68rem] hover:text-brand transition-colors p-1.5 rounded-md hover:bg-card-bg" aria-label="Toggle Dark Mode">{isDarkMode ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}</button>
<button onClick={onOpenMusic} className="text-[0.68rem] hover:text-brand transition-colors p-1.5 rounded-md hover:bg-card-bg" aria-label="Open Music"><Music size={16} /></button>
<button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-1.5 text-text-main">{isMobileMenuOpen ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>}</button>
</div>
</div>
</div>
<AnimatePresence>
{isMobileMenuOpen && (
<motion.div 
initial={{ height: 0, opacity: 0 }} 
animate={{ height: 'auto', opacity: 1 }} 
exit={{ height: 0, opacity: 0 }} 
className="md:hidden border-t border-border-subtle bg-bg-main overflow-hidden relative"
>
<BackgroundGrid />
<div className="flex flex-col">
{navLinks.map((link, i) => (
<a 
key={link.name} 
href={link.href} 
onClick={() => setIsMobileMenuOpen(false)} 
className="font-mono text-[0.8rem] text-text-muted hover:text-brand hover:bg-card-bg uppercase tracking-widest py-5 px-6 flex items-center gap-3 border-b border-border-subtle/50 last:border-b-0"
>
<span className="text-brand/40 text-[0.6rem]">0{i + 1}</span>
{link.name}
</a>
))}
</div>
</motion.div>
)}
</AnimatePresence>
</motion.nav>
</>
);
}

const SOCIAL_LINKS = [
{ name: 'GitHub', url: 'https://github.com/kagenouReal', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> },
{ name: 'TikTok', url: 'https://www.tiktok.com/@veryy_lazyy', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg> },
{ name: 'Telegram', url: 'https://t.me/Kagenouonly', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> },
{ name: 'WhatsApp', url: 'https://wa.me/601112260297', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> }
];
export function Footer() {
return (
<footer className="py-5 border-t border-border-subtle bg-bg-main relative z-10 w-full overflow-hidden">
<div className="max-w-[1000px] mx-auto px-6 md:px-10 flex flex-col items-center gap-3">
<div className="flex flex-wrap items-center justify-center gap-4">
{SOCIAL_LINKS.map((link, i) => (
<motion.a 
key={link.name} 
href={link.url} 
target="_blank" 
rel="noreferrer" 
aria-label={link.name} 
whileHover={{ scale: 1.15, y: -2 }} 
whileTap={{ scale: 0.95 }} 
className="text-text-muted hover:text-brand transition-colors p-2 rounded-full border border-transparent bg-card-bg shadow-sm"
>
{link.icon}
</motion.a>
))}
</div>
<div className="flex flex-col sm:flex-row justify-center items-center gap-2 w-full text-text-muted opacity-80 pt-2 border-t border-border-subtle/50">
<div className="font-mono text-[0.65rem] uppercase tracking-[0.1em]">
© {new Date().getFullYear()} Kagenou. All rights reserved.
</div>
</div>

</div>
</footer>
);
}

// --- BACK TO TOP ---
export function BackToTop() {
const [isVisible, setIsVisible] = useState(false);
useEffect(() => { const handleScroll = () => { if (window.scrollY > 500) setIsVisible(true); else setIsVisible(false); }; window.addEventListener('scroll', handleScroll); handleScroll(); return () => window.removeEventListener('scroll', handleScroll); }, []);
return (
<AnimatePresence>{isVisible && <motion.button initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-7 right-7 z-[90] p-3 rounded-full bg-card-bg border border-border-subtle shadow-xl backdrop-blur-md text-text-muted hover:text-brand transition-colors" whileHover={{ y: -3, boxShadow: '0 8px 32px var(--color-brand-glow)' }} whileTap={{ scale: 0.95 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></motion.button>}</AnimatePresence>
);
}

export function SplashScreen({ onComplete }: { onComplete?: () => void }) {
const [isVisible, setIsVisible] = useState(true);
const [status, setStatus] = useState("Loading...");
useEffect(() => {
const statusSequence = [
{ text: "Kage Pemalas.", delay: 0 },
{ text: "Suami Elaina.", delay: 600 },
{ text: "Prekitiw.", delay: 1400 }
];

statusSequence.forEach(s => {
setTimeout(() => setStatus(s.text), s.delay);
});

const timer = setTimeout(() => {
setIsVisible(false);
onComplete?.();
}, 1800);

return () => clearTimeout(timer);
}, [onComplete]);

return (
<AnimatePresence>
{isVisible && (
<motion.div
initial={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.3, ease: "easeOut" }}
className="fixed inset-0 z-[9999] bg-bg-main flex flex-col items-center justify-center"
>
<BackgroundGrid />
<div className="flex flex-col items-center gap-4 scale-[0.85] relative z-10">
{/* Simple Logo */}
<div className="text-[2rem] font-bold font-mono tracking-tighter text-text-main flex items-center gap-1.5">
<span className="text-brand">{"//"}</span>
<span>kagenou_</span>
</div>

{/* Clean Progress Bar */}
<div className="w-32 h-[1px] bg-border-subtle/30 relative overflow-hidden rounded-full">
<motion.div 
initial={{ width: 0 }}
animate={{ width: "100%" }}
transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
className="absolute top-0 bottom-0 left-0 bg-brand shadow-[0_0_8px_var(--color-brand)]"
/>
</div>

{/* Status Text */}
<motion.div 
key={status}
initial={{ opacity: 0, y: 3 }}
animate={{ opacity: 0.4, y: 0 }}
className="font-mono text-[0.5rem] text-text-muted uppercase tracking-[0.3em]"
>
{status}
</motion.div>
</div>
</motion.div>
)}
</AnimatePresence>
);
}