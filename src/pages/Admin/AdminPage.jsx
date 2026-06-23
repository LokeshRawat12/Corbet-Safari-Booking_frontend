import { useState, useEffect, useMemo } from "react";
import ZoneManager from "./ZoneManager";
import TicketPriceManager from "./TicketPriceManager";
import PackageManager from "./PackageManager";
import ContactManager from "./ContactManager";




const ADMIN_PASSWORD = "lavirawat1234";
const LS_KEY = "corbett_bookings";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
async function getBookingsFromAPI() {
  try {
    const response = await fetch("/api/bookings");
    if (!response.ok) return [];
    const data = await response.json();
    return data;
  } catch {
    return [];
  }
}

async function updateBookingStatus(id, status) {
  try {
    const response = await fetch(`/api/bookings/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function getHotelsFromAPI() {
  try {
    const response = await fetch("/api/hotels");
    if (!response.ok) return [];
    return await response.json();
  } catch { return []; }
}

function exportCSV(bookings) {
  const headers = [
    "ID", "Status", "Submitted", "Name", "Email", "Phone", "Country",
    "Zone", "Package", "Price", "Payment", "Paid", "Remaining", "Hotel", "Hotel Name", "Date", "Adults", "Children", "Notes",
  ];
  const rows = bookings.map((b) => [
    b._id || b.id, b.status, b.submittedAt, b.name, b.email, b.phone, b.country,
    b.packageTitle,
    b.tourismZone || "Default",
    `${b.packageCurrency} ${b.packagePrice}`,
    b.paymentType || "full",
    b.amountPaid || b.packagePrice,
    b.amountRemaining || 0,
    b.hotelRequired ? "Yes" : "No",
    b.hotelName || "N/A",
    b.date, b.adults, b.children,
    `"${(b.notes || "").replace(/"/g, "'")}"`,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "corbett_bookings.csv";
  a.click();
}

