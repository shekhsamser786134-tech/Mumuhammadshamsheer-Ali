import React, { useState } from "react";
import { CANONICAL_HADITHS } from "../data/hadithData";
import { HadithItem } from "../types";
import { ScrollText, Search, Copy, Check, Volume2, VolumeX, ShieldCheck, Bookmark } from "lucide-react";

interface HadithViewProps {
  onSpeak: (text: string, lang: "ar" | "ur") => void;
  onStopSpeak: () => void;
  isSpeaking: boolean;
}

export const HadithView: React.FC<HadithViewProps> = ({ onSpeak, onStopSpeak, isSpeaking }) => {
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  const collections = [
    { id: "all", nameUrdu: "تمام کتب", nameEn: "All Books" },
    { id: "bukhari", nameUrdu: "صحیح البخاری", nameEn: "Sahih Bukhari" },
    { id: "muslim", nameUrdu: "صحیح مسلم", nameEn: "Sahih Muslim" },
    { id: "tirmidhi", nameUrdu: "جامع الترمذی", nameEn: "Jami' Tirmidhi" },
    { id: "abudawud", nameUrdu: "سنن ابی داود", nameEn: "Sunan Abu Dawud" },
    { id: "nasai", nameUrdu: "سنن النسائی", nameEn: "Sunan Nasa'i" },
    { id: "ibnmajah", nameUrdu: "سنن ابن ماجہ", nameEn: "Sunan Ibn Majah" },
  ];

  const topics = [
    "all",
    "Niyyah (Intentions)",
    "Brotherhood & Faith",
    "Qur'an & Knowledge",
    "Hadith Jibril (Islam, Iman, Ihsan)",
    "Purity & Prayer",
    "Good Character (حسن الخلق)",
    "Tawakkul & Trust in Allah",
    "Mercy to Creation",
    "Mother's Honor",
    "Obligation of Knowledge",
  ];

  const filteredHadiths = CANONICAL_HADITHS.filter((h) => {
    const matchesCollection = selectedCollection === "all" || h.collection === selectedCollection;
    const matchesTopic = selectedTopic === "all" || h.topic === selectedTopic;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      h.arabicText.includes(q) ||
      h.urduTranslation.includes(q) ||
      h.englishTranslation.toLowerCase().includes(q) ||
      h.narrator.includes(q) ||
      h.hadithNumber.includes(q) ||
      h.collectionNameUrdu.includes(q);

    return matchesCollection && matchesTopic && matchesQuery;
  });

  const handleCopy = (hadith: HadithItem) => {
    const text = `${hadith.collectionNameUrdu} - حدیث نمبر: ${hadith.hadithNumber}\n${hadith.bookName} · ${hadith.chapterName}\nراوی: ${hadith.narrator}\nدرجہ: ${hadith.grading}\n\nعربی متن:\n${hadith.arabicText}\n\nاردو ترجمہ:\n${hadith.urduTranslation}\n\nEnglish:\n${hadith.englishTranslation}`;
    navigator.clipboard.writeText(text);
    setCopiedId(hadith.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSpeak = (hadith: HadithItem) => {
    if (isSpeaking && currentlySpeakingId === hadith.id) {
      onStopSpeak();
      setCurrentlySpeakingId(null);
    } else {
      onSpeak(hadith.arabicText, "ar");
      setCurrentlySpeakingId(hadith.id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 text-left">
      {/* Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1 tracking-wider uppercase">
          <ScrollText className="w-4 h-4" />
          <span>Authentic Prophetic Hadith Library</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          کتبِ احادیثِ مبارکہ (صحاح ستہ)
        </h1>
        <p className="font-nastaliq text-xs text-purple-300">
          صحیح البخاری، صحیح مسلم، جامع الترمذی، سنن ابی داود، سنن النسائی اور سنن ابن ماجہ سے مصدقہ روایات، تخریج و درجات
        </p>
      </div>

      {/* Collection Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {collections.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCollection(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCollection === c.id
                ? "bg-amber-600/40 text-amber-200 border border-amber-500/50 shadow-sm"
                : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <span className="font-nastaliq text-xs mr-1">{c.nameUrdu}</span>
            <span className="text-[10px] opacity-75">({c.nameEn})</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="حدیث کا متن، راوی، نمبر یا موضوع تلاش کریں (e.g. النيات, اخلاق, علم, 1)..."
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#0e101d] border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
        />
      </div>

      {/* Results Count & Authenticity Seal */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-4 px-1">
        <span>مجموعی احادیث: <strong className="text-white font-mono">{filteredHadiths.length}</strong></span>
        <span className="flex items-center gap-1 text-emerald-400 font-nastaliq text-xs">
          <ShieldCheck className="w-4 h-4" /> مصدقہ اسناد و درجات
        </span>
      </div>

      {/* Hadith Cards */}
      <div className="space-y-5">
        {filteredHadiths.map((h) => {
          const isSpeakingCurrent = isSpeaking && currentlySpeakingId === h.id;

          return (
            <div
              key={h.id}
              className="p-5 sm:p-6 rounded-2xl bg-[#0d0f1b] border border-slate-800/90 hover:border-amber-500/30 transition-all shadow-md"
            >
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-600/30 font-nastaliq text-xs font-semibold text-amber-300">
                    {h.collectionNameUrdu}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-purple-300">
                    #{h.hadithNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/50 border border-emerald-600/30 text-[11px] text-emerald-300 font-medium">
                    {h.grading}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleSpeak(h)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      isSpeakingCurrent
                        ? "bg-rose-600 text-white animate-pulse"
                        : "bg-slate-800 text-slate-300 hover:text-white"
                    }`}
                    title="Listen to Hadith Recitation"
                  >
                    {isSpeakingCurrent ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{isSpeakingCurrent ? "بند کریں" : "سنیں"}</span>
                  </button>
                  <button
                    onClick={() => handleCopy(h)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                    title="Copy Hadith"
                  >
                    {copiedId === h.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === h.id ? "کاپی ہو گیا" : "کاپی"}</span>
                  </button>
                </div>
              </div>

              {/* Book & Chapter Details */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-3">
                <span className="font-semibold text-slate-300">{h.bookName}</span>
                <span>·</span>
                <span className="italic">{h.chapterName}</span>
                <span>·</span>
                <span className="font-nastaliq text-teal-400">راوی: {h.narrator}</span>
              </div>

              {/* Arabic Text */}
              <div className="p-4 rounded-xl bg-[#111425] border border-amber-600/10 text-right mb-4">
                <p className="font-amiri text-xl sm:text-2xl text-amber-100 leading-relaxed tracking-wide select-text">
                  {h.arabicText}
                </p>
              </div>

              {/* Urdu Translation */}
              <div className="text-right border-t border-slate-800/40 pt-3 mb-3">
                <div className="text-[11px] font-semibold text-purple-300 font-nastaliq mb-1">
                  اردو ترجمہ و مفہوم:
                </div>
                <p className="font-nastaliq text-base sm:text-lg text-slate-200 leading-relaxed select-text">
                  {h.urduTranslation}
                </p>
              </div>

              {/* English Translation */}
              <div className="text-left border-t border-slate-800/40 pt-2.5">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  English Translation:
                </div>
                <p className="text-xs text-slate-300 leading-relaxed select-text">
                  {h.englishTranslation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
