import React, { useState, useEffect, useRef } from 'react';
import { Menu, Layers, User, BookOpen, Settings, RefreshCw, WifiOff } from 'lucide-react';
import { THEMES, DATABASE } from './utils/constants';
import { Toast, Lightbox } from './components/Overlays';
import { SkeletonCard } from './components/Shared';
import SideMenu from './components/SideMenu';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import ShaderList from './views/ShaderList';
import DevsList from './views/DevsList';
import GuidesView from './views/GuidesView';
import SettingsView from './views/SettingsView';
import DetailView from './views/DetailView';
import DevProfile from './views/DevProfile';
import { useScrollDirection } from './hooks/useScrollDirection';

// Configuration
const API_URL = "https://newb-shader-backend.onrender.com/api/sync"; 

export default function App() {
  const scrollDirection = useScrollDirection();
  // Hide bars on scroll logic
const [isNavHidden, setIsNavHidden] = useState(false);
const lastScrollY = useRef(0);

const handleContainerScroll = (e) => {
  const currentScrollY = e.target.scrollTop;

  // Always show at the very top
  if (currentScrollY < 30) {
    setIsNavHidden(false);
    lastScrollY.current = currentScrollY;
    return;
  }

  // Scroll down -> hide, Scroll up -> show
  if (currentScrollY > lastScrollY.current + 10) {
    setIsNavHidden(true);
  } else if (currentScrollY < lastScrollY.current - 10) {
    setIsNavHidden(false);
  }

  lastScrollY.current = currentScrollY;
};
  const [data, setData] = useState({ shaders: DATABASE.shaders, developers: DATABASE.developers, versions: DATABASE.versions });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const [activeTab, setActiveTab] = useState('shaders');
  const [selectedShader, setSelectedShader] = useState(null);
  const [selectedDev, setSelectedDev] = useState(null);
  
  // Persisted State
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem('darkMode') || 'true'));
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]'));
  const [userProfile, setUserProfile] = useState(() => JSON.parse(localStorage.getItem('userProfile') || '{"name": "Guest User"}'));
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('themeColor') || 'teal');
  const [compactMode, setCompactMode] = useState(() => JSON.parse(localStorage.getItem('compactMode') || 'false'));

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState(null); 
  const [lightboxImages, setLightboxImages] = useState(null);
  const [exitAttempt, setExitAttempt] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => { localStorage.setItem('favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('userProfile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('themeColor', themeColor); }, [themeColor]);
  useEffect(() => { localStorage.setItem('compactMode', JSON.stringify(compactMode)); }, [compactMode]);

  // Back Navigation & Android Hardware Back Button
  useEffect(() => {
        const handleBack = () => {
      if (lightboxImages) { setLightboxImages(null); return; }
      if (selectedShader) { setSelectedShader(null); return; }
      if (selectedDev) { setSelectedDev(null); return; }
      if (isMenuOpen) { setIsMenuOpen(false); return; }
      
      if (exitAttempt) { 
        // CHECK IF NATIVE ANDROID BEFORE EXITING
        if (Capacitor.isNativePlatform()) {
          CapacitorApp.exitApp(); 
        } else {
          // If on the web, just go back in browser history
          window.history.back();
        }
      } else { 
        setExitAttempt(true); 
        showToast(Capacitor.isNativePlatform() ? "Press back again to exit" : "Press back again to leave", "info"); 
        setTimeout(() => setExitAttempt(false), 2000); 
      }
    };


    // Web Browser Back Button
    const handlePopState = (event) => {
      event.preventDefault();
      handleBack();
      window.history.pushState(null, null, window.location.href);
    };

    // Native Android Back Button
    const backListener = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      handleBack();
    });

    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      backListener.then(listener => listener.remove());
    };
  }, [selectedShader, selectedDev, isMenuOpen, lightboxImages, exitAttempt]);

  // Data Fetching
  const fetchData = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true); else setRefreshing(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData({ shaders: result.shaders || [], developers: result.developers || [], versions: result.versions || [] });
    } catch (err) {
      console.warn("Using fallback data", err); 
      if (!data.shaders.length) setData(DATABASE); 
    } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Pull to Refresh
  const containerRef = useRef(null);
  const [pullY, setPullY] = useState(0);
  const startY = useRef(0);
  
  const handleTouchStart = (e) => { 
    if (containerRef.current && containerRef.current.scrollTop === 0) startY.current = e.touches[0].clientY; 
  };
  
  const handleTouchMove = (e) => {
    const dy = e.touches[0].clientY - startY.current;
    if (containerRef.current && containerRef.current.scrollTop === 0 && dy > 0) setPullY(Math.min(dy * 0.4, 120)); else setPullY(0);
  };
  
  const handleTouchEnd = () => { if (pullY > 70) fetchData(true); setPullY(0); };

  // Helper Functions
  const showToast = (message, type = 'success', onClose = () => setToast(null)) => setToast({ message, type, onClose, theme: themeColor });
  
  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const isAdded = !prev.includes(id);
      showToast(isAdded ? "Added to favorites" : "Removed from favorites", isAdded ? "heart" : "info");
      return isAdded ? [...prev, id] : prev.filter(fid => fid !== id);
    });
  };

  const handleShare = async (shader) => {
    if (navigator.share) {
      try { await navigator.share({ title: shader.title, text: `Check out ${shader.title}!`, url: shader.downloadLink }); showToast("Shared successfully!"); } catch (error) { console.log('Error', error); }
    } else {
      if(shader.downloadLink) { navigator.clipboard.writeText(shader.downloadLink); showToast("Link copied!"); } else { showToast("No link to share", "error"); }
    }
  };

  const handleDownload = (url) => {
     showToast("Starting download...", "download");
     const link = document.createElement('a'); link.href = url; link.setAttribute('download', ''); link.target = "_blank";
     document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const themeStyles = THEMES[themeColor] || THEMES['teal'];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-neutral-900' : 'bg-neutral-50'} overflow-hidden`}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={toast.onClose} theme={themeColor} />}
      
      <SideMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        activeTab={activeTab} 
        onNavigate={(tab) => { setActiveTab(tab); setIsMenuOpen(false); }} 
        darkMode={darkMode} 
        toggleDarkMode={() => setDarkMode(!darkMode)} 
        userProfile={userProfile} 
        setUserProfile={setUserProfile} 
        theme={themeColor} 
      />
      
      {/* Updated Lightbox to accept the complex object */}
      {lightboxImages && <Lightbox images={lightboxImages.images} initialIndex={lightboxImages.index} onClose={() => setLightboxImages(null)} />}

      {/* OVERLAYS: Rendered alongside main content to prevent unmounting/lag */}
      {selectedShader && (
        <DetailView 
          shader={selectedShader} 
          onBack={() => setSelectedShader(null)} 
          isFav={favorites.includes(selectedShader.id)} 
          toggleFavorite={toggleFavorite} 
          themeColor={themeColor}
          onShare={handleShare}
          onDownload={handleDownload}
          onImageClick={(images, index) => setLightboxImages({ images, index })} 
        />
      )}
      
      {selectedDev && (
        <DevProfile 
          dev={selectedDev} 
          onBack={() => setSelectedDev(null)} 
          shaders={data.shaders} 
          onShaderClick={(shader) => { setSelectedShader(shader); }} 
          favorites={favorites} 
          themeColor={themeColor} 
          compactMode={compactMode} 
        />
      )}

      {/* MAIN BACKGROUND APP: Always rendered */}
    <header className={`fixed top-0 left-0 right-0 z-50 px-6 pt-12 pb-2 flex items-center justify-between bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-sm transition-transform duration-300 ${isNavHidden ? '-translate-y-full' : 'translate-y-0'}`}>
  <div>
    <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
      {activeTab === 'shaders' && 'Newb Hub'}
      {activeTab === 'devs' && 'Developers'}
      {activeTab === 'guides' && 'Guides'}
      {activeTab === 'settings' && 'Settings'}
    </h1>
    <p className="text-neutral-500 text-sm font-medium mt-0.5">
      {activeTab === 'shaders' && 'Explore community shaders'}
      {activeTab === 'devs' && 'Meet the creators'}
      {activeTab === 'guides' && 'Tutorials & Tools'}
      {activeTab === 'settings' && 'Customize your experience'}
    </p>
  </div>
  <button onClick={() => setIsMenuOpen(true)} className="p-3 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors active:scale-95 border border-white/50 dark:border-neutral-700">
    <Menu size={22} />
  </button>
</header>

      <main 
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onScroll={handleContainerScroll}
        onTouchEnd={handleTouchEnd}
        className="w-full max-w-md mx-auto md:max-w-full pb-32 pt-28 h-screen overflow-y-auto scrollbar-hide relative"
      >
        <div className={`ptr-spinner ${refreshing || pullY > 0 ? 'visible' : ''}`} style={{ transform: `translateY(${pullY}px)` }}>
           <div className={`p-3 bg-white dark:bg-neutral-800 rounded-full shadow-lg ${themeStyles.text}`}>
             <RefreshCw size={24} className={refreshing ? 'animate-spin-slow' : ''} style={{ transform: `rotate(${pullY * 3}deg)` }} />
           </div>
        </div>

        {loading && !refreshing && <div className="space-y-4 mt-4 px-4"><SkeletonCard /><SkeletonCard /></div>}
        
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
            <WifiOff size={48} className="text-neutral-400 mb-4" />
            <p className="text-neutral-500 mb-4 font-medium">{error}</p>
            <button onClick={() => fetchData()} className={`flex items-center gap-2 px-6 py-2 ${themeStyles.primary} text-white rounded-full font-bold active:scale-95 transition-transform shadow-lg`}>
              <RefreshCw size={18} /> Retry
            </button>
          </div>
        )}
        
        {!loading && !error && (
          <>
            {activeTab === 'shaders' && (
              <ShaderList 
                data={data} 
                favorites={favorites} 
                onShaderClick={setSelectedShader} 
                compactMode={compactMode} 
                setCompactMode={setCompactMode} 
                themeColor={themeColor}
                isNavHidden={isNavHidden}
              />
            )}
            {activeTab === 'devs' && (
              <DevsList 
                developers={data.developers} 
                onDevClick={setSelectedDev} 
                themeColor={themeColor} 
              />
            )}
            {activeTab === 'guides' && <GuidesView themeColor={themeColor} />}
            {activeTab === 'settings' && (
              <SettingsView 
                themeColor={themeColor} 
                setThemeColor={setThemeColor} 
                compactMode={compactMode} 
                setCompactMode={setCompactMode} 
                darkMode={darkMode} 
                setDarkMode={setDarkMode} 
                onClearCache={() => { showToast("Cache cleared"); fetchData(); }} 
              />
            )}
          </>
        )}
      </main>

   <nav className={`fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-neutral-900/90 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 pb-safe z-30 shadow-2xl transition-transform duration-300 ${isNavHidden ? 'translate-y-full' : 'translate-y-0'}`}> 
   <div className="flex justify-around items-center h-20 max-w-md mx-auto relative">
          {[
            { id: 'shaders', icon: Layers, label: 'Hub' },
            { id: 'devs', icon: User, label: 'Devs' },
            { id: 'guides', icon: BookOpen, label: 'Guide' },
            { id: 'settings', icon: Settings, label: 'Set' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-1.5 w-16 transition-all duration-300 active:scale-95 group relative`}>
              <div className={`
                p-2.5 rounded-2xl transition-all duration-300 
                ${activeTab === tab.id 
                  ? `${themeStyles.secondary} dark:${themeStyles.darkBg} ${themeStyles.text} dark:${themeStyles.textDark} -translate-y-2 shadow-sm` 
                  : 'text-neutral-400 dark:text-neutral-500 group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800'
                }
              `}>
                <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-bold tracking-wide transition-opacity duration-300 ${activeTab === tab.id ? 'opacity-100' : 'opacity-0 absolute -bottom-2'}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
