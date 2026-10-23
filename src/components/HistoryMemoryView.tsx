import React, { useState, useEffect } from "react";
import { UserProfileMemory, ConversationSession, DeviceNote } from "../types";
import {
  History,
  Brain,
  Smartphone,
  Trash2,
  Plus,
  BookOpen,
  Check,
  Search,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Volume2
} from "lucide-react";

interface HistoryMemoryViewProps {
  userProfile: UserProfileMemory;
  onUpdateProfile: (profile: UserProfileMemory) => void;
  onOpenApkGuide: () => void;
  onOpenDeviceTab: () => void;
  onLoadSession?: (session: ConversationSession) => void;
}

export const HistoryMemoryView: React.FC<HistoryMemoryViewProps> = ({
  userProfile,
  onUpdateProfile,
  onOpenApkGuide,
  onOpenDeviceTab,
  onLoadSession,
}) => {
  const [sessions, setSessions] = useState<ConversationSession[]>(() => {
    try {
      const saved = localStorage.getItem("shaheena_chat_sessions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notes, setNotes] = useState<DeviceNote[]>(() => {
    try {
      const saved = localStorage.getItem("shaheena_device_notes");
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: "note-1",
              title: "مطالعہ قرآن",
              content: "روزانہ فجر کے بعد سورۃ یٰسین اور سورۃ الرحمن کی تلاوت۔",
              createdAt: new Date().toLocaleDateString(),
            },
          ];
    } catch {
      return [];
    }
  });

  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);
  const [newMemoryNote, setNewMemoryNote] = useState("");

  const handleAddMemory = () => {
    if (!newMemoryNote.trim()) return;
    const updated = {
      ...userProfile,
      notes: [...(userProfile.notes || []), newMemoryNote.trim()],
    };
    onUpdateProfile(updated);
    setNewMemoryNote("");
  };

  const handleRemoveMemory = (index: number) => {
    const updatedNotes = [...userProfile.notes];
    updatedNotes.splice(index, 1);
    onUpdateProfile({
      ...userProfile,
      notes: updatedNotes,
    });
  };

  const handleSaveNote = () => {
    if (!newNoteTitle.trim() && !newNoteContent.trim()) return;
    const newNote: DeviceNote = {
      id: `note-${Date.now()}`,
      title: newNoteTitle.trim() || "غیر عنوان شدہ نوٹ",
      content: newNoteContent.trim(),
      createdAt: new Date().toLocaleDateString(),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem("shaheena_device_notes", JSON.stringify(updated));
    setNewNoteTitle("");
    setNewNoteContent("");
    setShowAddNote(false);
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    localStorage.setItem("shaheena_device_notes", JSON.stringify(updated));
  };

  const handleClearAllHistory = () => {
    if (window.confirm("کیا آپ واقعی تمام سابقہ چیٹ ہسٹری صاف کرنا چاہتے ہیں؟")) {
      setSessions([]);
      localStorage.removeItem("shaheena_chat_sessions");
      localStorage.removeItem("shaheena_chat_messages");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 text-left">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-purple-900/30">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-purple-400" />
            <span>تاریخچہ و یادداشت</span>
            <span className="text-sm font-nastaliq text-purple-300">History & Memory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-nastaliq">
            آپ کی سابقہ گفتگو، محفوظ شدہ یادداشتیں، اور ذاتی نوٹس
          </p>
        </div>

        <button
          onClick={onOpenApkGuide}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-950/80 hover:bg-teal-900 border border-teal-500/50 text-teal-300 text-xs font-semibold shadow-sm transition-all"
        >
          <Smartphone className="w-4 h-4" />
          <span>APK Install Guide</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Long-Term Memory & Profile */}
        <div className="space-y-6">
          {/* AI Memory Management */}
          <div className="p-5 rounded-2xl bg-[#0f1122] border border-purple-900/30 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white font-nastaliq text-base">
                  شاہینہ کی طویل المدتی یادداشت (Long-Term Memory)
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/40">
                Local Only
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4 font-nastaliq leading-relaxed">
              شاہینہ یہ ذاتی ترجیحات محفوظ رکھتی ہے تاکہ آپ کو بہتر اور ہمدردانہ جوابات دے سکے۔ آپ جب چاہیں حذف کر سکتے ہیں۔
            </p>

            {/* Existing Memory Facts */}
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
              {userProfile.notes && userProfile.notes.length > 0 ? (
                userProfile.notes.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-purple-900/20 text-xs text-purple-100"
                  >
                    <span className="font-nastaliq leading-relaxed select-text">{item}</span>
                    <button
                      onClick={() => handleRemoveMemory(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                      title="یادداشت حذف کریں"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500 font-nastaliq text-center">
                  ابھی کوئی یادداشت محفوظ نہیں کی گئی۔
                </div>
              )}
            </div>

            {/* Add Memory Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMemoryNote}
                onChange={(e) => setNewMemoryNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddMemory()}
                placeholder="مثلاً: میری والدہ کی صحت کے لیے دعا کیجیے..."
                className="flex-1 bg-slate-900 border border-purple-900/30 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 font-nastaliq text-right focus:outline-none focus:border-purple-500"
                dir="rtl"
              />
              <button
                onClick={handleAddMemory}
                disabled={!newMemoryNote.trim()}
                className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-semibold shrink-0"
              >
                شامل کریں
              </button>
            </div>
          </div>

          {/* Android Native Integration & Device Actions Link */}
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-emerald-950/30 to-teal-950/20 border border-emerald-600/30 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-nastaliq text-base">
                  اینڈرائیڈ ڈیوائس ایکشنز (Native Intents)
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 font-nastaliq leading-relaxed mb-3">
              کال ملانا، واٹس ایپ پیغام بھیجنا، کیمرہ آن کرنا، الارم سیٹ کرنا، اور قریبی مساجد تلاش کرنا۔
            </p>
            <button
              onClick={onOpenDeviceTab}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all font-nastaliq"
            >
              <span>تمام ڈیوائس ایکشنز دیکھیں</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: User Notes & Chat History Sessions */}
        <div className="space-y-6">
          {/* Saved Personal Notes */}
          <div className="p-5 rounded-2xl bg-[#0f1122] border border-purple-900/30 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white font-nastaliq text-base">
                  محفوظ کردہ نوٹس (Notes)
                </h3>
              </div>
              <button
                onClick={() => setShowAddNote(!showAddNote)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 border border-purple-700 text-purple-200 text-xs font-nastaliq"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>نیا نوٹ</span>
              </button>
            </div>

            {/* Add note form */}
            {showAddNote && (
              <div className="mb-4 p-3 rounded-xl bg-slate-900/90 border border-purple-850 space-y-2">
                <input
                  type="text"
                  placeholder="نوٹ کا عنوان..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 font-nastaliq text-right"
                  dir="rtl"
                />
                <textarea
                  placeholder="نوٹ کی تفصیل لکھیں..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 font-nastaliq text-right"
                  dir="rtl"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowAddNote(false)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs"
                  >
                    منسوخ
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
                  >
                    محفوظ کریں
                  </button>
                </div>
              </div>
            )}

            {/* Notes list */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-right space-y-1 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="text-xs font-bold text-teal-300 font-nastaliq">
                        {note.title}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 font-nastaliq leading-relaxed whitespace-pre-line select-text">
                      {note.content}
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono text-left">
                      {note.createdAt}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500 font-nastaliq">
                  کوئی نوٹ موجود نہیں۔ نیا نوٹ بنانے کے لیے اوپر کلک کریں۔
                </div>
              )}
            </div>
          </div>

          {/* Past Sessions List */}
          <div className="p-5 rounded-2xl bg-[#0f1122] border border-purple-900/30 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white font-nastaliq text-base">
                  سابقہ چیٹ سیشنز (Chat Sessions)
                </h3>
              </div>
              {sessions.length > 0 && (
                <button
                  onClick={handleClearAllHistory}
                  className="text-rose-400 hover:text-rose-300 text-xs font-nastaliq flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>سب صاف کریں</span>
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {sessions.length > 0 ? (
                sessions.map((sess) => (
                  <div
                    key={sess.id}
                    onClick={() => onLoadSession && onLoadSession(sess)}
                    className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-purple-950/50 border border-slate-800 hover:border-purple-700/50 cursor-pointer transition-colors text-right flex items-center justify-between"
                  >
                    <span className="text-[10px] text-slate-500 font-mono">
                      {sess.messages.length} messages
                    </span>
                    <span className="text-xs font-semibold text-slate-200 font-nastaliq truncate max-w-[200px]">
                      {sess.title || "گفتگو کا سیشن"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-slate-500 font-nastaliq">
                  سابقہ سیشنز کی گفتگو یہاں محفوظ ہوگی۔
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
