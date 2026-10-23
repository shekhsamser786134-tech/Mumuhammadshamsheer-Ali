import React, { useState } from "react";
import { UserProfileMemory } from "../types";
import { Brain, Plus, Trash2, X, Check, ShieldCheck } from "lucide-react";

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfileMemory;
  onUpdateProfile: (updated: UserProfileMemory) => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
}) => {
  const [newFact, setNewFact] = useState("");
  const [userName, setUserName] = useState(userProfile.name || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAddFact = () => {
    if (!newFact.trim()) return;
    const updatedNotes = [...(userProfile.notes || []), newFact.trim()];
    onUpdateProfile({ ...userProfile, name: userName, notes: updatedNotes });
    setNewFact("");
    triggerSaved();
  };

  const handleDeleteFact = (index: number) => {
    const updatedNotes = userProfile.notes.filter((_, i) => i !== index);
    onUpdateProfile({ ...userProfile, notes: updatedNotes });
    triggerSaved();
  };

  const handleSaveName = () => {
    onUpdateProfile({ ...userProfile, name: userName });
    triggerSaved();
  };

  const triggerSaved = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#0e101d] border border-purple-900/30 rounded-2xl p-6 shadow-2xl relative text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-700/40 text-purple-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">SHAHEENA Personal Memory</h3>
            <p className="font-nastaliq text-xs text-purple-300 -mt-0.5">شاہینہ کی طویل مدتی یادداشت اور ترجیحات</p>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          SHAHEENA remembers key information about you to provide tailored, context-aware answers. You have complete control to view, add, or erase saved memories at any time.
        </p>

        {/* User Name Field */}
        <div className="mb-5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Your Name / آپ کا اسم گرامی:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. احمد یا Bilal"
              className="flex-1 px-3 py-1.5 text-xs bg-slate-950/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleSaveName}
              className="px-3 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        {/* Add Memory Fact */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Add New Fact or Preference / نئی یادداشت شامل کریں:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newFact}
              onChange={(e) => setNewFact(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddFact()}
              placeholder="e.g. I am interested in Islamic history; Prefer Urdu answers"
              className="flex-1 px-3 py-2 text-xs bg-slate-950/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleAddFact}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Saved Facts List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">
              Saved Memories ({userProfile.notes?.length || 0})
            </span>
            {savedSuccess && (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Updated
              </span>
            )}
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {userProfile.notes && userProfile.notes.length > 0 ? (
              userProfile.notes.map((note, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-200"
                >
                  <span className="truncate">{note}</span>
                  <button
                    onClick={() => handleDeleteFact(index)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    title="Delete Memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 text-center rounded-xl bg-slate-900/30 border border-dashed border-slate-800 text-xs text-slate-500">
                No custom memories stored yet. Add facts above to personalize SHAHEENA.
              </div>
            )}
          </div>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Memories are stored locally in your browser/device and never sold or shared.</span>
        </div>
      </div>
    </div>
  );
};
