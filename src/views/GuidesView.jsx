import React from 'react';
import { AlertTriangle, Play, Settings } from 'lucide-react';
import { THEMES } from '../utils/constants';

const GuidesView = ({ themeColor }) => {
  const themeStyles = THEMES[themeColor] || THEMES['teal'];

  return (
    <div className="px-4 pt-6 pb-24 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 px-2 tracking-tight">Guides & Tools</h2>
      
      <div className="space-y-8">
        {/* Warning Card */}
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50 rounded-3xl p-6 flex gap-5 items-start shadow-sm">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl text-red-600 dark:text-red-400 flex-shrink-0">
             <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-red-700 dark:text-red-400 mb-2 text-lg">Patch Warning</h3>
            <p className="text-sm text-red-600/80 dark:text-red-300/80 leading-relaxed font-medium">
              Official patching by YSS has stopped since Minecraft 1.21.60. Usage of any patchers is now at your own risk.
            </p>
          </div>
        </div>

        {/* MB Loader Tool */}
        <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 shadow-md border border-neutral-100 dark:border-neutral-700/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Settings size={100} />
          </div>
          <div className="flex items-center gap-5 mb-5 relative z-10">
            <img src="https://play-lh.googleusercontent.com/MFWpr8QhdY3DUKVc8bGFCj7yrw4q3s5CY5Cj676HuowOfKmNJosBFW--208oR-dfqNk=w240-h480-rw" className="w-16 h-16 rounded-2xl shadow-sm" alt="MB Loader" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/64?text=MB' }} />
            <div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">MB Loader</h3>
              <p className="text-sm text-neutral-500 font-medium">By Bambosan</p>
            </div>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6 leading-relaxed relative z-10">
            An essential tool for loading custom shaders on Minecraft Bedrock (RenderDragon). Allows you to import material files directly without complex patching.
          </p>
          <button 
            onClick={() => window.open('https://play.google.com/store/apps/details?id=io.bambosan.mbloader&pcampaignid=web_share', '_blank')} 
            className="w-full py-3.5 rounded-2xl bg-[#00Cca3] text-white font-bold text-sm flex items-center justify-center gap-3 active:scale-95 transition-transform hover:brightness-105 shadow-lg shadow-[#00cca3]/20 relative z-10"
          >
            <Play size={18} fill="currentColor" /> Get on Play Store
          </button>
        </div>

        {/* Installation Guide */}
        <div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white px-2 mb-4">How to Install</h3>
          <div className="space-y-4">
            {[
              { title: "Download Shader", desc: "Browse this app and click the download button for your favorite shader." },
              { title: "Import to MB Loader", desc: "Open MB Loader app, select 'Import' and choose the downloaded .mcpack file." },
              { title: "Apply & Play", desc: "Select the shader in MB Loader, apply it to Minecraft, and launch the game!" }
            ].map((step, idx) => (
              <div key={idx} className="bg-white dark:bg-neutral-800 rounded-3xl p-5 flex gap-5 items-start shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-2xl ${themeStyles.secondary} dark:${themeStyles.darkBg} ${themeStyles.text} dark:${themeStyles.textDark} flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-sm border border-white/50 dark:border-neutral-700/50`}>
                  {idx + 1}
                </div>
                <div className="pt-1">
                  <h4 className="font-bold text-neutral-900 dark:text-white text-base mb-1">{step.title}</h4>
                  <p className="text-sm text-neutral-500 leading-relaxed font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidesView;
