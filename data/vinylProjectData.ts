

// 🔒 LOCKED DATA: USER CONFIGURATION
// Please do not overwrite this file with placeholder data in future updates.

// 自定义长图链接
export const MY_CUSTOM_LONG_IMAGE = 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/%E7%8B%90%E7%8B%B8%E5%92%8C%E5%85%94%E5%AD%90.png';

// 资源链接
export const ASSETS = {
    P1_IMG_1: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/%E5%86%92%E9%99%A9%E5%B0%8F%E9%98%9F%E9%95%BF%E5%9B%BE1.png',
    P1_IMG_2: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E7%AC%AC%E4%B8%80%E4%B8%AA%E5%8D%A1%E7%89%87%E7%AC%AC%E4%BA%8C%E9%95%BF%E5%9B%BE%E6%9C%80%E5%90%8E%E4%B8%80%E7%89%88.png',
    P1_IMG_3: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E7%AC%AC%E4%B8%80%E4%B8%AA%E5%8D%A1%E7%89%87%E7%AC%AC%E5%9B%9B%E9%95%BF%E5%9B%BE.png',
    P1_VID_1: "https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%93%85%E7%AC%94%E7%9A%84%E8%A7%86%E9%A2%91.mp4",
    P1_VID_2: "https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E6%89%8B%E8%87%82%E8%A7%86%E9%A2%91.mp4",
    PROJECT_2_LONG: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E5%BE%97%E5%8A%9B%E8%9B%8B%E4%BB%94%E9%95%BF%E5%9B%BE1-11.png',
    PROJECT_2_VIDEO: "https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%93%85%E7%AC%94%E7%9A%84%E8%A7%86%E9%A2%91.mp4" 
};

export interface WaveItemConfig {
    url: string;
    x: number;
    y: number;
    width: number;
    rotate?: number;
    zIndex?: number;
    delay?: number;
}

// 自由布局配置 (Fox and Rabbit)
// 🔒 DATA LOCKED: User specified values
export const CUSTOM_FOX_RABBIT_CONFIG: WaveItemConfig[] = [
    {
        url: MY_CUSTOM_LONG_IMAGE,
        x: 375,
        y: 8980,
        width: 750,
        rotate: 0,
        zIndex: 30
    }
];

