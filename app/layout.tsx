import type { Metadata } from "next";
import { Fraunces, Quicksand } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Suvii Diary 🌸 - Personal Habit, Task, Mood, Money & Music Tracker",
  description:
    "Your beautiful glow-up companion featuring habit grid, alarms, Tamil motivational slogans, music player, and custom wallpapers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${quicksand.variable} h-full antialiased font-sans`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#e0578a" />
      </head>
      <body className="min-h-full flex flex-col bg-[#fff5f7] text-[#5c2138]">
        {children}
      </body>
    </html>
  );
}
