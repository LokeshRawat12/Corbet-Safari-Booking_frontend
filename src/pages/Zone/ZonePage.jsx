import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageTemplate from "../../components/PageTemplate";

const zoneData = {
  dhikala: {
    title: "Dhikala Zone",
    subtitle: "The Heart of the Wild Kingdom",
    description:
      "Dhikala is famous for its vast Patli Dun Valley. It is the only zone where you can witness massive elephant herds crossing the river against a backdrop of ancient Sal forests.",
    image: "/images/Dhikala.jpg",
    highlights: [
      "Core Tiger Conservation Area",
      "Best birding destination",
      "Riverine ecosystem",
    ],
    wildlife: [
      {
        name: "Blue-throated Barbet",
        description: "A colorful resident of the forest canopy.",
        image: "/images/167-2-909x623.webp",
      },
      {
        name: "Majestic Elephants",
        description: "Giant herds roaming the Ramganga riverbed.",
        image: "/images/akash-ctb-4-1184x789.webp",
      },
    ],
  },
  bijrani: {
    title: "Bijrani Zone",
    subtitle: "Grasslands & Tiger Tracks",
    description:
      "Bijrani is known for its biodiversity and open grasslands. It is one of the most visited zones for tiger sightings and birding.",
    image: "/images/tiger2.jpg",
    highlights: [
      "High tiger sighting probability",
      "Open grassland habitats",
      "Popular for morning and evening safaris",
    ],
    wildlife: [
      {
        name: "Royal Bengal Tiger",
        description: "One of the most frequently sighted big cats in the park.",
        image: "/images/tiger walking.webp",
      },
      {
        name: "Spotted Deer",
        description: "Commonly seen grazing in the open meadows.",
        image: "/images/Dear.webp",
      },
    ],
  },
  jhirna: {
    title: "Jhirna Zone",
    subtitle: "All-Year Birding & Wildlife",
    description:
      "Jhirna is open throughout the year and is famous for bird watching, sloth bear sightings, and peaceful forest drives.",
    image: "/images/bird.webp",
    highlights: [
      "Open during monsoon",
      "Excellent bird watching",
      "Dense deciduous forest",
    ],
    wildlife: [
      {
        name: "Sloth Bear",
        description: "A shy but rewarding species to spot in the early morning.",
        image: "/images/Blackbear.webp",
      },
      {
        name: "Birdlife",
        description: "A wide variety of resident and migratory birds.",
        image: "/images/Bird-2.jpg",
      },
    ],
  },
  dhela: {
    title: "Dhela Zone",
    subtitle: "Mixed Forests & Quiet Trails",
    description:
      "Dhela is a newer zone known for mixed forest types and rich biodiversity. It offers peaceful driving trails with a good chance of seeing leopards and deer.",
    image: "/images/Dhela Zone.jpg",
    highlights: [
      "All-year access",
      "Hotspot for bird watching",
      "Quiet and less crowded",
    ],
    wildlife: [
      {
        name: "Leopard",
        description: "Elusive big cats often spotted in the early hours.",
        image: "/images/Elephant.jpg",
      },
      {
        name: "Indian Roller",
        description: "A colorful bird regularly seen in open forest areas.",
        image: "/images/Bird-3.webp",
      },
    ],
  },
  durgadevi: {
    title: "Durga Devi Zone",
    subtitle: "Hilltop Views & Forest Trails",
    description:
      "Durga Devi zone offers a mix of hill terrain and dense forests, making it ideal for bird lovers and nature walks.",
    image: "/images/Durgadevi.webp",
    highlights: ["Hilly terrain", "Quiet forest drives", "Scenic viewpoints"],
    wildlife: [
      {
        name: "Rajasthan Deer",
        description: "Often spotted grazing in the early morning.",
        image: "/images/Durgadevilandscape.webp",
      },
      {
        name: "Grey Langur",
        description: "Commonly seen moving through the treetops.",
        image: "/images/Elephant.jpg",
      },
    ],
  },
  garjia: {
    title: "Garjia Zone",
    subtitle: "River Views & Temple Trails",
    description:
      "Garjia zone features scenic riverbanks near the famous Garjia Temple and offers peaceful safari drives.",
    image: "/images/Garjia-2.webp",
    highlights: ["Waterfront safari routes", "Temple views", "Rich bird life"],
    wildlife: [
      {
        name: "River Otter",
        description: "A rare sight along the river banks.",
        image: "/images/Elephent-2.jpg",
      },
      {
        name: "Kingfisher",
        description: "Often seen hovering along the water.",
        image: "/images/Elephant.jpg",
      },
    ],
  },
  sitabani: {
    title: "Sitabani Zone",
    subtitle: "Legendary Paths & Forest Peace",
    description:
      "Sitabani offers mythological trails and quiet forest paths, ideal for a relaxed wildlife experience.",
    image: "/images/Sitabani.webp",
    highlights: ["Mythological significance", "Peaceful trails", "Good for photography"],
    wildlife: [
      {
        name: "Indian Bison",
        description: "Grazes in the open grasslands.",
        image: "/images/Elephent-2.jpg",
      },
      {
        name: "Peacock",
        description: "Commonly seen displaying in the early morning.",
        image: "/images/Bird-3.webp",
      },
    ],
  },
  phato: {
    title: "Phato Zone",
    subtitle: "Offbeat Trails & Quiet Forests",
    description:
      "Phato is an offbeat zone known for serene jungle environments and low visitor numbers.",
    image: "/images/Phato.webp",
    highlights: ["Quiet exploration", "Scenic drives", "Photo opportunities"],
    wildlife: [
      {
        name: "Wild Boar",
        description: "Frequently seen crossing the tracks.",
        image: "/images/Elephant.jpg",
      },
      {
        name: "Painted Stork",
        description: "Often found near water bodies.",
        image: "/images/Bird-2.jpg",
      },
    ],
  },
  sonanadi: {
    title: "Sonanadi Zone",
    subtitle: "Riverine Forest & Wilderness",
    description:
      "Sonanadi is a blend of forest and river habitats, offering excellent wildlife sightings in a tranquil setting.",
    image: "/images/Sonanadi.webp",
    highlights: ["Riverine forest", "Rich wildlife", "Quiet drives"],
    wildlife: [
      {
        name: "Sambar Deer",
        description: "Commonly seen grazing near water.",
        image: "/images/Elephant.jpg",
      },
      {
        name: "Water Monitor Lizard",
        description: "Often seen near swampy areas.",
        image: "/images/Elephent-2.jpg",
      },
    ],
  },
};

