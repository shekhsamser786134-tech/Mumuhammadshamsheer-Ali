import React from "react";
import { SupportedLanguage, UserProfileMemory } from "../types";
import { Settings2, Volume2, Globe, Brain, User, Trash2, X } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfileMemory;
  onUpdateProfile: (updated: UserProfileMemory) => void;
  onOpenMemoryModal: () => void;
  onClearChatHistory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  onOpenMemoryModal,
  onClearChatHistory,
}) => {
  if (!isOpen) return null;

  const languages: { code: SupportedLanguage; label: string; native: string }[] = [
    { code: "ur", label: "Urdu", native: "اردو" },
    { code: "en", label: "English", native: "English" },
    { code: "ar", label: "Arabic", native: "العربية" },
    { code: "hi", label: "Hindi", native: "हिन्दी" },
    { code: "ne", label: "Nepali", native: "नेपाली" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#0e101d] border border-purple-900/40 rounded-2xl p-6 shadow-2xl relative text-left my-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-700/40 text-purple-400">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Assistant Settings</h3>
            <p className="font-nastaliq text-xs text-purple-300 -mt-0.5">شاہینہ کی ترتیبات اور ترجیحات</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Creator Attribution Section */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-teal-950/30 border border-purple-800/30">
            <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-purple-300">
              <User className="w-4 h-4 text-purple-400" />
              <span>Creator & Developer</span>
            </div>
            <div className="text-base font-bold text-white mb-1">
              Shamsheer Aslam <span className="font-nastaliq text-purple-300 font-semibold">(شمشیر أسلم)</span>
            </div>
            <p className="text-xs text-slate-300 italic mb-2">
              "I was developed as an AI assistant project by Shamsheer Aslam."
            </p>
            <p className="font-nastaliq text-sm text-teal-300 -mt-1">
              "مجھے شمشیر أسلم نے تیار کیا ہے۔"
            </p>
          </div>

          {/* Language Selector */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
              <Globe className="w-4 h-4 text-teal-400" />
              <span>Assistant Primary Language / بنیادی زبان</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => onUpdateProfile({ ...userProfile, preferredLanguage: l.code })}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    userProfile.preferredLanguage === l.code
                      ? "bg-purple-600/30 border-purple-500 text-purple-200 font-semibold shadow-sm shadow-purple-900/30"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="text-xs font-medium">{l.label}</div>
                  <div className="text-[11px] opacity-80 mt-0.5">{l.native}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice & Speech Controls */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
              <Volume2 className="w-4 h-4 text-indigo-400" />
              <span>Speech & Voice Synthesis</span>
            </label>
            <div className="space-y-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Auto-speak assistant responses</span>
                <input
                  type="checkbox"
                  checked={userProfile.autoSpeak}
                  onChange={(e) => onUpdateProfile({ ...userProfile, autoSpeak: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-800 border-slate-700"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Speech Speed:</span>
                  <span className="text-purple-300 font-mono">{userProfile.speechSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.3"
                  step="0.1"
                  value={userProfile.speechSpeed}
                  onChange={(e) => onUpdateProfile({ ...userProfile, speechSpeed: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Long-Term Memory Button */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Long-Term Personal Memory</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {userProfile.notes?.length || 0} saved facts & preferences
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenMemoryModal();
              }}
              className="px-3 py-1.5 text-xs font-medium text-white bg-purple-600/80 hover:bg-purple-600 rounded-lg transition-colors"
            >
              Manage Memory
            </button>
          </div>

          {/* Clear History */}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400">Clear chat history</span>
            <button
              onClick={onClearChatHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-300 hover:text-white bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/40 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
