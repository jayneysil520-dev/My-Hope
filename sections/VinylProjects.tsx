

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

// 🟢 NEW: Flip Card Component for Project 6 (Updated with Hover Effect, Custom Size & Radius)
const FlipVideoCard: React.FC<{ item: any; index: number; color: string }> = ({ item, index, color }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // 🟢 EXTRACT BORDER RADIUS OR DEFAULT TO 24px
    const radius = item.borderRadius ? `${item.borderRadius}px` : '24px';

    const handleMouseMove = ({ clientX, clientY }: React.MouseEvent) => {
        if (!cardRef.current) return;
        const { left, top } = cardRef.current.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    // Auto-play video when flipped
    useEffect(() => {
        if (isFlipped && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(e => console.log("Video play failed", e));
        } else if (!isFlipped && videoRef.current) {
            videoRef.current.pause();
        }
    }, [isFlipped]);

    return (
        <div 
            ref={cardRef}
            className="relative shrink-0 perspective-1000 cursor-pointer group"
            style={{ 
                // 🟢 USER CONFIGURATION: "Thrown" Effect Logic
                width: item.width || '320px', 
                height: item.height || '569px',
                
                // Allow overlapping (negative margins)
                marginLeft: `${item.marginLeft || 0}px`, 
                
                // Z-Index for stacking order
                zIndex: item.zIndex || 1,

                // Combine Transform: Scale + Rotate + Vertical Offset
                transform: `
                    scale(${item.scale || 1}) 
                    rotate(${item.rotation || 0}deg) 
                    translateY(${item.y || 0}px)
                `
            }}
            onMouseMove={handleMouseMove}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                className="w-full h-full relative"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 60, damping: 12 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* --- FRONT: IMAGE --- */}
                <div 
                    className="absolute inset-0 backface-hidden overflow-hidden bg-white shadow-xl border border-white/20"
                    style={{ backfaceVisibility: 'hidden', borderRadius: radius }}
                >
                    {/* 🟢 HOVER EFFECT: Spotlight Gradient Layer */}
                    <motion.div
                        className="absolute -inset-[1px] z-10 opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none"
                        style={{
                            borderRadius: radius,
                            background: color,
                            maskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                            WebkitMaskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                        }}
                    />
                    
                    {/* 🟢 HOVER EFFECT: Glow Background */}
                    <div 
                        className="absolute inset-0 blur-md opacity-0 group-hover:opacity-30 transition-all duration-500 z-0"
                        style={{ backgroundColor: color, borderRadius: radius }}
                    />

                    {/* Image */}
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover relative z-0" />
                    
                    {/* Overlay Hint */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-20">
                         <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/50 flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                <polyline points="16 6 12 2 8 6" />
                                <line x1="12" y1="2" x2="12" y2="15" />
                            </svg>
                         </div>
                    </div>
                    
                    <div className="absolute bottom-6 left-6 right-6 z-20">
                        <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">
                            CLICK TO FLIP
                        </span>
                    </div>
                </div>

                {/* --- BACK: VIDEO --- */}
                <div 
                    className="absolute inset-0 backface-hidden overflow-hidden bg-black shadow-xl border border-white/10"
                    style={{ 
                        backfaceVisibility: 'hidden', 
                        transform: 'rotateY(180deg)',
                        borderRadius: radius 
                    }}
                >
                    <video 
                        ref={videoRef}
                        src={item.video} 
                        className="w-full h-full object-cover"
                        loop
                        muted
                        playsInline
                    />
                    <div className="absolute bottom-6 left-6">
                        <span className="text-white font-albert-bold text-lg drop-shadow-md">{item.title}</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// 🟢 NEW: Horizontal Scroll Gallery Component
const HorizontalScrollGallery: React.FC<{ items: any[]; parentScrollRef: React.RefObject<HTMLDivElement>; color: string }> = ({ items, parentScrollRef, color }) => {
    const targetRef = useRef<HTMLDivElement>(null);
    
    // Use the scrolling of the main modal container (parentScrollRef) to drive this animation
    const { scrollYProgress } = useScroll({
        container: parentScrollRef,
        target: targetRef,
        offset: ["start start", "end end"]
    });

    // Map vertical scroll (0 to 1) to horizontal movement
    // Adjust the "end" percentage based on number of items. e.g. -75% for 4 items depending on viewport width
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

    return (
        <div ref={targetRef} className="relative h-[300vh]"> {/* Large height to allow scroll time */}
             <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-black/95">
                 <motion.div style={{ x }} className="flex items-center pl-[10vw]">
                     <div className="flex items-center">
                        <div className="mr-12 flex flex-col justify-center min-w-[300px]">
                            <h2 className="text-6xl font-albert-black text-white mb-4">VIDEO<br/>GALLERY</h2>
                            <p className="text-white/50 text-sm w-48">Scroll down to explore the collection. Click cards to view videos.</p>
                            <div className="w-12 h-1 mt-6" style={{ backgroundColor: color }} />
                        </div>
                        
                        {items.map((item, index) => (
                             <FlipVideoCard key={item.id} item={item} index={index} color={color} />
                        ))}
                        
                        {/* End Spacer */}
                        <div className="w-[50vw]" />
                     </div>
                 </motion.div>
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
            
            className="absolute cursor-pointer perspective-1000 group will-change-transform"
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
                 {/* WHITE BORDER LAYER - Enhanced for visibility at smaller scale */}
                 {/* Used border-4 to ensure it remains distinct when scaled down */}
                 <div 
                    className="absolute inset-0 rounded-[2.5rem] bg-white border-4 border-white/40 pointer-events-none"
                    style={{ 
                        transform: 'translateZ(-10px)',
                        boxShadow: '30px 30px 60px rgba(0,0,0,0.15)' 
                    }}
                />

                <Spotlight3D 
                    className="w-full h-full rounded-[2.5rem] bg-white/20 backdrop-blur-md border-[3px] border-white/60 shadow-sm" 
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
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="w-full h-full overflow-y-auto overflow-x-hidden floating-scrollbar relative z-10 p-0 bg-black"
            >
                {/* 🟢 PASS THE PROJECT COLOR DOWN */}
                <HorizontalScrollGallery items={project.horizontalData} parentScrollRef={scrollContainerRef} color={project.color} />
            </div>
        );
    }

    return (
        <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onMouseMove={handleMouseMove}
            className="w-full h-full overflow-y-auto overflow-x-hidden floating-scrollbar relative z-10 p-0 bg-black"
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
                    minHeight: projectId === 1 ? '11000px' : 'auto' 
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
                        <div className="w-full flex flex-col relative z-10">
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
                                        // Start state: offset 150px lower (closer to scroll bottom) and invisible
                                        initial={{ 
                                            opacity: shouldAnimate ? 0 : 1, 
                                            y: shouldAnimate ? finalY + 150 : finalY 
                                        }}
                                        // End state: move to final position and fade in when in view
                                        whileInView={shouldAnimate ? { opacity: 1, y: finalY } : undefined}
                                        // Trigger slightly before element is fully in view (-100px margin)
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    // Default rendering for other projects
                    images.map((imgUrl, index) => (
                        <div key={index} className="w-full bg-black">
                            <img 
                                src={imgUrl} 
                                className="w-full h-auto block" 
                                loading="lazy" 
                                decoding="async" 
                                alt={`Project Detail ${index + 1}`} 
                            />
                        </div>
                    ))
                )}

                {/* --- CUSTOM OVERLAY TEXTS FOR PROJECT 1 --- */}
                {projectId === 1 && (
                    <>
                        {/* TEXT OVERLAYS REMOVED AS REQUESTED */}

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
    );
};

const VinylProjects: React.FC = () => {
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredProject, setHoveredProject] = useState<any>(null);
    const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
