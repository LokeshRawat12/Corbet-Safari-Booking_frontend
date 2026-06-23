import { Link } from "react-router-dom";
import PageTemplate from "../../components/PageTemplate";

export default function HomePage() {
  return (
    <>
      <section className="relative h-screen bg-[url('/images/tiger.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-primary/60 to-primary/80" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 text-center text-white">
          <span className="rounded-full bg-secondary px-4 py-1 text-xs font-semibold text-black tracking-widest">
            Since 1936
          </span>
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Experience the <span className="text-secondary">Wild Majesty</span>
          </h2>
          <p className="mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
            Explore India's oldest and most prestigious National Park with expert guides.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="tel:+918979668105"
              className="inline-flex items-center justify-center rounded-full bg-secondary px-8 py-3 text-sm font-semibold text-black shadow-lg transition hover:bg-secondary/90"
            >
              <i className="fas fa-phone-alt mr-2" />
              Call Now
            </a>
            <a
              href="https://wa.me/918979668105"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <i className="fab fa-whatsapp mr-2" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <PageTemplate
        title="Welcome to Corbett Safari"
        description="Explore India's oldest and most prestigious national park. Book safaris, hotels and tour packages."
      >
        <section className="mb-14">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-3">
              <article className="rounded-2xl border border-white/15 bg-white/70 p-6 shadow-lg backdrop-blur">
                <div className="text-3xl">🐾</div>
                <h3 className="mt-5 text-xl font-semibold">Safari Booking</h3>
                <p className="mt-3 text-sm text-slate-700">
                  Book your morning or evening jeep safari online with instant
                  confirmation.
                </p>
                <Link
                  to="/safari-booking"
                  className="mt-6 inline-flex items-center text-sm font-semibold text-primary hover:text-secondary"
                >
                  Learn More →
                </Link>
              </article>

              <article className="rounded-2xl border border-white/15 bg-white/70 p-6 shadow-lg backdrop-blur">
                <div className="text-3xl">🏨</div>
                <h3 className="mt-5 text-xl font-semibold">Hotel Booking</h3>
                <p className="mt-3 text-sm text-slate-700">
                  Stay inside the jungle rest houses or choose from luxury riverside resorts.
                </p>
                <Link
                  to="/hotel"
                  className="mt-6 inline-flex items-center text-sm font-semibold text-primary hover:text-secondary"
                >
                  Learn More →
                </Link>
              </article>

              <article className="rounded-2xl border border-white/15 bg-white/70 p-6 shadow-lg backdrop-blur">
                <div className="text-3xl">🗺️</div>
                <h3 className="mt-5 text-xl font-semibold">Tour Packages</h3>
                <p className="mt-3 text-sm text-slate-700">
                  Carefully curated 2–3 day wildlife itineraries for families and adventure seekers.
                </p>
                <Link
                  to="/packages"
                  className="mt-6 inline-flex items-center text-sm font-semibold text-primary hover:text-secondary"
                >
                  Learn More →
                </Link>
              </article>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold">Tourism Zones</h2>
              <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-secondary" />
              <p className="mt-4 text-base text-slate-600">
                Explore different parts of the Corbett Tiger Reserve
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  slug: "dhikala",
                  title: "Dhikala Zone",
                  description: "Most popular for tiger sightings and river valley views.",
                  image: "/images/Dhikala.jpg",
                },
                {
                  slug: "bijrani",
                  title: "Bijrani Zone",
                  description: "Rich in biodiversity and famous for its grasslands.",
                  image: "/images/tiger2.jpg",
                },
                {
                  slug: "jhirna",
                  title: "Jhirna Zone",
                  description: "Open throughout the year, great for bird watching.",
                  image: "/images/bird.webp",
                },
                {
                  slug: "dhela",
                  title: "Dhela Zone",
                  description: "Dense forest zone with rich wildlife experience.",
                  image: "/images/Dhela Zone.jpg",
                },
                {
                  slug: "durgadevi",
                  title: "Durga Devi Zone",
                  description: "Hilly terrain, ideal for bird lovers and nature walks.",
                  image: "/images/Durgadevi.webp",
                },
                {
                  slug: "garjia",
                  title: "Garjia Zone",
                  description: "Scenic landscapes near Garjia temple and river banks.",
                  image: "/images/Garjia-2.webp",
                },
                {
                  slug: "sitabani",
                  title: "Sitabani Zone",
                  description: "Mythological importance and peaceful forest trails.",
                  image: "/images/Sitabani.webp",
                },
                {
                  slug: "phato",
                  title: "Phato Zone",
                  description: "Offbeat zone with serene jungle environment.",
                  image: "/images/Phato.webp",
                },
                {
                  slug: "sonanadi",
                  title: "Sonanadi Zone",
                  description: "Perfect blend of forest, rivers and wildlife.",
                  image: "/images/Sonanadi.webp",
                },
              ].map((zone) => (
                <Link
                  key={zone.slug}
                  to={`/zone/${zone.slug}`}
                  className="group overflow-hidden rounded-2xl border border-white/15 bg-white/70 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <img
                    src={zone.image}
                    alt={zone.title}
                    className="h-56 w-full object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-text">{zone.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{zone.description}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                      Learn More <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </PageTemplate>
    </>
  );
}
