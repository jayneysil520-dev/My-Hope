
import React, { useRef, useState, useMemo } from 'react';
import { motion, useTransform, useMotionValue, useSpring, useScroll } from 'framer-motion';
import Spotlight3D from '../components/Spotlight3D';
import PatternPlaceholder from '../components/PatternPlaceholder';
import Magnetic from '../components/Magnetic';

// ==========================================
// 🟢 CONFIGURATION: GLOBAL ZOOM & LAYOUT
// ==========================================

// 🟢 1. GLOBAL SCALE: Adjusts the zoom level of the entire section (0.7 = 70%)
const HERO_SCALE = 0.7; 

// 🟢 2. CARD SIZE: Base width for the cards
const CARD_SIZE_CLASSES = "w-[240px] md:w-[300px]"; 

// 🟢 3. CARD POSITIONS: Randomized "Messy Floor" Layout
// Designed to look like cards thrown on a surface
const CARD_LAYOUT_CONFIG = [
    { left: '-12%',  top: '-8%', zIndex: 10 }, // Top Left (High)
    { left: '77%', top: '58%', zIndex: 12 }, // Bottom Right (Cluster)
    { left: '5%', top: '60%', zIndex: 14 }, // Bottom Left (Foreground)
    { left: '97%', top: '12%', zIndex: 8 },  // Top Right (Corner)
    { left: '38%', top: '62%', zIndex: 15 }, // Bottom Center (Overlap)
    // 🟢 NEW CARDS SCATTERED
    { left: '12%', top: '35%', zIndex: 5 },  // Middle Left (Background)
    { left: '75%', top: '6%',  zIndex: 13 }, // Top Right Center
    { left: '67%', top: '30%', zIndex: 6 },  // Center (Underneath title)
];

// --- DATA ---
// Updated to use jsd.cdn.zzko.cn
const heroCards = [
  { 
      id: 1, 
      color: '#FF7F27', 
      rotate: 25, // More extreme rotation
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/1.png',
      scale: 1.32 // Larger feature card
  }, 
  { 
      id: 2, 
      color: '#00A2E8', 
      rotate: 15, 
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/2.png',
      scale: 1.14
  }, 
  { 
      id: 3, 
      color: '#55FFFF', 
      rotate: -35, // Sharp angle
      scale: 0.94,
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E7%8C%BF%E8%BE%85%E5%AF%BC%E5%B0%81%E9%9D%A2.png'
  }, 
  {   id: 4, 
      color: '#00FF40', 
      rotate: 42, // Extreme angle
      scale: 1.16,
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E5%8D%AB%E5%B2%97/%E5%B0%81%E9%9D%A2%E5%9B%BE.png'
  }, 
  { 
      id: 5, 
      color: '#FFCCAA', 
      rotate: 8, 
      scale: 1.19,
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/nezha/%E5%93%AA%E5%90%92%E6%B5%B7%E8%B4%BC%E7%8E%8B.png' 
  }, 
  // 🟢 NEW CARDS DATA
  { 
      id: 6, 
      color: '#E0221E', 
      rotate: 28, 
      scale: 0.84, // Small, thrown far
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/animation/%E8%A7%86%E9%A2%91%E5%B0%81%E9%9D%A2.png'
  },
  { 
      id: 7, 
      color: '#AA88EE', 
      rotate: -12, 
      scale: 1.04,
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/animation/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_2026-02-02_223917_470.jpg'
  },
  { 
      id: 8, 
      color: '#4ECDC4', 
      rotate: 55, // Very sharp rotation
      scale: 0.79,
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/animation/Group%20951.png'
  }
];

// --- DEPTH CONFIG ---
const DEPTHS = {
    FLOOR: -300,
    PROPS: -290,
    CARDS: -50,
    TEXT: 10, 
};

