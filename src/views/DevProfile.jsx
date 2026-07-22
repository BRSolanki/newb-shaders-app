import React from 'react';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';
import { getSocialIcon, THEMES } from '../utils/index';
import ShaderCard from '../components/ShaderCard';

const DevProfile = ({ dev, onBack, shaders, onShaderClick, favorites, themeColor, compactMode }) => {
  if (!dev) return null;
  const styles = THEMES[themeColor] || THEMES['teal'];
  const devShaders = shaders.filter(s => s.creator === dev.id);

  const handleSocial = (url) => window.open(url, '_blank');

  return (
    <div className="fixed inset-0 z-40 bg-neutral-50 dark:bg-neutral-900 overflow-y-auto animate-slide-in-right">
      <div className={`h-48 bg-gradient-to-br ${styles.primary} to-black/50 relative`}>
         <button onClick={onBack} className="absolute top-4 left-4 p-3 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors active:scale-90 border border-white/10"><ArrowLeft size={24} /></button>
      </div>
      
      <div className="px-6 relative -mt-16 pb-24 animate-fade-in-up">
        <div className="flex justify-between items-end mb-6">
          <div className="relative">
             <img src={dev.icon} alt={dev.name} className={`w-32 h-32 rounded-full border-4 border-neutral-50 dark:border-neutral-900 bg-white dark:bg-neutral-800 shadow-xl object-cover`} />
             {dev.verified && <div className={`absolute bottom-2 right-2 ${styles.primary} text-white p-1.5 rounded-full border-4 border-neutral-50 dark:border-neutral-900 shadow-sm`}><Check size={16} strokeWidth={4} /></div>}
          </div>
          <div className="flex gap-2 mb-2">
            {dev.socials?.map((social, idx) => (
              <button key={idx} onClick={() => handleSocial(social.link)} className="p-3 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm text-neutral-600 dark:text-neutral-400 hover:text-teal-500 transition-colors active:scale-95 border border-neutral-100 dark:border-neutral-700" title={social.title}>
                {getSocialIcon(social.title)}
              </button>
            ))}
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-1">{dev.name}</h1>
        <p className={`${styles.text} ${styles.textDark} font-bold uppercase tracking-wider text-sm mb-5`}>{dev.role || "Developer"}</p>
        
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-700/50 mb-8">
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">{dev.bio || "No bio available."}</p>
        </div>
        
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 px-1">Projects</h2>
        <div className="space-y-6">
          {devShaders.length > 0 ? devShaders.map((shader, index) => ( 
            <ShaderCard 
              key={shader.id} 
              shader={shader} 
              index={index} 
              onClick={() => onShaderClick(shader)} 
              isFav={favorites.includes(shader.id)} 
              compact={compactMode} 
              theme={themeColor} 
            /> 
          )) : <div className="text-center py-10 text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800/50 rounded-3xl">No public projects yet.</div>}
        </div>
      </div>
    </div>
  );
};

export default DevProfile;
