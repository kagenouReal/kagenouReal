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
              className="fixed top-0 right-0 h-full w-full max-w-xs bg-bg-main border-l border-border-subtle shadow-2xl z-[101] flex flex-col"
            >
              <div className="p-6 border-b border-border-subtle flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center text-brand">
                    <Play size={16} fill="currentColor" />
                  </div>
                  <h2 className="font-mono text-sm font-bold uppercase tracking-widest">Music Player</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-card-bg rounded-full transition-colors">
                  <ChevronRight size={20} className="text-text-muted" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
                {/* Current Track Info */}
                <div className="flex flex-col items-center text-center gap-4">
                  <motion.div 
                    animate={isPlaying ? { rotate: 360 } : {}} 
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="w-48 h-48 rounded-full overflow-hidden border-4 border-card-bg shadow-xl"
                  >
                    <img src={currentTrack.cover} alt="" className="w-full h-full object-cover" />
                  </motion.div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-text-main leading-tight mb-1">{currentTrack.title}</h3>
                    <p className="text-xs text-brand font-mono uppercase tracking-[0.2em]">{currentTrack.artist}</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-4">
                  <div className="h-1.5 w-full bg-card-bg rounded-full overflow-hidden relative">
                    <motion.div 
                      className="h-full bg-brand absolute left-0 top-0"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex justify-center items-center gap-6">
                    <button onClick={playPrev} className="p-2 text-text-muted hover:text-brand transition-colors">
                      <SkipBack size={24} />
                    </button>
                    <button 
                      onClick={togglePlay}
                      className="w-16 h-16 flex items-center justify-center bg-brand text-white rounded-full hover:scale-105 transition-transform shadow-xl shadow-brand/20"
                    >
                      {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" className="ml-1" />}
                    </button>
                    <button onClick={playNext} className="p-2 text-text-muted hover:text-brand transition-colors">
                      <SkipForward size={24} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 bg-card-bg/50 p-3 rounded-xl">
                    <Volume2 size={16} className="text-text-muted" />
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="flex-1 h-1 bg-border-subtle rounded-full appearance-none cursor-pointer accent-brand"
                    />
                  </div>
                </div>

                {/* Playlist */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
                    <ListMusic size={16} className="text-text-muted" />
                    <span className="font-mono text-[0.65rem] uppercase tracking-widest text-text-muted">Queue</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {PLAYLIST.map((track, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentTrackIndex(index);
                          setIsPlaying(true);
                        }}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-all text-left ${
                          currentTrackIndex === index ? 'bg-brand/10 border border-brand/20' : 'hover:bg-card-bg border border-transparent'
                        }`}
                      >
                        <img src={track.cover} alt="" className="w-10 h-10 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className={`text-[0.7rem] font-bold truncate ${currentTrackIndex === index ? 'text-brand' : 'text-text-main'}`}>
                            {track.title}
                          </p>
                          <p className="text-[0.6rem] text-text-muted truncate uppercase">{track.artist}</p>
                        </div>
                        {currentTrackIndex === index && isPlaying && (
                          <div className="flex gap-0.5 items-end h-3 pr-2">
                            <motion.div animate={{ height: [4, 12, 6] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-brand" />
                            <motion.div animate={{ height: [8, 4, 10] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-brand" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6 text-center border-t border-border-subtle">
                <p className="font-mono text-[0.6rem] text-text-muted tracking-widest uppercase">Enjoy the vibes, Kage 🕶️</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
