import { useRef, useState } from "react";

export function AudioPlayer() {
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
                className="fixed bottom-5 left-5 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/90 shadow-soft opacity-80 transition-all duration-300 hover:scale-105 hover:opacity-100 hover:bg-black/40 hover:text-white"
            >
                {isPlaying ? (
                    <svg
                        className="size-4 animate-pulse"
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
                        className="size-4"
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
