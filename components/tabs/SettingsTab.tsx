"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Save,
  Mail,
  Bell,
  Trash2,
  Check,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { UserSettings } from "../types";

interface SettingsTabProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
}

export function SettingsTab({
  settings,
  onUpdateSettings,
}: SettingsTabProps) {
  const [savingsGoal, setSavingsGoal] = useState(
    () => String(settings.savingsGoal || 5000)
  );
  const [bgUrl, setBgUrl] = useState(() => settings.bgImage || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testEmailSending, setTestEmailSending] = useState(false);
  const [testEmailSent, setTestEmailSent] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setBgUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdateSettings({
        savingsGoal: parseFloat(savingsGoal) || 5000,
        bgImage: bgUrl.trim() || null,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleTestDigest = async () => {
    if (testEmailSending) return;
    setTestEmailSending(true);
    try {
      await fetch("/api/cron/digest?period=daily", { method: "POST" });
      setTestEmailSent(true);
      setTimeout(() => setTestEmailSent(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setTestEmailSending(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="font-fraunces italic text-2xl font-bold text-[#7a2348]">
          Customizations & Settings ⚙️
        </h2>
        <p className="text-xs text-[#a9607f]">
          Personalize your Suvii Diary wallpaper, savings targets, and email notifications!
        </p>
      </div>

      {/* Settings Form */}
      <form
        onSubmit={handleSave}
        className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#f6d9e3] shadow-sm space-y-6"
      >
        {/* Custom Background Photo */}
        <div>
          <label className="block text-sm font-bold text-[#7a2348] mb-1 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-[#e0578a]" />
            Custom Background Photo Wallpaper
          </label>
          <p className="text-xs text-[#a9607f] mb-3">
            Upload any of your own photos or paste an image URL to set as your glowing custom website background!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <label className="w-full sm:w-auto bg-[#fff5f7] hover:bg-[#fde3ec] border border-[#f0c4d4] text-[#d6336c] px-4 py-2 rounded-xl text-xs font-bold cursor-pointer text-center transition-colors">
              📁 Choose photo from computer
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <span className="text-xs text-[#a9607f]">or</span>
            <input
              type="text"
              placeholder="https://... image URL"
              value={bgUrl}
              onChange={(e) => setBgUrl(e.target.value)}
              className="flex-1 w-full px-4 py-2 rounded-xl border border-[#f0c4d4] text-xs outline-none focus:border-[#e0578a] text-[#7a2348]"
            />
            {bgUrl && (
              <button
                type="button"
                onClick={() => setBgUrl("")}
                className="p-2 text-[#c98aa3] hover:text-[#d6336c] cursor-pointer"
                title="Remove custom background"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {bgUrl && (
            <div className="mt-3 relative w-full h-36 rounded-2xl overflow-hidden border border-[#f6d9e3] shadow-xs">
              <img
                src={bgUrl}
                alt="Background preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white text-xs font-bold">
                Wallpaper Preview
              </div>
            </div>
          )}
        </div>

        {/* Custom Savings Goal */}
        <div className="pt-4 border-t border-[#f6d9e3]">
          <label className="block text-sm font-bold text-[#7a2348] mb-1">
            🎯 Custom Savings Goal Target (₹)
          </label>
          <p className="text-xs text-[#a9607f] mb-2">
            Set your dream financial savings target.
          </p>
          <input
            type="number"
            value={savingsGoal}
            onChange={(e) => setSavingsGoal(e.target.value)}
            className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-[#f0c4d4] text-sm outline-none focus:border-[#e0578a] text-[#7a2348] font-bold"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-[#e0578a] to-[#d6336c] hover:opacity-90 text-white px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saved ? "Settings Saved!" : "Save Customizations"}</span>
          </button>
        </div>
      </form>

      {/* Test Emails & Notifications Card */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#f6d9e3] shadow-sm space-y-4">
        <h3 className="font-fraunces italic text-lg font-bold text-[#7a2348] flex items-center gap-2">
          <Mail className="w-5 h-5 text-[#e0578a]" />
          Email Reminders & Progress Digest
        </h3>
        <p className="text-xs text-[#a9607f] leading-relaxed">
          Suvii Diary automatically emails you when a task reminder is due and sends daily/weekly digests of your completed vs missed habits and tasks.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleTestDigest}
            disabled={testEmailSending}
            className="bg-[#fff5f7] hover:bg-[#fde3ec] border border-[#f0c4d4] text-[#7a2348] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {testEmailSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : testEmailSent ? (
              <Check className="w-4 h-4 text-[#3aa77c]" />
            ) : (
              <Mail className="w-4 h-4 text-[#e0578a]" />
            )}
            <span>{testEmailSent ? "Digest Email Sent!" : "Send Test Daily Digest Email"}</span>
          </button>
        </div>
      </div>

      {/* Guide on Vercel Cron, SMTP, and VAPID */}
      <div className="bg-white/80 p-6 rounded-3xl border border-[#f6d9e3] space-y-3 text-xs text-[#5c2138]">
        <h4 className="font-fraunces italic text-base font-bold text-[#7a2348] flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-[#8e62c6]" /> Deployment & SMTP Setup
        </h4>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Vercel Cron:</strong> Configured in <code>vercel.json</code> to check due tasks every minute (<code>/api/cron/check-tasks</code>) and send digests at 8am daily & Sunday evening (<code>/api/cron/digest</code>).
          </li>
          <li>
            <strong>SMTP Emailing:</strong> Set your <code>SMTP_HOST</code>, <code>SMTP_USER</code>, <code>SMTP_PASS</code>, and <code>SMTP_FROM</code> in your environment variables. If left unset, Nodemailer prints preview logs to your console!
          </li>
          <li>
            <strong>Web Push API:</strong> Service worker is in <code>/public/sw.js</code>. Set <code>NEXT_PUBLIC_VAPID_PUBLIC_KEY</code> and <code>VAPID_PRIVATE_KEY</code> for cloud push notifications.
          </li>
        </ul>
      </div>
    </div>
  );
}
