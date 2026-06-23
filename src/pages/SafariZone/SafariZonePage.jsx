import PageTemplate from "../../components/PageTemplate";

const zones = [
  {
    slug: "dhikala",
    title: "Dhikala Zone",
    season: "15 Nov - 15 Jun",
    safari: "Canter Safari",
    status: "Most Popular",
    image: "/images/Dhikala.jpg",
    description:
      "Dhikala is the largest zone and the 'heart' of the park. It is famous for its vast grasslands and the Ramganga River valley, and offers some of the best chances for tiger and elephant sightings.",
  },
  {
    slug: "bijrani",
    title: "Bijrani Zone",
    season: "15 Oct - 30 Jun",
    safari: "Jeep Safari",
    status: "High Sighting",
    image: "/images/tiger2.jpg",
    description:
      "Bijrani is known for its rich biodiversity and wide grasslands. It is one of the most popular zones for tiger sightings and is easily accessible from the main park entrance.",
  },
  {
    slug: "jhirna",
    title: "Jhirna Zone",
    season: "All Year Round",
    safari: "Jeep Safari",
    status: "Open All Year",
    image: "/images/bird.webp",
    description:
      "Jhirna is open throughout the year and is a great destination for bird watchers and those looking for reliable wildlife sightings even during the monsoon season.",
  },
  {
    slug: "dhela",
    title: "Dhela Zone",
    season: "All Year Round",
    safari: "Jeep Safari",
    status: "Open All Year",
    image: "/images/Dhela Zone.jpg",
    description:
      "Dhela is rich in mixed forest types and is a hotspot for birding and predators. It was added to the park in 2014 and is still one of the most peaceful zones.",
  },
];

function statusBadge(status) {
  switch (status) {
    case "Most Popular":
      return "bg-secondary/20 text-secondary";
    case "High Sighting":
      return "bg-emerald-50 text-emerald-700";
    case "Open All Year":
      return "bg-sky-50 text-sky-700";
    default:
      return "bg-white/20 text-white";
  }
}

export default function SafariZonePage() {
  return (
    <PageTemplate
      title="Safari Zones"
      description="Explore the zones of Corbett Tiger Reserve and learn when and how to visit each one."
    >
      <section className="mb-10 space-y-3">
        <h2 className="text-2xl font-semibold">The Science & Geography of Corbett Zones</h2>
        <p className="text-sm text-slate-600">
          Corbett Tiger Reserve is divided into core and buffer areas. Core zones are strictly protected for
          wildlife and offer the best chances of sightings, while buffer zones allow tourism with controlled
          activities.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        {zones.map((zone) => (
          <article
            key={zone.slug}
            className="overflow-hidden rounded-2xl border border-white/20 bg-white/40 shadow-lg backdrop-blur"
          >
            <div className="relative">
              <img
                src={zone.image}
                alt={zone.title}
                className="h-56 w-full object-cover"
              />
              <span
                className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                  zone.status,
                )}`}
              >
                {zone.status}
              </span>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold">{zone.title}</h3>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <i className="far fa-calendar-alt" /> {zone.season}
                </span>
                <span className="inline-flex items-center gap-2">
                  <i className="fas fa-car" /> {zone.safari}
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-700">{zone.description}</p>
              <a
                href={`/zone/${zone.slug}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary"
              >
                Learn more <span aria-hidden>→</span>
              </a>
            </div>
          </article>
        ))}
      </section>
    </PageTemplate>
  );
}
