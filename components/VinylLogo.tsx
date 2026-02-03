
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 音乐播放列表配置 ---
// FIX: Using jsDelivr for China accessibility
const PLAYLIST = [
    {
        title: "Head in the clouds",
        url: "https://cdn.jsdelivr.net/gh/jayneysil520-dev/jayneysil@main/1.mp3" 
    },
    {
        title: "Un Amico", 
        url: "https://cdn.jsdelivr.net/gh/jayneysil520-dev/jayneysil@main/2.mp3" 
    },
    {
        title: "Death bed",
        url: "https://cdn.jsdelivr.net/gh/jayneysil520-dev/jayneysil@main/3.mp3"
    },
    {
        title: "Luv(sic.)pt3", 
        url: "https://cdn.jsdelivr.net/gh/jayneysil520-dev/jayneysil@main/4.mp3" 
    },
    {
        title: "Repeat until death", 
        url: "https://cdn.jsdelivr.net/gh/jayneysil520-dev/jayneysil@main/5.mp3" 
    },
];

const VinylLogo: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // 新增：记录被外部事件打断前的播放状态
  const wasPlayingRef = useRef<boolean>(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // 新增：用于检测是否悬停

  // 🟢 NEW: 监听外部暂停/恢复事件
  useEffect(() => {
    // 暂停事件处理
    const handleExternalPause = () => {
      if (audioRef.current && !audioRef.current.paused) {
        // 记录当前正在播放，是被强制打断的
        wasPlayingRef.current = true;
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // 如果本来就是暂停的，记录下来，恢复时不要自动播放
        wasPlayingRef.current = false;
      }
    };

    // 恢复事件处理
    const handleExternalResume = () => {
        // 只有当被打断前是播放状态时，才恢复播放
        if (wasPlayingRef.current && audioRef.current) {
            audioRef.current.play().catch(e => console.log("Resume failed", e));
            setIsPlaying(true);
        }
    };

    window.addEventListener('pause-background-music', handleExternalPause);
    window.addEventListener('resume-background-music', handleExternalResume);
    
    return () => {
      window.removeEventListener('pause-background-music', handleExternalPause);
      window.removeEventListener('resume-background-music', handleExternalResume);
    };
  }, []);

  // 监听当前歌曲索引变化，实现切歌播放
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 重新加载音频资源
    audio.load();

    // 如果当前状态是“播放中”，则切歌后立即播放
    if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Auto-play prevented on track change:", error);
            });
        }
    }
  }, [currentIndex]); // 依赖 currentIndex

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;

    // 初始尝试自动播放（针对第一首歌）
    const attemptPlay = async () => {
        try {
            await audio.play();
            setIsPlaying(true);
            setIsMuted(false);
        } catch (err: any) {
            if (err.name === 'NotAllowedError') {
                 console.log("Autoplay blocked. Waiting for interaction.");
                 addInteractionListeners();
            }
        }
    };

    const addInteractionListeners = () => {
        const enableAudio = async () => {
            try {
                if (audioRef.current) {
                    await audioRef.current.play();
                    setIsPlaying(true);
                    setIsMuted(false);
                }
                cleanupListeners();
            } catch (e) {
                console.warn("Interaction play failed", e);
            }
        };

        const cleanupListeners = () => {
            window.removeEventListener('click', enableAudio);
            window.removeEventListener('keydown', enableAudio);
            window.removeEventListener('touchstart', enableAudio);
            window.removeEventListener('scroll', enableAudio);
        };

        window.addEventListener('click', enableAudio);
        window.addEventListener('keydown', enableAudio);
        window.addEventListener('touchstart', enableAudio);
        window.addEventListener('scroll', enableAudio);
    };

    attemptPlay();
  }, []);

  // --- 核心逻辑：当一首歌播放结束时 ---
  const handleSongEnd = () => {
      console.log("Song ended, playing next...");
      handleNext();
  };

  // 下一首逻辑
  const handleNext = () => {
      // 索引 +1，如果到了最后一首，就回到 0 (取模运算)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % PLAYLIST.length);
      setIsPlaying(true); // 切歌总是暗示用户想听，所以设为播放状态
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (audioRef.current) {
        audioRef.current.muted = !audioRef.current.muted;
        setIsMuted(audioRef.current.muted);
        
        if (audioRef.current.paused) {
             audioRef.current.play().catch(e => console.log("Toggle play error", e));
             setIsPlaying(true);
        }
    }
  };

  // 黑胶点击：现在只负责 播放/暂停
  const handleDiscClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (audioRef.current) {
        if (audioRef.current.paused) {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
                setIsMuted(false);
                wasPlayingRef.current = true; // 手动播放，更新状态
            });
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
            wasPlayingRef.current = false; // 手动暂停，更新状态
        }
    }
  };

  const currentSong = PLAYLIST[currentIndex];

  return (
    <div className="flex items-center gap-3">
        {/* 1. 黑胶唱片 (悬停目标) */}
        <motion.div 
            className="relative flex flex-col items-center cursor-pointer group"
            onClick={handleDiscClick}
            // 鼠标悬停事件
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
            <audio 
                ref={audioRef} 
                src={currentSong.url} 
                preload="auto"
                onEnded={handleSongEnd}
            />
            
            {/* Vinyl Disc Visuals */}
            <motion.div
                key={`disc-${currentIndex}`}
                initial={{ scale: 0.8, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ 
                    scale: { duration: 0.5, type: "spring" },
                    rotate: { duration: 4, repeat: Infinity, ease: "linear" }
                }}
                style={{ 
                    animationPlayState: isPlaying ? "running" : "paused" 
                }}
                className="relative w-12 h-12 rounded-full bg-black flex items-center justify-center shadow-lg border border-gray-800 z-20"
            >
                <div className="absolute inset-1 rounded-full border border-gray-700/50" />
                <div className="absolute inset-2 rounded-full border border-gray-700/50" />
                <div className="absolute inset-3 rounded-full border border-gray-700/50" />
                
                {/* Center Sticker */}
                <div 
                    className="w-5 h-5 rounded-full flex items-center justify-center z-10 transition-colors duration-500"
                    style={{ 
                        backgroundColor: currentIndex % 2 === 0 ? '#F97316' : '#3B82F6' 
                    }}
                >
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </div>
            </motion.div>
        </motion.div>

        {/* 2. 下一首按钮 */}
        <button 
            onClick={handleNext}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-black hover:bg-gray-100 transition-colors pointer-events-auto bg-white/50 backdrop-blur-sm z-10"
            title="Next Song"
        >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M5 4l10 8-10 8V4z" />
                <rect x="17" y="4" width="2" height="16" />
            </svg>
        </button>

        {/* 3. 歌名 (从下一首按钮右侧滑出) */}
        <AnimatePresence>
            {isHovered && (
                <motion.div
                    initial={{ width: 0, opacity: 0, x: -10 }}
                    animate={{ width: "auto", opacity: 1, x: 0 }}
                    exit={{ width: 0, opacity: 0, x: -10 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} // Smooth cubic ease
                    className="overflow-hidden flex items-center"
                >
                    <div className="whitespace-nowrap text-[10px] font-albert-black tracking-widest text-black mr-3">
                        {currentSong.title}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* 4. 静音按钮 */}
        <button 
            onClick={toggleMute}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-black hover:bg-gray-100 transition-colors pointer-events-auto bg-white/50 backdrop-blur-sm z-10"
            title={isMuted ? "Unmute" : "Mute"}
        >
            <AnimatePresence mode="wait">
                {isMuted ? (
                    <motion.svg 
                        key="mute"
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                        <path d="M9 9v6a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0a7 7 0 0 1-7 7v0"></path>
                    </motion.svg>
                ) : (
                    <motion.svg 
                        key="sound"
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                         <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                         <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </motion.svg>
                )}
            </AnimatePresence>
        </button>
    </div>
  );
};

export default VinylLogo;
