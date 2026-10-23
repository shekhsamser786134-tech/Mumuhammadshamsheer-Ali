import React, { useState } from "react";
import { Smartphone, Check, Copy, X, Terminal, Shield, Cpu, AlertTriangle } from "lucide-react";

interface ApkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkGuideModal: React.FC<ApkGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const bubblewrapCode = `# 1. Install Google Bubblewrap CLI (Official Google TWA APK Builder)
npm install -g @bubblewrap/cli

# 2. Initialize Android Project pointing to SHAHEENA
bubblewrap init --manifest=https://YOUR_DEPLOYED_URL/manifest.webmanifest

# 3. Build signed installable Android APK
bubblewrap build

# Output: app-release-signed.apk ready to install on any Android phone!`;

  const capacitorCode = `# Step 1: Install Capacitor Native Runtime
npm install @capacitor/core @capacitor/cli @capacitor/android

# Step 2: Initialize Android Project
npx cap init "SHAHEENA" "com.shamsheer.shaheena" --web-dir dist

# Step 3: Build Web Assets
npm run build

# Step 4: Add Android Platform & Open in Android Studio
npx cap add android
npx cap open android

# Step 5: In Android Studio -> Build -> Build APK(s)`;

  const foregroundServiceManifest = `<!-- AndroidManifest.xml Foreground Microphone Service -->
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<service
    android:name=".ShaheenaVoiceService"
    android:foregroundServiceType="microphone"
    android:exported="false" />`;

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0e101c] border border-teal-600/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-left my-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-teal-950/60 border border-teal-700/40 text-teal-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">SHAHEENA Android APK & Native Architecture</h3>
            <p className="font-nastaliq text-xs text-teal-300 -mt-0.5">
              اینڈرائیڈ اے پی کے (APK) اور نیٹو سسٹمز کا مکمل خاکہ
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-6 leading-relaxed">
          SHAHEENA کو شمشیر أسلم نے جدید PWA، Trusted Web Activity (TWA) اور Capacitor نیٹو آرکیٹیکچر کے ساتھ تیار کیا ہے۔ آپ اسے بغیر فیس یا لائسنس کے حقیقی اینڈرائیڈ فون پر انسٹال کر کے چلا سکتے ہیں۔
        </p>

        {/* Method 1: Instant Chrome Install */}
        <div className="mb-5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-teal-300 text-sm font-semibold">
            <span className="w-5 h-5 rounded-full bg-teal-900/60 text-teal-300 flex items-center justify-center text-xs">1</span>
            <span>Instant Android Installation (No build tools needed)</span>
          </div>
          <p className="text-xs text-slate-300 mb-1 leading-relaxed">
            اینڈرائیڈ فون پر گوگل کروم میں اس ایپ کو کھولیں۔ کروم مینو (⋮) پر کلک کر کے <strong>"Add to Home screen" / "Install app"</strong> منتخب کریں۔ یہ فون پر اپنے منفرد آئیکون، فل اسکرین اور آف لائن صلاحیت کے ساتھ انسٹال ہو جائے گی۔
          </p>
        </div>

        {/* Method 2: Capacitor Native Android Project */}
        <div className="mb-5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-purple-300 text-sm font-semibold">
              <span className="w-5 h-5 rounded-full bg-purple-900/60 text-purple-300 flex items-center justify-center text-xs">2</span>
              <span>Capacitor Native Android Studio APK Build</span>
            </div>
            <button
              onClick={() => handleCopy(capacitorCode, "capacitor")}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
            >
              {copiedSection === "capacitor" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSection === "capacitor" ? "Copied" : "Copy commands"}</span>
            </button>
          </div>
          <pre className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] font-mono text-purple-200 overflow-x-auto">
            {capacitorCode}
          </pre>
        </div>

        {/* Method 3: Google Bubblewrap CLI */}
        <div className="mb-5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-cyan-300 text-sm font-semibold">
              <span className="w-5 h-5 rounded-full bg-cyan-900/60 text-cyan-300 flex items-center justify-center text-xs">3</span>
              <span>Google Bubblewrap TWA CLI</span>
            </div>
            <button
              onClick={() => handleCopy(bubblewrapCode, "bubblewrap")}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
            >
              {copiedSection === "bubblewrap" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSection === "bubblewrap" ? "Copied" : "Copy commands"}</span>
            </button>
          </div>
          <pre className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] font-mono text-cyan-200 overflow-x-auto">
            {bubblewrapCode}
          </pre>
        </div>

        {/* Android Background Microphone Privacy & Reality Disclosure */}
        <div className="mb-5 p-4 rounded-2xl bg-amber-950/30 border border-amber-600/40 text-xs text-amber-200">
          <div className="flex items-center gap-2 mb-2 font-semibold text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Android Background Microphone & Wake Phrase Reality</span>
          </div>
          <p className="leading-relaxed mb-2 font-nastaliq text-xs">
            اینڈرائیڈ 11/12/13/14+ کے سیکیورٹی قوانین کے تحت، کوئی بھی ایپ بیک گراؤنڈ میں مائیکروفون تب تک استعمال نہیں کر سکتی جب تک صارف نے واضح اجازت نہ دی ہو اور نوٹیفکیشن بار میں مستقل <strong>Foreground Service</strong> نوٹیفکیشن موجود نہ ہو۔
          </p>
          <pre className="p-2.5 rounded-lg bg-black/50 border border-amber-800/40 text-[10px] font-mono text-amber-100 overflow-x-auto mb-2">
            {foregroundServiceManifest}
          </pre>
          <p className="text-[11px] text-amber-300 font-nastaliq">
            ایپ کے اندر ہینڈز فری لائیو موڈ بغیر کسی وقفے کے مکمل طور پر کام کرتا ہے۔ ایپ مکمل بند ہونے پر مستقل بیک گراؤنڈ مائیک کو چلانا بیٹری ختم کرتا ہے اور اینڈرائیڈ سیکیورٹی اسے بلاک کر سکتی ہے۔
          </p>
        </div>

        {/* Native Permissions & Integration Status */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
          <h4 className="font-semibold text-white mb-2 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Supported Real Android Intents</span>
          </h4>
          <ul className="space-y-1.5 text-slate-400 text-[11px]">
            <li>• <strong>Calls</strong>: <code className="text-teal-300">tel:</code> intent (with user safety confirmation modal)</li>
            <li>• <strong>SMS</strong>: <code className="text-teal-300">sms:</code> intent (with confirmation before sending)</li>
            <li>• <strong>Alarms & Clock</strong>: <code className="text-teal-300">android.intent.action.SET_ALARM</code></li>
            <li>• <strong>Camera</strong>: Direct hardware shutter invocation via environment capture</li>
            <li>• <strong>Apps & Media</strong>: YouTube, WhatsApp, Google Maps, Music, Calculator deep-links</li>
            <li>• <strong>Sharing</strong>: Native Android Share Sheet via <code className="text-teal-300">navigator.share()</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
};
