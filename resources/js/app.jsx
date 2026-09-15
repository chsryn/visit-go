import { Component, useEffect, useState } from "react";
import "../css/app.css";
import { createInertiaApp, router } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { Toaster } from "./components/ui/sonner";

// Jaring pengaman (defense in depth): respons 401 tak terduga (session habis) dipaksa keluar
// dari halaman admin menuju /login. Jalur utama sudah ditangani server (redirect 302 Inertia).
router.on("invalid", (error) => {
    if (error?.detail?.response?.status === 401) {
        window.location.href = "/login";
    }
});

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    static getDerivedStateFromError(error) {
        return { error };
    }
    componentDidCatch(error, info) {
        console.error("[ErrorBoundary]", error, info);
    }
    render() {
        if (this.state.error) {
            return (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 99999,
                        background: "#fff",
                        color: "#b91c1c",
                        fontFamily: "monospace",
                        fontSize: 14,
                        padding: 40,
                        overflow: "auto",
                    }}
                >
                    <h2 style={{ margin: "0 0 12px" }}>Render error</h2>
                    <pre style={{ whiteSpace: "pre-wrap" }}>
                        {String(this.state.error?.stack ?? this.state.error)}
                    </pre>
                </div>
            );
        }
        return this.props.children;
    }
}

function ErrorOverlay() {
    const [msg, setMsg] = useState(null);
    useEffect(() => {
        const onError = (e) => {
            console.error("[window.onerror]", e.message);
            setMsg(
                `${e.message}${e.filename ? `\n${e.filename}:${e.lineno}` : ""}`,
            );
        };
        const onReject = (e) => {
            console.error("[unhandledrejection]", e.reason);
            setMsg(String(e.reason));
        };
        window.addEventListener("error", onError);
        window.addEventListener("unhandledrejection", onReject);
        return () => {
            window.removeEventListener("error", onError);
            window.removeEventListener("unhandledrejection", onReject);
        };
    }, []);
    if (!msg) return null;
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 99998,
                background: "#b91c1c",
                color: "#fff",
                fontFamily: "monospace",
                fontSize: 13,
                padding: "10px 16px",
                whiteSpace: "pre-wrap",
            }}
        >
            JS ERROR: {msg}
        </div>
    );
}

createInertiaApp({
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob("./Pages/**/*.jsx")),
    setup({ el, App, props }) {
        createRoot(el).render(
            <>
                <ErrorOverlay />
                <ErrorBoundary>
                    <App {...props} />
                </ErrorBoundary>
                <Toaster position="top-center" richColors />
            </>
        );
    },
    progress: { color: "#4f46e5" },
});
