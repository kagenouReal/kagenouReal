import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, ListMusic, X, Disc } from 'lucide-react';
import { PLAYLIST } from '../data';
import { BackgroundGrid } from './VisualEffects';

interface MusicPlayerProps {
isOpen: boolean;
onClose: () => void;
}

export default function MusicSidebar({ isOpen, onClose }: MusicPlayerProps) {
const [isPlaying, setIsPlaying] = useState(false);
const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
const [progress, setProgress] = useState(0);

const audioRef = useRef<HTMLAudioElement | null>(null);
const currentTrack = PLAYLIST[currentTrackIndex];

useEffect(() => {
if (isPlaying) audioRef.current?.play().catch(() => setIsPlaying(false));
else audioRef.current?.pause();
}, [isPlaying, currentTrackIndex]);

const togglePlay = () => setIsPlaying(!isPlaying);
const playNext = () => { setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length); setIsPlaying(true); };
const playPrev = () => { setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length); setIsPlaying(true); };

return (
<>
<audio ref={audioRef} src={currentTrack.url} onTimeUpdate={() => { if(audioRef.current) setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100); }} onEnded={playNext} />

<AnimatePresence>
{isOpen && (
<>
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/30 z-[100]" />

<motion.div
initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
className="fixed top-0 right-0 h-full w-full max-w-[260px] md:max-w-[280px] bg-bg-main border-l border-brand/20 shadow-2xl z-[101] flex flex-col"
>
{/* Linear Grid Background */}
<div className="absolute inset-0 z-0 opacity-[0.06]">
<div className="w-full h-full relative" style={{
backgroundImage: `
linear-gradient(var(--color-brand) 0.5px, transparent 0.5px),
linear-gradient(90deg, var(--color-brand) 0.5px, transparent 0.5px)
`,
backgroundSize: '40px 40px',
}} />
</div>

{/* Dynamic Background Blur */}
<div className="absolute inset-0 z-0 opacity-20 overflow-hidden">
<img src={currentTrack.cover} className="w-full h-full object-cover blur-3xl scale-150" alt="" />
<div className="absolute inset-0 bg-gradient-to-b from-bg-main/80 to-bg-main" />
</div>

{/* Header */}
<div className="p-6 flex justify-between items-center relative z-10">
<h2 className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.3em] text-brand">// Music Player</h2>
<button onClick={onClose} className="p-1 hover:bg-brand/10 rounded-full transition-colors"><X size={16} className="text-text-muted" /></button>
</div>

<div className="flex-1 flex flex-col p-6 gap-6 relative z-10 custom-scrollbar overflow-y-auto">
{/* Visualizer & Art */}
<div className="relative flex justify-center">
<motion.div 
animate={isPlaying ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
className="w-48 h-48 rounded-full border-[3px] border-brand/20 shadow-[0_0_30px_rgba(0,0,0,0.3)] relative"
>
<img src={currentTrack.cover} alt="" className="w-full h-full rounded-full object-cover" />
<div className="absolute inset-0 rounded-full border border-brand/30" />
</motion.div>
</div>

{/* Track Details */}
<div className="text-center">
<h3 className="text-lg font-bold text-text-main truncate">{currentTrack.title}</h3>
<p className="text-[0.7rem] text-brand font-mono uppercase tracking-[0.2em] mt-1">{currentTrack.artist}</p>
</div>

{/* Progress */}
<div className="h-1.5 w-full bg-card-bg/50 rounded-full overflow-hidden">
<motion.div className="h-full bg-brand" style={{ width: `${progress}%` }} />
</div>

{/* Controls */}
<div className="flex justify-center items-center gap-8">
<button onClick={playPrev} className="text-text-muted hover:text-brand transition-colors"><SkipBack size={24} /></button>
<button onClick={togglePlay} className="w-12 h-12 flex items-center justify-center bg-brand text-bg-main rounded-full hover:scale-105 transition-transform shadow-lg">
{isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
</button>
<button onClick={playNext} className="text-text-muted hover:text-brand transition-colors"><SkipForward size={24} /></button>
</div>

{/* Playlist */}
<div className="flex-1">
<div className="font-mono text-[0.6rem] uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">// My Playlist <ListMusic size={12} /></div>
<div className="flex flex-col gap-2">
{PLAYLIST.map((track, index) => (
<button key={index} onClick={() => { setCurrentTrackIndex(index); setIsPlaying(true); }} className={`flex items-center gap-3 p-2 md:p-2.5 rounded-lg border transition-all ${currentTrackIndex === index ? 'border-brand' : 'bg-card-bg/30 border-transparent hover:border-brand/20'}`}>
<div className="w-8 h-8 md:w-9 md:h-9 rounded-lg overflow-hidden shrink-0"><img src={track.cover} className="w-full h-full object-cover" alt="" /></div>
<div className="flex-1 text-left min-w-0">
<p className={`text-[0.65rem] md:text-[0.7rem] font-bold truncate ${currentTrackIndex === index ? 'text-brand' : 'text-text-main'}`}>{track.title}</p>
<p className="text-[0.5rem] md:text-[0.6rem] text-text-muted truncate uppercase">{track.artist}</p>
</div>
</button>
))}
</div>
</div>
</div>
</motion.div>
</>
)}
</AnimatePresence>
</>
);
}
