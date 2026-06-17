import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, ListMusic, X, ChevronRight } from 'lucide-react';
import { PLAYLIST } from '../data';

interface MusicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MusicSidebar({ isOpen, onClose }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) setProgress((current / duration) * 100);
    }
  };

  return (
    <>
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
      />

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-[280px] bg-bg-main border-l border-border-subtle shadow-2xl z-[101] flex flex-col"
            >
              <div className="p-4 border-b border-border-subtle flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-brand/10 rounded-lg flex items-center justify-center text-brand">
                    <Play size={14} fill="currentColor" />
                  </div>
                  <h2 className="font-mono text-[0.7rem] font-bold uppercase tracking-widest">Music Player</h2>
                </div>
                <button onClick={onClose} className="p-1.5 hover:bg-card-bg rounded-full transition-colors">
                  <ChevronRight size={18} className="text-text-muted" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                {/* Current Track Info */}
                <div className="flex flex-col items-center text-center gap-3">
                  <motion.div 
                    animate={isPlaying ? { rotate: 360 } : {}} 
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="w-32 h-32 rounded-full overflow-hidden border-2 border-card-bg shadow-lg will-change-transform"
                  >
                    <img src={currentTrack.cover} alt="" className="w-full h-full object-cover" />
                  </motion.div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-text-main leading-tight mb-1">{currentTrack.title}</h3>
                    <p className="text-[0.6rem] text-brand font-mono uppercase tracking-[0.2em]">{currentTrack.artist}</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-3">
                  <div className="h-1 w-full bg-card-bg rounded-full overflow-hidden relative">
                    <motion.div 
                      className="h-full bg-brand absolute left-0 top-0 will-change-[width]"
                      animate={{ width: `${progress}%` }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    />
                  </div>

                  <div className="flex justify-center items-center gap-5">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={playPrev} className="p-1.5 text-text-muted hover:text-brand transition-colors">
                      <SkipBack size={20} />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={togglePlay}
                      className="w-12 h-12 flex items-center justify-center bg-brand text-white rounded-full shadow-lg shadow-brand/20 will-change-transform"
                    >
                      {isPlaying ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" className="ml-1" />}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={playNext} className="p-1.5 text-text-muted hover:text-brand transition-colors">
                      <SkipForward size={20} />
                    </motion.button>
                  </div>
                </div>

                {/* Playlist */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-border-subtle pb-1.5">
                    <ListMusic size={14} className="text-text-muted" />
                    <span className="font-mono text-[0.6rem] uppercase tracking-widest text-text-muted">Queue</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {PLAYLIST.map((track, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentTrackIndex(index);
                          setIsPlaying(true);
                        }}
                        className={`flex items-center gap-2.5 p-1.5 rounded-lg transition-all text-left ${
                          currentTrackIndex === index ? 'bg-brand/10 border border-brand/20' : 'hover:bg-card-bg border border-transparent'
                        }`}
                      >
                        <img src={track.cover} alt="" className="w-8 h-8 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className={`text-[0.65rem] font-bold truncate ${currentTrackIndex === index ? 'text-brand' : 'text-text-main'}`}>
                            {track.title}
                          </p>
                          <p className="text-[0.55rem] text-text-muted truncate uppercase">{track.artist}</p>
                        </div>
                        {currentTrackIndex === index && isPlaying && (
                          <div className="flex gap-0.5 items-end h-2.5 pr-1">
                            <motion.div animate={{ height: [3, 10, 5] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-brand" />
                            <motion.div animate={{ height: [6, 3, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-brand" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-4 text-center border-t border-border-subtle">
                <p className="font-mono text-[0.55rem] text-text-muted tracking-widest uppercase">Enjoy the vibes, Kage 🕶️</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
