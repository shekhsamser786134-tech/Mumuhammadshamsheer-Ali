import React from "react";
import { AlertTriangle, Phone, MessageSquare, Mail, Calendar, Compass, Settings, Check, X } from "lucide-react";

interface DeviceActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: "call" | "sms" | "email" | "map" | "calendar" | "search" | "settings";
  actionData: Record<string, string>;
}

export const DeviceActionModal: React.FC<DeviceActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  actionData,
}) => {
  if (!isOpen) return null;

  const actionMeta: Record<
    string,
    { title: string; titleUrdu: string; icon: React.ReactNode; color: string; sensitive: boolean }
  > = {
    call: {
      title: "Initiate Phone Call",
      titleUrdu: "فون کال ملائیں",
      icon: <Phone className="w-6 h-6 text-emerald-400" />,
      color: "border-emerald-500/40 bg-emerald-950/20",
      sensitive: true,
    },
    sms: {
      title: "Compose SMS Message",
      titleUrdu: "پیغام (ایس ایم ایس) بھیجیں",
      icon: <MessageSquare className="w-6 h-6 text-sky-400" />,
      color: "border-sky-500/40 bg-sky-950/20",
      sensitive: true,
    },
    email: {
      title: "Send Email Message",
      titleUrdu: "ای میل ارسال کریں",
      icon: <Mail className="w-6 h-6 text-purple-400" />,
      color: "border-purple-500/40 bg-purple-950/20",
      sensitive: true,
    },
    calendar: {
      title: "Create Calendar Reminder",
      titleUrdu: "کیلنڈر میں یاددہانی شامل کریں",
      icon: <Calendar className="w-6 h-6 text-amber-400" />,
      color: "border-amber-500/40 bg-amber-950/20",
      sensitive: false,
    },
    map: {
      title: "Open Navigation & Maps",
      titleUrdu: "نقشہ اور راستہ تلاش کریں",
      icon: <Compass className="w-6 h-6 text-teal-400" />,
      color: "border-teal-500/40 bg-teal-950/20",
      sensitive: false,
    },
    settings: {
      title: "Launch Android Settings",
      titleUrdu: "فون کی سیٹنگز کھولیں",
      icon: <Settings className="w-6 h-6 text-slate-400" />,
      color: "border-slate-500/40 bg-slate-950/20",
      sensitive: false,
    },
  };

  const current = actionMeta[actionType] || actionMeta.settings;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0f111c] border border-purple-900/40 rounded-2xl p-6 shadow-2xl relative text-left">
        {/* Sensitive warning badge if required */}
        {current.sensitive && (
          <div className="flex items-center gap-2 mb-4 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>User Confirmation Required for Device Action</span>
          </div>
        )}

        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-xl border ${current.color}`}>{current.icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-white">{current.title}</h3>
            <p className="font-nastaliq text-sm text-purple-300 -mt-0.5">{current.titleUrdu}</p>
          </div>
        </div>

        {/* Action Details */}
        <div className="space-y-2 mb-6 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
          {Object.entries(actionData).map(([key, value]) => (
            <div key={key} className="flex justify-between gap-4">
              <span className="text-slate-400 capitalize">{key}:</span>
              <span className="text-slate-200 font-semibold truncate max-w-[200px]">{value}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-400 mb-6">
          SHAHEENA is ready to launch this Android native intent. Do you want to proceed?
        </p>

        {/* Confirmation buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Cancel (منسوخ)</span>
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 rounded-lg shadow-md transition-all font-semibold"
          >
            <Check className="w-4 h-4" />
            <span>Execute (اجرا کریں)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
