import { useState, useEffect } from "react";
import { apiFetch } from "../../utils/api";

export default function TicketPriceManager() {
  const [prices, setPrices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    category: "",
    entryFee: "",
    jeepHire: "",
    nationality: "indian",
    order: 0
  });

  const loadPrices = async () => {
    try {
      const response = await apiFetch("/api/ticket-prices");
      if (response.ok) {
        setPrices(await response.json());
      }
    } catch (error) {
      console.error("Failed to load ticket prices", error);
    }
  };

  useEffect(() => {
    loadPrices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = form._id ? "PUT" : "POST";
    const url = form._id ? `/api/ticket-prices/${form._id}` : "/api/ticket-prices";

    try {
      const res = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        loadPrices();
        setShowForm(false);
        setForm({ category: "", entryFee: "", jeepHire: "", nationality: "indian", order: 0 });
      }
    } catch (error) {
      console.error("Failed to save ticket price", error);
    }
  };

  const deletePrice = async (id) => {
    if (!confirm("Are you sure you want to delete this price entry?")) return;
    try {
      await apiFetch(`/api/ticket-prices/${id}`, { method: "DELETE" });
      loadPrices();
    } catch (error) {
      console.error("Failed to delete ticket price", error);
    }
  };

  const handleEdit = (p) => {
    setForm(p);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Manage Ticket Prices</h2>
        <button
          onClick={() => {
            setForm({ category: "", entryFee: "", jeepHire: "", order: prices.length });
            setShowForm(true);
          }}
          className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-900 shadow-lg hover:scale-105 transition"
        >
          + Add New Rate
        </button>
      </div>

      {showForm && (
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">{form._id ? "Edit Rate Entry" : "Add New Visitor Category"}</h3>
            <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Visitor Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-white outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all"
                placeholder="e.g. Indian Nationals"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Entry Fee</label>
              <input
                value={form.entryFee}
                onChange={(e) => setForm({ ...form, entryFee: e.target.value })}
                className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-white outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all"
                placeholder="e.g. ₹150"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Jeep Hire</label>
              <input
                value={form.jeepHire}
                onChange={(e) => setForm({ ...form, jeepHire: e.target.value })}
                className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-white outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all"
                placeholder="e.g. ₹2,500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Display Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-white outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all"
              />
            </div>

            <div className="lg:col-span-4 flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 text-sm font-semibold text-white/50 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-amber-400 px-10 py-3 text-sm font-black text-slate-900 shadow-xl shadow-amber-400/20 hover:scale-105 transition-transform"
              >
                {form._id ? "Update Rate" : "Save Rate"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-left text-xs font-semibold uppercase tracking-widest text-white/40">
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Visitor Category</th>
              <th className="px-6 py-4">Entry Fee</th>
              <th className="px-6 py-4">Jeep Hire</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-white/30 italic">
                  No ticket prices added yet.
                </td>
              </tr>
            ) : (
              prices.map((p) => (
                <tr key={p._id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                  <td className="px-6 py-5 text-white/30 font-mono text-xs">{p.order}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-lg">
                        {p.category.toLowerCase().includes('foreign') ? "🌎" : "🇮🇳"}
                      </div>
                      <span className="font-bold text-white">{p.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center rounded-lg bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-400 border border-emerald-500/20">
                      {p.entryFee}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center rounded-lg bg-blue-500/10 px-3 py-1 text-sm font-bold text-blue-400 border border-blue-500/20">
                      {p.jeepHire}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(p)}
                        className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-black text-slate-900 shadow-lg shadow-amber-400/20 hover:scale-110 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePrice(p._id)}
                        className="rounded-xl bg-red-500 px-4 py-2 text-xs font-black text-white shadow-lg shadow-red-500/20 hover:scale-110 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
