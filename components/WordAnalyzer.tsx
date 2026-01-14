
import React, { useState, useMemo } from 'react';
import { PronunciationAnalysis, Language } from '../types';
import { generateSpeech } from '../services/geminiService';
import { translations } from '../translations';
import { Play, Volume2, Info, Speech, Languages, Youtube, Mic, ArrowRight } from 'lucide-react';
import VoiceFeedback from './VoiceFeedback';

interface Props {
  analysis: PronunciationAnalysis;
  language: Language;
}

const WordAnalyzer: React.FC<Props> = ({ analysis, language }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const t = useMemo(() => translations[language], [language]);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const handlePlayAudio = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    const base64Audio = await generateSpeech(analysis.word, language);
    if (base64Audio) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        if (audioContext.state === 'suspended') await audioContext.resume();
        const buffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.onended = () => { setIsPlaying(false); audioContext.close(); };
        source.start();
      } catch (err) { setIsPlaying(false); }
    } else setIsPlaying(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-emerald-900/5 border border-emerald-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h2 className="text-6xl font-black text-[#2d4a22] tracking-tighter mb-4">{analysis.word}</h2>
            <div className="flex items-center gap-3 text-emerald-700 font-black bg-emerald-50 px-5 py-2 rounded-2xl w-fit text-sm uppercase tracking-widest">
              <Languages size={18} />
              <span>{language}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handlePlayAudio}
              disabled={isPlaying}
              className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black transition-all shadow-xl active:scale-95 ${
                isPlaying ? 'bg-emerald-100 text-emerald-400' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-900/20'
              }`}
            >
              <Volume2 size={24} className={isPlaying ? 'animate-pulse' : ''} />
              {t.iaGuide}
            </button>
            <button
              onClick={() => window.open(`https://www.youtube.com/results?search_query=pronunciation+of+${analysis.word}+${language}+native`, '_blank')}
              className="flex items-center gap-3 px-8 py-4 bg-[#f8312f] text-white rounded-[1.5rem] font-black hover:bg-red-700 shadow-xl shadow-red-900/10 active:scale-95 transition-all"
            >
              <Youtube size={24} /> {t.ytBtn}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-10">
            <div className="bg-stone-50 p-8 rounded-[2rem] border border-stone-200">
              <div className="flex items-center gap-3 text-stone-500 mb-6 text-xs font-black uppercase tracking-[0.2em]">
                <Info size={18} /> {t.phoneticsLabel}
              </div>
              <p className="text-3xl font-mono font-bold text-emerald-800 mb-6 bg-white p-5 rounded-2xl border border-stone-200 inline-block shadow-inner">{analysis.phonetics}</p>
              <p className="text-xl text-slate-700 leading-relaxed font-medium italic">"{analysis.mouthPosition}"</p>
            </div>
            
            <div className="bg-white rounded-[2rem] p-8 border border-emerald-50 shadow-inner">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3"><Speech size={22} className="text-emerald-500" /> {t.tipsLabel}</h3>
              <ul className="space-y-5">
                {analysis.tips.map((t_item, i) => (
                  <li key={i} className="flex gap-4 text-slate-600 font-medium">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    {t_item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <VoiceFeedback targetWord={analysis.word} language={language} />
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#2d4a22] to-[#1a2c14] rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><Languages size={24} className="text-emerald-400" /> {t.challengeLabel}</h3>
          <p className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tight">"{analysis.exampleSentence}"</p>
          <p className="text-emerald-200/70 text-lg font-medium flex items-center gap-2">
            <ArrowRight size={20} /> {t.challengeDesc}
          </p>
        </div>
        <Mic size={200} className="absolute -right-16 -bottom-16 opacity-5 pointer-events-none rotate-12" />
      </div>
    </div>
  );
};

export default WordAnalyzer;
