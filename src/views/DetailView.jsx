import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, Download, ExternalLink, AlertTriangle } from 'lucide-react';
import { normalizeShaderData } from '../utils/helpers';
import { THEMES } from '../utils/constants';
import { PlatformBadge } from '../components/Shared';

const DetailView = ({ shader, onBack, isFav, toggleFavorite, themeColor, onShare, onDownload, onImageClick }) => {
  const [downloading, setDownloading] = useState(false);
  const [showLoaderWarning, setShowLoaderWarning] = useState(false);
  
  const styles = THEMES[themeColor] || THEMES['teal'];
  const normalized = normalizeShaderData(shader);

  const handleDownloadClick = () => {
    if (normalized.supportedVersion?.includes("1.26.30")) {
      setShowLoaderWarning(true);
    } else {
      proceedWithDownload();
    }
  };

  const proceedWithDownload = () => {
    setDownloading(true);
    onDownload(normalized.downloadLink);
    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-neutral-900 overflow-y-auto animate-fade-in-up">
      
      {/* CUSTOM MODAL FOR 1.26.30+ */}
      {showLoaderWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-neutral-100 dark:border-neutral-700">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Game Loader Required</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 leading-relaxed">
              {normalized.title} requires a dedicated game loader to work on Minecraft v1.26.30+.
            </p>
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-3 mb-6 space-y-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              <div className="flex justify-between"><span>Android:</span> <span className="font-bold text-teal-600 dark:text-teal-400">MB Loader</span></div>
              <div className="flex justify-between"><span>Windows:</span> <span className="font-bold text-blue-600 dark:text-blue-400">Wyvern</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowLoaderWarning(false)} className="flex-1 py-3 rounded-xl font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors">Cancel</button>
              <button onClick={() => { setShowLoaderWarning(false); proceedWithDownload(); }} className={`flex-1 py-3 rounded-xl font-bold text-white ${styles.primary} hover:brightness-110 transition-colors`}>Continue</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER BUTTONS (FIXED FOR STATUS BAR OVERLAP) */}
      <div className="fixed top-0 left-0 right-0 z-30 flex justify-between px-4 pt-[calc(1rem+env(safe-area-inset-top))] pointer-events-none">
        <button onClick={onBack} className="pointer-events-auto p-3 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors active:scale-90 shadow-lg border border-white/10">
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex gap-3 pointer-events-auto">
          <button onClick={() => toggleFavorite(shader.id)} className={`p-3 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-lg border border-white/10 ${isFav ? 'bg-red-500/90 text-white' : 'bg-black/20 text-white hover:bg-black/40'}`}>
            <Heart size={24} fill={isFav ? "currentColor" : "none"} />
          </button>
          <button onClick={() => onShare(normalized)} className="p-3 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors active:scale-90 shadow-lg border border-white/10">
            <Share2 size={24} />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="h-[50vh] w-full relative">
        <img src={normalized.thumbnail} className="w-full h-full object-cover" alt="Detail" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white dark:to-neutral-900 pointer-events-none" />
      </div>

      {/* CONTENT (FIXED FOR NAVIGATION BAR OVERLAP) */}
      <div className="-mt-20 relative px-6 pb-[calc(6rem+env(safe-area-inset-bottom))] touch-pan-y">
        <div className="flex flex-col gap-2 mb-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center gap-3">
             <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white dark:text-white/90 text-xs font-bold px-2.5 py-1 rounded-lg tracking-wider uppercase shadow-sm">
               {normalized.supportedVersion}
             </span>
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white drop-shadow-sm">{normalized.title}</h1>
        </div>

        <div className="mb-8 space-y-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <button
             onClick={handleDownloadClick}
             disabled={downloading}
             className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-${themeColor}-500/20 transition-all active:scale-95 hover:brightness-110 ${downloading ? 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500' : `${styles.primary} text-white`}`}
          >
            <Download size={24} /> {downloading ? 'Downloading...' : 'Download .mcpack'}
          </button>
          
          {normalized.otherLinks.map((link, i) => (
             <button key={i} onClick={() => window.open(link.link, '_blank')} className="w-full py-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors active:scale-95 border border-neutral-200 dark:border-neutral-700/50">
               <ExternalLink size={18} /> {link.title}
             </button>
          ))}
          
          <div className="flex justify-center pt-2">
            <div className="flex gap-2 overflow-x-auto max-w-full pb-2 scrollbar-hide px-2">
              {/* Map through the platforms individually to show the full Icon + Name */}
              {normalized.platforms.map(p => (
                <PlatformBadge key={p} type={p} />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-10 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">About</h3>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-base font-medium">
            {typeof normalized.description === 'string' ? normalized.description : 'Description unavailable'}
          </p>
        </div>

        {normalized.screenshots.length > 0 && (
          <div className="mb-10 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Gallery</h3>
            <div className="flex gap-4 overflow-x-auto -mx-6 px-6 pb-4 snap-x scrollbar-hide">
              {normalized.screenshots.map((src, idx) => (
                 <img
                   key={idx}
                   src={src}
                   onClick={() => onImageClick && onImageClick(normalized.screenshots, idx)}
                   className="h-48 w-72 flex-shrink-0 object-cover rounded-2xl snap-center shadow-md active:opacity-80 transition-opacity bg-neutral-100 dark:bg-neutral-800 cursor-pointer"
                   alt="Screenshot"
                />
               ))}
            </div>
          </div>
        )}

        <div className="mb-8 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Developer</h3>
          <div className="flex items-center gap-4 p-5 rounded-3xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/50">
             <div className={`w-12 h-12 rounded-full ${styles.secondary} dark:${styles.darkBg} flex items-center justify-center text-xl font-bold`}>
               {normalized.creator?.[0] || 'D'}
             </div>
             <div>
               <h4 className="font-bold text-neutral-900 dark:text-white">{normalized.creator}</h4>
               <p className="text-xs text-neutral-500 font-medium">Creator</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;