
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { PronunciationAnalysis, Language, AudioFeedback } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeWord(word: string, language: Language): Promise<PronunciationAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Você é um fonoaudiólogo especialista. Analise a pronúncia e dicção da palavra "${word}" em ${language}. 
    Forneça detalhes técnicos precisos para melhorar a articulação e clareza da fala.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          phonetics: { type: Type.STRING },
          syllables: { type: Type.ARRAY, items: { type: Type.STRING } },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } },
          commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
          mouthPosition: { type: Type.STRING },
          exampleSentence: { type: Type.STRING }
        },
        required: ["word", "phonetics", "syllables", "tips", "commonMistakes", "mouthPosition", "exampleSentence"]
      }
    }
  });

  const cleanJson = response.text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
}

export async function generateSpeech(text: string, language: Language): Promise<string | undefined> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Diga pausadamente e com dicção perfeita: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    return undefined;
  }
}

export async function analyzeUserRecording(base64Audio: string, targetWord: string, language: Language): Promise<AudioFeedback> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        inlineData: {
          mimeType: "audio/webm",
          data: base64Audio
        }
      },
      {
        text: `Avalie minha gravação da palavra "${targetWord}" em ${language}. Compare com a pronúncia nativa e forneça feedback técnico. Seja encorajador mas preciso.`
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Nota de 0 a 100 baseada na clareza" },
          observations: { type: Type.STRING, description: "O que foi ouvido e onde falhou" },
          improvementTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Dicas práticas para melhorar este áudio específico" }
        },
        required: ["score", "observations", "improvementTips"]
      }
    }
  });
  
  const cleanJson = response.text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
}
