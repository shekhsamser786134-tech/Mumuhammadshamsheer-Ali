import React, { useState, useEffect, useRef, useCallback } from "react";
import { UserProfileMemory, SupportedLanguage } from "../types";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";
import { playJarvisWakeSound, playJarvisSleepSound, playProcessingTone } from "../utils/audioEffects";
import { ANDROID_APPS, detectAppLaunchCommand } from "../utils/appIntents";
import { Mic, MicOff, Volume2, VolumeX, Sparkles, X, RotateCcw, Radio, Sliders, ChevronDown, Youtube, MessageCircle, Phone, Camera, AlarmClock, MapPin, Calculator, Music } from "lucide-react";

interface JarvisVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfileMemory;
}

export const JarvisVoiceModal: React.FC<JarvisVoiceModalProps> = ({
  isOpen,
  onClose,
  userProfile,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    userProfile.preferredLanguage || "ur"
  );
  const [handsFreeMode, setHandsFreeMode] = useState(true);
  const [liveState, setLiveState] = useState<"idle" | "listening" | "processing" | "speaking">("idle");
  const [userTranscriptDisplay, setUserTranscriptDisplay] = useState<string>("");
  const [assistantReplyDisplay, setAssistantReplyDisplay] = useState<string>("");
  const [conversationLog, setConversationLog] = useState<{ role: "user" | "assistant"; text: string }[]>([]);

  const { isSpeaking, speak, stop: stopSpeaking } = useSpeechSynthesis();
  const {
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition(selectedLanguage);

  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasSpokenRef = useRef(false);

  // Trigger wake sound when opening
  useEffect(() => {
    if (isOpen) {
      playJarvisWakeSound();
      setLiveState("idle");
      // Auto-start listening after brief delay if hands-free is enabled
      const timer = setTimeout(() => {
        if (handsFreeMode) {
          startListening();
          setLiveState("listening");
        }
      }, 600);
      return () => clearTimeout(timer);
    } else {
      stopSpeaking();
      stopListening();
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    }
  }, [isOpen]);

  // Handle incoming live speech transcript
  useEffect(() => {
    const activeText = transcript || interimTranscript;
    if (activeText) {
      setUserTranscriptDisplay(activeText);
      hasSpokenRef.current = true;
      // Reset previous silence timer
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

      // In hands-free mode, if user pauses speaking for 520ms, auto-send and process immediately!
      if (handsFreeMode && isListening && transcript) {
        silenceTimeoutRef.current = setTimeout(() => {
          handleVoiceSubmit(transcript);
        }, 520);
      }
    }
  }, [transcript, interimTranscript, isListening, handsFreeMode]);

  // Handle voice submission to SHAHEENA backend
  const handleVoiceSubmit = useCallback(
    async (spokenText: string) => {
      if (!spokenText.trim()) return;

      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      stopListening();
      resetTranscript();
      playProcessingTone();
      setLiveState("processing");
      setUserTranscriptDisplay(spokenText.trim());

      // 1. Check if the voice input is a Mobile App Launch / Media Play Command!
      const appCommand = detectAppLaunchCommand(spokenText.trim());
      if (appCommand.detected && appCommand.appKey && ANDROID_APPS[appCommand.appKey]) {
        const reply = appCommand.feedbackUrdu || `Opening ${ANDROID_APPS[appCommand.appKey].name}...`;
        setAssistantReplyDisplay(reply);
        setConversationLog((prev) => [
          ...prev,
          { role: "user", text: spokenText.trim() },
          { role: "assistant", text: reply },
        ]);
        setLiveState("speaking");

        // Speak confirmation
        speak(reply, selectedLanguage, 1.15, () => {
          // Launch the app
          ANDROID_APPS[appCommand.appKey!].launch(appCommand.query);

          if (handsFreeMode && isOpen) {
            setLiveState("listening");
            startListening();
          } else {
            setLiveState("idle");
          }
        });
        return;
      }

      setConversationLog((prev) => [...prev, { role: "user", text: spokenText.trim() }]);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              ...conversationLog.map((c) => ({
                role: c.role,
                content: c.text,
              })),
              { role: "user", content: spokenText.trim() },
            ],
            userProfile: {
              ...userProfile,
              preferredLanguage: selectedLanguage,
            },
            webSearchEnabled: false,
            voiceMode: true,
          }),
        });

        if (!response.ok) throw new Error("Server error");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let fullReply = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === "chunk" && data.text) {
                  fullReply += data.text;
                  setAssistantReplyDisplay(fullReply);
                } else if (data.type === "done") {
                  if (data.fullText) fullReply = data.fullText;
                }
              } catch (e) {
                // Ignore partial JSON
              }
            }
          }
        }

        if (fullReply) {
          setConversationLog((prev) => [...prev, { role: "assistant", text: fullReply }]);
          setLiveState("speaking");

          // Jarvis Voice Playback Aloud with responsive cadence (1.15x)
          const voiceSpeed = (userProfile.speechSpeed && userProfile.speechSpeed > 1) ? userProfile.speechSpeed : 1.12;
          speak(
            fullReply,
            selectedLanguage,
            voiceSpeed,
            () => {
              // ON END: Automatically resume listening for user's turn in Jarvis hands-free mode!
              if (handsFreeMode && isOpen) {
                setLiveState("listening");
                startListening();
              } else {
                setLiveState("idle");
              }
            }
          );
        }
      } catch (err) {
        console.error("Jarvis voice error:", err);
        const fallback = "معذرت، آواز پروسیس کرنے میں رکاوٹ آئی۔ برائے مہربانی دوبارہ بولیں۔";
        setAssistantReplyDisplay(fallback);
        setLiveState("speaking");
        speak(fallback, selectedLanguage, 1.1, () => {
          if (handsFreeMode && isOpen) {
            setLiveState("listening");
            startListening();
          } else {
            setLiveState("idle");
          }
        });
      }
    },
    [conversationLog, selectedLanguage, userProfile, handsFreeMode, isOpen, speak, startListening, stopListening, resetTranscript]
  );

  // Manual interrupt (barge-in)
  const handleInterrupt = () => {
    stopSpeaking();
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    resetTranscript();
    startListening();
    setLiveState("listening");
  };

  const handleManualMicToggle = () => {
    if (isListening) {
      stopListening();
      setLiveState("idle");
    } else {
      stopSpeaking();
      resetTranscript();
      startListening();
      setLiveState("listening");
    }
  };

  const handleClose = () => {
    playJarvisSleepSound();
    stopSpeaking();
    stopListening();
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    onClose();
  };

  const triggerQuickApp = (appKey: string, query?: string, customSpeech?: string) => {
    stopSpeaking();
    stopListening();
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

    const app = ANDROID_APPS[appKey];
    if (!app) return;

    const feedback = customSpeech || `شاہینہ: ${app.nameUrdu} (${app.name}) کھولا جا رہا ہے...`;
    setAssistantReplyDisplay(feedback);
    setLiveState("speaking");

    speak(feedback, selectedLanguage, 1.15, () => {
      app.launch(query);
      if (handsFreeMode && isOpen) {
        setLiveState("listening");
        startListening();
      } else {
        setLiveState("idle");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 overflow-hidden select-none">
      {/* Sci-Fi Background Hexagonal & Radial Glow Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-950/30 via-[#0a0c18] to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Main HUD Window */}
      <div className="relative w-full max-w-2xl h-[92vh] max-h-[780px] flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-purple-800/40 bg-[#0a0c16]/90 shadow-[0_0_80px_rgba(139,92,246,0.15)] text-center">
        
        {/* Top Sci-Fi Header */}
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-600/40 flex items-center justify-center text-purple-300">
              <Sparkles className="w-4 h-4 text-teal-400 animate-spin" style={{ animationDuration: "8s" }} />
            </div>
            <div className="text-left">
              <div className="text-xs font-mono font-bold tracking-widest text-teal-300 uppercase flex items-center gap-2">
                <span>SHAHEENA · JARVIS CORE</span>
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              </div>
              <div className="font-nastaliq text-xs text-purple-300">
                براہِ راست گفتگو و صوتی معاونت (Jarvis Mode)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
              className="bg-slate-900 border border-slate-700 text-purple-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="ur">اردو (Urdu)</option>
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ar">العربية (Arabic)</option>
              <option value="ne">नेपाली (Nepali)</option>
            </select>

            {/* Exit button */}
            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              title="Close Voice Mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Central Futuristic Arc Reactor / AI Voice Orb */}
        <div className="my-auto flex flex-col items-center justify-center py-6">
          <div
            onClick={liveState === "speaking" ? handleInterrupt : handleManualMicToggle}
            className="relative cursor-pointer group"
            title={liveState === "speaking" ? "Tap to interrupt SHAHEENA" : "Tap to toggle voice"}
          >
            {/* Outer Rotating Waveform Rings */}
            <div
              className={`absolute -inset-8 rounded-full border border-dashed transition-all duration-700 ${
                liveState === "listening"
                  ? "border-teal-400/60 animate-spin scale-110"
                  : liveState === "speaking"
                  ? "border-amber-400/60 animate-spin scale-115"
                  : liveState === "processing"
                  ? "border-purple-400/60 animate-pulse scale-105"
                  : "border-slate-800"
              }`}
              style={{ animationDuration: "12s" }}
            />

            <div
              className={`absolute -inset-4 rounded-full border transition-all duration-500 ${
                liveState === "listening"
                  ? "border-teal-500/80 shadow-[0_0_40px_rgba(45,212,191,0.4)] animate-ping"
                  : liveState === "speaking"
                  ? "border-amber-500/80 shadow-[0_0_50px_rgba(245,158,11,0.5)] scale-105"
                  : "border-purple-800/40"
              }`}
            />

            {/* Glowing Core Sphere */}
            <div
              className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full p-[2px] transition-all duration-500 shadow-2xl flex items-center justify-center ${
                liveState === "listening"
                  ? "bg-gradient-to-tr from-teal-500 via-cyan-400 to-indigo-500 shadow-teal-500/30 scale-105"
                  : liveState === "speaking"
                  ? "bg-gradient-to-tr from-amber-500 via-orange-400 to-purple-600 shadow-amber-500/40 scale-105"
                  : liveState === "processing"
                  ? "bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-600 animate-pulse"
                  : "bg-gradient-to-tr from-purple-900 via-slate-800 to-teal-900"
              }`}
            >
              <div className="w-full h-full rounded-full bg-[#080a14] flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Voice Frequency Simulator Bars inside Core */}
                <div className="flex items-center gap-1.5 h-12 mb-1">
                  {[40, 75, 100, 60, 90, 45, 80].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-150 ${
                        liveState === "listening"
                          ? "bg-teal-400 animate-pulse"
                          : liveState === "speaking"
                          ? "bg-amber-400 animate-bounce"
                          : liveState === "processing"
                          ? "bg-purple-400 animate-pulse"
                          : "bg-slate-700 h-2"
                      }`}
                      style={{
                        height:
                          liveState === "listening" || liveState === "speaking"
                            ? `${Math.max(8, (h * (i % 2 === 0 ? 1 : 0.8)))}%`
                            : "6px",
                        animationDelay: `${i * 100}ms`,
                      }}
                    />
                  ))}
                </div>

                <span className="font-nastaliq text-2xl font-bold text-white tracking-wider select-none">
                  شاہینہ
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase mt-0.5 text-slate-400">
                  {liveState === "listening"
                    ? "LISTENING..."
                    : liveState === "processing"
                    ? "THINKING..."
                    : liveState === "speaking"
                    ? "SPEAKING ALOUD"
                    : "STANDBY"}
                </span>
              </div>
            </div>
          </div>

          {/* Current State Text Callout */}
          <div className="mt-6 text-center">
            {liveState === "listening" && (
              <div className="text-xs font-semibold text-teal-300 font-nastaliq animate-pulse">
                آپ بولیں، شاہینہ سن رہی ہے... (Hands-Free Active)
              </div>
            )}
            {liveState === "processing" && (
              <div className="text-xs font-semibold text-purple-300 font-nastaliq">
                شاہینہ جواب کا تجزیہ کر رہی ہے...
              </div>
            )}
            {liveState === "speaking" && (
              <div className="text-xs font-semibold text-amber-300 font-nastaliq flex items-center justify-center gap-2">
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>شاہینہ آواز سے جواب دے رہی ہے (بولنے کے بعد خود سننا شروع کرے گی)</span>
              </div>
            )}
            {liveState === "idle" && (
              <div className="text-xs text-slate-400 font-nastaliq">
                گفتگو شروع کرنے کے لیے اوپر اورب (Orb) کو چھوئیں یا بولنا شروع کریں
              </div>
            )}
          </div>
        </div>

        {/* Live HUD Speech Cards */}
        <div className="space-y-3 mb-4">
          {/* User Spoken Input Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-right min-h-[52px] flex items-center justify-between gap-4">
            <span className="text-[11px] font-mono uppercase text-teal-400 px-2 py-0.5 rounded bg-teal-950/60 border border-teal-800/40 shrink-0">
              YOU (آپ)
            </span>
            <p className="font-nastaliq text-sm sm:text-base text-slate-200 truncate flex-1 select-text">
              {userTranscriptDisplay || "بولیں: مثال کے طور پر 'السلام علیکم شاہینہ، آج کا کیا پروگرام ہے؟'"}
            </p>
          </div>

          {/* Assistant Spoken Reply Banner */}
          <div className="p-3.5 rounded-2xl bg-[#121428] border border-purple-900/40 text-right min-h-[64px] flex items-center justify-between gap-4">
            <span className="text-[11px] font-mono uppercase text-purple-300 px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40 shrink-0">
              SHAHEENA
            </span>
            <p className="font-nastaliq text-sm sm:text-base text-purple-100 leading-relaxed max-h-24 overflow-y-auto flex-1 select-text">
              {assistantReplyDisplay || "شاہینہ کا صوتی جواب یہاں لکھا ہوا بھی آئے گا اور خود بخود سنائی دے گا۔"}
            </p>
          </div>
        </div>

        {/* Quick Voice App Launcher & Media Player Shortcuts */}
        <div className="mb-3 px-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-nastaliq mb-1.5 px-1">
            <span className="text-teal-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1">
              <span>⚡ QUICK APP LAUNCHER</span>
            </span>
            <span>کہیں: "یوٹیوب پر تلاوت چلاؤ" یا نیچے ٹیپ کریں</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => triggerQuickApp("youtube", "Surah Ar-Rahman Beautiful Tilawat", "شاہینہ: یوٹیوب پر تلاوت چلائی جا رہی ہے...")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-700/50 text-red-200 shrink-0 transition-transform active:scale-95"
              title="Play Tilawat / Videos on YouTube"
            >
              <Youtube className="w-3.5 h-3.5 text-red-400" />
              <span>یوٹیوب (تلاوت)</span>
            </button>

            <button
              onClick={() => triggerQuickApp("whatsapp", "", "شاہینہ: واٹس ایپ کھولا جا رہا ہے...")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/50 text-emerald-200 shrink-0 transition-transform active:scale-95"
              title="Open WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>واٹس ایپ</span>
            </button>

            <button
              onClick={() => triggerQuickApp("camera", "", "شاہینہ: کیمرہ کھولا جا رہا ہے...")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/50 text-purple-200 shrink-0 transition-transform active:scale-95"
              title="Open Camera"
            >
              <Camera className="w-3.5 h-3.5 text-purple-400" />
              <span>کیمرہ</span>
            </button>

            <button
              onClick={() => triggerQuickApp("phone", "", "شاہینہ: فون ڈائلر کھولا جا رہا ہے...")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 border border-blue-700/50 text-blue-200 shrink-0 transition-transform active:scale-95"
              title="Open Phone Dialer"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>فون ڈائلر</span>
            </button>

            <button
              onClick={() => triggerQuickApp("alarm", "", "شاہینہ: الارم اور گھڑی کھولی جا رہی ہے...")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700/50 text-amber-200 shrink-0 transition-transform active:scale-95"
              title="Open Clock / Alarm"
            >
              <AlarmClock className="w-3.5 h-3.5 text-amber-400" />
              <span>الارم</span>
            </button>

            <button
              onClick={() => triggerQuickApp("maps", "Mosque near me", "شاہینہ: قریبی مسجد کے لیے گوگل میپس کھولا جا رہا ہے...")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-teal-950/60 hover:bg-teal-900/80 border border-teal-700/50 text-teal-200 shrink-0 transition-transform active:scale-95"
              title="Google Maps / Mosque finder"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>قریبی مسجد</span>
            </button>

            <button
              onClick={() => triggerQuickApp("music", "", "شاہینہ: میڈیا پلیئر شروع کیا جا رہا ہے...")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/50 text-indigo-200 shrink-0 transition-transform active:scale-95"
              title="Open Music Player"
            >
              <Music className="w-3.5 h-3.5 text-indigo-400" />
              <span>میڈیا پلیئر</span>
            </button>
          </div>
        </div>

        {/* Bottom Sci-Fi Controls HUD */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-purple-900/30">
          {/* Hands-Free Toggle Button */}
          <button
            onClick={() => setHandsFreeMode(!handsFreeMode)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              handsFreeMode
                ? "bg-teal-950/80 border border-teal-500/60 text-teal-200 shadow-sm"
                : "bg-slate-900 border border-slate-800 text-slate-400"
            }`}
            title="Auto Hands-Free Turn Taking"
          >
            <Radio className={`w-3.5 h-3.5 ${handsFreeMode ? "text-teal-400 animate-pulse" : ""}`} />
            <span>ہینڈز فری مسلسل گفتگو (Jarvis Mode): </span>
            <strong className="font-mono">{handsFreeMode ? "ON" : "OFF"}</strong>
          </button>

          {/* Interrupt Button (When SHAHEENA is speaking) */}
          {liveState === "speaking" ? (
            <button
              onClick={handleInterrupt}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-900/50 animate-pulse transition-all"
            >
              <VolumeX className="w-4 h-4" />
              <span>بات کاٹیں / رکیں (Interrupt)</span>
            </button>
          ) : (
            <button
              onClick={handleManualMicToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isListening
                  ? "bg-rose-600 text-white"
                  : "bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white"
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isListening ? "مائیک بند کریں" : "مائیک آن کریں"}</span>
            </button>
          )}

          {/* Reset Conversation */}
          <button
            onClick={() => {
              setConversationLog([]);
              setUserTranscriptDisplay("");
              setAssistantReplyDisplay("");
              resetTranscript();
              stopSpeaking();
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
            title="Reset Voice Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
