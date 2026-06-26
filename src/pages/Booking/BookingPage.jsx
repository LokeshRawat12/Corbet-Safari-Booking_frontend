import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageTemplate from "../../components/PageTemplate";
import { tourPackages as fallbackPackages } from "../../data/packages";
import { countryCodes } from "../../data/countries";
import { apiFetch } from "../../utils/api";

/* ---------- tiny animation helper ---------- */
const FadeIn = ({ children, delay = 0 }) => (
  <div
    style={{
      animation: `fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) ${delay}s both`,
    }}
  >
    {children}
  </div>
);

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const packageSlugFromQuery = searchParams.get("pkg") ?? "";
  const [selectedPackageSlug, setSelectedPackageSlug] = useState(packageSlugFromQuery);

  const selectedPackage = useMemo(
    () => (packages.length > 0 ? packages : fallbackPackages).find((pkg) => pkg.slug === selectedPackageSlug),
    [selectedPackageSlug, packages]
  );

  useEffect(() => {
    if (packageSlugFromQuery) setSelectedPackageSlug(packageSlugFromQuery);
  }, [packageSlugFromQuery]);

  const isHotelBooking = searchParams.get("type") === "hotel";
  const hotelData = {
    hotelId: searchParams.get("hotelId") || "",
    name: searchParams.get("hotelName") || "",
    roomType: searchParams.get("roomType") || "",
    mealPlan: searchParams.get("mealPlan") || "",
    price: Number(searchParams.get("price")) || 0,
    taxes: Number(searchParams.get("taxes")) || 0,
    date: searchParams.get("date") || "",
    adults: Number(searchParams.get("adults")) || 1,
    children: Number(searchParams.get("children")) || 0,
  };

  useEffect(() => {
    if (!isHotelBooking) return;

    setForm((prev) => ({
      ...prev,
      hotelId: hotelData.hotelId,
      hotelRequired: true,
      hotelName: hotelData.name || prev.hotelName,
      roomType: hotelData.roomType || prev.roomType,
      mealPlan: hotelData.mealPlan || prev.mealPlan,
      hotelPrice: hotelData.price || prev.hotelPrice,
      hotelTaxes: hotelData.taxes || prev.hotelTaxes,
      date: hotelData.date || prev.date,
      adults: hotelData.adults || prev.adults,
      children: hotelData.children || prev.children,
    }));
  }, [
    isHotelBooking,
    hotelData.hotelId,
    hotelData.name,
    hotelData.roomType,
    hotelData.mealPlan,
    hotelData.price,
    hotelData.taxes,
    hotelData.date,
    hotelData.adults,
    hotelData.children,
  ]);

  const initialForm = {
    hotelId: hotelData.hotelId || "",
    name: "",
    email: "",
    phone: "",
    country: "India",
    date: hotelData.date || "",
    adults: hotelData.adults || 1,
    children: hotelData.children || 0,
    paymentType: "full",
    hotelRequired: isHotelBooking,
    hotelName: hotelData.name || "",
    roomType: hotelData.roomType || "",
    mealPlan: hotelData.mealPlan || "",
    hotelPrice: hotelData.price || 0,
    hotelTaxes: hotelData.taxes || 0,
    tourismZone: searchParams.get("zone") || "",
    zonePrice: 0,
    countryCode: "+91",
    notes: "",
    agree: false,
  };

  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [availableHotels, setAvailableHotels] = useState([]);
  const [availableZones, setAvailableZones] = useState([]);

  // Load Razorpay Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    apiFetch("/api/hotels")
      .then(res => res.json())
      .then(data => setAvailableHotels(data || []))
      .catch(err => console.error("Hotel fetch error:", err));
      
    apiFetch("/api/zones")
      .then(res => res.json())
      .then(data => {
        const zones = data || [];
        setAvailableZones(zones);
        
        // Set default zone if not in query, but only if it's open
        const queryZone = searchParams.get("zone");
        let targetZone = null;

        if (queryZone) {
          targetZone = zones.find(d => d.title === queryZone);
        } else if (zones.length > 0) {
          targetZone = zones.find(z => z.isOpen !== false) || zones[0];
        }

        if (targetZone) {
          setForm(prev => {
            const isForeigner = prev.country !== "India";
            const price = isForeigner 
              ? (targetZone.foreignerPrice || (targetZone.price * 5))
              : (targetZone.price || 0);
            return { ...prev, tourismZone: targetZone.title, zonePrice: price };
          });
        }
      })
      .catch(err => console.error("Zone error:", err));

    apiFetch("/api/packages")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPackages(data);
          if (!selectedPackageSlug) setSelectedPackageSlug(data[0].slug);
        } else {
          setPackages(fallbackPackages);
          if (!selectedPackageSlug) setSelectedPackageSlug(fallbackPackages[0].slug);
        }
      })
      .catch(err => {
        console.error("Package fetch error:", err);
        setPackages(fallbackPackages);
        if (!selectedPackageSlug) setSelectedPackageSlug(fallbackPackages[0].slug);
      })
      .finally(() => setLoadingPackages(false));
  }, []);

  useEffect(() => {
    if (!form.hotelRequired || !form.hotelName || !availableHotels.length) return;

    const selectedHotelEntry = availableHotels.find((h) => h.name === form.hotelName);
    if (!selectedHotelEntry) return;

    const selectedRoom = selectedHotelEntry.rooms?.find((r) => r.type === form.roomType) || selectedHotelEntry.rooms?.[0];
    if (!selectedRoom) return;

    const planLabel = form.mealPlan || selectedRoom.mealPlans?.[0]?.label || "Free Breakfast";
    const selectedPlan = selectedRoom.mealPlans?.find((m) => m.label === planLabel) || selectedRoom.mealPlans?.[0];

    let basePrice = selectedRoom.discountPrice || selectedHotelEntry.price || 0;
    if (selectedPlan) {
      if (selectedPlan.label === "Room Only") {
        basePrice = selectedRoom.mealPlans?.some(m => m.label === "Free Breakfast") ? basePrice - 500 : basePrice;
      } else if (selectedPlan.label === "Breakfast & Lunch/Dinner") {
        basePrice += 1500;
      } else if (selectedPlan.label === "Breakfast, Lunch & Dinner") {
        basePrice += 2800;
      }
    }

    setForm((prev) => {
      if (prev.hotelPrice === basePrice && prev.hotelTaxes === (selectedRoom.taxes || 0)) return prev;
      return {
        ...prev,
        hotelPrice: basePrice,
        hotelTaxes: selectedRoom.taxes || 0,
      };
    });
  }, [availableHotels, form.hotelRequired, form.hotelName, form.roomType, form.mealPlan]);
  
  const paymentSuccess = searchParams.get("payment_success") === "true";
  const bookingId = searchParams.get("booking_id");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalBookingId, setFinalBookingId] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === "checkbox" ? checked : value;
    
    setForm((prev) => {
      let updatedForm = { ...prev, [name]: newVal };
      
      // 1. Auto-select Country based on Country Code
      if (name === "countryCode") {
        const matched = countryCodes.find(c => c.code === newVal.trim());
        if (matched) {
          let cName = matched.country.split('/')[0];
          if (cName === "United States") cName = "USA";
          if (cName === "United Kingdom") cName = "UK";
          if (countries.includes(cName)) {
            updatedForm.country = cName;
          } else {
            updatedForm.country = cName === "India" ? "India" : "Other";
          }
        }
      }

      // 2. Update Zone Price based on Zone and Nationality
      if (name === "tourismZone" || name === "country" || name === "countryCode") {
        const selZ = availableZones.find(z => z.title === updatedForm.tourismZone);
        if (selZ) {
          const isForeigner = updatedForm.country !== "India";
          updatedForm.zonePrice = isForeigner 
            ? (selZ.foreignerPrice || (selZ.price * 5)) // Fallback to 5x if foreignerPrice not set
            : (selZ.price || 0);
        }
      }
      
      // Update price if hotel details changed
      if (name === "hotelName" || name === "roomType" || name === "mealPlan" || name === "hotelRequired") {
        if (!updatedForm.hotelRequired) {
          updatedForm.hotelPrice = 0;
          updatedForm.hotelTaxes = 0;
        }
        
        // Update Hotel Price
        if (updatedForm.hotelRequired) {
          // Set defaults if enabled but empty
          if (!updatedForm.hotelName && availableHotels.length > 0) {
            updatedForm.hotelName = availableHotels[0].name;
            updatedForm.roomType = availableHotels[0].rooms?.[0]?.type || "Luxury Room";
            updatedForm.mealPlan = "Free Breakfast";
          }

          const selectedH = availableHotels.find(h => h.name === updatedForm.hotelName);
          if (selectedH) {
            const selectedR = selectedH.rooms?.find(r => r.type === updatedForm.roomType) || selectedH.rooms?.[0];
            if (selectedR) {
              // Simple pricing logic for meal plans
              let basePrice = selectedR.discountPrice || selectedH.price || 0;
              if (updatedForm.mealPlan === "Breakfast & Lunch/Dinner") basePrice += 1500;
              if (updatedForm.mealPlan === "Breakfast, Lunch & Dinner") basePrice += 2800;
              if (updatedForm.mealPlan === "Room Only" && selectedR.mealPlans?.some(m => m.label === "Free Breakfast")) basePrice -= 500;
              
              updatedForm.hotelPrice = basePrice;
              updatedForm.hotelTaxes = selectedR.taxes || 0;
            }
          }
        }
      }
      return updatedForm;
    });
  };

  const handleRazorpayPayment = async (bookingData, razorOrder) => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: razorOrder.key,
      amount: razorOrder.amount,
      currency: razorOrder.currency,
      name: "Corbett Safari",
      description: `Booking for ${bookingData.packageTitle}`,
      order_id: razorOrder.orderId,
      handler: async function (response) {
        setIsVerifying(true);
        try {
          const verifyRes = await apiFetch(`/api/bookings/${bookingData._id}/verify-razorpay`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setFinalBookingId(bookingData._id);
            setForm(prev => ({ ...prev, paymentStatus: 'paid' }));
            setSubmitted(true);
          } else {
            alert("Payment verification failed.");
          }
        } catch (err) {
          console.error("Verification error:", err);
          alert("Error verifying payment.");
        } finally {
          setIsVerifying(false);
        }
      },
      prefill: {
        name: bookingData.name,
        email: bookingData.email,
        contact: bookingData.phone,
      },
      theme: {
        color: "#b48e58",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.agree) return;

    const pkgPrice = selectedPackage?.price ?? 0;
    const hotelPrice = form.hotelRequired ? (form.hotelPrice + form.hotelTaxes) : 0;
    const zonePrice = form.zonePrice || 0;
    const price = pkgPrice + hotelPrice + zonePrice;
    
    const amountPaid = form.paymentType === "half" ? price / 2 : price;
    const amountRemaining = form.paymentType === "half" ? price / 2 : 0;

    const bookingData = {
      packageTitle: selectedPackage?.title ?? "",
      packageSlug: selectedPackage?.slug ?? "",
      packagePrice: price,
      packageCurrency: selectedPackage?.currency ?? "₹",
      paymentType: form.paymentType,
      amountPaid,
      amountRemaining,
      hotelRequired: form.hotelRequired,
      hotelId: form.hotelId,
      hotelName: form.hotelRequired ? form.hotelName : "",
      phone: `${form.countryCode} ${form.phone}`,
      ...form,
    };

    setIsProcessing(true);

    // Send to backend API
    apiFetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })
      .then(async (res) => {
        setIsProcessing(false);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.details || data.error || "Failed to save booking");
        }
        
        if (data.razorpayOrder) {
          handleRazorpayPayment(data, data.razorpayOrder);
        } else {
          setFinalBookingId(data._id);
          setSubmitted(true);
        }
      })
      .catch((err) => {
        setIsProcessing(false);
        console.error("Booking Error:", err);
        alert(`Booking/Payment failed: ${err.message}`);
      });
  };

  /* ---- field style helpers ---- */
  const inputCls = (name) =>
    `mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-300 ${
      focusedField === name
        ? "border-amber-400 bg-white shadow-[0_0_0_3px_rgba(251,191,36,0.2)] ring-0"
        : "border-white/40 bg-white/60 shadow-inner hover:border-amber-300/60"
    }`;

  const labelCls = "relative block text-xs font-semibold tracking-wide text-slate-500 uppercase";

  if (submitted) {
    return (
      <PageTemplate
        title="Booking Confirmed 🎉"
        description="Thank you! We've received your booking request."
      >
        <style>{keyframes}</style>
        <div
          className="mx-auto flex max-w-lg flex-col items-center gap-6 rounded-3xl border border-white/30 bg-white/60 p-12 text-center shadow-2xl backdrop-blur-xl"
          style={{ animation: "popIn 0.5s cubic-bezier(.22,1,.36,1) both" }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-400 text-4xl shadow-lg">
            🌿
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">
            Safari Booked Successfully!
          </h2>
          <div className="w-full space-y-3 rounded-2xl bg-white/50 p-5 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-400">Booking ID</span>
              <span className="font-mono font-bold text-amber-600">#{finalBookingId?.slice(-6) || "NEW"}</span>
            </div>
            {(selectedPackageSlug || !isHotelBooking) && (
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Package</span>
                <span className="font-bold text-slate-700">{selectedPackage?.title || 'None Selected'}</span>
              </div>
            )}
            {form.hotelRequired && (
              <>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Hotel</span>
                  <span className="font-bold text-slate-700">{form.hotelName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Room & Plan</span>
                  <span className="font-bold text-slate-700 text-right">{form.roomType} • {form.mealPlan}</span>
                </div>
              </>
            )}
            {form.tourismZone && (
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Tourism Zone</span>
                <span className="font-bold text-slate-700">{form.tourismZone}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-400">Guest</span>
              <span className="font-bold text-slate-700">{form.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-400">Payment Status</span>
              <span className={`font-bold ${form.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                {form.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Check-In Date</span>
              <span className="font-bold text-slate-700">{form.date}</span>
            </div>
          </div>
          <p className="px-6 text-sm text-slate-500">
            A confirmation email has been sent to <strong>{form.email}</strong>. Our team will contact you shortly.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm(initialForm); }}
            className="mt-2 rounded-full bg-amber-400 px-8 py-3 text-sm font-bold text-slate-900 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-amber-300 hover:shadow-amber-300/40"
          >
            Book Another Safari
          </button>
        </div>
      </PageTemplate>
    );
  }

  if (isVerifying) {
    return (
      <PageTemplate title="Verifying Payment 🔄" description="Please wait while we confirm your payment securely.">
        <style>{keyframes}</style>
        <div
          className="mx-auto flex max-w-lg flex-col items-center gap-8 rounded-3xl border border-white/30 bg-white/60 p-12 text-center shadow-2xl backdrop-blur-xl"
          style={{ animation: "popIn 0.5s cubic-bezier(.22,1,.36,1) both" }}
        >
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-amber-200 opacity-20" />
            <div className="absolute inset-0 animate-spin rounded-full border-[6px] border-amber-400 border-r-transparent shadow-lg" />
            <span className="text-3xl">🔒</span>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Verifying Transaction</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              We are communicating with <strong>Razorpay</strong> to confirm your payment status. 
              Please do not refresh or press the back button.
            </p>
          </div>
          <div className="flex w-full items-center gap-3 rounded-2xl bg-slate-100/50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Razorpay_logo.svg" alt="Razorpay" className="h-4" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Merchant Reference</p>
              <p className="text-xs font-mono text-slate-600 truncate max-w-[200px]">{bookingId}</p>
            </div>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      title="Jungle Safari & Resort Booking"
      description="Reserve your wild adventure and comfortable stay in Corbett National Park."
    >
      <style>{keyframes}</style>

      <form
        className="mx-auto grid max-w-4xl gap-7 px-4 pb-20 pt-4 sm:px-6"
        onSubmit={handleSubmit}
      >


        {/* ── Zone Selection ── */}
        <FadeIn delay={0.02}>
          <section className={cardCls}>
            <SectionHeading icon="🗺️" title="Tourism Zone" />
            <div className="mt-5 space-y-4">
              <label className={labelCls}>
                Choose Tourism Zone
                <select
                  name="tourismZone"
                  value={form.tourismZone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("tourismZone")}
                  onBlur={() => setFocusedField(null)}
                  className={inputCls("tourismZone")}
                  required
                >
                  <option value="">-- Select Zone --</option>
                  {availableZones.map((zone) => (
                    <option key={zone._id} value={zone.title} disabled={zone.isOpen === false}>
                      {zone.title} {zone.isOpen === false ? "(Closed)" : ""}
                    </option>
                  ))}
                </select>
              </label>
              
              {availableZones.find(z => z.title === form.tourismZone)?.isOpen === false && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 animate-pulse">
                  <strong>🚨 Notice:</strong> {availableZones.find(z => z.title === form.tourismZone)?.closureNotice || "This zone is currently closed for bookings."}
                </div>
              )}

              <p className="text-[10px] italic text-slate-400">
                * Selected safari zone for your adventure. 
                <span className="ml-1 font-bold text-amber-600">
                  {form.country === "India" ? "(Indian Rate)" : "(Foreigner Rate)"}
                </span> 
                {" "}Current zone booking fee: <strong>₹{form.zonePrice}</strong>
              </p>
            </div>
          </section>
        </FadeIn>

        {/* ── Package selector ── */}
        <FadeIn delay={0.05}>
          <section className={cardCls}>
            <SectionHeading icon="📦" title="Selected Safari Package" />

            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
              <label className="flex-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Choose a Package
                <select
                  value={selectedPackageSlug}
                  onChange={(e) => setSelectedPackageSlug(e.target.value)}
                  onFocus={() => setFocusedField("pkg")}
                  onBlur={() => setFocusedField(null)}
                  className={inputCls("pkg")}
                >
                  {(packages.length > 0 ? packages : fallbackPackages).map((pkg) => (
                    <option key={pkg.slug || pkg._id} value={pkg.slug}>
                      {pkg.title}
                    </option>
                  ))}
                </select>
              </label>

              {selectedPackage && (
                <div
                  className="flex-1 overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50 shadow-inner"
                  style={{ animation: "fadeSlideUp 0.4s cubic-bezier(.22,1,.36,1) both" }}
                >
                  <div className="flex items-start gap-4 p-4">
                    <img
                      src={selectedPackage.image}
                      alt={selectedPackage.title}
                      className="h-16 w-16 rounded-xl object-cover shadow-md ring-2 ring-amber-300/40"
                    />
                    <div>
                      <p className="font-bold text-slate-800">{selectedPackage.title}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{selectedPackage.description}</p>
                      <p className="mt-1 text-base font-extrabold text-amber-500">
                        {selectedPackage.currency} {selectedPackage.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </FadeIn>

        {/* ── Hotel Selection (Optional) ── */}
        <FadeIn delay={0.1}>
          <section className={cardCls}>
            <div className="flex items-center justify-between">
              <SectionHeading icon="🏨" title="Hotel Accommodation (Optional)" />
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  name="hotelRequired"
                  checked={form.hotelRequired}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm font-semibold text-slate-600">I need a hotel</span>
              </label>
            </div>

            {form.hotelRequired && (
              <div 
                className="mt-6 space-y-5 overflow-hidden transition-all duration-300"
                style={{ animation: "fadeSlideUp 0.3s ease-out" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min">
                  <div className="flex flex-col">
                    <label className={labelCls}>Preferred Hotel / Resort</label>
                    <select
                      name="hotelName"
                      value={form.hotelName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("hotelName")}
                      onBlur={() => setFocusedField(null)}
                      className={inputCls("hotelName")}
                    >
                      <option value="">-- Select or let us suggest --</option>
                      {availableHotels.map(h => (
                        <option key={h._id} value={h.name}>{h.name} ({h.location})</option>
                      ))}
                      <option value="other">Other (Mention in notes)</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className={labelCls}>Room Type</label>
                    <select 
                      name="roomType" 
                      value={form.roomType} 
                      onChange={handleChange} 
                      onFocus={() => setFocusedField("roomType")}
                      onBlur={() => setFocusedField(null)}
                      className={inputCls("roomType")}
                    >
                      <option>Luxury Room</option>
                      <option>Premium Room</option>
                      <option>River View Room</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className={labelCls}>Meal Plan</label>
                    <select 
                      name="mealPlan" 
                      value={form.mealPlan} 
                      onChange={handleChange} 
                      onFocus={() => setFocusedField("mealPlan")}
                      onBlur={() => setFocusedField(null)}
                      className={inputCls("mealPlan")}
                    >
                      <option>Room Only</option>
                      <option>Free Breakfast</option>
                      <option>Breakfast & Lunch/Dinner</option>
                      <option>Breakfast, Lunch & Dinner</option>
                    </select>
                  </div>
                </div>
                <p className="text-[10px] italic text-slate-400">
                  * Hotel booking is optional. We will confirm availability and share the best prices after booking.
                </p>
              </div>
            )}
          </section>
        </FadeIn>

        {/* ── Two-column: Personal + Safari Details ── */}
        <div className="grid gap-7 md:grid-cols-2">
          {/* Personal Info */}
          <FadeIn delay={0.15}>
            <section className={cardCls}>
              <SectionHeading icon="👤" title="Personal Information" />

              <div className="mt-5 space-y-4">
                <label className={labelCls}>
                  Full Name
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="Your full name"
                    className={inputCls("name")}
                  />
                </label>

                <label className={labelCls}>
                  Email Address
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="you@example.com"
                    className={inputCls("email")}
                  />
                </label>

                <div className="space-y-1">
                  <span className={labelCls}>Phone Number</span>
                  <div className="flex gap-2">
                    <input
                      name="countryCode"
                      list="countryCodesList"
                      value={form.countryCode}
                      onChange={handleChange}
                      placeholder="+91"
                      className="w-24 rounded-xl border border-white/30 bg-white/70 px-2 py-2 text-sm shadow-inner outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40"
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
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder="98765 43210"
                      className={`flex-1 ${inputCls("phone")}`}
                    />
                  </div>
                </div>

                <label className={labelCls}>
                  Country
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("country")}
                    onBlur={() => setFocusedField(null)}
                    className={inputCls("country")}
                  >
                    {countries.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
            </section>
          </FadeIn>

          {/* Safari Details */}
          <FadeIn delay={0.2}>
            <section className={cardCls}>
              <SectionHeading icon="🌿" title="Safari Details" />

              <div className="mt-5 space-y-4">
                <label className={labelCls}>
                  {isHotelBooking ? "Check-In Date" : "Date of Safari"}
                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("date")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={inputCls("date")}
                  />
                </label>

                <label className={labelCls}>
                  Number of Adults
                  <div className="mt-2 flex items-center gap-3">
                    <CounterBtn onClick={() => setForm((p) => ({ ...p, adults: Math.max(1, p.adults - 1) }))}>−</CounterBtn>
                    <span className="min-w-[2rem] text-center text-base font-bold text-slate-800">
                      {form.adults}
                    </span>
                    <CounterBtn onClick={() => setForm((p) => ({ ...p, adults: p.adults + 1 }))}>+</CounterBtn>
                  </div>
                </label>

                <label className={labelCls}>
                  Number of Children
                  <div className="mt-2 flex items-center gap-3">
                    <CounterBtn onClick={() => setForm((p) => ({ ...p, children: Math.max(0, p.children - 1) }))}>−</CounterBtn>
                    <span className="min-w-[2rem] text-center text-base font-bold text-slate-800">
                      {form.children}
                    </span>
                    <CounterBtn onClick={() => setForm((p) => ({ ...p, children: p.children + 1 }))}>+</CounterBtn>
                  </div>
                </label>
              </div>
            </section>
          </FadeIn>


        </div>

        {/* ── Payment Option ── */}
        <FadeIn delay={0.25}>
          <section className={cardCls}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">💳</span>
                <h2 className="text-base font-bold text-slate-800">Payment Option</h2>
              </div>
              <div className="flex items-center gap-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Razorpay_logo.svg" alt="Razorpay" className="h-4" />
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-700 border border-amber-100/50 shadow-sm">
                  ⚡ Secure Payment
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                { name: "UPI", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" },
                { name: "Visa", icon: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" },
                { name: "Mastercard", icon: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
                { name: "Google Pay", icon: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg" }
              ].map((m) => (
                <div key={m.name} className="flex h-8 items-center rounded-lg border border-slate-100 bg-white px-2 shadow-sm">
                  <img src={m.icon} alt={m.name} className="h-4 object-contain opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0" />
                </div>
              ))}
            </div>
            
            {/* Price Summary Breakdown */}
            <div className="mt-8 mb-6 rounded-2xl bg-amber-50/50 p-5 border border-amber-100/50">
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1.5"><span className="text-xs">📦</span> Safari Package</span>
                  <span className="font-bold text-slate-800">₹ {(selectedPackage?.price || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center group relative cursor-help">
                  <span className="text-slate-500 flex items-center gap-1.5 border-b border-dashed border-slate-300">
                    <span className="text-xs">🗺️</span> Zone Booking Fee 
                    <span className="text-[10px] font-bold text-amber-600">
                      {form.country === "India" ? " (IND)" : " (FOR)"}
                    </span>
                  </span>
                  <span className="font-bold text-slate-800">₹ {(form.zonePrice || 0).toLocaleString()}</span>
                  <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg shadow-xl z-10">
                    Applied {form.country === "India" ? "Indian National" : "Foreign National"} rate for {form.tourismZone}.
                  </div>
                </div>
                {form.hotelRequired && (
                  <div className="flex justify-between items-center group relative cursor-help">
                    <span className="text-slate-500 flex items-center gap-1.5 border-b border-dashed border-slate-300">
                      <span className="text-xs">🏨</span> Hotel Stay
                    </span>
                    <span className="font-bold text-slate-800">₹ {(form.hotelPrice + form.hotelTaxes).toLocaleString()}</span>
                  </div>
                )}
                <div className="mt-4 flex justify-between items-center border-t border-amber-200/50 pt-4">
                  <span className="font-black text-slate-900 uppercase tracking-widest text-xs">Final Total</span>
                  <span className="text-xl font-black text-amber-600">
                    ₹ {( (selectedPackage?.price || 0) + (form.zonePrice || 0) + (form.hotelRequired ? (form.hotelPrice + form.hotelTaxes) : 0) ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label
                className={`relative flex cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                  form.paymentType === "full"
                    ? "border-amber-400 bg-amber-50"
                    : "border-slate-100 bg-white hover:border-amber-200"
                }`}
              >
                <input
                  type="radio"
                  name="paymentType"
                  value="full"
                  checked={form.paymentType === "full"}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="flex w-full items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">Full Payment</p>
                    <p className="text-xs text-slate-500">Pay 100% via Razorpay</p>
                  </div>
                  <p className="font-extrabold text-amber-500">
                    ₹ {( (selectedPackage?.price || 0) + (form.zonePrice || 0) + (form.hotelRequired ? (form.hotelPrice + form.hotelTaxes) : 0) ).toLocaleString()}
                  </p>
                </div>
                {form.paymentType === "full" && (
                  <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 shadow-md">
                    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </label>

              <label
                className={`relative flex cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                  form.paymentType === "half"
                    ? "border-amber-400 bg-amber-50"
                    : "border-slate-100 bg-white hover:border-amber-200"
                }`}
              >
                <input
                  type="radio"
                  name="paymentType"
                  value="half"
                  checked={form.paymentType === "half"}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="flex w-full items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">Half Payment</p>
                    <p className="text-xs text-slate-500">Pay 50% via Razorpay</p>
                  </div>
                  <p className="font-extrabold text-amber-500">
                    ₹ {( ((selectedPackage?.price || 0) + (form.zonePrice || 0) + (form.hotelRequired ? (form.hotelPrice + form.hotelTaxes) : 0)) / 2).toLocaleString()}
                  </p>
                </div>
                {form.paymentType === "half" && (
                  <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 shadow-md">
                    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </label>
            </div>
          </section>
        </FadeIn>

        {/* ── Additional info ── */}
        <FadeIn delay={0.3}>
          <section className={cardCls}>
            <SectionHeading icon="📝" title="Additional Information" />

            <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Special Requirements
              <textarea
                name="notes"
                rows={4}
                value={form.notes}
                onChange={handleChange}
                onFocus={() => setFocusedField("notes")}
                onBlur={() => setFocusedField(null)}
                placeholder="Dietary needs, mobility notes, group requests…"
                className={`resize-none ${inputCls("notes")}`}
              />
            </label>

            {/* Terms */}
            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl p-3 transition hover:bg-amber-50">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  name="agree"
                  type="checkbox"
                  checked={form.agree}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="h-5 w-5 rounded-md border-2 border-slate-300 bg-white transition-all peer-checked:border-amber-400 peer-checked:bg-amber-400" />
                {form.agree && (
                  <svg
                    className="absolute left-0.5 top-0.5 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-slate-600">
                I agree to the{" "}
                <span className="font-semibold text-amber-500 underline underline-offset-2">
                  terms and conditions
                </span>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={!form.agree || isProcessing}
              className="group relative mt-6 flex w-full items-center justify-center overflow-hidden rounded-full bg-amber-400 px-8 py-4 text-sm font-extrabold text-slate-900 shadow-lg shadow-amber-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-amber-300/60 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isProcessing ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    {form.paymentType === "half" ? "Pay Advance Amount Now" : "Confirm & Pay Now"} (
                    ₹ { (form.paymentType === "half" ? ((selectedPackage?.price || 0) + (form.zonePrice || 0) + (form.hotelRequired ? form.hotelPrice + form.hotelTaxes : 0)) / 2 : ((selectedPackage?.price || 0) + (form.zonePrice || 0) + (form.hotelRequired ? form.hotelPrice + form.hotelTaxes : 0))).toLocaleString() }
                    )
                    <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
              <span className="absolute inset-0 -translate-x-full bg-amber-300 transition-transform duration-500 group-hover:translate-x-0" />
            </button>
          </section>
        </FadeIn>
      </form>
    </PageTemplate>
  );
}

/* ── Sub-components ── */
function SectionHeading({ icon, title }) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
      <span className="text-xl">{icon}</span>
      <h2 className="text-base font-bold text-slate-800">{title}</h2>
    </div>
  );
}

function CounterBtn({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-300 bg-amber-50 text-lg font-bold text-amber-600 transition-all duration-200 hover:scale-110 hover:bg-amber-400 hover:text-white active:scale-95"
    >
      {children}
    </button>
  );
}

/* ── Constants ── */
const cardCls =
  "rounded-3xl border border-white/30 bg-white/60 p-6 shadow-xl shadow-slate-200/60 backdrop-blur-xl transition-shadow duration-300 hover:shadow-2xl";

const countries = [
  "India", "USA", "UK", "Australia", "Canada", "Germany",
  "France", "UAE", "Singapore", "Japan", "Other",
];

const keyframes = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.88); }
    to   { opacity: 1; transform: scale(1);    }
  }
`;
