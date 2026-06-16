import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECTS, SKILLS } from '../data';

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const filteredProjects = query 
    ? PROJECTS.filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.desc.toLowerCase().includes(query.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(query.toLowerCase())))
    : [];

  const filteredSkills = query
    ? SKILLS.filter(s => s.name.toLowerCase().includes(query.toLowerCase()) || s.cat.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleNavigate = (id: string) => {
    onClose();
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl bg-bg-main border border-border-subtle rounded-xl overflow-hidden shadow-xl flex flex-col max-h-[70vh] pointer-events-auto"
          >
            <div className="flex items-center px-5 border-b border-border-subtle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text-muted">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, skills..."
                className="w-full bg-transparent border-none outline-none py-5 px-4 text-text-main font-sans text-lg"
              />
              <button onClick={onClose} className="text-text-muted font-mono text-[10px] px-2 py-1 bg-card-bg border border-border-subtle rounded uppercase tracking-wider hover:text-text-main hover:border-brand transition-colors">ESC</button>
            </div>
            
            <div className="overflow-y-auto p-4 flex flex-col gap-6">
              {!query && (
                <div className="text-center py-12 text-text-muted font-mono text-xs tracking-wide opacity-80">
                  Try searching for 'reverse engineering', 'Node.js', or 'Flutter'
                </div>
              )}
              
              {query && filteredProjects.length === 0 && filteredSkills.length === 0 && (
                <div className="text-center py-12 text-text-muted font-mono text-xs opacity-80">
                  No results found for "{query}"
                </div>
              )}

              {filteredProjects.length > 0 && (
                <div>
                  <h3 className="font-mono text-xs text-text-muted tracking-widest uppercase mb-3 px-2">Projects</h3>
                  <div className="flex flex-col gap-1.5">
                    {filteredProjects.map(p => (
                      <button 
                        key={p.title}
                        onClick={() => handleNavigate('projects')}
                        className="text-left flex items-center p-3 rounded-lg hover:bg-card-hover transition-colors border border-transparent hover:border-[rgba(192,78,16,0.35)]"
                      >
                        <span className="text-2xl mr-4">{p.icon}</span>
                        <div>
                          <div className="text-text-main font-mono text-sm mb-1">{p.title}</div>
                          <div className="text-text-muted font-sans text-xs line-clamp-1">{p.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredSkills.length > 0 && (
                <div>
                  <h3 className="font-mono text-xs text-text-muted tracking-widest uppercase mb-3 px-2">Skills</h3>
                  <div className="flex flex-col gap-1.5">
                    {filteredSkills.map(s => (
                      <button 
                        key={s.name}
                        onClick={() => handleNavigate('skills')}
                        className="text-left flex items-center p-3 rounded-lg hover:bg-card-hover transition-colors border border-transparent hover:border-[rgba(192,78,16,0.35)]"
                      >
                        <span className="text-xl mr-4 text-brand">{s.icon}</span>
                        <div>
                          <div className="text-text-main font-mono text-sm mb-1">{s.name}</div>
                          <div className="text-brand font-sans text-xs opacity-80">{s.cat} • {s.pct}% Proficiency</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
