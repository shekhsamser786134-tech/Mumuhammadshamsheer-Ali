/**
 * Offline AI and Local Knowledge Engine for SHAHEENA
 * Allows basic conversation, Islamic references, and device actions when offline.
 */

export interface OfflineResponse {
  text: string;
  isAction?: boolean;
  actionType?: string;
  actionPayload?: string;
}

export function getOfflineResponse(query: string, language: string = "ur"): OfflineResponse {
  const lower = query.toLowerCase().trim();

  // Creator Attribution
  if (
    lower.includes("shamsheer") ||
    lower.includes("شمشیر") ||
    lower.includes("banaya") ||
    lower.includes("developer") ||
    lower.includes("creator") ||
    lower.includes("kis ne banaya") ||
    lower.includes("کس نے بنایا")
  ) {
    return {
      text: "مجھے شمشیر أسلم (Shamsheer Aslam) نے تیار کیا ہے۔ میں آپ کی ذاتی ذہین معاون اور اسلامی علمی رفیق ہوں۔",
    };
  }

  // Greetings
  if (
    lower.includes("salam") ||
    lower.includes("سلام") ||
    lower.includes("السلام") ||
    lower.includes("hello") ||
    lower.includes("hi")
  ) {
    return {
      text: "وعلیکم السلام و رحمتہ اللہ و برکاتہ! فرمائیے، میں آپ کی کیا مدد کر سکتی ہوں؟ (نوٹ: آف لائن موڈ فعال ہے)",
    };
  }

  // Hamd & Durood
  if (
    lower.includes("hamd") ||
    lower.includes("حمد") ||
    lower.includes("durood") ||
    lower.includes("درود") ||
    lower.includes("salat")
  ) {
    return {
      text: "تمام تعریفیں اللہ رب العزت کے لیے ہیں جو تمام جہانوں کا پالنے والا ہے۔ اور بے حد و حساب درود و سلام نازل ہوں کائنات کی سب سے افضل ہستی، جناب محمد رسول اللہ ﷺ پر۔",
    };
  }

  // Ayat al-Kursi
  if (lower.includes("kursi") || lower.includes("کرسی")) {
    return {
      text: `اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ...\nترجمہ: اللہ وہ ہے جس کے سوا کوئی معبود نہیں، وہ زندہ ہے سب کو سنبھالنے والا ہے۔ نہ اسے اونگھ آتی ہے نہ نیند۔`,
    };
  }

  // Surah Ikhlas
  if (lower.includes("ikhlas") || lower.includes("اخلاص") || lower.includes("qul huwa")) {
    return {
      text: `قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ۝\nترجمہ: آپ فرما دیجیے کہ وہ اللہ ایک ہے، اللہ بے نیاز ہے، نہ اس کی کوئی اولاد ہے اور نہ وہ کسی کی اولاد ہے، اور کوئی اس کا ہمسر نہیں۔`,
    };
  }

  // Surah Fatiha
  if (lower.includes("fatiha") || lower.includes("فاتحہ")) {
    return {
      text: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ۝`,
    };
  }

  // Dua Qunoot
  if (lower.includes("qunoot") || lower.includes("قنوت")) {
    return {
      text: `اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ...\nترجمہ: اے اللہ! ہم تجھ ہی سے مدد مانگتے ہیں اور تجھ سے بخشش طلب کرتے ہیں، اور تجھ پر ایمان لاتے ہیں اور تجھ پر بھروسا کرتے ہیں۔`,
    };
  }

  // App launch requests while offline
  if (lower.includes("camera") || lower.includes("کیمرہ")) {
    return {
      text: "کیمرہ کھولا جا رہا ہے...",
      isAction: true,
      actionType: "camera",
    };
  }

  if (lower.includes("alarm") || lower.includes("الارم") || lower.includes("گھڑی")) {
    return {
      text: "الارم و گھڑی ایپ کھولی جا رہی ہے...",
      isAction: true,
      actionType: "alarm",
    };
  }

  if (lower.includes("calculator") || lower.includes("کیلکولیٹر")) {
    return {
      text: "کیلکولیٹر کھولا جا رہا ہے...",
      isAction: true,
      actionType: "calculator",
    };
  }

  // General offline fallback
  return {
    text: `آپ کا سوال موصول ہوا۔ اس وقت ڈیوائس آف لائن (Offline) ہے، اس لیے بنیادی ذخیرہ علم، قرآن و حدیث کے محفوظ اقتباسات، اور فون کے لوکل ایکشنز دستیاب ہیں۔ مکمل تفصیلی تجزیے کے لیے برائے مہربانی انٹرنیٹ کنیکٹ فرمائیں۔`,
  };
}
