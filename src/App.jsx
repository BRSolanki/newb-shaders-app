import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Menu, Search, Settings, User, Layers, 
  ArrowLeft, Download, Share2, Heart, 
  Monitor, Smartphone, Gamepad2, 
  ChevronRight, Github, Globe, Twitter,
  Moon, Sun, Check, ExternalLink, X,
  Trash2, LogOut, Edit2, Save,
  Youtube, Disc, Coffee, Link as LinkIcon,
  RefreshCw, WifiOff, Maximize2, ChevronLeft,
  BookOpen, AlertTriangle, Play, Info, MessageSquare
} from 'lucide-react';

// ==========================================
// CONFIGURATION & STYLES
// ==========================================
const API_URL = "https://newb-shader-backend.onrender.com/api/sync"; 

if (!document.getElementById('app-styles')) {
  const styleTag = document.createElement('style');
  styleTag.id = 'app-styles';
  styleTag.innerHTML = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    .animate-slide-in-right {
      animation: slideInRight 0.3s ease-out forwards;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin 1s linear infinite;
    }
    @keyframes fadeInImage {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-fade-in-image {
      animation: fadeInImage 0.3s ease-out forwards;
    }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    
    .ptr-spinner {
      transition: transform 0.2s;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 0;
      overflow: hidden;
    }
    .ptr-spinner.visible {
      height: 60px;
    }
  `;
  document.head.appendChild(styleTag);
}

// ==========================================
// DATABASE MOCK (Fallback)
// ==========================================
const DATABASE = {
  "versions": [
    { "base": "1.21.111", "label": "1.21.111+" },
    { "base": "1.21.20", "label": "1.21.20+" },
    { "base": "1.20.80", "label": "1.20.80+" },
    { "base": "1.19.60", "label": "1.19.60+" }
  ],
  "developers": [
    {
      "id": "0_devendrn", 
      "name": "devendrn",
      "website": "https://devendrn.github.io",
      "icon": "https://avatars.githubusercontent.com/u/91605478?v=4",
      "verified": true,
      "socials": [
        { "title": "GitHub",   "link": "https://github.com/devendrn" },
        { "title": "Discord",  "link": "https://discord.gg/t8Y9aB4YQj" }, // Updated Link
        { "title": "YouTube",  "link": "https://youtube.com/@devendrn" }
      ],
      "role": "Lead Developer",
      "location": "India",
      "bio": "Creator of Newb Shaders. Focused on performance and aesthetics."
    }
  ],
  "shaders": [
    {
      "id": 0,
      "title": "Newb X Legacy",
      "creator": "0_devendrn", 
      "readme": "newb_x_legacy",
      "platforms": ["ANDROID", "IOS", "WINDOWS"],
      "supportedVersion": "1.21.20",
      "downloadLink": "https://github.com/devendrn/newb-x-mcbe/releases/download/v16/newb-x-legacy-16.0-merged.mcpack",
      "screenshots": [
        "https://media.forgecdn.net/attachments/1067/794/overworld-cave-0.jpg",
        "https://media.forgecdn.net/attachments/1067/806/underwater-1.jpg",
        "https://media.forgecdn.net/attachments/1067/805/overworld-sunrise-0.jpg"
      ],
      "otherLinks": [
        { "title": "GitHub", "link": "https://github.com/devendrn/newb-x-mcbe" }
      ],
      "tags": ["Low End", "Vanilla+"],
      "description": "The classic look. Soft lighting, vibrant clouds, and water reflections optimized for low-end devices.",
      "updated_at": "Oct 2023"
    }
  ]
};

// ==========================================
// HELPERS
// ==========================================

const PLATFORM_MAP = {
  'ANDROID': { label: 'Android', icon: <Smartphone size={14} /> },
  'IOS':     { label: 'iOS', icon: <Smartphone size={14} /> },
  'WINDOWS': { label: 'Windows', icon: <Monitor size={14} /> },
  'XBOX':    { label: 'Xbox/PS', icon: <Gamepad2 size={14} /> },
};

const getSocialIcon = (title) => {
  const lowerTitle = title?.toLowerCase() || "";
  if (lowerTitle.includes('github')) return <Github size={20} />;
  if (lowerTitle.includes('discord')) return <Disc size={20} />;
  if (lowerTitle.includes('youtube')) return <Youtube size={20} />;
  if (lowerTitle.includes('twitter')) return <Twitter size={20} />;
  if (lowerTitle.includes('website')) return <Globe size={20} />;
  return <LinkIcon size={20} />;
};

const normalizeShaderData = (shader) => ({
  ...shader,
  title: shader.title || "Untitled Shader",
  thumbnail: shader.screenshots?.[0] || "https://via.placeholder.com/800x400?text=No+Image",
  description: shader.description || "No description available.",
  tags: shader.tags || ["Shader"],
  platforms: shader.platforms || [],
  otherLinks: shader.otherLinks || [],
  supportedVersion: shader.supportedVersion || "Unknown"
});

const TAG_OPTIONS = ["Ultra", "Low End", "Vanilla+", "Atmospheric", "Cinematic"];

// ==========================================
// UI COMPONENTS
// ==========================================

const Chip = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap active:scale-95 ${active ? 'bg-teal-200 text-teal-900 dark:bg-teal-700 dark:text-teal-100 shadow-sm' : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700'}`}>{label}</button>
);

