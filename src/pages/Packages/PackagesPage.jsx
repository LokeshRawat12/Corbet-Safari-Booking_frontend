import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageTemplate from "../../components/PageTemplate";
import { tourPackages as fallbackPackages } from "../../data/packages";
import { apiFetch } from "../../utils/api";

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/packages")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setPackages(data);
        } else {
          setPackages(fallbackPackages);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch packages:", err);
        setPackages(fallbackPackages);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTemplate
      title="Tour Packages"
      description="Browse our curated wildlife itineraries and safari packages."
    >
      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
        </div>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <article
              key={pkg.slug || pkg._id}
              className="rounded-2xl border border-white/20 bg-white/60 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-50 overflow-hidden rounded-t-2xl">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold">{pkg.title}</h3>
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <i className="fas fa-calendar-alt" /> {pkg.duration}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <i className="fas fa-car" /> {pkg.safari}
                  </span>
                </div>
                <div className="mt-3 text-base font-semibold text-secondary">
                  {pkg.currency || "INR"} {pkg.price.toLocaleString()}
                </div>
                <p className="mt-4 text-sm text-slate-600">{pkg.description}</p>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <i key={idx} className="fas fa-star" />
                    ))}
                  </div>
                  <Link
                    to={`/booking?pkg=${encodeURIComponent(pkg.slug)}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary"
                  >
                    Book Now <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </PageTemplate>
  );
}
