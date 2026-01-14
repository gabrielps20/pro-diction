
import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Languages, Mic, History, Wind, BookOpen, Loader2 } from 'lucide-react';
import { Language, PronunciationAnalysis, AppView } from './types';
import { analyzeWord } from './services/geminiService';
import { translations } from './translations';
import WordAnalyzer from './components/WordAnalyzer';
import Techniques from './components/Techniques';
import Resources from './components/Resources';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState<Language>(Language.PORTUGUESE);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<PronunciationAnalysis | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const t = useMemo(() => translations[language], [language]);

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const searchTerm = overrideQuery || query;
    if (!searchTerm.trim()) return;

    setView('home');
    setLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeWord(searchTerm, language);
      setAnalysis(result);
      if (!recentSearches.includes(searchTerm)) {
        setRecentSearches(prev => [searchTerm, ...prev].slice(0, 5));
      }
    } catch (error) {
      alert("Error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (view === 'techniques') return <Techniques language={language} />;
    if (view === 'resources') return <Resources language={language} />;
    
    return (
      <>
        <section className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-5xl md:text-6xl font-black text-[#2d4a22] mb-6 tracking-tight">
            {t.heroTitle} <span className="text-[#4c7c3c]">{t.heroHighlight}</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            {t.heroSub}
          </p>

          <form onSubmit={(e) => handleSearch(e)} className="relative max-w-3xl mx-auto">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#4c7c3c]">
              <Search size={24} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-16 pr-48 py-6 rounded-[2rem] bg-white shadow-2xl shadow-emerald-900/5 border border-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all text-xl font-medium text-slate-700"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
               <select 
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value as Language);
                  setAnalysis(null);
                }}
                className="bg-emerald-50 text-emerald-700 text-sm font-bold py-2.5 px-5 rounded-2xl border-none cursor-pointer hover:bg-emerald-100 transition-colors appearance-none"
              >
                {Object.values(Language).map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#4c7c3c] text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-[#3d6330] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : t.btnAnalyze}
              </button>
            </div>
          </form>

          {recentSearches.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-8 text-sm">
              <span className="text-slate-400 font-bold flex items-center gap-1 uppercase tracking-widest"><History size={14} /> {t.recent}:</span>
              <div className="flex gap-3">
                {recentSearches.map((word, i) => (
                  <button key={i} onClick={() => {setQuery(word); handleSearch(undefined, word);}} className="text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 px-3 py-1 rounded-full transition-colors underline-none">{word}</button>
                ))}
              </div>
            </div>
          )}
        </section>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-8 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-emerald-600"><Sparkles size={24} /></div>
            </div>
            <p className="text-emerald-800 font-bold text-xl animate-pulse">{t.loadingIA}</p>
          </div>
        )}

        {analysis && <WordAnalyzer analysis={analysis} language={language} />}

        {!loading && !analysis && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-50 shadow-xl shadow-emerald-900/5 hover:translate-y-[-4px] transition-all cursor-pointer group" onClick={() => setView('home')}>
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Mic size={28} /></div>
              <h3 className="text-2xl font-black text-slate-800 mb-4">{t.cardIA}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{t.cardIADesc}</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-50 shadow-xl shadow-emerald-900/5 hover:translate-y-[-4px] transition-all cursor-pointer group" onClick={() => setView('techniques')}>
              <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-amber-500 group-hover:text-white transition-colors"><Wind size={28} /></div>
              <h3 className="text-2xl font-black text-slate-800 mb-4">{t.cardWarmup}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{t.cardWarmupDesc}</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-50 shadow-xl shadow-emerald-900/5 hover:translate-y-[-4px] transition-all cursor-pointer group" onClick={() => setView('resources')}>
              <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors"><BookOpen size={28} /></div>
              <h3 className="text-2xl font-black text-slate-800 mb-4">{t.cardTongue}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{t.cardTongueDesc}</p>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f9f7] text-slate-900 pb-20">
      <header className="sticky top-0 z-50 glass border-b border-emerald-100/50">
        <div className="max-w-6xl mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => {setView('home'); setAnalysis(null);}}>
            <div className="w-12 h-12 bg-[#4c7c3c] rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3"><Sparkles size={28} fill="currentColor" /></div>
            <h1 className="text-2xl font-black tracking-tighter text-[#2d4a22]">Dicção<span className="text-[#4c7c3c]">Pro</span></h1>
          </div>
          <nav className="hidden md:flex items-center gap-10 text-sm font-bold uppercase tracking-widest">
            <button onClick={() => setView('home')} className={`transition-all hover:scale-105 ${view === 'home' ? 'text-[#4c7c3c]' : 'text-slate-400 hover:text-emerald-600'}`}>{t.navHome}</button>
            <button onClick={() => setView('techniques')} className={`transition-all hover:scale-105 ${view === 'techniques' ? 'text-[#4c7c3c]' : 'text-slate-400 hover:text-emerald-600'}`}>{t.navTechniques}</button>
            <button onClick={() => setView('resources')} className={`transition-all hover:scale-105 ${view === 'resources' ? 'text-[#4c7c3c]' : 'text-slate-400 hover:text-emerald-600'}`}>{t.navResources}</button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-8 py-16">{renderContent()}</main>
      <footer className="mt-24 border-t border-emerald-100 py-16 text-center text-slate-400 font-bold text-sm tracking-widest uppercase">
        {t.footer}
      </footer>
    </div>
  );
};

export default App;
