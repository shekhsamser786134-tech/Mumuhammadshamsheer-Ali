import React, { useState } from "react";
import { Smartphone, Phone, MessageSquare, Mail, Calendar, Compass, Search, Settings, ShieldAlert, CheckCircle2, ChevronRight, Bell } from "lucide-react";
import { DeviceActionModal } from "./DeviceActionModal";

export const DeviceControlView: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"call" | "sms" | "email" | "map" | "calendar" | "search" | "settings">("call");
  const [actionData, setActionData] = useState<Record<string, string>>({});
  const [phoneInput, setPhoneInput] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [mapQuery, setMapQuery] = useState("");
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderTime, setReminderTime] = useState("");

  const triggerAction = (type: any, data: Record<string, string>) => {
    setActionType(type);
    setActionData(data);
    setModalOpen(true);
  };

  const handleConfirmAction = () => {
    setModalOpen(false);
    if (actionType === "call") {
      window.location.href = `tel:${actionData.number || ""}`;
    } else if (actionType === "sms") {
      window.location.href = `sms:${actionData.number || ""}?body=${encodeURIComponent(actionData.message || "")}`;
    } else if (actionType === "email") {
      window.location.href = `mailto:${actionData.email || ""}?subject=${encodeURIComponent(actionData.subject || "")}`;
    } else if (actionType === "map") {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(actionData.destination || "")}`, "_blank");
    } else if (actionType === "calendar") {
      const title = encodeURIComponent(actionData.title || "Reminder");
      const details = encodeURIComponent("Created via SHAHEENA Personal Assistant");
      window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`, "_blank");
    } else if (actionType === "settings") {
      // In Android WebView / PWA, deep link into settings or provide guide
      try {
        window.location.href = "intent:#Intent;action=android.settings.SETTINGS;end";
      } catch (e) {
        window.open("https://support.google.com/android/answer/9079129", "_blank");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 text-left">
      {/* Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 mb-1 tracking-wider uppercase">
          <Smartphone className="w-4 h-4" />
          <span>Mobile Device Integrations</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Android Actions & Device Control
        </h1>
        <p className="font-nastaliq text-sm text-purple-300">
          اینڈرائیڈ موبائل فون کنٹرول اور نظام کے امور میں معاونت
        </p>
      </div>

      {/* Safety Notice */}
      <div className="mb-8 p-4 rounded-2xl bg-amber-950/20 border border-amber-600/30 flex items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-amber-200">Android Security & Privacy Compliance</div>
          <p className="leading-relaxed">
            SHAHEENA strictly adheres to Android security sandboxes. Sensitive actions such as phone dialing, messaging, and event scheduling always require your explicit confirmation modal before execution. No background unauthorized access is permitted.
          </p>
        </div>
      </div>

      {/* Quick Launch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Phone Call Card */}
        <div className="p-5 rounded-2xl bg-[#0f111e] border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700/40 text-emerald-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Direct Phone Call</h3>
                <span className="font-nastaliq text-xs text-emerald-400">فون کال ملائیں</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Enter any phone number or contact to trigger your Android Phone dialer.
            </p>
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="e.g. +92 300 1234567"
              className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white mb-3 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            onClick={() => triggerAction("call", { number: phoneInput || "121" })}
            className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Launch Phone Dialer</span>
          </button>
        </div>

        {/* SMS Message Card */}
        <div className="p-5 rounded-2xl bg-[#0f111e] border border-slate-800 hover:border-sky-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-sky-950/60 border border-sky-700/40 text-sky-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Compose SMS Message</h3>
                <span className="font-nastaliq text-xs text-sky-400">پیغام (ایس ایم ایس) ارسال کریں</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Prepare a text message and launch the default SMS app with pre-filled content.
            </p>
            <input
              type="text"
              value={smsMessage}
              onChange={(e) => setSmsMessage(e.target.value)}
              placeholder="e.g. السلام علیکم، میں کچھ دیر میں پہنچ رہا ہوں۔"
              className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white mb-3 focus:outline-none focus:border-sky-500"
            />
          </div>
          <button
            onClick={() => triggerAction("sms", { number: phoneInput || "", message: smsMessage || "السلام علیکم" })}
            className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Open Messaging App</span>
          </button>
        </div>

        {/* Maps & Navigation Card */}
        <div className="p-5 rounded-2xl bg-[#0f111e] border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-teal-950/60 border border-teal-700/40 text-teal-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Maps & Directions</h3>
                <span className="font-nastaliq text-xs text-teal-400">نقشہ اور قریبی مساجد</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Find nearby mosques, halal food, or any destination via Google Maps.
            </p>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setMapQuery("Nearest Mosque مسجد")}
                className="px-2 py-1 text-[11px] rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                قریبی مسجد
              </button>
              <button
                onClick={() => setMapQuery("Halal Restaurant")}
                className="px-2 py-1 text-[11px] rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                حلال کھانا
              </button>
            </div>
            <input
              type="text"
              value={mapQuery}
              onChange={(e) => setMapQuery(e.target.value)}
              placeholder="e.g. Badshahi Mosque Lahore"
              className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white mb-3 focus:outline-none focus:border-teal-500"
            />
          </div>
          <button
            onClick={() => triggerAction("map", { destination: mapQuery || "Mosque" })}
            className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
          </button>
        </div>

        {/* Calendar & Reminders Card */}
        <div className="p-5 rounded-2xl bg-[#0f111e] border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-700/40 text-amber-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Calendar Reminder</h3>
                <span className="font-nastaliq text-xs text-amber-400">کیلنڈر اور نماز کا الارم</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Schedule prayer times, Islamic lectures, or personal appointments.
            </p>
            <input
              type="text"
              value={reminderTitle}
              onChange={(e) => setReminderTitle(e.target.value)}
              placeholder="e.g. نمازِ جمعہ یا قرآن مطالعہ"
              className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white mb-3 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            onClick={() => triggerAction("calendar", { title: reminderTitle || "Islamic Lecture Reminder" })}
            className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule in Calendar</span>
          </button>
        </div>
      </div>

      {/* Step-by-Step Android System Functions Guide */}
      <div className="p-6 rounded-2xl bg-[#0d0f1a] border border-slate-800">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Settings className="w-4 h-4 text-purple-400" />
          <span>Step-by-Step Android System Assistance</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          How to configure key Android settings for seamless assistant performance:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="font-semibold text-purple-300 mb-1">1. Battery Optimization Exemption</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              To keep voice responses fast, go to <strong>Settings &gt; Apps &gt; SHAHEENA &gt; Battery</strong> and select <strong>"Unrestricted"</strong>.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="font-semibold text-teal-300 mb-1">2. Microphone Permissions</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Enable continuous voice input in <strong>Settings &gt; Apps &gt; Permissions &gt; Microphone</strong> and set to <strong>"Allow while using app"</strong>.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="font-semibold text-emerald-300 mb-1">3. Default Assistant Setup</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Set SHAHEENA or your browser as the preferred assistant app in <strong>Settings &gt; Apps &gt; Default Apps &gt; Digital Assistant</strong>.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => triggerAction("settings", {})}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600/80 hover:bg-purple-600 rounded-xl transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Launch Android Settings Intent</span>
          </button>
        </div>
      </div>

      <DeviceActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmAction}
        actionType={actionType}
        actionData={actionData}
      />
    </div>
  );
};
