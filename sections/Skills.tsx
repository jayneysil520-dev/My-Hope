
import React, { useRef, useState, useMemo } from 'react';
import { motion, useTransform, useMotionValue, useSpring, useScroll, useMotionTemplate, AnimatePresence } from 'framer-motion';
import Magnetic from '../components/Magnetic';

// ==========================================
// 🟢 CONFIGURATION: GLOBAL ZOOM & LAYOUT
// ==========================================

// 🟢 1. GLOBAL SCALE: Adjusts the zoom level of the entire section
const SKILLS_SCALE = 0.8;

// 🟢 2. CARD DIMENSIONS: Standard dimensions before scaling
const SKILL_CARD_WIDTH = '480px';
const SKILL_CARD_HEIGHT = '160px';
const SOFTWARE_ICON_CLASS = 'w-20 h-20';

// 🟢 3. CARD POSITIONS: Adjust each skill card's Top, Left, and Rotation
const SKILL_CARD_POSITIONS = [
    { top: '-6%',  left: '15%', rotate: -2 },   
    { top: '12%', left: '20%', rotate: 1 },    
    { top: '30%', left: '16%', rotate: -1 },   
    { top: '48%', left: '19%', rotate: 2 },  
];

// --- DATA ---
// Updated to China CDN
const skills = [
    { 
        id: 's1',
        title: "Visual Design", 
        percent: 92, 
        percentText: "92%", 
        color: "#F59E0B", 
        tags: "运营设计, 平面设计, 品牌设计",
        previewImg: "https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260108181225_278_2.jpg",
        previewRotate: -6,
        previewText: "HELLO?"
    },
    { 
        id: 's2',
        title: "AIGC Design", 
        percent: 87, 
        percentText: "87%", 
        color: "#3B82F6", 
        tags: "LIBLIB, Comfy UI, Web UI",
        previewImg: "https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/capa-grass.png",
        previewRotate: 8,
        previewText: "GRASS"
    },
    { 
        id: 's3',
        title: "3D Design", 
        percent: 82, 
        percentText: "82%", 
        color: "#EA580C", 
        tags: "C4D, Blender, Rendering",
        previewImg: "https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/capa-%E7%99%BD%E7%BE%8A.png",
        previewRotate: -12,
        previewText: "Myself"
    },
    { 
        id: 's4',
        title: "Animation Design", 
        percent: 80, 
        percentText: "80%", 
        color: "#8B5CF6", 
        tags: "After Effects, Premiere Pro",
        videoUrl: "https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/1%E6%9C%889%E6%97%A5.mp4",
        previewRotate: 5,
        previewText: "Tokyo Run"
    },
];

// 🟢 SOFTWARE ICONS DATA
// Added 'y' for the button itself
// Added 'previewY' for the card that flies in
const softwares = [
    { 
        name: 'Fig', 
        // 🇨🇳 CHINA OPTIMIZATION: Using jsd.cdn.zzko.cn mirror
        iconUrl: 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/figma/figma-original.svg', 
        color: '#F24E1E', 
        previewRotate: 15, 
        y: 0,
        // 🟢 PREVIEW Y-AXIS: Adjust the vertical position of the flying card (pixels)
        previewY: 0 
    }, 
    { 
        name: 'Ps', 
        // 🇨🇳 CHINA OPTIMIZATION: Using jsd.cdn.zzko.cn mirror
        iconUrl: 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg', 
        color: '#31A8FF', 
        previewRotate: -10, 
        y: 5,
        previewY: -10 // Example: Move Up by 50px
    }, 
    { 
        name: 'Ai', 
        // 🇨🇳 CHINA OPTIMIZATION: Using jsd.cdn.zzko.cn mirror
        iconUrl: 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg', 
        color: '#FF9A00', 
        previewRotate: 8, 
        y: -2,
        previewY: 6 // Example: Move Down by 20px
    }, 
    { 
        name: 'Ae', 
        // 🇨🇳 CHINA OPTIMIZATION: Using jsd.cdn.zzko.cn mirror
        iconUrl: 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg', 
        color: '#9999FF', 
        previewRotate: -15, 
        y: 12,
        previewY: 0 
    }, 
    { 
        name: 'Bl', 
        // 🇨🇳 CHINA OPTIMIZATION: Using jsd.cdn.zzko.cn mirror
        iconUrl: 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/blender/blender-original.svg', 
        color: '#F5792A', 
        previewRotate: 12, 
        y: -2,
        previewY: -8 
    }, 
    { 
        name: 'C4D', 
        iconUrl: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/1197px-C4D_Logo.png', 
        color: '#2A55F5', 
        previewRotate: -8, 
        y: 6,
        previewY: 4 
    }, 
];