const PlatformBadge = ({ type }) => {
  const config = PLATFORM_MAP[type?.toUpperCase()] || PLATFORM_MAP['ANDROID']; 
  return <div title={config.label} className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">{config.icon}</div>;
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer); }, [onClose]);
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-3 px-4 py-3 rounded-2xl bg-neutral-900/90 dark:bg-white/90 text-white dark:text-neutral-900 shadow-xl backdrop-blur-md min-w-[200px] max-w-[90vw] animate-fade-in-up">
      {type === 'success' && <Check size={18} className="text-green-500" />}
      {type === 'download' && <Download size={18} className="text-blue-400" />}
      {type === 'heart' && <Heart size={18} className="text-red-500 fill-current" />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

const Lightbox = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-fade-in-up">
      <div className="absolute top-4 right-4 z-50">
        <button onClick={onClose} className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20"><X size={24} /></button>
      </div>
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <img 
          key={currentIndex}
          src={images[currentIndex]} 
          className="max-h-[85vh] max-w-[95vw] object-contain rounded-lg shadow-2xl animate-fade-in-image"
          alt="Fullscreen"
        />
        {images.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1)); }} className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"><ChevronLeft size={32} /></button>
            <button onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0)); }} className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"><ChevronRight size={32} /></button>
          </>
        )}
      </div>
      <div className="h-20 flex justify-center items-center gap-2 overflow-x-auto px-4 pb-4">
        {images.map((img, idx) => (
          <button key={idx} onClick={() => setCurrentIndex(idx)} className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${idx === currentIndex ? 'border-teal-500 opacity-100 scale-110' : 'border-transparent opacity-50'}`}>
            <img src={img} className="w-full h-full object-cover" alt="thumb" />
          </button>
        ))}
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="rounded-[2rem] overflow-hidden bg-white dark:bg-neutral-800 shadow-sm h-72 animate-pulse">
    <div className="h-48 w-full bg-neutral-200 dark:bg-neutral-700" />
    <div className="p-5 space-y-3">
      <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
      <div className="h-3 w-1/2 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
    </div>
  </div>
);

const ShaderCard = ({ shader, onClick, index, isFav }) => {
  const normalized = normalizeShaderData(shader);
  return (
    <div onClick={onClick} style={{ animationDelay: `${index * 0.1}s` }} className="group relative bg-white dark:bg-neutral-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer active:scale-[0.98] animate-fade-in-up opacity-0">
      <div className="h-48 w-full overflow-hidden relative">
        <img src={normalized.thumbnail} alt={normalized.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-5">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{normalized.title}</h3>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-teal-500 text-white text-xs font-bold tracking-wider">{normalized.supportedVersion}</span>
                <div className="flex -space-x-1">{normalized.platforms.slice(0,3).map(p => <PlatformBadge key={p} type={p} />)}</div>
              </div>
            </div>
            {isFav && (
              <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
                <Heart size={16} fill="currentColor" />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-5 pt-4">
        <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2 text-sm leading-relaxed">{normalized.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">{normalized.tags.slice(0, 2).map(t => <span key={t} className="text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/30 px-2 py-1 rounded-lg">{t}</span>)}</div>
          <button className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center group-active:scale-90 transition-transform"><ChevronRight size={20} /></button>
        </div>
      </div>
    </div>
  );
};

const SideMenu = ({ isOpen, onClose, activeTab, onNavigate, darkMode, toggleDarkMode, userProfile, setUserProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userProfile.name);

  const handleSaveName = () => {
    setUserProfile({ ...userProfile, name: tempName });
    setIsEditing(false);
  };

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed inset-y-0 right-0 w-3/4 max-w-xs bg-white dark:bg-neutral-900 z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Menu</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 active:scale-90 transition-transform"><X size={24} /></button>
        </div>
        <div className="p-6 bg-teal-50 dark:bg-teal-900/10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-teal-200 dark:bg-teal-800 flex items-center justify-center text-teal-800 dark:text-teal-200 font-bold text-xl uppercase">{userProfile.name.charAt(0)}</div>
             <div className="flex-1">
               {isEditing ? (
                 <div className="flex items-center gap-2">
                   <input autoFocus type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} className="w-full bg-white dark:bg-neutral-800 rounded px-1 text-sm text-neutral-900 dark:text-white border border-teal-500 outline-none" />
                   <button onClick={handleSaveName} className="text-teal-600"><Save size={16} /></button>
                 </div>
               ) : (
                 <div className="flex items-center gap-2">
                   <p className="font-bold text-neutral-900 dark:text-white truncate max-w-[100px]">{userProfile.name}</p>
                   <button onClick={() => setIsEditing(true)} className="text-neutral-400 hover:text-teal-500"><Edit2 size={14} /></button>
                 </div>
               )}
               <p className="text-xs text-neutral-500">Sign in to sync favorites</p>
             </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-1">
            {['shaders', 'devs', 'guides', 'settings'].map(tab => (
              <button key={tab} onClick={() => onNavigate(tab)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 active:scale-95 ${activeTab === tab ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
                {tab === 'shaders' && <Layers size={20} />}{tab === 'devs' && <User size={20} />}{tab === 'guides' && <BookOpen size={20} />}{tab === 'settings' && <Settings size={20} />}
                <span className="font-medium capitalize">{tab}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
           <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Dark Mode</span>
              <button onClick={toggleDarkMode} className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-300 ${darkMode ? 'bg-teal-500' : 'bg-neutral-300'}`}><div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} /></button>
           </div>
           <button className="w-full flex items-center justify-center gap-2 p-3 text-red-500 font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all active:scale-95"><LogOut size={16} /> Sign Out</button>
        </div>
      </div>
    </>
  );
};

