import React, { useState, useEffect, useRef, useCallback } from "react";
import { UserProfileMemory, SupportedLanguage } from "../types";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";
import { ANDROID_APPS, detectAppLaunchCommand } from "../utils/appIntents";
import { getOfflineResponse } from "../utils/offlineAI";
import { playJarvisWakeSound, playProcessingTone } from "../utils/audioEffects";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Youtube,
  MessageCircle,
  Camera,
  Phone,
  AlarmClock,
  MapPin,
  Music,
  Calculator,
  Share2,
  HeartHandshake,
  Check,
  ChevronDown
} from "lucide-react";

interface HomeVoiceCompanionProps {
  userProfile: UserProfileMemory;
  onUpdateLanguage: (lang: SupportedLanguage) => void;
  onOpenChatTab: () => void;
  onOpenIslamicTab: () => void;
  onOpenHamdModal: () => void;
  isOnline: boolean;
}

export const HomeVoiceCompanion: React.FC<HomeVoiceCompanionProps> = ({
  userProfile,
  onUpdateLanguage,
  onOpenChatTab,
  onOpenIslamicTab,
  onOpenHamdModal,
  isOnline,
}) => {
  const [liveState, setLiveState] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [userSpokenText, setUserSpokenText] = useState("");
  const [shaheenaReplyText, setShaheenaReplyText] = useState("");
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [handsFreeContinuous, setHandsFreeContinuous] = useState(true);

  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { isSpeaking, speak, stop: stopSpeaking } = useSpeechSynthesis();
  const {
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition(userProfile.preferredLanguage);

  // Sync speech input with ultra-fast silence detection (~360ms debounce)
  useEffect(() => {
    const activeText = transcript || interimTranscript;
    if (activeText) {
      setUserSpokenText(activeText);

      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

      // Fast response: auto-trigger processing when user pauses
      if (isListening && transcript) {
        silenceTimeoutRef.current = setTimeout(() => {
          handleVoiceSubmit(transcript);
        }, 360);
      }
    }
  }, [transcript, interimTranscript, isListening]);

  // Handle voice submission
  const handleVoiceSubmit = useCallback(
    async (spoken: string) => {
      const query = spoken.trim();
      if (!query) return;

      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      stopListening();
      resetTranscript();
      playProcessingTone();
      setLiveState("thinking");
      setUserSpokenText(query);

      // 1. Check for immediate device app launch command
      const appCommand = detectAppLaunchCommand(query);
      if (appCommand.detected && appCommand.appKey && ANDROID_APPS[appCommand.appKey]) {
        const app = ANDROID_APPS[appCommand.appKey];
        const feedback = appCommand.feedbackUrdu || `${app.nameUrdu} (${app.name}) کھولا جا رہا ہے...`;
        setShaheenaReplyText(feedback);
        setLiveState("speaking");

        speak(feedback, userProfile.preferredLanguage, 1.15, () => {
          app.launch(appCommand.query);
          if (handsFreeContinuous) {
            setLiveState("listening");
            startListening();
          } else {
            setLiveState("idle");
          }
        });
        return;
      }

      // 2. Offline Mode check
      if (!isOnline) {
        const offlineReply = getOfflineResponse(query, userProfile.preferredLanguage);
        setShaheenaReplyText(offlineReply.text);
        setLiveState("speaking");

        speak(offlineReply.text, userProfile.preferredLanguage, 1.12, () => {
          if (offlineReply.isAction && offlineReply.actionType && ANDROID_APPS[offlineReply.actionType]) {
            ANDROID_APPS[offlineReply.actionType].launch();
          }
          if (handsFreeContinuous) {
            setLiveState("listening");
            startListening();
          } else {
            setLiveState("idle");
          }
        });
        return;
      }

      // 3. Online Gemini API streaming
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: query }],
            userProfile,
            voiceMode: true,
          }),
        });

        if (!response.ok) throw new Error("Server response failed");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No readable stream");

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
                  setShaheenaReplyText(fullReply);
                } else if (data.type === "done" && data.fullText) {
                  fullReply = data.fullText;
                }
              } catch {
                // Ignore partial chunks
              }
            }
          }
        }

        if (fullReply) {
          setLiveState("speaking");
          const cadence = userProfile.speechSpeed >= 1.0 ? userProfile.speechSpeed : 1.14;
          speak(fullReply, userProfile.preferredLanguage, cadence, () => {
            if (handsFreeContinuous) {
              setLiveState("listening");
              startListening();
            } else {
              setLiveState("idle");
            }
          });
        } else {
          setLiveState("idle");
        }
      } catch (err) {
        console.warn("Speech chat request error:", err);
        const fallback = getOfflineResponse(query, userProfile.preferredLanguage).text;
        setShaheenaReplyText(fallback);
        setLiveState("speaking");
        speak(fallback, userProfile.preferredLanguage, 1.12, () => {
          if (handsFreeContinuous) {
            setLiveState("listening");
            startListening();
          } else {
            setLiveState("idle");
          }
        });
      }
    },
    [userProfile, isOnline, handsFreeContinuous, speak, startListening, stopListening, resetTranscript]
  );

  // Toggle listening via central orb or mic button
  const handleToggleVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
      resetTranscript();
      startListening();
      setLiveState("listening");
    } else if (isListening) {
      stopListening();
      setLiveState("idle");
    } else {
      playJarvisWakeSound();
      stopSpeaking();
      resetTranscript();
      startListening();
      setLiveState("listening");
    }
  };

  const handleInterrupt = () => {
    stopSpeaking();
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    resetTranscript();
    startListening();
    setLiveState("listening");
  };

  const handleQuickAppClick = (appKey: string, query?: string) => {
    stopSpeaking();
    stopListening();
    const app = ANDROID_APPS[appKey];
    if (!app) return;

    const speechText = `شاہینہ: ${app.nameUrdu} کھولا جا رہا ہے...`;
    setShaheenaReplyText(speechText);
    setLiveState("speaking");

    speak(speechText, userProfile.preferredLanguage, 1.15, () => {
      app.launch(query);
      setLiveState("idle");
    });
  };

  const languagesList: { code: SupportedLanguage; label: string; flag: string }[] = [
    { code: "ur", label: "اردو (Urdu)", flag: "🇵🇰" },
    { code: "en", label: "English", flag: "🌐" },
    { code: "hi", label: "हिन्दी (Hindi)", flag: "🇮🇳" },
    { code: "ar", label: "العربية (Arabic)", flag: "🇸🇦" },
    { code: "ne", label: "नेपाली (Nepali)", flag: "🇳🇵" },
  ];

  const currentLangObj =
    languagesList.find((l) => l.code === userProfile.preferredLanguage) || languagesList[0];

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] flex flex-col justify-between items-center px-4 py-3 max-w-lg mx-auto overflow-hidden select-none">
      
      {/* Background Subtle Radial Glow matching screenshot */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-gradient-to-tr from-purple-900/20 via-teal-900/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER BAR (Exact match to screenshot) */}
      <div className="w-full flex items-center justify-between z-10 pt-1 pb-2">
        {/* Left: Avatar & App Name */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-teal-400 via-indigo-500 to-purple-600 shadow-[0_0_12px_rgba(45,212,191,0.4)]">
            <div className="w-full h-full bg-[#0d0f1a] rounded-full flex items-center justify-center">
              <span className="font-nastaliq text-lg text-teal-300 font-bold -mt-0.5">ش</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold tracking-tight text-white font-sans">
              SHAHEENA
            </span>
            <span className="font-nastaliq text-sm text-purple-300 font-semibold">
              شاہینہ
            </span>
          </div>
        </div>

        {/* Right: Language Selector Pill [🇵🇰 اردو (Urdu)] */}
        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141529]/90 border border-purple-800/40 hover:border-purple-600 text-xs text-purple-200 transition-all shadow-sm active:scale-95"
          >
            <span>{currentLangObj.flag}</span>
            <span className="font-nastaliq text-xs font-semibold">{currentLangObj.label}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#0f1124] border border-purple-800/50 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
              {languagesList.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    onUpdateLanguage(l.code);
                    setLangMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-nastaliq transition-colors ${
                    userProfile.preferredLanguage === l.code
                      ? "bg-purple-950/80 text-teal-300 font-bold"
                      : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </div>
                  {userProfile.preferredLanguage === l.code && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* GLOWING TITLE & SUBTITLE (Exact match to screenshot) */}
      <div className="text-center mt-2 z-10">
        <h1
          className="font-nastaliq text-4xl sm:text-5xl font-bold tracking-normal text-pink-300 select-none transition-all duration-500 drop-shadow-[0_0_20px_rgba(244,114,182,0.65)]"
          style={{ textShadow: "0 0 25px rgba(236,72,153,0.7), 0 0 50px rgba(168,85,247,0.4)" }}
        >
          شاہینہ
        </h1>
        <p className="mt-1 text-xs sm:text-sm font-medium tracking-wide text-purple-200/90 flex items-center justify-center gap-1.5">
          <span>Your Personal AI Companion</span>
          <span className="text-purple-400">·</span>
          <span className="font-nastaliq text-purple-300">آپ کی ذاتی ذہین معاون</span>
        </p>
      </div>

      {/* CENTRAL HOLOGRAPHIC JARVIS ORB (Pixel-perfect match to screenshot) */}
      <div className="my-auto py-4 flex flex-col items-center justify-center z-10">
        <div
          onClick={handleToggleVoice}
          className="relative cursor-pointer group flex items-center justify-center"
          title="شاہینہ سے بات کرنے کے لیے چھوئیں"
        >
          {/* Outermost Dashed Orbital Ring with Orbiting Cyan Satellites */}
          <div
            className={`w-[260px] h-[260px] sm:w-[290px] sm:h-[290px] rounded-full border border-dashed border-cyan-400/30 flex items-center justify-center transition-all duration-700 relative ${
              liveState === "listening"
                ? "border-cyan-400/70 animate-spin scale-105"
                : liveState === "speaking"
                ? "border-pink-500/70 animate-spin"
                : liveState === "thinking"
                ? "border-purple-400/60 animate-pulse"
                : "border-cyan-400/25 group-hover:border-cyan-400/50"
            }`}
            style={{ animationDuration: "18s" }}
          >
            {/* Satellite 1 (Top Left) */}
            <div className="absolute -top-1.5 left-16 w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_12px_#22d3ee] animate-pulse" />
            
            {/* Satellite 2 (Bottom Right) */}
            <div className="absolute -bottom-1.5 right-16 w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_12px_#22d3ee] animate-pulse" />
          </div>

          {/* Middle Glowing Purple/Indigo Ring */}
          <div
            className={`absolute w-[205px] h-[205px] sm:w-[225px] sm:h-[225px] rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
              liveState === "listening"
                ? "border-cyan-400/80 shadow-[0_0_40px_rgba(34,211,238,0.5)] scale-105"
                : liveState === "speaking"
                ? "border-pink-500/80 shadow-[0_0_45px_rgba(244,114,182,0.6)] scale-105"
                : liveState === "thinking"
                ? "border-purple-500/80 shadow-[0_0_35px_rgba(168,85,247,0.5)]"
                : "border-purple-600/50 shadow-[0_0_30px_rgba(147,51,234,0.3)] group-hover:border-purple-500"
            }`}
          />

          {/* Inner Glowing Cyan/Teal Orb with Letter 'ش' (Screenshot Design) */}
          <div
            className={`absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full p-[2px] transition-all duration-500 flex items-center justify-center shadow-2xl ${
              liveState === "listening"
                ? "bg-gradient-to-tr from-cyan-400 via-teal-300 to-indigo-500 shadow-cyan-400/60 scale-105"
                : liveState === "speaking"
                ? "bg-gradient-to-tr from-pink-500 via-purple-400 to-amber-400 shadow-pink-500/60 scale-105"
                : liveState === "thinking"
                ? "bg-gradient-to-tr from-purple-500 via-indigo-400 to-pink-500 shadow-purple-500/50 animate-pulse"
                : "bg-gradient-to-tr from-teal-400 via-cyan-400 to-purple-500 shadow-[0_0_30px_rgba(45,212,191,0.5)] group-hover:scale-105"
            }`}
          >
            {/* Core Sphere Background with Geometric Highlights */}
            <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400 via-teal-500 to-indigo-600 relative overflow-hidden flex items-center justify-center">
              {/* Geometric cross highlight (seen in screenshot) */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.25)_100%)]" />
              <div className="absolute w-full h-[1.5px] bg-white/25 rotate-45 pointer-events-none" />
              <div className="absolute w-full h-[1.5px] bg-white/25 -rotate-45 pointer-events-none" />

              {/* Calligraphic letter 'ش' */}
              <span
                className="relative font-nastaliq text-4xl sm:text-5xl text-white font-bold select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                style={{ textShadow: "0 0 16px rgba(255,255,255,0.8)" }}
              >
                ش
              </span>
            </div>
          </div>
        </div>

        {/* State Indicator Text below Orb (Exact match: "Ready تیار") */}
        <div className="mt-5 flex items-center gap-2">
          {liveState === "listening" ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-xs font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Listening...</span>
              <span className="font-nastaliq text-sm">سُن رہی ہوں</span>
            </div>
          ) : liveState === "thinking" ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-400/50 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-spin" />
              <span>Thinking...</span>
              <span className="font-nastaliq text-sm">سوچ رہی ہوں</span>
            </div>
          ) : liveState === "speaking" ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/80 border border-pink-400/50 text-pink-200 text-xs font-semibold">
              <Volume2 className="w-3.5 h-3.5 text-pink-300 animate-bounce" />
              <span>Speaking...</span>
              <span className="font-nastaliq text-sm">بول رہی ہوں</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleInterrupt();
                }}
                className="ml-1 text-[10px] underline hover:text-white"
              >
                (روکیں)
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
              <span className="font-sans text-slate-300">Ready</span>
              <span className="font-nastaliq text-purple-300 text-base">تیار</span>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM CARD (Exact match to screenshot: Green Calligraphy "اَلسَّلَامُ عَلَيْكُمْ" + "میں شاہینہ ہوں") */}
      <div className="w-full z-10 mb-2">
        <div className="relative p-5 rounded-3xl bg-[#0f1124]/90 border border-purple-800/40 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl text-center overflow-hidden">
          {/* Top border ambient glow */}
          <div className="absolute top-0 left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

          {/* Green Calligraphy Greeting */}
          <div
            className="font-arabic text-2xl sm:text-3xl font-bold text-teal-300 select-none tracking-wide"
            style={{ textShadow: "0 0 16px rgba(45,212,191,0.5)" }}
          >
            اَلسَّلَامُ عَلَيْكُمْ
          </div>

          {/* Subtitle text: "میں شاہینہ ہوں" */}
          <div className="font-nastaliq text-lg sm:text-xl text-white font-semibold mt-1">
            میں شاہینہ ہوں
          </div>

          {/* Prompt text or active speech display */}
          <div className="mt-1 font-nastaliq text-sm sm:text-base text-purple-200/90 leading-relaxed min-h-[28px]">
            {userSpokenText ? (
              <span className="text-cyan-300 select-text">
                آپ نے کہا: "{userSpokenText}"
              </span>
            ) : shaheenaReplyText ? (
              <span className="text-teal-200 select-text">{shaheenaReplyText}</span>
            ) : (
              "آج میں آپ کی کیا مدد کر سکتی ہوں؟"
            )}
          </div>

          {/* Spoken reply reader if reply exists */}
          {shaheenaReplyText && !isSpeaking && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                onClick={() =>
                  speak(shaheenaReplyText, userProfile.preferredLanguage, userProfile.speechSpeed)
                }
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/50 text-purple-200 text-xs font-nastaliq"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>دوبارہ سنیں</span>
              </button>
              <button
                onClick={onOpenChatTab}
                className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-nastaliq"
              >
                <span>چیٹ میں دیکھیں</span>
              </button>
            </div>
          )}

          {/* Speech Error Banner */}
          {speechError && (
            <div className="mt-2 text-rose-300 text-xs font-nastaliq">
              {speechError}
            </div>
          )}
        </div>
      </div>

      {/* QUICK MOBILE APP & ACTION CAROUSEL */}
      <div className="w-full z-10 mb-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-nastaliq mb-1.5 px-1">
          <span className="text-cyan-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1">
            <span>⚡ QUICK ACTIONS</span>
          </span>
          <span>بولیں: "یوٹیوب پر تلاوت چلاؤ" یا ٹیپ کریں</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => handleQuickAppClick("youtube", "Surah Ar-Rahman Beautiful Tilawat")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-700/40 text-red-200 text-xs font-nastaliq shrink-0 active:scale-95 transition-transform"
          >
            <Youtube className="w-3.5 h-3.5 text-red-400" />
            <span>یوٹیوب (تلاوت)</span>
          </button>

          <button
            onClick={() => handleQuickAppClick("whatsapp")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/40 text-emerald-200 text-xs font-nastaliq shrink-0 active:scale-95 transition-transform"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>واٹس ایپ</span>
          </button>

          <button
            onClick={() => handleQuickAppClick("camera")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/40 text-purple-200 text-xs font-nastaliq shrink-0 active:scale-95 transition-transform"
          >
            <Camera className="w-3.5 h-3.5 text-purple-400" />
            <span>کیمرہ</span>
          </button>

          <button
            onClick={() => handleQuickAppClick("phone")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 border border-blue-700/40 text-blue-200 text-xs font-nastaliq shrink-0 active:scale-95 transition-transform"
          >
            <Phone className="w-3.5 h-3.5 text-blue-400" />
            <span>فون ڈائلر</span>
          </button>

          <button
            onClick={() => handleQuickAppClick("alarm")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700/40 text-amber-200 text-xs font-nastaliq shrink-0 active:scale-95 transition-transform"
          >
            <AlarmClock className="w-3.5 h-3.5 text-amber-400" />
            <span>الارم و گھڑی</span>
          </button>

          <button
            onClick={() => handleQuickAppClick("maps", "Mosque near me")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-950/60 hover:bg-teal-900/80 border border-teal-700/40 text-teal-200 text-xs font-nastaliq shrink-0 active:scale-95 transition-transform"
          >
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span>قریبی مسجد</span>
          </button>

          <button
            onClick={() => handleQuickAppClick("music")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/40 text-indigo-200 text-xs font-nastaliq shrink-0 active:scale-95 transition-transform"
          >
            <Music className="w-3.5 h-3.5 text-indigo-400" />
            <span>میڈیا پلیئر</span>
          </button>
        </div>
      </div>

      {/* CREATOR ATTRIBUTION FOOTER */}
      <div className="w-full text-center text-[10px] text-slate-500 font-mono tracking-wider pt-1 flex items-center justify-center gap-1.5">
        <span>Created with ❤️ by</span>
        <span className="text-purple-300 font-semibold font-nastaliq text-xs">
          شمشیر أسلم (Shamsheer Aslam)
        </span>
      </div>

    </div>
  );
};
