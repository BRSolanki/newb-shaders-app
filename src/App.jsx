import React, { useState, useEffect, useMemo } from 'react';
import { 
  Menu, Search, Settings, User, Layers, 
  ArrowLeft, Download, Share2, Heart, 
  Monitor, Smartphone, Gamepad2, 
  ChevronRight, Github, Globe, Twitter,
  Moon, Sun, Check, ExternalLink, X,
  Trash2, LogOut, HelpCircle, Mail,
  Youtube, Disc, Coffee, Link as LinkIcon,
  RefreshCw, WifiOff
} from 'lucide-react';

// ==========================================
// CONFIGURATION
// ==========================================

// REPLACE THIS WITH YOUR ACTUAL RENDER URL
// Make sure your backend endpoint returns { shaders: [], developers: [] }
const API_URL = "https://newb-shader-backend.onrender.com/api/sync"; 

// ==========================================
// STYLES & ANIMATIONS
// ==========================================
const styleTag = document.createElement('style');
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
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  .dark .skeleton {
    background: linear-gradient(90deg, #262626 25%, #333333 50%, #262626 75%);
  }
  .scrollbar-hide::-webkit-scrollbar {
      display: none;
  }
  .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
  }
`;
document.head.appendChild(styleTag);

// ==========================================
// HELPERS
// ==========================================

const PLATFORM_MAP = {
  'ANDROID': { label: 'Android', icon: <Smartphone size={14} /> },
  'IOS':     { label: 'iOS', icon: <Smartphone size={14} /> },
  'WINDOWS': { label: 'Windows', icon: <Monitor size={14} /> },
  'XBOX':    { label: 'Xbox/PS', icon: <Gamepad2 size={14} /> },
  'android': { label: 'Android', icon: <Smartphone size={14} /> },
  'ios':     { label: 'iOS', icon: <Smartphone size={14} /> },
  'win':     { label: 'Windows', icon: <Monitor size={14} /> },
  'console': { label: 'Xbox/PS', icon: <Gamepad2 size={14} /> },
};

const getSocialIcon = (title) => {
  const lowerTitle = title?.toLowerCase() || "";
  if (lowerTitle.includes('github')) return <Github size={20} />;
  if (lowerTitle.includes('discord')) return <Disc size={20} />;
  if (lowerTitle.includes('youtube')) return <Youtube size={20} />;
  if (lowerTitle.includes('twitter')) return <Twitter size={20} />;
  if (lowerTitle.includes('donate') || lowerTitle.includes('ko-fi')) return <Coffee size={20} />;
  if (lowerTitle.includes('website')) return <Globe size={20} />;
  return <LinkIcon size={20} />;
};

// Robust normalizer for potentially incomplete API data
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
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap active:scale-95
      ${active 
        ? 'bg-teal-200 text-teal-900 dark:bg-teal-700 dark:text-teal-100 shadow-sm' 
        : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700'}
    `}
  >
    {label}
  </button>
);

