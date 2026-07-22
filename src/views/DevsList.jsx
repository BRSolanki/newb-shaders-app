import React from 'react';
import { Check } from 'lucide-react';
import { THEMES } from '../utils/constants';

const DevsList = ({ developers, onDevClick, themeColor }) => {
  const themeStyles = THEMES[themeColor] || THEMES['teal'];

  return (
    <div className="px-4 pt-6 pb-24 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 px-2 tracking-tight">Developers</h2>
      <div className="space-y-6">
        {developers.map((dev, idx) => (
          <div 
            key={dev.id ? dev.id : `dev-${idx}`} 
            onClick={() => onDevClick(dev)} 
            style={{ animationDelay: `${idx * 0.1}s` }} 
            className="bg-white dark:bg-neutral-800 rounded-[2rem] p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-[0.98] animate-fade-in-up opacity-0 border border-neutral-100 dark:border-neutral-700/50 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className={`absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity ${themeStyles.primary}`}></div>
                <img 
                  src={dev.icon} 
                  alt={dev.name} 
                  className={`w-24 h-24 rounded-full shadow-lg border-4 relative z-10 object-cover bg-neutral-100 ${themeStyles.border}`} 
                />
                {dev.verified && (
                  <div className={`absolute -bottom-1 -right-1 z-20 ${themeStyles.primary} text-white p-1.5 rounded-full border-4 border-white dark:border-neutral-800 shadow-sm`}>
                    <Check size={14} strokeWidth={4} />
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">{dev.name}</h3>
              <p className={`${themeStyles.text} ${themeStyles.textDark} font-bold text-xs uppercase tracking-wider mb-4 px-3 py-1 bg-neutral-100 dark:bg-neutral-900/50 rounded-full`}>{dev.role || "Developer"}</p>
              
              <button className={`w-full py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-bold text-sm hover:${themeStyles.secondary} dark:hover:${themeStyles.darkBg} transition-colors active:scale-95`}>
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevsList;