// Wrapper component to handle individual hover state and random floating
const FloatingHeroCard: React.FC<{ card: any, index: number, hasEntered: boolean }> = ({ card, index, hasEntered }) => {
    const layout = CARD_LAYOUT_CONFIG[index] || { left: '50%', top: '50%', zIndex: 1 }; // Fallback
    const initialX = index % 2 === 0 ? -1500 : 1500;
    const [isHovered, setIsHovered] = useState(false);

    // Random floating params
    const randomDuration = useMemo(() => 3 + Math.random() * 2, []);
    const randomOffset = useMemo(() => 10 + Math.random() * 10, []);

    return (
        <motion.div
            className={`absolute cursor-pointer ${CARD_SIZE_CLASSES} will-change-transform`}
            style={{
                top: layout.top,
                left: layout.left,
                aspectRatio: '1/1',
                zIndex: layout.zIndex,
                transformStyle: "preserve-3d",
                z: DEPTHS.CARDS,
            }}
            initial={{ opacity: 0, x: initialX, rotate: card.rotate * 2 }}
            animate={hasEntered ? { opacity: 1, x: 0, rotate: card.rotate } : {}}
            transition={{ duration: 0.8, delay: index * 0.05, type: "spring", stiffness: 50, damping: 15 }} // Slightly looser spring for "thrown" feel
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                animate={{
                    y: isHovered ? -40 : [0, -randomOffset, 0],
                    // 🟢 SCALE APPLIED HERE:
                    scale: isHovered ? (card.scale || 1) * 1.05 : (card.scale || 1),
                    rotate: isHovered ? 0 : [0, 1, -1, 0], 
                }}
                transition={{
                    y: {
                        duration: isHovered ? 0.3 : randomDuration,
                        repeat: isHovered ? 0 : Infinity,
                        repeatType: "mirror", 
                        ease: "easeInOut"
                    },
                    scale: { duration: 0.3 },
                    rotate: { duration: isHovered ? 0.3 : 5, repeat: Infinity, repeatType: "mirror" }
                }}
                className="w-full h-full"
            >
                <Magnetic strength={30}>
                    <Spotlight3D 
                        className="w-full h-full rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]" 
                        color={card.color}
                        enableElasticScale={false} 
                        spotlightColor="rgba(255,255,255,0.5)"
                    >
                        <div className="w-full h-full relative p-3">
                            <div className="w-full h-full rounded-[2rem] overflow-hidden relative shadow-inner">
                                {card.img ? (
                                    <div className="w-full h-full relative group">
                                            <img 
                                            src={card.img} 
                                            alt={`Card ${card.id}`} 
                                            className="w-full h-full object-cover"
                                            decoding="async"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                    </div>
                                ) : (
                                    <PatternPlaceholder color={card.color} number={card.id} />
                                )}
                            </div>
                        </div>
                    </Spotlight3D>
                </Magnetic>
            </motion.div>
        </motion.div>
    );
};

const Hero: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasEntered, setHasEntered] = useState(false);

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
            style={{ height: '140vh' }}
        >
             <motion.div 
                className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center will-change-transform"
                onViewportEnter={() => setHasEntered(true)}
             >
                <div className="absolute inset-0 flex items-center justify-center perspective-2000">
                    <motion.div
                        className="relative w-full max-w-[1400px] will-change-transform transform-gpu"
                        style={{
                            scale: HERO_SCALE, // 🟢 APPLIED GLOBAL SCALE
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
                        
                        {/* 1. Main Title - Reverted Sizes */}
                        <div className="absolute top-[15%] left-0 w-full text-center pointer-events-none" style={{ transform: `translateZ(${DEPTHS.TEXT}px) rotateX(-10deg)` }}>
                             <motion.div 
                                className="font-albert-black text-[6vw] md:text-[8vw] leading-none tracking-tighter mix-blend-multiply opacity-90 whitespace-nowrap flex flex-col justify-center items-center"
                                initial={{ opacity: 0, y: 150 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                viewport={{ once: true }}
                             >
                                <span className="text-black transform -skew-x-6">zhanG minGlei</span>
                            </motion.div>

                            <motion.div 
                                className="mt-4 flex flex-col items-center gap-2"
                                initial={{ opacity: 0, y: 80 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                <div className="font-albert-light text-2xl md:text-3xl text-gray-500 tracking-widest uppercase">Visual Designer</div>
                                <div className="w-12 h-[1px] bg-gray-300 my-1" />
                                <div className="font-albert-light text-xl md:text-2xl text-gray-400 tracking-widest uppercase">Illustrator & Animator</div>
                            </motion.div>
                        </div>

                        {/* 2. Scattered Cards */}
                        {heroCards.map((card, idx) => (
                            <FloatingHeroCard key={card.id} card={card} index={idx} hasEntered={hasEntered} />
                        ))}

                    </motion.div>
                </div>
             </motion.div>
        </section>
    );
};

export default Hero;
