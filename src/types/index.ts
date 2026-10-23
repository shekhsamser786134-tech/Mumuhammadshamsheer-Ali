export type AppTab =
  | 'home'
  | 'chat'
  | 'islamic'
  | 'history'
  | 'device'
  | 'quran'
  | 'hadith'
  | 'grammar'
  | 'urdu'
  | 'settings';

export type SupportedLanguage = 'ur' | 'en' | 'ar' | 'hi' | 'ne';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: { title: string; uri: string }[];
  isActionable?: boolean;
  actionType?: 'call' | 'sms' | 'email' | 'map' | 'calendar' | 'search' | 'settings' | 'app';
  actionData?: Record<string, string>;
}

export interface ConversationSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface DeviceNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface UserProfileMemory {
  name: string;
  preferredLanguage: SupportedLanguage;
  speechSpeed: number;
  autoSpeak: boolean;
  notes: string[];
}

export interface SurahMeta {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameUrdu: string;
  englishMeaning: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  numberInSurah: number;
  numberInQuran: number;
  arabicText: string;
  urduTranslation: string;
  englishTranslation: string;
  audioUrl?: string;
  juz: number;
  sajda?: boolean;
}

export interface HadithItem {
  id: string;
  collection: 'bukhari' | 'muslim' | 'tirmidhi' | 'abudawud' | 'nasai' | 'ibnmajah';
  collectionNameArabic: string;
  collectionNameUrdu: string;
  collectionNameEnglish: string;
  hadithNumber: string;
  bookName: string;
  chapterName: string;
  arabicText: string;
  urduTranslation: string;
  englishTranslation: string;
  grading: 'Sahih' | 'Hasan';
  narrator: string;
  topic: string;
}

export interface GrammarTopic {
  id: string;
  category: 'nahw' | 'sarf' | 'irab';
  titleArabic: string;
  titleUrdu: string;
  titleEnglish: string;
  explanationUrdu: string;
  rules: string[];
  examples: {
    arabic: string;
    urduTranslation: string;
    breakdown: string;
  }[];
}

export interface GrammarQuizQuestion {
  id: string;
  questionUrdu: string;
  arabicSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UrduIdiom {
  idiom: string;
  meaning: string;
  usageExample: string;
}
