"use client";

import { useState, useEffect } from "react";
import {
  Share2,
  Copy,
  Check,
  Smartphone,
  Globe,
  Terminal,
  X,
  Sparkles,
  QrCode,
  ExternalLink,
} from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("http://localhost:3000");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border-2 border-[#e0578a] shadow-2xl max-w-lg w-full p-6 space-y-5 relative overflow-hidden"
      >
        {/* Glow Header */}
        <div className="flex items-center justify-between border-b border-[#f6d9e3] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#fde3ec] flex items-center justify-center">
              <Share2 className="w-4 h-4 text-[#e0578a]" />
            </div>
            <div>
              <h3 className="font-fraunces italic text-lg font-bold text-[#7a2348]">
                Share Suvii Diary &amp; Mobile Checking 🌸
              </h3>
              <p className="text-[11px] text-[#a9607f]">
                Option 1B: Instant Public Share Tunnel &amp; Compact Testing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#c98aa3] hover:text-[#7a2348] hover:bg-[#fff5f7] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Link Bar */}
        <div className="bg-[#fff5f7] p-3.5 rounded-2xl border border-[#f0c4d4] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#7a2348]">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#e0578a]" />
              Current Website Link:
            </span>
            <span className="text-[10px] bg-[#e0578a] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
              Live
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 bg-white px-3 py-1.5 rounded-xl border border-[#f6d9e3] text-xs text-[#7a2348] font-mono outline-none"
            />
            <button
              onClick={handleCopy}
              className="bg-gradient-to-r from-[#e0578a] to-[#d6336c] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Option 1B Guide */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl border border-[#e0578a]/30 bg-gradient-to-br from-white to-[#fff0f5] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#e0578a] flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                Option 1B: Instant Share Script (1-Click)
              </span>
              <span className="text-[10px] bg-[#e0578a]/15 text-[#e0578a] px-2 py-0.5 rounded-full font-semibold">
                No Deploy Needed
              </span>
            </div>
            <p className="text-xs text-[#7a2348] leading-relaxed">
              Want a public HTTPS link right now to send to anyone or open on mobile 4G/5G? Run this in your terminal:
            </p>
            <div className="bg-[#5c2138] text-white p-2.5 rounded-xl font-mono text-xs flex items-center justify-between">
              <span>npm run share:1b</span>
              <span className="text-[10px] text-white/70">LocalTunnel</span>
            </div>
          </div>

          {/* Mobile Compact Checking */}
          <div className="p-3.5 rounded-2xl border border-[#f6d9e3] bg-white/90 space-y-2">
            <div className="text-xs font-bold text-[#7a2348] flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#8e62c6]" />
              How to Test &quot;Mobile Compact Checking&quot;
            </div>
            <ul className="text-xs text-[#a9607f] space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-[#7a2348]">DevTools:</strong> Press{" "}
                <code className="bg-[#fff5f7] px-1 py-0.5 rounded text-[#e0578a]">
                  Ctrl+Shift+M
                </code>{" "}
                in Chrome/Edge and select <strong>iPhone 14 Pro</strong> or{" "}
                <strong>Pixel 7</strong>.
              </li>
              <li>
                <strong className="text-[#7a2348]">Wi-Fi Phone Test:</strong> Run{" "}
                <code className="bg-[#fff5f7] px-1 py-0.5 rounded text-[#e0578a]">
                  npm run share:wifi
                </code>{" "}
                and open <code className="bg-[#fff5f7] px-1 py-0.5 rounded">http://&lt;your-ip&gt;:3000</code> on your mobile.
              </li>
              <li>
                <strong className="text-[#7a2348]">Native PWA:</strong> Tap{" "}
                <strong>Share → Add to Home Screen</strong> on mobile to test standalone app checking!
              </li>
            </ul>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-2 border-t border-[#f6d9e3] text-[11px] text-[#a9607f]">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#e0578a]" />
            Suvii Diary Glow-Up Companion
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#fff5f7] hover:bg-[#fde3ec] text-[#7a2348] font-bold transition-colors cursor-pointer"
          >
            Got it, Let&apos;s Glow! ✨
          </button>
        </div>
      </div>
    </div>
  );
}
