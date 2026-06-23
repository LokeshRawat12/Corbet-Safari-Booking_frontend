import { useState, useEffect } from "react";
import PageTemplate from "../../components/PageTemplate";

const initialTicketRates = [
  { category: "Indian Nationals", entryFee: "₹150", jeepHire: "₹2,500" },
  { category: "Foreign Nationals", entryFee: "₹600", jeepHire: "₹4,500" },
];

const timings = [
  { label: "Morning", value: "06:00 AM - 09:00 AM" },
  { label: "Evening", value: "03:00 PM - 06:00 PM" },
];

const cameraFees = [
  { label: "Still Camera", value: "Free / ₹500" },
  { label: "Professional Video", value: "₹2,500+" },
];

export default function TicketPage() {
  const [ticketRates, setTicketRates] = useState(initialTicketRates);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ticket-prices`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setTicketRates(data);
        }
      } catch (err) {
        console.error("Failed to fetch ticket prices", err);
      }
    }
    fetchPrices();
  }, [API_BASE_URL]);

  return (
    <PageTemplate
      title="Tickets & Entry Fees"
      description="Official safari rates and park entry charges."
    >
      <section className="mx-auto max-w-4xl space-y-10">
        <div className="rounded-2xl bg-white/60 p-6 shadow-lg backdrop-blur">
          <h2 className="text-xl font-semibold">Jeep Safari Charges</h2>
          <p className="mt-2 text-sm text-slate-600">
            Safari charges include park entry fees and vehicle hiring charges. Rates are subject to change
            based on season and government policy.
          </p>

          <div className="mt-6 overflow-hidden rounded-xl border border-white/20">
            <table className="w-full text-left">
              <thead className="bg-white/30 text-sm font-semibold text-slate-700">
                <tr>
                  <th className="px-4 py-3">Visitor Category</th>
                  <th className="px-4 py-3">Entry Fee</th>
                  <th className="px-4 py-3">Jeep Hire</th>
                </tr>
              </thead>
              <tbody>
                {ticketRates.map((rate, idx) => (
                  <tr
                    key={rate._id || idx}
                    className="border-t border-white/20 bg-white/40 text-sm text-slate-700"
                  >
                    <td className="px-4 py-3 font-medium">{rate.category}</td>
                    <td className="px-4 py-3">{rate.entryFee || rate.entry}</td>
                    <td className="px-4 py-3">{rate.jeepHire || rate.jeep}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white/60 p-6 shadow-lg backdrop-blur">
            <h3 className="text-lg font-semibold">Safari Timings</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {timings.map((t) => (
                <li key={t.label} className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-black">
                    <i className="fas fa-clock" />
                  </span>
                  <span>
                    <span className="font-semibold">{t.label}:</span> {t.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-white/60 p-6 shadow-lg backdrop-blur">
            <h3 className="text-lg font-semibold">Camera Fees</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {cameraFees.map((item) => (
                <li key={item.label} className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-black">
                    <i className="fas fa-camera" />
                  </span>
                  <span>
                    <span className="font-semibold">{item.label}:</span> {item.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </PageTemplate>
  );
}

