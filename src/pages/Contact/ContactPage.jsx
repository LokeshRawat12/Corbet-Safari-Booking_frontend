import { useState } from "react";
import PageTemplate from "../../components/PageTemplate";
import { countryCodes } from "../../data/countries";
import { apiFetch } from "../../utils/api";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", countryCode: "+91", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSubmitted(false);

    try {
      const response = await apiFetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          phone: `${form.countryCode} ${form.phone}`
        }),
      });

      if (!response.ok) {
        let errorMessage = "Something went wrong.";
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text or generic message
          errorMessage = `Error (${response.status}): ${response.statusText || "Server error"}`;
        }
        throw new Error(errorMessage);
      }

      setSubmitted(true);
      setForm({ name: "", email: "", countryCode: "+91", phone: "", message: "" });
    } catch (err) {
      setError(err.message === "Unexpected end of JSON input" 
        ? "The server returned an empty response. Please check if the backend is running and configured correctly."
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTemplate  title="Contact Us" description="Reach out for help planning your Corbett trip.">
      <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-2">
        <div className="rounded-2xl bg-white/60 p-6 shadow-lg backdrop-blur">
          <h2 className="text-xl font-semibold">Get in touch</h2>
          <p className="mt-2 text-sm text-slate-600">
            Send us a message and we will reply as soon as possible. You can also call or WhatsApp us anytime.
          </p>

          <div className="mt-6 space-y-4 text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-black">
                <i className="fas fa-phone" />
              </span>
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-sm text-slate-600">+91-8979668105</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-black">
                <i className="fas fa-envelope" />
              </span>
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-sm text-slate-600">contact@corbettnationalpark.in</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-black">
                <i className="fas fa-map-marker-alt" />
              </span>
              <div>
                <p className="font-semibold">Location</p>
                <p className="text-sm text-slate-600">Ramnagar, Uttarakhand, India</p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white/60 p-6 shadow-lg backdrop-blur"
        >
          <h2 className="text-xl font-semibold">Send a message</h2>
          {submitted && (
            <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Thanks for reaching out! We've received your message and will reply shortly.
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <label className="mt-6 block">
            <span className="text-sm font-medium text-slate-700">Your Name</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/70 px-4 py-2 text-sm shadow-inner outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/70 px-4 py-2 text-sm shadow-inner outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40"
            />
          </label>

          <div className="mt-4">
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

          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700">Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              required
              className="mt-2 w-full resize-none rounded-xl border border-white/30 bg-white/70 px-4 py-2 text-sm shadow-inner outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/40"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`mt-6 inline-flex w-full items-center justify-center rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-black shadow-lg transition hover:bg-secondary/90 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </PageTemplate>
  );
}