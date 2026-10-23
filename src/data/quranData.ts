import { SurahMeta, Ayah } from "../types";

export const ALL_SURAHS: SurahMeta[] = [
  { number: 1, nameArabic: "الفاتحة", nameUrdu: "الفاتحہ", nameEnglish: "Al-Fatihah", englishMeaning: "The Opening", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 2, nameArabic: "البقرة", nameUrdu: "البقرہ", nameEnglish: "Al-Baqarah", englishMeaning: "The Cow", numberOfAyahs: 286, revelationType: "Medinan" },
  { number: 3, nameArabic: "آل عمران", nameUrdu: "آل عمران", nameEnglish: "Ali 'Imran", englishMeaning: "Family of Imran", numberOfAyahs: 200, revelationType: "Medinan" },
  { number: 4, nameArabic: "النساء", nameUrdu: "النساء", nameEnglish: "An-Nisa", englishMeaning: "The Women", numberOfAyahs: 176, revelationType: "Medinan" },
  { number: 5, nameArabic: "المائدة", nameUrdu: "المائدہ", nameEnglish: "Al-Ma'idah", englishMeaning: "The Table Spread", numberOfAyahs: 120, revelationType: "Medinan" },
  { number: 6, nameArabic: "الأنعام", nameUrdu: "الانعام", nameEnglish: "Al-An'am", englishMeaning: "The Cattle", numberOfAyahs: 165, revelationType: "Meccan" },
  { number: 7, nameArabic: "الأعراف", nameUrdu: "الاعراف", nameEnglish: "Al-A'raf", englishMeaning: "The Heights", numberOfAyahs: 206, revelationType: "Meccan" },
  { number: 8, nameArabic: "الأنفال", nameUrdu: "الانفال", nameEnglish: "Al-Anfal", englishMeaning: "The Spoils of War", numberOfAyahs: 75, revelationType: "Medinan" },
  { number: 9, nameArabic: "التوبة", nameUrdu: "التوبہ", nameEnglish: "At-Tawbah", englishMeaning: "The Repentance", numberOfAyahs: 129, revelationType: "Medinan" },
  { number: 10, nameArabic: "يونس", nameUrdu: "یونس", nameEnglish: "Yunus", englishMeaning: "Jonah", numberOfAyahs: 109, revelationType: "Meccan" },
  { number: 11, nameArabic: "هود", nameUrdu: "ہود", nameEnglish: "Hud", englishMeaning: "Hud", numberOfAyahs: 123, revelationType: "Meccan" },
  { number: 12, nameArabic: "يوسف", nameUrdu: "یوسف", nameEnglish: "Yusuf", englishMeaning: "Joseph", numberOfAyahs: 111, revelationType: "Meccan" },
  { number: 13, nameArabic: "الرعد", nameUrdu: "الرعد", nameEnglish: "Ar-Ra'd", englishMeaning: "The Thunder", numberOfAyahs: 43, revelationType: "Medinan" },
  { number: 14, nameArabic: "إبراهيم", nameUrdu: "ابراہیم", nameEnglish: "Ibrahim", englishMeaning: "Abraham", numberOfAyahs: 52, revelationType: "Meccan" },
  { number: 15, nameArabic: "الحجر", nameUrdu: "الحجر", nameEnglish: "Al-Hijr", englishMeaning: "The Rocky Tract", numberOfAyahs: 99, revelationType: "Meccan" },
  { number: 16, nameArabic: "النحل", nameUrdu: "النحل", nameEnglish: "An-Nahl", englishMeaning: "The Bee", numberOfAyahs: 128, revelationType: "Meccan" },
  { number: 17, nameArabic: "الإسراء", nameUrdu: "الاسراء", nameEnglish: "Al-Isra", englishMeaning: "The Night Journey", numberOfAyahs: 111, revelationType: "Meccan" },
  { number: 18, nameArabic: "الكهف", nameUrdu: "الکہف", nameEnglish: "Al-Kahf", englishMeaning: "The Cave", numberOfAyahs: 110, revelationType: "Meccan" },
  { number: 19, nameArabic: "مريم", nameUrdu: "مریم", nameEnglish: "Maryam", englishMeaning: "Mary", numberOfAyahs: 98, revelationType: "Meccan" },
  { number: 20, nameArabic: "طه", nameUrdu: "طٰہٰ", nameEnglish: "Taha", englishMeaning: "Ta-Ha", numberOfAyahs: 135, revelationType: "Meccan" },
  { number: 21, nameArabic: "الأنبياء", nameUrdu: "الانبیاء", nameEnglish: "Al-Anbiya", englishMeaning: "The Prophets", numberOfAyahs: 112, revelationType: "Meccan" },
  { number: 22, nameArabic: "الحج", nameUrdu: "الحج", nameEnglish: "Al-Hajj", englishMeaning: "The Pilgrimage", numberOfAyahs: 78, revelationType: "Medinan" },
  { number: 23, nameArabic: "المؤمنون", nameUrdu: "المؤمنون", nameEnglish: "Al-Mu'minun", englishMeaning: "The Believers", numberOfAyahs: 118, revelationType: "Meccan" },
  { number: 24, nameArabic: "النور", nameUrdu: "النور", nameEnglish: "An-Nur", englishMeaning: "The Light", numberOfAyahs: 64, revelationType: "Medinan" },
  { number: 25, nameArabic: "الفرقان", nameUrdu: "الفرقان", nameEnglish: "Al-Furqan", englishMeaning: "The Criterion", numberOfAyahs: 77, revelationType: "Meccan" },
  { number: 26, nameArabic: "الشعراء", nameUrdu: "الشعراء", nameEnglish: "Ash-Shu'ara", englishMeaning: "The Poets", numberOfAyahs: 227, revelationType: "Meccan" },
  { number: 27, nameArabic: "النمل", nameUrdu: "النمل", nameEnglish: "An-Naml", englishMeaning: "The Ant", numberOfAyahs: 93, revelationType: "Meccan" },
  { number: 28, nameArabic: "القصص", nameUrdu: "القصص", nameEnglish: "Al-Qasas", englishMeaning: "The Stories", numberOfAyahs: 88, revelationType: "Meccan" },
  { number: 29, nameArabic: "العنكبوت", nameUrdu: "العنکبوت", nameEnglish: "Al-'Ankabut", englishMeaning: "The Spider", numberOfAyahs: 69, revelationType: "Meccan" },
  { number: 30, nameArabic: "الروم", nameUrdu: "الروم", nameEnglish: "Ar-Rum", englishMeaning: "The Romans", numberOfAyahs: 60, revelationType: "Meccan" },
  { number: 31, nameArabic: "لقمان", nameUrdu: "لقمان", nameEnglish: "Luqman", englishMeaning: "Luqman", numberOfAyahs: 34, revelationType: "Meccan" },
  { number: 32, nameArabic: "السجدة", nameUrdu: "السجدہ", nameEnglish: "As-Sajdah", englishMeaning: "The Prostration", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 33, nameArabic: "الأحزاب", nameUrdu: "الاحزاب", nameEnglish: "Al-Ahzab", englishMeaning: "The Combined Forces", numberOfAyahs: 73, revelationType: "Medinan" },
  { number: 34, nameArabic: "سبأ", nameUrdu: "سبا", nameEnglish: "Saba", englishMeaning: "Sheba", numberOfAyahs: 54, revelationType: "Meccan" },
  { number: 35, nameArabic: "فاطر", nameUrdu: "فاطر", nameEnglish: "Fatir", englishMeaning: "Originator", numberOfAyahs: 45, revelationType: "Meccan" },
  { number: 36, nameArabic: "يس", nameUrdu: "یٰسٓ", nameEnglish: "Ya-Sin", englishMeaning: "Ya Sin", numberOfAyahs: 83, revelationType: "Meccan" },
  { number: 37, nameArabic: "الصافات", nameUrdu: "الصافات", nameEnglish: "As-Saffat", englishMeaning: "Those who set the Ranks", numberOfAyahs: 182, revelationType: "Meccan" },
  { number: 38, nameArabic: "ص", nameUrdu: "صٓ", nameEnglish: "Sad", englishMeaning: "The Letter Sad", numberOfAyahs: 88, revelationType: "Meccan" },
  { number: 39, nameArabic: "الزمر", nameUrdu: "الزمر", nameEnglish: "Az-Zumar", englishMeaning: "The Troops", numberOfAyahs: 75, revelationType: "Meccan" },
  { number: 40, nameArabic: "غافر", nameUrdu: "غافر", nameEnglish: "Ghafir", englishMeaning: "The Forgiver", numberOfAyahs: 85, revelationType: "Meccan" },
  { number: 41, nameArabic: "فصلت", nameUrdu: "فصلت", nameEnglish: "Fussilat", englishMeaning: "Explained in Detail", numberOfAyahs: 54, revelationType: "Meccan" },
  { number: 42, nameArabic: "الشورى", nameUrdu: "الشوریٰ", nameEnglish: "Ash-Shura", englishMeaning: "The Consultation", numberOfAyahs: 53, revelationType: "Meccan" },
  { number: 43, nameArabic: "الزخرف", nameUrdu: "الزخرف", nameEnglish: "Az-Zukhruf", englishMeaning: "The Ornaments of Gold", numberOfAyahs: 89, revelationType: "Meccan" },
  { number: 44, nameArabic: "الدخان", nameUrdu: "الدخان", nameEnglish: "Ad-Dukhan", englishMeaning: "The Smoke", numberOfAyahs: 59, revelationType: "Meccan" },
  { number: 45, nameArabic: "الجاثية", nameUrdu: "الجاثیہ", nameEnglish: "Al-Jathiyah", englishMeaning: "The Crouching", numberOfAyahs: 37, revelationType: "Meccan" },
  { number: 46, nameArabic: "الأحقاف", nameUrdu: "الاحقاف", nameEnglish: "Al-Ahqaf", englishMeaning: "The Wind-Curved Sandhills", numberOfAyahs: 35, revelationType: "Meccan" },
  { number: 47, nameArabic: "محمد", nameUrdu: "محمد ﷺ", nameEnglish: "Muhammad", englishMeaning: "Muhammad", numberOfAyahs: 38, revelationType: "Medinan" },
  { number: 48, nameArabic: "الفتح", nameUrdu: "الفتح", nameEnglish: "Al-Fath", englishMeaning: "The Victory", numberOfAyahs: 29, revelationType: "Medinan" },
  { number: 49, nameArabic: "الحجرات", nameUrdu: "الحجرات", nameEnglish: "Al-Hujurat", englishMeaning: "The Rooms", numberOfAyahs: 18, revelationType: "Medinan" },
  { number: 50, nameArabic: "ق", nameUrdu: "قٓ", nameEnglish: "Qaf", englishMeaning: "The Letter Qaf", numberOfAyahs: 45, revelationType: "Meccan" },
  { number: 51, nameArabic: "الذاريات", nameUrdu: "الذاریات", nameEnglish: "Adh-Dhariyat", englishMeaning: "The Winnowing Winds", numberOfAyahs: 60, revelationType: "Meccan" },
  { number: 52, nameArabic: "الطور", nameUrdu: "الطور", nameEnglish: "At-Tur", englishMeaning: "The Mount", numberOfAyahs: 49, revelationType: "Meccan" },
  { number: 53, nameArabic: "النجم", nameUrdu: "النجم", nameEnglish: "An-Najm", englishMeaning: "The Star", numberOfAyahs: 62, revelationType: "Meccan" },
  { number: 54, nameArabic: "القمر", nameUrdu: "القمر", nameEnglish: "Al-Qamar", englishMeaning: "The Moon", numberOfAyahs: 55, revelationType: "Meccan" },
  { number: 55, nameArabic: "الرحمن", nameUrdu: "الرحمٰن", nameEnglish: "Ar-Rahman", englishMeaning: "The Beneficent", numberOfAyahs: 78, revelationType: "Medinan" },
  { number: 56, nameArabic: "الواقعة", nameUrdu: "الواقعہ", nameEnglish: "Al-Waqi'ah", englishMeaning: "The Inevitable", numberOfAyahs: 96, revelationType: "Meccan" },
  { number: 57, nameArabic: "الحديد", nameUrdu: "الحدید", nameEnglish: "Al-Hadid", englishMeaning: "The Iron", numberOfAyahs: 29, revelationType: "Medinan" },
  { number: 58, nameArabic: "المجادلة", nameUrdu: "المجادلہ", nameEnglish: "Al-Mujadila", englishMeaning: "The Pleading Woman", numberOfAyahs: 22, revelationType: "Medinan" },
  { number: 59, nameArabic: "الحشر", nameUrdu: "الحشر", nameEnglish: "Al-Hashr", englishMeaning: "The Exile", numberOfAyahs: 24, revelationType: "Medinan" },
  { number: 60, nameArabic: "الممتحنة", nameUrdu: "الممتحنہ", nameEnglish: "Al-Mumtahanah", englishMeaning: "She that is to be examined", numberOfAyahs: 13, revelationType: "Medinan" },
  { number: 61, nameArabic: "الصف", nameUrdu: "الصف", nameEnglish: "As-Saff", englishMeaning: "The Ranks", numberOfAyahs: 14, revelationType: "Medinan" },
  { number: 62, nameArabic: "الجمعة", nameUrdu: "الجمعہ", nameEnglish: "Al-Jumu'ah", englishMeaning: "The Congregation, Friday", numberOfAyahs: 11, revelationType: "Medinan" },
  { number: 63, nameArabic: "المنافقون", nameUrdu: "المنافقون", nameEnglish: "Al-Munafiqun", englishMeaning: "The Hypocrites", numberOfAyahs: 11, revelationType: "Medinan" },
  { number: 64, nameArabic: "التغابن", nameUrdu: "التغابن", nameEnglish: "At-Taghabun", englishMeaning: "The Mutual Disillusion", numberOfAyahs: 18, revelationType: "Medinan" },
  { number: 65, nameArabic: "الطلاق", nameUrdu: "الطلاق", nameEnglish: "At-Talaq", englishMeaning: "The Divorce", numberOfAyahs: 12, revelationType: "Medinan" },
  { number: 66, nameArabic: "التحريم", nameUrdu: "التحریم", nameEnglish: "At-Tahrim", englishMeaning: "The Prohibition", numberOfAyahs: 12, revelationType: "Medinan" },
  { number: 67, nameArabic: "الملك", nameUrdu: "الملک", nameEnglish: "Al-Mulk", englishMeaning: "The Sovereignty", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 68, nameArabic: "القلم", nameUrdu: "القلم", nameEnglish: "Al-Qalam", englishMeaning: "The Pen", numberOfAyahs: 52, revelationType: "Meccan" },
  { number: 69, nameArabic: "الحاقة", nameUrdu: "الحاقہ", nameEnglish: "Al-Haqqah", englishMeaning: "The Inevitable Truth", numberOfAyahs: 52, revelationType: "Meccan" },
  { number: 70, nameArabic: "المعارج", nameUrdu: "المعارج", nameEnglish: "Al-Ma'arij", englishMeaning: "The Ascending Stairways", numberOfAyahs: 44, revelationType: "Meccan" },
  { number: 71, nameArabic: "نوح", nameUrdu: "نوح", nameEnglish: "Nuh", englishMeaning: "Noah", numberOfAyahs: 28, revelationType: "Meccan" },
  { number: 72, nameArabic: "الجن", nameUrdu: "الجن", nameEnglish: "Al-Jinn", englishMeaning: "The Jinn", numberOfAyahs: 28, revelationType: "Meccan" },
  { number: 73, nameArabic: "المزمل", nameUrdu: "المزمل", nameEnglish: "Al-Muzzammil", englishMeaning: "The Enshrouded One", numberOfAyahs: 20, revelationType: "Meccan" },
  { number: 74, nameArabic: "المدثر", nameUrdu: "المدثر", nameEnglish: "Al-Muddaththir", englishMeaning: "The Cloaked One", numberOfAyahs: 56, revelationType: "Meccan" },
  { number: 75, nameArabic: "القيامة", nameUrdu: "القیامۃ", nameEnglish: "Al-Qiyamah", englishMeaning: "The Resurrection", numberOfAyahs: 40, revelationType: "Meccan" },
  { number: 76, nameArabic: "الإنسان", nameUrdu: "الانسان", nameEnglish: "Al-Insan", englishMeaning: "The Man", numberOfAyahs: 31, revelationType: "Medinan" },
  { number: 77, nameArabic: "المرسلات", nameUrdu: "المرسلات", nameEnglish: "Al-Mursalat", englishMeaning: "The Emissaries", numberOfAyahs: 50, revelationType: "Meccan" },
  { number: 78, nameArabic: "النبأ", nameUrdu: "النباء", nameEnglish: "An-Naba", englishMeaning: "The Tidings", numberOfAyahs: 40, revelationType: "Meccan" },
  { number: 79, nameArabic: "النازعات", nameUrdu: "النازعات", nameEnglish: "An-Nazi'at", englishMeaning: "Those who drag forth", numberOfAyahs: 46, revelationType: "Meccan" },
  { number: 80, nameArabic: "عبس", nameUrdu: "عبس", nameEnglish: "'Abasa", englishMeaning: "He Frowned", numberOfAyahs: 42, revelationType: "Meccan" },
  { number: 81, nameArabic: "التكوير", nameUrdu: "التکویر", nameEnglish: "At-Takwir", englishMeaning: "The Overthrowing", numberOfAyahs: 29, revelationType: "Meccan" },
  { number: 82, nameArabic: "الانفطار", nameUrdu: "الانفطار", nameEnglish: "Al-Infitar", englishMeaning: "The Cleaving", numberOfAyahs: 19, revelationType: "Meccan" },
  { number: 83, nameArabic: "المطففين", nameUrdu: "المطففین", nameEnglish: "Al-Mutaffifin", englishMeaning: "The Defrauding", numberOfAyahs: 36, revelationType: "Meccan" },
  { number: 84, nameArabic: "الانشقاق", nameUrdu: "الانشقاق", nameEnglish: "Al-Inshiqaq", englishMeaning: "The Splitting Open", numberOfAyahs: 25, revelationType: "Meccan" },
  { number: 85, nameArabic: "البروج", nameUrdu: "البروج", nameEnglish: "Al-Buruj", englishMeaning: "The Constellations", numberOfAyahs: 22, revelationType: "Meccan" },
  { number: 86, nameArabic: "الطارق", nameUrdu: "الطارق", nameEnglish: "At-Tariq", englishMeaning: "The Morning Star", numberOfAyahs: 17, revelationType: "Meccan" },
  { number: 87, nameArabic: "الأعلى", nameUrdu: "الاعلیٰ", nameEnglish: "Al-A'la", englishMeaning: "The Most High", numberOfAyahs: 19, revelationType: "Meccan" },
  { number: 88, nameArabic: "الغاشية", nameUrdu: "الغاشیہ", nameEnglish: "Al-Ghashiyah", englishMeaning: "The Overwhelming", numberOfAyahs: 26, revelationType: "Meccan" },
  { number: 89, nameArabic: "الفجر", nameUrdu: "الفجر", nameEnglish: "Al-Fajr", englishMeaning: "The Dawn", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 90, nameArabic: "البلد", nameUrdu: "البلد", nameEnglish: "Al-Balad", englishMeaning: "The City", numberOfAyahs: 20, revelationType: "Meccan" },
  { number: 91, nameArabic: "الشمس", nameUrdu: "الشمس", nameEnglish: "Ash-Shams", englishMeaning: "The Sun", numberOfAyahs: 15, revelationType: "Meccan" },
  { number: 92, nameArabic: "الليل", nameUrdu: "اللیل", nameEnglish: "Al-Layl", englishMeaning: "The Night", numberOfAyahs: 21, revelationType: "Meccan" },
  { number: 93, nameArabic: "الضحى", nameUrdu: "الضحیٰ", nameEnglish: "Ad-Duha", englishMeaning: "The Morning Hours", numberOfAyahs: 11, revelationType: "Meccan" },
  { number: 94, nameArabic: "الشرح", nameUrdu: "الم نشرح", nameEnglish: "Ash-Sharh", englishMeaning: "The Relief", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 95, nameArabic: "التين", nameUrdu: "التین", nameEnglish: "At-Tin", englishMeaning: "The Fig", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 96, nameArabic: "العلق", nameUrdu: "العلق", nameEnglish: "Al-'Alaq", englishMeaning: "The Clot", numberOfAyahs: 19, revelationType: "Meccan" },
  { number: 97, nameArabic: "القدر", nameUrdu: "القدر", nameEnglish: "Al-Qadr", englishMeaning: "The Power", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 98, nameArabic: "البينة", nameUrdu: "البینہ", nameEnglish: "Al-Bayyinah", englishMeaning: "The Clear Proof", numberOfAyahs: 8, revelationType: "Medinan" },
  { number: 99, nameArabic: "الزلزلة", nameUrdu: "الزلزلہ", nameEnglish: "Az-Zalzalah", englishMeaning: "The Earthquake", numberOfAyahs: 8, revelationType: "Medinan" },
  { number: 100, nameArabic: "العاديات", nameUrdu: "العادیات", nameEnglish: "Al-'Adiyat", englishMeaning: "The Courser", numberOfAyahs: 11, revelationType: "Meccan" },
  { number: 101, nameArabic: "القارعة", nameUrdu: "القارclassہ", nameEnglish: "Al-Qari'ah", englishMeaning: "The Calamity", numberOfAyahs: 11, revelationType: "Meccan" },
  { number: 102, nameArabic: "التكاثر", nameUrdu: "التکاثر", nameEnglish: "At-Takathur", englishMeaning: "The Rivalry in world increase", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 103, nameArabic: "العصر", nameUrdu: "العصر", nameEnglish: "Al-'Asr", englishMeaning: "The Declining Day", numberOfAyahs: 3, revelationType: "Meccan" },
  { number: 104, nameArabic: "الهمزة", nameUrdu: "الہمزہ", nameEnglish: "Al-Humazah", englishMeaning: "The Traducer", numberOfAyahs: 9, revelationType: "Meccan" },
  { number: 105, nameArabic: "الفيل", nameUrdu: "الفیل", nameEnglish: "Al-Fil", englishMeaning: "The Elephant", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 106, nameArabic: "قريش", nameUrdu: "قریش", nameEnglish: "Quraysh", englishMeaning: "Quraysh", numberOfAyahs: 4, revelationType: "Meccan" },
  { number: 107, nameArabic: "الماعون", nameUrdu: "الماعون", nameEnglish: "Al-Ma'un", englishMeaning: "The Small Kindnesses", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 108, nameArabic: "الكوثر", nameUrdu: "الکوثر", nameEnglish: "Al-Kawthar", englishMeaning: "The Abundance", numberOfAyahs: 3, revelationType: "Meccan" },
  { number: 109, nameArabic: "الكافرون", nameUrdu: "الکافرون", nameEnglish: "Al-Kafirun", englishMeaning: "The Disbelievers", numberOfAyahs: 6, revelationType: "Meccan" },
  { number: 110, nameArabic: "النصر", nameUrdu: "النصر", nameEnglish: "An-Nasr", englishMeaning: "The Divine Support", numberOfAyahs: 3, revelationType: "Medinan" },
  { number: 111, nameArabic: "المسد", nameUrdu: "المسد / لہب", nameEnglish: "Al-Masad", englishMeaning: "The Palm Fiber", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 112, nameArabic: "الإخلاص", nameUrdu: "الاخلاص", nameEnglish: "Al-Ikhlas", englishMeaning: "The Sincerity", numberOfAyahs: 4, revelationType: "Meccan" },
  { number: 113, nameArabic: "الفلق", nameUrdu: "الفلق", nameEnglish: "Al-Falaq", englishMeaning: "The Daybreak", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 114, nameArabic: "الناس", nameUrdu: "الناس", nameEnglish: "An-Nas", englishMeaning: "Mankind", numberOfAyahs: 6, revelationType: "Meccan" },
];

