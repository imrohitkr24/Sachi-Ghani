// src/components/Nav.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Home", match: (p, h) => p === "/" },
  { to: "/#products", label: "Products", match: (p, h) => h === "#products" },
  { to: "/#process", label: "Process", match: (p, h) => h === "#process" },
  { to: "/#certifications", label: "Certifications", match: (p, h) => h === "#certifications" },
  { to: "/#testimonials", label: "Testimonials", match: (p, h) => h === "#testimonials" },
  { to: "/#contact", label: "Contact", match: (p, h) => h === "#contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  // close mobile menu on navigation
  useEffect(() => setOpen(false), [loc.pathname, loc.hash]);

  // lock body scroll when mobile menu open (nice UX)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const path = loc.pathname || "/";
  const hash = loc.hash || "";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-lime-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand text (no logo) */}
        <Link to="/" className="text-2xl font-extrabold text-lime-900 hover:text-emerald-700">
          Sachi Ghani
        </Link>

        {/* Center links (desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => {
            const active = l.match(path, hash);
            return (
              <Link
                key={l.label}
                to={l.to}
                className={`relative px-1 py-1 text-sm md:text-base transition ${
                  active ? "text-emerald-700 font-semibold" : "text-lime-800 hover:text-emerald-700"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
                <span
                  aria-hidden
                  className={`block h-0.5 rounded mt-1 transition-all ${
                    active ? "bg-emerald-600 w-full" : "bg-transparent w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <Link to="/place-order" className="hidden md:inline-flex items-center px-4 py-2 rounded-full bg-emerald-600 text-white font-medium shadow hover:bg-emerald-700 transition">
            Place Order
          </Link>

          <div className="hidden md:flex gap-3">
            <Link to="/login" className="text-sm text-lime-700 hover:underline">Login</Link>
            <Link to="/register" className="text-sm text-lime-700 hover:underline">Sign up</Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden p-2 rounded border border-lime-200 bg-white"
          >
            <span className="block w-6 h-0.5 bg-lime-800 mb-1" />
            <span className="block w-6 h-0.5 bg-lime-800 mb-1" />
            <span className="block w-6 h-0.5 bg-lime-800" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-lime-100 bg-white">
          <div className="px-4 py-4 flex flex-col gap-3">
            {LINKS.map((l) => (
              <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="py-2 text-lime-900">
                {l.label}
              </Link>
            ))}

            <Link to="/place-order" onClick={() => setOpen(false)} className="mt-2 px-4 py-2 rounded bg-emerald-600 text-white text-center">
              Place Order
            </Link>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-2 border rounded text-center">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="px-3 py-2 rounded bg-lime-600 text-white text-center">Sign up</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
