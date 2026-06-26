import { useState, useEffect } from "react";
import { apiFetch } from "../../utils/api";

/* ── Default zones matching frontend data ── */
const DEFAULT_ZONES = [
  {
    slug: "dhikala",
    title: "Dhikala Zone",
    subtitle: "The Heart of the Wild Kingdom",
    description:
      "Dhikala is famous for its vast Patli Dun Valley. It is the only zone where you can witness massive elephant herds crossing the river against a backdrop of ancient Sal forests.",
    image: "/images/Dhikala.jpg",
    highlights: ["Core Tiger Conservation Area", "Best birding destination", "Riverine ecosystem"],
    wildlife: [
      { name: "Blue-throated Barbet", description: "A colorful resident of the forest canopy.", image: "/images/167-2-909x623.webp" },
      { name: "Majestic Elephants", description: "Giant herds roaming the Ramganga riverbed.", image: "/images/akash-ctb-4-1184x789.webp" },
    ],
    isOpen: true,
    price: 5500,
    foreignerPrice: 27500,
    closureNotice: "",
    pricing: [
      { category: "Indian Nationals", entryFee: "₹150", jeepHire: "₹2,500" },
      { category: "Foreign Nationals", entryFee: "₹600", jeepHire: "₹4,500" },
    ],
  },
  {
    slug: "bijrani",
    title: "Bijrani Zone",
    subtitle: "Grasslands & Tiger Tracks",
    description:
      "Bijrani is known for its biodiversity and open grasslands. It is one of the most visited zones for tiger sightings and birding.",
    image: "/images/tiger2.jpg",
    highlights: ["High tiger sighting probability", "Open grassland habitats", "Popular for morning and evening safaris"],
    wildlife: [
      { name: "Royal Bengal Tiger", description: "One of the most frequently sighted big cats in the park.", image: "/images/tiger walking.webp" },
      { name: "Spotted Deer", description: "Commonly seen grazing in the open meadows.", image: "/images/Dear.webp" },
    ],
    isOpen: true,
    price: 5500,
    foreignerPrice: 27500,
    closureNotice: "",
    pricing: [
      { category: "Indian Nationals", entryFee: "₹150", jeepHire: "₹2,500" },
      { category: "Foreign Nationals", entryFee: "₹600", jeepHire: "₹4,500" },
    ],
  },
  {
    slug: "jhirna",
    title: "Jhirna Zone",
    subtitle: "All-Year Birding & Wildlife",
    description:
      "Jhirna is open throughout the year and is famous for bird watching, sloth bear sightings, and peaceful forest drives.",
    image: "/images/bird.webp",
    highlights: ["Open during monsoon", "Excellent bird watching", "Dense deciduous forest"],
    wildlife: [
      { name: "Sloth Bear", description: "A shy but rewarding species to spot in the early morning.", image: "/images/Blackbear.webp" },
      { name: "Birdlife", description: "A wide variety of resident and migratory birds.", image: "/images/Bird-2.jpg" },
    ],
    isOpen: true,
    price: 5500,
    foreignerPrice: 27500,
    closureNotice: "",
    pricing: [
      { category: "Indian Nationals", entryFee: "₹150", jeepHire: "₹2,500" },
      { category: "Foreign Nationals", entryFee: "₹600", jeepHire: "₹4,500" },
    ],
  },
  {
    slug: "dhela",
    title: "Dhela Zone",
    subtitle: "Mixed Forests & Quiet Trails",
    description:
      "Dhela is a newer zone known for mixed forest types and rich biodiversity. It offers peaceful driving trails with a good chance of seeing leopards and deer.",
    image: "/images/Dhela Zone.jpg",
    highlights: ["All-year access", "Hotspot for bird watching", "Quiet and less crowded"],
    wildlife: [
      { name: "Leopard", description: "Elusive big cats often spotted in the early hours.", image: "/images/Elephant.jpg" },
      { name: "Indian Roller", description: "A colorful bird regularly seen in open forest areas.", image: "/images/Bird-3.webp" },
    ],
    isOpen: true,
    price: 5500,
    foreignerPrice: 27500,
    closureNotice: "",
    pricing: [
      { category: "Indian Nationals", entryFee: "₹150", jeepHire: "₹2,500" },
      { category: "Foreign Nationals", entryFee: "₹600", jeepHire: "₹4,500" },
    ],
  },
  {
    slug: "durgadevi",
    title: "Durga Devi Zone",
    subtitle: "Hilltop Views & Forest Trails",
    description:
      "Durga Devi zone offers a mix of hill terrain and dense forests, making it ideal for bird lovers and nature walks.",
    image: "/images/Durgadevi.webp",
    highlights: ["Hilly terrain", "Quiet forest drives", "Scenic viewpoints"],
    wildlife: [
      { name: "Rajasthan Deer", description: "Often spotted grazing in the early morning.", image: "/images/Durgadevilandscape.webp" },
      { name: "Grey Langur", description: "Commonly seen moving through the treetops.", image: "/images/Elephant.jpg" },
    ],
    isOpen: true,
    price: 5500,
    foreignerPrice: 27500,
    closureNotice: "",
    pricing: [
      { category: "Indian Nationals", entryFee: "₹150", jeepHire: "₹2,500" },
      { category: "Foreign Nationals", entryFee: "₹600", jeepHire: "₹4,500" },
    ],
  },
  {
    slug: "garjia",
    title: "Garjia Zone",
    subtitle: "River Views & Temple Trails",
    description:
      "Garjia zone features scenic riverbanks near the famous Garjia Temple and offers peaceful safari drives.",
    image: "/images/Garjia-2.webp",
    highlights: ["Waterfront safari routes", "Temple views", "Rich bird life"],
    wildlife: [
      { name: "River Otter", description: "A rare sight along the river banks.", image: "/images/Elephent-2.jpg" },
      { name: "Kingfisher", description: "Often seen hovering along the water.", image: "/images/Elephant.jpg" },
    ],
    isOpen: true,
    price: 5500,
    foreignerPrice: 27500,
    closureNotice: "",
    pricing: [
      { category: "Indian Nationals", entryFee: "₹150", jeepHire: "₹2,500" },
      { category: "Foreign Nationals", entryFee: "₹600", jeepHire: "₹4,500" },
    ],
  },
  {
    slug: "sitabani",
    title: "Sitabani Zone",
    subtitle: "Legendary Paths & Forest Peace",
    description:
      "Sitabani offers mythological trails and quiet forest paths, ideal for a relaxed wildlife experience.",
    image: "/images/Sitabani.webp",
    highlights: ["Mythological significance", "Peaceful trails", "Good for photography"],
    wildlife: [
      { name: "Indian Bison", description: "Grazes in the open grasslands.", image: "/images/Elephent-2.jpg" },
      { name: "Peacock", description: "Commonly seen displaying in the early morning.", image: "/images/Bird-3.webp" },
    ],
    isOpen: true,
    price: 5500,
    foreignerPrice: 27500,
    closureNotice: "",
    pricing: [
      { category: "Indian Nationals", entryFee: "₹150", jeepHire: "₹2,500" },
      { category: "Foreign Nationals", entryFee: "₹600", jeepHire: "₹4,500" },
    ],
  },
  {
    slug: "phato",
    title: "Phato Zone",
    subtitle: "Offbeat Trails & Quiet Forests",
    description:
      "Phato is an offbeat zone known for serene jungle environments and low visitor numbers.",
    image: "/images/Phato.webp",
    highlights: ["Quiet exploration", "Scenic drives", "Photo opportunities"],
    wildlife: [
      { name: "Wild Boar", description: "Frequently seen crossing the tracks.", image: "/images/Elephant.jpg" },
      { name: "Painted Stork", description: "Often found near water bodies.", image: "/images/Bird-2.jpg" },
    ],
    isOpen: true,
    price: 5500,
    foreignerPrice: 27500,
    closureNotice: "",
    pricing: [
      { category: "Indian Nationals", entryFee: "₹150", jeepHire: "₹2,500" },
      { category: "Foreign Nationals", entryFee: "₹600", jeepHire: "₹4,500" },
    ],
  },
  {
    slug: "sonanadi",
    title: "Sonanadi Zone",
    subtitle: "Riverine Forest & Wilderness",
    description:
      "Sonanadi is a blend of forest and river habitats, offering excellent wildlife sightings in a tranquil setting.",
    image: "/images/Sonanadi.webp",
    highlights: ["Riverine forest", "Rich wildlife", "Quiet drives"],
    wildlife: [
      { name: "Sambar Deer", description: "Commonly seen grazing near water.", image: "/images/Elephant.jpg" },
      { name: "Water Monitor Lizard", description: "Often seen near swampy areas.", image: "/images/Elephent-2.jpg" },
    ],
    isOpen: true,
    price: 5500,
    foreignerPrice: 27500,
    closureNotice: "",
    pricing: [
      { category: "Indian Nationals", entryFee: "₹150", jeepHire: "₹2,500" },
      { category: "Foreign Nationals", entryFee: "₹600", jeepHire: "₹4,500" },
    ],
  },
];

