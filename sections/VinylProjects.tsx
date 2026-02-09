
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring, useScroll, useMotionTemplate, Variants } from 'framer-motion';
import { createPortal } from 'react-dom'; 
import Spotlight3D from '../components/Spotlight3D';

// 🔒 DATA IMPORTED FROM SEPARATE FILE TO PREVENT OVERWRITING
import {
    ASSETS,
    MY_CUSTOM_LONG_IMAGE,
    CUSTOM_FOX_RABBIT_CONFIG,
    WAVE_IMAGES_CONFIG,
    GROUP_1_CARDS_DATA,
    CUSTOM_NEW_IMAGES,
    TOOL_ICONS,
    PROJECTS_DATA
} from '../data/vinylProjectData';

// ==========================================
// 🟢 CONFIGURATION: GLOBAL ZOOM & LAYOUT
// ==========================================

// 🟢 1. GLOBAL SCALE: Adjusts the zoom level of the entire section
const PROJECTS_SCALE = 0.7;

// 🟢 2. CARD DIMENSIONS: Standard dimensions before scaling
const SQUARE_CARD_SIZE = '380px';
const PREVIEW_CARD_WIDTH = '750px';
const PREVIEW_CARD_HEIGHT = '280px';

// 🟢 3. CARD POSITIONS: Adjust 'top', 'left', 'rotate', and 'zIndex' for the scattered project cards
const CARD_POSITIONS = [
    { top: '4%',   left: '10%',  rotate: -25, zIndex: 1, scale: 1.02 }, 
    { top: '50%',  left: '30%', rotate: 18,  zIndex: 2, scale: 1.02 }, 
    { top: '67%',  left: '8%',  rotate: 5,   zIndex: 3, scale: 1.02 }, 
    { top: '92%',  left: '25%', rotate: -13,  zIndex: 4, scale: 1.02 }, 
    { top: '122%', left: '2%',  rotate: 25,  zIndex: 5, scale: 1.03 }, 
    { top: '147%', left: '32%', rotate: -30, zIndex: 6, scale: 1.04 }, 
    { top: '185%', left: '28%', rotate: -6,   zIndex: 7, scale: 1.06 }, 
    { top: '215%', left: '10%', rotate: 12,  zIndex: 8, scale: 1.1 },
];

const CARDS_GLOBAL_SCALE = 1.1;
const VIDEO_1_SCROLL_HEIGHT_VH = 100; 

// --- DEPTH CONFIGURATION ---
const DEPTHS = {
    FLOOR: -300,
    PROJECTS: -50,
};

// --- COMPONENTS ---

