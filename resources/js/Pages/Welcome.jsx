import { Head } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { Hero } from "@/components/portal/Hero";
import { Categories } from "@/components/portal/Categories";
import { AiPlanner } from "@/components/portal/AiPlanner";
import { Events } from "@/components/portal/Events";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";

export default function Welcome() {
    return (
        <>
            <Head title="Portal Wisata & Budaya Gorontalo — Discover the Wonders">
                <meta name="description" content="Jelajahi destinasi, ensiklopedia budaya, kuliner khas, dan kerajinan Gorontalo — dari hiu paus Botubarani hingga sulaman Karawo di jantung Teluk Tomini." />
                <meta property="og:title" content="Portal Wisata & Budaya Gorontalo — Discover the Wonders" />
                <meta property="og:description" content="Jelajahi destinasi, ensiklopedia budaya, kuliner khas, dan kerajinan Gorontalo — dari hiu paus Botubarani hingga sulaman Karawo di jantung Teluk Tomini." />
            </Head>
            <div className="min-h-screen bg-background font-sans antialiased">
                <Navbar />
                <main>
                    <Hero />
                    <Categories />
                    <AiPlanner />
                    <Events />
                </main>
                <SiteFooter />
                <AiAssistantButton />
            </div>
        </>
    );
}
