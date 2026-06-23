import { useState, useEffect } from "react";

export default function ZoneManager() {
  const [zones, setZones] = useState([]);
  const [editingZone, setEditingZone] = useState(null);
  const [form, setForm] = useState({
    isOpen: true,
    price: 0,
    foreignerPrice: 0,
    closureNotice: "",
    pricing: []
  });

  const loadZones = async () => {
    try {
      const response = await fetch("/api/zones");
      if (response.ok) {
        setZones(await response.json());
      }
    } catch (error) {
      console.error("Failed to load zones", error);
    }
  };

  useEffect(() => {
    loadZones();
  }, []);

  const handleEdit = (zone) => {
    setEditingZone(zone);
    setForm({
      isOpen: zone.isOpen !== undefined ? zone.isOpen : true,
      price: zone.price || 0,
      foreignerPrice: zone.foreignerPrice || 0,
      closureNotice: zone.closureNotice || "",
      pricing: zone.pricing || [
        { category: "Indian Nationals", entryFee: "₹150", jeepHire: "₹2,500" },
        { category: "Foreign Nationals", entryFee: "₹600", jeepHire: "₹4,500" }
      ]
    });
  };

  const handlePriceChange = (index, field, value) => {
    const newPricing = [...form.pricing];
    newPricing[index][field] = value;
    setForm({ ...form, pricing: newPricing });
  };

  const addPricingRow = () => {
    setForm({
      ...form,
      pricing: [...form.pricing, { category: "", entryFee: "", jeepHire: "" }]
    });
  };

  const removePricingRow = (index) => {
    const newPricing = form.pricing.filter((_, i) => i !== index);
    setForm({ ...form, pricing: newPricing });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/zones/${editingZone.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        loadZones();
        setEditingZone(null);
      }
    } catch (error) {
      console.error("Failed to update zone", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Manage Zones (Open/Close & Pricing)</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {zones.map((zone) => (
          <div
            key={zone.slug}
            className={`group rounded-2xl border border-white/10 p-5 backdrop-blur transition hover:scale-[1.02] ${zone.isOpen === false ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5'}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white">{zone.title}</h3>
              {zone.isOpen === false ? (
                <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400 border border-red-500/20">
                  Closed
                </span>
              ) : (
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                  Open
                </span>
              )}
            </div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs text-white/50 truncate">{zone.closureNotice || "Operates Daily"}</p>
              <div className="text-right">
                <p className="text-[10px] font-bold text-white/40 uppercase">IND / FOR</p>
                <p className="text-sm font-bold text-amber-400">₹{zone.price || 0} / ₹{zone.foreignerPrice || 0}</p>
              </div>
            </div>
            <button
              onClick={() => handleEdit(zone)}
              className="w-full rounded-xl bg-white/10 py-2 text-xs font-bold text-white transition hover:bg-white/20"
            >
              Edit Settings
            </button>
          </div>
        ))}
      </div>

      {editingZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-4xl rounded-3xl border border-white/20 bg-slate-900 p-8 shadow-2xl my-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Edit {editingZone.title} Settings</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isOpen}
                        onChange={(e) => setForm({ ...form, isOpen: e.target.checked })}
                        className="h-5 w-5 rounded accent-amber-400"
                      />
                      <span className="text-sm font-bold text-white">Zone is currently OPEN</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Indian Price (₹)</label>
                      <input
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-amber-400"
                        placeholder="e.g. 150"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Foreigner Price (₹)</label>
                      <input
                        type="number"
                        value={form.foreignerPrice}
                        onChange={(e) => setForm({ ...form, foreignerPrice: Number(e.target.value) })}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-amber-400"
                        placeholder="e.g. 1500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Closure Notice / Timings Explanation</label>
                    <textarea
                      value={form.closureNotice}
                      onChange={(e) => setForm({ ...form, closureNotice: e.target.value })}
                      className="w-full h-24 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-amber-400"
                      placeholder="e.g. This zone is closed from July to September due to monsoon..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Zone-Wise Pricing</label>
                    <button
                      type="button"
                      onClick={addPricingRow}
                      className="text-[10px] font-bold uppercase text-amber-400 hover:text-amber-300"
                    >
                      + Add Category
                    </button>
                  </div>
                  <div className="space-y-3">
                    {form.pricing.map((row, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                        <input
                          value={row.category}
                          onChange={(e) => handlePriceChange(idx, "category", e.target.value)}
                          className="col-span-4 rounded-lg bg-white/5 border border-white/10 p-2 text-xs text-white"
                          placeholder="Category"
                        />
                        <input
                          value={row.entryFee}
                          onChange={(e) => handlePriceChange(idx, "entryFee", e.target.value)}
                          className="col-span-3 rounded-lg bg-white/5 border border-white/10 p-2 text-xs text-white"
                          placeholder="Entry"
                        />
                        <input
                          value={row.jeepHire}
                          onChange={(e) => handlePriceChange(idx, "jeepHire", e.target.value)}
                          className="col-span-3 rounded-lg bg-white/5 border border-white/10 p-2 text-xs text-white"
                          placeholder="Jeep"
                        />
                        <button
                          type="button"
                          onClick={() => removePricingRow(idx)}
                          className="col-span-2 text-red-400 hover:text-red-300 text-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingZone(null)}
                  className="rounded-xl bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-400 px-8 py-2.5 text-sm font-bold text-slate-900 shadow-lg hover:scale-105 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
