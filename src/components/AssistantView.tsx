import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, UserProfileMemory, SupportedLanguage, ConversationSession } from "../types";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";
import { getOfflineResponse } from "../utils/offlineAI";
import { ANDROID_APPS, detectAppLaunchCommand } from "../utils/appIntents";
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Globe,
  Volume2,
  VolumeX,
  ExternalLink,
  Phone,
  MessageSquare,
  AlertCircle,
  Copy,
  Check,
  Brain,
  HeartHandshake,
  Trash2,
  RotateCcw
} from "lucide-react";

interface AssistantViewProps {
  userProfile: UserProfileMemory;
  onOpenHamdModal: () => void;
  onOpenMemoryModal: () => void;
  onOpenDeviceTab: () => void;
  onOpenJarvisVoice: () => void;
  isOnline?: boolean;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  userProfile,
  onOpenHamdModal,
  onOpenMemoryModal,
  onOpenDeviceTab,
  onOpenJarvisVoice,
  isOnline = true,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem("shaheena_chat_messages");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: "welcome-1",
        role: "assistant",
        content: `السلام علیکم و رحمتہ اللہ و برکاتہ!
میں **شاہینہ (SHAHEENA)** ہوں — آپ کی ذاتی ذہین معاون اور اسلامی علمی رفیق۔

مجھے **شمشیر أسلم (Shamsheer Aslam)** نے ایک جدید، تیز رفتار اور کثیر لسانی پرسنل اے آئی اسسٹنٹ کے طور پر تیار کیا ہے۔

آپ مجھ سے قرآن و حدیث، عربی گرامر، روزمرہ مسائل، لائیو انٹرنیٹ سرچ، اور موبائل ڈیوائس ایکشنز کے بارے میں کوئی بھی سوال پوچھ سکتے ہیں۔ فرمائیے، میں آپ کی کیا مدد کروں؟`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
  });

  const [inputPrompt, setInputPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { isSpeaking, speak, stop: stopSpeaking } = useSpeechSynthesis();
  const {
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition(userProfile.preferredLanguage);

  // Sync speech transcript into input field
  useEffect(() => {
    if (transcript) {
      setInputPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  // Persist messages in localStorage
  useEffect(() => {
    try {
      localStorage.setItem("shaheena_chat_messages", JSON.stringify(messages));
      // Save current conversation session into sessions list
      if (messages.length > 1) {
        const firstUserMsg = messages.find((m) => m.role === "user");
        const title = firstUserMsg ? firstUserMsg.content.slice(0, 32) : "نئی گفتگو";
        const currentSession: ConversationSession = {
          id: "active-session",
          title,
          messages,
          createdAt: new Date().toLocaleDateString(),
          updatedAt: new Date().toLocaleTimeString(),
        };
        const existingSessionsStr = localStorage.getItem("shaheena_chat_sessions");
        const existingSessions: ConversationSession[] = existingSessionsStr
          ? JSON.parse(existingSessionsStr)
          : [];
        const filtered = existingSessions.filter((s) => s.id !== "active-session");
        localStorage.setItem(
          "shaheena_chat_sessions",
          JSON.stringify([currentSession, ...filtered])
        );
      }
    } catch {
      // localStorage quota
    }
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || isGenerating) return;

    // Interrupt previous voice speech
    if (isSpeaking) {
      stopSpeaking();
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputPrompt("");
    setIsGenerating(true);
    setStreamError(null);

    // 1. Check for quick app launch command
    const appCommand = detectAppLaunchCommand(textToSend.trim());
    if (appCommand.detected && appCommand.appKey && ANDROID_APPS[appCommand.appKey]) {
      const app = ANDROID_APPS[appCommand.appKey];
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: appCommand.feedbackUrdu || `${app.nameUrdu} کھولا جا رہا ہے...`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isActionable: true,
        actionType: "app",
      };
      setMessages([...newMessages, assistantMsg]);
      setIsGenerating(false);

      if (userProfile.autoSpeak) {
        speak(assistantMsg.content, userProfile.preferredLanguage, 1.15, () => {
          app.launch(appCommand.query);
        });
      } else {
        setTimeout(() => app.launch(appCommand.query), 500);
      }
      return;
    }

    // 2. Offline Mode Fallback
    if (!isOnline) {
      const offline = getOfflineResponse(textToSend.trim(), userProfile.preferredLanguage);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: offline.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([...newMessages, assistantMsg]);
      setIsGenerating(false);
      if (userProfile.autoSpeak) {
        speak(offline.text, userProfile.preferredLanguage, 1.15);
      }
      return;
    }

    const assistantMsgId = `assistant-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...newMessages, initialAssistantMsg]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          userProfile,
          webSearchEnabled,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Response body is not readable");

      const decoder = new TextDecoder();
      let accumulatedText = "";
      let accumulatedSources: { title: string; uri: string }[] = [];

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
                accumulatedText += data.text;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId ? { ...msg, content: accumulatedText } : msg
                  )
                );
              } else if (data.type === "done") {
                if (data.sources) {
                  accumulatedSources = data.sources;
                }
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, content: accumulatedText, sources: accumulatedSources }
                      : msg
                  )
                );

                if (userProfile.autoSpeak && accumulatedText) {
                  speak(accumulatedText, userProfile.preferredLanguage, userProfile.speechSpeed);
                }
              } else if (data.type === "error") {
                setStreamError(data.error);
              }
            } catch {
              // Ignore partial JSON
            }
          }
        }
      }
    } catch (err: any) {
      console.warn("Chat request error:", err);
      const offlineReply = getOfflineResponse(textToSend.trim(), userProfile.preferredLanguage);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content:
                  msg.content || offlineReply.text,
              }
            : msg
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("کیا آپ واقعی اس چیٹ کی تاریخ کو ری سیٹ کرنا چاہتے ہیں؟")) {
      localStorage.removeItem("shaheena_chat_messages");
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: "assistant",
          content: `السلام علیکم! شاہینہ نئی گفتگو کے لیے تیار ہے۔ فرمائیے آپ کا کیا سوال ہے؟`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const recommendedPrompts = [
    { labelUrdu: "دعائے قنوت مع ترجمہ", query: "دعائے قنوت کا مکمل عربی متن اور با محاورہ اردو ترجمہ فراہم فرمائیں۔" },
    { labelUrdu: "قرآن میں صبر کی فضیلت", query: "قرآن حکیم کی روشنی میں صبر و استقامت کی فضیلت اور متعلقہ آیات کی تفصیل بتائیے۔" },
    { labelUrdu: "عربی جملہ اسمیہ کے قواعد", query: "عربی گرامر میں جملہ اسمیہ، مبتدأ اور خبر کی شرائط اور اعراب کی وضاحت کیجیے۔" },
    { labelUrdu: "شمشیر أسلم کا تعارف", query: "آپ کو کس نے تیار کیا ہے؟ شمشیر أسلم کا تعارف کرائیں۔" },
    { labelUrdu: "قریبی مسجد تلاش کریں", query: "میری ڈیوائس پر قریبی مساجد کے لیے نقشہ کھولنے میں مدد کریں۔" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 pb-28 text-left flex flex-col min-h-[calc(100vh-4rem)]">
      
      {/* Sacred Hamd & Durood Quick Banner */}
      <div className="mb-3 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-purple-950/20 to-teal-950/20 border border-amber-600/30 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-200 font-nastaliq">
              الحمد لله رب العالمين · الصلاة والسلام على رسول الله ﷺ
            </div>
            <p className="text-[11px] text-slate-300 font-nastaliq">
              افتتاحی حمد و ثنا اور درود و سلام
            </p>
          </div>
        </div>
        <button
          onClick={onOpenHamdModal}
          className="px-3 py-1 rounded-lg bg-amber-600/90 hover:bg-amber-600 text-white text-xs font-semibold whitespace-nowrap transition-colors font-nastaliq"
        >
          تلاوت سنیں
        </button>
      </div>

      {/* Assistant Status Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 via-indigo-600 to-purple-600 shadow-[0_0_12px_rgba(45,212,191,0.4)] ${
                isGenerating || isSpeaking ? "scale-105" : ""
              }`}
            >
              <div className="w-full h-full bg-[#0d0f1a] rounded-full flex items-center justify-center">
                <span className="font-nastaliq text-xl text-teal-300 font-bold -mt-0.5 select-none">ش</span>
              </div>
            </div>
            {(isGenerating || isSpeaking || isListening) && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-teal-400 border-2 border-[#08090f] animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">SHAHEENA AI</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/40">
                gemini-3.8-flash
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              {isListening
                ? "🎙️ آواز سن رہی ہوں..."
                : isGenerating
                ? "⚡ شاہینہ سوچ رہی ہے..."
                : isSpeaking
                ? "🔊 صوتی جواب سنایا جا رہا ہے..."
                : "آپ کی خدمت میں حاضر · Ready"}
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Live Web Search Grounding Toggle */}
          <button
            onClick={() => setWebSearchEnabled(!webSearchEnabled)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              webSearchEnabled
                ? "bg-teal-950/70 border-teal-500 text-teal-300 shadow-sm"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Live Web Search Grounding"
          >
            <Globe className={`w-3.5 h-3.5 ${webSearchEnabled ? "text-teal-400" : "text-slate-500"}`} />
            <span className="hidden sm:inline">Web Search</span>
            <span className="text-[10px] uppercase font-mono font-bold">
              {webSearchEnabled ? "ON" : "OFF"}
            </span>
          </button>

          {/* Interrupt Voice Button */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold animate-pulse shadow-md"
              title="Stop Speaking"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>خاموش کریں</span>
            </button>
          )}

          {/* Clear history button */}
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 space-y-4 mb-4 overflow-y-auto pr-1">
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[82%] p-4 sm:p-5 rounded-2xl relative transition-all ${
                  isUser
                    ? "bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md shadow-purple-950/30 rounded-tr-sm text-right"
                    : "bg-[#0f111f] border border-purple-900/30 text-slate-100 shadow-md rounded-tl-sm text-right"
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-purple-900/20 text-xs">
                    <span className="font-semibold text-purple-300 font-nastaliq">
                      شاہینہ (ذاتی معاون)
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          speak(message.content, userProfile.preferredLanguage, userProfile.speechSpeed)
                        }
                        className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                        title="Read Aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopyMessage(message.id, message.content)}
                        className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                        title="Copy message"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Message Content */}
                <div className="font-nastaliq text-base sm:text-lg leading-loose select-text whitespace-pre-line">
                  {message.content}
                </div>

                {/* Grounded Web Sources Citations */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/70 text-left">
                    <div className="text-[11px] font-semibold text-teal-400 mb-1.5 flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>Verified Web Sources:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {message.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-teal-300 hover:text-white transition-colors truncate max-w-xs"
                        >
                          <span className="truncate">{src.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <div
                  className={`text-[10px] mt-2 font-mono ${
                    isUser ? "text-purple-200/80 text-left" : "text-slate-500 text-left"
                  }`}
                >
                  {message.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading generation indicator */}
        {isGenerating && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#0f111f] border border-purple-900/20 text-xs text-purple-300 w-fit">
            <div className="w-3 h-3 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
            <span className="font-nastaliq">شاہینہ جواب تیار کر رہی ہے...</span>
          </div>
        )}

        {streamError && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/50 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{streamError}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Recommended Prompt Cards Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none">
        {recommendedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.query)}
            disabled={isGenerating}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-600/40 text-slate-300 hover:text-white text-xs font-nastaliq whitespace-nowrap transition-all shadow-sm active:scale-95"
          >
            {p.labelUrdu}
          </button>
        ))}
      </div>

      {/* Speech Error Banner if any */}
      {speechError && (
        <div className="mb-2 p-2 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-300 text-[11px] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Floating Input Toolbar */}
      <div className="p-2 sm:p-2.5 rounded-2xl bg-[#0d0f1c] border border-purple-900/40 shadow-xl flex items-center gap-2">
        {/* Voice Input Microphone */}
        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
            isListening
              ? "bg-rose-600 text-white shadow-lg shadow-rose-900/40 animate-pulse scale-105"
              : "bg-slate-800/90 text-purple-300 hover:text-white hover:bg-slate-700"
          }`}
          title={isListening ? "Stop Voice Input" : "Speak with SHAHEENA"}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Input Text Field */}
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
          placeholder="شاہینہ سے کوئی بھی سوال پوچھیں یا ڈیوائس ایکشن بتائیں..."
          className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-500 font-nastaliq focus:outline-none text-right"
          dir="rtl"
        />

        {/* Send Button */}
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputPrompt.trim() || isGenerating}
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 shadow-md active:scale-95"
          title="Send Message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
