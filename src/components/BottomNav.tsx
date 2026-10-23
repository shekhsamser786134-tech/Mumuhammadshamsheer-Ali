import React from "react";
import { AppTab } from "../types";
import { Home, MessageSquare, Mic, BookOpen, History } from "lucide-react";

interface BottomNavProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenVoice: () => void;
  isVoiceActive?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenVoice,
  isVoiceActive,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0c18]/95 backdrop-blur-xl border-t border-purple-900/30 pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-2 relative">
        
        {/* 1. HOME TAB (Screenshot: Active Home Icon) */}
        <button
          onClick={() => onSelectTab("home")}
          className={`flex flex-col items-center justify-center py-1 transition-all ${
            currentTab === "home"
              ? "text-teal-400 font-semibold scale-105"
              : "text-slate-400 hover:text-slate-200"
          }`}
          title="Home - شاہینہ ہوم"
        >
          <div className="relative">
            <Home className={`w-5 h-5 ${currentTab === "home" ? "text-teal-400 drop-shadow-[0_0_8px_#2dd4bf]" : ""}`} />
            {currentTab === "home" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-teal-400" />
            )}
          </div>
          <span className="text-[11px] tracking-wide mt-1 font-sans">Home</span>
        </button>

        {/* 2. CHAT TAB */}
        <button
          onClick={() => onSelectTab("chat")}
          className={`flex flex-col items-center justify-center py-1 transition-all ${
            currentTab === "chat"
              ? "text-purple-300 font-semibold scale-105"
              : "text-slate-400 hover:text-slate-200"
          }`}
          title="Chat - تحریری گفتگو"
        >
          <div className="relative">
            <MessageSquare className={`w-5 h-5 ${currentTab === "chat" ? "text-purple-400 drop-shadow-[0_0_8px_#c084fc]" : ""}`} />
            {currentTab === "chat" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400" />
            )}
          </div>
          <span className="text-[11px] tracking-wide mt-1 font-sans">Chat</span>
        </button>

        {/* 3. CENTER RAISED VOICE BUTTON (Screenshot: Elevated Purple Mic Circle) */}
        <div className="flex flex-col items-center justify-center -mt-6">
          <button
            onClick={onOpenVoice}
            className={`w-14 h-14 rounded-full p-[2px] shadow-[0_0_24px_rgba(168,85,247,0.6)] transition-all duration-300 active:scale-95 group ${
              isVoiceActive
                ? "bg-gradient-to-tr from-rose-500 via-purple-600 to-teal-400 animate-pulse scale-110"
                : "bg-gradient-to-tr from-purple-600 via-indigo-600 to-teal-400 hover:scale-105"
            }`}
            title="Start Voice Conversation - بول کر بات کریں"
          >
            <div className="w-full h-full rounded-full bg-[#121329] flex items-center justify-center group-hover:bg-[#1a1b38] transition-colors">
              <Mic className="w-6 h-6 text-purple-200 group-hover:text-teal-300 group-hover:scale-110 transition-transform" />
            </div>
          </button>
          <span className="text-[10px] font-sans font-bold text-purple-300 mt-1 uppercase tracking-wider">
            Voice
          </span>
        </div>

        {/* 4. ISLAMIC TAB (Screenshot: Islamic Open Book) */}
        <button
          onClick={() => onSelectTab("islamic")}
          className={`flex flex-col items-center justify-center py-1 transition-all ${
            currentTab === "islamic" || currentTab === "quran" || currentTab === "hadith"
              ? "text-teal-300 font-semibold scale-105"
              : "text-slate-400 hover:text-slate-200"
          }`}
          title="Islamic Learning - قرآن و حدیث"
        >
          <div className="relative">
            <BookOpen
              className={`w-5 h-5 ${
                currentTab === "islamic" || currentTab === "quran" || currentTab === "hadith"
                  ? "text-teal-400 drop-shadow-[0_0_8px_#2dd4bf]"
                  : ""
              }`}
            />
            {(currentTab === "islamic" || currentTab === "quran" || currentTab === "hadith") && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-teal-400" />
            )}
          </div>
          <span className="text-[11px] tracking-wide mt-1 font-sans">Islamic</span>
        </button>

        {/* 5. HISTORY TAB (Screenshot: History Clock) */}
        <button
          onClick={() => onSelectTab("history")}
          className={`flex flex-col items-center justify-center py-1 transition-all ${
            currentTab === "history" || currentTab === "device" || currentTab === "settings"
              ? "text-purple-300 font-semibold scale-105"
              : "text-slate-400 hover:text-slate-200"
          }`}
          title="History & Notes - تاریخچہ اور یادداشت"
        >
          <div className="relative">
            <History
              className={`w-5 h-5 ${
                currentTab === "history" || currentTab === "device" || currentTab === "settings"
                  ? "text-purple-400 drop-shadow-[0_0_8px_#c084fc]"
                  : ""
              }`}
            />
            {(currentTab === "history" || currentTab === "device" || currentTab === "settings") && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400" />
            )}
          </div>
          <span className="text-[11px] tracking-wide mt-1 font-sans">History</span>
        </button>

      </div>
    </nav>
  );
};
