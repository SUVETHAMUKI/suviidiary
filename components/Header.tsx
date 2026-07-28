"use client";

import { useState } from "react";
import { Sparkles, Mail, Check, Loader2, Share2 } from "lucide-react";
import { ShareModal } from "./ShareModal";

interface HeaderProps {
  remaining: number;
  onHome: () => void;
}

export function Header({ remaining, onHome }: HeaderProps) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const d = new Date();
  const dateStr = d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const fmtMoney = (n: number) => "₹" + Number(n || 0).toLocaleString("en-IN");

  const handleTestDigest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (sending) return;
    setSending(true);
    try {
      await fetch("/api/cron/digest?period=daily", { method: "POST" });
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error("Failed to send test digest:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <header
        onClick={onHome}
        className="bg-gradient-to-r from-[#e0578a] via-[#d6336c] to-[#c8a8e9] text-white px-5 py-4 cursor-pointer shadow-md shadow-[#e0578a]/20 flex items-center justify-between transition-opacity hover:opacity-95 rounded-t-2xl sm:rounded-none"
      >
        <div>
          <div className="flex items-center gap-1.5 font-fraunces italic text-2xl font-bold tracking-tight">
            <span>Suvii Diary</span>
            <span className="text-xl animate-spin-slow">🌸</span>
          </div>
          <div
            suppressHydrationWarning
            className="text-xs text-white/90 font-medium flex items-center gap-2 mt-0.5"
          >
            <span suppressHydrationWarning>{dateStr}</span>
            <span>·</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold">
              Balance {fmtMoney(remaining)}
            </span>
          </div>
        </div>

        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm border border-white/30 cursor-pointer"
            title="Open Option 1B Share & Mobile Testing Modal"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Option 1B</span>
            <span>Share</span>
          </button>

          <button
            onClick={handleTestDigest}
            disabled={sending}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm border border-white/20 cursor-pointer"
            title="Send a daily progress digest email to your inbox now"
          >
            {sending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : sent ? (
              <Check className="w-3.5 h-3.5 text-[#3aa77c]" />
            ) : (
              <Mail className="w-3.5 h-3.5" />
            )}
            <span>{sent ? "Sent!" : "Email Digest"}</span>
          </button>
        </div>
      </header>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </>
  );
}
