import React, { useEffect, useState } from 'react';
import { THEMES } from '../utils/constants';
import { Check, Download, Heart, Info, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const Toast = ({ message, type, onClose, theme }) => {
  useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer); }, [onClose]);
  const styles = THEMES[theme] || THEMES['teal'];
  
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[120] flex items-center gap-3 px-4 py-3 rounded-2xl bg-neutral-900/90 dark:bg-white/90 text-white dark:text-neutral-900 shadow-xl backdrop-blur-md min-w-[200px] max-w-[90vw] animate-fade-in-up">
      {type === 'success' && <Check size={18} className="text-green-500" />}
      {type === 'download' && <Download size={18} className="text-blue-400" />}
      {type === 'heart' && <Heart size={18} className="text-red-500 fill-current" />}
      {type === 'info' && <Info size={18} className={styles.textDark} />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export const Lightbox = ({ images, initialIndex, onClose }) => {
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
