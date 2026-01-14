
import React, { useMemo } from 'react';
import { Wind, Activity, Music, Smile, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface Props {
  language: Language;
}

const Techniques: React.FC<Props> = ({ language }) => {
  const t = useMemo(() => translations[language], [language]);

  const techniques = {
    [Language.PORTUGUESE]: [
      { title: "Respiração Diafragmática", icon: <Wind />, desc: "Inspire pelo nariz expandindo o abdômen.", exercise: "Inspire em 4s, segure 2, solte em 8 com 'S'." },
      { title: "Vibração de Língua", icon: <Activity />, desc: "Aquece as pregas vocais.", exercise: "Faça 'Trrr' subindo e descendo o tom." },
      { title: "Articulação Exagerada", icon: <Smile />, desc: "Melhora a clareza das vogais.", exercise: "Diga A-E-I-O-U abrindo o máximo a boca." },
      { title: "Leitura com Caneta", icon: <Music />, desc: "Força a língua a trabalhar mais.", exercise: "Leia um parágrafo com uma caneta entre os dentes." }
    ],
    [Language.ENGLISH]: [
      { title: "Diaphragmatic Breathing", icon: <Wind />, desc: "Inhale through your nose expanding your abdomen.", exercise: "Inhale for 4s, hold for 2, exhale for 8 with an 'S' sound." },
      { title: "Tongue Trills", icon: <Activity />, desc: "Warms up the vocal folds.", exercise: "Do 'Trrr' going up and down in pitch." },
      { title: "Over-articulation", icon: <Smile />, desc: "Improves vowel clarity.", exercise: "Say A-E-I-O-U opening your mouth as wide as possible." },
      { title: "Pen Exercise", icon: <Music />, desc: "Forces the tongue to work harder.", exercise: "Read a text with a pen between your teeth." }
    ],
    // Simplificando os outros para o exemplo, mas seguindo o padrão
  };

  const currentTechs = techniques[language] || techniques[Language.ENGLISH];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-16 text-center">
        <h2 className="text-4xl font-black text-[#2d4a22] mb-4">{t.techTitle}</h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto">{t.techSub}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {currentTechs.map((tech, i) => (
          <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-emerald-50 shadow-xl shadow-emerald-900/5 hover:translate-y-[-4px] transition-all group">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors">{tech.icon}</div>
            <h3 className="text-2xl font-black mb-4">{tech.title}</h3>
            <p className="text-slate-500 mb-8 font-medium leading-relaxed">{tech.desc}</p>
            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2 block">{t.exerciseLabel}</span>
              <p className="text-slate-700 font-bold flex items-center gap-3">
                <ArrowRight size={18} className="text-emerald-500" /> {tech.exercise}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Techniques;
