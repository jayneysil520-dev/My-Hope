import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';

// --- ICONS ---
const ICONS = {
    Phone: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
    ),
    Email: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </svg>
    ),
    WeChat: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.69 16.89C8.69 16.89 12.98 16.9 15.68 15.34C18.37 13.79 18.29 11.23 18.29 11.23C18.29 11.23 18.29 11.23 18.29 11.23C18.39 8.65 16.14 6.75 13.06 6.75C9.97 6.75 7.42 8.94 7.42 11.91C7.42 13.62 8.32 15.11 9.68 16.03C9.68 16.03 9.97 16.2 9.77 16.88C9.56 17.55 9.17 18.26 9.17 18.26C9.17 18.26 12.39 18.06 14.15 16.63L8.69 16.89Z" opacity="0.6"/>
            <path d="M16.48 15.82C16.48 15.82 21.03 15.16 22.5 12.63C23.97 10.1 22.39 7.5 22.39 7.5C22.39 7.5 22.39 7.5 22.39 7.5C21.84 4.5 18.57 3 15.5 3C12.43 3 9.8 5.25 9.8 8C9.8 8.44 9.86 8.87 9.97 9.27C10.79 9.06 11.75 8.94 12.8 8.94C17.09 8.94 20.66 11.66 20.66 15.24C20.66 16.1 20.47 16.91 20.13 17.65C20.13 17.65 19.78 17.47 19.34 16.99L16.48 15.82Z"/>
        </svg>
    ),
    Xiaohongshu: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 12a8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8 8 8 0 0 1-8-8z" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 11.5c0-2 .5-3.5 1.5-4.5s2.5-1.5 3.5-1.5 2.5.5 3.5 1.5 1.5 2.5 1.5 4.5-1 4-2.5 5.5S12 18 12 18s-2.5-.5-4-1.5S7 13.5 7 11.5z" />
            <path d="M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    )
};

// --- DATA ---
const CONTACT_CARDS = [
    {
        id: 'phone',
        title: 'PHONE',
        value: '+86 138 0000 0000',
        color: '#3B82F6', // Blue
        icon: ICONS.Phone,
        position: { x: '-18%', y: '10%' },
        rotation: -5
    },
    {
        id: 'email',
        title: 'EMAIL',
        value: 'glei.design@example.com',
        color: '#F97316', // Orange
        icon: ICONS.Email,
        position: { x: '18%', y: '10%' },
        rotation: 5
    },
    {
        id: 'wechat',
        title: 'WECHAT',
        value: 'Glei_Design',
        color: '#07C160', // WeChat Green
        icon: ICONS.WeChat,
        position: { x: '-18%', y: '50%' },
        rotation: 5
    },
    {
        id: 'xhs',
        title: 'RED NOTE',
        value: 'Glei_Art',
        color: '#FF2442', // Xiaohongshu Red
        icon: ICONS.Xiaohongshu,
        position: { x: '18%', y: '50%' },
        rotation: -5
    }
];

type ContactCardItem = typeof CONTACT_CARDS[0];

// --- 3D CARD COMPONENT ---
const Card3D: React.FC<{ item: ContactCardItem, index: number }> = ({ item, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(item.value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            className="absolute perspective-1000"
            style={{
                left: '50%',
                top: '20%',
                x: item.position.x, // Offset from center using x/y instead of left/top for cleaner center origin
                y: item.position.y,
                zIndex: isHovered ? 100 : 10,
            }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: index * 0.1, type: "spring" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCopy}
        >
            <motion.div
                className="relative cursor-pointer"
                animate={{
                    // Idle: Square, lying flat on floor (rotateX 60deg to match floor)
                    // Hover: Rectangle, standing up (rotateX 0), facing user
                    width: isHovered ? 300 : 200,
                    height: isHovered ? 400 : 200,
                    rotateX: isHovered ? 0 : 0, // Parent container handles floor tilt, card handles local tilt
                    rotateY: isHovered ? 0 : 0,
                    rotateZ: isHovered ? 0 : item.rotation,
                    y: isHovered ? -100 : 0, // Lift up
                }}
                transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 15
                }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* --- SHADOW GLOW (Only on Hover) --- */}
                <motion.div
                    className="absolute inset-0 rounded-[2rem] blur-[60px] opacity-0 transition-opacity duration-500"
                    animate={{ opacity: isHovered ? 0.6 : 0 }}
                    style={{ backgroundColor: item.color, transform: 'translateZ(-50px)' }}
                />

                {/* --- MAIN CARD --- */}
                <div 
                    className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center transition-colors duration-300"
                    style={{ 
                        backgroundColor: isHovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.05)',
                        borderColor: isHovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)'
                    }}
                >
                    {/* ICON (Animated Position) */}
                    <motion.div
                        animate={{ 
                            y: isHovered ? -40 : 0, 
                            scale: isHovered ? 1.2 : 1,
                            color: isHovered ? item.color : '#000000'
                        }}
                        className="text-black/80"
                    >
                        {item.icon}
                    </motion.div>

                    {/* CONTENT (Revealed on Hover) */}
                    <motion.div
                        className="absolute bottom-10 left-0 w-full px-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                    >
                         <h3 className="text-sm font-bold tracking-widest text-gray-400 mb-2 uppercase">{item.title}</h3>
                         <p className="text-xl font-albert-black text-black break-words leading-tight">{item.value}</p>
                         
                         <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono text-gray-400">
                             {copied ? (
                                 <span className="text-green-500 font-bold flex items-center gap-1">
                                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                     COPIED!
                                 </span>
                             ) : (
                                 <span>CLICK TO COPY</span>
                             )}
                         </div>
                    </motion.div>
                </div>

                {/* --- 3D THICKNESS SIDES --- */}
                <div 
                    className="absolute inset-0 border border-white/10 rounded-[2rem] pointer-events-none"
                    style={{ transform: 'translateZ(-20px)' }}
                />

            </motion.div>
        </motion.div>
    );
};

// --- MAIN COMPONENT ---
const Contact: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

    return (
        <section 
            ref={containerRef}
            className="relative w-full bg-white overflow-hidden"
            style={{ height: '100vh' }}
        >
            <div className="w-full h-full flex items-center justify-center perspective-2000">
                {/* Floor Container */}
                <motion.div
                    className="relative w-full max-w-[1400px] h-full transform-gpu"
                    style={{
                        rotateX: "40deg", // Permanent tilt for the floor
                        y,
                        transformStyle: "preserve-3d",
                    }}
                >
                    {/* Background Floor Title */}
                     <div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
                        style={{ transform: 'translateZ(-100px) rotateX(-10deg)' }}
                    >
                        <h2 className="text-[15vw] font-albert-black text-gray-50 leading-none tracking-tighter select-none">
                            HELLO
                        </h2>
                    </div>

                    {/* Cards Container */}
                    <div className="absolute inset-0 pointer-events-auto" style={{ transformStyle: "preserve-3d" }}>
                         {CONTACT_CARDS.map((card, idx) => (
                             <Card3D key={card.id} item={card} index={idx} />
                         ))}
                    </div>

                </motion.div>
            </div>
        </section>
    );
};

export default Contact;