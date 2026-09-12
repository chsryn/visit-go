import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

export function ViewCounter({ path, className = "" }) {
    const [views, setViews] = useState(null);
    const key = path ?? (typeof window !== "undefined" ? window.location.pathname : "/");

    useEffect(() => {
        const dedupKey = `viewed:${key}`;
        const already = sessionStorage.getItem(dedupKey);
        const url = already ? `/api/views?path=${encodeURIComponent(key)}` : "/api/view";
        const opts = already
            ? {}
            : {
                  method: "POST",
                  headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
                  body: JSON.stringify({ path: key }),
              };
        fetch(url, opts)
            .then((r) => r.json())
            .then((d) => {
                setViews(d.views ?? 0);
                if (!already) sessionStorage.setItem(dedupKey, "1");
            })
            .catch(() => setViews(0));
    }, [key]);

    if (views === null) return null;
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums ${className}`}>
            <Eye className="size-3.5" />
            {Number(views).toLocaleString("id-ID")} dilihat
        </span>
    );
}

export function TotalViewCounter({ className = "" }) {
    const [total, setTotal] = useState(null);
    useEffect(() => {
        fetch("/api/views?path=/")
            .then((r) => r.json())
            .then((d) => setTotal(d.total ?? 0))
            .catch(() => setTotal(0));
    }, []);
    if (total === null) return null;
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs tabular-nums ${className}`}>
            <Eye className="size-3.5" />
            {Number(total).toLocaleString("id-ID")} kunjungan
        </span>
    );
}
