/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * SHAHEENA - Personal AI Companion & Islamic Learning Assistant
 * Created by Shamsheer Aslam (شمشیر أسلم)
 */

import React, { useState, useEffect } from "react";
import { AppTab, UserProfileMemory, SupportedLanguage, ConversationSession } from "./types";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { HomeVoiceCompanion } from "./components/HomeVoiceCompanion";
import { AssistantView } from "./components/AssistantView";
import { IslamicHubView } from "./components/IslamicHubView";
import { HistoryMemoryView } from "./components/HistoryMemoryView";
import { DeviceControlView } from "./components/DeviceControlView";
import { HamdDuroodModal } from "./components/HamdDuroodModal";
import { SettingsModal } from "./components/SettingsModal";
import { MemoryModal } from "./components/MemoryModal";
import { ApkGuideModal } from "./components/ApkGuideModal";
import { JarvisVoiceModal } from "./components/JarvisVoiceModal";
import { useSpeechSynthesis } from "./hooks/useSpeechSynthesis";
import { WifiOff, Mic } from "lucide-react";

const DEFAULT_PROFILE: UserProfileMemory = {
  name: "",
  preferredLanguage: "ur",
  speechSpeed: 1.12,
  autoSpeak: true,
  notes: [
    "User is studying Arabic Nahw & Sarf",
    "Prefers verified Quran and Hadith citations",
    "Primary language: Urdu (اردو)",
  ],
};

export default function App() {
  // Default to 'home' matching the user's uploaded screenshot!
  const [currentTab, setCurrentTab] = useState<AppTab>("home");
  const [userProfile, setUserProfile] = useState<UserProfileMemory>(() => {
    try {
      const saved = localStorage.getItem("shaheena_user_profile");
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [hamdModalOpen, setHamdModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [memoryModalOpen, setMemoryModalOpen] = useState(false);
  const [apkGuideModalOpen, setApkGuideModalOpen] = useState(false);
  const [jarvisVoiceOpen, setJarvisVoiceOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  const { isSpeaking, speak, stop: stopSpeaking } = useSpeechSynthesis();

  // Save profile to local storage on update
  const handleUpdateProfile = (updated: UserProfileMemory) => {
    setUserProfile(updated);
    try {
      localStorage.setItem("shaheena_user_profile", JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to persist profile to localStorage", e);
    }
  };

  const handleUpdateLanguage = (lang: SupportedLanguage) => {
    const updated = { ...userProfile, preferredLanguage: lang };
    handleUpdateProfile(updated);
  };

  // Online / offline event listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to reset your chat history and memory?")) {
      handleUpdateProfile(DEFAULT_PROFILE);
      localStorage.removeItem("shaheena_chat_messages");
      localStorage.removeItem("shaheena_chat_sessions");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#08090f] text-slate-100 flex flex-col font-sans selection:bg-purple-600/30 selection:text-purple-200">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          stopSpeaking();
          setCurrentTab(tab);
        }}
        onOpenHamdModal={() => setHamdModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenApkGuide={() => setApkGuideModalOpen(true)}
        onOpenJarvisVoice={() => setJarvisVoiceOpen(true)}
      />

      {/* Offline Status Toast */}
      {!isOnline && (
        <div className="fixed top-18 right-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/90 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white shadow-xl animate-bounce">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>آف لائن موڈ — کیش شدہ قرآنی و احادیث کا ذخیرہ دستیاب ہے</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. HOME SCREEN (Matching the Screenshot: Holographic Jarvis Orb, Nastaliq Title, Calligraphy) */}
        {currentTab === "home" && (
          <HomeVoiceCompanion
            userProfile={userProfile}
            onUpdateLanguage={handleUpdateLanguage}
            onOpenChatTab={() => setCurrentTab("chat")}
            onOpenIslamicTab={() => setCurrentTab("islamic")}
            onOpenHamdModal={() => setHamdModalOpen(true)}
            isOnline={isOnline}
          />
        )}

        {/* 2. CHAT ASSISTANT SCREEN */}
        {currentTab === "chat" && (
          <AssistantView
            userProfile={userProfile}
            onOpenHamdModal={() => setHamdModalOpen(true)}
            onOpenMemoryModal={() => setMemoryModalOpen(true)}
            onOpenDeviceTab={() => setCurrentTab("device")}
            onOpenJarvisVoice={() => setJarvisVoiceOpen(true)}
            isOnline={isOnline}
          />
        )}

        {/* 3. ISLAMIC LIBRARY HUB (Qur'an, Hadith, Hamd, Grammar, Writing) */}
        {(currentTab === "islamic" ||
          currentTab === "quran" ||
          currentTab === "hadith" ||
          currentTab === "grammar" ||
          currentTab === "urdu") && (
          <IslamicHubView
            onSpeak={speak}
            onStopSpeak={stopSpeaking}
            isSpeaking={isSpeaking}
            onOpenHamdModal={() => setHamdModalOpen(true)}
          />
        )}

        {/* 4. HISTORY, MEMORIES & NOTES */}
        {currentTab === "history" && (
          <HistoryMemoryView
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onOpenApkGuide={() => setApkGuideModalOpen(true)}
            onOpenDeviceTab={() => setCurrentTab("device")}
          />
        )}

        {/* 5. NATIVE ANDROID DEVICE ACTIONS */}
        {currentTab === "device" && <DeviceControlView />}
      </main>

      {/* Mobile Bottom Tab Bar (5 tabs matching the screenshot) */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          stopSpeaking();
          setCurrentTab(tab);
        }}
        onOpenVoice={() => setJarvisVoiceOpen(true)}
        isVoiceActive={jarvisVoiceOpen}
      />

      {/* JARVIS Live Voice Hands-Free Modal */}
      <JarvisVoiceModal
        isOpen={jarvisVoiceOpen}
        onClose={() => setJarvisVoiceOpen(false)}
        userProfile={userProfile}
      />

      {/* Sacred Hamd-o-Sana and Durood-o-Salam Modal */}
      <HamdDuroodModal
        isOpen={hamdModalOpen}
        onClose={() => setHamdModalOpen(false)}
        onSpeak={speak}
        onStopSpeak={stopSpeaking}
        isSpeaking={isSpeaking}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        onOpenMemoryModal={() => setMemoryModalOpen(true)}
        onClearChatHistory={handleClearHistory}
      />

      {/* Long-Term Memory Modal */}
      <MemoryModal
        isOpen={memoryModalOpen}
        onClose={() => setMemoryModalOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Android APK Installation Guide */}
      <ApkGuideModal
        isOpen={apkGuideModalOpen}
        onClose={() => setApkGuideModalOpen(false)}
      />
    </div>
  );
}
