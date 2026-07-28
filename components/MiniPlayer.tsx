"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  ListMusic,
  Plus,
  Trash2,
  X,
} from "lucide-react";

export interface SongItem {
  id: string;
  title: string;
  artist: string;
  url: string;
}

interface MiniPlayerProps {
  songs: SongItem[];
  onAddSong: (title: string, artist: string, url: string) => Promise<void>;
  onDeleteSong: (id: string) => Promise<void>;
}

export function MiniPlayer({ songs, onAddSong, onDeleteSong }: MiniPlayerProps) {
  const validSongs = Array.isArray(songs) ? songs : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newArtist, setNewArtist] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = validSongs[currentIndex] || validSongs[0];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (validSongs.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % validSongs.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (validSongs.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + validSongs.length) % validSongs.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleAddCustomSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    await onAddSong(
      newTitle.trim() || "My Audio Track",
      newArtist.trim() || "My Playlist",
      newUrl.trim()
    );
    setNewUrl("");
    setNewTitle("");
    setNewArtist("");
  };

  if (!currentSong) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={currentSong.url}
        onEnded={handleNext}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Floating Mini Player bar just above NavBar */}
      <div className="bg-gradient-to-r from-[#7a2348] to-[#5c1a36] text-white px-4 py-2 flex items-center justify-between border-t border-[#c8a8e9]/30 shadow-md">
        <div className="flex items-center gap-3 overflow-hidden flex-1 mr-2">
          <div className="w-8 h-8 rounded-full bg-[#e0578a] flex items-center justify-center shrink-0 shadow-sm">
            <Music className={`w-4 h-4 text-white ${isPlaying ? "animate-spin" : ""}`} />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold truncate tracking-wide text-white">
              {currentSong.title}
            </div>
            <div className="text-[10px] text-[#e8b8ca] truncate">
              {currentSong.artist}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrev}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-[#e8b8ca] hover:text-white cursor-pointer"
            title="Previous track"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#e0578a] to-[#c8a8e9] hover:from-[#d6336c] hover:to-[#b791e2] flex items-center justify-center text-white shadow-sm transition-transform active:scale-95 cursor-pointer"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-[#e8b8ca] hover:text-white cursor-pointer"
            title="Next track"
          >
            <SkipForward className="w-4 h-4" />
          </button>
          <button
            onClick={toggleMute}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-[#e8b8ca] hover:text-white cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              showPlaylist ? "bg-[#e0578a] text-white" : "hover:bg-white/10 text-[#e8b8ca]"
            }`}
            title="Open playlist & library"
          >
            <ListMusic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Playlist Drawer Modal */}
      {showPlaylist && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-[#fff5f7] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-[#f6d9e3] max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎶</span>
                <h3 className="font-fraunces italic text-xl font-bold text-[#7a2348]">
                  Suvii Music Library
                </h3>
              </div>
              <button
                onClick={() => setShowPlaylist(false)}
                className="p-1 rounded-full hover:bg-[#fde3ec] text-[#a9607f] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#a9607f] mb-4">
              Play your own uploaded tracks or relaxing soothing Tamil instrumental melodies anytime while journaling.
            </p>

            {/* Song List */}
            <div className="overflow-y-auto flex-1 space-y-2 pr-1 mb-4">
              {validSongs.map((song, i) => {
                const active = i === currentIndex;
                return (
                  <div
                    key={song.id}
                    onClick={() => {
                      setCurrentIndex(i);
                      setIsPlaying(true);
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      active
                        ? "bg-[#fde3ec] border-[#e0578a] shadow-xs"
                        : "bg-white border-[#f6d9e3] hover:bg-[#fff0f5]"
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          active
                            ? "bg-[#e0578a] text-white"
                            : "bg-[#fff5f7] text-[#a9607f]"
                        }`}
                      >
                        {active && isPlaying ? (
                          <Music className="w-4 h-4 animate-bounce" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div
                          className={`text-sm font-bold truncate ${
                            active ? "text-[#7a2348]" : "text-[#5c2138]"
                          }`}
                        >
                          {song.title}
                        </div>
                        <div className="text-xs text-[#a9607f] truncate">
                          {song.artist}
                        </div>
                      </div>
                    </div>

                    {!song.id.startsWith("default-") && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await onDeleteSong(song.id);
                        }}
                        className="p-1 text-[#c98aa3] hover:text-[#d6336c] rounded-full transition-colors cursor-pointer"
                        title="Delete song"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Custom Audio URL form */}
            <form onSubmit={handleAddCustomSong} className="bg-white p-3 rounded-2xl border border-[#f6d9e3] space-y-2">
              <div className="text-xs font-bold text-[#7a2348]">
                + Add your own audio link
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Song Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#f0c4d4] text-xs outline-none focus:border-[#e0578a]"
                />
                <input
                  type="text"
                  placeholder="Artist / Note"
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#f0c4d4] text-xs outline-none focus:border-[#e0578a]"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://... audio file URL (.mp3 / audio stream)"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-[#f0c4d4] text-xs outline-none focus:border-[#e0578a]"
                />
                <button
                  type="submit"
                  className="bg-[#e0578a] hover:bg-[#d6336c] text-white px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
