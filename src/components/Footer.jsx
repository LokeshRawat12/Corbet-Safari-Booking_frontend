import React from 'react';
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Footer Component for Corbett Safari Project
 * Path: src/components/Footer.jsx
 * * Note: Local imports like Footerwork are commented out to prevent 
 * build errors in this preview environment. 
 */

const FooterworkMock = () => (
  <div className="border-t border-white/5 pt-8 mt-8 pb-4">
    <h3 className="text-center text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">
      Explore Safari Zones
    </h3>
    <div className="flex flex-wrap gap-4 md:gap-6 justify-center text-xs md:text-sm text-gray-400">
      <Link to="/Dhikala" className="hover:text-green-500 transition-colors">Dhikala</Link>
      <Link to="/Bizrani" className="hover:text-green-500 transition-colors">Bijrani</Link>
      <Link to="/Jhirnazone" className="hover:text-green-500 transition-colors">Jhirna</Link>
      <Link to="/Dhelazone" className="hover:text-green-500 transition-colors">Dhela</Link>
      <Link to="/Durgadevizone" className="hover:text-green-500 transition-colors">Durgadevi</Link>
      <Link to="/GirjiaDevi" className="hover:text-green-500 transition-colors">Garjia</Link>
      <Link to="/Sitabani" className="hover:text-green-500 transition-colors">Sitabani</Link>
      <Link to="/Phatozone" className="hover:text-green-500 transition-colors">Phato</Link>
      <Link to="/Sonamnadi" className="hover:text-green-500 transition-colors">Sonanadi</Link>
    </div>
  </div>
);

export default function Footer() {
  const planYourTripLinks = [
    { name: 'Best Time to Visit', path: '/best-time-to-visit' },
    { name: 'How to Reach', path: '/how-to-reach' },
    { name: 'Tiger Conservation', path: '/tiger-conservation' },
    { name: 'Safari Zones', path: '/safari-booking' },
  ];

  const supportLinks = [
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms & Conditions', path: '/terms-conditions' },
    { name: 'Cancellation Policy', path: '/cancellation-policy' },
    { name: 'Admin Login', path: '/admin' },
  ];

  return (
    <footer className="bg-[#0b1c10] text-white">
      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: About */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-green-600 flex items-center justify-center">
                <span className="font-bold text-white">C</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight">Corbett Safari</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Ek trusted private travel agency jo Corbett mein wildlife tours aur 
              safari experiences organize karti hai.
            </p>
            <div className="flex items-center gap-2 text-xs text-green-500 font-medium bg-green-500/10 w-fit px-3 py-1 rounded-full border border-green-500/20">
              <ShieldCheck size={14} />
              <span>Verified Agency</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">
              Plan Your Trip
            </h3>
            <ul className="space-y-4">
              {planYourTripLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    <span className="h-1 w-1 rounded-full bg-green-600 transition-all group-hover:w-3" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Information */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">
              Support
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-white transition-colors block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-green-600" />
                <p className="text-sm text-gray-400">
                  Ramnagar, Jim Corbett National Park,<br />
                  Uttarakhand, India - 244715
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-green-600" />
                <a href="mailto:contact@corbettnationalpark.in" className="text-sm text-gray-400 hover:text-white">
                  contact@corbettnationalpark.in
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-green-600" />
                <a href="tel:+918979668105" className="text-sm text-gray-400 hover:text-white">
                  +91 8979668105
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Local component placeholder to avoid import errors */}
        <FooterworkMock />
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-black/20 py-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs text-gray-500">
              © 2026 Corbett National Park Tours. All rights reserved.
            </p>
            <p className="mt-1 text-[10px] text-gray-600 italic">
              DISCLAIMER: Yeh ek private travel website hai, Corbett Tiger Reserve ki official site nahi.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-semibold">
              Secure Checkout
            </span>
            <div className="flex items-center gap-4 grayscale opacity-40">
              <div className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold">VISA</div>
              <div className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold">MASTERCARD</div>
              <div className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold">RAZORPAY</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}