// 🟢 NEW: Component for Project 2 Video Interaction (Flip to Play)
// Updated to be an Absolute Overlay (Fixed relative to Modal)
const Project2FlipVideo: React.FC<{ config: any }> = ({ config }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isHidden, setIsHidden] = useState(false); // 🟢 NEW: Hidden State
    const [isLoading, setIsLoading] = useState(true); // 🟢 NEW: Loading State
    const videoRef = useRef<HTMLVideoElement>(null);
    const justHiddenRef = useRef(false); // 🟢 NEW: Prevents instant restore on hover

    const handleFlip = (e: React.MouseEvent) => {
        // Prevent flip if we just clicked hidden (double safety)
        if (justHiddenRef.current) return;

        e.stopPropagation();
        if (isHidden) return;
        setIsFlipped(true);
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFlipped(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            // 🟢 Resume music when closed
            window.dispatchEvent(new Event('resume-background-music'));
        }
    };

    // 🟢 NEW: Handle Hide Click Robustly
    const handleHide = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        
        justHiddenRef.current = true;
        setIsHidden(true);
        
        // Reset the block after 500ms so user can restore it intentionally by re-entering
        setTimeout(() => {
            justHiddenRef.current = false;
        }, 500);
    };

    useEffect(() => {
        if (isFlipped && videoRef.current) {
             window.dispatchEvent(new Event('pause-background-music'));
             videoRef.current.play().catch(err => console.log('Auto play video failed', err));
        }
    }, [isFlipped]);

    return (
        // 🟢 ABSOLUTE POSITIONING (Overlay Layer)
        <div className="absolute top-0 left-0 w-full h-full flex justify-center pointer-events-none z-[60]">
            <motion.div
                className="relative pointer-events-auto group"
                initial={{ y: 400 }} 
                animate={{ 
                    width: isFlipped ? 960 : (isHidden ? 50 : 120), // Shrink when hidden
                    height: isFlipped ? 540 : (isHidden ? 50 : 120),
                    rotateY: isFlipped ? 180 : 0,
                    // 🟢 POSITION LOGIC:
                    // Flipped: y=140
                    // Hidden: y=80, x=-440 (Top Left)
                    // Normal: y=400, x=0
                    y: isFlipped ? 140 : (isHidden ? 80 : 400),
                    x: isFlipped ? 0 : (isHidden ? -440 : 0),
                    opacity: isHidden ? 0.6 : 1
                }}
                transition={{ type: "spring", stiffness: 60, damping: 14 }}
                style={{ transformStyle: "preserve-3d" }}
                // 🟢 RESTORE ON HOVER
                onMouseEnter={() => {
                    // Only restore if hidden AND not just hidden
                    if (isHidden && !justHiddenRef.current) setIsHidden(false);
                }}
            >
                {/* 1. FRONT FACE (Play Button) */}
                <div 
                    className="absolute inset-0 backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {/* CLICKABLE PLAY AREA */}
                    <div 
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                        onClick={handleFlip}
                    >
                        <motion.div 
                            whileHover={{ scale: 1.1 }}
                            className="w-full h-full rounded-full bg-white/20 backdrop-blur-xl border border-white/50 flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
                        >
                            {/* 🟢 BUTTON COLOR: #D40411 */}
                            <div className={`rounded-full bg-white text-[#D40411] flex items-center justify-center shadow-inner transition-all duration-300 ${isHidden ? 'w-8 h-8' : 'w-16 h-16 group-hover:scale-110'}`}>
                                <svg width={isHidden ? "14" : "24"} height={isHidden ? "14" : "24"} viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                            </div>
                            
                            {/* Pulse Ring (Hidden when minimized) */}
                            {!isHidden && (
                                <div className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-20" />
                            )}
                        </motion.div>
                    </div>

                    {/* INDEPENDENT CLOSE BUTTON AREA */}
                    {!isFlipped && !isHidden && (
                        <div 
                            className="absolute -top-3 -right-3 w-10 h-10 z-[100] flex items-center justify-center cursor-pointer pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            onClick={handleHide}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <motion.div
                                className="w-8 h-8 bg-white text-gray-500 hover:bg-gray-200 border border-gray-200 rounded-full flex items-center justify-center shadow-md"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </motion.div>
                        </div>
                    )}
                </div>

                {/* 2. BACK FACE (Video Player) */}
                <div 
                    className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/20"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    {/* 🟢 LOADING SPINNER */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                    )}

                    <video 
                        ref={videoRef}
                        src={config.videoUrl}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata" // 🟢 OPTIMIZATION: metadata only first
                        onWaiting={() => setIsLoading(true)}
                        onCanPlay={() => setIsLoading(false)}
                        // 🟢 Resume music on video end
                        onEnded={() => {
                            window.dispatchEvent(new Event('resume-background-music'));
                        }}
                    />
                    
                    {/* Close Video Button */}
                    <button 
                        onClick={handleClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-[#D40411] text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors border border-white/10 z-20 shadow-lg"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// 🟢 NEW: Clickable Video Player for absolute positioning
const AbsoluteClickableVideo: React.FC<{ url: string, scale?: number, style?: React.CSSProperties }> = ({ url, scale = 1, style }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const togglePlay = () => {
        if (!videoRef.current) return;
        
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
            window.dispatchEvent(new Event('resume-background-music'));
        } else {
            // Pause background music before playing video
            window.dispatchEvent(new Event('pause-background-music'));
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <div 
            className="absolute left-0 right-0 mx-auto cursor-pointer group"
            style={{ 
                width: '800px', // Default width
                ...style, // Allow override
                transformOrigin: 'top center',
                transform: `scale(${scale})`
            }}
            onClick={togglePlay}
        >
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 bg-black min-h-[400px]">
                {/* 🟢 LOADING SPINNER */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                )}
                
                <video 
                    ref={videoRef}
                    src={url}
                    className="w-full h-auto block"
                    loop
                    playsInline
                    preload="metadata"
                    onWaiting={() => setIsLoading(true)}
                    onCanPlay={() => setIsLoading(false)}
                    onEnded={() => {
                        setIsPlaying(false);
                        window.dispatchEvent(new Event('resume-background-music'));
                    }}
                />
                
                {/* Play Overlay */}
                {!isPlaying && !isLoading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm group-hover:bg-black/20 transition-all duration-300">
                        <div className="w-20 h-20 rounded-full bg-white/20 border border-white/50 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                             <svg width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="none">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// 🟢 NEW: Flip Card Component for Project 6 (Updated with Dynamic Size & Spotlight Border)
const FlipVideoCard: React.FC<{ 
    item: any; 
    index: number; 
    color: string;
    activeVideoIndex: number | null; 
    setActiveVideoIndex: (idx: number) => void; 
}> = ({ item, index, color, activeVideoIndex, setActiveVideoIndex }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    
    // Mouse tracking for spotlight border
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const handleFlip = () => {
        const nextState = !isFlipped;
        setIsFlipped(nextState);
        
        // 🟢 Resume music explicitly when closing
        if (nextState === false) {
            window.dispatchEvent(new Event('resume-background-music'));
        }
    };

    // Auto-play video when flipped
    useEffect(() => {
        if (isFlipped && videoRef.current) {
            // 🟢 1. Trigger Global Music Pause
            window.dispatchEvent(new Event('pause-background-music'));

            // 🟢 2. Set THIS card as the active audio source
            setActiveVideoIndex(index);

            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(e => console.log("Video play failed", e));
        } else if (!isFlipped && videoRef.current) {
            videoRef.current.pause();
        }
    }, [isFlipped]);

    // 🟢 3. Audio Exclusion Logic: Only the active index gets sound, others are muted
    useEffect(() => {
        if (videoRef.current) {
            // If I am the active index, unmute. Else, mute.
            videoRef.current.muted = activeVideoIndex !== index;
        }
    }, [activeVideoIndex, index]);

    // 🟢 DYNAMIC SIZING LOGIC
    // Use flippedWidth/Height if available and flipped, otherwise fallback to default dimensions
    const currentWidth = isFlipped ? (item.flippedWidth || item.width || 320) : (item.width || 320);
    const currentHeight = isFlipped ? (item.flippedHeight || item.height || 569) : (item.height || 569);

    return (
        <motion.div 
            ref={cardRef}
            className="relative shrink-0 perspective-1000 cursor-pointer group"
            style={{ 
                // 🟢 Y Position (Vertical Offset)
                marginTop: item.y ? `${item.y}px` : '0px',
                
                // 🟢 X Position (Horizontal Offset / Margin Left)
                // You can now use 'x' in your data file to push a card to the right!
                marginLeft: item.x ? `${item.x}px` : '0px', 
                
                transform: `scale(${item.scale || 1})`
            }}
            // Animate container dimensions
            animate={{ width: currentWidth, height: currentHeight }}
            transition={{ type: "spring", stiffness: 60, damping: 12 }}
            onMouseMove={handleMouseMove}
            onClick={handleFlip}
        >
             {/* 🟢 NEW: INTRO TEXT (Rendered outside the flipping container but inside the relative wrapper) */}
             {item.introConfig && (
                <div 
                    className="absolute pointer-events-none z-0 hidden md:block" 
                    style={{
                        left: `${item.introConfig.x}px`,
                        top: `${item.introConfig.y}px`,
                        width: item.introConfig.width || '200px',
                        transform: `rotate(${item.introConfig.rotate || 0}deg)`,
                        textAlign: (item.introConfig.align as any) || 'right'
                    }}
                >
                    <p 
                        className="font-albert-light text-white/70 whitespace-pre-line leading-relaxed"
                        style={{ fontSize: item.introConfig.fontSize || '14px' }}
                    >
                        {item.introConfig.text}
                    </p>
                </div>
            )}

            <motion.div
                className="w-full h-full relative"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 60, damping: 12 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* --- FRONT: IMAGE --- */}
                <div 
                    className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden bg-white transition-shadow duration-300"
                    style={{ 
                        backfaceVisibility: 'hidden',
                    }}
                >
                    {/* 🟢 SPOTLIGHT BORDER EFFECT */}
                    {/* This layer creates the glowing border mask */}
                    <motion.div
                        className="absolute inset-0 z-20 pointer-events-none rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            padding: '3px', // Border width
                            background: color, // The dynamic brand color
                            maskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                            WebkitMaskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                        }}
                    >
                        {/* Mask inner content to create border shape */}
                        <div className="w-full h-full bg-black rounded-[calc(1.5rem-2px)]" />
                    </motion.div>

                    {/* 🟢 DYNAMIC COLORED SHADOW (ON HOVER) */}
                    <motion.div 
                        className="absolute inset-4 rounded-3xl blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 z-0"
                        style={{ backgroundColor: color }}
                    />

                    {/* Image Container */}
                    <div className="absolute inset-[2px] rounded-[calc(1.5rem-2px)] overflow-hidden z-10 bg-white">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover relative" />
                        
                        {/* Overlay Hint */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                             <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/50 flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                    <polyline points="16 6 12 2 8 6" />
                                    <line x1="12" y1="2" x2="12" y2="15" />
                                </svg>
                             </div>
                        </div>
                    </div>
                    
                    <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none">
                        <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">
                            CLICK TO FLIP
                        </span>
                    </div>
                </div>

                {/* --- BACK: VIDEO --- */}
                <div 
                    className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden bg-black shadow-xl border border-white/10"
                    style={{ 
                        backfaceVisibility: 'hidden', 
                        transform: 'rotateY(180deg)' 
                    }}
                >
                    {/* 🟢 LOADING SPINNER */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                    )}

                    <video 
                        ref={videoRef}
                        src={item.video} 
                        className="w-full h-full object-cover"
                        loop={false} // 🟢 Don't loop if we want to catch onEnded
                        playsInline
                        preload="metadata"
                        onWaiting={() => setIsLoading(true)}
                        onCanPlay={() => setIsLoading(false)}
                        // 🟢 FIX: Handle music resume when video ends naturally
                        onEnded={() => {
                            window.dispatchEvent(new Event('resume-background-music'));
                            setIsFlipped(false); // Optional: Flip back when done
                        }}
                        onError={(e) => console.error("Video Error:", e)}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

// 🟢 UPDATED: Horizontal Scroll Gallery now manages its own scroll container
// This fixes the issue where useScroll fails to bind to a passed ref in production/Vercel
const HorizontalScrollGallery: React.FC<{ items: any[]; color: string }> = ({ items, color }) => {
    // 🟢 INTERNAL REFS for robust scroll tracking
    const containerRef = useRef<HTMLDivElement>(null); 
    const targetRef = useRef<HTMLDivElement>(null);
    const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
    
    // 🟢 useScroll now uses the internal containerRef which is guaranteed to exist when this component mounts
    const { scrollYProgress } = useScroll({
        container: containerRef,
        target: targetRef,
        offset: ["start start", "end end"]
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

    return (
        // 🟢 THE SCROLL CONTAINER IS NOW HERE
        <div 
            ref={containerRef} 
            className="w-full h-full overflow-y-auto overflow-x-hidden floating-scrollbar relative z-10 p-0 bg-black block"
        >
            {/* The tall ghost element that forces scrolling */}
            <div ref={targetRef} className="relative w-full h-[400vh]"> 
                {/* Sticky viewport */}
                <div className="sticky top-0 h-[100vh] w-full flex items-center overflow-hidden bg-black/95">
                    {/* Content moving horizontally */}
                    {/* 🟢 ADJUST SPACING HERE: */}
                    {/* 'gap-48' controls distance between cards. Change to gap-24 for tighter, gap-64 for looser. */}
                    {/* 'pl-[25vw]' controls the start padding (initial offset). */}
                    <motion.div style={{ x }} className="flex items-center pl-[25vw] gap-48">
                        <div className="flex items-center shrink-0">
                            <div className="mr-12 flex flex-col justify-center min-w-[300px]">
                                <h2 className="text-6xl font-albert-black text-white mb-4">VIDEO<br/>GALLERY</h2>
                                <p className="text-white/50 text-sm w-48">Scroll down to explore the collection. Click cards to view videos.</p>
                                <div className="w-12 h-1 mt-6" style={{ backgroundColor: color }} />
                            </div>
                        </div>
                        
                        {items.map((item, index) => (
                            <FlipVideoCard 
                                key={item.id} 
                                item={item} 
                                index={index} 
                                color={color}
                                activeVideoIndex={activeVideoIndex}
                                setActiveVideoIndex={setActiveVideoIndex} 
                            />
                        ))}
                        
                        {/* End Spacer */}
                        <div className="w-[50vw] shrink-0" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const ScrollImageSequence: React.FC<{ 
    config: { baseUrl: string, suffix: string, digits: number, frameCount: number, startIndex: number }, 
    scrollContainerRef: React.RefObject<HTMLDivElement> 
}> = ({ config, scrollContainerRef }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    
    // Preload images
    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const promises = [];
            for (let i = 0; i < config.frameCount; i++) {
                 const index = config.startIndex + i;
                 const num = String(index).padStart(config.digits, '0');
                 const src = `${config.baseUrl}${num}${config.suffix}`;
                 const img = new Image();
                 img.src = src;
                 promises.push(new Promise<void>((resolve) => {
                     img.onload = () => resolve();
                     img.onerror = () => resolve(); // proceed even if fail
                 }));
                 loadedImages.push(img);
            }
            await Promise.all(promises);
            if(isMounted) setImages(loadedImages);
        };
        load();
        return () => { isMounted = false; };
    }, [config]);

    // Draw logic
    useEffect(() => {
        if(images.length === 0) return;
        
        const render = () => {
            if(!containerRef.current || !scrollContainerRef.current || !canvasRef.current) return;
            
            const container = containerRef.current;
            const scrollParent = scrollContainerRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            
            if(!ctx) return;

            const containerTop = container.offsetTop;
            const containerHeight = container.offsetHeight; 
            const windowHeight = scrollParent.clientHeight;
            
            const scrollTop = scrollParent.scrollTop;
            
            // Calculate progress based on how far we've scrolled into the container's height
            // We want the animation to play over the duration of the sticky element's "stick"
            const scrollDistance = containerHeight - windowHeight;
            const scrolled = scrollTop - containerTop;
            
            let progress = scrolled / scrollDistance;
            progress = Math.max(0, Math.min(1, progress));
            
            const frameIndex = Math.floor(progress * (images.length - 1));
            const img = images[frameIndex];
            
            if(img) {
                const cw = canvas.width;
                const ch = canvas.height;
                const iw = img.width;
                const ih = img.height;
                const scale = Math.max(cw / iw, ch / ih);
                const x = (cw - iw * scale) / 2;
                const y = (ch - ih * scale) / 2;
                
                ctx.clearRect(0,0,cw,ch);
                ctx.drawImage(img, x, y, iw * scale, ih * scale);
            }
        };

        const parent = scrollContainerRef.current;
        if(parent) {
            parent.addEventListener('scroll', render);
            render(); // Initial render
        }
        
        return () => {
            if(parent) parent.removeEventListener('scroll', render);
        };
    }, [images, scrollContainerRef]);

    return (
        <div ref={containerRef} className="relative w-full" style={{ height: '250vh' }}>
            <div className="sticky top-0 w-full h-[95vh] overflow-hidden">
                <canvas ref={canvasRef} width={1920} height={1080} className="w-full h-full object-cover" />
            </div>
        </div>
    );
};

const HoverCard: React.FC<{
  style: any;
  img: string;
  baseRotate?: number;
  borderRadius?: string;
  popOnHover?: boolean;
}> = ({ style, img, baseRotate = 0, borderRadius, popOnHover = true }) => {
  const randomRotate = useMemo(() => Math.random() * 10 - 5, []); // -5 to +5 degrees
  const randomDuration = useMemo(() => 2 + Math.random() * 2, []);
  const randomDelay = useMemo(() => Math.random() * 2, []);

  // Construct whileHover object dynamically based on popOnHover
  const hoverState = {
     scale: 1.4,
     filter: 'grayscale(0%)',
     rotate: baseRotate + randomRotate,
     ...(popOnHover ? { zIndex: 60 } : {})
  };

  return (
    <motion.div
      style={{ ...style, borderRadius, overflow: 'hidden', transformOrigin: 'center center' }}
      initial={{ opacity: 0, scale: 0.9, rotate: baseRotate, filter: 'grayscale(100%)' }}
      whileInView={{ opacity: 1, scale: 1, rotate: baseRotate, filter: 'grayscale(100%)' }}
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        y: {
            duration: randomDuration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: randomDelay
        }
      }}
      whileHover={hoverState}
    >
      <img src={img} className="w-full h-full object-cover block" alt="" />
    </motion.div>
  );
};


const FloorMarquee: React.FC<{ direction: 'left' | 'right', text: string, className?: string, rotate?: number, style?: React.CSSProperties }> = React.memo(({ direction, text, className, rotate = 0, style }) => {
    return (
        <div 
            className="absolute left-[-20%] w-[140%] pointer-events-auto overflow-visible flex group"
            style={{ 
                transform: `translateZ(${DEPTHS.PROJECTS - 40}px) rotate(${rotate}deg)`, 
                zIndex: 0,
                ...style,
            }}
        >
            <motion.div
                className={`flex whitespace-nowrap ${className}`}
                initial={{ x: direction === 'left' ? '0%' : '-50%' }}
                animate={{ x: direction === 'left' ? '-50%' : '0%' }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            >
                {[...Array(6)].map((_, i) => (
                    <span key={i} className="mx-4 transition-colors duration-300">
                        {text} <span className="mx-4 opacity-30">•</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
});

// 1. LEFT SIDE: SQUARE IMAGE CARD
const ProjectImageSquare: React.FC<{ 
    project: any, 
    style: any, 
    onClick: () => void, 
    onHoverStart: () => void, 
    onHoverEnd: () => void, 
    isHovered: boolean, 
    isAnyHovered: boolean
}> = React.memo(({ project, style, onClick, onHoverStart, onHoverEnd, isHovered, isAnyHovered }) => {
    
    // 🟢 Extract base scale from configuration, default to 1 if not present
    const baseScale = style.scale || 1.0;

    // 🟢 Calculate target scale relative to the base configuration
    const targetScale = isHovered 
        ? baseScale * 1.15  // Hover: 15% larger than base
        : (isAnyHovered 
            ? baseScale * 0.9  // Others hovered: 90% of base
            : baseScale);      // Idle: Base scale

    const targetOpacity = isHovered ? 1 : (isAnyHovered ? 0.7 : 1);
    const targetRotate = isHovered ? 0 : (style.rotate as number || 0);
    const targetY = isHovered ? -40 : 0;

    // Random floating/breathing params
    const randomDuration = useMemo(() => 3 + Math.random() * 2, []);
    const randomDelay = useMemo(() => Math.random() * 2, []);

    return (
        <motion.div
            initial={{ opacity: 0, x: -300, rotate: Math.random() * 20 - 10 }}
            whileInView={{ opacity: 1, x: 0, rotate: style.rotate as number || 0 }}
            animate={{ 
                scale: targetScale, 
                opacity: targetOpacity, 
                rotate: targetRotate,
                y: targetY
            }}
            transition={{ type: "spring", stiffness: 50, damping: 14, mass: 1 }}
            
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            onClick={onClick}
            
            // 🟢 FIX FOR EDGE: Remove 'will-change-transform' here too
            className="absolute cursor-pointer perspective-1000 group"
            style={{ 
                ...style, 
                width: SQUARE_CARD_SIZE,
                height: SQUARE_CARD_SIZE,
                transformStyle: "preserve-3d" 
            }}
        >
             {/* Breathing Wrapper */}
             <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ 
                    duration: randomDuration, 
                    repeat: Infinity, 
                    repeatType: "mirror", 
                    ease: "easeInOut", 
                    delay: randomDelay 
                }}
                className="w-full h-full relative transform-style-3d"
             >
                 {/* 🟢 MODIFIED: WHITE BORDER LAYER IS NOW TRANSPARENT */}
                 <div 
                    className="absolute inset-0 rounded-[2.5rem] bg-transparent border-4 border-white/10 pointer-events-none"
                    style={{ 
                        transform: 'translateZ(-10px)',
                        boxShadow: '30px 30px 60px rgba(0,0,0,0.15)' 
                    }}
                />

                <Spotlight3D 
                    // 🟢 MODIFIED: Subtler border for transparent effect
                    className="w-full h-full rounded-[2.5rem] bg-white/20 backdrop-blur-md border-[3px] border-white/20 shadow-sm" 
                    color={project.shadowColor || project.color}
                    disableTilt={false}
                    spotlightColor="transparent" 
                >
                    <div className="w-full h-full p-4 relative">
                        <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-gray-100 relative shadow-inner group">
                            <img 
                                src={project.img} 
                                alt={project.title} 
                                className={`w-full h-full object-cover transform transition-all duration-500 ease-out group-hover:scale-105 filter grayscale contrast-75 opacity-80 group-hover:grayscale-0 group-hover:contrast-100 group-hover:opacity-100`}
                                decoding="async" 
                                loading="lazy"
                            />
                        </div>
                    </div>
                </Spotlight3D>
            </motion.div>
        </motion.div>
    );
});

// 2. RIGHT SIDE: INFO PREVIEW CARD
const RightPreviewCard: React.FC<{ 
    project: any, 
    handleProjectEnter: () => void, 
    handleProjectLeave: () => void, 
    setSelectedProject: (p: any) => void
}> = React.memo(({ project, handleProjectEnter, handleProjectLeave, setSelectedProject }) => {
    
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY }: React.MouseEvent) => {
        if (!cardRef.current) return;
        const { left, top } = cardRef.current.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const randomConfig = useMemo(() => {
        const seed = project.id;
        return {
            y: ((seed * 37) % 240) - 120,
            x: 600 + (seed * 17) % 300,
            initialRotateZ: ((seed * 13) % 60) - 30,
            targetRotateZ: ((seed * 7) % 10) - 5, 
            rotateY: -30 + ((seed * 7) % 15), 
            rotateX: ((seed * 23) % 40) - 20, 
        };
    }, [project.id]);

    const variants: Variants = {
        initial: { 
            x: randomConfig.x, 
            y: randomConfig.y, 
            rotateY: randomConfig.rotateY, 
            rotateZ: randomConfig.initialRotateZ, 
            rotateX: randomConfig.rotateX,
            opacity: 0, 
            scale: 0.85 
        },
        animate: { 
            x: 0, 
            y: 0, 
            rotateY: 0, 
            rotateZ: randomConfig.targetRotateZ, 
            rotateX: 0,
            opacity: 1, 
            scale: 1,
            transition: { 
                type: "spring", 
                stiffness: 120, 
                damping: 18, 
                mass: 1.2 
            }
        },
        exit: { 
            scale: 0.95, 
            opacity: 0, 
            x: 150,
            rotateY: 10,
            filter: "blur(10px)",
            transition: { duration: 0.25, ease: "easeIn" } 
        }
    };

    return (
        <motion.div
            ref={cardRef}
            key={project.id}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleProjectEnter}
            onMouseLeave={handleProjectLeave}
            onClick={() => setSelectedProject(project)}
            className="absolute cursor-pointer will-change-transform"
            style={{
                top: '25%',
                right: '1%', 
                width: PREVIEW_CARD_WIDTH, 
                height: PREVIEW_CARD_HEIGHT, 
                zIndex: 50,
                transformStyle: "preserve-3d",
                transform: `translateZ(${DEPTHS.PROJECTS + 150}px)` 
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
        >
            <div className="w-full h-full rounded-[2.5rem] relative overflow-hidden group shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-shadow duration-300">
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[20px] rounded-[2.5rem]" />
                <motion.div
                    className="absolute -inset-[1px] rounded-[2.5rem] z-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none blur-2xl"
                    style={{
                        background: project.color,
                        maskImage: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                        WebkitMaskImage: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                    }}
                />
                <div className="absolute inset-0 rounded-[2.5rem] border border-white/50 pointer-events-none mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-60 pointer-events-none rounded-[2.5rem]" />

                <div className="absolute top-8 right-8 z-20">
                    <span className="px-4 py-1.5 rounded-full bg-white/40 border border-white/50 text-xs font-bold font-mono text-gray-600 tracking-widest shadow-sm backdrop-blur-md">
                        {project.year}
                    </span>
                </div>

                <div className="relative z-10 flex flex-col h-full justify-center p-10">
                    <div className="flex items-center gap-4 mb-4 group-hover:translate-x-2 transition-transform duration-500">
                        <h2 className="text-5xl font-albert-black text-black tracking-tight drop-shadow-sm">
                            {project.title}
                        </h2>
                        <div className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-black">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-2.5 h-2.5 rounded-full ring-2 ring-white/50 group-hover:scale-125 transition-transform duration-300 shadow-sm" style={{ backgroundColor: project.color }} />
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                            {project.label}
                        </span>
                    </div>
                    <p className="text-lg text-gray-600 font-albert-regular leading-relaxed max-w-xl">
                        {project.desc}
                    </p>
                </div>
            </div>

            {project.tools?.map((tool: string, i: number) => (
                <motion.div
                    key={tool}
                    className="absolute w-[98px] h-[98px] rounded-2xl bg-white/40 backdrop-blur-lg border border-white/50 shadow-lg flex items-center justify-center p-4 overflow-hidden pointer-events-none will-change-transform"
                    style={{
                        top: `${80 + (i % 2) * 20}%`, 
                        right: `${10 + (i * 15)}%`, 
                        zIndex: 40 
                    }}
                    initial={{ scale: 0, y: 30, rotate: 10 }}
                    animate={{ scale: 1, y: 0, rotate: Math.random() * 20 - 10 }}
                    transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 180, damping: 15 }}
                >
                    <img src={TOOL_ICONS[tool] || ''} alt={tool} className="w-full h-full object-contain relative z-10 opacity-90" decoding="async" />
                </motion.div>
            ))}

        </motion.div>
    );
});

// --- UPDATED COMPONENT: Gallery Modal View ---
const GalleryModalView: React.FC<{ images: string[], projectId?: number, project?: any }> = ({ images, projectId, project }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollVal, setScrollVal] = useState(0);
    const [mouseVal, setMouseVal] = useState(0);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            setScrollVal(Math.round(scrollContainerRef.current.scrollTop));
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        setMouseVal(Math.round(e.clientX));
    };

    // 🟢 Special Render for Horizontal Scroll Project (Project 6)
    if (project?.layout === 'horizontal-scroll' && project.horizontalData) {
        return (
            // 🟢 UPDATED: Pass Project Color, let HorizontalScrollGallery handle the container
            <HorizontalScrollGallery items={project.horizontalData} color={project.color} />
        );
    }

    return (
        // 🟢 MODAL CONTENT WRAPPER
        <div className="relative w-full h-full bg-black">
            
            {/* 🟢 FIXED LAYER: Project 2 Video Interaction */}
            {/* Placed OUTSIDE the scrollable area, as an absolute overlay, to prevent scrolling */}
            {projectId === 2 && project?.project2Config?.videoInteraction && (
                 <Project2FlipVideo config={project.project2Config.videoInteraction} />
            )}

            {/* 🟢 SCROLLABLE AREA */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                onMouseMove={handleMouseMove}
                className="w-full h-full overflow-y-auto overflow-x-hidden floating-scrollbar relative z-10 p-0"
            >
                {/* Real-time Indicator: Scroll Y & Mouse X */}
                <div className="fixed top-24 right-10 z-[70] font-mono text-[10px] text-green-400 bg-black/80 backdrop-blur-md px-3 py-2 rounded border border-green-500/30 pointer-events-none tracking-widest flex flex-col gap-1 shadow-lg">
                    <span className="flex justify-between gap-4"><span>SCROLL Y:</span> <span>{scrollVal}</span></span>
                    <span className="flex justify-between gap-4"><span>MOUSE X:</span> <span>{mouseVal}</span></span>
                </div>

                <div 
                    className="flex flex-col w-full relative"
                    style={{ 
                        // Project 1 needs specific height for absolute elements (max Y is ~10420px)
                        // Project 2: Changed to 'auto' to adapt to content height (fixed black space issue)
                        // Project 4: Needs specific height for absolute elements at ~16400px
                        minHeight: projectId === 1 ? '11000px' : (projectId === 4 ? '18000px' : 'auto')
                    }}
                >
                    
                    {projectId === 1 && project?.sequenceConfig1 ? (
                        <>
                            {/* 1. First Image */}
                            {images[0] && (
                                <div className="w-full bg-black">
                                    <img src={images[0]} className="w-full h-auto block" loading="lazy" decoding="async" alt="P1 Part 1" />
                                </div>
                            )}
                            
                            {/* 2. Second Image */}
                            {images[1] && (
                                <div className="w-full bg-black">
                                    <img src={images[1]} className="w-full h-auto block" loading="lazy" decoding="async" alt="P1 Part 2" />
                                </div>
                            )}
                            
                            {/* 3. SCROLL SEQUENCE */}
                            <ScrollImageSequence config={project.sequenceConfig1} scrollContainerRef={scrollContainerRef} />
                            
                            {/* 4. Third Image */}
                            {images[2] && (
                                <div className="w-full bg-black">
                                    <img src={images[2]} className="w-full h-auto block" loading="lazy" decoding="async" alt="P1 Part 3" />
                                </div>
                            )}
                        </>
                    ) : projectId === 2 && project?.project2Config ? (
                        // 🟢 PROJECT 2 UPDATED LOGIC: Full Width Stack
                        <div className="relative w-full bg-black flex flex-col items-center">
                            {/* Phone Overlay (Sticky or Absolute on top) */}
                            {project.project2Config.phoneImage && (
                                <div 
                                    className="absolute z-20 pointer-events-none mix-blend-normal"
                                    style={{
                                        top: `${project.project2Config.phoneImage.y ?? 100}px`,
                                        left: `${project.project2Config.phoneImage.x ?? 650}px`,
                                        width: `${project.project2Config.phoneImage.width ?? 280}px`
                                    }}
                                >
                                    <img 
                                        src={project.project2Config.phoneImage.url} 
                                        alt="Phone" 
                                        className="w-full h-auto drop-shadow-2xl"
                                    />
                                </div>
                            )}

                            {/* 8 Existing Cards - Now Full Width Stack */}
                            {/* 🟢 DYNAMIC HEIGHT FIX: Apply negative margin based on last card's offset to collapse empty space */}
                            <div 
                                className="w-full flex flex-col relative z-10"
                                style={{
                                    marginBottom: project.project2Config.cards && project.project2Config.cards.length > 0
                                        ? `${project.project2Config.cards[project.project2Config.cards.length - 1].y}px`
                                        : '0px'
                                }}
                            >
                                {project.project2Config.cards && project.project2Config.cards.map((card: any) => {
                                    // 🟢 ANIMATION LOGIC: Cards 3-7 (Indices 2-6)
                                    const shouldAnimate = card.id >= 3 && card.id <= 7;
                                    const finalY = card.y ?? 0;

                                    return (
                                        <motion.img 
                                            key={card.id}
                                            src={card.url} 
                                            alt={`Card ${card.id}`}
                                            className="w-full h-auto block relative"
                                            loading="lazy"
                                            // Animation Properties
                                            initial={{ 
                                                opacity: shouldAnimate ? 0 : 1, 
                                                y: shouldAnimate ? finalY + 150 : finalY 
                                            }}
                                            whileInView={shouldAnimate ? { opacity: 1, y: finalY } : undefined}
                                            viewport={{ once: true, margin: "-100px" }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                        />
                                    );
                                })}
                            </div>

                            {/* 🟢 NEW: Extra Content Render (Absolute Positioning) */}
                            {project.project2Config.extraContent && project.project2Config.extraContent.map((item: any, idx: number) => (
                                <div 
                                    key={idx}
                                    className="absolute w-full flex justify-center pointer-events-auto"
                                    style={{ 
                                        top: `${item.y}px`, 
                                        zIndex: item.zIndex || 30 
                                    }}
                                >
                                    {item.type === 'image' && (
                                        <motion.img 
                                            src={item.url}
                                            className="block h-auto"
                                            style={{ 
                                                width: item.width ? `${item.width}px` : '100%',
                                                maxWidth: '100%'
                                            }}
                                            // 🟢 UPDATED: Added X and Rotate support
                                            // Apply X and Rotate. Since parent is flex-center, x acts as offset from center.
                                            initial={{ opacity: 0, y: 50, x: item.x || 0, rotate: item.rotate || 0 }}
                                            whileInView={{ opacity: 1, y: 0, x: item.x || 0, rotate: item.rotate || 0 }}
                                            transition={{ duration: 0.8 }}
                                        />
                                    )}

                                    {item.type === 'video' && (
                                        <AbsoluteClickableVideo 
                                            url={item.url} 
                                            scale={item.scale} 
                                        />
                                    )}
                                </div>
                            ))}

                        </div>
                    ) : (
                        // Default rendering for other projects
                        <>
                            {images.map((imgUrl, index) => (
                                <div key={index} className="w-full bg-black">
                                    <img 
                                        src={imgUrl} 
                                        className="w-full h-auto block" 
                                        loading="lazy" 
                                        decoding="async" 
                                        alt={`Project Detail ${index + 1}`} 
                                    />
                                </div>
                            ))}

                            {/* 🟢 NEW: Generic Extra Content Render (Absolute Positioning) */}
                            {project?.extraContent?.map((item: any, idx: number) => (
                                <div 
                                    key={`extra-${idx}`}
                                    className="absolute w-full flex justify-center pointer-events-auto"
                                    style={{ 
                                        top: `${item.y}px`, 
                                        zIndex: item.zIndex || 30 
                                    }}
                                >
                                    {item.type === 'image' && (
                                        <motion.img 
                                            src={item.url}
                                            className="block h-auto"
                                            style={{ 
                                                width: item.width ? `${item.width}px` : '100%',
                                                maxWidth: '100%'
                                            }}
                                            initial={{ opacity: 0, y: 50, x: item.x || 0, rotate: item.rotate || 0 }}
                                            whileInView={{ opacity: 1, y: 0, x: item.x || 0, rotate: item.rotate || 0 }}
                                            transition={{ duration: 0.8 }}
                                        />
                                    )}

                                    {item.type === 'video' && (
                                        <AbsoluteClickableVideo 
                                            url={item.url} 
                                            scale={item.scale || 1}
                                            style={{
                                                width: item.width ? `${item.width}px` : undefined,
                                                marginLeft: item.x ? `${item.x}px` : undefined
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </>
                    )}

                    {/* --- CUSTOM OVERLAY TEXTS FOR PROJECT 1 --- */}
                    {projectId === 1 && (
                        <>
                            {/* --- 6. NEW: GROUP 1 CARDS (Updated with Hover Effects) --- */}
                            {GROUP_1_CARDS_DATA.map(card => (
                                <HoverCard 
                                    key={card.id}
                                    img={card.img}
                                    style={{
                                        position: 'absolute',
                                        top: `${card.yOffset}px`,
                                        left: '50%',
                                        marginLeft: `${card.xOffset}px`,
                                        width: `${card.width}px`,
                                        height: `${card.height}px`,
                                    }}
                                    borderRadius={card.borderRadius}
                                    baseRotate={card.rotate}
                                    popOnHover={true}
                                />
                            ))}

                            {/* --- 7. NEW: WAVE IMAGES --- */}
                            {WAVE_IMAGES_CONFIG.map((item, idx) => (
                                <motion.img
                                    key={idx}
                                    src={item.url}
                                    style={{
                                        position: 'absolute',
                                        top: `${item.y}px`,
                                        left: '50%',
                                        marginLeft: `${item.x}px`,
                                        width: `${item.width}px`,
                                        zIndex: item.zIndex
                                    }}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: item.delay, duration: 0.8 }}
                                    alt="Wave"
                                />
                            ))}

                            {/* --- 8. NEW: FOX RABBIT --- */}
                            {CUSTOM_FOX_RABBIT_CONFIG.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    style={{
                                        position: 'absolute',
                                        top: `${item.y}px`,
                                        left: '50%',
                                        marginLeft: '-375px', // Center correction for 750px width (half of 750)
                                        width: '750px', 
                                        height: 'auto',
                                        zIndex: item.zIndex
                                    }}
                                >
                                    <motion.img
                                        src={item.url}
                                        style={{
                                            position: 'absolute',
                                            // User provided X is likely offset from center or absolute left, 
                                            // keeping your specific structure logic here:
                                            left: 0, 
                                            width: `${item.width}px`,
                                        }}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 1 }}
                                        alt="Fox"
                                    />
                                </motion.div>
                            ))}

                            {/* --- 9. NEW: CUSTOM SCATTERED IMAGES (d1-d4) Updated with Hover Effects --- */}
                            <motion.div
                                style={{
                                    position: 'absolute',
                                    top: '0',
                                    left: '50%',
                                    marginLeft: '-750px', // Assume coordinates are based on a 1500px canvas center
                                    width: '1500px',
                                    height: '1px', 
                                    pointerEvents: 'none',
                                    zIndex: 10
                                }}
                            >
                                {CUSTOM_NEW_IMAGES.map((img) => (
                                    <HoverCard 
                                        key={img.id}
                                        img={img.img}
                                        style={{
                                            position: 'absolute',
                                            top: `${img.y}px`,
                                            left: `${img.x}px`,
                                            width: `${img.w}px`,
                                            height: `${img.h}px`,
                                            pointerEvents: 'auto'
                                        }}
                                        baseRotate={img.r}
                                        popOnHover={false}
                                    />
                                ))}
                            </motion.div>

                        </>
                    )}

                    <div className="w-full py-32 text-center bg-black">
                        <p className="text-white/30 text-sm">End of Project Gallery</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VinylProjects: React.FC = () => {
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredProject, setHoveredProject] = useState<any>(null);
    const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 🟢 NEW: Global Music Control Logic based on Modal State
    useEffect(() => {
        // Project ID 6 is the video project
        if (selectedProject?.id === 6) {
            // Pause background music when entering Project 6 modal
            window.dispatchEvent(new Event('pause-background-music'));
        } else {
            // Resume background music when closing modal (if it was playing before)
            window.dispatchEvent(new Event('resume-background-music'));
        }
    }, [selectedProject]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const floorY = useTransform(scrollYProgress, [0, 1], ["-10%", "-280%"]);
    
    // Performance: springs
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 30, damping: 25 });
    const mouseYSpring = useSpring(y, { stiffness: 30, damping: 25 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const w = window.innerWidth;
        const h = window.innerHeight;
        x.set(clientX / w - 0.5);
        y.set(clientY / h - 0.5);
    };

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["45deg", "35deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);
    const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-3%", "3%"]);

    const handleProjectEnter = (proj: any) => {
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
        }
        setHoveredProject(proj);
    };

    const handleProjectLeave = () => {
        if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
        // REMOVED 3s DELAY: Immediate exit on mouse leave
        setHoveredProject(null);
    };

    const cardPositions = useMemo(() => CARD_POSITIONS, []);

    return (
        <section 
            ref={containerRef}
            className="w-full relative bg-white" 
            onMouseMove={handleMouseMove}
            style={{ height: '550vh' }}
        >
             <div id="projects-deck" className="absolute top-0" />

             <style>{`
                .floating-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .floating-scrollbar::-webkit-scrollbar-track {
                    background: transparent; /* Invisible Track */
                }
                .floating-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.4); /* Visible Thumb */
                    border-radius: 99px;
                }
                .floating-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(255, 255, 255, 0.6);
                }
             `}</style>

             <motion.div 
                className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-white will-change-transform"
             >
                 <div className="absolute inset-0 flex items-center justify-center perspective-2000">
                    <motion.div
                        className="relative w-full max-w-[1600px] will-change-transform transform-gpu"
                        style={{
                            scale: PROJECTS_SCALE, // 🟢 APPLIED GLOBAL SCALE
                            rotateX,
                            rotateY,
                            x: translateX,
                            aspectRatio: '16/9',
                            transformStyle: "preserve-3d",
                        }}
                    >
                         {/* --- RIGHT SIDE: RECTANGULAR INFO CARD --- */}
                        <AnimatePresence mode="wait">
                            {hoveredProject && (
                                <RightPreviewCard 
                                    project={hoveredProject}
                                    handleProjectEnter={() => handleProjectEnter(hoveredProject)}
                                    handleProjectLeave={handleProjectLeave}
                                    setSelectedProject={setSelectedProject}
                                />
                            )}
                        </AnimatePresence>

                        {/* FLOOR */}
                        <motion.div 
                            className="absolute inset-0 w-full h-full will-change-transform"
                            style={{ 
                                y: floorY, 
                                transformStyle: "preserve-3d" 
                            }} 
                        >
                            <div className="absolute inset-[-50%] bg-white transform-preserve-3d" style={{ transform: `translateZ(${DEPTHS.FLOOR}px)` }} />
                            
                            <FloorMarquee 
                                direction="left" 
                                text="PROJECTS" 
                                rotate={-10} 
                                className="text-[140px] font-albert-black text-gray-100 leading-none" 
                                style={{ top: '5%', right: '-10%', left: 'auto' }}
                            />

                            <div className="absolute w-full h-full pointer-events-none" style={{ zIndex: 10, transformStyle: "preserve-3d", transform: `translateZ(${DEPTHS.PROJECTS}px)` }}>
                                {PROJECTS_DATA.map((proj, idx) => (
                                    <div key={proj.id} className="pointer-events-auto">
                                        <ProjectImageSquare 
                                            project={proj}
                                            style={cardPositions[idx] as any}
                                            onClick={() => setSelectedProject(proj)}
                                            onHoverStart={() => handleProjectEnter(proj)}
                                            onHoverEnd={handleProjectLeave}
                                            isHovered={hoveredProject?.id === proj.id}
                                            isAnyHovered={!!hoveredProject}
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                    </motion.div>
                 </div>
             </motion.div>

             {/* MODAL WINDOW (Scaled to 60%) */}
             {createPortal(
                <AnimatePresence>
                    {selectedProject && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center perspective-2000">
                            {/* Backdrop - Lights Off Effect (Darker opacity) */}
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }} 
                                className="absolute inset-0 backdrop-blur-md bg-black/90"
                                onClick={() => setSelectedProject(null)}
                            />
                            <motion.div
                                initial={{ y: 50, opacity: 0, scale: 0.9 }} 
                                animate={{ y: 0, opacity: 1, scale: 1 }} 
                                exit={{ y: 50, opacity: 0, scale: 0.9 }} 
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                // 🟢 MODAL SIZE: Fixed 1000px on Desktop
                                className={`relative w-[95vw] md:w-[1000px] h-[90vh] md:h-[95vh] rounded-[2rem] overflow-hidden flex flex-col pointer-events-auto shadow-2xl ${
                                    selectedProject.layout === 'gallery' || selectedProject.layout === 'horizontal-scroll' 
                                        ? 'bg-black border border-white/20' 
                                        : 'bg-white/95 border border-white/50'
                                }`}
                                style={{
                                    boxShadow: selectedProject.layout === 'gallery' || selectedProject.layout === 'horizontal-scroll'
                                        ? '0 0 0 1px rgba(255,255,255,0.1) inset, 0 0 20px rgba(255,255,255,0.05) inset, 0 50px 100px -20px rgba(0,0,0,0.8)'
                                        : '0 0 0 1px rgba(255,255,255,0.5) inset, 0 0 20px rgba(255,255,255,0.2) inset, 0 50px 100px -20px rgba(0,0,0,0.3)'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute inset-0 rounded-[2rem] pointer-events-none z-50 border border-white/10" />
                                <button 
                                    onClick={() => setSelectedProject(null)} 
                                    className={`absolute top-6 right-6 z-[60] w-10 h-10 flex items-center justify-center rounded-full transition-colors border shadow-lg group ${
                                        selectedProject.layout === 'gallery' || selectedProject.layout === 'horizontal-scroll'
                                            ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                                            : 'bg-white/90 hover:bg-white border-gray-200 text-black'
                                    }`}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:rotate-90 transition-transform duration-300"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>

                                {selectedProject.layout === 'gallery' || selectedProject.layout === 'horizontal-scroll' ? (
                                    <GalleryModalView 
                                        images={selectedProject.detailImages || []} 
                                        projectId={selectedProject.id} 
                                        project={selectedProject} 
                                    />
                                ) : (
                                    <div className="w-full h-full overflow-y-auto floating-scrollbar relative z-10">
                                        {/* Reduced Header Height */}
                                        <div className="relative w-full h-[35vh] md:h-[40vh] bg-gray-100 flex items-center justify-center overflow-hidden">
                                            {selectedProject.img ? (
                                                <img src={selectedProject.img} className="w-full h-full object-cover" decoding="async" alt="Project Hero" />
                                            ) : (
                                                <div className="text-gray-400 font-bold tracking-widest text-xs">[ IMAGE CONTAINER ]</div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/90 via-white/40 to-transparent" />
                                        </div>
                                        {/* Reduced Padding and Margin */}
                                        <div className="relative z-10 -mt-20 px-6 md:px-10 pb-8">
                                            <div className="mx-auto max-w-5xl bg-white border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-[2rem] p-6 md:p-10 overflow-hidden relative">
                                                <div className="mb-8 relative z-10">
                                                    {/* Scaled Down Fonts */}
                                                    <h1 className="text-3xl md:text-5xl font-albert-black text-black tracking-tight mb-3">{selectedProject.title}</h1>
                                                    <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-gray-500 uppercase">
                                                        <span className="px-2 py-0.5 bg-black text-white rounded-full">{selectedProject.year}</span>
                                                        <span>{selectedProject.client || 'Client'}</span>
                                                        <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                                        <span>{selectedProject.label}</span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                    <div className="md:col-span-2">
                                                        <h3 className="text-lg font-bold mb-3">Project Overview</h3>
                                                        <p className="text-lg text-gray-800 font-albert-regular leading-relaxed">{selectedProject.desc}</p>
                                                    </div>
                                                    <div className="md:col-span-1 space-y-6">
                                                        <div>
                                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tools</h4>
                                                            <div className="flex gap-2 flex-wrap">
                                                                {selectedProject.tools?.map((tool: string) => (
                                                                    <span key={tool} className="px-2 py-1 bg-gray-100 border border-gray-200 rounded-md text-[10px] font-bold text-gray-600">{tool}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-12" />
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
             )}
        </section>
    );
};

export default VinylProjects;