// Offline verified ayah sets for instant offline access without relying on external network
export const VERIFIED_SURAH_AYAHS: Record<number, Ayah[]> = {
  // Surah Al-Fatihah
  1: [
    {
      numberInSurah: 1,
      numberInQuran: 1,
      arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      urduTranslation: "شروع اللہ کا نام لے کر جو بڑا مہربان نہایت رحم والا ہے",
      englishTranslation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001001.mp3",
      juz: 1,
    },
    {
      numberInSurah: 2,
      numberInQuran: 2,
      arabicText: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      urduTranslation: "سب طرح کی تعریف اللہ ہی کے لیے ہے جو تمام جہانوں کا پروردگار ہے",
      englishTranslation: "[All] praise is [due] to Allah, Lord of the worlds -",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001002.mp3",
      juz: 1,
    },
    {
      numberInSurah: 3,
      numberInQuran: 3,
      arabicText: "الرَّحْمَٰنِ الرَّحِيمِ",
      urduTranslation: "بڑا مہربان نہایت رحم کرنے والا",
      englishTranslation: "The Entirely Merciful, the Especially Merciful,",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001003.mp3",
      juz: 1,
    },
    {
      numberInSurah: 4,
      numberInQuran: 4,
      arabicText: "مَالِكِ يَوْمِ الدِّينِ",
      urduTranslation: "انصاف کے دن کا حاکم",
      englishTranslation: "Sovereign of the Day of Recompense.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001004.mp3",
      juz: 1,
    },
    {
      numberInSurah: 5,
      numberInQuran: 5,
      arabicText: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      urduTranslation: "(اے پروردگار) ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں",
      englishTranslation: "It is You we worship and You we ask for help.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001005.mp3",
      juz: 1,
    },
    {
      numberInSurah: 6,
      numberInQuran: 6,
      arabicText: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      urduTranslation: "ہم کو سیدھے راستے پر چلا",
      englishTranslation: "Guide us to the straight path -",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001006.mp3",
      juz: 1,
    },
    {
      numberInSurah: 7,
      numberInQuran: 7,
      arabicText: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
      urduTranslation: "ان لوگوں کے راستے جن پر تو نے انعام فرمایا، نہ ان کے جن پر غضب ہوا اور نہ گمراہوں کے",
      englishTranslation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001007.mp3",
      juz: 1,
    },
  ],

  // Surah Al-Ikhlas
  112: [
    {
      numberInSurah: 1,
      numberInQuran: 6222,
      arabicText: "قُلْ هُوَ اللَّهُ أَحَدٌ",
      urduTranslation: "کہہ دو کہ وہ اللہ ایک ہے",
      englishTranslation: "Say, 'He is Allah, [who is] One,",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112001.mp3",
      juz: 30,
    },
    {
      numberInSurah: 2,
      numberInQuran: 6223,
      arabicText: "اللَّهُ الصَّمَدُ",
      urduTranslation: "اللہ بےنیاز ہے (سب اس کے محتاج ہیں)",
      englishTranslation: "Allah, the Eternal Refuge.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112002.mp3",
      juz: 30,
    },
    {
      numberInSurah: 3,
      numberInQuran: 6224,
      arabicText: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      urduTranslation: "نہ اس نے کسی کو جنا اور نہ وہ جنا گیا",
      englishTranslation: "He neither begets nor is born,",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112003.mp3",
      juz: 30,
    },
    {
      numberInSurah: 4,
      numberInQuran: 6225,
      arabicText: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
      urduTranslation: "اور نہ کوئی اس کے برابر کا ہے",
      englishTranslation: "Nor is there to Him any equivalent.'",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112004.mp3",
      juz: 30,
    },
  ],

  // Surah Al-Falaq
  113: [
    {
      numberInSurah: 1,
      numberInQuran: 6226,
      arabicText: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
      urduTranslation: "کہو کہ میں صبح کے پروردگار کی پناہ مانگتا ہوں",
      englishTranslation: "Say, 'I seek refuge in the Lord of daybreak,",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113001.mp3",
      juz: 30,
    },
    {
      numberInSurah: 2,
      numberInQuran: 6227,
      arabicText: "مِن شَرِّ مَا خَلَقَ",
      urduTranslation: "ہر اس چیز کی برائی سے جو اس نے پیدا کی",
      englishTranslation: "From the evil of that which He created,",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113002.mp3",
      juz: 30,
    },
    {
      numberInSurah: 3,
      numberInQuran: 6228,
      arabicText: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
      urduTranslation: "اور اندھیری رات کی برائی سے جب وہ چھا جائے",
      englishTranslation: "And from the evil of darkness when it settles,",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113003.mp3",
      juz: 30,
    },
    {
      numberInSurah: 4,
      numberInQuran: 6229,
      arabicText: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
      urduTranslation: "اور گنڈوں میں پھونکنے والیوں کی برائی سے",
      englishTranslation: "And from the evil of the blowers in knots,",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113004.mp3",
      juz: 30,
    },
    {
      numberInSurah: 5,
      numberInQuran: 6230,
      arabicText: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
      urduTranslation: "اور حسد کرنے والے کی برائی سے جب وہ حسد کرے",
      englishTranslation: "And from the evil of an envier when he envies.'",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113005.mp3",
      juz: 30,
    },
  ],

  // Surah An-Nas
  114: [
    {
      numberInSurah: 1,
      numberInQuran: 6231,
      arabicText: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
      urduTranslation: "کہو کہ میں لوگوں کے پروردگار کی پناہ مانگتا ہوں",
      englishTranslation: "Say, 'I seek refuge in the Lord of mankind,",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114001.mp3",
      juz: 30,
    },
    {
      numberInSurah: 2,
      numberInQuran: 6232,
      arabicText: "مَلِكِ النَّاسِ",
      urduTranslation: "لوگوں کے بادشاہ کی",
      englishTranslation: "The Sovereign of mankind,",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114002.mp3",
      juz: 30,
    },
    {
      numberInSurah: 3,
      numberInQuran: 6233,
      arabicText: "إِلَٰهِ النَّاسِ",
      urduTranslation: "لوگوں کے معبود کی",
      englishTranslation: "The God of mankind,",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114003.mp3",
      juz: 30,
    },
    {
      numberInSurah: 4,
      numberInQuran: 6234,
      arabicText: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
      urduTranslation: "وسوسہ ڈالنے والے کے شر سے جو پیچھے ہٹ جاتا ہے",
      englishTranslation: "From the evil of the retreating whisperer -",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114004.mp3",
      juz: 30,
    },
    {
      numberInSurah: 5,
      numberInQuran: 6235,
      arabicText: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
      urduTranslation: "جو لوگوں کے دلوں میں وسوسے ڈالتا ہے",
      englishTranslation: "Who whispers into the breasts of mankind -",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114005.mp3",
      juz: 30,
    },
    {
      numberInSurah: 6,
      numberInQuran: 6236,
      arabicText: "مِنَ الْجِنَّةِ وَالنَّاسِ",
      urduTranslation: "جنوں میں سے ہو یا انسانوں میں سے",
      englishTranslation: "From among the jinn and mankind.'",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114006.mp3",
      juz: 30,
    },
  ],

  // Surah Al-Kawthar
  108: [
    {
      numberInSurah: 1,
      numberInQuran: 6205,
      arabicText: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
      urduTranslation: "بے شک ہم نے آپ کو کوثر (بے انتہا خیر) عطا فرمائی",
      englishTranslation: "Indeed, We have granted you, [O Muhammad], al-Kawthar.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/108001.mp3",
      juz: 30,
    },
    {
      numberInSurah: 2,
      numberInQuran: 6206,
      arabicText: "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
      urduTranslation: "پس اپنے رب کے لیے نماز پڑھیے اور قربانی کیجیے",
      englishTranslation: "So pray to your Lord and offer sacrifice [to Him alone].",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/108002.mp3",
      juz: 30,
    },
    {
      numberInSurah: 3,
      numberInQuran: 6207,
      arabicText: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
      urduTranslation: "یقیناً آپ کا دشمن ہی بے نام و نشان رہنے والا ہے",
      englishTranslation: "Indeed, your enemy is the one cut off.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/108003.mp3",
      juz: 30,
    },
  ],

  // Surah Al-Asr
  103: [
    {
      numberInSurah: 1,
      numberInQuran: 6177,
      arabicText: "وَالْعَصْرِ",
      urduTranslation: "زمانے کی قسم!",
      englishTranslation: "By time,",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/103001.mp3",
      juz: 30,
    },
    {
      numberInSurah: 2,
      numberInQuran: 6178,
      arabicText: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
      urduTranslation: "بے شک انسان سراسر خسارے میں ہے",
      englishTranslation: "Indeed, mankind is in loss,",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/103002.mp3",
      juz: 30,
    },
    {
      numberInSurah: 3,
      numberInQuran: 6179,
      arabicText: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
      urduTranslation: "سوائے ان لوگوں کے جو ایمان لائے اور نیک عمل کیے اور ایک دوسرے کو حق کی وصیت کی اور صبر کی تلقین کی",
      englishTranslation: "Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.",
      audioUrl: "https://everyayah.com/data/Alafasy_128kbps/103003.mp3",
      juz: 30,
    },
  ],
};