/* ── Tiny reusable input styles ── */
const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-amber-400 transition placeholder:text-white/20";
const labelCls = "text-[10px] font-bold uppercase tracking-widest text-white/40";

const EMPTY_ZONE_FORM = {
  title: "",
  subtitle: "",
  slug: "",
  description: "",
  image: "",
  highlights: [],
  wildlife: [],
  isOpen: true,
  price: 0,
  foreignerPrice: 0,
  closureNotice: "",
  pricing: [],
};

export default function ZoneManager() {
  const [zones, setZones] = useState([]);
  const [editingZone, setEditingZone] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState(EMPTY_ZONE_FORM);

  const loadZones = async () => {
    try {
      const response = await apiFetch("/api/zones");
      if (response.ok) {
        const data = await response.json();
        setZones(data && data.length > 0 ? data : DEFAULT_ZONES);
      } else {
        setZones(DEFAULT_ZONES);
      }
    } catch (error) {
      console.error("Failed to load zones", error);
      setZones(DEFAULT_ZONES);
    }
  };

  useEffect(() => {
    loadZones();
  }, []);

  /* ── Seed all default zones to database ── */
  const handleSeedAll = async () => {
    setSeeding(true);
    try {
      const res = await apiFetch("/api/zones/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zones: DEFAULT_ZONES }),
      });
      if (res.ok) {
        await loadZones();
        showSuccess("All 9 zones seeded successfully!");
      }
    } catch (error) {
      console.error("Seed failed", error);
    } finally {
      setSeeding(false);
    }
  };

  const handleAddZone = () => {
    setEditingZone({});
    setForm(EMPTY_ZONE_FORM);
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  /* ── Open edit modal ── */
  const handleEdit = (zone) => {
    setEditingZone(zone);
    setForm({
      title: zone.title || "",
      subtitle: zone.subtitle || "",
      slug: zone.slug || "",
      description: zone.description || "",
      image: zone.image || "",
      highlights: zone.highlights || [],
      wildlife: zone.wildlife || [],
      isOpen: zone.isOpen !== undefined ? zone.isOpen : true,
      price: zone.price || 0,
      foreignerPrice: zone.foreignerPrice || 0,
      closureNotice: zone.closureNotice || "",
      pricing: zone.pricing || [
        { category: "Indian Nationals", entryFee: "₹150", jeepHire: "₹2,500" },
        { category: "Foreign Nationals", entryFee: "₹600", jeepHire: "₹4,500" },
      ],
    });
  };

  /* ── Pricing table helpers ── */
  const handlePriceChange = (index, field, value) => {
    const newPricing = [...form.pricing];
    newPricing[index][field] = value;
    setForm({ ...form, pricing: newPricing });
  };
  const addPricingRow = () =>
    setForm({ ...form, pricing: [...form.pricing, { category: "", entryFee: "", jeepHire: "" }] });
  const removePricingRow = (index) =>
    setForm({ ...form, pricing: form.pricing.filter((_, i) => i !== index) });

  /* ── Highlights helpers ── */
  const handleHighlightChange = (index, value) => {
    const newH = [...form.highlights];
    newH[index] = value;
    setForm({ ...form, highlights: newH });
  };
  const addHighlight = () => setForm({ ...form, highlights: [...form.highlights, ""] });
  const removeHighlight = (index) =>
    setForm({ ...form, highlights: form.highlights.filter((_, i) => i !== index) });

  /* ── Wildlife helpers ── */
  const handleWildlifeChange = (index, field, value) => {
    const newW = [...form.wildlife];
    newW[index] = { ...newW[index], [field]: value };
    setForm({ ...form, wildlife: newW });
  };
  const addWildlife = () =>
    setForm({ ...form, wildlife: [...form.wildlife, { name: "", description: "", image: "" }] });
  const removeWildlife = (index) =>
    setForm({ ...form, wildlife: form.wildlife.filter((_, i) => i !== index) });

  /* ── Save ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEditingExisting = Boolean(editingZone?.slug);
      const slug = isEditingExisting ? editingZone.slug : form.slug;
      const endpoint = isEditingExisting ? `/api/zones/${slug}` : "/api/zones";
      const method = isEditingExisting ? "PUT" : "POST";
      const res = await apiFetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await loadZones();
        setEditingZone(null);
        showSuccess(isEditingExisting ? `${form.title} updated successfully!` : `${form.title} created successfully!`);
      }
    } catch (error) {
      console.error("Failed to save zone", error);
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this zone?")) return;
    try {
      const res = await apiFetch(`/api/zones/${slug}`, { method: "DELETE" });
      if (res.ok) {
        await loadZones();
        showSuccess("Zone deleted");
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Manage Zones (Open/Close & Pricing)</h2>
          <p className="text-xs text-white/40 mt-1">
            {zones.length} zone{zones.length !== 1 ? "s" : ""} loaded • Edit title, description, pricing, wildlife & more
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleAddZone}
            className="rounded-xl bg-white/10 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-white/15 transition"
          >
            + Add New Zone
          </button>
          <button
            type="button"
            onClick={handleSeedAll}
            disabled={seeding}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {seeding ? (
              <>
                <span className="animate-spin inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full" />
                Seeding...
              </>
            ) : (
              <>🌱 Seed All 9 Zones to DB</>
            )}
          </button>
        </div>
      </div>

      {/* ── Success Toast ── */}
      {successMsg && (
        <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-300 font-medium animate-pulse">
          ✅ {successMsg}
        </div>
      )}

      {/* ── Zone Cards Grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {zones.map((zone) => (
          <div
            key={zone.slug}
            className={`group rounded-2xl border overflow-hidden bg-white/5 backdrop-blur transition hover:scale-[1.02] ${
              zone.isOpen === false ? "border-red-500/20" : "border-white/10"
            }`}
          >
            <div className="h-32 bg-slate-800 relative overflow-hidden">
              {zone.image && (
                <img
                  src={zone.image}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  alt={zone.title}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-2 right-2">
                {zone.isOpen === false ? (
                  <span className="rounded bg-red-500/90 backdrop-blur px-2 py-0.5 text-[8px] font-bold text-white uppercase tracking-wider">
                    Closed
                  </span>
                ) : (
                  <span className="rounded bg-emerald-500/90 backdrop-blur px-2 py-0.5 text-[8px] font-bold text-white uppercase tracking-wider">
                    Open
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-white text-sm">{zone.title}</h3>
                {zone.subtitle && (
                  <p className="text-[10px] text-amber-400/70 mt-0.5">{zone.subtitle}</p>
                )}
              </div>

              {zone.description && (
                <p className="text-[10px] text-white/40 line-clamp-2">{zone.description}</p>
              )}

              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-1">
                  {(zone.highlights || []).slice(0, 2).map((h, i) => (
                    <span key={i} className="text-[8px] bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-white/50">
                      {h}
                    </span>
                  ))}
                  {(zone.highlights || []).length > 2 && (
                    <span className="text-[8px] text-white/30">+{zone.highlights.length - 2}</span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-bold text-white/30 uppercase">IND / FOR</p>
                  <p className="text-xs font-bold text-amber-400">
                    ₹{zone.price || 0} / ₹{zone.foreignerPrice || 0}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={`/zone/${zone.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-slate-700/80 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-600"
                >
                  👁️ View
                </a>
                <button
                  onClick={() => handleEdit(zone)}
                  className="rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-amber-400/20 hover:text-amber-400"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(zone.slug)}
                  className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/20"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Empty State ── */}
      {zones.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <p className="text-4xl">🏞️</p>
          <p className="text-white/50 text-sm">No zones found. Click "Seed All 9 Zones" to add default zones.</p>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          EDIT MODAL — Full zone editing
      ══════════════════════════════════════════════════ */}
      {editingZone && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-5xl rounded-3xl border border-white/20 bg-slate-900 p-6 md:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingZone?.slug ? `✏️ Edit — ${editingZone.title}` : "✨ Add New Zone"}
              </h3>
              <button
                onClick={() => setEditingZone(null)}
                className="text-white/30 hover:text-white text-2xl transition"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* ── Section 1: Basic Info ── */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 border-b border-white/10 pb-2">
                  📋 Basic Information
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className={labelCls}>Zone Title</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className={inputCls}
                      placeholder="e.g. Dhikala Zone"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Subtitle</label>
                    <input
                      value={form.subtitle}
                      onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                      className={inputCls}
                      placeholder="e.g. The Heart of the Wild Kingdom"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={labelCls}>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={`${inputCls} h-24 resize-none`}
                    placeholder="Write a brief description of this zone..."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className={labelCls}>Zone Image URL</label>
                    <input
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      className={inputCls}
                      placeholder="e.g. /images/Dhikala.jpg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Slug (URL key)</label>
                    <input
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className={`${inputCls} ${editingZone?.slug ? "opacity-60" : ""}`}
                      placeholder="e.g. dhikala"
                      readOnly={Boolean(editingZone?.slug)}
                      required={!editingZone?.slug}
                    />
                  </div>
                </div>

                {/* Image Preview */}
                {form.image && (
                  <div className="rounded-xl overflow-hidden border border-white/10 h-32 w-48">
                    <img src={form.image} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              {/* ── Section 2: Status & Pricing ── */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 border-b border-white/10 pb-2">
                  💰 Status & Pricing
                </h4>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isOpen}
                      onChange={(e) => setForm({ ...form, isOpen: e.target.checked })}
                      className="h-5 w-5 rounded accent-emerald-400"
                    />
                    <span className={`text-sm font-bold ${form.isOpen ? "text-emerald-400" : "text-red-400"}`}>
                      Zone is currently {form.isOpen ? "OPEN" : "CLOSED"}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={labelCls}>Indian Price (₹)</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className={inputCls}
                      placeholder="e.g. 5500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Foreigner Price (₹)</label>
                    <input
                      type="number"
                      value={form.foreignerPrice}
                      onChange={(e) => setForm({ ...form, foreignerPrice: Number(e.target.value) })}
                      className={inputCls}
                      placeholder="e.g. 27500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={labelCls}>Closure Notice / Timings</label>
                  <textarea
                    value={form.closureNotice}
                    onChange={(e) => setForm({ ...form, closureNotice: e.target.value })}
                    className={`${inputCls} h-20 resize-none`}
                    placeholder="e.g. This zone is closed from July to September due to monsoon..."
                  />
                </div>

                {/* Zone-Wise Pricing Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className={labelCls}>Zone-Wise Pricing Table</label>
                    <button
                      type="button"
                      onClick={addPricingRow}
                      className="text-[10px] font-bold uppercase text-amber-400 hover:text-amber-300 transition"
                    >
                      + Add Category
                    </button>
                  </div>
                  {form.pricing.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <input
                        value={row.category}
                        onChange={(e) => handlePriceChange(idx, "category", e.target.value)}
                        className="col-span-4 rounded-lg bg-white/5 border border-white/10 p-2.5 text-xs text-white outline-none focus:border-amber-400"
                        placeholder="Category"
                      />
                      <input
                        value={row.entryFee}
                        onChange={(e) => handlePriceChange(idx, "entryFee", e.target.value)}
                        className="col-span-3 rounded-lg bg-white/5 border border-white/10 p-2.5 text-xs text-white outline-none focus:border-amber-400"
                        placeholder="Entry Fee"
                      />
                      <input
                        value={row.jeepHire}
                        onChange={(e) => handlePriceChange(idx, "jeepHire", e.target.value)}
                        className="col-span-3 rounded-lg bg-white/5 border border-white/10 p-2.5 text-xs text-white outline-none focus:border-amber-400"
                        placeholder="Jeep Hire"
                      />
                      <button
                        type="button"
                        onClick={() => removePricingRow(idx)}
                        className="col-span-2 text-red-400 hover:text-red-300 text-lg transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Section 3: Highlights ── */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 border-b border-white/10 pb-2">
                  ⭐ Highlights
                </h4>
                <div className="space-y-2">
                  {form.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-amber-400/50 w-5">{idx + 1}.</span>
                      <input
                        value={h}
                        onChange={(e) => handleHighlightChange(idx, e.target.value)}
                        className={`flex-1 ${inputCls}`}
                        placeholder="e.g. Core Tiger Conservation Area"
                      />
                      <button
                        type="button"
                        onClick={() => removeHighlight(idx)}
                        className="text-red-400 hover:text-red-300 text-lg transition px-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addHighlight}
                  className="text-[10px] font-bold uppercase text-amber-400 hover:text-amber-300 transition"
                >
                  + Add Highlight
                </button>
              </div>

              {/* ── Section 4: Wildlife ── */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 border-b border-white/10 pb-2">
                  🐾 Wildlife
                </h4>
                <div className="space-y-4">
                  {form.wildlife.map((w, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/50">Wildlife #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeWildlife(idx)}
                          className="text-red-400 hover:text-red-300 text-sm transition"
                        >
                          🗑️ Remove
                        </button>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                          <label className={labelCls}>Name</label>
                          <input
                            value={w.name}
                            onChange={(e) => handleWildlifeChange(idx, "name", e.target.value)}
                            className={inputCls}
                            placeholder="e.g. Royal Bengal Tiger"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className={labelCls}>Image URL</label>
                          <input
                            value={w.image}
                            onChange={(e) => handleWildlifeChange(idx, "image", e.target.value)}
                            className={inputCls}
                            placeholder="e.g. /images/tiger.jpg"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className={labelCls}>Description</label>
                        <input
                          value={w.description}
                          onChange={(e) => handleWildlifeChange(idx, "description", e.target.value)}
                          className={inputCls}
                          placeholder="e.g. Frequently sighted in the park"
                        />
                      </div>
                      {w.image && (
                        <div className="rounded-lg overflow-hidden border border-white/10 h-16 w-24">
                          <img src={w.image} alt={w.name} className="h-full w-full object-cover" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addWildlife}
                  className="text-[10px] font-bold uppercase text-amber-400 hover:text-amber-300 transition"
                >
                  + Add Wildlife
                </button>
              </div>

              {/* ── Action Buttons ── */}
              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingZone(null)}
                  className="rounded-xl bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-2.5 text-sm font-bold text-slate-900 shadow-lg hover:scale-105 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="animate-spin inline-block h-3.5 w-3.5 border-2 border-slate-900/30 border-t-slate-900 rounded-full" />
                      Saving...
                    </>
                  ) : (
                    <>💾 Save Changes</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
