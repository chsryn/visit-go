import { useRef, useState } from "react";

export function AudioPlayer() {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const toggle = async () => {
        const el = audioRef.current;
        if (!el) return;
        try {
            if (isPlaying) {
                el.pause();
                setIsPlaying(false);
            } else {
                await el.play();
                setIsPlaying(true);
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
                className="fixed bottom-5 left-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white shadow-lg transition-all hover:scale-110 hover:bg-black/50"
            >
                {isPlaying ? (
                    <svg
                        className="size-5 animate-pulse"
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
                        className="size-5"
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
