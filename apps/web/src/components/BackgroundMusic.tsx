"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MdMusicNote, MdMusicOff } from "react-icons/md";

// Types for YouTube IFrame API
interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  destroy: () => void;
}

interface YTStateChangeEvent {
  data: number;
  target: YTPlayer;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: YTStateChangeEvent) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
        CUED: number;
        UNSTARTED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// CSS animation injected once via style tag (SSR-safe)
const pulseAnimationStyles = `
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
.animate-pulse-subtle {
  animation: pulse-subtle 2s ease-in-out infinite;
}
`;

const VIDEO_ID = "RhLf2vZTrVw";

export default function BackgroundMusic() {
  const playerRef = useRef<YTPlayer | null>(null);
  const playerInitializedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [playerState, setPlayerState] = useState<string>("idle");

  // Debug logging helper
  const log = useCallback((message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log(`[BackgroundMusic] ${message}`, data || "");
    }
  }, []);

  // Load YouTube IFrame API
  useEffect(() => {
    log("Checking YouTube API...", { hasYT: !!window.YT?.Player });
    
    if (window.YT?.Player) {
      log("YouTube API already loaded");
      setApiReady(true);
      return;
    }

    log("Loading YouTube IFrame API...");
    
    // Create script tag
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      log("YouTube API ready callback fired");
      setApiReady(true);
    };

    return () => {
      window.onYouTubeIframeAPIReady = undefined;
    };
  }, [log]);

  // Initialize player when API is ready
  useEffect(() => {
    if (!apiReady || playerInitializedRef.current) {
      log("Skipping player init", { apiReady, initialized: playerInitializedRef.current });
      return;
    }

    // Check if element exists
    const playerElement = document.getElementById("youtube-player");
    if (!playerElement) {
      log("ERROR: youtube-player element not found!");
      return;
    }

    log("Initializing YouTube player...");
    playerInitializedRef.current = true;
    setPlayerState("initializing");

    try {
      const player = new window.YT!.Player("youtube-player", {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: VIDEO_ID,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          playsinline: 1,
          mute: 0,
        },
        events: {
          onReady: (event) => {
            log("Player ready", event.target);
            playerRef.current = event.target;
            event.target.setVolume(50);
            setPlayerState("ready");
          },
          onStateChange: (event: YTStateChangeEvent) => {
            const states: Record<number, string> = {
              [window.YT!.PlayerState.UNSTARTED]: "unstarted",
              [window.YT!.PlayerState.PLAYING]: "playing",
              [window.YT!.PlayerState.PAUSED]: "paused",
              [window.YT!.PlayerState.ENDED]: "ended",
              [window.YT!.PlayerState.BUFFERING]: "buffering",
              [window.YT!.PlayerState.CUED]: "cued",
            };
            const stateName = states[event.data] || `unknown(${event.data})`;
            log("State changed", stateName);
            
            if (event.data === window.YT!.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT!.PlayerState.PAUSED) {
              setIsPlaying(false);
            } else if (event.data === window.YT!.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
          onError: (event: { data: number }) => {
            log("Player error", event.data);
            setPlayerState(`error-${event.data}`);
            setIsPlaying(false);
          },
        },
      });

      log("Player instance created", player);
    } catch (err) {
      log("ERROR creating player", err);
      playerInitializedRef.current = false;
    }

    return () => {
      log("Destroying player...");
      playerRef.current?.destroy();
      playerRef.current = null;
      playerInitializedRef.current = false;
    };
  }, [apiReady, log]);

  // Track user interaction for autoplay policy
  useEffect(() => {
    if (userInteracted) return;

    const handleInteraction = (e: Event) => {
      log("User interaction detected", e.type);
      setUserInteracted(true);
    };

    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("scroll", handleInteraction, { once: true });
    window.addEventListener("keydown", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [userInteracted, log]);

  // Start playing after user interaction with retry
  useEffect(() => {
    if (!userInteracted || isPlaying) return;

    const tryPlay = (attempt: number) => {
      log(`Attempting to play (attempt ${attempt})`, { 
        hasPlayer: !!playerRef.current,
        playerState 
      });
      
      if (playerRef.current) {
        try {
          playerRef.current.playVideo();
          log("playVideo() called");
        } catch (err) {
          log("ERROR calling playVideo", err);
        }
      } else if (attempt < 10) {
        // Retry after 500ms if player not ready yet
        setTimeout(() => tryPlay(attempt + 1), 500);
      } else {
        log("Gave up trying to play after 10 attempts");
      }
    };

    // Start first attempt after 500ms delay
    const timeout = setTimeout(() => tryPlay(1), 500);
    return () => clearTimeout(timeout);
  }, [userInteracted, isPlaying, playerState, log]);

  const toggleMute = useCallback(() => {
    log("Toggle mute clicked", { hasPlayer: !!playerRef.current, isMuted });
    if (!playerRef.current) return;

    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  }, [isMuted, log]);

  return (
    <>
      {/* Hidden YouTube player container */}
      <div
        ref={containerRef}
        className="absolute w-0 h-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div id="youtube-player" />
      </div>

      {/* Floating mute/unmute button - above mobile bottom bar */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Ativar música ambiente" : "Desativar música ambiente"}
        title={isMuted ? "Ativar música" : "Desativar música"}
        className={`
          fixed right-4 z-[70]
          bottom-[calc(env(safe-area-inset-bottom)+7rem)]
          sm:bottom-[calc(env(safe-area-inset-bottom)+6rem)]
          md:bottom-6 md:right-6
          flex items-center justify-center
          w-10 h-10 md:w-11 md:h-11
          rounded-full
          shadow-lg
          transition-all duration-300 ease-out
          hover:scale-110 hover:shadow-xl
          active:scale-95
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${
            isMuted
              ? "bg-white/80 text-gray-500 hover:bg-white focus:ring-gray-400"
              : "bg-amber-500/90 text-white hover:bg-amber-500 focus:ring-amber-400"
          }
          backdrop-blur-sm
          ${isPlaying && !isMuted ? "animate-pulse-subtle" : ""}
        `}
      >
        {isMuted ? (
          <MdMusicOff className="text-lg md:text-xl" aria-hidden="true" />
        ) : (
          <MdMusicNote className="text-lg md:text-xl" aria-hidden="true" />
        )}

        {/* Playing indicator dot */}
        {isPlaying && !isMuted && (
          <span
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400"
            style={{ boxShadow: "0 0 4px 1px rgba(74, 222, 128, 0.6)" }}
            aria-hidden="true"
          />
        )}
      </button>

      {/* SSR-safe global style for pulse animation */}
      <style dangerouslySetInnerHTML={{ __html: pulseAnimationStyles }} />
    </>
  );
}
