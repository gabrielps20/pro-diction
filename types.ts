
export interface PronunciationAnalysis {
  word: string;
  phonetics: string;
  syllables: string[];
  tips: string[];
  commonMistakes: string[];
  mouthPosition: string;
  exampleSentence: string;
}

export interface AudioFeedback {
  score: number;
  observations: string;
  improvementTips: string[];
}

export enum Language {
  PORTUGUESE = 'Português',
  ENGLISH = 'English',
  SPANISH = 'Español',
  FRENCH = 'Français',
  GERMAN = 'Deutsch'
}

export type AppView = 'home' | 'techniques' | 'resources';
