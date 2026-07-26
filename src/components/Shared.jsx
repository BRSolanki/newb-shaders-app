import React from 'react';
import { THEMES, PLATFORM_MAP } from '../utils/constants';

export const Chip = ({ label, active, onClick, icon, theme }) => {
  const styles = THEMES[theme] || THEMES['teal'];
  return (
    <button 
      onClick={onClick} 
      className={`
        flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap active:scale-95 
        ${active 
          ? `${styles.secondary} ${styles.text} dark:${styles.darkBg} dark:${styles.textDark} shadow-sm` 
          : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
};

export const PlatformBadge = ({ type, platforms }) => {
  // 1. Logic for DetailView.jsx (Detailed single pills)
  if (type) {
    const config = PLATFORM_MAP[type.toUpperCase()] || PLATFORM_MAP['ANDROID'];
    return (
      <div title={config.label} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 shadow-sm border border-neutral-200 dark:border-neutral-700/50">
        {React.cloneElement(config.icon, { size: 16 })}
        <span className="text-xs font-bold tracking-wide">{config.label}</span>
      </div>
    );
  }

  // 2. Logic for ShaderCard.jsx (Frosted glass overlay pill)
  if (!platforms || platforms.length === 0) return null;

  // If only one platform is supported
  if (platforms.length === 1) {
    const config = PLATFORM_MAP[platforms[0]?.toUpperCase()] || PLATFORM_MAP['ANDROID'];
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-md bg-white/20 border border-white/10 text-white shadow-sm" title={config.label}>
        {React.cloneElement(config.icon, { size: 14 })}
        <span className="text-[11px] font-bold uppercase tracking-wider">{config.label}</span>
      </div>
    );
  }

  // If multiple platforms are supported (Deduplicate Android/iOS since both use the phone icon)
  const hasMobile = platforms.includes('ANDROID') || platforms.includes('IOS');
  const hasDesktop = platforms.includes('WINDOWS');

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-md bg-white/20 border border-white/10 text-white shadow-sm" title={platforms.join(', ')}>
      <div className="flex items-center gap-1 opacity-90">
        {hasMobile && React.cloneElement(PLATFORM_MAP['ANDROID'].icon, { size: 14 })}
        {hasDesktop && React.cloneElement(PLATFORM_MAP['WINDOWS'].icon, { size: 14 })}
      </div>
      <span className="text-[11px] font-bold uppercase tracking-wider border-l border-white/30 pl-1.5 ml-0.5">
        Multi
      </span>
    </div>
  );
};

export const SkeletonCard = () => (
  <div className="rounded-[2rem] overflow-hidden bg-white dark:bg-neutral-800 shadow-sm h-72 animate-pulse">
    <div className="h-48 w-full bg-neutral-200 dark:bg-neutral-700" />
    <div className="p-5 space-y-3">
      <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
      <div className="h-3 w-1/2 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
    </div>
  </div>
);
