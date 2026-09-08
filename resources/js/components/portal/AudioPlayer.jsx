import { useRef, useState } from "react";

export function AudioPlayer({ scrolled = false, className = "" }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const toggle = async () => {
        const el = audioRef.current;
        if (!el) return;
        try {
            if (isPlaying) {
                // seamless fade out 300ms
                const startVol = el.volume;
                const steps = 10;
                for (let i = steps; i >= 0; i--) {
                    el.volume = (startVol * i) / steps;
                    // eslint-disable-next-line no-await-in-loop
                    await new Promise((r) => setTimeout(r, 30));
                }
                el.pause();
                el.volume = startVol || 0.7;
                setIsPlaying(false);
            } else {
                el.volume = 0;
                await el.play();
                setIsPlaying(true);
                // seamless fade in 300ms
                for (let i = 0; i <= 10; i++) {
                    el.volume = (0.7 * i) / 10;
                    // eslint-disable-next-line no-await-in-loop
                    await new Promise((r) => setTimeout(r, 30));
                }
                el.volume = 0.7;
            }
        } catch {
            setIsPlaying(false);
        }
    };

    return (
        <>
            <audio ref={audioRef} src="/audio/gorontalo-bg.mp3" loop preload="none" />
            <button
                type="button"
                onClick={toggle}
                aria-label={isPlaying ? "Matikan musik" : "Putar musik"}
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full border shadow-sm transition-all duration-200 hover:scale-105 ${scrolled ? "bg-black/5 border-black/10 text-black hover:bg-black/10" : "bg-white/10 border-white/20 text-white hover:bg-white/15"} ${className}`}
            >
                {isPlaying ? (
                    <svg
                        className="size-3.5 animate-pulse"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                    >
                        <path d="M11 5L6 9H2v6h4l5 4z" />
                        <path d="M15 8a5 5 0 0 1 0 8" />
                        <path d="M17 6a8 8 0 0 1 0 12" />
                    </svg>
                ) : (
                    <svg
                        className="size-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                    >
                        <path d="M11 5L6 9H2v6h4l5 4z" />
                        <path d="M16 9l4 6" />
                        <path d="M20 9l-4 6" />
                    </svg>
                )}
            </button>
        </>
    );
}
