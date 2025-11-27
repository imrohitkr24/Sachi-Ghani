import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#home", label: "Home" },
    { href: "#products", label: "Products" },
    { href: "#process", label: "Process" },
    { href: "#certifications", label: "Certifications" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur border-b border-lime-200">
      <div className="w-full px-4 py-3 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <span className="inline-block h-8 w-8 rounded-full bg-lime-500" />
          <span className="font-semibold text-lime-800">Sachi Ghani</span>
        </a>
        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <a key={l.href} href={l.href} className="text-lime-900 hover:text-lime-600">
              {l.label}
            </a>
          ))}
          <a href="#contact" className="px-4 py-2 rounded bg-lime-600 text-white hover:bg-lime-700">
            Order Now
          </a>
        </nav>
        <button
          className="md:hidden p-2 rounded border border-lime-300"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1">
            <span className="block h-0.5 w-6 bg-lime-800" />
            <span className="block h-0.5 w-6 bg-lime-800" />
            <span className="block h-0.5 w-6 bg-lime-800" />
          </div>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-lime-200 bg-white">
          <div className="w-full px-4 py-3 flex flex-col gap-3">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-lime-900 hover:text-lime-600"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded bg-lime-600 text-white text-center"
            >
              Order Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
