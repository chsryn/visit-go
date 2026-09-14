import { Reveal } from "@/components/ui/Reveal";
import gorontalo from "@/assets/gorontalo.jpg"; // ponytail: pastikan asset asli Olele segera menggantikan placeholder ini

export function Categories() {
    return (
        <section
            id="kategori"
            className="relative flex min-h-[60vh] items-center justify-center overflow-hidden"
        >
            {/* Background Parallax */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed"
                style={{ backgroundImage: `url(${gorontalo})` }}
                aria-hidden="true"
            />

            {/* Overlay tunggal yang lebih bersih: Kontras dapet, tapi nggak lebay */}
            <div
                className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
                aria-hidden="true"
            />

            {/* Fallback image untuk Vite preload */}
            <img src={gorontalo} alt="" className="hidden" aria-hidden="true" />

            {/* Container Konten */}
            <div className="relative z-10 mx-auto w-full max-w-4xl px-6 lg:px-8">
                <Reveal
                    y={30}
                    className="flex flex-col items-center py-12 text-center md:py-20"
                >
                    <h2 className="font-display text-3xl font-bold tracking-tight text-white drop-shadow-md sm:text-4xl md:text-5xl lg:text-6xl">
                        Selamat Datang di Gorontalo
                    </h2>

                    <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-200 drop-shadow sm:text-lg md:text-xl">
                        Kenal Lebih dekat dengan budaya, keaslian cita rasa
                        rempah, hingga presisi sulaman Karawo. Gorontalo lebih
                        dari sekadar tempat singgah.
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
