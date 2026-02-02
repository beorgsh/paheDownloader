
import React from 'react';
import { AnimeSearchResult } from '../types';
import { Star } from 'lucide-react';

interface Props {
  anime: AnimeSearchResult;
  onClick: (anime: AnimeSearchResult) => void;
}

export const AnimeCard: React.FC<Props> = ({ anime, onClick }) => {
  return (
    <div 
      onClick={() => onClick(anime)}
      className="group cursor-pointer flex flex-col gap-2 md:gap-3 animate-in fade-in duration-500"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl md:rounded-2xl bg-slate-900 border border-white/5 shadow-2xl shadow-black/50 transition-all duration-500 group-hover:shadow-cyan-900/10 group-hover:border-white/10">
        <img 
          src={anime.poster} 
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/400/600?grayscale';
          }}
        />
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
        
        {/* Score Badge */}
        <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/40 backdrop-blur-md px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg flex items-center gap-1 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Star size={10} className="text-yellow-400" fill="currentColor" />
          <span className="text-[10px] font-bold text-white tracking-wide">{anime.score || 'N/A'}</span>
        </div>
      </div>
      
      <div className="space-y-0.5 md:space-y-1 px-1">
        <h3 className="text-slate-200 font-medium text-xs md:text-sm leading-tight line-clamp-1 group-hover:text-cyan-400 transition-colors">
          {anime.title}
        </h3>
        <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-[11px] text-slate-500 font-medium tracking-wide">
          <span className="capitalize">{anime.type}</span>
          <span className="w-0.5 h-0.5 bg-slate-700 rounded-full" />
          <span>{anime.year}</span>
          <span className="w-0.5 h-0.5 bg-slate-700 rounded-full" />
          <span className="text-slate-600">{anime.episodes} EP</span>
        </div>
      </div>
    </div>
  );
};
