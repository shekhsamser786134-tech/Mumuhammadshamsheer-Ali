import React, { useState } from "react";
import { GRAMMAR_TOPICS, GRAMMAR_QUIZZES } from "../data/grammarData";
import { GrammarTopic } from "../types";
import { Layers, Sparkles, HelpCircle, CheckCircle, XCircle, Search, ArrowRight, BookOpen, Send } from "lucide-react";

export const GrammarView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"lessons" | "analyzer" | "quiz">("lessons");
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic>(GRAMMAR_TOPICS[0]);
  const [categoryFilter, setCategoryFilter] = useState<"all" | "nahw" | "sarf" | "irab">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Analyzer State
  const [sentenceInput, setSentenceInput] = useState("إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzerError, setAnalyzerError] = useState<string | null>(null);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const filteredTopics = GRAMMAR_TOPICS.filter((t) => {
    const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.titleArabic.includes(q) ||
      t.titleUrdu.includes(q) ||
      t.titleEnglish.toLowerCase().includes(q) ||
      t.explanationUrdu.includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleAnalyzeSentence = async () => {
    if (!sentenceInput.trim()) return;
    setIsAnalyzing(true);
    setAnalyzerError(null);
    setAnalysisResult(null);

    try {
      const res = await fetch("/api/arabic-grammar/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence: sentenceInput.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to analyze sentence");
      }

      const data = await res.json();
      setAnalysisResult(data.analysis);
    } catch (err: any) {
      console.error(err);
      setAnalyzerError("تجزیہ کرنے میں دشواری پیش آئی۔ برائے مہربانی اپنا انٹرنیٹ کنکشن چیک کریں۔");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    if (showQuizResults) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    GRAMMAR_QUIZZES.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) score++;
    });
    return score;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1 tracking-wider uppercase">
            <Layers className="w-4 h-4" />
            <span>Arabic Language Sciences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            قواعد اللغۃ العربیۃ (نحو، صرف، اور اعراب)
          </h1>
          <p className="font-nastaliq text-xs text-purple-300">
            مبتدأ و خبر، صفت و موصوف، اسم فاعل و مفعول، ثلاثی مجرد کے ابواب اور اعراب کا جامع فہم
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("lessons")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "lessons" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            اسباق (Lessons)
          </button>
          <button
            onClick={() => setActiveTab("analyzer")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "analyzer" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>اعراب اینالائزر (AI Analyzer)</span>
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "quiz" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            کوئز (Quiz)
          </button>
        </div>
      </div>

      {activeTab === "lessons" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar / Topic List */}
          <div className="lg:col-span-5 space-y-3">
            {/* Category Filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {(["all", "nahw", "sarf", "irab"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? "bg-indigo-950/80 border border-indigo-500 text-indigo-300"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat === "all" ? "تمام موضوعات" : cat === "nahw" ? "نحو (Nahw)" : cat === "sarf" ? "صرف (Sarf)" : "اعراب (I'rab)"}
                </button>
              ))}
            </div>

            {/* Topics List */}
            <div className="space-y-2">
              {filteredTopics.map((topic) => {
                const isSelected = selectedTopic.id === topic.id;
                return (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#14162b] border-indigo-500/70 shadow-md shadow-indigo-950/30"
                        : "bg-[#0d0f1b] border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800">
                        {topic.category}
                      </span>
                      <span className="font-amiri text-base font-bold text-amber-200">
                        {topic.titleArabic}
                      </span>
                    </div>
                    <div className="font-nastaliq text-xs font-semibold text-slate-200 text-right">
                      {topic.titleUrdu}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {topic.titleEnglish}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Topic Content */}
          <div className="lg:col-span-7">
            {selectedTopic && (
              <div className="p-6 rounded-2xl bg-[#0d0f1b] border border-slate-800 space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                      علم الـ{selectedTopic.category}
                    </span>
                    <h2 className="font-amiri text-2xl font-bold text-amber-300">
                      {selectedTopic.titleArabic}
                    </h2>
                  </div>
                  <h3 className="font-nastaliq text-lg font-bold text-white text-right mb-1">
                    {selectedTopic.titleUrdu}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedTopic.titleEnglish}</p>
                </div>

                {/* Explanation in Urdu */}
                <div className="p-4 rounded-xl bg-[#121526] border border-indigo-900/30 text-right">
                  <div className="font-nastaliq text-xs font-semibold text-indigo-300 mb-1.5">
                    تفصیلی وضاحت:
                  </div>
                  <p className="font-nastaliq text-sm sm:text-base text-slate-200 leading-loose whitespace-pre-line select-text">
                    {selectedTopic.explanationUrdu}
                  </p>
                </div>

                {/* Rules List */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 font-nastaliq text-right">
                    اہم قواعد و اصول:
                  </h4>
                  <ul className="space-y-1.5 text-right font-nastaliq text-xs sm:text-sm text-slate-300">
                    {selectedTopic.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start justify-end gap-2">
                        <span>{rule}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Practical Examples */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-nastaliq text-right">
                    قرآنی و ادبی مثالیں اور نحوی تجزیہ:
                  </h4>
                  <div className="space-y-3">
                    {selectedTopic.examples.map((ex, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="text-right mb-2">
                          <p className="font-amiri text-lg text-amber-200">{ex.arabic}</p>
                        </div>
                        <div className="text-right mb-2">
                          <p className="font-nastaliq text-xs text-teal-300">ترجمہ: {ex.urduTranslation}</p>
                        </div>
                        <div className="p-2 rounded bg-black/40 border border-slate-800 text-[11px] text-slate-300 font-mono text-left">
                          {ex.breakdown}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Sentence Analyzer */}
      {activeTab === "analyzer" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 rounded-2xl bg-[#0d0f1b] border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>فوری عربی اعراب و نحو اینالائزر (Smart Parsing)</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              کوئی بھی عربی جملہ، قرآنی آیت یا حدیث لکھیں اور شاہینہ اس کا تفصیلی لفظ بہ لفظ اعراب، صرفی وزن اور اردو تجزیہ پیش کرے گی۔
            </p>

            <div className="space-y-3">
              <textarea
                value={sentenceInput}
                onChange={(e) => setSentenceInput(e.target.value)}
                rows={3}
                placeholder="عربی عبارت یہاں درج کریں (مثلاً: الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ)..."
                className="w-full p-4 text-base font-amiri bg-slate-950/80 border border-slate-800 rounded-xl text-amber-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-right leading-relaxed"
                dir="rtl"
              />

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSentenceInput("إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ")}
                    className="text-[11px] px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-amiri"
                  >
                    مثال ۱
                  </button>
                  <button
                    onClick={() => setSentenceInput("اللَّهُ نُورُ السَّمَاوَاتِ وَالأَرْضِ")}
                    className="text-[11px] px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-amiri"
                  >
                    مثال ۲
                  </button>
                  <button
                    onClick={() => setSentenceInput("خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ")}
                    className="text-[11px] px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-amiri"
                  >
                    مثال ۳
                  </button>
                </div>

                <button
                  onClick={handleAnalyzeSentence}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>تجزیہ کیا جا رہا ہے...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>اعراب و نحو کا تجزیہ کریں</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {analyzerError && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/50 text-rose-300 text-xs text-right font-nastaliq">
              {analyzerError}
            </div>
          )}

          {analysisResult && (
            <div className="p-6 rounded-2xl bg-[#0d0f1b] border border-indigo-900/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-teal-400">تحقیقی نحوی تجزیہ مکمل</span>
                <span className="font-nastaliq text-xs text-purple-300">شاہینہ اسکالر موڈ</span>
              </div>
              <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-line select-text text-right font-nastaliq">
                {analysisResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quiz View */}
      {activeTab === "quiz" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#0d0f1b] border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">عربی گرامر امتحانی کوئز</h2>
              <p className="font-nastaliq text-xs text-purple-300">اپنے علم کو جانچیں اور فوری نتائج ملاحظہ کریں</p>
            </div>
            {showQuizResults && (
              <div className="text-right">
                <div className="text-xs text-slate-400">حاصل کردہ نمبر:</div>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {calculateScore()} / {GRAMMAR_QUIZZES.length}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {GRAMMAR_QUIZZES.map((quiz, qIdx) => {
              const selectedOpt = quizAnswers[quiz.id];
              const isAnswered = selectedOpt !== undefined;

              return (
                <div key={quiz.id} className="p-5 rounded-2xl bg-[#0d0f1b] border border-slate-800 text-right">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-mono text-indigo-300 shrink-0">
                      {qIdx + 1}
                    </span>
                    <h3 className="font-nastaliq text-base font-bold text-white">
                      {quiz.questionUrdu}
                    </h3>
                  </div>

                  {quiz.arabicSnippet && (
                    <div className="mb-4 p-2.5 rounded-lg bg-black/40 border border-slate-800 text-center">
                      <span className="font-amiri text-lg text-amber-300">{quiz.arabicSnippet}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {quiz.options.map((option, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      const isCorrect = optIdx === quiz.correctIndex;

                      let btnStyle = "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700";
                      if (showQuizResults) {
                        if (isCorrect) {
                          btnStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold";
                        } else if (isOptionSelected && !isCorrect) {
                          btnStyle = "bg-rose-950/60 border-rose-500 text-rose-200 line-through";
                        }
                      } else if (isOptionSelected) {
                        btnStyle = "bg-indigo-950/80 border-indigo-500 text-indigo-200 font-semibold";
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectQuizOption(quiz.id, optIdx)}
                          className={`p-3 rounded-xl border text-right font-nastaliq text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          {showQuizResults && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {showQuizResults && isOptionSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                          <span className="flex-1">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {showQuizResults && (
                    <div className="p-3 rounded-xl bg-[#121526] border border-indigo-900/30 text-xs font-nastaliq text-slate-300 text-right">
                      <span className="text-indigo-400 font-semibold">وضاحت: </span>
                      {quiz.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            {showQuizResults ? (
              <button
                onClick={() => {
                  setQuizAnswers({});
                  setShowQuizResults(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                دوبارہ کوشش کریں (Retry Quiz)
              </button>
            ) : (
              <button
                onClick={() => setShowQuizResults(true)}
                disabled={Object.keys(quizAnswers).length === 0}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-colors"
              >
                نتیجہ دیکھیں (Submit Answers)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
