import React, { useState, useMemo } from 'react';
import { Search, Clock, ArrowLeft, ArrowDownUp, LayoutGrid, List } from 'lucide-react';
import ShaderCard from '../components/ShaderCard';
import { Chip } from '../components/Shared';
import { normalizeShaderData, TAG_OPTIONS } from '../utils/index';

const ShaderList = ({ 
  data, favorites, onShaderClick, compactMode, setCompactMode, themeColor, isNavHidden 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [filterTag, setFilterTag] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('searchHistory')) || [];
    } catch { return []; }
  });

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      setShowHistory(false);
    }
  };

  const filteredShaders = useMemo(() => {
    if (!data.shaders) return [];
    
    let result = data.shaders.filter(shader => {
      const norm = normalizeShaderData(shader);
      
      const matchesSearch = norm.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesTag = true;
      if (filterTag !== 'All') {
        if (filterTag === '1.26.30+') {
          matchesTag = norm.supportedVersion && norm.supportedVersion.includes('1.26.30');
        } else if (filterTag === 'Android Only') {
          matchesTag = norm.platforms && norm.platforms.length === 1 && norm.platforms.includes('ANDROID');
        } else if (/^\d/.test(filterTag)) {
          matchesTag = norm.supportedVersion && norm.supportedVersion.includes(filterTag);
        } else {
          matchesTag = norm.tags && norm.tags.includes(filterTag);
        }
      }
      
      return matchesSearch && matchesTag;
    });

    if (sortOrder === 'Newest') {
      result.sort((a, b) => b.id - a.id);
    } else if (sortOrder === 'A-Z') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    return result;
  }, [data.shaders, searchQuery, filterTag, sortOrder]);
  
  return (
    <>
      {/* 
        FIX 1: Changed to 'fixed top-[112px]'. This physically anchors it exactly 
        below your main header, completely eliminating the random scroll gaps.
        FIX 2: Added 'pb-5' to the parent container. This guarantees 20px of space
        between the filter chips and the bottom border line.
      */}
      <div 
        className={`fixed top-[112px] left-0 right-0 z-40 pt-3 pb-5 bg-neutral-50 dark:bg-neutral-900 shadow-md transition-transform duration-300 border-b border-neutral-200 dark:border-neutral-800 ${isNavHidden ? '-translate-y-[200%]' : 'translate-y-0'}`}
      >
        <div className="w-full max-w-md mx-auto md:max-w-full">
          
          {/* Search Bar Container */}
          <div className="px-4 mb-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-500">
                <Search size={20} />
              </div>
              <input 
                type="text"
                placeholder="Find your next shader..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowHistory(true)}
                onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                onKeyDown={handleSearchSubmit}
                className="w-full py-3.5 pl-12 pr-4 rounded-2xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 shadow-sm transition-all border border-neutral-100 dark:border-neutral-700/50"
              />
              {showHistory && searchHistory.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in-up border border-neutral-100 dark:border-neutral-700">
                  <div className="p-2 flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider px-4 py-2"><Clock size={12}/> Recent</div>
                  {searchHistory.map((term, i) => (
                    <button key={i} onClick={() => { setSearchQuery(term); setShowHistory(false); }} className="w-full text-left px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm flex justify-between group transition-colors">
                      {term} <ArrowLeft size={14} className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filter Buttons Container */}
          <div className="flex gap-2 overflow-x-auto px-4 items-center scrollbar-hide">
            <button onClick={() => setSortOrder(prev => prev === 'Newest' ? 'A-Z' : 'Newest')} className="p-2.5 rounded-xl bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 active:scale-95 transition-transform flex-shrink-0 shadow-sm border border-neutral-100 dark:border-neutral-700"><ArrowDownUp size={18} /></button>
            <button onClick={() => setCompactMode(!compactMode)} className="p-2.5 rounded-xl bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 active:scale-95 transition-transform flex-shrink-0 shadow-sm border border-neutral-100 dark:border-neutral-700">
              {compactMode ? <LayoutGrid size={18} /> : <List size={18} />}
            </button>
            <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 mx-1 flex-shrink-0"></div>
            <Chip label="All" active={filterTag === 'All'} onClick={() => setFilterTag('All')} theme={themeColor} />
            {TAG_OPTIONS.map(tag => <Chip key={tag} label={tag} active={filterTag === tag} onClick={() => setFilterTag(tag)} theme={themeColor} />)}
            {data.versions?.map((ver) => (
              <Chip key={ver.base} label={ver.base} active={filterTag === ver.base} onClick={() => setFilterTag(ver.base)} theme={themeColor} />
            ))}
          </div>
          
        </div>
      </div>

      {/* 
        FIX 3: Added pt-[160px] to push the cards down perfectly below the new fixed header.
      */}
      <div className={`relative w-full max-w-md mx-auto md:max-w-full z-0 px-4 pt-[160px] min-h-[50vh] ${compactMode ? 'space-y-3' : 'space-y-6'}`}>
        {filteredShaders.map((shader, index) => (
          <ShaderCard 
            key={shader.id ? shader.id : `shader-${index}`} 
            shader={shader} 
            index={index} 
            onClick={() => onShaderClick(shader)} 
            isFav={favorites.includes(shader.id)} 
            compact={compactMode} 
            theme={themeColor} 
          />
        ))}
        {filteredShaders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
            <Search size={48} className="text-neutral-300 dark:text-neutral-700 mb-4" />
            <p className="font-medium">No shaders found matching your criteria.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ShaderList;