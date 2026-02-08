
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

interface ExperienceItem {
  id: string;
  year: string;
  role: string;
  company: string;
  description: string;
  tags: string[];
  type: 'work' | 'edu';
}

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- DATA ---
const mixedData: ExperienceItem[] = [
  {
    id: '1',
    year: '2024 - Present',
    role: '平面视觉设计师',
    company: '宁波得力集团',
    description: '1.根据产品的颜色和产品定位完成产品的内包装，中盒和外箱的图稿设计；2.针对活动设计相关的营销视觉设计，提升用户参与活动的积极性；3.根据具体项目完成还包括海报、KV、PPT美化和动态设计。',
    tags: ['包装设计', '营销视觉', '动态设计'],
    type: 'work'
  },
  {
    id: 'edu-1',
    year: '2021 - 2024',
    role: '硕士 / 视觉传达设计',
    company: '南京师范大学',
    description: '在读期间专注于视觉传达的理论与实践研究，参与多项校级设计项目与学术研讨。',
    tags: ['硕士学位', '视觉传达', '学术研究'],
    type: 'edu'
  },
  {
    id: '2',
    year: '2021 - 2022',
    role: '插画师',
    company: '南京厘米有限公司',
    description: '绘制各种主题的插画，包括不限于标志、海报、KV和插画的制作。',
    tags: ['插画绘制', '海报设计', 'KV'],
    type: 'work'
  },
  {
    id: '3',
    year: '2017 - 2021',
    role: '平面视觉设计师',
    company: '盐城豌豆苗公司',
    description: '1.在猿辅导的动画中，我担任的是前设设计部分工作，完成动画人物的前期设定和人物造型，最终动画顺利上线；2.为神话主题的绘本绘制插画，担任的是插画师的工作。',
    tags: ['动画设定', '角色造型', '绘本插画'],
    type: 'work'
  },
  {
    id: 'edu-2',
    year: '2013 - 2017',
    role: '本科 / 机械电子工程',
    company: '徐州工程学院',
    description: '工科背景赋予了我严谨的逻辑思维能力，为后续转型设计提供了理性的结构支撑。',
    tags: ['本科学位', '逻辑思维', '跨界背景'],
    type: 'edu'
  }
];

// --- UTILS: Formatter for Description ---
const FormattedDescription: React.FC<{ text: string }> = ({ text }) => {
    // Splits text by "1.", "2.", "3." etc to create new lines
    const parts = text.split(/(\d+\.)/g);
    
    // If no numbers found, return text as is
    if (parts.length <= 1) return <p>{text}</p>;

    const elements = [];
    for (let i = 1; i < parts.length; i += 2) {
        // parts[i] is the number (e.g. "1."), parts[i+1] is the content
        elements.push(
            <div key={i} className="flex gap-2 mb-2 items-start">
                <span className="font-bold text-black/60 min-w-[20px]">{parts[i]}</span>
                <span>{parts[i+1]}</span>
            </div>
        );
    }
    // Handle any text before the first number (if any)
    if(parts[0].trim()) {
        elements.unshift(<div key="intro" className="mb-2">{parts[0]}</div>);
    }

    return <div className="leading-relaxed">{elements}</div>;
};


// --- COMPONENT: Apple Glass 3D Card ---
const AppleGlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tiltIntensity?: number;
}> = ({ children, className = "", onClick, tiltIntensity = 15 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${tiltIntensity}deg`, `-${tiltIntensity}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${tiltIntensity}deg`, `${tiltIntensity}deg`]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative group perspective-1000 transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
};

// --- COMPONENT: Spotlight Item Row ---
const SpotlightRow: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className="relative rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      {/* Spotlight Border Effect via Mask */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(0, 0, 0, 0.15), 
              transparent 80%
            )
          `,
          maskImage: `
            linear-gradient(black, black) content-box,
            linear-gradient(black, black)
          `,
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px', // Border width
        }}
      />
      
      {/* Hover Background - Apple Glass darkening/lightening */}
      <div className="absolute inset-0 bg-white/40 border border-white/40 backdrop-blur-sm group-hover:bg-white/60 transition-colors duration-300 rounded-2xl" />

      <div className="relative z-20 p-6 md:p-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {children}
      </div>
    </div>
  );
};

