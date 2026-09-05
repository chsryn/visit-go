export function SiteFooter() {
    return (<footer className="bg-ocean-deep py-16 text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>
          <p className="font-display text-2xl">
            Portal Informasi Wisata & Budaya Provinsi Gorontalo
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/70">
            Jelajahi pesona alam, kekayaan tradisi, ragam kuliner, dan mahakarya kerajinan
            dari jantung Teluk Tomini.
          </p>
        </div>
        <div className="text-sm leading-relaxed text-primary-foreground/70">
          <p>
            Dinas Pariwisata Provinsi Gorontalo
            <br />
            Jl. Jendral Sudirman No. 57, Wumialo, Kota Tengah,
            <br />
            Kota Gorontalo, 96128
          </p>
          <p className="mt-4">
            info@pariwisata.gorontaloprov.go.id &middot; +62 (435) 821-456
          </p>
        </div>
      </div>
    </footer>);
}
