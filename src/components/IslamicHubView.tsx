import React, { useState } from "react";
import { BookOpen, ScrollText, Layers, Feather, HeartHandshake } from "lucide-react";
import { SupportedLanguage } from "../types";
import { QuranView } from "./QuranView";
import { HadithView } from "./HadithView";
import { GrammarView } from "./GrammarView";
import { UrduWriterView } from "./UrduWriterView";

interface IslamicHubViewProps {
  onSpeak: (text: string, lang?: SupportedLanguage, rate?: number, onEnd?: () => void) => void;
  onStopSpeak: () => void;
  isSpeaking: boolean;
  onOpenHamdModal: () => void;
}

export const IslamicHubView: React.FC<IslamicHubViewProps> = ({
  onSpeak,
  onStopSpeak,
  isSpeaking,
  onOpenHamdModal,
}) => {
  const [subTab, setSubTab] = useState<"quran" | "hadith" | "grammar" | "urdu">("quran");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-28">
      {/* Top Banner for Hamd-o-Sana and Durood-o-Salam */}
      <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-teal-950/30 border border-amber-600/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="text-sm font-bold text-amber-200 font-nastaliq">
              الحمد لله رب العالمين · الصلاة والسلام على رسول الله ﷺ
            </div>
            <p className="text-xs text-slate-300 font-nastaliq">
              افتتاحی حمد و ثنا اور درود و سلام کا مکمل متن اور صوتی تلاوت
            </p>
          </div>
        </div>
        <button
          onClick={onOpenHamdModal}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold whitespace-nowrap shadow-md active:scale-95 transition-all self-stretch sm:self-auto font-nastaliq"
        >
          حمد و درود کھولیں
        </button>
      </div>

      {/* Subtab Segmented Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none border-b border-purple-900/30">
        <button
          onClick={() => setSubTab("quran")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            subTab === "quran"
              ? "bg-teal-950/90 border border-teal-500 text-teal-300 shadow-md"
              : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <BookOpen className="w-4 h-4 text-teal-400" />
          <span className="font-nastaliq text-sm">قرآن مجید (تلاوت و ترجمہ)</span>
        </button>

        <button
          onClick={() => setSubTab("hadith")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            subTab === "hadith"
              ? "bg-amber-950/90 border border-amber-500 text-amber-300 shadow-md"
              : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <ScrollText className="w-4 h-4 text-amber-400" />
          <span className="font-nastaliq text-sm">احادیث مبارکہ (مستند ذخیرہ)</span>
        </button>

        <button
          onClick={() => setSubTab("grammar")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            subTab === "grammar"
              ? "bg-indigo-950/90 border border-indigo-500 text-indigo-300 shadow-md"
              : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-400" />
          <span className="font-nastaliq text-sm">قواعد النحو والصرف</span>
        </button>

        <button
          onClick={() => setSubTab("urdu")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            subTab === "urdu"
              ? "bg-rose-950/90 border border-rose-500 text-rose-300 shadow-md"
              : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <Feather className="w-4 h-4 text-rose-400" />
          <span className="font-nastaliq text-sm">اردو ادب و انشا</span>
        </button>
      </div>

      {/* Render selected subtab */}
      {subTab === "quran" && <QuranView />}
      {subTab === "hadith" && (
        <HadithView
          onSpeak={onSpeak}
          onStopSpeak={onStopSpeak}
          isSpeaking={isSpeaking}
        />
      )}
      {subTab === "grammar" && <GrammarView />}
      {subTab === "urdu" && <UrduWriterView />}
    </div>
  );
};
