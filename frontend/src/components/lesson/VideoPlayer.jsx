import React, { useEffect, useRef, useState } from "react";
import { RotateCcw, Clock } from "lucide-react";

/**
 * Format seconds into mm:ss or hh:mm:ss
 */
function formatTime(sec) {
  const totalSeconds = Math.max(0, Math.floor(sec || 0));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export default function VideoPlayer({
  youtubeVideoId = "9602Yzvd7ik",
  title = "Lesson Video",
  resumeTimestamp = 0,
  onTimeUpdate = null,
}) {
  const containerId = useRef(`yt-player-${Math.random().toString(36).substring(2, 9)}`);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const onTimeUpdateRef = useRef(onTimeUpdate);
  onTimeUpdateRef.current = onTimeUpdate;
  const [currentPlayTime, setCurrentPlayTime] = useState(resumeTimestamp);
  const [apiReady, setApiReady] = useState(false);

  // Initialize YouTube Iframe Player API
  useEffect(() => {
    let isMounted = true;

    // Load YouTube iframe script if not present
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const checkYT = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkYT);
        if (isMounted) {
          setApiReady(true);
          initPlayer();
        }
      }
    }, 100);

    function initPlayer() {
      if (!window.YT || !window.YT.Player) return;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
      }

      try {
        playerRef.current = new window.YT.Player(containerId.current, {
          videoId: youtubeVideoId,
          playerVars: {
            start: Math.floor(resumeTimestamp || 0),
            rel: 0,
            modestbranding: 1,
            enablejsapi: 1,
          },
          events: {
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                clearInterval(intervalRef.current);
                intervalRef.current = setInterval(() => {
                  if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
                    const time = playerRef.current.getCurrentTime();
                    setCurrentPlayTime(time);
                    if (typeof onTimeUpdateRef.current === "function") {
                      onTimeUpdateRef.current(time);
                    }
                  }
                }, 5000); // Record every 5s during playback
              } else {
                clearInterval(intervalRef.current);
                if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
                  const time = playerRef.current.getCurrentTime();
                  setCurrentPlayTime(time);
                  if (typeof onTimeUpdateRef.current === "function") {
                    onTimeUpdateRef.current(time);
                  }
                }
              }
            },
          },
        });
      } catch (err) {
        console.warn("[VideoPlayer] YT.Player init fallback:", err.message);
      }
    }

    return () => {
      isMounted = false;
      clearInterval(checkYT);
      clearInterval(intervalRef.current);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
      }
    };
  }, [youtubeVideoId, resumeTimestamp]);

  // Construct standard embed URL for iframe fallback
  const startParam = resumeTimestamp > 0 ? `&start=${Math.floor(resumeTimestamp)}` : "";
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?rel=0&modestbranding=1&autoplay=0${startParam}`;

  return (
    <div className="space-y-3">
      <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-xl border border-neutral-800">
        {/* 16:9 Aspect Ratio Container */}
        <div className="relative w-full pt-[56.25%]">
          {apiReady ? (
            <div id={containerId.current} className="absolute inset-0 w-full h-full" />
          ) : (
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          )}
        </div>
      </div>

      {/* Playback timestamp status & resume controls */}
      <div className="flex items-center justify-between px-2 text-xs text-neutral-500 font-medium">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-primary-500" />
          <span>
            {resumeTimestamp > 0
              ? `Resume position: ${formatTime(resumeTimestamp)}`
              : "Starting from beginning"}
          </span>
          {currentPlayTime > resumeTimestamp && (
            <span className="text-neutral-400">
              (Current: {formatTime(currentPlayTime)})
            </span>
          )}
        </div>

        {resumeTimestamp > 0 && (
          <button
            type="button"
            onClick={() => {
              if (playerRef.current && typeof playerRef.current.seekTo === "function") {
                playerRef.current.seekTo(0, true);
              }
              setCurrentPlayTime(0);
              if (typeof onTimeUpdateRef.current === "function") {
                onTimeUpdateRef.current(0);
              }
            }}
            className="hover:text-primary-600 transition-colors inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restart from 0:00</span>
          </button>
        )}
      </div>
    </div>
  );
}