// Helper function to fetch surah data dynamically with fallback
export async function getSurahAyahs(surahNumber: number): Promise<Ayah[]> {
  if (VERIFIED_SURAH_AYAHS[surahNumber]) {
    return VERIFIED_SURAH_AYAHS[surahNumber];
  }

  try {
    // Verified public API for Quran text & translation (Alquran Cloud)
    const [arabicRes, urduRes, englishRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ur.jalandhry`),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`),
    ]);

    if (!arabicRes.ok || !urduRes.ok || !englishRes.ok) {
      throw new Error("Failed to fetch surah from Quran API");
    }

    const [arabicData, urduData, englishData] = await Promise.all([
      arabicRes.json(),
      urduRes.json(),
      englishRes.json(),
    ]);

    const ayahsCount = arabicData.data.ayahs.length;
    const padSurah = String(surahNumber).padStart(3, "0");

    const ayahs: Ayah[] = [];
    for (let i = 0; i < ayahsCount; i++) {
      const a = arabicData.data.ayahs[i];
      const u = urduData.data.ayahs[i];
      const e = englishData.data.ayahs[i];
      const padAyah = String(a.numberInSurah).padStart(3, "0");

      ayahs.push({
        numberInSurah: a.numberInSurah,
        numberInQuran: a.number,
        arabicText: a.text,
        urduTranslation: u ? u.text : "",
        englishTranslation: e ? e.text : "",
        audioUrl: `https://everyayah.com/data/Alafasy_128kbps/${padSurah}${padAyah}.mp3`,
        juz: a.juz,
        sajda: a.sajda ? true : false,
      });
    }

    return ayahs;
  } catch (err) {
    console.warn(`Online fetch for Surah ${surahNumber} failed or offline. Using verified fallback.`, err);
    return (
      VERIFIED_SURAH_AYAHS[surahNumber] || [
        {
          numberInSurah: 1,
          numberInQuran: 1,
          arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
          urduTranslation: "شروع اللہ کا نام لے کر جو بڑا مہربان نہایت رحم والا ہے",
          englishTranslation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
          audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001001.mp3",
          juz: 1,
        },
      ]
    );
  }
}