// --- DEPTH CONFIG ---
const DEPTHS = {
    FLOOR: -300,
    PROPS: -290,
    MAIN: -50,
};

// --- COMPONENTS ---

// Glass Card with Colored Spotlight Border & TRANSPARENT THICKNESS & Floating
const GlassSkillCard: React.FC<{ 
    skill: any, 
    index: number, 
    style: any, 
    onHoverStart: () => void, 
    onHoverEnd: () => void 
}> = ({ skill, index, style, onHoverStart, onHoverEnd }) => {
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY }: React.MouseEvent) => {
        if (!ref.current) return;
        const { left, top } = ref.current.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const handleEnter = () => {
        onHoverStart();
    };

    const handleLeave = () => {
        onHoverEnd();
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            initial={{ opacity: 0, x: -500, rotateZ: Math.random() * 20 - 10 }}
            whileInView={{ opacity: 1, x: 0, rotateZ: style.rotate as number || 0 }}
            transition={{ delay: index * 0.1, duration: 0.8, type: "spring", stiffness: 50 }}
            whileHover={{ scale: 1.05, x: 20, rotateZ: 0, zIndex: 100 }}
            className="absolute rounded-[2rem] group cursor-pointer perspective-1000 will-change-transform"
            style={{ 
                ...style, 
                width: SKILL_CARD_WIDTH,
                height: SKILL_CARD_HEIGHT,
                transformStyle: "preserve-3d" 
            }}
        >
            {/* --- 3D THICKNESS LAYER (Transparent Glass) --- */}
            <div 
                className="absolute inset-0 rounded-[2rem] bg-white/10 border border-white/20 pointer-events-none"
                style={{ 
                    transform: 'translateZ(-15px)',
                    boxShadow: '20px 20px 50px rgba(0,0,0,0.1)' 
                }}
            />
            <div 
                className="absolute inset-[-1px] rounded-[2rem] border border-white/20 pointer-events-none"
                style={{ transform: 'translateZ(-8px)' }}
            />

            {/* --- MAIN GLASS FACE --- */}
            <div className="absolute inset-0 rounded-[2rem] shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)]" style={{ transformStyle: 'preserve-3d' }}>
                
                {/* Spotlight Border */}
                <motion.div
                    className="absolute -inset-[2px] rounded-[2rem] z-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none"
                    style={{
                        background: skill.color,
                        maskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                        WebkitMaskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                    }}
                />
                
                {/* Glass Background */}
                <div className="absolute inset-0 bg-white/20 backdrop-blur-md border border-white/40 rounded-[2rem] z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-40 pointer-events-none" />
                    
                    {/* Content */}
                    <div className="relative z-20 p-6 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-end">
                            {/* Reverted Text Size */}
                            <h3 className="text-3xl font-albert-black text-black tracking-tight">{skill.title}</h3>
                            <span className="text-3xl font-albert-black opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: skill.color }}>
                                {skill.percentText}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden shadow-inner relative">
                            <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.percent}%` }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                className="h-full rounded-full shadow-lg relative overflow-hidden"
                                style={{ backgroundColor: skill.color }}
                            >
                                <motion.div 
                                    className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg]"
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                />
                            </motion.div>
                        </div>

                        {/* Reverted Text Size */}
                        <div className="text-xs font-mono text-gray-500 truncate mt-1">
                            {skill.tags}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const SoftwareGlassButton: React.FC<{ 
    sw: any, 
    index: number,
    onHoverStart: () => void,
    onHoverEnd: () => void
}> = ({ sw, index, onHoverStart, onHoverEnd }) => {
    const rotation = React.useMemo(() => Math.random() * 10 - 5, []);
    
    // 🟢 Define base Y from config
    const baseY = sw.y || 0;
    // 🟢 Define hover Y (lift up 15px from base)
    const hoverY = baseY - 15;

    return (
        <Magnetic strength={20}>
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                // 🟢 Apply base Y here
                whileInView={{ opacity: 1, y: baseY }}
                viewport={{ once: true, margin: "-50px" }}
                onMouseEnter={() => { onHoverStart(); }}
                onMouseLeave={() => { onHoverEnd(); }}
                transition={{ delay: 0.1 + index * 0.08, type: "spring", stiffness: 50, damping: 12 }}
                // 🟢 Apply hover Y here
                whileHover={{ scale: 1.15, y: hoverY, rotateZ: 0, zIndex: 100 }}
                // Original Size
                className={`${SOFTWARE_ICON_CLASS} rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.15),0_4px_0_rgba(255,255,255,0.3)] flex items-center justify-center cursor-pointer group relative overflow-hidden will-change-transform`}
                style={{ rotate: `${rotation}deg` }}
            >
                <motion.div
                     whileHover={{ scale: 1.15, rotateZ: 0 }}
                     className="w-full h-full flex items-center justify-center"
                >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{ backgroundColor: sw.color }} />
                    {/* Original Text Size */}
                    <span className="font-albert-black text-xl text-black/80 group-hover:text-black transition-colors z-10">
                        {sw.name}
                    </span>
                </motion.div>
            </motion.div>
        </Magnetic>
    );
};

const FloorMarquee: React.FC<{ direction: 'left' | 'right', text: string, className?: string, rotate?: number, style?: React.CSSProperties }> = ({ direction, text, className, rotate = 0, style }) => {
    return (
        <div 
            className="absolute left-[-20%] w-[140%] pointer-events-auto overflow-visible flex group"
            style={{ 
                transform: `translateZ(${DEPTHS.PROPS - 10}px) rotate(${rotate}deg)`, 
                zIndex: 0,
                ...style,
                willChange: "transform" 
            }}
        >
            <motion.div
                className={`flex whitespace-nowrap ${className}`}
                initial={{ x: direction === 'left' ? '0%' : '-50%' }}
                animate={{ x: direction === 'left' ? '-50%' : '0%' }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
                {[...Array(6)].map((_, i) => (
                    <span key={i} className="mx-4 transition-colors duration-300">
                        {text} <span className="mx-4 opacity-30">•</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
};

const Skills: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);
  
  const [hoveredSkill, setHoveredSkill] = useState<any>(null);
  const [hoveredSoftware, setHoveredSoftware] = useState<any>(null);

  const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start start", "end end"]
  });
  const floorY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 40, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 40, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
      const { clientX, clientY } = e;
      const w = window.innerWidth;
      const h = window.innerHeight;
      x.set(clientX / w - 0.5);
      y.set(clientY / h - 0.5);
  };

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["35deg", "25deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-2%", "2%"]);

  return (
    <section 
        ref={containerRef}
        className="relative w-full bg-white overflow-hidden" 
        onMouseMove={handleMouseMove}
        style={{ height: '150vh' }}
    >
      <motion.div 
         className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center will-change-transform"
         onViewportEnter={() => setHasEntered(true)}
      >
        <div className="absolute inset-0 flex items-center justify-center perspective-2000">
            <motion.div
                className="relative w-full max-w-[1600px] will-change-transform"
                style={{
                    scale: SKILLS_SCALE, // 🟢 APPLIED GLOBAL SCALE
                    rotateX,
                    rotateY,
                    x: translateX,
                    y: floorY,
                    aspectRatio: '16/9',
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Floor */}
                <div className="absolute inset-[-50%] bg-white transform-preserve-3d" style={{ transform: `translateZ(${DEPTHS.FLOOR}px)` }} />
                
                {/* 1. Floor Title - Original Size */}
                <FloorMarquee 
                    direction="right" 
                    text="CAPABILITIES" 
                    rotate={5} 
                    className="text-[140px] font-albert-black text-gray-100 leading-none" 
                    style={{ top: '0%' }}
                />

                {/* 2. Skills Stack */}
                <div 
                    className="absolute w-full h-full pointer-events-none"
                    style={{
                        zIndex: 20,
                        transformStyle: "preserve-3d",
                        transform: `translateZ(${DEPTHS.MAIN}px) rotateX(-5deg)`,
                    }}
                >
                    {skills.map((skill, idx) => (
                        <div key={idx} className="pointer-events-auto">
                            <GlassSkillCard 
                                skill={skill} 
                                index={idx}
                                style={SKILL_CARD_POSITIONS[idx]}
                                onHoverStart={() => { setHoveredSkill(skill); setHoveredSoftware(null); }}
                                onHoverEnd={() => setHoveredSkill(null)}
                            />
                        </div>
                    ))}
                </div>

                 {/* 3. Software Icons */}
                <div 
                    className="absolute w-full flex justify-start gap-8 pointer-events-auto"
                    style={{
                        top: '70%', 
                        left: '15%', 
                        transform: `translateZ(${DEPTHS.MAIN}px) rotateX(-10deg)`,
                        zIndex: 20
                    }}
                >
                    {softwares.map((sw, idx) => (
                        <SoftwareGlassButton 
                            key={idx}
                            sw={sw} 
                            index={idx}
                            onHoverStart={() => { setHoveredSoftware(sw); setHoveredSkill(null); }}
                            onHoverEnd={() => setHoveredSoftware(null)}
                        />
                    ))}
                </div>

                {/* 4. Mouse Image - Updated CDN */}
                <motion.div
                    className="absolute w-[200px] pointer-events-none will-change-transform"
                    style={{
                        top: '-8%',
                        right: '5%',
                        zIndex: 50,
                        transform: `translateZ(${DEPTHS.PROPS + 100}px) rotateY(-15deg)`,
                    }}
                    initial={{ opacity: 0, y: -100 }}
                    animate={hasEntered ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1, type: "spring" }}
                >
                     <img 
                        src="https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/mouse-render.png" 
                        onError={(e) => { e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/9684/9684876.png" }}
                        alt="Mouse" 
                        className="w-full drop-shadow-xl"
                        decoding="async" 
                    />
                </motion.div>

                {/* 5. Interaction Previews */}
                <AnimatePresence>
                    {/* A. Skill Preview */}
                    {hoveredSkill && (
                        <motion.div
                            className="absolute w-[500px] h-[600px] pointer-events-none"
                            style={{
                                top: '5%', 
                                right: '10%',
                                zIndex: 15,
                                transformStyle: "preserve-3d",
                                transform: `translateZ(${DEPTHS.PROPS + 50}px) rotateY(-10deg)`,
                            }}
                            initial={{ x: 800, rotate: hoveredSkill.previewRotate || 20, opacity: 0 }}
                            animate={{ x: 0, rotate: hoveredSkill.previewRotate || -5, opacity: 1 }}
                            exit={{ x: 800, rotate: hoveredSkill.previewRotate || 20, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 60, damping: 14 }}
                        >
                            <div className="w-full h-full bg-white p-3 rounded-[2rem] shadow-2xl border border-gray-100">
                                <div className="w-full h-full rounded-[1.5rem] overflow-hidden bg-gray-200 relative">
                                    {hoveredSkill.videoUrl ? (
                                        <video 
                                            key={hoveredSkill.videoUrl} 
                                            src={hoveredSkill.videoUrl}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            preload="auto"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <img 
                                            src={hoveredSkill.previewImg} 
                                            className="w-full h-full object-cover" 
                                            decoding="async" 
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-transparent pointer-events-none" />
                                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl">
                                        <p className="font-albert-black text-sm">{hoveredSkill.previewText || 'DESIGN WORK PREVIEW'}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* B. Software Preview */}
                    {hoveredSoftware && (
                        <motion.div
                            className="absolute w-[250px] h-[250px] pointer-events-none"
                            style={{
                                top: '55%', 
                                // 🟢 APPLYING Y-AXIS ADJUSTMENT FROM DATA
                                marginTop: `${hoveredSoftware.previewY || 0}px`,
                                right: '15%',
                                zIndex: 15,
                                transformStyle: "preserve-3d",
                                transform: `translateZ(${DEPTHS.PROPS + 50}px) rotateY(-10deg)`,
                            }}
                            initial={{ x: 800, rotate: hoveredSoftware.previewRotate || 45, opacity: 0 }}
                            animate={{ x: 0, rotate: hoveredSoftware.previewRotate || 10, opacity: 1 }}
                            exit={{ x: 800, rotate: hoveredSoftware.previewRotate || 45, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 80, damping: 15 }}
                        >
                            <div className="w-full h-full bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-2xl flex items-center justify-center">
                                <div className="w-32 h-32 relative">
                                    <img 
                                        src={hoveredSoftware.iconUrl} 
                                        alt="icon" 
                                        className="w-full h-full object-contain drop-shadow-lg" 
                                        decoding="async" 
                                    />
                                </div>
                                <div className="absolute bottom-4 text-xs font-mono text-gray-500">
                                    {hoveredSoftware.name} 2024
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Skills;
