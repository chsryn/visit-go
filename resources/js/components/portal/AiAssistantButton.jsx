import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import maskotImg from "@/assets/maskot.png";

export function AiAssistantButton() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "assistant",
            text: "Wololo habari! 👋\n\nSaya Si Munggi, teman jalanmu di Gorontalo. Mau cari info destinasi wisata seru, kuliner enak, atau jadwal event?\n\Tanya aja ke aku!",
            time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const listRef = useRef(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages, isLoading, open]);

    useEffect(() => {
        const handler = (ev) => {
            const text = ev.detail?.trim();
            if (!text || isLoading) return;
            setOpen(true);
            setTimeout(() => sendMessage(null, text), 80);
        };
        window.addEventListener("ai:prompt", handler);
        return () => window.removeEventListener("ai:prompt", handler);
    }, [isLoading]);
    useEffect(() => {
        const toggle = () => setOpen((v) => !v);
        window.addEventListener("ai:toggle", toggle);
        return () => window.removeEventListener("ai:toggle", toggle);
    }, []);
    useEffect(() => {
        window.dispatchEvent(new CustomEvent("ai:state", { detail: open }));
    }, [open]);

    const sendMessage = async (e, textOverride) => {
        e?.preventDefault();
        const text = (textOverride ?? input).trim();
        if (!text || isLoading) return;
        const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        const userMsg = { id: Date.now(), role: "user", text, time };
        setMessages((m) => [...m, userMsg]);
        setInput("");
        setIsLoading(true);
        try {
            const token = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": token || "",
                    "X-Requested-With": "XMLHttpRequest",
                    Accept: "application/json",
                },
                body: JSON.stringify({ message: text }),
            });
            const data = await res.json();
            const reply =
                data.reply ||
                "Maaf, saya belum bisa menjawab. Coba tanya soal wisata Gorontalo.";
            const replyTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
            setMessages((m) => [
                ...m,
                { id: Date.now() + 1, role: "assistant", text: reply, time: replyTime },
            ]);
        } catch {
            const errTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
            setMessages((m) => [
                ...m,
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    text: "Koneksi terputus. Coba lagi — atau tanya soal Botubarani / Karawo / kuliner Gorontalo.",
                    time: errTime,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const quick = [
        "Hiu paus jam berapa?",
        "Kuliner khas Gorontalo?",
        "Karnaval Karawo kapan?",
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="chat"
                        initial={{ opacity: 0, y: 16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="flex h-[440px] w-[340px] max-w-[92vw] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-xl"
                    >
                    {/* bubble-chat header */}
                    <div className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
                        <div className="relative">
                            <img src={maskotImg} alt="Si Munggi" className="size-9 rounded-full bg-white object-contain p-1" />
                            <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-primary bg-emerald-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold leading-none">Si Munggi</h3>
                            <p className="text-xs opacity-80">AI Wisata Gorontalo • Online</p>
                        </div>
                        <button type="button" onClick={() => setOpen(false)} aria-label="Tutup" className="rounded-full p-1.5 hover:bg-white/15">
                            <X className="size-4" />
                        </button>
                    </div>

                    <div
                        ref={listRef}
                        className="flex-1 space-y-2.5 overflow-y-auto bg-[#f7f7f8] p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {messages.map((m) => {
                            const isUser = m.role === "user";
                            const parts = m.text.split(/(\*\*.*?\*\*)/g);
                            return (
                                <div
                                    key={m.id}
                                    className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                                >
                                    {!isUser && <img src={maskotImg} alt="" className="size-6 shrink-0 rounded-full bg-white object-contain p-0.5 shadow-sm" />}
                                    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[78%]`}>
                                        <div
                                            className={`px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
                                                isUser
                                                    ? "rounded-2xl rounded-br-sm bg-primary text-primary-foreground"
                                                    : "rounded-2xl rounded-bl-sm bg-white text-foreground border border-border"
                                            }`}
                                        >
                                            {parts.flatMap((p, i) =>
                                                p.startsWith("**") && p.endsWith("**")
                                                    ? [<strong key={`${i}-b`} className="font-semibold">{p.slice(2, -2)}</strong>]
                                                    : p.split("\n").flatMap((line, j) => j === 0 ? [<span key={`${i}-${j}`}>{line}</span>] : [<br key={`${i}-${j}-br`} />, <span key={`${i}-${j}`}>{line}</span>])
                                            )}
                                        </div>
                                        {m.time && <span className="mt-1 px-1 text-[10px] tabular-nums text-muted-foreground">{m.time}</span>}
                                    </div>
                                </div>
                            );
                        })}
                        {isLoading && (
                            <div className="flex items-end gap-2 justify-start">
                                <img src={maskotImg} alt="" className="size-6 shrink-0 rounded-full bg-white object-contain p-0.5 shadow-sm" />
                                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-white px-4 py-3 shadow-sm">
                                    <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                                    <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                                    <span className="size-1.5 animate-bounce rounded-full bg-primary" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-border bg-white p-3">
                        <div className="mb-2 flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {quick.map((q) => (
                                <button
                                    key={q}
                                    type="button"
                                    onClick={() => setInput(q)}
                                    className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                        <form onSubmit={sendMessage} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Tulis pesan..."
                                className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-40"
                                aria-label="Kirim"
                            >
                                <Send className="size-4" />
                            </button>
                        </form>
                    </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {open && (
                    <motion.button
                        key="mascot"
                        type="button"
                        aria-label="Tutup Si Munggi"
                        onClick={() => setOpen(false)}
                        initial={{ y: 80, scale: 0.85, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: 40, scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 320, damping: 22 }}
                        className="relative size-28 md:size-32 drop-shadow-md hover:drop-shadow-xl"
                        whileTap={{ scale: 0.96 }}
                    >
                        <motion.img
                            src={maskotImg}
                            alt="Si Munggi"
                            className="size-full object-contain"
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                                repeat: Infinity,
                                duration: 3,
                                ease: "easeInOut",
                            }}
                        />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