// ==========================================
// MAIN APP LOGIC
// ==========================================

export default function App() {
  const [data, setData] = useState({ shaders: DATABASE.shaders, developers: DATABASE.developers, versions: DATABASE.versions });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const [activeTab, setActiveTab] = useState('shaders');
  const [selectedShader, setSelectedShader] = useState(null);
  const [selectedDev, setSelectedDev] = useState(null);
  
  // PERSISTENCE: Load from LocalStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : { name: "Guest User" };
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState(null); 
  const [downloading, setDownloading] = useState(false);
  const [lightboxImages, setLightboxImages] = useState(null);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => { localStorage.setItem('favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('userProfile', JSON.stringify(userProfile)); }, [userProfile]);

  const fetchData = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData({
        shaders: result.shaders || [],
        developers: result.developers || [],
        versions: result.versions || []
      });
    } catch (err) {
      const result = DATABASE; // Fallback
      setData({
        shaders: result.shaders || [],
        developers: result.developers || [],
        versions: result.versions || []
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const containerRef = useRef(null);
  const [pullY, setPullY] = useState(0);
  
  const handleTouchStart = (e) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) setPullY(0);
  };

  const handleTouchMove = (e) => {
    if (containerRef.current && containerRef.current.scrollTop === 0 && e.touches[0].clientY > 50) {
       setPullY(Math.min((e.touches[0].clientY - 50) * 0.5, 80));
    }
  };

  const handleTouchEnd = () => {
    if (pullY > 60) fetchData(true);
    setPullY(0);
  };

  const handleNativeShare = async (shader) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: shader.title, text: `Check out ${shader.title}!`, url: shader.downloadLink });
        showToast("Shared successfully!", "success");
      } catch (error) { console.log('Error sharing', error); }
    } else {
      if(shader.downloadLink) {
        navigator.clipboard.writeText(shader.downloadLink);
        showToast("Link copied to clipboard!", "success");
      } else { showToast("No link to share!", "error"); }
    }
  };

  const handleDirectDownload = (url) => {
    setDownloading(true);
    showToast("Starting download...", "download");
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', ''); 
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => { setDownloading(false); }, 2000);
  };

  useEffect(() => { document.body.style.overflow = (isMenuOpen || selectedShader || selectedDev || lightboxImages) ? 'hidden' : 'unset'; }, [isMenuOpen, selectedShader, selectedDev, lightboxImages]);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const toggleFavorite = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  const handleSocial = (platform, url) => { if(url) window.open(url, '_blank'); showToast(`Opening ${platform}...`, "success"); };
  const handleClearCache = () => { showToast("Cache cleared", "success"); fetchData(); };
  const goToDevProfile = (dev) => { setSelectedDev(dev); setSelectedShader(null); };
  const goToShaderDetail = (shader) => { setSelectedShader(shader); };
  const goBackFromShader = () => setSelectedShader(null);
  const goBackFromDev = () => setSelectedDev(null);
  const handleMenuNavigate = (tab) => { setActiveTab(tab); setIsMenuOpen(false); };

  const filteredShaders = useMemo(() => {
    if (!data.shaders) return [];
    return data.shaders.filter(shader => {
      const norm = normalizeShaderData(shader);
      const matchesSearch = norm.title.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesTag = true;
      if (filterTag !== 'All') {
        if (/^\d/.test(filterTag)) {
           matchesTag = norm.supportedVersion.includes(filterTag);
        } else {
           matchesTag = norm.tags && norm.tags.includes(filterTag);
        }
      }
      return matchesSearch && matchesTag;
    });
  }, [data.shaders, searchQuery, filterTag]);

  // --- RENDER VIEWS ---

  const renderDetailView = () => {
    const dev = data.developers.find(d => d.id === selectedShader.creator) || { name: 'Unknown', icon: '', role: 'Developer' };
    const isFav = favorites.includes(selectedShader.id);
    const normalized = normalizeShaderData(selectedShader);

    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-neutral-900 overflow-y-auto animate-fade-in-up">
        <div className="fixed top-4 left-4 z-30">
          <button onClick={goBackFromShader} className="p-3 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-colors active:scale-90"><ArrowLeft size={24} /></button>
        </div>
        <div className="fixed top-4 right-4 z-30 flex gap-2">
           <button onClick={() => toggleFavorite(selectedShader.id)} className={`p-3 rounded-full backdrop-blur-md transition-colors active:scale-90 ${isFav ? 'bg-red-500/80 text-white' : 'bg-black/30 text-white hover:bg-black/50'}`}><Heart size={24} fill={isFav ? "currentColor" : "none"} /></button>
           <button onClick={() => handleNativeShare(normalized)} className="p-3 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-colors active:scale-90"><Share2 size={24} /></button>
        </div>
        
        <div className="h-[45vh] w-full relative">
          <img 
            src={normalized.thumbnail} 
            className="w-full h-full object-cover" 
            alt="Detail" 
            onClick={() => setLightboxImages(normalized.screenshots)}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><Maximize2 className="text-white/50 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-neutral-900 pointer-events-none" />
        </div>

        <div className="-mt-16 relative px-6 pb-10">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2 animate-fade-in-up" style={{animationDelay: '0.1s'}}>{normalized.title}</h1>
          <div className="flex items-center gap-3 mb-6 text-neutral-500 dark:text-neutral-400 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <span className="bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold px-2 py-1 rounded-md">{normalized.supportedVersion}</span>
          </div>

          <div className="mb-8 space-y-3 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <button onClick={() => handleDirectDownload(normalized.downloadLink)} disabled={downloading} className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-teal-500/20 transition-transform active:scale-95 ${downloading ? 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 cursor-wait' : 'bg-teal-300 dark:bg-teal-700 text-teal-900 dark:text-teal-100 hover:brightness-105'}`}>
              <Download size={24} /> {downloading ? 'Downloading...' : 'Download .mcpack'}
            </button>
            {normalized.otherLinks.map((link, i) => (
               <button key={i} onClick={() => handleSocial(link.title, link.link)} className="w-full py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors active:scale-95">
                <ExternalLink size={16} /> {link.title}
              </button>
            ))}
            <div className="flex gap-2 pt-1 overflow-x-auto">{normalized.platforms.map(p => <PlatformBadge key={p} type={p} />)}</div>
          </div>

          <div className="mb-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">About</h3>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{normalized.description}</p>
          </div>

          {normalized.screenshots && normalized.screenshots.length > 0 && (
            <div className="mb-8 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Gallery</h3>
              <div className="flex gap-4 overflow-x-auto -mx-6 px-6 pb-4 snap-x">
                {normalized.screenshots.map((src, idx) => (
                  <img 
                    key={idx} 
                    src={src} 
                    onClick={() => setLightboxImages(normalized.screenshots)}
                    className="h-48 w-72 flex-shrink-0 object-cover rounded-2xl snap-center alt='Screenshot' active:opacity-80 transition-opacity" 
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mb-24 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Developer</h3>
            <div onClick={() => goToDevProfile(dev)} className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 cursor-pointer active:bg-neutral-200 dark:active:bg-neutral-700 transition-colors active:scale-98">
              <img src={dev.icon} alt={dev.name} className="w-14 h-14 rounded-full bg-white" />
              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white">{dev.name}</h4>
                <p className="text-xs text-neutral-500 uppercase tracking-wide font-semibold">{dev.role || "Developer"}</p>
              </div>
              <button className="ml-auto p-2 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"><ChevronRight size={20} /></button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDevsList = () => (
    <div key="devs" className="px-4 pt-6 pb-24 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6 px-2">Developers</h2>
      <div className="space-y-4">
        {data.developers.map((dev, idx) => (
          <div key={dev.id} onClick={() => goToDevProfile(dev)} style={{ animationDelay: `${idx * 0.1}s` }} className="bg-white dark:bg-neutral-800 rounded-3xl p-6 shadow-sm cursor-pointer active:scale-[0.98] transition-transform animate-fade-in-up opacity-0">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img src={dev.icon} alt={dev.name} className="w-24 h-24 rounded-full mb-4 bg-teal-50 dark:bg-teal-900/30 shadow-md" />
                {dev.verified && <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white p-1.5 rounded-full border-4 border-white dark:border-neutral-800"><Check size={14} strokeWidth={4} /></div>}
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{dev.name}</h3>
              <p className="text-teal-600 dark:text-teal-400 font-medium text-sm mb-2">{dev.role || "Developer"}</p>
              <button className="w-full py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-bold text-sm group-hover:bg-teal-100 dark:group-hover:bg-teal-900/50 transition-colors active:scale-95">View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGuides = () => (
    <div key="guides" className="px-4 pt-6 pb-24 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6 px-2">Guides & Tools</h2>
      <div className="space-y-6">
        
        {/* Critical Warning */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3xl p-6 flex gap-4 items-start">
          <AlertTriangle className="text-red-500 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-red-700 dark:text-red-400 mb-1">Patch Warning</h3>
            <p className="text-sm text-red-600 dark:text-red-300 leading-relaxed">
              Official patching by YSS has stopped since Minecraft 1.21.60. Usage of any patchers is now at your own risk.
            </p>
          </div>
        </div>

        {/* MB Loader Tool */}
        <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <img src="https://play-lh.googleusercontent.com/MFWpr8QhdY3DUKVc8bGFCj7yrw4q3s5CY5Cj676HuowOfKmNJosBFW--208oR-dfqNk=w240-h480-rw" className="w-12 h-12 rounded-2xl" alt="MB Loader Icon" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/48?text=MB' }} />
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-white">MB Loader</h3>
              <p className="text-xs text-neutral-500">By Bambosan</p>
            </div>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6 leading-relaxed">
            An essential tool for loading custom shaders on Minecraft Bedrock (RenderDragon). Allows you to import material files directly.
          </p>
          <button 
            onClick={() => window.open('https://play.google.com/store/apps/details?id=io.bambosan.mbloader&pcampaignid=web_share', '_blank')}
            className="w-full py-3 rounded-2xl bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-indigo-600"
          >
            <Play size={16} fill="currentColor" /> Get on Play Store
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white px-2">How to Install</h3>
          {/* Step 1 */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 flex items-center justify-center font-bold flex-shrink-0">1</div>
            <div>
              <h4 className="font-bold text-neutral-900 dark:text-white text-sm mb-1">Download Shader</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">Find a shader in this app and click download. It will save an <code>.mcpack</code> file.</p>
            </div>
          </div>
          {/* Step 2 */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 flex items-center justify-center font-bold flex-shrink-0">2</div>
            <div>
              <h4 className="font-bold text-neutral-900 dark:text-white text-sm mb-1">Import to MB Loader</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">Open MB Loader, select "Import", and choose the downloaded <code>.mcpack</code> file.</p>
            </div>
          </div>
          {/* Step 3 */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 flex items-center justify-center font-bold flex-shrink-0">3</div>
            <div>
              <h4 className="font-bold text-neutral-900 dark:text-white text-sm mb-1">Apply & Play</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">Once imported, apply the shader pack within MB Loader settings and launch Minecraft.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  const renderSettings = () => (
    <div key="settings" className="px-4 pt-6 pb-24 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6 px-2">Settings</h2>
      <div className="space-y-6">
        
        <section>
          <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-3 px-2">Appearance</h3>
          <div className="bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">{darkMode ? <Moon size={20} /> : <Sun size={20} />}</div>
                <span className="font-medium text-neutral-900 dark:text-white">Dark Mode</span>
              </div>
              <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-teal-500' : 'bg-neutral-300'}`}><div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} /></button>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-3 px-2">Community</h3>
          <div className="bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-sm">
             <button onClick={() => handleSocial('Discord', 'https://discord.gg/t8Y9aB4YQj')} className="w-full p-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
               <div className="flex items-center gap-3">
                 <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"><Disc size={20} /></div>
                 <span className="font-medium text-neutral-900 dark:text-white">Newb Discord</span>
               </div>
               <ChevronRight size={18} className="text-neutral-400" />
             </button>
             <button onClick={() => handleSocial('Website', 'https://devendrn.github.io/newb-shader/')} className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
               <div className="flex items-center gap-3">
                 <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><Globe size={20} /></div>
                 <span className="font-medium text-neutral-900 dark:text-white">Official Website</span>
               </div>
               <ChevronRight size={18} className="text-neutral-400" />
             </button>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-3 px-2">About</h3>
          <div className="bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-sm">
             <div className="p-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700">
              <span className="font-medium text-neutral-900 dark:text-white">Version</span>
              <span className="text-neutral-500">3.5.0</span>
            </div>
             <button onClick={handleClearCache} className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors active:bg-neutral-100 dark:active:bg-neutral-700">
              <div className="flex items-center gap-2 text-red-500"><Trash2 size={18} /><span className="font-medium">Clear Cache</span></div>
              <span className="text-neutral-500 text-sm">12 MB</span>
            </button>
          </div>
        </section>

        <div className="flex justify-center pb-4">
          <p className="text-xs font-medium text-neutral-400 dark:text-neutral-600 flex items-center gap-1">
            Made with <Heart size={10} className="text-red-500 fill-current" /> by PixelBoy
          </p>
        </div>

      </div>
    </div>
  );

  const renderDevProfile = () => {
    if (!selectedDev) return null;
    const devShaders = data.shaders.filter(s => s.creator === selectedDev.id);
    return (
      <div className="fixed inset-0 z-40 bg-neutral-50 dark:bg-neutral-900 overflow-y-auto animate-slide-in-right">
        <div className="h-48 bg-gradient-to-br from-teal-400 to-blue-500 relative">
           <button onClick={goBackFromDev} className="absolute top-4 left-4 p-3 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors active:scale-90"><ArrowLeft size={24} /></button>
        </div>
        <div className="px-6 relative -mt-16 pb-24 animate-fade-in-up">
          <div className="flex justify-between items-end mb-4">
            <div className="relative">
               <img src={selectedDev.icon} alt={selectedDev.name} className="w-32 h-32 rounded-full border-4 border-neutral-50 dark:border-neutral-900 bg-white dark:bg-neutral-800 shadow-lg object-cover" />
               {selectedDev.verified && <div className="absolute bottom-1 right-1 bg-teal-500 text-white p-1.5 rounded-full border-4 border-neutral-50 dark:border-neutral-900"><Check size={16} strokeWidth={4} /></div>}
            </div>
            <div className="flex gap-2 mb-2">
              {selectedDev.socials?.map((social, idx) => (
                <button key={idx} onClick={() => handleSocial(social.title, social.link)} className="p-2.5 rounded-xl bg-white dark:bg-neutral-800 shadow-sm text-neutral-600 dark:text-neutral-400 hover:text-teal-500 transition-colors active:scale-95" title={social.title}>{getSocialIcon(social.title)}</button>
              ))}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">{selectedDev.name}</h1>
          <p className="text-teal-600 dark:text-teal-400 font-medium mb-4">{selectedDev.role || "Developer"}</p>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">{selectedDev.bio || "No bio available."}</p>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Projects</h2>
          <div className="space-y-4">
            {devShaders.length > 0 ? devShaders.map((shader, index) => ( <ShaderCard key={shader.id} shader={shader} index={index} onClick={() => goToShaderDetail(shader)} isFav={favorites.includes(shader.id)} /> )) : <div className="text-center py-8 text-neutral-500">No public projects yet.</div>}
          </div>
        </div>
      </div>
    );
  };

  // --- Main Render ---
  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} activeTab={activeTab} onNavigate={handleMenuNavigate} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} userProfile={userProfile} setUserProfile={setUserProfile} />
      
      {lightboxImages && <Lightbox images={lightboxImages} initialIndex={0} onClose={() => setLightboxImages(null)} />}

      {selectedShader ? renderDetailView() : selectedDev ? renderDevProfile() : (
        <>
          <header className="px-6 pt-12 pb-2 flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">{activeTab === 'shaders' && 'Newb Hub'}{activeTab === 'devs' && 'Developers'}{activeTab === 'guides' && 'Guides'}{activeTab === 'settings' && 'Settings'}</h1>
               <p className="text-neutral-500 text-sm font-medium">{activeTab === 'shaders' ? 'Explore shaders' : activeTab === 'devs' ? 'Meet the creators' : activeTab === 'guides' ? 'Tutorials & Tools' : 'App preferences'}</p>
            </div>
            <button onClick={() => setIsMenuOpen(true)} className="p-2 rounded-full bg-white dark:bg-neutral-800 shadow-sm text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors active:scale-90"><Menu size={24} /></button>
          </header>

          <main 
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full max-w-md mx-auto md:max-w-full pb-32 px-4 min-h-[80vh]"
          >
            {/* Pull to Refresh Spinner */}
            <div className={`ptr-spinner ${refreshing || pullY > 0 ? 'visible' : ''}`} style={{ transform: `translateY(${pullY}px)` }}>
               <div className="p-2 bg-white dark:bg-neutral-800 rounded-full shadow-md text-teal-500">
                 <RefreshCw size={20} className={refreshing ? 'animate-spin-slow' : ''} style={{ transform: `rotate(${pullY * 3}deg)` }} />
               </div>
            </div>

            {/* Main Views */}
            {loading && !refreshing && <div className="space-y-4 mt-4"><SkeletonCard /><SkeletonCard /></div>}
            {error && !loading && <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up"><WifiOff size={48} className="text-neutral-400 mb-4" /><p className="text-neutral-500 mb-4">{error}</p><button onClick={() => fetchData()} className="flex items-center gap-2 px-6 py-2 bg-teal-500 text-white rounded-full font-bold active:scale-95 transition-transform"><RefreshCw size={18} /> Retry</button></div>}
            {!loading && !error && activeTab === 'shaders' && (
              <div key="shaders" className="pb-24 space-y-6 animate-fade-in-up">
                <div className="sticky top-0 z-20 pt-4 pb-2 bg-neutral-50/95 dark:bg-neutral-900/95 backdrop-blur-sm px-4 space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-500"><Search size={20} /></div>
                    <input type="text" placeholder="Search shaders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full py-3.5 pl-12 pr-4 rounded-full bg-neutral-200/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all" />
                  </div>
                  {/* Updated Filter Bar with Version Logic */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                    <Chip label="All" active={filterTag === 'All'} onClick={() => setFilterTag('All')} />
                    {TAG_OPTIONS.map(tag => <Chip key={tag} label={tag} active={filterTag === tag} onClick={() => setFilterTag(tag)} />)}
                    {/* Dynamic Version Filters */}
                    {data.versions?.map((ver) => (
                      <Chip key={ver.base} label={ver.base} active={filterTag === ver.base} onClick={() => setFilterTag(ver.base)} />
                    ))}
                  </div>
                </div>
                <div className="px-4 space-y-4 min-h-[50vh]">
                  {filteredShaders.map((shader, index) => (
                    <ShaderCard key={shader.id || index} shader={shader} index={index} onClick={() => goToShaderDetail(shader)} isFav={favorites.includes(shader.id)} />
                  ))}
                  {filteredShaders.length === 0 && <div className="text-center py-10 text-neutral-500">No shaders found.</div>}
                </div>
              </div>
            )}
            {!loading && !error && activeTab === 'devs' && renderDevsList()}
            {!loading && !error && activeTab === 'guides' && renderGuides()}
            {!loading && !error && activeTab === 'settings' && renderSettings()}
          </main>

          <nav className="fixed bottom-0 left-0 right-0 bg-neutral-50/90 dark:bg-neutral-900/90 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-800 pb-safe pt-2 px-6 z-30">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto">
              {['shaders', 'devs', 'guides', 'settings'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex flex-col items-center gap-1 w-16 transition-all duration-300 active:scale-90 ${activeTab === tab ? 'text-teal-600 dark:text-teal-300' : 'text-neutral-400 dark:text-neutral-500'}`}>
                  <div className={`px-5 py-1 rounded-full transition-all duration-300 ${activeTab === tab ? 'bg-teal-100 dark:bg-teal-900/50' : 'bg-transparent'}`}>
                    {tab === 'shaders' && <Layers size={24} />}
                    {tab === 'devs' && <User size={24} />}
                    {tab === 'guides' && <BookOpen size={24} />}
                    {tab === 'settings' && <Settings size={24} />}
                  </div>
                  <span className="text-[10px] font-bold capitalize">{tab}</span>
                </button>
              ))}
            </div>
          </nav>
        </>
      )}
    </div>
  );
}