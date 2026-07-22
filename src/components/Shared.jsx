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

export const PlatformBadge = ({ type }) => {
  const config = PLATFORM_MAP[type?.toUpperCase()] || PLATFORM_MAP['ANDROID']; 
  return <div title={config.label} className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">{config.icon}</div>;
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