export default function ZonePage({ slug: propSlug }) {
  const { slug: urlSlug } = useParams();
  const slug = propSlug ?? urlSlug;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

  const [zone, setZone] = useState(zoneData[slug]);
  const [loading, setLoading] = useState(!zone);
  const [error, setError] = useState(null);
  const [ticketRates, setTicketRates] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function fetchZone() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/zones/${slug}`);
        if (!res.ok) throw new Error("Zone not found");
        const data = await res.json();
        if (!cancelled) setZone(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (slug) fetchZone();
    else setLoading(false);

    return () => { cancelled = true; };
  }, [slug, API_BASE_URL]);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ticket-prices`);
        if (res.ok) setTicketRates(await res.json());
      } catch (err) { console.error(err); }
    }
    fetchRates();
  }, [API_BASE_URL]);


  if (loading) {
    return (
      <PageTemplate title="Loading…">
        <p>Loading zone details…</p>
      </PageTemplate>
    );
  }

  if (error || !zone) {
    return (
      <PageTemplate title="Zone not found">
        <p>Sorry, we couldn't find that zone. Please go back to the home page.</p>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate title={zone.title} description={zone.description}>
      <div className="space-y-10">
        <section className="relative overflow-hidden rounded-3xl shadow-xl ">
          <img
            className="h-64 w-full object-cover"
            src={zone.image}
            alt={zone.title}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/0 to-black/60" />
          <div className="absolute bottom-5 left-5">
            <h2 className="text-3xl font-bold text-white">{zone.title}</h2>
            <p className="mt-1 max-w-lg text-sm text-white/80">{zone.subtitle}</p>
          </div>
          {zone.isOpen === false && (
            <div className="absolute top-5 right-5 rotate-3 scale-110">
               <span className="bg-red-600 text-white px-6 py-2 rounded-lg font-black text-xl shadow-2xl border-4 border-white/30 animate-pulse">
                 CLOSED
               </span>
            </div>
          )}
        </section>

        {/* Closure Notice */}
        {zone.isOpen === false && (
          <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 shadow-red-100 shadow-xl">
             <div className="flex gap-4 items-start text-red-700">
                <i className="fas fa-exclamation-triangle text-2xl mt-1" />
                <div>
                  <h3 className="text-lg font-bold mb-1">Seasonal Closure Notice</h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {zone.closureNotice || `${zone.title} is currently closed for visitors due to periodic maintenance or seasonal changes. Please check back later for opening updates.`}
                  </p>
                </div>
             </div>
          </div>
        )}

        <section className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur">
              <h3 className="text-xl font-semibold">About this zone</h3>
              <p className="mt-3 text-sm text-slate-700">{zone.description}</p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur">
              <h3 className="text-xl font-semibold">Wildlife to spot</h3>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                {zone.wildlife.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/70 shadow-inner"
                  >
                    <div className="h-32 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur text-slate-800">
              <h3 className="text-xl font-semibold">Safari Pricing & Permits</h3>
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white/50">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Visitor Category</th>
                      <th className="px-4 py-2 font-semibold">Entry Fee</th>
                      <th className="px-4 py-2 font-semibold">Jeep Hire</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(zone.pricing || ticketRates).length > 0 ? (
                      (zone.pricing || ticketRates).map((rate, i) => (
                        <tr key={rate._id || i} className="border-t border-slate-200">
                          <td className="px-4 py-3 font-medium">{rate.category}</td>
                          <td className="px-4 py-3 text-slate-600">{rate.entryFee}</td>
                          <td className="px-4 py-3 text-slate-600">{rate.jeepHire}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-t border-slate-200">
                        <td colSpan="3" className="px-4 py-4 text-center text-slate-500 italic">
                          Prices vary by season. Please check the official portal.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 space-y-4">
                <h4 className="font-semibold text-slate-800">Everything you need to know about tickets:</h4>
                <div className="grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
                  <div className="flex gap-3">
                    <span className="text-secondary mt-1"><i className="fas fa-ticket-alt" /></span>
                    <p><strong>Advance Booking:</strong> Safari permits must be booked online at least 45-60 days in advance, especially for popular zones like Dhikala and Bijrani.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-secondary mt-1"><i className="fas fa-id-card" /></span>
                    <p><strong>ID Requirements:</strong> A valid government-issued ID (Aadhar, Voter ID, or Passport for foreigners) is mandatory during booking and entry.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-secondary mt-1"><i className="fas fa-user-friends" /></span>
                    <p><strong>Permit Validity:</strong> One permit allows entry for a maximum of 6 adults and 2 children (under 5 years) in a single jeep.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-secondary mt-1"><i className="fas fa-ban" /></span>
                    <p><strong>Non-Transferable:</strong> Tickets are non-transferable and non-refundable once issued by the forest department.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur">
              <h3 className="text-xl font-semibold">Quick facts</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                {zone.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-black">
                      <i className="fas fa-check" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href={zone.isOpen === false ? "#" : "/booking"}
                className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold shadow transition ${zone.isOpen === false ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-secondary text-black hover:bg-secondary/90'}`}
              >
                {zone.isOpen === false ? "Currently Closed" : "Book Safari"}
              </a>
            </div>
          </aside>
        </section>
      </div>
    </PageTemplate>
  );
}


