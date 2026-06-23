import { useMemo, useState, useEffect } from "react";
import PageTemplate from "../../components/PageTemplate";

export default function HotelPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [maxPrice, setMaxPrice] = useState(25000);
  
  // Search Bar State
  const [hotelType, setHotelType] = useState("all"); // matches 'category' in model
  const [checkInDate, setCheckInDate] = useState("");
  const [roomsConfig, setRoomsConfig] = useState([{ adults: 2, children: 0 }]);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  useEffect(() => {
    fetch("/api/hotels")
      .then(res => res.json())
      .then(data => {
        setHotels(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const locationsList = useMemo(() => Array.from(new Set(hotels.map((hotel) => hotel.location))), [hotels]);

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const matchesLocation = selectedLocations.length > 0 ? selectedLocations.includes(hotel.location) : true;
      const matchesPrice = (hotel.price || 0) <= maxPrice;
      const matchesType = hotelType === "all" ? true : hotel.category === hotelType;
      return matchesLocation && matchesPrice && matchesType;
    });
  }, [hotels, selectedLocations, maxPrice, hotelType]);

  const toggleLocation = (loc) => {
    setSelectedLocations(prev => 
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    );
  };

  return (
    <PageTemplate
      title="Hotel Stays"
      description="Find the perfect retreat near Jim Corbett National Park."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Search Bar */}
        <div className="bg-[#1a3c34] rounded-xl shadow-2xl overflow-visible relative">
          <div className="grid grid-cols-1 md:grid-cols-4 items-center">
            {/* Hotel Type */}
            <div className="p-4 border-r border-white/10">
              <label className="block text-[10px] font-bold uppercase text-white/60 mb-1">Hotel Type</label>
              <select 
                value={hotelType}
                onChange={(e) => setHotelType(e.target.value)}
                className="bg-transparent text-white w-full outline-none text-sm font-semibold cursor-pointer appearance-none"
              >
                <option value="all" className="text-black">All Hotels</option>
                <option value="luxury" className="text-black">Luxury Resorts</option>
                <option value="mid-range" className="text-black">Mid-Range</option>
                <option value="budget" className="text-black">Budget</option>
                <option value="camp" className="text-black">Camps</option>
              </select>
            </div>

            {/* Check-In */}
            <div className="p-4 border-r border-white/10 group relative">
              <label className="block text-[10px] font-bold uppercase text-white/60 mb-1">Check-In</label>
              <div className="flex items-center justify-between">
                <input 
                  type="date" 
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="bg-transparent text-white w-full outline-none text-sm font-semibold cursor-pointer [color-scheme:dark]" 
                />
              </div>
            </div>

            {/* Guests & Rooms */}
            <div className="p-4 border-r border-white/10 relative">
              <label className="flex items-center gap-1 text-[10px] font-bold uppercase text-white/60 mb-1 cursor-pointer" onClick={() => setShowGuestPicker(!showGuestPicker)}>
                Room & Guest 
                <svg className={`w-3 h-3 transition-transform ${showGuestPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
              </label>
              <button 
                onClick={() => setShowGuestPicker(!showGuestPicker)}
                className="text-white text-base font-bold w-full text-left"
              >
                {roomsConfig.length} Rooms, {roomsConfig.reduce((acc, r) => acc + r.adults + r.children, 0)} Guests
              </button>

              {showGuestPicker && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-80 bg-white rounded-xl shadow-2xl p-5 z-[60] text-slate-900 space-y-6 border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-6">
                    {roomsConfig.map((room, idx) => (
                      <div key={idx} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900">Room {idx + 1}:</h4>
                          {idx > 0 && (
                            <button 
                              onClick={() => setRoomsConfig(prev => prev.filter((_, i) => i !== idx))}
                              className="text-[10px] text-red-500 font-bold uppercase hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700">Adult</span>
                            <span className="text-[10px] text-slate-400 font-medium">(Above 12 years)</span>
                          </div>
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                            <button 
                              onClick={() => {
                                const newConfig = [...roomsConfig];
                                newConfig[idx].adults = Math.max(1, newConfig[idx].adults - 1);
                                setRoomsConfig(newConfig);
                              }}
                              className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 text-slate-600 border-r border-slate-200"
                            >
                              <span className="text-xl leading-none">−</span>
                            </button>
                            <span className="w-10 text-center font-bold text-sm">{room.adults}</span>
                            <button 
                              onClick={() => {
                                const newConfig = [...roomsConfig];
                                newConfig[idx].adults = Math.min(4, newConfig[idx].adults + 1);
                                setRoomsConfig(newConfig);
                              }}
                              className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 text-slate-600 border-l border-slate-200"
                            >
                              <span className="text-xl leading-none">+</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700">Child</span>
                            <span className="text-[10px] text-slate-400 font-medium">(Between 5 to 12 years)</span>
                          </div>
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                            <button 
                              onClick={() => {
                                const newConfig = [...roomsConfig];
                                newConfig[idx].children = Math.max(0, newConfig[idx].children - 1);
                                setRoomsConfig(newConfig);
                              }}
                              className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 text-slate-600 border-r border-slate-200"
                            >
                              <span className="text-xl leading-none">−</span>
                            </button>
                            <span className="w-10 text-center font-bold text-sm">{room.children}</span>
                            <button 
                              onClick={() => {
                                const newConfig = [...roomsConfig];
                                newConfig[idx].children = Math.min(2, newConfig[idx].children + 1);
                                setRoomsConfig(newConfig);
                              }}
                              className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 text-slate-600 border-l border-slate-200"
                            >
                              <span className="text-xl leading-none">+</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => setRoomsConfig([...roomsConfig, { adults: 2, children: 0 }])}
                      className="flex-1 py-2.5 rounded-lg border-2 border-[#82b440] text-[#82b440] font-bold text-sm transition hover:bg-[#82b440]/5"
                    >
                      Add Room
                    </button>
                    <button 
                      onClick={() => setShowGuestPicker(false)}
                      className="flex-1 bg-[#f16923] text-white py-2.5 rounded-lg font-bold text-sm shadow-md transition hover:bg-[#d85c1e]"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="bg-[#b48e58] hover:bg-[#a37d47] text-white font-bold h-full py-6 md:py-0 transition uppercase tracking-widest text-sm active:scale-95">
              Search
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm font-bold uppercase tracking-wider text-slate-800">Filters</span>
              </div>

              <div className="space-y-8">
                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-4">Price Range</h4>
                  <input
                    type="range"
                    min={2000}
                    max={25000}
                    step={500}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-red-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="mt-3 text-sm font-medium text-slate-600 flex justify-between">
                    <span>Up to ₹{maxPrice.toLocaleString()}</span>
                    <button 
                      onClick={() => setMaxPrice(25000)}
                      className="text-[10px] text-red-500 font-bold uppercase underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-slate-900">Location</h4>
                    {selectedLocations.length > 0 && (
                      <button 
                        onClick={() => setSelectedLocations([])}
                        className="text-[10px] text-red-500 font-bold uppercase underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {locationsList.map((loc) => (
                      <label key={loc} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedLocations.includes(loc)}
                          onChange={() => toggleLocation(loc)}
                          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-xs text-slate-600 group-hover:text-slate-900 transition">{loc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Hotel List */}
          <main className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">{filteredHotels.length} Properties Found</h2>
              {hotelType !== "all" && (
                <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase tracking-wider">
                  Type: {hotelType}
                </span>
              )}
            </div>
            
            <div className="space-y-4">
              {filteredHotels.map((hotel) => (
                <article
                  key={hotel._id || hotel.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col md:flex-row"
                >
                  {/* Image */}
                  <div className="md:w-1/3 h-56 md:h-auto overflow-hidden relative group">
                    <img 
                      src={hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"} 
                      alt={hotel.name} 
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute top-3 left-3">
                       <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-black text-slate-900 uppercase tracking-widest shadow-sm">
                        {hotel.category || "Standard"}
                       </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:w-2/3 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    <div className="p-6 flex-1 space-y-3">
                      <h3 className="text-xl font-bold text-slate-900">{hotel.name}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <span className="text-emerald-600 font-bold">📍</span> {hotel.location}, Corbett
                      </p>
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        {hotel.freeCancellation && (
                          <span className="text-[10px] font-bold text-emerald-600 border border-emerald-100 bg-emerald-50 px-2 py-1 rounded-sm uppercase tracking-tighter">
                            Free Cancellation
                          </span>
                        )}
                        {hotel.breakfastIncluded && (
                          <span className="text-[10px] font-bold text-emerald-600 border border-emerald-100 bg-emerald-50 px-2 py-1 rounded-sm uppercase tracking-tighter">
                            Breakfast Included
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="p-6 md:w-48 bg-slate-50/50 flex flex-col items-end justify-center text-right">
                      <div className="mb-4">
                        <span className="text-2xl font-black text-slate-900 leading-none">₹{hotel.price?.toLocaleString()}</span>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">+ taxes & fees</p>
                      </div>
                      <button
                        onClick={() => setSelectedHotel(hotel)}
                        className="w-full bg-[#1a3c34] hover:bg-[#234b41] text-white py-2.5 rounded-lg text-sm font-bold transition text-center shadow-lg shadow-emerald-900/10"
                      >
                        View Detail
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {filteredHotels.length === 0 && (
                <div className="p-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                  <p className="text-5xl mb-4">🏨</p>
                  <p className="text-xl font-bold text-slate-800">No hotels found</p>
                  <p className="text-slate-400 mt-1">Try adjusting your filters or search criteria.</p>
                  <button 
                    onClick={() => { setHotelType("all"); setSelectedLocations([]); setMaxPrice(25000); }}
                    className="mt-6 text-emerald-600 font-bold underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Hotel Detail Modal */}
      {selectedHotel && (
        <HotelDetailModal 
          hotel={selectedHotel} 
          onClose={() => setSelectedHotel(null)} 
          checkInDate={checkInDate}
          roomsConfig={roomsConfig}
        />
      )}
    </PageTemplate>
  );
}

function HotelDetailModal({ hotel, onClose, checkInDate, roomsConfig }) {
  const [selectedPlans, setSelectedPlans] = useState({}); // { roomIdx: planIdx }

  const getAdjustedPrice = (room, planIdx) => {
    const basePrice = room.discountPrice || 0;
    const plan = room.mealPlans?.[planIdx];
    if (!plan) return basePrice;

    // Pricing logic based on plan label
    switch (plan.label) {
      case "Room Only":
        // If Free Breakfast exists, Room Only might be cheaper
        const hasBreakfast = room.mealPlans?.some(m => m.label === "Free Breakfast");
        return hasBreakfast ? basePrice - 500 : basePrice;
      case "Free Breakfast":
        return basePrice;
      case "Breakfast & Lunch/Dinner":
        return basePrice + 1500;
      case "Breakfast, Lunch & Dinner":
        return basePrice + 2800;
      default:
        return basePrice;
    }
  };

  const getFinalRooms = () => {
    return hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms : [
      {
        type: "Luxury Room",
        image: hotel.image,
        originalPrice: 6160,
        discountPrice: 4928,
        taxes: 265,
        features: ["LED TV", "Internet - Wifi", "Housekeeping"],
        checkIn: "12:00 PM",
        checkOut: "11:00 AM",
        mealPlans: [
          { label: "Room Only", isIncluded: true },
          { label: "Free Breakfast", isIncluded: true },
          { label: "Breakfast & Lunch/Dinner", isIncluded: true },
          { label: "Breakfast, Lunch & Dinner", isIncluded: true }
        ]
      },
      {
        type: "Premium Room",
        image: hotel.gallery?.[0] || hotel.image,
        originalPrice: 6960,
        discountPrice: 5359,
        taxes: 289,
        features: ["LED TV", "Internet - Wifi", "Housekeeping"],
        checkIn: "12:00 PM",
        checkOut: "11:00 AM",
        mealPlans: [
          { label: "Room Only", isIncluded: true },
          { label: "Free Breakfast", isIncluded: true },
          { label: "Breakfast & Lunch/Dinner", isIncluded: true },
          { label: "Breakfast, Lunch & Dinner", isIncluded: true }
        ]
      },
      {
        type: "River View Room",
        image: hotel.gallery?.[1] || hotel.image,
        originalPrice: 7838,
        discountPrice: 6349,
        taxes: 341,
        features: ["LED TV", "Internet - Wifi", "Housekeeping"],
        checkIn: "12:00 PM",
        checkOut: "11:00 AM",
        mealPlans: [
          { label: "Room Only", isIncluded: true },
          { label: "Free Breakfast", isIncluded: true },
          { label: "Breakfast & Lunch/Dinner", isIncluded: true },
          { label: "Breakfast, Lunch & Dinner", isIncluded: true }
        ]
      }
    ];
  };

  const currentRooms = getFinalRooms();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-900 hover:bg-white transition shadow-xl"
        >
          ✕
        </button>

        <div className="max-h-[80vh] md:max-h-[90vh] overflow-y-auto">
          {/* Gallery Header */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-2 h-[400px]">
            <div className="md:col-span-2 h-full">
              <img src={hotel.image} className="w-full h-full object-cover rounded-2xl" alt="" />
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-2 h-full">
              {(hotel.gallery && hotel.gallery.length > 0 ? hotel.gallery : [hotel.image, hotel.image, hotel.image, hotel.image]).slice(0, 4).map((img, i) => (
                <img key={i} src={img} className="w-full h-full object-cover rounded-xl" alt="" />
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8 space-y-12">
            {/* Rooms Section */}
            <section id="rooms" className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">{hotel.name}</h2>
                <p className="text-slate-500 leading-relaxed text-sm whitespace-pre-line">{hotel.description}</p>
              </div>
              
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200">
                <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-400 p-4">
                  <div className="col-span-12 md:col-span-4">Available Rooms</div>
                  <div className="col-span-4 md:col-span-5 hidden md:block">Meal Plan</div>
                  <div className="col-span-12 md:col-span-3 text-right md:text-left hidden md:block">Price</div>
                </div>

                <div className="divide-y divide-slate-100">
                  {currentRooms.map((room, idx) => {
                    const currentPlanIdx = selectedPlans[idx] !== undefined 
                      ? selectedPlans[idx] 
                      : (room.mealPlans?.findIndex(m => m.label === "Free Breakfast" && m.isIncluded) !== -1 
                        ? room.mealPlans?.findIndex(m => m.label === "Free Breakfast" && m.isIncluded) 
                        : 0);
                    
                    const displayPrice = getAdjustedPrice(room, currentPlanIdx);
                    const originalPrice = room.originalPrice || (room.discountPrice * 1.2);

                    return (
                      <div key={idx} className="grid grid-cols-12 p-4 gap-4 md:gap-0">
                        {/* Room Info */}
                        <div className="col-span-12 md:col-span-4 space-y-3">
                          <div className="rounded-xl overflow-hidden h-40 border border-slate-100 shadow-sm">
                            <img src={room.image || hotel.image} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="space-y-2">
                             <span className="inline-block bg-[#fdf3e7] text-amber-900 text-[10px] font-black uppercase px-3 py-1 rounded-md border border-amber-100">
                               {room.type}
                             </span>
                             <ul className="grid grid-cols-1 gap-1">
                               {(room.features || []).map(f => (
                                 <li key={f} className="text-[10px] text-slate-500 flex items-center gap-1.5">
                                   <span className="w-1 h-1 rounded-full bg-slate-300" /> {f}
                                 </li>
                               ))}
                             </ul>
                             <div className="pt-1 flex gap-4 text-[10px] text-slate-400">
                               <span>Check-In: <strong>{room.checkIn}</strong></span>
                               <span>Check-Out: <strong>{room.checkOut}</strong></span>
                             </div>
                          </div>
                        </div>

                        {/* Meal Plan */}
                        <div className="col-span-12 md:col-span-5 md:px-8 space-y-4">
                           <div className="space-y-3">
                             <p className="text-[10px] font-bold uppercase text-slate-400 md:hidden">Meal Plan</p>
                             {(room.mealPlans || []).filter(m => m.isIncluded).map((mp, mIdx) => {
                               // Find original index in room.mealPlans to set state correctly
                               const originalIndex = room.mealPlans.indexOf(mp);
                               const isSelected = currentPlanIdx === originalIndex;

                               return (
                                 <label 
                                   key={mIdx} 
                                   className="flex items-start gap-3 cursor-pointer group"
                                   onClick={() => setSelectedPlans({ ...selectedPlans, [idx]: originalIndex })}
                                 >
                                    <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-amber-500 bg-amber-500/10' : 'border-slate-200 group-hover:border-slate-300'}`}>
                                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
                                    </div>
                                    <div className="space-y-0.5">
                                      <p className={`text-xs font-semibold ${isSelected ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>{mp.label}</p>
                                      {isSelected && <p className="text-[9px] text-emerald-600 font-medium">Accommodation with {mp.label}</p>}
                                    </div>
                                 </label>
                               );
                             })}
                           </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-12 md:col-span-3 flex flex-col items-end md:items-start space-y-2">
                           <div className="text-right w-full">
                              <span className="text-xs text-slate-400 line-through">₹{originalPrice.toLocaleString()}</span>
                              <p className="text-2xl font-black text-slate-900 leading-tight">₹{displayPrice.toLocaleString()}</p>
                              <p className="text-[10px] text-slate-400">+ ₹{room.taxes || 0} taxes & fees</p>
                           </div>
                           <a 
                             href={`/booking?type=hotel&hotelId=${hotel._id}&hotelName=${encodeURIComponent(hotel.name)}&roomType=${encodeURIComponent(room.type)}&mealPlan=${encodeURIComponent(room.mealPlans[currentPlanIdx].label)}&price=${displayPrice}&taxes=${room.taxes || 0}&date=${checkInDate}&rooms=${roomsConfig.length}&adults=${roomsConfig.reduce((acc, r) => acc + r.adults, 0)}&children=${roomsConfig.reduce((acc, r) => acc + r.children, 0)}`} 
                             className="w-full bg-[#1a3c34] hover:bg-[#15312a] text-white py-3 rounded-xl text-center font-bold text-sm shadow-xl transition mt-4"
                           >
                             Book Now
                           </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Facilities Section */}

            <section id="facilities" className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Property Facilities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(hotel.facilities && hotel.facilities.length > 0 ? hotel.facilities : ["WiFi", "Pool", "Restaurant", "Parking"]).map((fac) => (
                  <div key={fac} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700">
                    <span className="text-emerald-600">✓</span> {fac}
                  </div>
                ))}
              </div>
            </section>

            {/* Location Section */}
            <section id="location" className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Location Details</h3>
              <div className="flex items-center gap-2">
                 <span className="text-2xl">📍</span>
                 <div>
                    <h3 className="font-bold text-slate-900">{hotel.location}, Corbett</h3>
                    <p className="text-xs text-slate-500">Ramnagar, Uttarakhand</p>
                 </div>
              </div>
              {hotel.mapUrl ? (
                <iframe src={hotel.mapUrl} className="w-full h-[300px] rounded-2xl border-0 shadow-inner" allowFullScreen="" loading="lazy"></iframe>
              ) : (
                <div className="bg-slate-50 h-[200px] rounded-2xl flex items-center justify-center border border-slate-100 italic text-slate-400">Map view coming soon...</div>
              )}
            </section>

            {/* Policies Section */}
            <section id="policies" className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Stay Policies</h3>
              <div className="grid md:grid-cols-2 gap-8 text-sm text-slate-600">
                <div className="space-y-2">
                  <p><strong>Check-in:</strong> 12:00 PM</p>
                  <p><strong>Check-out:</strong> 11:00 AM</p>
                  <p className="p-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 inline-block">
                     <strong>Free Cancellation:</strong> Full refund if cancelled 48h before.
                  </p>
                </div>
                <div className="space-y-2">
                   <p className="font-bold text-slate-900">General Rules:</p>
                   <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li>Valid government ID required</li>
                      <li>Outside food is not permitted in rooms</li>
                      <li>Standard park rules apply for safari pickups</li>
                   </ul>
                </div>
              </div>
            </section>
            
            <div className="pt-6 border-t-2 border-slate-100 flex items-center justify-between">
              <div>
                 <p className="text-2xl font-black text-slate-900 leading-none">₹{hotel.price.toLocaleString()}</p>
                 <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Base Starting Price</p>
              </div>
              <a href="/booking" className="bg-[#b48e58] hover:bg-[#a37d47] text-white px-10 py-4 rounded-xl font-bold transition shadow-lg active:scale-95 uppercase tracking-widest text-xs">
                BOOK YOUR STAY
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
