import React from "react";
import { AppTab } from "../types";
import { Sparkles, BookOpen, ScrollText, Layers, Feather, Smartphone, Settings2, HeartHandshake, Mic } from "lucide-react";

interface HeaderProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenHamdModal: () => void;
  onOpenSettings: () => void;
  onOpenApkGuide: () => void;
  onOpenJarvisVoice: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenHamdModal,
  onOpenSettings,
  onOpenApkGuide,
  onOpenJarvisVoice,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-900/20 bg-[#08090f]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
        
        {/* Left: Wordmark & Avatar */}
        <div
          className="flex items-center gap-2.5 shrink-0 cursor-pointer group"
          onClick={() => onSelectTab("home")}
          title="شاہینہ ہوم پیج"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 via-indigo-600 to-purple-600 shadow-[0_0_12px_rgba(45,212,191,0.4)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0d0f1a] rounded-full flex items-center justify-center">
              <span className="font-nastaliq text-lg sm:text-xl text-teal-300 font-bold -mt-0.5 select-none">
                ش
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
                SHAHEENA
              </span>
              <span className="font-nastaliq text-xs sm:text-sm text-purple-300 font-semibold">
                شاہینہ
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Quick Nav Tabs */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-300">
          <button
            onClick={() => onSelectTab("home")}
            className={`py-1 transition-colors ${
              currentTab === "home" ? "text-teal-300 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Home (ہوم)
          </button>
          <button
            onClick={() => onSelectTab("chat")}
            className={`py-1 transition-colors ${
              currentTab === "chat" ? "text-purple-300 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Chat (معاون)
          </button>
          <button
            onClick={() => onSelectTab("islamic")}
            className={`py-1 transition-colors ${
              currentTab === "islamic" || currentTab === "quran" || currentTab === "hadith"
                ? "text-teal-300 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Islamic Library (اسلامی کتب خانہ)
          </button>
          <button
            onClick={() => onSelectTab("device")}
            className={`py-1 transition-colors ${
              currentTab === "device" ? "text-emerald-300 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Android Device (اینڈرائیڈ ایکشنز)
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Top Jarvis Voice Button */}
          <button
            onClick={onOpenJarvisVoice}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 rounded-xl shadow-md shadow-purple-600/30 border border-purple-400/40 transition-all whitespace-nowrap active:scale-95 group"
            title="شاہینہ سے بات کریں — Live Voice Mode"
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute -inset-1 rounded-full bg-teal-400/50 animate-ping" />
              <Mic className="relative w-3.5 h-3.5 text-teal-200 group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-nastaliq text-xs sm:text-sm font-bold text-white">بات کریں</span>
          </button>

          {/* Sacred Hamd & Durood button */}
          <button
            onClick={onOpenHamdModal}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-200 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/30 rounded-xl transition-all whitespace-nowrap"
            title="افتتاحی حمد و ثنا اور درود و سلام"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-nastaliq text-xs hidden xs:inline sm:inline">حمد و درود</span>
          </button>

          {/* Android APK Guide button */}
          <button
            onClick={onOpenApkGuide}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-teal-300 bg-teal-950/40 hover:bg-teal-900/60 border border-teal-600/30 rounded-xl transition-all whitespace-nowrap"
            title="Install APK Guide"
          >
            <Smartphone className="w-3.5 h-3.5 text-teal-400" />
            <span>APK Guide</span>
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-slate-800/70 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
            title="Settings & Memories"
            aria-label="Settings"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