// 自由布局配置 (Wave Images)
// 🔒 DATA LOCKED: User specified values
export const WAVE_IMAGES_CONFIG: WaveItemConfig[] = [
    { url: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/down.png', x: -400, y: 9270, width: 770, rotate: 0, zIndex: 3, delay: 0.1 },
    { url: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/midle.png', x: -400, y: 9110, width: 770, rotate: 0, zIndex: 2, delay: 0.2 },
    { url: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/up.png', x: -400, y: 9000, width: 770, rotate: 0, zIndex: 1, delay: 0.3 }
];

// Group 1 Cards Data
export const GROUP_1_CARDS_DATA = [
    { id: 1, xOffset: -400, yOffset: 8560, width: 188.52, height: 109.18, rotate: 0, borderRadius: '32px', img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/1.png' },
    { id: 2, xOffset: -201.5, yOffset: 8560, width: 188.52, height: 68.61, rotate: 0, borderRadius: '32px', img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/2.png' },
    { id: 3, xOffset: -3, yOffset: 8560, width: 188.52, height: 90.28, rotate: 0, borderRadius: '32px', img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/3.png' },
    { id: 4, xOffset: 195.52, yOffset: 8560, width: 188.52, height: 109.18, rotate: 0, borderRadius: '32px', img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/4.png' }
];

// New Scattered Images
export const CUSTOM_NEW_IMAGES = [
    { 
        id: 'd1', 
        img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/d1.png', 
        x: 350,      
        y: 10200,    
        w: 220.8,      
        h: 307.2,      
        r: -7.76      
    },
    { 
        id: 'd2', 
        img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/d2.png', 
        x: 515, 
        y: 10420, 
        w: 220.8, 
        h: 307.2, 
        r: 10.12 
    },
    { 
        id: 'd3', 
        img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/d3.png', 
        x: 635, 
        y:10050, 
        w: 220.8, 
        h: 307.2,  
        r: 2.15 
    },
    { 
        id: 'd4', 
        img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%95%BF%E5%9B%BE/d4.png', 
        x: 920, 
        y: 10280, 
        w: 220.8, 
        h: 307.2,  
        r: -5.54 
    }
];

export const TOOL_ICONS: Record<string, string> = {
    'Figma': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/figma/figma-original.svg',
    'PS': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg',
    'AI': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg',
    'AE': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg',
    'Blender': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/blender/blender-original.svg',
    'C4D': 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/1197px-C4D_Logo.png',
    'React': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/react/react-original.svg',
    'ThreeJS': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/threejs/threejs-original.svg', 
    'Jimeng': 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E5%8D%B3%E6%A2%A6icon.png',
    'Pinterest': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/pinterest/pinterest-original.svg',
    'LibLib': 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/LibLib.png'
};

// Project Data
export const PROJECTS_DATA = [
  { 
      id: 1, 
      title: '得力欧美市场IP形象设计', 
      label: 'IP IMAGE DESIGN', 
      year: '2025.01 - 2025.03', 
      client: 'DELI', 
      color: '#FF7F27', 
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/1-1.png', 
      desc: 'Creating a magical land named "Heart Language Forest" for Deli\'s European and American markets.',
      tools: ['Jimeng', 'PS', 'Figma', 'Blender', 'LibLib'],
      layout: 'gallery', 
      scrollVideoUrl: ASSETS.P1_VID_1,
      scrollVideoUrl2: ASSETS.P1_VID_2,
      sequenceConfig1: {
          baseUrl: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/arm/ezgif-frame-', 
          suffix: '.png',
          digits: 3,       
          frameCount: 56,
          startIndex: 1
      },
      detailImages: [ASSETS.P1_IMG_1, ASSETS.P1_IMG_2, ASSETS.P1_IMG_3],
  },
  { 
      id: 2, 
      title: '蛋仔派对·得力创作大赛视觉设计', 
      label: 'VISUAL DESIGN', 
      year: '2025.02', 
      color: '#FFA500', 
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/2-1.png', 
      desc: '得力在手，蛋仔脑洞全开',
      tools: ['Figma', 'Jimeng', 'PS', 'Blender', 'LibLib'],
      layout: 'gallery',
      scrollVideoUrl: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E8%9B%8B%E4%BB%94%E6%B4%BE%E5%AF%B9%E5%BE%97%E5%8A%9B/1%E6%9C%8825%E6%97%A5.mp4',
      // New Config for Project 2 allowing explicit positioning
      project2Config: {
        // Updated: Removed totalHeight and absolute positioning coordinates.
        // Images will now automatically fill the width of the modal (1000px).
        phoneImage: {
            url: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E8%9B%8B%E4%BB%94%E6%B4%BE%E5%AF%B9/%E6%89%8B%E6%9C%BA%E5%B1%8F%E5%B9%95.png',
            x: 607, // 👈 X Axis (Left Position in px) - Adjust this to move Left/Right
            y: 660,  // 👈 Y Axis (Top Position in px) - Adjust this to move Up/Down
            width: 280
        },
        cards: [
            { id: 1, url: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E8%9B%8B%E4%BB%94%E6%B4%BE%E5%AF%B9/%E5%8D%A1%E7%89%871.png', y: 0 },
            { id: 2, url: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E8%9B%8B%E4%BB%94%E6%B4%BE%E5%AF%B9/%E5%8D%A1%E7%89%872.png', y: -348 },
            { id: 3, url: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E8%9B%8B%E4%BB%94%E6%B4%BE%E5%AF%B9/%E5%8D%A1%E7%89%873.png', y: -620 },
            { id: 4, url: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E8%9B%8B%E4%BB%94%E6%B4%BE%E5%AF%B9/%E5%8D%A1%E7%89%874.png', y: -920 },
            { id: 5, url: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E8%9B%8B%E4%BB%94%E6%B4%BE%E5%AF%B9/%E5%8D%A1%E7%89%875.png', y: -1300 },
            { id: 6, url: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E8%9B%8B%E4%BB%94%E6%B4%BE%E5%AF%B9/%E5%8D%A1%E7%89%876.png', y: -1400 },
            { id: 7, url: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E8%9B%8B%E4%BB%94%E6%B4%BE%E5%AF%B9/%E5%8D%A1%E7%89%877.png', y: -1600 },
            { id: 8, url: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E8%9B%8B%E4%BB%94%E6%B4%BE%E5%AF%B9/%E5%8D%A1%E7%89%878.png', y: -2000 },
        ]
      },
      detailImages: [], // Fallback/Empty as we use project2Config
  },
  { 
      id: 3, title: '猿辅导运营设计', label: 'VISUAL DESIGN', year: '2022', color: '#4DA6FF', 
      shadowColor: '#4DA6FF',
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E7%8C%BF%E8%BE%85%E5%AF%BC%E5%B0%81%E9%9D%A2.png', 
      desc: 'Cyberpunk aesthetic visual identity system for a futuristic fashion label.',
      tools: ['PS', 'AI', 'C4D'],
      layout: 'gallery',
      detailImages: ['https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E7%8C%BF%E7%BC%96%E7%A8%8B/%E7%8C%BF%E7%BC%96%E7%A8%8B%E9%95%BF%E5%9B%BE1.jpg'],
      detailText: { main: 'Yuan', sub: '运营设计 OPERATION DESIGN', signature: 'Tutor' }
  },
  { 
      id: 4, 
      title: '卫岗形象设计之LoRA炼制', 
      label: 'LOGO / IP DESIGN', 
      year: '2022', 
      color: '#EA2F2F', 
      img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E5%8D%AB%E5%B2%97/%E5%B0%81%E9%9D%A2%E5%9B%BE.png', 
      desc: 'Rhythm of city life captured in a rhythmic event discovery application.',
      tools: ['Figma', 'LibLib', 'PS', 'AI'],
      layout: 'gallery',
      detailImages: [
          'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E5%8D%AB%E5%B2%97/%E5%8D%AB%E5%B2%97%E9%95%BF%E5%9B%BE1.png',
          'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E5%8D%AB%E5%B2%97/%E5%8D%AB%E5%B2%97%E9%95%BF%E5%9B%BE2.png'
      ]
  },
  { 
      id: 5, 
      title: '哪吒书立及腰封设计', 
      label: 'IOT INTERFACE', 
      year: '2025', 
      color: '#E0221E', 
      img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/nezha/%E5%93%AA%E5%90%92%E6%B5%B7%E8%B4%BC%E7%8E%8B.png', 
      desc: 'Smart home interface connecting organic patterns with digital control.',
      tools: ['AI', 'Figma']
  },
  { 
      id: 6, 
      title: '个人视频部分', 
      label: 'MOTION ART', 
      year: '2021-2025', 
      color: '#AA88EE', 
      img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/animation/%E8%A7%86%E9%A2%91%E5%B0%81%E9%9D%A2.png', 
      desc: 'Experimental motion graphics exploring the concept of digital minimalism.',
      tools: ['C4D', 'AE', 'Blender'],
      // 🟢 UPDATED CONFIG FOR PROJECT 6: Horizontal Scrolling + Flip Cards
      layout: 'horizontal-scroll',
      horizontalData: [
          {
              id: 1,
              img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/animation/1.png', 
              video: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E9%93%85%E7%AC%94%E7%9A%84%E8%A7%86%E9%A2%91.mp4',
              title: 'Daily of designer',
              // 🟢 USER CONFIGURATION: Random "Thrown" Effect
              width: 320, 
              height: 569, 
              y: 80, // Vertical offset
              scale: 0.9,
              rotation: -12, // Tilted left
              marginLeft: 0, 
              borderRadius: 40,
              zIndex: 10
          },
          {
              id: 2,
              img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/animation/2.png', 
              video: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E6%89%8B%E8%87%82%E8%A7%86%E9%A2%91.mp4',
              title: 'Tokyo Run',
              width: 320,
              height: 569,
              y: -50, // Floating higher
              scale: 1.1,
              rotation: 8, // Tilted right
              marginLeft: -90, // Overlap the previous card
              borderRadius: 40,
              zIndex: 20 // On top
          },
          {
              id: 3,
              img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/animation/3.png', 
              video: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/1%E6%9C%889%E6%97%A5.mp4',
              title: 'MoonliGht',
              width: 320,
              height: 569,
              y: 40,
              scale: 1.0,
              rotation: -6, // Slight tilt
              marginLeft: -50, // Slight overlap
              borderRadius: 40,
              zIndex: 15
          },
          {
              id: 4,
              img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/animation/4.png', 
              video: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E8%9B%8B%E4%BB%94%E6%B4%BE%E5%AF%B9%E5%BE%97%E5%8A%9B/1%E6%9C%8825%E6%97%A5.mp4',
              title: '2  6k.  m e  r',
              width: 320,
              height: 569,
              y: -80, // High up
              scale: 0.95,
              rotation: 15, // Heavy tilt
              marginLeft: -70, // Overlap
              borderRadius: 40,
              zIndex: 25 // Highest Z
          }
      ]
  },
  { 
      id: 7, 
      title: 'aboUt mysElf', 
      label: 'Personal Gallery', 
      year: '2021-2025', 
      color: '#4ECDC4', 
      img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/animation/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_2026-02-02_223917_470.jpg', 
      desc: 'A collection of personal experiments and visual explorations.', 
      tools: ['Blender', 'PS', 'AI'], 
      layout: 'gallery',
      detailImages: [
          'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1515405295579-ba7f45403022?q=80&w=1000&auto=format&fit=crop'
      ]
  },
  { 
      id: 8, title: '自媒体设计能力沉淀', label: 'Personal Growth', year: '2021-2026', color: '#FF0055', 
      img: 'https://images.unsplash.com/photo-1515405295579-ba7f45403022?q=80&w=1000&auto=format&fit=crop', 
      desc: 'Visualizing sound waves in real-time using WebAudio API and Canvas.',
      tools: ['Figma', 'PS']
  }
];