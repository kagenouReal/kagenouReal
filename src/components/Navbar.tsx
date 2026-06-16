import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import SearchModal from './SearchModal';
import MusicSidebar from './MusicSidebar';
import { Music } from 'lucide-react';

const navLinks = [
  {name: 'About', href: '#about'},
  {name: 'Skills', href: '#skills'},
  {name: 'Projects', href: '#projects'},
  {name: 'Contact', href: '#contact'},
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const shadow = useTransform(
    scrollY,
    [0, 50],
    ['none', '0 4px 6px -1px rgba(0, 0, 0, 0.05)']
  );
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const isDark = 
      localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <motion.nav 
        className="sticky top-0 z-50 backdrop-blur-md bg-bg-main/40 border-b border-border-subtle/30 will-change-transform"
        style={{ boxShadow: shadow }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-[1000px] mx-auto px-6 md:px-10 py-4 flex justify-between items-center z-10 relative">
          <motion.div 
            className="text-[1.1rem] font-bold font-mono tracking-tighter flex items-center gap-1 group cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-brand text-[1.15rem]">//</span>
            <span className="text-text-main group-hover:text-brand transition-colors">kagenou_</span>
          </motion.div>
          
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <motion.a 
                  key={link.name}
                  href={link.href}
                  className="font-mono text-[0.68rem] text-text-muted hover:text-brand transition-colors font-bold uppercase tracking-[0.2em] relative group"
                  whileHover={{ y: -2 }}
                >
                  <span className="text-border-subtle opacity-0 group-hover:opacity-100 transition-opacity mr-0.5">./</span>
                  {link.name}
                </motion.a>
              ))}
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 border-l border-border-subtle pl-4">
              <button
                onClick={toggleDarkMode}
                className="text-text-muted hover:text-brand transition-colors p-1.5 rounded-md hover:bg-card-bg"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
              </button>

              <button
                onClick={() => setIsMusicOpen(true)}
                className="text-text-muted hover:text-brand transition-colors p-1.5 rounded-md hover:bg-card-bg"
                aria-label="Open Music"
              >
                <Music size={16} />
              </button>
              
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 group px-3 py-1.5 rounded-md border border-border-subtle hover:border-brand transition-colors bg-card-bg"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text-muted group-hover:text-brand transition-colors">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-mono text-[0.6rem] text-text-muted tracking-widest uppercase">Search</span>
              </button>

              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1.5 text-text-main"
              >
                {isMobileMenuOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border-subtle bg-bg-main overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-mono text-[0.8rem] text-text-muted hover:text-brand uppercase tracking-widest py-2"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MusicSidebar isOpen={isMusicOpen} onClose={() => setIsMusicOpen(false)} />
    </>
  );
}
