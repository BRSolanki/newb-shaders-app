import React from 'react';
import { Check, Trash2, List, Moon, Disc, Globe, ChevronRight, Heart } from 'lucide-react';
import { THEMES } from '../utils/constants';

const SettingsView = ({ themeColor, setThemeColor, compactMode, setCompactMode, darkMode, setDarkMode, onClearCache }) => {
  const themeStyles = THEMES[themeColor] || THEMES['teal'];

  const SectionTitle = ({ children }) => (
    <h3 className={`text-sm font-bold ${themeStyles.text} ${themeStyles.textDark} uppercase tracking-wider mb-3 px-2`}>{children}</h3>
  );

  const SettingCard = ({ children, className = "" }) => (
    <div className={`bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {children}
    </div>
  );

  const handleSocial = (url) => window.open(url, '_blank');

  return (
    <div className="px-4 pt-6 pb-24 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 px-2 tracking-tight">Settings</h2>
      <div className="space-y-8">
        <section>
          <SectionTitle>Appearance</SectionTitle>
          <SettingCard className="p-5 flex justify-between items-center bg-white dark:bg-neutral-800">
            {Object.keys(THEMES).map((color) => (
              <button 
                key={color}
                onClick={() => setThemeColor(color)}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all active:scale-90 ${THEMES[color].primary} ${themeColor === color ? 'border-neutral-200 dark:border-neutral-600 scale-110 shadow-lg ring-2 ring-offset-2 ring-offset-neutral-50 dark:ring-offset-neutral-900 ' + themeStyles.ring : 'border-transparent opacity-70 hover:opacity-100'}`}
                aria-label={`Select ${color} theme`}
              >
                {themeColor === color && <Check size={20} className="text-white bg-black/20 rounded-full p-0.5" />}
              </button>
            ))}
          </SettingCard>
        </section>

        <section>
          <SectionTitle>Display</SectionTitle>
          <SettingCard>
            <div className="p-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${themeStyles.secondary} ${themeStyles.text} dark:${themeStyles.darkBg} dark:${themeStyles.textDark}`}><List size={22} /></div>
                <div>
                  <span className="font-bold text-neutral-900 dark:text-white block">Compact Mode</span>
                  <span className="text-xs text-neutral-500">Smaller cards for more density</span>
                </div>
              </div>
              <button onClick={() => setCompactMode(!compactMode)} className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${compactMode ? themeStyles.primary : 'bg-neutral-300 dark:bg-neutral-700'}`}><div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${compactMode ? 'translate-x-6' : 'translate-x-0'}`} /></button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300`}><Moon size={22} /></div>
                <div>
                  <span className="font-bold text-neutral-900 dark:text-white block">Dark Mode</span>
                  <span className="text-xs text-neutral-500">Easy on the eyes</span>
                </div>
              </div>
              <button onClick={() => setDarkMode(!darkMode)} className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${darkMode ? themeStyles.primary : 'bg-neutral-300 dark:bg-neutral-700'}`}><div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} /></button>
            </div>
          </SettingCard>
        </section>

        <section>
          <SectionTitle>Community</SectionTitle>
          <SettingCard>
             <button onClick={() => handleSocial('https://discord.gg/t8Y9aB4YQj')} className="w-full p-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
               <div className="flex items-center gap-4">
                 <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"><Disc size={22} /></div>
                 <span className="font-bold text-neutral-900 dark:text-white">Join Discord</span>
               </div>
               <ChevronRight size={20} className="text-neutral-400" />
             </button>
             <button onClick={() => handleSocial('https://devendrn.github.io/newb-shader/')} className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
               <div className="flex items-center gap-4">
                 <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><Globe size={22} /></div>
                 <span className="font-bold text-neutral-900 dark:text-white">Official Website</span>
               </div>
               <ChevronRight size={20} className="text-neutral-400" />
             </button>
          </SettingCard>
        </section>

        <section>
          <SectionTitle>Data & Storage</SectionTitle>
          <SettingCard>
             <div className="p-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700">
              <span className="font-bold text-neutral-900 dark:text-white">App Version</span>
              <span className="text-neutral-500 bg-neutral-100 dark:bg-neutral-700 px-3 py-1 rounded-full text-xs font-mono">v1.6.0</span>
            </div>
             <button onClick={onClearCache} className="w-full p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors active:bg-neutral-100 dark:active:bg-neutral-700 group">
              <div className="flex items-center gap-3 text-red-500 group-hover:text-red-600">
                <Trash2 size={20} />
                <div className="text-left">
                  <span className="font-bold block">Clear Cache</span>
                  <span className="text-xs opacity-70">Free up space (approx 12MB)</span>
                </div>
              </div>
            </button>
          </SettingCard>
        </section>
      </div>

      <div className="mt-12 text-center">
        <p className="text-xs font-medium text-neutral-400 dark:text-neutral-600 flex items-center justify-center gap-1.5">
          Made with <Heart size={12} className="text-red-500 fill-current animate-pulse" /> by PixelBoy
        </p>
      </div>
    </div>
  );
};

export default SettingsView;
