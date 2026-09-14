import { useEffect } from "react";
import { Head } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { Hero } from "@/components/portal/Hero";
import { WelcomeOverview } from "@/components/portal/WelcomeOverview";
import { Categories } from "@/components/portal/Categories";
import { FeaturedDestinations } from "@/components/portal/FeaturedDestinations";
import { ExperienceSection } from "@/components/portal/ExperienceSection";
import { AiTravelWizard } from "@/components/portal/AiTravelWizard";
import { Events } from "@/components/portal/Events";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { karawoVertical } from "@/lib/karawo";

export default function Welcome({ events, kulinerSpotlight, kerajinanSpotlight }) {
    useEffect(() => {
        if (window.location.hash === "#ai-planner") {
            setTimeout(() => document.getElementById("ai-planner")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
        }
    }, []);
    return (
        <>
            <Head title="Dulohupa AI — Portal Wisata & Budaya Gorontalo">
                <meta name="description" content="Jelajahi destinasi, ensiklopedia budaya, kuliner khas, dan kerajinan Gorontalo bersama Dulohupa AI — dari hiu paus Botubarani hingga sulaman Karawo di jantung Teluk Tomini." />
                <meta property="og:title" content="Dulohupa AI — Portal Wisata & Budaya Gorontalo" />
                <meta property="og:description" content="Jelajahi destinasi, ensiklopedia budaya, kuliner khas, dan kerajinan Gorontalo bersama Dulohupa AI — dari hiu paus Botubarani hingga sulaman Karawo di jantung Teluk Tomini." />
            </Head>
            <div className="min-h-screen bg-background font-sans antialiased relative">
                {/* Ornamen Landing — terlihat, panel tipis */}
                <div aria-hidden className="pointer-events-none fixed inset-y-0 left-0 z-0 hidden h-screen w-[220px] opacity-15 lg:block border-r border-[#E8E0EC]/30 bg-[#FEFCF8]/60" style={{ backgroundImage: karawoVertical, backgroundRepeat: "repeat", backgroundSize: "24px 120px", backgroundPosition: "center top" }} />
                <div aria-hidden className="pointer-events-none fixed inset-y-0 right-0 z-0 hidden h-screen w-[220px] opacity-15 lg:block border-l border-[#E8E0EC]/30 bg-[#FEFCF8]/60" style={{ backgroundImage: karawoVertical, backgroundRepeat: "repeat", backgroundSize: "24px 120px", backgroundPosition: "center top", transform: "scaleX(-1)" }} />
                <div className="relative z-10">
                <Navbar />
                <main>
                    <Hero />
                    <WelcomeOverview />
                    <Categories />
                    <FeaturedDestinations kulinerSpotlight={kulinerSpotlight} kerajinanSpotlight={kerajinanSpotlight} />
                    <ExperienceSection />
                    <div className="relative overflow-x-clip bg-background">
                        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.7'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3Cpath d='M60 42 L70 54 L60 66 L50 54 Z'/%3E%3Cpath d='M18 60 L30 50 L42 60 L30 70 Z'/%3E%3Cpath d='M78 60 L90 50 L102 60 L90 70 Z'/%3E%3Ccircle cx='60' cy='30' r='1.8' fill='%23715386' stroke='none' opacity='0.6'/%3E%3Ccircle cx='60' cy='54' r='1.8' fill='%23715386' stroke='none' opacity='0.6'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "240px 240px" }} />
                        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#715386]/[0.02] via-transparent to-[#715386]/[0.03]" />
                        <div className="relative">
                            <AiTravelWizard />
                        </div>
                    </div>
                    <Events items={events} />
                </main>
                <SiteFooter />
                <AiAssistantButton />
                </div>
            </div>
        </>
    );
}
