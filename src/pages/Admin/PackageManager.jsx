import { useState, useEffect } from "react";

export default function PackageManager() {
  const [packages, setPackages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    title: "",
    duration: "",
    safari: "",
    price: 0,
    currency: "INR",
    description: "",
    image: ""
  });

  const loadPackages = async () => {
    try {
      const response = await fetch("/api/packages");
      if (response.ok) {
        setPackages(await response.json());
      }
    } catch (error) {
      console.error("Failed to load packages", error);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = form._id ? "PUT" : "POST";
    const url = form._id ? `/api/packages/${form._id}` : "/api/packages";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        loadPackages();
        setShowForm(false);
        setForm({ slug: "", title: "", duration: "", safari: "", price: 0, currency: "INR", description: "", image: "" });
      }
    } catch (error) {
      console.error("Failed to save package", error);
    }
  };

  const deletePackage = async (id) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      await fetch(`/api/packages/${id}`, { method: "DELETE" });
      loadPackages();
    } catch (error) {
      console.error("Failed to delete package", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Manage Tour Packages</h2>
        <button
          onClick={() => {
            setForm({ slug: "", title: "", duration: "", safari: "", price: 0, currency: "INR", description: "", image: "" });
            setShowForm(true);
          }}
          className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-900 shadow-lg hover:scale-105 transition"
        >
          + Add New Package
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-white/40">Package Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="w-full rounded-xl bg-white/10 p-3 text-sm text-white outline-none border border-white/10"
                placeholder="e.g. Corbett Fun Tour"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-white/40">Slug (Auto-generated)</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full rounded-xl bg-white/10 p-3 text-sm text-white outline-none border border-white/10"
                placeholder="e.g. corbett-fun-tour"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-white/40">Duration</label>
              <input
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full rounded-xl bg-white/10 p-3 text-sm text-white outline-none border border-white/10"
                placeholder="e.g. 1 Night / 2 Days"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-white/40">Safari Type</label>
              <input
                value={form.safari}
                onChange={(e) => setForm({ ...form, safari: e.target.value })}
                className="w-full rounded-xl bg-white/10 p-3 text-sm text-white outline-none border border-white/10"
                placeholder="e.g. 1 Jeep Safari"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-white/40">Price (INR)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full rounded-xl bg-white/10 p-3 text-sm text-white outline-none border border-white/10"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-white/40">Image URL</label>
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full rounded-xl bg-white/10 p-3 text-sm text-white outline-none border border-white/10"
                placeholder="/images/..."
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold uppercase text-white/40">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-xl bg-white/10 p-3 text-sm text-white outline-none border border-white/10 h-24"
                placeholder="Detailed description of the tour..."
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-white/50 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-amber-400 px-6 py-2 text-sm font-bold text-slate-900 shadow-md"
              >
                Save Package
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {packages.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 py-20 text-center text-white/30 italic rounded-2xl border border-white/10">
            No tour packages found.
          </div>
        ) : (
          packages.map((pkg) => (
            <div key={pkg._id} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/8 hover:border-amber-400/30">
               {pkg.image && (
                <div className="h-32 overflow-hidden border-b border-white/10 bg-slate-800">
                  <img src={pkg.image} className="h-full w-full object-cover transition group-hover:scale-110" alt="" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-white line-clamp-1">{pkg.title}</h3>
                <div className="mt-1 flex items-center justify-between text-xs text-white/50">
                  <span>{pkg.duration}</span>
                  <span className="font-bold text-amber-400">₹{pkg.price.toLocaleString()}</span>
                </div>
                <p className="mt-2 text-xs text-white/40 line-clamp-2">{pkg.description}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => { setForm(pkg); setShowForm(true); }}
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/70 hover:bg-white/20 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePackage(pkg._id)}
                    className="rounded-lg bg-red-500/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-300 hover:bg-red-500/30 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
