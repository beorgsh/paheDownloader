
import React, { useEffect, useState } from 'react';
import { AnimeSearchResult, GeminiAnalysis, Episode, EpisodeResponse, DownloadResponse, DownloadItem } from '../types';
import { X, Star, Zap, Info, Download, Loader2, Calendar, Layout, Film, Play, ChevronLeft, ChevronRight, ExternalLink, Languages, Mic, Sparkles } from 'lucide-react';
import { analyzeAnime } from '../services/geminiService';
import { getEpisodes, getDownloadLinks } from '../services/apiService';

interface Props {
  anime: AnimeSearchResult | null;
  onClose: () => void;
}

type Tab = 'analysis' | 'episodes';

export const Modal: React.FC<Props> = ({ anime, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('analysis');
  const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  
  const [episodesData, setEpisodesData] = useState<EpisodeResponse | null>(null);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [episodePage, setEpisodePage] = useState(1);

  const [selectedEp, setSelectedEp] = useState<Episode | null>(null);
  const [downloadLinks, setDownloadLinks] = useState<DownloadResponse | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  
  // State for the stream player modal
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  useEffect(() => {
    if (anime) {
      setActiveTab('analysis');
      setAnalysisLoading(true);
      setAnalysis(null);
      setEpisodesData(null);
      setEpisodePage(1);
      setSelectedEp(null);
      setDownloadLinks(null);
      setStreamUrl(null);
      
      analyzeAnime(anime.title)
        .then(setAnalysis)
        .catch(console.error)
        .finally(() => setAnalysisLoading(false));
    }
  }, [anime]);

  useEffect(() => {
    if (anime && activeTab === 'episodes') {
      fetchEpisodes(episodePage);
    }
  }, [anime, activeTab, episodePage]);

  const fetchEpisodes = async (page: number) => {
    if (!anime) return;
    setEpisodesLoading(true);
    const data = await getEpisodes(anime.session, page);
    setEpisodesData(data);
    setEpisodesLoading(false);
  };

  const handleEpisodeClick = async (ep: Episode) => {
    if (!anime) return;
    // If clicking same episode, toggle off
    if (selectedEp?.session === ep.session) {
        setSelectedEp(null);
        return;
    }
    setSelectedEp(ep);
    setDownloadLoading(true);
    setDownloadLinks(null);
    try {
      const links = await getDownloadLinks(anime.session, ep.session);
      setDownloadLinks(links);
    } catch (error) {
      console.error(error);
    } finally {
      setDownloadLoading(false);
    }
  };

  if (!anime) return null;

  // Split links based on the 3-by-3 logic
  const subLinks = downloadLinks?.slice(0, 3) || [];
  const dubLinks = downloadLinks?.slice(3, 6) || [];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div 
          className="bg-[#09090b] w-full max-w-5xl h-[100dvh] md:h-[85vh] md:max-h-[800px] overflow-hidden md:rounded-3xl shadow-2xl flex flex-col md:flex-row relative border-t md:border border-white/5"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-[60] p-2 rounded-full text-slate-300 bg-black/20 backdrop-blur-md md:bg-transparent md:text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={20} />
          </button>

          {/* Sidebar / Poster */}
          <div className="w-full md:w-[350px] shrink-0 relative h-56 md:h-auto overflow-hidden">
            <img 
              src={anime.poster} 
              alt={anime.title} 
              className="w-full h-full object-cover opacity-80"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://picsum.photos/400/600';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#09090b] via-[#09090b]/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-5 md:p-8 space-y-2 w-full">
                <h2 className="text-2xl md:text-4xl font-heading font-bold text-white leading-none tracking-tight line-clamp-2 md:line-clamp-none">
                  {anime.title}
                </h2>
                <div className="flex flex-wrap gap-2 md:gap-3 items-center pt-2">
                  <span className="flex items-center gap-1.5 text-yellow-400 bg-yellow-400/5 border border-yellow-400/10 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold">
                    <Star size={10} fill="currentColor" /> {anime.score}
                  </span>
                  <span className="text-slate-400 text-[10px] md:text-xs font-medium border border-white/5 px-2.5 py-1 rounded-full">{anime.year}</span>
                  <span className="text-cyan-400 text-[10px] md:text-xs font-bold border border-cyan-500/10 bg-cyan-500/5 px-2.5 py-1 rounded-full">{anime.status}</span>
                </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-0 bg-[#09090b]">
            {/* Tabs */}
            <div className="flex items-center gap-6 md:gap-8 px-5 md:px-8 border-b border-white/5 pt-4 md:pt-8 shrink-0">
              <button 
                onClick={() => setActiveTab('analysis')}
                className={`pb-3 md:pb-4 text-xs md:text-sm font-medium transition-all relative ${activeTab === 'analysis' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                AI Analysis
                {activeTab === 'analysis' && <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-cyan-500" />}
              </button>
              <button 
                onClick={() => setActiveTab('episodes')}
                className={`pb-3 md:pb-4 text-xs md:text-sm font-medium transition-all relative ${activeTab === 'episodes' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Episodes <span className="text-slate-600 ml-1">{anime.episodes}</span>
                {activeTab === 'episodes' && <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-cyan-500" />}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">
              {activeTab === 'analysis' ? (
                <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-left-2 duration-300 max-w-2xl pb-10">
                  {analysisLoading ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-cyan-500">
                          <Loader2 size={20} className="animate-spin" />
                          <span className="text-sm font-medium tracking-wide">Analysing with Gemini...</span>
                      </div>
                      <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
                      <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse" />
                    </div>
                  ) : analysis ? (
                    <>
                      <div className="space-y-3 md:space-y-4">
                          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase">
                              <Sparkles size={14} /> Synopsis
                          </div>
                          <p className="text-slate-300 leading-relaxed text-base md:text-lg font-light">
                            {analysis.summary}
                          </p>
                      </div>

                      <div className="grid gap-6 p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                          <div className="space-y-3">
                               <div className="flex items-center gap-2 text-slate-400 text-xs font-bold tracking-widest uppercase">
                                  <Zap size={14} /> Highlights
                              </div>
                              <p className="text-slate-400 text-sm leading-7 whitespace-pre-line">
                                {analysis.whyWatch}
                              </p>
                          </div>
                          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                               <span className="text-xs font-medium text-slate-500">Expert Rating</span>
                               <span className="text-xl md:text-2xl font-bold text-white tracking-tight">{analysis.rating}</span>
                          </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-500">Analysis unavailable.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300 h-full flex flex-col pb-10">
                  
                  {/* Download Panel (Sticky if selected) */}
                  {selectedEp && (
                      <div className="bg-cyan-950/10 border border-cyan-500/20 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6 animate-in zoom-in-95 duration-200 shrink-0">
                           <div className="flex items-center justify-between mb-4 md:mb-6">
                              <div className="flex flex-col">
                                  <span className="text-cyan-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Selected</span>
                                  <span className="text-white font-bold text-lg md:text-xl">Episode {selectedEp.episode}</span>
                              </div>
                              <button onClick={() => setSelectedEp(null)} className="text-slate-500 hover:text-white transition-colors">
                                  <X size={18} />
                              </button>
                          </div>
                          
                          {downloadLoading ? (
                               <div className="flex items-center gap-3 text-slate-400 text-sm">
                                  <Loader2 size={16} className="animate-spin text-cyan-500" />
                                  <span>Fetching secure mirrors...</span>
                               </div>
                          ) : downloadLinks ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                  {subLinks.length > 0 && (
                                      <div className="space-y-2 md:space-y-3">
                                          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                              <Languages size={14} /> Subtitled
                                          </div>
                                          <div className="flex flex-col gap-2">
                                              {subLinks.map((item, idx) => (
                                                  <MinimalDownloadButton key={idx} item={item} onSelect={setStreamUrl} />
                                              ))}
                                          </div>
                                      </div>
                                  )}
                                  {dubLinks.length > 0 && (
                                      <div className="space-y-2 md:space-y-3">
                                          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                              <Mic size={14} /> Dubbed
                                          </div>
                                          <div className="flex flex-col gap-2">
                                              {dubLinks.map((item, idx) => (
                                                  <MinimalDownloadButton key={idx} item={item} onSelect={setStreamUrl} variant="pink" />
                                              ))}
                                          </div>
                                      </div>
                                  )}
                                  {subLinks.length === 0 && dubLinks.length === 0 && (
                                      <p className="text-red-400 text-sm">No mirrors found.</p>
                                  )}
                              </div>
                          ) : (
                              <p className="text-red-400 text-sm">Connection failed.</p>
                          )}
                      </div>
                  )}

                  {/* Navigation & List */}
                  <div className="flex items-center justify-between sticky top-0 bg-[#09090b] z-10 py-2 shrink-0">
                      <h3 className="text-xs md:text-sm font-bold text-slate-200 uppercase tracking-wider">Episodes</h3>
                      {episodesData && episodesData.total_pages > 1 && (
                       <div className="flex items-center gap-2">
                         <button 
                           disabled={episodePage === 1 || episodesLoading}
                           onClick={() => setEpisodePage(p => p - 1)}
                           className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 disabled:opacity-30 transition-colors"
                         >
                           <ChevronLeft size={16} />
                         </button>
                         <span className="text-[10px] md:text-xs font-mono text-slate-500">{episodePage}/{episodesData.total_pages}</span>
                         <button 
                           disabled={episodePage === episodesData.total_pages || episodesLoading}
                           onClick={() => setEpisodePage(p => p + 1)}
                           className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 disabled:opacity-30 transition-colors"
                         >
                           <ChevronRight size={16} />
                         </button>
                       </div>
                     )}
                  </div>

                  <div className="flex-1 min-h-0">
                      {episodesLoading ? (
                          <div className="h-40 flex items-center justify-center">
                              <Loader2 size={24} className="animate-spin text-slate-600" />
                          </div>
                      ) : episodesData?.episodes?.length ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                              {episodesData.episodes.map((ep, idx) => (
                                  <div 
                                      key={`${ep.session}-${idx}`}
                                      onClick={() => handleEpisodeClick(ep)}
                                      className={`group cursor-pointer rounded-lg md:rounded-xl overflow-hidden relative aspect-video border transition-all duration-300 ${selectedEp?.episode === ep.episode ? 'border-cyan-500 ring-1 ring-cyan-500/50' : 'border-white/5 hover:border-white/20'}`}
                                  >
                                      <img 
                                          src={ep.snapshot} 
                                          alt="" 
                                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                          loading="lazy"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                                      <span className="absolute bottom-1.5 left-2 text-[10px] md:text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                                          EP {ep.episode}
                                      </span>
                                      {selectedEp?.episode === ep.episode && (
                                          <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)] animate-pulse" />
                                          </div>
                                      )}
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <div className="text-center py-10 text-slate-600 text-sm">No episodes found.</div>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stream Player Modal Overlay */}
      {streamUrl && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
                <h3 className="text-white font-bold flex items-center gap-2 text-sm md:text-lg">
                    <Play size={18} className="text-cyan-500" />
                    <span className="truncate max-w-[200px] md:max-w-md">Stream</span>
                </h3>
                <div className="flex items-center gap-3">
                    <a 
                        href={streamUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                        title="Open in new tab"
                    >
                        <ExternalLink size={20} />
                    </a>
                    <button 
                        onClick={() => setStreamUrl(null)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Iframe Container */}
            <div className="flex-1 relative bg-black flex items-center justify-center">
                <iframe 
                    src={streamUrl}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    referrerPolicy="origin"
                />
            </div>
            
            <div className="bg-black/80 p-2 text-center">
                 <p className="text-slate-600 text-[10px] md:text-xs">
                    If the video fails to load, use the external link button in the top right.
                 </p>
            </div>
        </div>
      )}
    </>
  );
};

const MinimalDownloadButton: React.FC<{ item: DownloadItem, onSelect: (link: string) => void, variant?: 'cyan' | 'pink' }> = ({ item, onSelect, variant = 'cyan' }) => {
    const isCyan = variant === 'cyan';
    return (
        <button 
            onClick={() => onSelect(item.link)}
            className={`group flex items-center justify-between w-full p-2.5 md:p-3 rounded-lg md:rounded-xl border transition-all duration-300 ${isCyan ? 'bg-cyan-500/5 border-cyan-500/10 hover:bg-cyan-500/10 hover:border-cyan-500/30' : 'bg-pink-500/5 border-pink-500/10 hover:bg-pink-500/10 hover:border-pink-500/30'}`}
        >
            <span className={`text-[10px] md:text-xs font-medium truncate pr-4 ${isCyan ? 'text-cyan-200' : 'text-pink-200'}`}>{item.name}</span>
            <Play size={14} className={`${isCyan ? 'text-cyan-500' : 'text-pink-500'} opacity-50 group-hover:opacity-100 transition-opacity`} />
        </button>
    )
}
