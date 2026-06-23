import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);


  const navItem = (to, label, isButton = false) => (
    <NavLink
      to={to}
      end
      onClick={closeMenu}
      className={({ isActive }) =>
        `block rounded-full px-4 py-2 transition-colors duration-200 ${isButton  //Button style lagani hai?true ya false (default false)
          ? "bg-secondary text-black font-semibold"
          : "text-white hover:text-secondary"
        } ${isActive ? "text-white " : ""}`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <NavLink to="/" onClick={closeMenu} className="text-xl font-extrabold text-white">
          CORBETT <span className="text-secondary">PARK</span>
        </NavLink>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white lg:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="sr-only">Open menu</span>
          <span className="h-0.5 w-4 bg-white" />
          <span className="h-0.5 w-4 bg-white mt-2" />
          <span className="h-0.5 w-4 bg-white " />
        </button>

        <nav
          className={`${isOpen ? "flex" : "hidden"
            } absolute inset-x-0 top-full z-40 flex-col bg-primary px-4 py-6 shadow-lg lg:static lg:flex lg:flex-row lg:items-center lg:space-x-4 lg:bg-transparent lg:p-0 lg:shadow-none`}
        >
          {navItem("/", "Home")}
          {navItem("/contact", "Contact")}
          {navItem("/hotel", "Hotels")}
          {navItem("/packages", "Tour Packages")}
          {navItem("/booking", "Book Now", true)}
        </nav>
      </div>
    </header>
  );
}
