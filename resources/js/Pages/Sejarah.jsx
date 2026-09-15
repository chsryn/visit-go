import { Head } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { Sejarah } from "@/components/portal/Sejarah";

export default function SejarahPage() {
    return (
        <>
            <Head title="Sejarah Gorontalo — Dulohupa AI">
                <meta
                    name="description"
                    content="Sejarah Gorontalo dari Hulontalo hingga Provinsi 2000 — Suwawa, Pohala'a, Benteng Otanaha, hingga proklamasi Nani Wartabone 23 Jan 1942."
                />
            </Head>
            <div className="min-h-screen bg-background font-sans antialiased">
                <Navbar />
                <main className="min-h-screen h-auto overflow-visible">
                    <Sejarah />
                </main>
                <SiteFooter />
                <AiAssistantButton />
            </div>
        </>
    );
}