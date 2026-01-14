
import React, { useMemo } from 'react';
import { BookOpen, Star, Zap, Layers } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface Props {
  language: Language;
}

const Resources: React.FC<Props> = ({ language }) => {
  const t = useMemo(() => translations[language], [language]);

  const twisters = {
    [Language.PORTUGUESE]: {
      easy: ["O rato roeu a roupa do rei de Roma.", "Três pratos de trigo para três tigres tristes."],
      med: ["Num ninho de mafagafos há sete mafagafinhos.", "O tempo perguntou ao tempo quanto tempo o tempo tem."],
      hard: ["O desinquivincavacador das caravelas desinquivincavacará.", "Bagdá é uma cidade dantesca."]
    },
    [Language.ENGLISH]: {
      easy: ["She sells seashells by the seashore.", "Peter Piper picked a peck of pickled peppers."],
      med: ["How much wood would a woodchuck chuck if a woodchuck could chuck wood?", "I scream, you scream, we all scream for ice cream."],
      hard: ["Sixth sick sheik's sixth sheep's sick.", "The subtle shibboleth shifted significantly."]
    },
    [Language.SPANISH]: {
      easy: ["Tres tristes tigres tragaban trigo en un trigal.", "Pablito clavó un clavito."],
      med: ["El cielo está encapotado, ¿quién lo desencapotará?", "Compadre, cómpreme un coco."],
      hard: ["El arzobispo de Constantinopla se quiere desarzobispoconstantinopolizar."]
    },
    [Language.FRENCH]: {
      easy: ["Un chasseur sachant chasser chasse sans son chien.", "Cinq chiens chassent six chats."],
      med: ["Les chaussettes de l'archiduchesse sont-elles sèches, archisèches ?", "Fruit frais, fruit frit, fruit cuit."],
      hard: ["Didon dîna dit-on du dos d'un dodu dindon."]
    },
    [Language.GERMAN]: {
      easy: ["Fischers Fritz fischt frische Fische.", "Blaukraut bleibt Blaukraut."],
      med: ["Zwei schreiende Schweine schwimmen im schwarzen See.", "In Ulm, um Ulm, und um Ulm herum."],
      hard: ["Bismarck biss Mark, bis Mark Bismarck biss."]
    }
  };

  const current = twisters[language] || twisters[Language.ENGLISH];

  const categories = [
    { name: t.levelEasy, icon: <Zap size={22} className="text-amber-500" />, items: current.easy },
    { name: t.levelMed, icon: <Star size={22} className="text-blue-500" />, items: current.med },
    { name: t.levelHard, icon: <Layers size={22} className="text-purple-500" />, items: current.hard }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-16 text-center">
        <h2 className="text-4xl font-black text-[#2d4a22] mb-4">{t.resTitle}</h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto">{t.resSub}</p>
      </div>
      <div className="space-y-10">
        {categories.map((cat, i) => (
          <div key={i} className="bg-white rounded-[2.5rem] p-10 border border-emerald-50 shadow-xl shadow-emerald-900/5">
            <div className="flex items-center gap-4 mb-8">
              {cat.icon}
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{cat.name}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cat.items.map((item, idx) => (
                <div key={idx} className="p-8 bg-stone-50 rounded-2xl border border-stone-100 hover:border-emerald-200 hover:bg-white transition-all cursor-pointer group shadow-sm">
                  <p className="text-xl text-slate-700 font-bold leading-relaxed group-hover:text-emerald-700 transition-colors">"{item}"</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-16 bg-[#4c7c3c] rounded-[3rem] p-12 text-white text-center shadow-2xl shadow-emerald-900/20">
        <BookOpen size={64} className="mx-auto mb-8 opacity-30" />
        <h3 className="text-3xl font-black mb-4">{t.studyTip}</h3>
        <p className="max-w-xl mx-auto text-emerald-100 font-medium text-lg">{t.studyTipDesc}</p>
      </div>
    </div>
  );
};

export default Resources;
