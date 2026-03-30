"use client";

import { useAudio } from "@/features/audio/context/AudioContext";

export default function MusicControls() {
  const { isPlaying, togglePlayback } = useAudio();

  return (
    <button
      onClick={togglePlayback}
      className="music-control-btn"
      aria-label={isPlaying ? "Pause music" : "Play music"}
      title={isPlaying ? "Pause music" : "Play music"}
    >
      <svg className="music-control-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        {isPlaying ? (
          <>
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </>
        ) : (
          <polygon points="5 3 19 12 5 21" />
        )}
      </svg>
    </button>
  );
}