const ExperienceModal: React.FC<ExperienceModalProps> = ({ isOpen, onClose }) => {
  const [selectedItem, setSelectedItem] = useState<ExperienceItem | null>(null);
  // 🇨🇳 CHINA OPTIMIZATION: Replaced Unsplash URL with jsDelivr mirror asset
  const [photoUrl, setPhotoUrl] = useState<string>("https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/Group%20508.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const url = URL.createObjectURL(file);
          setPhotoUrl(url);
      }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 perspective-2000">
            
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="absolute inset-0 bg-white/40 backdrop-blur-2xl" 
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-[1400px] h-[85vh] flex flex-col md:flex-row gap-12 items-center justify-center pointer-events-none">
                
                {/* LEFT: Photo Card (Thrown In Effect) */}
                <motion.div
                    className="flex flex-col items-center pointer-events-auto"
                    initial={{ x: -300, rotate: -25, opacity: 0 }}
                    animate={{ x: 0, rotate: -3, opacity: 1 }}
                    exit={{ x: -300, rotate: -25, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 60, damping: 12, delay: 0.1 }}
                >
                    <AppleGlassCard 
                        tiltIntensity={10}
                        className="w-[320px] h-[420px] md:w-[380px] md:h-[480px] rounded-[2.5rem] bg-white/20 backdrop-blur-xl border border-white/40 shadow-2xl p-3"
                    >
                         <div 
                            className="w-full h-full rounded-[2rem] overflow-hidden relative cursor-pointer group bg-gray-200"
                            onClick={() => fileInputRef.current?.click()}
                         >
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                            
                            {/* Inner Border/Highlight */}
                            <div className="absolute inset-0 border border-white/20 rounded-[2rem] pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 pointer-events-none" />
                         </div>
                    </AppleGlassCard>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 text-center"
                    >
                        <h2 className="text-4xl font-albert-black text-black tracking-tight mb-2">zhanG minGlei</h2>
                        <p className="text-lg font-mono text-gray-500 tracking-widest">1995.05.20</p>
                    </motion.div>
                </motion.div>

                {/* RIGHT: Timeline Container (Apple Glass) */}
                <motion.div 
                    className="w-full max-w-4xl h-full flex-1 pointer-events-auto"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <AppleGlassCard 
                        tiltIntensity={5}
                        className="w-full h-full rounded-[3rem] bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col"
                    >
                         {/* Header */}
                         <div className="p-10 md:p-12 pb-6 border-b border-white/20 flex-shrink-0 bg-white/10 backdrop-blur-md">
                            <h2 className="text-4xl md:text-5xl font-albert-light text-black tracking-tight">
                                EXPERIENCE TIMELINE
                            </h2>
                         </div>

                         {/* Scrollable List */}
                         <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar relative">
                             {/* Vertical Line */}
                             <div className="absolute left-[41px] md:left-[61px] top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-gray-300/50 to-transparent" />

                             <div className="space-y-10">
                                {mixedData.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        className="relative pl-12 md:pl-16 group"
                                    >
                                        {/* Dot - Interactive Hover Effect */}
                                        <div className="absolute left-[3px] md:left-[23px] top-1/2 -translate-y-1/2 flex items-center justify-center z-20">
                                            {/* Outer Ring (expands on hover) */}
                                            <div 
                                                className={`w-5 h-5 rounded-full border-2 transition-all duration-300 scale-0 group-hover:scale-100 ${item.type === 'edu' ? 'border-blue-400' : 'border-[#FF4500]'}`} 
                                            />
                                            {/* Inner Core */}
                                            <div 
                                                className={`absolute w-2.5 h-2.5 rounded-full transition-colors duration-300 bg-gray-300 group-hover:bg-white`} 
                                            />
                                            {/* Glow on hover */}
                                            <div className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${item.type === 'edu' ? 'bg-blue-400' : 'bg-[#FF4500]'}`} />
                                        </div>

                                        <SpotlightRow onClick={() => setSelectedItem(item)}>
                                            {/* Title and Role Section */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-2xl font-bold text-black">{item.company}</h3>
                                                    {/* Arrow */}
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF4500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                                        <polyline points="12 5 19 12 12 19"></polyline>
                                                    </svg>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                                                    <p className="text-gray-500 font-medium text-sm">{item.role}</p>
                                                </div>
                                                <p className="text-gray-400 text-xs mt-3 line-clamp-1">{item.description.substring(0, 50)}...</p>
                                            </div>

                                            {/* Date Pill - Right aligned */}
                                            <div className="self-start md:self-center shrink-0">
                                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono tracking-wider border transition-colors duration-300 ${
                                                    item.type === 'edu' 
                                                        ? 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-100' 
                                                        : 'bg-red-50 text-red-600 border-red-100 group-hover:bg-red-100'
                                                }`}>
                                                    {item.year}
                                                </div>
                                            </div>
                                        </SpotlightRow>
                                    </motion.div>
                                ))}
                             </div>
                         </div>
                    </AppleGlassCard>
                </motion.div>

            </div>

            {/* DETAIL MODAL (Rotating Flip - Apple Glass iOS 16 Style) */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="absolute inset-0 bg-white/20 backdrop-blur-md"
                            onClick={() => setSelectedItem(null)}
                        />
                        
                        <motion.div
                            layoutId={selectedItem.id}
                            initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                            exit={{ opacity: 0, rotateY: -90, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                            style={{ transformStyle: "preserve-3d" }}
                            className="relative w-full max-w-2xl bg-white/60 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.1)] p-10 md:p-14 border border-white/60 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white transition-colors border border-white/50 text-gray-500 hover:text-black"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>

                            {/* Content */}
                            <div>
                                <div className="flex items-center gap-3 mb-8">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${selectedItem.type === 'edu' ? 'bg-blue-100/50 text-blue-600' : 'bg-red-100/50 text-red-600'}`}>
                                        {selectedItem.year}
                                    </span>
                                    <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
                                </div>

                                <h2 className="text-4xl md:text-5xl font-albert-black mb-3 text-black tracking-tight">{selectedItem.company}</h2>
                                <h3 className="text-2xl text-gray-500 mb-10 font-light font-albert-light">{selectedItem.role}</h3>

                                <div className="prose prose-lg text-gray-600 font-albert-regular mb-12">
                                    {/* Use Utility Component to format text with line breaks at numbers */}
                                    <FormattedDescription text={selectedItem.description} />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {selectedItem.tags.map(tag => (
                                        <span key={tag} className="px-4 py-1.5 bg-white/40 border border-white/50 rounded-lg text-xs font-bold text-gray-500 uppercase tracking-wide shadow-sm backdrop-blur-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Decorative Background Elements (Subtle) */}
                            <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-3xl pointer-events-none" />
                            <div className={`absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-10 ${selectedItem.type === 'edu' ? 'bg-blue-400' : 'bg-orange-400'}`} />

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
      )}
    </AnimatePresence>
  );
};

export default ExperienceModal;
