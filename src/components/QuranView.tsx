import React, { useState, useEffect, useRef } from "react";
import { ALL_SURAHS, getSurahAyahs } from "../data/quranData";
import { SurahMeta, Ayah } from "../types";
import { BookOpen, Search, Play, Pause, ChevronLeft, ChevronRight, Volume2, Bookmark, Check, Sliders, ArrowLeft } from "lucide-react";

export const QuranView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState(false);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [showUrdu, setShowUrdu] = useState(true);
  const [showEnglish, setShowEnglish] = useState(false);
  const [arabicFontSize, setArabicFontSize] = useState<number>(28);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<number[]>([]);
  const [filterType, setFilterType] = useState<"all" | "Meccan" | "Medinan">("all");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Filter surahs
  const filteredSurahs = ALL_SURAHS.filter((s) => {
    const matchesFilter = filterType === "all" || s.revelationType === filterType;
    const matchesQuery =
      s.nameArabic.includes(searchQuery) ||
      s.nameUrdu.includes(searchQuery) ||
      s.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.englishMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.number) === searchQuery.trim();
    return matchesFilter && matchesQuery;
  });

  // Load ayahs when a surah is selected
  useEffect(() => {
    if (!selectedSurah) return;
    let isCancelled = false;

    async function load() {
      setIsLoadingAyahs(true);
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingAyah(null);
      }
      try {
        const data = await getSurahAyahs(selectedSurah!.number);
        if (!isCancelled) {
          setAyahs(data);
        }
      } catch (e) {
        console.error("Failed to load ayahs", e);
      } finally {
        if (!isCancelled) setIsLoadingAyahs(false);
      }
    }

    load();
    return () => {
      isCancelled = true;
    };
  }, [selectedSurah]);

  const handlePlayAyah = (ayahNumber: number, audioUrl?: string) => {
    if (!audioUrl) return;

    if (playingAyah === ayahNumber && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setPlayingAyah(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setPlayingAyah(ayahNumber);

    audio.onended = () => {
      // Auto-advance to next ayah if available
      const nextAyah = ayahs.find((a) => a.numberInSurah === ayahNumber + 1);
      if (nextAyah && nextAyah.audioUrl) {
        handlePlayAyah(nextAyah.numberInSurah, nextAyah.audioUrl);
      } else {
        setPlayingAyah(null);
      }
    };

    audio.onerror = () => {
      console.warn("Audio playback failed for Ayah", ayahNumber);
      setPlayingAyah(null);
    };

    audio.play().catch((err) => {
      console.warn("Audio play prevented:", err);
      setPlayingAyah(null);
    });
  };

  const toggleBookmark = (num: number) => {
    setBookmarkedAyahs((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const handleNextSurah = () => {
    if (!selectedSurah || selectedSurah.number >= 114) return;
    const next = ALL_SURAHS.find((s) => s.number === selectedSurah.number + 1);
    if (next) setSelectedSurah(next);
  };

  const handlePrevSurah = () => {
    if (!selectedSurah || selectedSurah.number <= 1) return;
    const prev = ALL_SURAHS.find((s) => s.number === selectedSurah.number - 1);
    if (prev) setSelectedSurah(prev);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 text-left">
      {!selectedSurah ? (
        // SURAH LISTING VIEW
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 mb-1 tracking-wider uppercase">
                <BookOpen className="w-4 h-4" />
                <span>Holy Qur'an Explorer</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                القرآن الكريم (تمام ۱۱۴ سورتیں)
              </h1>
              <p className="font-nastaliq text-xs text-purple-300">
                مصدقہ عربی متن، اردو ترجمہ (مولانا فتح محمد جالندھری) اور مشاری العفاسی کی خوبصورت تلاوت
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 self-start sm:self-auto">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterType === "all" ? "bg-purple-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                All (114)
              </button>
              <button
                onClick={() => setFilterType("Meccan")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterType === "Meccan" ? "bg-purple-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                مکی (Meccan)
              </button>
              <button
                onClick={() => setFilterType("Medinan")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterType === "Medinan" ? "bg-purple-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                مدنی (Medinan)
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="سورت کا نام، نمبر یا انگریزی تلاش کریں (e.g. الفاتحة, Yasin, 36, Mulk)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#0e101d] border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Surah Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSurahs.map((surah) => (
              <div
                key={surah.number}
                onClick={() => setSelectedSurah(surah)}
                className="p-4 rounded-xl bg-[#0d0f1b] hover:bg-[#121526] border border-slate-800/80 hover:border-purple-600/40 transition-all cursor-pointer flex items-center justify-between group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center font-mono text-xs font-bold text-purple-300 group-hover:scale-105 transition-transform">
                    {surah.number}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {surah.nameEnglish}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {surah.englishMeaning} · {surah.numberOfAyahs} verses
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-amiri text-lg font-bold text-amber-200">
                    {surah.nameArabic}
                  </div>
                  <div className="font-nastaliq text-[11px] text-teal-400">
                    {surah.nameUrdu} ({surah.revelationType === "Meccan" ? "مکی" : "مدنی"})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // SURAH AYAH-BY-AYAH READER VIEW
        <div>
          {/* Reader Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-[#0d0f1c] border border-slate-800">
            <button
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                setSelectedSurah(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Surah Catalog</span>
            </button>

            {/* Surah Navigator */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevSurah}
                disabled={selectedSurah.number <= 1}
                className="p-1.5 rounded-lg bg-slate-800 disabled:opacity-30 text-slate-300 hover:text-white"
                title="Previous Surah"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-center px-2">
                <span className="text-xs font-bold text-white">{selectedSurah.nameEnglish}</span>
                <span className="font-amiri text-sm text-amber-300 ml-2">({selectedSurah.nameArabic})</span>
              </div>
              <button
                onClick={handleNextSurah}
                disabled={selectedSurah.number >= 114}
                className="p-1.5 rounded-lg bg-slate-800 disabled:opacity-30 text-slate-300 hover:text-white"
                title="Next Surah"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Display Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUrdu(!showUrdu)}
                className={`px-2.5 py-1 text-xs rounded-lg border font-nastaliq ${
                  showUrdu ? "bg-teal-950/60 border-teal-500 text-teal-300" : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                اردو ترجمہ
              </button>
              <button
                onClick={() => setShowEnglish(!showEnglish)}
                className={`px-2.5 py-1 text-xs rounded-lg border ${
                  showEnglish ? "bg-purple-950/60 border-purple-500 text-purple-300" : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                English
              </button>

              {/* Font Sizer */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-0.5">
                <button
                  onClick={() => setArabicFontSize((prev) => Math.max(22, prev - 2))}
                  className="text-xs text-slate-400 hover:text-white px-1"
                >
                  A-
                </button>
                <span className="text-[10px] text-slate-500">{arabicFontSize}px</span>
                <button
                  onClick={() => setArabicFontSize((prev) => Math.min(42, prev + 2))}
                  className="text-xs text-slate-400 hover:text-white px-1"
                >
                  A+
                </button>
              </div>
            </div>
          </div>

          {/* Surah Header Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#13172e] to-[#0c0e1a] border border-purple-900/40 text-center mb-8 shadow-xl">
            <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-amber-200 mb-2">
              سُورَةُ {selectedSurah.nameArabic}
            </h2>
            <div className="flex items-center justify-center gap-3 text-xs text-purple-300 font-nastaliq">
              <span>{selectedSurah.nameUrdu}</span>
              <span>·</span>
              <span>{selectedSurah.revelationType === "Meccan" ? "مکی سورت" : "مدنی سورت"}</span>
              <span>·</span>
              <span>{selectedSurah.numberOfAyahs} آیات</span>
            </div>

            {/* Bismillah Header (Except Surah At-Tawbah 9) */}
            {selectedSurah.number !== 9 && (
              <div className="mt-4 pt-4 border-t border-purple-900/30">
                <p className="font-amiri text-xl sm:text-2xl text-amber-100/90 tracking-wide">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p className="font-nastaliq text-xs text-slate-400 mt-1">
                  شروع اللہ کا نام لے کر جو بڑا مہربان نہایت رحم والا ہے
                </p>
              </div>
            )}
          </div>

          {/* Ayahs Stream */}
          {isLoadingAyahs ? (
            <div className="py-20 text-center text-slate-400 space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto" />
              <p className="text-xs">Loading verified Qur'anic text & recitation...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ayahs.map((ayah) => {
                const isPlaying = playingAyah === ayah.numberInSurah;
                const isBookmarked = bookmarkedAyahs.includes(ayah.numberInSurah);

                return (
                  <div
                    key={ayah.numberInSurah}
                    className={`p-5 rounded-2xl border transition-all ${
                      isPlaying
                        ? "bg-[#14172f] border-teal-500/50 shadow-lg shadow-teal-950/20"
                        : "bg-[#0d0f1b] border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    {/* Top Row: Ayah Number & Audio Button */}
                    <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-xs font-semibold text-purple-300">
                          {ayah.numberInSurah}
                        </span>
                        {ayah.sajda && (
                          <span className="text-[10px] font-nastaliq px-2 py-0.5 rounded bg-amber-950/60 border border-amber-600/30 text-amber-300">
                            سجدہ تلاوت
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {ayah.audioUrl && (
                          <button
                            onClick={() => handlePlayAyah(ayah.numberInSurah, ayah.audioUrl)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                              isPlaying
                                ? "bg-teal-600 text-white shadow-md animate-pulse"
                                : "bg-slate-800 text-slate-300 hover:text-white"
                            }`}
                            title="Play Recitation"
                          >
                            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            <span>{isPlaying ? "تلاوت جاری ہے" : "تلاوت سنیں"}</span>
                          </button>
                        )}
                        <button
                          onClick={() => toggleBookmark(ayah.numberInSurah)}
                          className={`p-1.5 rounded-lg border ${
                            isBookmarked
                              ? "bg-amber-950/60 border-amber-500 text-amber-300"
                              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                          title="Bookmark Ayah"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Arabic Text */}
                    <div className="text-right mb-4">
                      <p
                        className="font-amiri text-amber-100 leading-loose tracking-wide select-text"
                        style={{ fontSize: `${arabicFontSize}px` }}
                      >
                        {ayah.arabicText} <span className="text-teal-400 font-mono text-base ml-1">۝{ayah.numberInSurah}</span>
                      </p>
                    </div>

                    {/* Urdu Translation */}
                    {showUrdu && ayah.urduTranslation && (
                      <div className="text-right border-t border-slate-800/40 pt-2.5 mb-2">
                        <p className="font-nastaliq text-base text-slate-200 leading-relaxed select-text">
                          {ayah.urduTranslation}
                        </p>
                      </div>
                    )}

                    {/* English Translation */}
                    {showEnglish && ayah.englishTranslation && (
                      <div className="text-left border-t border-slate-800/40 pt-2">
                        <p className="text-xs text-slate-400 leading-relaxed select-text">
                          {ayah.englishTranslation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