function fmt(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/* ─────────────────────────────────────────────
   Login Screen
───────────────────────────────────────────── */
function LoginScreen({ onLogin }) {
  const [pwd, setPwd] = useState("");
  const [shake, setShake] = useState(false);
  const [show, setShow] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPwd("");
    }
  };

  return (
    <div className="admin-bg flex min-h-screen items-center justify-center p-4">
      <style>{globalStyles}</style>
      <div
        className={`w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-10 shadow-2xl backdrop-blur-2xl ${shake ? "admin-shake" : ""}`}
        style={{ animation: "adminPop .45s cubic-bezier(.22,1,.36,1) both" }}
      >
        <div className="mb-8 text-center">
          <span className="mb-3 inline-block text-5xl">🌿</span>
          <h1 className="text-2xl font-extrabold text-white">Admin Portal</h1>
          <p className="mt-1 text-sm text-white/60">Corbett Safari — Booking Dashboard</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-widest text-white/60">
            Password
            <div className="relative mt-2">
              <input
                type={show ? "text" : "password"}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 pr-11 text-sm text-white placeholder-white/30 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white"
              >
                {show ? "🙈" : "👁️"}
              </button>
            </div>
          </label>

          <button
            type="submit"
            className="group relative mt-2 w-full overflow-hidden rounded-2xl bg-amber-400 py-3 text-sm font-bold text-slate-900 shadow-lg transition-all hover:scale-[1.02] hover:shadow-amber-400/40"
          >
            <span className="relative z-10">Login to Dashboard</span>
            <span className="absolute inset-0 -translate-x-full bg-amber-300 transition-transform duration-500 group-hover:translate-x-0" />
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Stat Card
───────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div
      className="rounded-2xl border border-white/10 bg-white/8 p-5 backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:bg-white/12"
      style={{ animation: "adminFadeUp .5s cubic-bezier(.22,1,.36,1) both" }}
    >
      <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl text-xl ${color}`}>
        {icon}
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-white/50">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Booking Row
───────────────────────────────────────────── */
function BookingRow({ b, onDelete, onStatusUpdate, selected, onSelect }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className={`border-b border-white/8 transition-colors duration-200 ${selected ? "bg-amber-400/10" : "hover:bg-white/5"}`}
      >
         <td className="px-4 py-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(b._id || b.id)}
            className="h-4 w-4 rounded accent-amber-400"
          />
        </td>
        <td className="px-4 py-3">
          <span className="rounded-lg bg-amber-400/20 px-2 py-0.5 text-xs font-bold text-amber-300">
            {(b._id || b.id).slice(-6)}
          </span>
        </td>
        <td className="px-4 py-3">
          {b.status === "paid" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              Paid
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/20">
              <span className="h-1 w-1 animate-pulse rounded-full bg-amber-400" />
              Pending
            </span>
          )}
        </td>
        <td className="px-4 py-3">
          <p className="font-semibold text-white">{b.name}</p>
          <p className="text-xs text-white/40">{b.email}</p>
        </td>
        <td className="px-4 py-3 text-sm text-white/70">{b.phone}</td>
        <td className="px-4 py-3">
          <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-white/60">
            {b.tourismZone || "Default"}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-white/70">{b.country}</td>
        <td className="px-4 py-3">
          <p className="text-sm font-semibold text-white">{b.packageTitle}</p>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs text-amber-400">Total: {b.packageCurrency} {Number(b.packagePrice).toLocaleString()}</p>
            {b.paymentType === "half" ? (
              <>
                <p className="text-xs text-green-400">Paid: {b.packageCurrency} {Number(b.amountPaid || b.packagePrice / 2).toLocaleString()} (50%)</p>
                <p className="text-xs text-red-400">Due: {b.packageCurrency} {Number(b.amountRemaining || b.packagePrice / 2).toLocaleString()}</p>
              </>
            ) : (
              <p className="text-xs text-green-400">Paid: {b.packageCurrency} {Number(b.amountPaid || b.packagePrice).toLocaleString()} (100%)</p>
            )}
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-white/70">{b.date || "—"}</td>
        <td className="px-4 py-3 text-sm text-white/50">
          <span className="whitespace-nowrap">{b.adults}A / {b.children}C</span>
        </td>
        <td className="px-4 py-3 text-xs text-white/40">{fmt(b.submittedAt)}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/20"
            >
              {expanded ? "Close" : "View"}
            </button>
            {b.status !== "paid" && (
              <button
                onClick={() => onStatusUpdate(b._id || b.id, "paid")}
                className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs text-emerald-300 transition hover:bg-emerald-500/40"
                title="Mark as Paid"
              >
                Confirm
              </button>
            )}
            <button
              onClick={() => onDelete(b._id || b.id)}
              className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-500/40"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>

      {expanded && (
        <tr className="bg-white/5">
          <td colSpan={11} className="px-6 py-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">Hotel Details</p>
                {b.hotelRequired ? (
                  <div className="flex items-center gap-2 text-sm text-emerald-400 font-bold">
                    <span>🏨 {b.hotelName || "Preferred Hotel"}</span>
                  </div>
                ) : (
                  <p className="text-sm text-white/30 italic">No hotel accommodation requested</p>
                )}
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">Notes / Special Requirements</p>
                <p className="text-sm text-white/80">{b.notes || "None provided"}</p>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">Full Package Identity</p>
                <p className="text-sm text-white/60 font-mono tracking-tighter truncate">{b.packageSlug}</p>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">Tourism Zone</p>
                <div className="flex items-center gap-2 text-sm text-amber-400 font-bold">
                  <span>🗺️ {b.tourismZone || "None Selected"}</span>
                </div>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">Transaction Details</p>
                <p className="text-sm text-amber-300 font-mono">{b.transactionId || "No Transaction ID"}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function HotelManager() {
  const [hotels, setHotels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    name: "", 
    location: "", 
    price: 0, 
    rating: 4.5, 
    image: "",
    gallery: [],
    facilities: [],
    policies: [],
    mapUrl: "",
    freeCancellation: true,
    breakfastIncluded: true,
    rooms: []
  });

  const loadHotels = async () => {
    const data = await getHotelsFromAPI();
    setHotels(data);
  };

  useEffect(() => { loadHotels(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = form._id ? "PUT" : "POST";
    const url = form._id ? `/api/hotels/${form._id}` : "/api/hotels";
    
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    
    if (res.ok) {
      loadHotels();
      setShowForm(false);
      setForm({ name: "", location: "", price: 0, rating: 4.5, image: "", gallery: [], facilities: [], policies: [], mapUrl: "", freeCancellation: true, breakfastIncluded: true, rooms: [] });
    }
  };

  const deleteHotel = async (id) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/hotels/${id}`, { method: "DELETE" });
    loadHotels();
  };

  const addRoom = () => {
    const room = {
      type: "New Room",
      image: "",
      originalPrice: 0,
      discountPrice: 0,
      taxes: 0,
      features: ["LED TV", "Wifi", "Housekeeping"],
      mealPlans: [
        { label: "Room Only", isIncluded: true },
        { label: "Free Breakfast", isIncluded: true },
        { label: "Breakfast & Lunch/Dinner", isIncluded: true },
        { label: "Breakfast, Lunch & Dinner", isIncluded: true }
      ],
      checkIn: "12:00 PM",
      checkOut: "11:00 AM"
    };
    setForm({ ...form, rooms: [...(form.rooms || []), room] });
  };

  const removeRoom = (idx) => {
    const rooms = [...form.rooms];
    rooms.splice(idx, 1);
    setForm({ ...form, rooms });
  }

  const updateRoom = (idx, field, val) => {
    const rooms = [...form.rooms];
    rooms[idx] = { ...rooms[idx], [field]: val };
    setForm({ ...form, rooms });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Manage Hotels</h2>
        <button 
          onClick={() => { setForm({ name: "", location: "", price: 0, rating: 4.5, image: "", gallery: [], facilities: [], policies: [], mapUrl: "", freeCancellation: true, breakfastIncluded: true, rooms: [] }); setShowForm(true); }}
          className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-900 shadow-lg hover:scale-105 transition"
        >
          + Add New Hotel
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-white/40">Hotel Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded-xl bg-white/10 p-3 text-sm text-white outline-none border border-white/10" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-white/40">Location</label>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full rounded-xl bg-white/10 p-3 text-sm text-white outline-none border border-white/10" required />
            </div>
            
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-bold uppercase text-white/40">Hotel Description</label>
              <textarea 
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})} 
                className="w-full rounded-xl bg-white/10 p-3 text-sm text-white outline-none border border-white/10 h-24"
                placeholder="Describe the property..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-white/40">Category</label>
              <select 
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value})} 
                className="w-full rounded-xl bg-white/10 p-3 text-sm text-white outline-none border border-white/10"
              >
                <option value="luxury">Luxury</option>
                <option value="mid-range">Mid-Range</option>
                <option value="budget">Budget</option>
                <option value="camp">Camp</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-white/40">Base Price (Starting from ₹)</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} className="w-full rounded-xl bg-white/10 p-3 text-sm text-white outline-none border border-white/10" required />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-white/40">Thumbnail Image URL</label>
              <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full rounded-xl bg-white/10 p-3 text-sm text-white outline-none border border-white/10" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-white/40">Facilities (Comma separated)</label>
              <input value={form.facilities?.join(", ")} onChange={e => setForm({...form, facilities: e.target.value.split(",").map(s => s.trim())})} className="w-full rounded-xl bg-white/10 p-3 text-sm text-white outline-none border border-white/10" placeholder="WiFi, Pool, AC..." />
            </div>
            
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-bold uppercase text-white/40">Gallery (Comma separated URLs)</label>
              <textarea 
                value={form.gallery?.join(", ")} 
                onChange={e => setForm({...form, gallery: e.target.value.split(",").map(s => s.trim())})} 
                className="w-full rounded-xl bg-white/10 p-3 text-sm text-white outline-none border border-white/10 h-20"
                placeholder="url1, url2, url3..."
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-bold uppercase text-white/40">Google Maps Embed URL</label>
              <input value={form.mapUrl} onChange={e => setForm({...form, mapUrl: e.target.value})} className="w-full rounded-xl bg-white/10 p-3 text-sm text-white outline-none border border-white/10" placeholder="https://google.com/maps/..." />
            </div>
            
            <div className="flex items-center gap-6 py-2 sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.freeCancellation} onChange={e => setForm({...form, freeCancellation: e.target.checked})} className="h-4 w-4 rounded accent-amber-400" />
                <span className="text-sm text-white/70">Free Cancellation</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.breakfastIncluded} onChange={e => setForm({...form, breakfastIncluded: e.target.checked})} className="h-4 w-4 rounded accent-amber-400" />
                <span className="text-sm text-white/70">Breakfast Included</span>
              </label>
            </div>

            <div className="sm:col-span-2 space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-amber-400">Available Room Types</h3>
                <button type="button" onClick={addRoom} className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-400 px-3 py-1 rounded-lg hover:bg-amber-400/30 transition">+ Add Room Type</button>
              </div>

              {(form.rooms || []).map((room, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
                  <div className="flex justify-between items-center bg-white/5 -mx-5 -mt-5 p-4 rounded-t-2xl border-b border-white/10">
                    <input 
                      value={room.type} 
                      onChange={e => updateRoom(idx, 'type', e.target.value)}
                      placeholder="Room Type Name"
                      className="bg-transparent text-amber-400 font-bold outline-none text-sm w-1/2"
                    />
                    <button type="button" onClick={() => removeRoom(idx)} className="text-red-400 text-[10px] font-bold uppercase tracking-widest hover:text-red-300">Remove Room</button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold uppercase text-white/40">Room Image</label>
                      <input value={room.image} onChange={e => updateRoom(idx, 'image', e.target.value)} className="w-full rounded-lg bg-white/10 p-2 text-xs text-white border border-white/10 outline-none" placeholder="URL..." />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold uppercase text-white/40">Original (₹)</label>
                      <input type="number" value={room.originalPrice} onChange={e => updateRoom(idx, 'originalPrice', Number(e.target.value))} className="w-full rounded-lg bg-white/10 p-2 text-xs text-white border border-white/10 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold uppercase text-white/40">Discount (₹)</label>
                      <input type="number" value={room.discountPrice} onChange={e => updateRoom(idx, 'discountPrice', Number(e.target.value))} className="w-full rounded-lg bg-white/10 p-2 text-xs text-white border border-white/10 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold uppercase text-white/40">Taxes (₹)</label>
                      <input type="number" value={room.taxes} onChange={e => updateRoom(idx, 'taxes', Number(e.target.value))} className="w-full rounded-lg bg-white/10 p-2 text-xs text-white border border-white/10 outline-none" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold uppercase text-white/40">Check-In / Out</label>
                      <div className="flex gap-2">
                        <input value={room.checkIn} onChange={e => updateRoom(idx, 'checkIn', e.target.value)} className="flex-1 rounded-lg bg-white/10 p-2 text-xs text-white border border-white/10 outline-none" placeholder="12:00 PM" />
                        <input value={room.checkOut} onChange={e => updateRoom(idx, 'checkOut', e.target.value)} className="flex-1 rounded-lg bg-white/10 p-2 text-xs text-white border border-white/10 outline-none" placeholder="11:00 AM" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold uppercase text-white/40">Features (Comma separated)</label>
                      <input value={room.features?.join(", ")} onChange={e => updateRoom(idx, 'features', e.target.value.split(",").map(s => s.trim()))} className="w-full rounded-lg bg-white/10 p-2 text-xs text-white border border-white/10 outline-none" placeholder="WiFi, AC, TV..." />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[8px] font-bold uppercase text-white/40">Select Active Meal Plans</label>
                    <div className="flex flex-wrap gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                      {(room.mealPlans || []).map((mp, mIdx) => (
                        <label key={mIdx} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={mp.isIncluded} 
                            onChange={e => {
                              const nm = [...room.mealPlans]; nm[mIdx] = { ...nm[mIdx], isIncluded: e.target.checked };
                              updateRoom(idx, 'mealPlans', nm);
                            }}
                            className="h-3 w-3 rounded accent-amber-400" 
                          />
                          <span className="text-[10px] text-white/50 group-hover:text-white/80 transition">{mp.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3 pt-6 border-t border-white/10">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 text-sm text-white/50 hover:text-white transition uppercase font-bold tracking-widest text-[10px]">Back</button>
              <button type="submit" className="rounded-xl bg-amber-400 px-8 py-2 text-sm font-bold text-slate-900 shadow-xl hover:scale-105 active:scale-95 transition">Update Hotel Information</button>
            </div>
          </form>
        </div>
      )}


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hotels.map(h => (
          <div key={h._id} className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition hover:bg-white/8 hover:border-white/20">
            <div className="h-32 bg-slate-800 relative">
              {h.image && <img src={h.image} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" alt="" />}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                {h.freeCancellation && <span className="bg-emerald-500/80 backdrop-blur px-2 py-0.5 rounded text-[8px] font-bold text-white uppercase">Free Cancellation</span>}
                {h.breakfastIncluded && <span className="bg-blue-500/80 backdrop-blur px-2 py-0.5 rounded text-[8px] font-bold text-white uppercase">Breakfast Incl.</span>}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white">{h.name}</h3>
              <p className="text-xs text-white/50">{h.location} • ₹{h.price.toLocaleString()}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => { setForm(h); setShowForm(true); }} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition">Edit</button>
                <button onClick={() => deleteHotel(h._id)} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────
   Main Admin Dashboard
 ───────────────────────────────────────────── */
function Dashboard({ onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [filterPkg, setFilterPkg] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selected, setSelected] = useState(new Set());
  const [confirmClear, setConfirmClear] = useState(false);
  const [activeTab, setActiveTab] = useState("bookings");

  const load = async () => {
    const data = await getBookingsFromAPI();
    setBookings(data);
  };

  const handleUpdateStatus = async (id, status) => {
    const ok = await updateBookingStatus(id, status);
    if (ok) {
      setBookings(prev => prev.map(b => (b._id === id || b.id === id) ? { ...b, status } : b));
    } else {
      alert("Failed to update status");
    }
  };

  // Auto-refresh every 10s
  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  const packages = useMemo(() => {
    const set = new Set(bookings.map((b) => b.packageTitle).filter(Boolean));
    return ["all", ...set];
  }, [bookings]);

  const filtered = useMemo(() => {
    let list = [...bookings];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.name?.toLowerCase().includes(q) ||
          b.email?.toLowerCase().includes(q) ||
          b.phone?.includes(q) ||
          (b._id || b.id)?.toLowerCase().includes(q) ||
          b.packageTitle?.toLowerCase().includes(q)
      );
    }
    if (filterPkg !== "all") list = list.filter((b) => b.packageTitle === filterPkg);
    if (sortBy === "newest") list.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    else if (sortBy === "oldest") list.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
    else if (sortBy === "price-high") list.sort((a, b) => b.packagePrice - a.packagePrice);
    else if (sortBy === "price-low") list.sort((a, b) => a.packagePrice - b.packagePrice);
    return list;
  }, [bookings, search, filterPkg, sortBy]);

  const totalRevenue = bookings.reduce((s, b) => s + Number(b.packagePrice || 0), 0);
  const todayCount = bookings.filter((b) => {
    const d = new Date(b.submittedAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const fullPaidCount = bookings.filter((b) => b.paymentType === "full" || !b.paymentType).length;
  const halfPaidCount = bookings.filter((b) => b.paymentType === "half").length;

  const deleteOne = async (id) => {
    try {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      load();
      setSelected((prev) => { const s = new Set(prev); s.delete(id); return s; });
    } catch (e) { console.error(e); }
  };

  const deleteSelected = async () => {
    try {
      await Promise.all([...selected].map(id => fetch(`/api/bookings/${id}`, { method: 'DELETE' })));
      load();
      setSelected(new Set());
    } catch (e) { console.error(e); }
  };

  const clearAll = async () => {
    try {
      await Promise.all(bookings.map(b => fetch(`/api/bookings/${b._id || b.id}`, { method: 'DELETE' })));
      load();
      setSelected(new Set());
      setConfirmClear(false);
    } catch (e) { console.error(e); }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((b) => b._id || b.id)));
  };

  return (
    <div className="admin-bg min-h-screen text-white">
      <style>{globalStyles}</style>

      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌿</span>
            <div>
              <h1 className="text-lg font-extrabold leading-none">Admin Dashboard</h1>
              <p className="text-xs text-white/40">Corbett Safari — Booking Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportCSV(filtered)}
              className="flex items-center gap-2 rounded-xl bg-green-500/20 px-4 py-2 text-xs font-semibold text-green-300 transition hover:bg-green-500/30"
            >
              📥 Export CSV
            </button>
            <button
              onClick={onLogout}
              className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/20"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 py-4">
        <div className="flex gap-4 border-b border-white/10 mb-6">
          <button 
            onClick={() => setActiveTab("bookings")}
            className={`pb-3 text-sm font-bold transition-all ${activeTab === "bookings" ? "border-b-2 border-amber-400 text-amber-400" : "text-white/40 hover:text-white/60"}`}
          >
            📋 Bookings
          </button>
          <button 
            onClick={() => setActiveTab("hotels")}
            className={`pb-3 text-sm font-bold transition-all ${activeTab === "hotels" ? "border-b-2 border-amber-400 text-amber-400" : "text-white/40 hover:text-white/60"}`}
          >
            🏨 Hotels
          </button>
          <button 
            onClick={() => setActiveTab("zones")}
            className={`pb-3 text-sm font-bold transition-all ${activeTab === "zones" ? "border-b-2 border-amber-400 text-amber-400" : "text-white/40 hover:text-white/60"}`}
          >
            🗺️ Zones
          </button>
          <button 
            onClick={() => setActiveTab("packages")}
            className={`pb-3 text-sm font-bold transition-all ${activeTab === "packages" ? "border-b-2 border-amber-400 text-amber-400" : "text-white/40 hover:text-white/60"}`}
          >
            📦 Packages
          </button>
          <button 
            onClick={() => setActiveTab("rates")}
            className={`pb-3 text-sm font-bold transition-all ${activeTab === "rates" ? "border-b-2 border-amber-400 text-amber-400" : "text-white/40 hover:text-white/60"}`}
          >
            🎟️ Rates
          </button>
          <button 
            onClick={() => setActiveTab("messages")}
            className={`pb-3 text-sm font-bold transition-all ${activeTab === "messages" ? "border-b-2 border-amber-400 text-amber-400" : "text-white/40 hover:text-white/60"}`}
          >
            💬 Messages
          </button>
        </div>




        {activeTab === "bookings" ? (
          <>
            {/* Stats row */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon="📋" label="Total Bookings" value={bookings.length} sub="All time" color="bg-blue-500/20 text-blue-300" />
          <StatCard icon="💰" label="Total Revenue" value={`₹ ${totalRevenue.toLocaleString()}`} sub="From all bookings" color="bg-amber-500/20 text-amber-300" />
          <StatCard icon="📅" label="Today's Bookings" value={todayCount} sub={new Date().toLocaleDateString("en-IN", { weekday: "long" })} color="bg-emerald-500/20 text-emerald-300" />
          <StatCard icon="💳" label="Payment Stats" value={`${fullPaidCount} / ${halfPaidCount}`} sub="Full / Half Paid" color="bg-purple-500/20 text-purple-300" />
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
            <input
              type="text"
              placeholder="Search name, email, ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/8 py-2.5 pl-9 pr-4 text-sm text-white placeholder-white/30 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
            />
          </div>

          {/* Package filter */}
          <select
            value={filterPkg}
            onChange={(e) => setFilterPkg(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/8 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400/60"
          >
            {packages.map((p) => (
              <option key={p} value={p} className="bg-slate-900">
                {p === "all" ? "All Packages" : p}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/8 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400/60"
          >
            <option value="newest" className="bg-slate-900">Newest First</option>
            <option value="oldest" className="bg-slate-900">Oldest First</option>
            <option value="price-high" className="bg-slate-900">Price: High → Low</option>
            <option value="price-low" className="bg-slate-900">Price: Low → High</option>
          </select>

          <div className="ml-auto flex items-center gap-2">
            {selected.size > 0 && (
              <button
                onClick={deleteSelected}
                className="rounded-xl bg-red-500/20 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/40"
              >
                🗑 Delete Selected ({selected.size})
              </button>
            )}
            <button
              onClick={() => setConfirmClear(true)}
              className="rounded-xl bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400/70 transition hover:bg-red-500/25"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Result count */}
        <p className="mb-3 text-xs text-white/40">
          Showing <strong className="text-white/70">{filtered.length}</strong> of {bookings.length} bookings
        </p>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 py-20 text-center">
            <span className="text-5xl">📭</span>
            <p className="text-lg font-bold text-white/60">No bookings found</p>
            <p className="text-sm text-white/30">
              {bookings.length === 0 ? "Bookings will appear here once customers submit." : "Try changing your search or filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-left text-xs font-semibold uppercase tracking-widest text-white/40">
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded accent-amber-400"
                    />
                  </th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Package</th>
                  <th className="px-4 py-3">Zone</th>
                  <th className="px-4 py-3">Safari Date</th>
                  <th className="px-4 py-3">Guests</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <BookingRow
                    key={b._id || b.id}
                    b={b}
                    onDelete={deleteOne}
                    onStatusUpdate={handleUpdateStatus}
                    selected={selected.has(b._id || b.id)}
                    onSelect={toggleSelect}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
          </>
        ) : activeTab === "hotels" ? (
          <HotelManager />
        ) : activeTab === "zones" ? (
          <ZoneManager />
        ) : activeTab === "packages" ? (
          <PackageManager />
        ) : activeTab === "rates" ? (
          <TicketPriceManager />
        ) : (
          <ContactManager />
        )}



      </div>

      {/* Confirm Clear Modal */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-3xl border border-white/20 bg-slate-900 p-8 text-center shadow-2xl"
            style={{ animation: "adminPop .3s cubic-bezier(.22,1,.36,1) both" }}>
            <p className="text-5xl mb-4">⚠️</p>
            <h3 className="text-lg font-bold text-white mb-2">Delete All Bookings?</h3>
            <p className="text-sm text-white/50 mb-6">This cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setConfirmClear(false)}
                className="rounded-xl bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
                Cancel
              </button>
              <button onClick={clearAll}
                className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-400">
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Root Export
───────────────────────────────────────────── */
export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem("admin_auth") === "1");

  const login = () => { sessionStorage.setItem("admin_auth", "1"); setLoggedIn(true); };
  const logout = () => { sessionStorage.removeItem("admin_auth"); setLoggedIn(false); };

  return loggedIn ? <Dashboard onLogout={logout} /> : <LoginScreen onLogin={login} />;
}

/* ─────────────────────────────────────────────
   Global styles (self-contained, no Tailwind clash)
───────────────────────────────────────────── */
const globalStyles = `
  .admin-bg {
    background: linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #1a1a0f 100%);
  }
  .bg-white\\/8  { background: rgba(255,255,255,0.08); }
  .bg-white\\/12 { background: rgba(255,255,255,0.12); }
  .border-white\\/8  { border-color: rgba(255,255,255,0.08); }

  @keyframes adminPop {
    from { opacity: 0; transform: scale(.9); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes adminFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);     }
  }
  @keyframes adminShake {
    0%,100% { transform: translateX(0); }
    20%,60% { transform: translateX(-8px); }
    40%,80% { transform: translateX(8px); }
  }
  .admin-shake { animation: adminShake .5s ease both; }
`;
