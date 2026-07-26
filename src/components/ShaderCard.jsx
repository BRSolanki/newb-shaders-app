import React from 'react';
import { Heart, ChevronRight } from 'lucide-react';
import { normalizeShaderData } from '../utils/helpers';
import { THEMES } from '../utils/constants';
import { PlatformBadge } from './Shared';

const ShaderCard = ({ shader, onClick, index, isFav, compact, theme }) => {
  const normalized = normalizeShaderData(shader);
  const styles = THEMES[theme] || THEMES['teal'];

  if (compact) {
    return (
      <div onClick={onClick} style={{ animationDelay: `${index * 0.05}s` }} className="group relative bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer active:scale-[0.98] animate-fade-in-up opacity-0 flex h-24">
        <div className="w-24 h-full flex-shrink-0">
          <img src={normalized.thumbnail} alt={normalized.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
          <h3 className="font-bold text-neutral-900 dark:text-white truncate">{normalized.title}</h3>
          <div className="flex items-center gap-2 mt-1">
             <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${styles.secondary} ${styles.text} dark:${styles.darkBg} dark:${styles.textDark}`}>{normalized.supportedVersion}</span>
             {normalized.tags[0] && <span className="text-xs text-neutral-500 truncate">{typeof normalized.tags[0] === 'string' ? normalized.tags[0] : 'Tag'}</span>}
          </div>
        </div>
        <div className="pr-4 flex items-center justify-center">
           <button className={`w-8 h-8 rounded-full ${styles.secondary} dark:${styles.darkBg} ${styles.text} dark:${styles.textDark} flex items-center justify-center`}><ChevronRight size={16} /></button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClick} style={{ animationDelay: `${index * 0.1}s` }} className="group relative bg-white dark:bg-neutral-800 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 animate-fade-in-up opacity-0">
      <div className="h-56 w-full overflow-hidden relative">
        <img src={normalized.thumbnail} alt={normalized.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">{normalized.title}</h3>
              <div className="flex items-center gap-2">
  <span className={`px-2.5 py-1 rounded-lg backdrop-blur-md bg-white/20 border border-white/10 text-white text-[11px] font-bold tracking-wider`}>
    {normalized.supportedVersion}
  </span>
  <PlatformBadge platforms={normalized.platforms} />
</div>
            </div>
            {isFav && (
              <div className="bg-red-500 p-2.5 rounded-full text-white shadow-lg animate-fade-in-up">
                <Heart size={18} fill="currentColor" />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2 text-sm leading-relaxed mb-4">{typeof normalized.description === 'string' ? normalized.description : 'Description unavailable'}</p>
        <div className="flex items-center justify-between">
          {/* NEW: Dynamic Badges alongside standard tags */}
        <div className="flex gap-2 flex-wrap">
          {/* Your standard tags */}
          {normalized.tags.slice(0, 3).map(t => (
            <span key={t} className={`text-xs font-medium ${styles.text} dark:${styles.textDark} ${styles.secondary} dark:${styles.darkBg} px-2.5 py-1 rounded-lg`}>
              {typeof t === 'string' ? t : 'Tag'}
            </span>
          ))}

          {/* 1.26.30+ Badge */}
          {normalized.supportedVersion?.includes("1.26.30") && (
            <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold px-2.5 py-1 rounded-lg">
              1.26.30+
            </span>
          )}

          {/* Android Only Badge */}
          {normalized.platforms?.length === 1 && normalized.platforms.includes("ANDROID") && (
            <span className="bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-bold px-2.5 py-1 rounded-lg">
              Android Only
            </span>
          )}
        </div>
          <button className={`w-10 h-10 rounded-full ${styles.secondary} dark:${styles.darkBg} ${styles.text} dark:${styles.textDark} flex items-center justify-center group-active:scale-90 transition-transform`}><ChevronRight size={20} /></button>
        </div>
      </div>
    </div>
  );
};

export default ShaderCard;
