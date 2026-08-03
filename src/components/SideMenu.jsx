import React, { useState, useEffect } from 'react';
import { X, Save, Edit2, Layers, User, BookOpen, Settings, LogOut } from 'lucide-react';
import { THEMES } from '../utils/constants';

const SideMenu = ({ isOpen, onClose, activeTab, onNavigate, darkMode, toggleDarkMode, userProfile, setUserProfile, theme }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userProfile.name);
  const styles = THEMES[theme] || THEMES['teal'];

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
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white dark:bg-neutral-900 z-[60] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Menu</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 active:scale-90 transition-transform"><X size={24} /></button>
        </div>
        <div className={`p-6 ${styles.secondary} dark:${styles.darkBg}`}>
          <div className="flex items-center gap-4">
             <div className={`w-14 h-14 rounded-full ${styles.primary} flex items-center justify-center text-white font-bold text-2xl uppercase shadow-md`}>{userProfile.name.charAt(0)}</div>
             <div className="flex-1 min-w-0">
               {isEditing ? (
                 <div className="flex items-center gap-2">
                   <input autoFocus type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} className={`w-full bg-white dark:bg-neutral-800 rounded px-2 py-1 text-sm text-neutral-900 dark:text-white border ${styles.border} outline-none`} />
                   <button onClick={handleSaveName} className={styles.text}><Save size={18} /></button>
                 </div>
               ) : (
                 <div className="flex items-center gap-2 group">
                   <p className="font-bold text-neutral-900 dark:text-white truncate text-lg">{userProfile.name}</p>
                   <button onClick={() => setIsEditing(true)} className={`text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity hover:${styles.textDark}`}><Edit2 size={14} /></button>
                 </div>
               )}
               <p className="text-xs text-neutral-500 font-medium">Newb Account</p>
             </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-2">
            {[
              { id: 'shaders', icon: Layers, label: 'Shaders' },
              { id: 'devs', icon: User, label: 'Developers' },
              { id: 'guides', icon: BookOpen, label: 'Guides & Tools' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map(item => (
              <button key={item.id} onClick={() => onNavigate(item.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 active:scale-95 ${activeTab === item.id ? `${styles.secondary} ${styles.text} dark:${styles.darkBg} dark:${styles.textDark}` : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
                <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                <span className="font-medium capitalize text-base">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
           <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Dark Mode</span>
              <button onClick={toggleDarkMode} className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${darkMode ? styles.primary : 'bg-neutral-300'}`}><div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} /></button>
           </div>
           <button className="w-full flex items-center justify-center gap-2 p-3 text-red-500 font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all active:scale-95"><LogOut size={20} /> Sign Out</button>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
