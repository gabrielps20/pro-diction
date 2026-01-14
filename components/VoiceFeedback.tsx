
import React, { useState, useRef, useMemo } from 'react';
import { Mic, Square, Loader2, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { analyzeUserRecording } from '../services/geminiService';
import { translations } from '../translations';
import { Language, AudioFeedback } from '../types';

interface Props {
  targetWord: string;
  language: Language;
}

const VoiceFeedback: React.FC<Props> = ({ targetWord, language }) => {
  const [recording, setRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<AudioFeedback | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const t = useMemo(() => translations[language], [language]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setAnalyzing(true);
          try {
            const result = await analyzeUserRecording(base64Audio, targetWord, language);
            setFeedback(result);
          } catch (err) {
            alert("Error analyzing audio.");
          } finally {
            setAnalyzing(false);
          }
        };
      };

      mediaRecorder.start();
      setRecording(true);
      setFeedback(null);
    } catch (err) {
      alert("Microphone error.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="bg-emerald-50/50 rounded-[2.5rem] p-8 border border-emerald-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-10">
        <h4 className="text-xl font-black text-[#2d4a22] flex items-center gap-3">
          <Mic size={24} />
          {t.voicePratice}
        </h4>
        {!recording ? (
          <button
            onClick={startRecording}
            disabled={analyzing}
            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-emerald-900/10"
          >
            <Mic size={20} /> {t.voiceRecord}
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-red-600 transition-all animate-pulse shadow-xl shadow-red-900/10"
          >
            <Square size={20} /> {t.voiceStop}
          </button>
        )}
      </div>

      <div className="flex-grow flex flex-col justify-center">
        {analyzing && (
          <div className="flex flex-col items-center space-y-4 py-12">
            <Loader2 className="animate-spin text-emerald-600" size={48} />
            <p className="text-emerald-800 font-bold text-lg">{t.voiceAnalyzing}</p>
          </div>
        )}

        {feedback && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-6 mb-8">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-emerald-100" />
                  <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" 
                          strokeDasharray={263.8} strokeDashoffset={263.8 - (263.8 * feedback.score) / 100}
                          className={`${feedback.score > 80 ? 'text-emerald-500' : 'text-amber-500'} transition-all duration-1000 stroke-cap-round`} />
                </svg>
                <span className="absolute text-2xl font-black text-emerald-900">{feedback.score}</span>
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 mb-1">{t.voiceResult}</p>
                <p className="text-slate-500 font-medium leading-relaxed">{feedback.observations}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {feedback.improvementTips.map((tip, i) => (
                <div key={i} className="flex gap-3 text-sm bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm font-medium">
                  <CheckCircle size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">{tip}</p>
                </div>
              ))}
            </div>
            
            <button onClick={() => setFeedback(null)} className="mt-8 text-sm font-black text-emerald-700 flex items-center gap-2 hover:underline tracking-widest uppercase">
              <RefreshCw size={16} /> {t.voiceTryAgain}
            </button>
          </div>
        )}

        {!recording && !analyzing && !feedback && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-900/5">
              <AlertCircle size={40} className="text-emerald-200" />
            </div>
            <p className="text-slate-400 font-bold max-w-xs mx-auto text-lg leading-relaxed">{t.voiceEmpty}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceFeedback;