const PlatformBadge = ({ type }) => {
  const config = PLATFORM_MAP[type?.toUpperCase()] || PLATFORM_MAP['ANDROID']; 
  return (
    <div title={config.label} className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
      {config.icon}
    </div>
  );
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-3 px-4 py-3 rounded-2xl bg-neutral-900/90 dark:bg-white/90 text-white dark:text-neutral-900 shadow-xl backdrop-blur-md min-w-[200px] max-w-[90vw] animate-fade-in-up">
      {type === 'success' && <Check size={18} className="text-green-500" />}
      {type === 'download' && <Download size={18} className="text-blue-400" />}
      {type === 'heart' && <Heart size={18} className="text-red-500 fill-current" />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

// Skeleton Loader
const SkeletonCard = () => (
  <div className="rounded-[2rem] overflow-hidden bg-white dark:bg-neutral-800 shadow-sm h-72 animate-pulse">
    <div className="h-48 w-full skeleton" />
    <div className="p-5 space-y-3">
      <div className="h-4 w-3/4 skeleton rounded-md" />
      <div className="h-3 w-1/2 skeleton rounded-md" />
    </div>
  </div>
);

const ShaderCard = ({ shader, onClick, isFav, index }) => {
  const normalized = normalizeShaderData(shader);
  
  return (
    <div 
      onClick={onClick}
      style={{ animationDelay: `${index * 0.1}s` }}
      className="group relative bg-white dark:bg-neutral-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer active:scale-[0.98] animate-fade-in-up opacity-0"
    >
      <div className="h-48 w-full overflow-hidden relative">
        <img src={normalized.thumbnail} alt={normalized.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-5">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{normalized.title}</h3>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-teal-500 text-white text-xs font-bold tracking-wider">{normalized.supportedVersion}</span>
                <div className="flex -space-x-1">
                  {normalized.platforms.slice(0,3).map(p => <PlatformBadge key={p} type={p} />)}
                </div>
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
        <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2 text-sm leading-relaxed">
          {normalized.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            {normalized.tags.slice(0, 2).map(t => (
              <span key={t} className="text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/30 px-2 py-1 rounded-lg">{t}</span>
            ))}
          </div>
          <button className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center group-active:scale-90 transition-transform">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const SideMenu = ({ isOpen, onClose, activeTab, onNavigate, darkMode, toggleDarkMode }) => {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose} 
      />
      <div 
        className={`fixed inset-y-0 right-0 w-3/4 max-w-xs bg-white dark:bg-neutral-900 z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Menu</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 active:scale-90 transition-transform">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 bg-teal-50 dark:bg-teal-900/10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-teal-200 dark:bg-teal-800 flex items-center justify-center text-teal-800 dark:text-teal-200 font-bold text-xl">G</div>
             <div>
               <p className="font-bold text-neutral-900 dark:text-white">Guest User</p>
               <p className="text-xs text-neutral-500">Sign in to sync favorites</p>
             </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-1">
            {['shaders', 'devs', 'settings'].map(tab => (
              <button 
                key={tab}
                onClick={() => onNavigate(tab)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 active:scale-95 ${activeTab === tab ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
              >
                {tab === 'shaders' && <Layers size={20} />}
                {tab === 'devs' && <User size={20} />}
                {tab === 'settings' && <Settings size={20} />}
                <span className="font-medium capitalize">{tab}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
           <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Dark Mode</span>
              <button onClick={toggleDarkMode} className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-300 ${darkMode ? 'bg-teal-500' : 'bg-neutral-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
           </div>
           <button className="w-full flex items-center justify-center gap-2 p-3 text-red-500 font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all active:scale-95">
             <LogOut size={16} /> Sign Out
           </button>
        </div>
      </div>
    </>
  );
};

// ==========================================
// MAIN APP LOGIC
// ==========================================

export default function App() {
  // State for Data
  const [data, setData] = useState({ shaders: [], developers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI State
  const [activeTab, setActiveTab] = useState('shaders');
  const [selectedShader, setSelectedShader] = useState(null);
  const [selectedDev, setSelectedDev] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState([]); 
  const [toast, setToast] = useState(null); 
  const [downloading, setDownloading] = useState(false);

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching data from:", API_URL);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Data loaded:", result);
      
      // Ensure data structure is valid
      setData({
        shaders: result.shaders || [],
        developers: result.developers || []
      });
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load content. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // Scroll Lock
  useEffect(() => {
    document.body.style.overflow = (isMenuOpen || selectedShader || selectedDev) ? 'hidden' : 'unset';
  }, [isMenuOpen, selectedShader, selectedDev]);

  // Helpers
  const showToast = (message, type = 'success') => setToast({ message, type });

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(favId => favId !== id));
      showToast("Removed from favorites", "success");
    } else {
      setFavorites(prev => [...prev, id]);
      showToast("Added to favorites", "heart");
    }
  };

  const handleDownload = (fileName, url) => {
    setDownloading(true);
    showToast(`Opening ${fileName}...`, "download");
    
    // In a real app, use: window.location.href = url;
    // Simulating delay for UX
    setTimeout(() => {
      setDownloading(false);
      showToast("Download Started!", "success");
    }, 1500);
  };

  const handleSocial = (platform, url) => {
     showToast(`Opening ${platform}...`, "success");
     // window.open(url, '_blank');
  };

  const handleClearCache = () => {
    showToast("Cache cleared successfully", "success");
    fetchData(); // Reload data on clear cache
  };

  const goToDevProfile = (dev) => {
    setSelectedDev(dev);
    setSelectedShader(null);
  };

  const goToShaderDetail = (shader) => {
    setSelectedShader(shader);
  };

  const goBackFromShader = () => setSelectedShader(null);
  const goBackFromDev = () => setSelectedDev(null);
  
  const handleMenuNavigate = (tab) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  // Filter Logic
  const filteredShaders = useMemo(() => {
    if (!data.shaders) return [];
    return data.shaders.filter(shader => {
      const norm = normalizeShaderData(shader);
      const matchesSearch = norm.title.toLowerCase().includes(searchQuery.toLowerCase());
      // Use tag filtering only if tags exist
      const matchesTag = filterTag === 'All' || (norm.tags && norm.tags.includes(filterTag));
      return matchesSearch && matchesTag;
    });
  }, [data.shaders, searchQuery, filterTag]);

  // --- RENDER VIEWS ---

  const renderShaderList = () => (
    <div key="shaders" className="pb-24 space-y-6 animate-fade-in-up">
      {/* Filter Bar */}
      <div className="sticky top-0 z-20 pt-4 pb-2 bg-neutral-50/95 dark:bg-neutral-900/95 backdrop-blur-sm px-4 space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-500"><Search size={20} /></div>
          <input 
            type="text"
            placeholder="Search shaders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3.5 pl-12 pr-4 rounded-full bg-neutral-200/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          <Chip label="All" active={filterTag === 'All'} onClick={() => setFilterTag('All')} />
          {TAG_OPTIONS.map(tag => <Chip key={tag} label={tag} active={filterTag === tag} onClick={() => setFilterTag(tag)} />)}
        </div>
      </div>

      {/* List */}
      <div className="px-4 space-y-4 min-h-[50vh]">
        {filteredShaders.map((shader, index) => (
          <ShaderCard key={shader.id || index} shader={shader} index={index} onClick={() => goToShaderDetail(shader)} isFav={favorites.includes(shader.id)} />
        ))}
        {filteredShaders.length === 0 && (
          <div className="text-center py-10 text-neutral-500">No shaders found matching your search.</div>
        )}
      </div>
    </div>
  );

  const renderDevProfile = () => {
    if (!selectedDev) return null;
    const devShaders = data.shaders.filter(s => s.creator === selectedDev.id);
    
    return (
      <div className="fixed inset-0 z-40 bg-neutral-50 dark:bg-neutral-900 overflow-y-auto animate-slide-in-right">
        <div className="h-48 bg-gradient-to-br from-teal-400 to-blue-500 relative">
           <button 
            onClick={goBackFromDev}
            className="absolute top-4 left-4 p-3 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors active:scale-90"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        <div className="px-6 relative -mt-16 pb-24 animate-fade-in-up">
          <div className="flex justify-between items-end mb-4">
            <div className="relative">
               <img src={selectedDev.icon} alt={selectedDev.name} className="w-32 h-32 rounded-full border-4 border-neutral-50 dark:border-neutral-900 bg-white dark:bg-neutral-800 shadow-lg object-cover" />
               {selectedDev.verified && <div className="absolute bottom-1 right-1 bg-teal-500 text-white p-1.5 rounded-full border-4 border-neutral-50 dark:border-neutral-900"><Check size={16} strokeWidth={4} /></div>}
            </div>
            <div className="flex gap-2 mb-2">
              {selectedDev.socials?.map((social, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSocial(social.title, social.link)} 
                  className="p-2.5 rounded-xl bg-white dark:bg-neutral-800 shadow-sm text-neutral-600 dark:text-neutral-400 hover:text-teal-500 transition-colors active:scale-95"
                  title={social.title}
                >
                  {getSocialIcon(social.title)}
                </button>
              ))}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            {selectedDev.name}
          </h1>
          <p className="text-teal-600 dark:text-teal-400 font-medium mb-4">{selectedDev.role || "Developer"}</p>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">{selectedDev.bio || "No bio available."}</p>

          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Projects</h2>
          <div className="space-y-4">
            {devShaders.length > 0 ? (
              devShaders.map((shader, index) => (
                <ShaderCard key={shader.id} shader={shader} index={index} onClick={() => goToShaderDetail(shader)} isFav={favorites.includes(shader.id)} />
              ))
            ) : (
              <div className="text-center py-8 text-neutral-500">No public projects yet.</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDetailView = () => {
    const dev = data.developers.find(d => d.id === selectedShader.creator) || { name: 'Unknown', icon: '', role: 'Developer' };
    const isFav = favorites.includes(selectedShader.id);
    const normalized = normalizeShaderData(selectedShader);

    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-neutral-900 overflow-y-auto animate-fade-in-up">
        <div className="fixed top-4 left-4 z-30">
          <button onClick={goBackFromShader} className="p-3 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-colors active:scale-90">
            <ArrowLeft size={24} />
          </button>
        </div>
        <div className="fixed top-4 right-4 z-30 flex gap-2">
           <button onClick={() => toggleFavorite(selectedShader.id)} className={`p-3 rounded-full backdrop-blur-md transition-colors active:scale-90 ${isFav ? 'bg-red-500/80 text-white' : 'bg-black/30 text-white hover:bg-black/50'}`}>
            <Heart size={24} fill={isFav ? "currentColor" : "none"} />
          </button>
           <button onClick={() => showToast("Link copied!", "success")} className="p-3 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-colors active:scale-90"><Share2 size={24} /></button>
        </div>

        <div className="h-[45vh] w-full relative">
          <img src={normalized.thumbnail} className="w-full h-full object-cover" alt="Detail" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-neutral-900" />
        </div>

        <div className="-mt-16 relative px-6 pb-10">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2 animate-fade-in-up" style={{animationDelay: '0.1s'}}>{normalized.title}</h1>
          <div className="flex items-center gap-3 mb-6 text-neutral-500 dark:text-neutral-400 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <span className="bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold px-2 py-1 rounded-md">{normalized.supportedVersion}</span>
            {/* <span>•</span> */}
            {/* <span className="text-sm">Updated {normalized.updated_at || "Recently"}</span> */}
          </div>

          <div className="mb-8 space-y-3 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <button 
              onClick={() => handleDownload(`${normalized.title}.mcpack`, normalized.downloadLink)} 
              disabled={downloading} 
              className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-teal-500/20 transition-transform active:scale-95 ${downloading ? 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 cursor-wait' : 'bg-teal-300 dark:bg-teal-700 text-teal-900 dark:text-teal-100 hover:brightness-105'}`}
            >
              <Download size={24} />
              {downloading ? 'Downloading...' : 'Download .mcpack'}
            </button>
            
            {normalized.otherLinks && normalized.otherLinks.map((link, i) => (
               <button 
                key={i}
                onClick={() => handleSocial(link.title, link.link)} 
                className="w-full py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors active:scale-95"
               >
                <ExternalLink size={16} /> {link.title}
              </button>
            ))}

            <div className="flex gap-2 pt-1 overflow-x-auto">
              {normalized.platforms.map(p => <PlatformBadge key={p} type={p} />)}
            </div>
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
                  <img key={idx} src={src} className="h-48 w-72 flex-shrink-0 object-cover rounded-2xl snap-center" alt="Screenshot" />
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
          <div 
            key={dev.id} 
            onClick={() => goToDevProfile(dev)} 
            style={{ animationDelay: `${idx * 0.1}s` }}
            className="bg-white dark:bg-neutral-800 rounded-3xl p-6 shadow-sm cursor-pointer active:scale-[0.98] transition-transform animate-fade-in-up opacity-0"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img src={dev.icon} alt={dev.name} className="w-24 h-24 rounded-full mb-4 bg-teal-50 dark:bg-teal-900/30 shadow-md object-cover" />
                {dev.verified && <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white p-1.5 rounded-full border-4 border-white dark:border-neutral-800"><Check size={14} strokeWidth={4} /></div>}
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{dev.name}</h3>
              <p className="text-teal-600 dark:text-teal-400 font-medium text-sm mb-2">{dev.role || "Developer"}</p>
              <p className="text-neutral-500 text-xs mb-4 flex items-center gap-1"><Globe size={12}/> {dev.location || "Earth"}</p>
              <button className="w-full py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-bold text-sm group-hover:bg-teal-100 dark:group-hover:bg-teal-900/50 transition-colors active:scale-95">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div key="settings" className="px-4 pt-6 pb-24 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6 px-2">Settings</h2>
      <div className="space-y-6">
        <section className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-3 px-2">Appearance</h3>
          <div className="bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">{darkMode ? <Moon size={20} /> : <Sun size={20} />}</div>
                <span className="font-medium text-neutral-900 dark:text-white">Dark Mode</span>
              </div>
              <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-teal-500' : 'bg-neutral-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </section>
        <section className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-3 px-2">About</h3>
          <div className="bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-sm">
             <div className="p-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700">
              <span className="font-medium text-neutral-900 dark:text-white">Version</span>
              <span className="text-neutral-500">3.0.0 (Online)</span>
            </div>
             <button onClick={handleClearCache} className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors active:bg-neutral-100 dark:active:bg-neutral-700">
              <div className="flex items-center gap-2 text-red-500"><Trash2 size={18} /><span className="font-medium">Clear Cache</span></div>
              <span className="text-neutral-500 text-sm">12 MB</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <SideMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        activeTab={activeTab}
        onNavigate={handleMenuNavigate}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {selectedShader ? (
        renderDetailView()
      ) : selectedDev ? (
        renderDevProfile()
      ) : (
        <>
          <header className="px-6 pt-12 pb-2 flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                {activeTab === 'shaders' && 'Newb Hub'}
                {activeTab === 'devs' && 'Developers'}
                {activeTab === 'settings' && 'Settings'}
              </h1>
              <p className="text-neutral-500 text-sm font-medium">
                 {activeTab === 'shaders' ? 'Explore shaders' : activeTab === 'devs' ? 'Meet the creators' : 'App preferences'}
              </p>
            </div>
            <button onClick={() => setIsMenuOpen(true)} className="p-2 rounded-full bg-white dark:bg-neutral-800 shadow-sm text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors active:scale-90">
              <Menu size={24} />
            </button>
          </header>

          {/* Main Content Area */}
          <main className="w-full max-w-md mx-auto md:max-w-full pb-32 px-4">
            
            {/* Loading State */}
            {loading && (
              <div className="space-y-4 mt-4">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
                <WifiOff size={48} className="text-neutral-400 mb-4" />
                <p className="text-neutral-500 mb-4">{error}</p>
                <button onClick={fetchData} className="flex items-center gap-2 px-6 py-2 bg-teal-500 text-white rounded-full font-bold active:scale-95 transition-transform">
                  <RefreshCw size={18} /> Retry
                </button>
              </div>
            )}

            {/* Success Views */}
            {!loading && !error && activeTab === 'shaders' && renderShaderList()}
            {!loading && !error && activeTab === 'devs' && renderDevsList()}
            {!loading && !error && activeTab === 'settings' && renderSettings()}
          </main>

          {/* Bottom Nav */}
          <nav className="fixed bottom-0 left-0 right-0 bg-neutral-50/90 dark:bg-neutral-900/90 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-800 pb-safe pt-2 px-6 z-30">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto">
              {['shaders', 'devs', 'settings'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex flex-col items-center gap-1 w-16 transition-all duration-300 active:scale-90 ${activeTab === tab ? 'text-teal-600 dark:text-teal-300' : 'text-neutral-400 dark:text-neutral-500'}`}
                >
                  <div className={`px-5 py-1 rounded-full transition-all duration-300 ${activeTab === tab ? 'bg-teal-100 dark:bg-teal-900/50' : 'bg-transparent'}`}>
                    {tab === 'shaders' && <Layers size={24} />}
                    {tab === 'devs' && <User size={24} />}
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