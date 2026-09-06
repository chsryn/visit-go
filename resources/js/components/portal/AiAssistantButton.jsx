import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send } from "lucide-react";
import { motion } from "framer-motion";
import maskotImg from "@/assets/maskot.png";

export function AiAssistantButton() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "assistant",
            text: "Halo! Saya Hiu Ajaib — asisten pariwisata Gorontalo. Tanya saya soal destinasi, budaya, kuliner, atau event. Coba: 'Rencana 2 hari budget menengah?'",
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

    const sendMessage = async (e, textOverride) => {
        e?.preventDefault();
        const text = (textOverride ?? input).trim();
        if (!text || isLoading) return;
        const userMsg = { id: Date.now(), role: "user", text };
        setMessages((m) => [...m, userMsg]);
        setInput("");
        setIsLoading(true);
        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
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
            const reply = data.reply || "Maaf, saya belum bisa menjawab. Coba tanya soal wisata Gorontalo.";
            setMessages((m) => [...m, { id: Date.now() + 1, role: "assistant", text: reply }]);
        } catch {
            setMessages((m) => [
                ...m,
                { id: Date.now() + 1, role: "assistant", text: "Koneksi terputus. Coba lagi — atau tanya soal Botubarani / Karawo / kuliner Gorontalo." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const quick = ["Hiu paus jam berapa?", "Kuliner khas Gorontalo?", "Karnaval Karawo kapan?"];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
            {open && (
                <div className="flex h-[420px] w-72 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-md">
                    <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
                        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                            <Sparkles className="size-5" />
                        </span>
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">Hiu Ajaib</h3>
                            <p className="text-xs text-muted-foreground">Asisten Wisata Gorontalo</p>
                        </div>
                    </div>

                    <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-background p-4">
                        {messages.map((m) => {
                            const parts = m.text.split(/(\*\*.*?\*\*)/g);
                            return (
                                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                                            m.role === "user" ? "bg-accent text-accent-foreground" : "bg-card border border-border text-foreground"
                                        }`}
                                    >
                                        {parts.map((p, i) =>
                                            p.startsWith("**") && p.endsWith("**") ? (
                                                <strong key={i} className="font-semibold">
                                                    {p.slice(2, -2)}
                                                </strong>
                                            ) : (
                                                <span key={i}>{p}</span>
                                            ),
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex items-center gap-1 rounded-2xl border border-border bg-card px-4 py-3">
                                    <span className="size-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.3s]" />
                                    <span className="size-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.15s]" />
                                    <span className="size-1.5 animate-bounce rounded-full bg-accent" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-border bg-card p-3">
                        <div className="mb-2 flex flex-wrap gap-1.5">
                            {quick.map((q) => (
                                <button
                                    key={q}
                                    type="button"
                                    onClick={() => setInput(q)}
                                    className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground hover:border-accent hover:text-foreground"
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
                                placeholder="Tanya soal wisata Gorontalo..."
                                className="flex-1 rounded-full border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="inline-flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm transition-colors hover:bg-[#B8941F] disabled:opacity-40"
                                aria-label="Kirim"
                            >
                                <Send className="size-4" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <motion.button
                type="button"
                aria-label={open ? "Tutup asisten AI" : "Buka asisten AI"}
                onClick={() => setOpen((v) => !v)}
                className="relative size-28 md:size-32 drop-shadow-md hover:drop-shadow-xl transition-all duration-300 hover:-translate-y-1"
                whileHover={open ? {} : { y: -6, scale: 1.04, rotate: 1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
                <motion.img
                    src={maskotImg}
                    alt="Hiu Ajaib"
                    className="size-full object-contain"
                    animate={open ? {} : { y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                />
                {open && (
                    <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-accent border-2 border-white shadow-md">
                        <X className="size-3.5 text-white" />
                    </span>
                )}
            </motion.button>
        </div>
    );
}
