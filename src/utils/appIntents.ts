// Android Native App Intents & URL Schemes for App Launching & Playing Media

export interface AppAction {
  name: string;
  nameUrdu: string;
  icon: string;
  category: "media" | "communication" | "utility" | "system";
  requiresConfirmation?: boolean;
  launch: (param?: string) => void;
}

export const ANDROID_APPS: Record<string, AppAction> = {
  youtube: {
    name: "YouTube",
    nameUrdu: "یوٹیوب",
    icon: "youtube",
    category: "media",
    launch: (query?: string) => {
      const q = encodeURIComponent(query || "Surah Ar-Rahman Beautiful Tilawat");
      window.open(`https://www.youtube.com/results?search_query=${q}`, "_blank");
    },
  },
  whatsapp: {
    name: "WhatsApp",
    nameUrdu: "واٹس ایپ",
    icon: "message-circle",
    category: "communication",
    launch: (text?: string) => {
      const msg = encodeURIComponent(text || "السلام علیکم");
      window.location.href = `https://api.whatsapp.com/send?text=${msg}`;
    },
  },
  phone: {
    name: "Phone Dialer",
    nameUrdu: "فون ڈائلر",
    icon: "phone",
    category: "communication",
    requiresConfirmation: true,
    launch: (number?: string) => {
      window.location.href = `tel:${number || ""}`;
    },
  },
  sms: {
    name: "Messages (SMS)",
    nameUrdu: "پیغامات",
    icon: "message-square",
    category: "communication",
    requiresConfirmation: true,
    launch: (body?: string) => {
      window.location.href = `sms:?body=${encodeURIComponent(body || "")}`;
    },
  },
  camera: {
    name: "Camera",
    nameUrdu: "کیمرہ",
    icon: "camera",
    category: "utility",
    launch: () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      (input as any).capture = "environment";
      input.click();
    },
  },
  alarm: {
    name: "Clock & Alarm",
    nameUrdu: "گھڑی اور الارم",
    icon: "alarm-clock",
    category: "utility",
    launch: () => {
      try {
        window.location.href = "intent:#Intent;action=android.intent.action.SET_ALARM;end";
      } catch (e) {
        window.location.href = "intent:#Intent;action=android.settings.DATE_SETTINGS;end";
      }
    },
  },
  music: {
    name: "Music / Media Player",
    nameUrdu: "میڈیا پلیئر",
    icon: "music",
    category: "media",
    launch: () => {
      try {
        window.location.href = "intent:#Intent;action=android.intent.action.MUSIC_PLAYER;end";
      } catch (e) {
        window.open("https://music.youtube.com", "_blank");
      }
    },
  },
  maps: {
    name: "Google Maps",
    nameUrdu: "گوگل میپس",
    icon: "map-pin",
    category: "utility",
    launch: (query?: string) => {
      const q = encodeURIComponent(query || "Mosque near me");
      window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, "_blank");
    },
  },
  calculator: {
    name: "Calculator",
    nameUrdu: "کیلکولیٹر",
    icon: "calculator",
    category: "utility",
    launch: () => {
      try {
        window.location.href = "intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.APP_CALCULATOR;end";
      } catch (e) {
        window.open("https://www.google.com/search?q=calculator", "_blank");
      }
    },
  },
  share: {
    name: "Share",
    nameUrdu: "شیئر کریں",
    icon: "share-2",
    category: "system",
    launch: (content?: string) => {
      if (navigator.share) {
        navigator.share({
          title: "SHAHEENA AI",
          text: content || "SHAHEENA - Your Personal AI Companion by Shamsheer Aslam",
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(content || window.location.href);
      }
    },
  },
  playstore: {
    name: "Google Play Store",
    nameUrdu: "گوگل پلے اسٹور",
    icon: "shopping-bag",
    category: "system",
    launch: (query?: string) => {
      const q = encodeURIComponent(query || "Islamic apps");
      window.open(`https://play.google.com/store/search?q=${q}`, "_blank");
    },
  },
  settings: {
    name: "Phone Settings",
    nameUrdu: "فون سیٹنگز",
    icon: "settings",
    category: "system",
    launch: () => {
      try {
        window.location.href = "intent:#Intent;action=android.settings.SETTINGS;end";
      } catch (e) {
        window.open("https://support.google.com/android/answer/9079129", "_blank");
      }
    },
  },
};

// Natural language voice pattern detector for app commands
export function detectAppLaunchCommand(text: string): {
  detected: boolean;
  appKey?: string;
  query?: string;
  feedbackUrdu?: string;
  requiresConfirmation?: boolean;
} {
  const lower = text.toLowerCase();

  // YouTube / Play video / Tilawat / Naat
  if (
    lower.includes("youtube") ||
    lower.includes("یوٹیوب") ||
    lower.includes("play") ||
    lower.includes("چلاؤ") ||
    lower.includes("تلاوت سنو") ||
    lower.includes("نعت سنو") ||
    lower.includes("ویڈیو")
  ) {
    const cleanQuery = text
      .replace(/youtube|یوٹیوب|kholo|khol do|play|chalao|lagao|khol|کھولو|چلاؤ/gi, "")
      .trim();
    return {
      detected: true,
      appKey: "youtube",
      query: cleanQuery || "Islamic Tilawat",
      feedbackUrdu: `یوٹیوب کھولا جا رہا ہے: ${cleanQuery || "اسلامی تلاوت"}`,
    };
  }

  // WhatsApp
  if (lower.includes("whatsapp") || lower.includes("واٹس ایپ") || lower.includes("وٹساپ")) {
    return {
      detected: true,
      appKey: "whatsapp",
      feedbackUrdu: "واٹس ایپ کھولا جا رہا ہے...",
    };
  }

  // Camera
  if (lower.includes("camera") || lower.includes("کیمرہ") || lower.includes("تصویر لو") || lower.includes("photo")) {
    return {
      detected: true,
      appKey: "camera",
      feedbackUrdu: "کیمرہ کھولا جا رہا ہے...",
    };
  }

  // Phone Call (Requires confirmation)
  if (lower.includes("call") || lower.includes("phone") || lower.includes("فون") || lower.includes("کال ملاؤ") || lower.includes("ڈائل")) {
    return {
      detected: true,
      appKey: "phone",
      feedbackUrdu: "فون ڈائلر کھولنے کے لیے تصدیق درکار ہے...",
      requiresConfirmation: true,
    };
  }

  // SMS (Requires confirmation)
  if (lower.includes("sms") || lower.includes("message") || lower.includes("میسج") || lower.includes("پیغام")) {
    return {
      detected: true,
      appKey: "sms",
      feedbackUrdu: "پیغامات (SMS) ایپ کھولنے کے لیے تصدیق درکار ہے...",
      requiresConfirmation: true,
    };
  }

  // Alarm / Clock
  if (lower.includes("alarm") || lower.includes("الارم") || lower.includes("گھڑی") || lower.includes("clock")) {
    return {
      detected: true,
      appKey: "alarm",
      feedbackUrdu: "الارم و گھڑی کھولی جا رہی ہے...",
    };
  }

  // Maps / Mosque
  if (lower.includes("map") || lower.includes("نقشہ") || lower.includes("مسجد کہاں") || lower.includes("راستہ") || lower.includes("location")) {
    return {
      detected: true,
      appKey: "maps",
      query: "Mosque near me",
      feedbackUrdu: "گوگل میپس پر قریبی مسجد یا راستہ تلاش کیا جا رہا ہے...",
    };
  }

  // Calculator
  if (lower.includes("calculator") || lower.includes("کیلکولیٹر") || lower.includes("حساب کتاب")) {
    return {
      detected: true,
      appKey: "calculator",
      feedbackUrdu: "کیلکولیٹر کھولا جا رہا ہے...",
    };
  }

  // Settings
  if (lower.includes("setting") || lower.includes("سیٹنگز") || lower.includes("سیٹنگ")) {
    return {
      detected: true,
      appKey: "settings",
      feedbackUrdu: "فون سیٹنگز کھولی جا رہی ہیں...",
    };
  }

  // Play Store
  if (lower.includes("play store") || lower.includes("playstore") || lower.includes("پلے اسٹور")) {
    return {
      detected: true,
      appKey: "playstore",
      feedbackUrdu: "گوگل پلے اسٹور کھولا جا رہا ہے...",
    };
  }

  return { detected: false };
}
