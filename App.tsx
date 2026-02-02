
import React, { useState } from 'react';
import { Search, MonitorPlay, Zap, Sparkles, AlertCircle, Github, Loader2 } from 'lucide-react';
import { AnimeSearchResult } from './types';
import { searchAnime } from './services/apiService';
import { AnimeCard } from './components/AnimeCard';
import { Modal } from './components/Modal';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AnimeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnime, setSelectedAnime] = useState<AnimeSearchResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const data = await searchAnime(query);
      setResults(data);
      if (data.length === 0) {
        setError("No results found.");
      }
    } catch (err) {
      setError("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-200">
      
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-40 px-4 md:px-6 py-4 md:py-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2.5 backdrop-blur-xl bg-white/5 border border-white/5 px-4 py-2 rounded-full shadow-2xl">
            <MonitorPlay className="text-cyan-400" size={18} />
            <span className="text-xs font-bold tracking-[0.2em] text-white">ZENITH</span>
          </div>
          <a href="#" className="backdrop-blur-xl bg-white/5 border border-white/5 p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
            <Github size={18} />
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`relative pt-28 md:pt-32 pb-8 md:pb-12 px-4 md:px-6 transition-all duration-700 ${results.length > 0 ? 'min-h-[30vh] md:min-h-[40vh]' : 'min-h-[70vh] md:min-h-[80vh] flex flex-col justify-center'}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-cyan-500/10 blur-[80px] md:blur-[120px] rounded-full -z-10 pointer-events-none" />
        
        <div className="max-w-2xl mx-auto w-full space-y-6 md:space-y-8 text-center">
            {!hasSearched && (
                <div className="space-y-3 md:space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tight leading-tight">
                    Anime<br/>Redefined.
                    </h1>
                    <p className="text-slate-500 text-sm md:text-lg font-light tracking-wide max-w-md mx-auto px-4">
                    A minimalist gateway to the vast anime multiverse. Powered by AI.
                    </p>
                </div>
            )}

          <form onSubmit={handleSearch} className="relative group w-full max-w-lg mx-auto">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/50 to-blue-600/50 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
             <div className="relative flex items-center bg-[#0a0a0a] rounded-full border border-white/10 shadow-2xl">
                <div className="pl-4 md:pl-5 text-slate-500">
                    <Search size={18} />
                </div>
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search series..."
                    className="w-full bg-transparent text-white px-3 md:px-4 py-3 md:py-4 rounded-full focus:outline-none placeholder:text-slate-600 font-medium text-sm tracking-wide"
                />
                <button 
                    type="submit"
                    disabled={loading}
                    className="mr-1.5 md:mr-2 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                </button>
             </div>
          </form>
        </div>
      </section>

      {/* Results Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        {error ? (
          <div className="text-center space-y-2 py-12">
            <AlertCircle className="mx-auto text-red-500/50 mb-2" size={32} />
            <p className="text-slate-400 text-sm">{error}</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
               <Sparkles size={12} className="text-cyan-500" /> 
               {results.length} Results
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-x-6 md:gap-y-10">
              {results.map((anime, idx) => (
                <AnimeCard 
                  key={idx} 
                  anime={anime} 
                  onClick={setSelectedAnime}
                />
              ))}
            </div>
          </div>
        ) : null}
      </main>

      {/* Detail Modal */}
      <Modal 
        anime={selectedAnime} 
        onClose={() => setSelectedAnime(null)} 
      />
    </div>
  );
};

export default App;
