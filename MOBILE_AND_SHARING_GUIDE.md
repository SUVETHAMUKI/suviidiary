# Suvii Diary 🌸 — Sharing Links & Mobile Compact Testing Guide

Welcome to **Suvii Diary**! This guide explains how to get a shareable link for anyone to open on their phone or laptop, and how to test the compact mobile layout.

---

## 1. 🔗 How to Get a Shareable Public Link (3 Ways)

### Option A: Free Public Link via Vercel (Recommended — Permanent & Free)
1. Push this project folder (`suvii diares`) to a private or public GitHub repository.
2. Go to [https://vercel.com/new](https://vercel.com/new) and log in with GitHub.
3. Import your **Suvii Diary** repository.
4. Set the following **Environment Variables** in Vercel project settings (or default SQLite will work automatically for demo):
   - `NEXTAUTH_SECRET`: Any random 32-character string (e.g., `suvii_diary_super_secret_key_2026_glow`)
   - `NEXTAUTH_URL`: Your Vercel domain (e.g., `https://suvii-diary.vercel.app`)
5. Click **Deploy**!
   - **Result**: You will get a permanent link like `https://suvii-diary.vercel.app` that you can send to friends, family, or test on any smartphone!

---

### Option B: Instant Free Tunneling Link (No Deployment Required — In 5 Seconds)
If you want to share your running app on your computer instantly with someone over the internet without deploying:

1. Start your local server:
   ```bash
   npm run dev
   ```
2. In a new terminal window, run **localtunnel** (free, no account needed):
   ```bash
   npx localtunnel --port 3000
   ```
   *or if you use ngrok:*
   ```bash
   npx ngrok http 3000
   ```
3. Copy the URL generated (e.g., `https://pink-cloud-42.loca.lt` or `https://xxxx.ngrok-free.app`) and send it to anyone!

---

### Option C: Share on Your Local Wi-Fi Network (For Real Phone Testing at Home)
1. Start Next.js bound to all network adapters:
   ```bash
   npm run dev -- -H 0.0.0.0
   ```
2. Find your PC's IPv4 address:
   - Open Command Prompt / PowerShell and type `ipconfig`.
   - Look for **IPv4 Address** (e.g., `192.168.1.15` or `10.0.0.5`).
3. On your mobile phone (connected to the same Wi-Fi), open Chrome or Safari and go to:
   ```
   http://192.168.1.15:3000
   ```

---

## 2. 📱 How to Test "Mobile Compact Checking" (DevTools & Native PWA)

We designed Suvii Diary with a **mobile-first compact responsive layout** that includes:
- **Sticky Bottom Navigation Bar** with glassmorphism for comfortable thumb reach.
- **Horizontal Scrolling Month Grid** for compact habit checking on small screens.
- **Touch-Friendly Targets (min 44px)** for habit checkboxes, emoji buttons, and task toggles.
- **Collapsible Mini Music Player** floating at the bottom right.
- **Full PWA Support (`manifest.json` + `sw.js`)** for native mobile app installation.

### Method 1: Chrome / Edge DevTools (On Computer)
1. Open `http://localhost:3000` in Google Chrome or Microsoft Edge.
2. Press **`F12`** (or right-click and select **Inspect**) to open DevTools.
3. Press **`Ctrl + Shift + M`** (or click the **Device Toolbar icon** 📱 in the top-left of DevTools).
4. Select **iPhone 14 Pro Max**, **Pixel 7**, or **Samsung Galaxy S20** from the dropdown.
5. You can test:
   - Checking habits off in the monthly grid.
   - Touching the mood emojis.
   - Playing the mini music player.
   - Switching tabs via the compact bottom navigation bar.

### Method 2: Test Native App Installation (Add to Home Screen - PWA)
When testing on a mobile device (via Vercel URL or Wi-Fi):
- **On iPhone (Safari)**: Tap the **Share** button at the bottom of Safari → Tap **"Add to Home Screen"** → Tap **Add**. Suvii Diary will appear on your iPhone home screen with a pink cherry blossom icon and open in full-screen standalone mode without browser bars!
- **On Android (Chrome)**: Tap the **3-dots menu** in Chrome → Tap **"Install app"** or **"Add to Home screen"**.

---

## 3. 🧪 Testing Checklist for Compact Mobile View

| Feature | What to test in Compact Mobile View | Status |
| :--- | :--- | :---: |
| **Habits Grid** | Tap any date checkbox in the monthly table; check streak badge & completion % bar | ✅ Checked |
| **Tasks & Reminders** | Tap checkmark circle to mark done; test repeat pill (`daily` / `weekly`) | ✅ Checked |
| **Mood Tracker** | Tap the 7 emoji buttons (`😊 🥰 😐 😴 😖 😔 😒`); test month vibe counter | ✅ Checked |
| **Money Tracker** | Add a savings or expense entry; verify Recharts Pie & Bar charts adapt nicely | ✅ Checked |
| **Tamil Music Player** | Tap floating music button at bottom right; test play/pause audio | ✅ Checked |
| **Email Digest** | Tap "Email Digest" button in the top header; test simulated notification toast | ✅ Checked |
| **Splash Screen** | Verify daily Tamil inspirational quote & sparkle confetti on entry | ✅ Checked |
