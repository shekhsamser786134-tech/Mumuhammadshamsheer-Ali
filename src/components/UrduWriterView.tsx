import React, { useState } from "react";
import { URDU_IDIOMS, URDU_GRAMMAR_GUIDES } from "../data/urduLiteratureData";
import { Feather, Sparkles, Copy, Check, Download, RotateCcw, BookOpen, Send, CheckCircle2 } from "lucide-react";

export const UrduWriterView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"editor" | "grammar" | "idioms">("editor");
  const [writerText, setWriterText] = useState(
    "مطالعہ کتب انسان کے فکری اور اخلاقی ارتقا میں بنیادی کردار ادا کرتا ہے۔ اچھی کتابیں نہ صرف علم و آگہی کے نئے دروازے کھولتی ہیں بلکہ دل و نگاہ کو بھی جلا بخشتی ہیں۔"
  );
  const [processingMode, setProcessingMode] = useState<string | null>(null);
  const [writerResult, setWriterResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchIdiom, setSearchIdiom] = useState("");

  const urduQuickChars = ["ٹ", "ڈ", "ڑ", "ں", "ے", "ھ", "ء", "ﷺ", "﷽", "ﷻ", "؛", "،", "؟"];

  const handleInsertChar = (ch: string) => {
    setWriterText((prev) => prev + ch);
  };

  const handlePolishText = async (mode: "improve" | "grammar" | "essay_outline" | "formal_letter") => {
    if (!writerText.trim()) return;
    setIsLoading(true);
    setProcessingMode(mode);
    setWriterResult(null);

    try {
      const res = await fetch("/api/urdu-writer/polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: writerText.trim(), mode }),
      });

      if (!res.ok) throw new Error("Failed to process text");

      const data = await res.json();
      setWriterResult(data.result);
    } catch (e) {
      console.error(e);
      setWriterResult("تحریر میں بہتری لانے کے دوران خرابی پیش آئی۔ برائے مہربانی دوبارہ کوشش کیجیے۔");
    } finally {
      setIsLoading(false);
      setProcessingMode(null);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([writerResult || writerText], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = "shaheena_urdu_writing.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const wordCount = writerText.trim() ? writerText.trim().split(/\s+/).length : 0;
  const charCount = writerText.length;

  const filteredIdioms = URDU_IDIOMS.filter(
    (i) => i.idiom.includes(searchIdiom) || i.meaning.includes(searchIdiom)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-1 tracking-wider uppercase">
            <Feather className="w-4 h-4" />
            <span>Urdu Literature & Composition Workshop</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            اردو ادب، انشا اور قلمی معاون
          </h1>
          <p className="font-nastaliq text-xs text-purple-300">
            مضمون نویسی، گرامر تصحیح، حسنِ بیان اور محاورات و ضرب الامثال کی جامع رہنمائی
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 self-start sm:self-auto font-nastaliq text-xs">
          <button
            onClick={() => setActiveTab("editor")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "editor" ? "bg-rose-600 text-white shadow-sm font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            تحریری ورکشاپ (Editor)
          </button>
          <button
            onClick={() => setActiveTab("grammar")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "grammar" ? "bg-rose-600 text-white shadow-sm font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            اصول و قواعد (Rules)
          </button>
          <button
            onClick={() => setActiveTab("idioms")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "idioms" ? "bg-rose-600 text-white shadow-sm font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            محاورات لغت (Idioms)
          </button>
        </div>
      </div>

      {activeTab === "editor" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Writing Area */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-[#0d0f1b] border border-slate-800">
              {/* Virtual Urdu Keys Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5 pb-3 mb-3 border-b border-slate-800">
                <span className="text-[10px] text-slate-500 font-nastaliq mr-1">فوری حروف:</span>
                {urduQuickChars.map((char) => (
                  <button
                    key={char}
                    onClick={() => handleInsertChar(char)}
                    className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/40 text-rose-300 font-nastaliq text-xs flex items-center justify-center transition-colors"
                  >
                    {char}
                  </button>
                ))}
              </div>

              {/* Editor Textarea */}
              <textarea
                value={writerText}
                onChange={(e) => setWriterText(e.target.value)}
                rows={10}
                placeholder="اپنی تحریر، مضمون، یا درخواست کا مسودہ یہاں لکھیں..."
                className="w-full p-4 text-base sm:text-lg font-nastaliq bg-slate-950/70 border border-slate-800/80 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-500/80 text-right leading-loose resize-none"
                dir="rtl"
              />

              {/* Footer Metrics & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60 text-xs">
                <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                  <span>الفاظ: <strong className="text-white">{wordCount}</strong></span>
                  <span>حروف: <strong className="text-white">{charCount}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWriterText("")}
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                    title="Reset"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleCopy(writerText)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "کاپی ہوا" : "کاپی"}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ڈاؤنلوڈ</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick AI Action Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handlePolishText("improve")}
                disabled={isLoading}
                className="p-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/40 text-purple-200 text-right font-nastaliq text-xs transition-all flex flex-col justify-between"
              >
                <Sparkles className="w-4 h-4 text-purple-400 mb-1" />
                <span>الفاظ و روانی بہتر بنائیں</span>
              </button>
              <button
                onClick={() => handlePolishText("grammar")}
                disabled={isLoading}
                className="p-3 rounded-xl bg-teal-950/40 hover:bg-teal-900/60 border border-teal-800/40 text-teal-200 text-right font-nastaliq text-xs transition-all flex flex-col justify-between"
              >
                <CheckCircle2 className="w-4 h-4 text-teal-400 mb-1" />
                <span>املا و گرامر چیک کریں</span>
              </button>
              <button
                onClick={() => handlePolishText("essay_outline")}
                disabled={isLoading}
                className="p-3 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/40 text-amber-200 text-right font-nastaliq text-xs transition-all flex flex-col justify-between"
              >
                <BookOpen className="w-4 h-4 text-amber-400 mb-1" />
                <span>مضمون کا خاکہ تیار کریں</span>
              </button>
              <button
                onClick={() => handlePolishText("formal_letter")}
                disabled={isLoading}
                className="p-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-200 text-right font-nastaliq text-xs transition-all flex flex-col justify-between"
              >
                <Feather className="w-4 h-4 text-rose-400 mb-1" />
                <span>رسمی درخواست یا خط</span>
              </button>
            </div>
          </div>

          {/* AI Result & Polish Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-[#0d0f1b] border border-slate-800 min-h-[380px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-bold text-white font-nastaliq">شاہینہ قلمی تجزیہ و تجاویز</span>
                  </div>
                  {isLoading && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-400">
                      <div className="w-3 h-3 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" />
                      <span className="font-nastaliq text-[11px]">جاری ہے...</span>
                    </div>
                  )}
                </div>

                {writerResult ? (
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 font-nastaliq text-sm sm:text-base text-slate-200 leading-loose whitespace-pre-line text-right max-h-[460px] overflow-y-auto select-text">
                    {writerResult}
                  </div>
                ) : (
                  <div className="py-20 text-center text-slate-500 font-nastaliq text-xs space-y-2">
                    <Feather className="w-8 h-8 mx-auto opacity-30 text-rose-400" />
                    <p>بائیں جانب متن درج کریں اور کسی بھی بٹن پر کلک کر کے فوری ادبی و نحوی تجاویز حاصل کریں۔</p>
                  </div>
                )}
              </div>

              {writerResult && (
                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    onClick={() => handleCopy(writerResult)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>تجاویز کاپی کریں</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grammar Guides Tab */}
      {activeTab === "grammar" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {URDU_GRAMMAR_GUIDES.map((guide, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#0d0f1b] border border-slate-800 text-right space-y-3">
              <h3 className="font-nastaliq text-lg font-bold text-rose-300">
                {guide.title}
              </h3>
              <p className="font-nastaliq text-xs sm:text-sm text-slate-300 leading-loose">
                {guide.urduDescription}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Idioms Dictionary Tab */}
      {activeTab === "idioms" && (
        <div className="space-y-4">
          <input
            type="text"
            value={searchIdiom}
            onChange={(e) => setSearchIdiom(e.target.value)}
            placeholder="محاورہ یا معنی تلاش کریں (مثلاً آب آب ہونا، شرمندہ)..."
            className="w-full p-3 text-xs bg-[#0e101d] border border-slate-800 rounded-xl text-white text-right font-nastaliq"
            dir="rtl"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredIdioms.map((idiom, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#0d0f1b] border border-slate-800 text-right space-y-2">
                <div className="font-nastaliq text-base font-bold text-amber-300">
                  {idiom.idiom}
                </div>
                <div className="font-nastaliq text-xs text-teal-300">
                  <strong>معنی:</strong> {idiom.meaning}
                </div>
                <div className="font-nastaliq text-xs text-slate-400">
                  <strong>مثالی جملہ:</strong> {idiom.usageExample}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
