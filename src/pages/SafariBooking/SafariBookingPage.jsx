import { useState } from "react";
import PageTemplate from "../../components/PageTemplate";
import { countryCodes } from "../../data/countries";

const safariZones = [
  { value: "dhikala", label: "Dhikala (Canter Safari)" },
  { value: "bijrani", label: "Bijrani (Jeep Safari)" },
  { value: "jhirna", label: "Jhirna (Jeep Safari)" },
  { value: "dhela", label: "Dhela (Jeep Safari)" },
  { value: "garjia", label: "Garjia (Jeep Safari)" },
];

const nationalityOptions = [
  { value: "indian", label: "Indian" },
  { value: "foreigner", label: "Foreigner" },
];

export default function SafariBookingPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    zone: "dhikala",
    date: "",
    people: 2,
    nationality: "indian",
    message: "",
  });
  const [status, setStatus] = useState(null);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus({
      type: "success",
      message: `Thank you ${form.name}! We received your request for a ${form.zone} safari on ${form.date}. We will contact you shortly at ${form.email} or ${form.countryCode} ${form.phone}.`,
    });
  };

  return (
    <PageTemplate
      title="Safari Booking"
      description="Follow these guidelines and send your request to reserve a safari slot."
    >
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-white/60 p-6 shadow-lg backdrop-blur">
            <h2 className="text-xl font-semibold">Booking guidelines</h2>
            <p className="mt-2 text-sm text-slate-600">
              A smooth safari starts with the right permits—here’s what you will need.
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-black">
                  <i className="fas fa-id-card" />
                </span>
                <div>
                  <h3 className="font-semibold">ID Proof Required</h3>
                  <p className="text-sm text-slate-600">
                    Carry a valid photo ID (Aadhaar, Passport or Voter ID) for every guest.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-black">
                  <i className="fas fa-clock" />
                </span>
                <div>
                  <h3 className="font-semibold">Booking Window</h3>
                  <p className="text-sm text-slate-600">
                    Indian nationals can book up to 45 days in advance; foreigners up to 90 days.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-black">
                  <i className="fas fa-exclamation-triangle" />
                </span>
                <div>
                  <h3 className="font-semibold">Cancellation Policy</h3>
                  <p className="text-sm text-slate-600">
                    Permits issued by the Forest Department are non-refundable and non-transferable.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/60 p-6 shadow-lg backdrop-blur">
            <h2 className="text-xl font-semibold">Need help?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Call us directly for urgent requests or questions.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href="tel:+918979668105"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow hover:bg-primary/90"
              >
                <i className="fas fa-phone-alt mr-2" />
                +91-8979668105
              </a>
              <a
                href="https://wa.me/8979668105"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-white/20"
              >
                <i className="fab fa-whatsapp mr-2" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 rounded-2xl bg-white/60 p-6 shadow-lg backdrop-blur"
        >
          <h2 className="text-xl font-semibold">Request a Safari Slot</h2>
          {status && (
            <div
              className={`mt-4 rounded-lg px-4 py-3 text-sm ${
                status.type === "success"
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-amber-50 text-amber-800"
              }`}
            >
              {status.message}
            </div>
          )}
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Full Name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="mt-2 w-full rounded-xl border border-white/30 bg-white/70 px-4 py-2 text-sm shadow-inner outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-white/30 bg-white/70 px-4 py-2 text-sm shadow-inner outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40"
              />
            </label>

            <div className="space-y-1">
              <span className="text-sm font-medium text-slate-700">Phone</span>
              <div className="flex gap-2">
                <input
                  name="countryCode"
                  list="countryCodesList"
                  value={form.countryCode}
                  onChange={handleChange}
                  placeholder="+91"
                  className="mt-2 w-24 rounded-xl border border-white/30 bg-white/70 px-2 py-2 text-sm shadow-inner outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40"
                />
                <datalist id="countryCodesList">
                  {countryCodes.map((c) => (
                    <option key={c.code + c.country} value={c.code}>
                      {c.country}
                    </option>
                  ))}
                </datalist>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="98765 43210"
                  className="mt-2 flex-1 rounded-xl border border-white/30 bg-white/70 px-4 py-2 text-sm shadow-inner outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40"
                />
              </div>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Safari Zone</span>
              <select
                name="zone"
                value={form.zone}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-white/30 bg-white/70 px-4 py-2 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40"
              >
                {safariZones.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Safari Date</span>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border border-white/30 bg-white/70 px-4 py-2 text-sm shadow-inner outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Total Guests</span>
              <input
                name="people"
                type="number"
                min="1"
                max="6"
                value={form.people}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-white/30 bg-white/70 px-4 py-2 text-sm shadow-inner outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Nationality</span>
              <select
                name="nationality"
                value={form.nationality}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-white/30 bg-white/70 px-4 py-2 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40"
              >
                {nationalityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-6 block text-sm font-medium text-slate-700">
            Special Requests
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Dietary preferences, accessibility needs, group requests, etc."
              className="mt-2 h-28 w-full resize-none rounded-xl border border-white/30 bg-white/70 px-4 py-2 text-sm shadow-inner outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40"
            />
          </label>

          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-black shadow-lg transition hover:bg-secondary/90 sm:w-auto"
          >
            Submit Request
          </button>
        </form>
      </div>
    </PageTemplate>
  );
}
