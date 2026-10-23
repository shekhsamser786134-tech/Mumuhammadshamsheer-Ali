import { useState, useEffect, useCallback, useRef } from "react";
import { SupportedLanguage } from "../types";

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);

      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const speak = useCallback(
    (text: string, lang: SupportedLanguage = "ur", rate: number = 1.0, onEnd?: () => void) => {
      if (!isSupported || typeof window === "undefined" || !window.speechSynthesis) {
        if (onEnd) onEnd();
        return;
      }

      // Stop previous utterance
      window.speechSynthesis.cancel();

      // Clean markdown symbols, asterisks, brackets, and URLs from spoken text
      const cleanText = text
        .replace(/[*#_`~>]/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/https?:\/\/\S+/g, "")
        .trim();

      if (!cleanText) {
        if (onEnd) onEnd();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = Math.max(0.7, Math.min(rate, 1.4));
      utterance.pitch = 1.0;

      // Find appropriate voice
      const langCodeMap: Record<SupportedLanguage, string[]> = {
        ur: ["ur-PK", "ur-IN", "ur", "ar-SA", "hi-IN"],
        ar: ["ar-SA", "ar-EG", "ar-AE", "ar"],
        en: ["en-US", "en-GB", "en-AU", "en"],
        hi: ["hi-IN", "hi", "ur-PK"],
        ne: ["ne-NP", "ne", "hi-IN"],
      };

      const targetPrefixes = langCodeMap[lang] || ["ur", "en"];
      let matchedVoice: SpeechSynthesisVoice | undefined;

      for (const prefix of targetPrefixes) {
        matchedVoice = voices.find((v) =>
          v.lang.toLowerCase().startsWith(prefix.toLowerCase())
        );
        if (matchedVoice) break;
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      } else {
        utterance.lang = targetPrefixes[0];
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEnd) {
          onEnd();
        }
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis error:", e);
        setIsSpeaking(false);
        if (onEnd) {
          onEnd();
        }
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, voices]
  );

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
    voices,
  };
}
