import React, { useState } from "react";
import { HAMD_AND_DUROOD } from "../data/hamdAndDurood";
import { Volume2, VolumeX, Copy, Check, X, Heart, Sparkles } from "lucide-react";

interface HamdDuroodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpeak: (text: string, lang: "ar" | "ur") => void;
  onStopSpeak: () => void;
  isSpeaking: boolean;
}

export const HamdDuroodModal: React.FC<HamdDuroodModalProps> = ({
  isOpen,
  onClose,
  onSpeak,
  onStopSpeak,
  isSpeaking,
}) => {
  const [activeTab, setActiveTab] = useState<"hamd" | "durood">("hamd");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const current = activeTab === "hamd" ? HAMD_AND_DUROOD.hamd : HAMD_AND_DUROOD.durood;

  const handleCopy = () => {
    const textToCopy = `${current.titleUrdu} (${current.titleArabic})\n\n${current.arabicContent}\n\nترجمہ:\n${current.urduTranslation}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSpeak = () => {
    if (isSpeaking) {
      onStopSpeak();
    } else {
      // Speak the Arabic content followed by translation
      onSpeak(current.arabicContent, "ar");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0d0f1c] border border-amber-600/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Tabs */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={() => {
              setActiveTab("hamd");
              if (isSpeaking) onStopSpeak();
            }}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "hamd"
                ? "bg-amber-600/30 text-amber-200 border border-amber-500/40 shadow-lg shadow-amber-900/20"
                : "text-slate-400 hover:text-slate-200 bg-slate-900/60"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-nastaliq text-base">حمد و ثنا</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("durood");
              if (isSpeaking) onStopSpeak();
            }}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "durood"
                ? "bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-lg shadow-purple-900/20"
                : "text-slate-400 hover:text-slate-200 bg-slate-900/60"
            }`}
          >
            <Heart className="w-4 h-4 text-purple-400" />
            <span className="font-nastaliq text-base">درود و سلام</span>
          </button>
        </div>

        {/* Title Lockup */}
        <div className="text-center mb-6">
          <h2 className="font-nastaliq text-3xl font-bold text-amber-300 mb-1">
            {current.titleUrdu}
          </h2>
          <p className="font-amiri text-lg text-amber-400/80 tracking-wide">
            {current.titleArabic}
          </p>
        </div>

        {/* Content Box */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto px-2 pr-3">
          {/* Arabic Text Card */}
          <div className="p-6 rounded-2xl bg-[#131627] border border-amber-500/20 text-center shadow-inner">
            <p className="font-amiri text-2xl sm:text-3xl text-amber-100 leading-relaxed tracking-wide select-text">
              {current.arabicContent}
            </p>
          </div>

          {/* Urdu Translation Card */}
          <div className="p-6 rounded-2xl bg-[#090b14] border border-purple-900/30 text-right">
            <div className="flex items-center justify-end gap-2 text-xs font-semibold text-purple-300 mb-2 font-nastaliq">
              <span>ترجمہ مفہوم:</span>
            </div>
            <p className="font-nastaliq text-lg sm:text-xl text-slate-200 leading-loose select-text whitespace-pre-line">
              {current.urduTranslation}
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSpeak}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSpeaking
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-900/40 animate-pulse"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>آواز بند کریں (Stop)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>تلاوت سنیں (Listen)</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "کاپی ہو گیا" : "کاپی کریں"}</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-nastaliq">
            پیشکش: شمشیر أسلم (شاہینہ)
          </div>
        </div>
      </div>
    </div>
  );
};
