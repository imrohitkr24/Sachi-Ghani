export default function Hero() {
  return (
    <section id="home" className="w-full min-h-screen bg-gradient-to-b from-lime-50 to-white">
      <div className="w-full px-4 pt-12 pb-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-lime-800 bg-lime-100 rounded-full border border-lime-200">
            शुद्धता और भरोसे का प्रतीक ✨
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Pure Cold-Pressed <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-600 to-yellow-500">Mustard Oil</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-gray-600 leading-relaxed max-w-lg">
            Traditional kachi ghani process preserving rich aroma, natural pungency, and <span className="font-semibold text-lime-700">uncompromised purity</span> for your healthy family.
            <br />
            <span className="text-sm font-medium text-lime-600 mt-2 block">असली स्वाद, असली सेहत - साची घानी के साथ।</span>
          </p>

          <div className="mt-8 flex gap-4">
            <a href="#products" className="px-8 py-4 rounded-full bg-gradient-to-r from-lime-600 to-lime-500 text-white font-bold shadow-lg shadow-lime-200 transform hover:-translate-y-1 transition-all flex items-center gap-2 group">
              View Products
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </a>
            <a href="#contact" className="px-8 py-4 rounded-full border-2 border-lime-500 text-lime-700 font-bold hover:bg-lime-50 transition-colors">
              Order Now
            </a>
          </div>

          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 font-medium">
            {[
              "Cold-pressed nutrition",
              "Strong aroma & pungent taste",
              "100% Unblended & Natural",
              "Hygienic & Lab-tested"
            ].map(item => (
              <li key={item} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-lime-100 text-lime-600 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="rounded-2xl shadow-lg bg-gradient-to-b from-lime-100/60 to-white p-4">
            <img
              src="/hero-family.jpg"
              alt="Family cooking with Sachi Ghani"
              className="w-full h-auto rounded-xl object-cover shadow-sm"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white border border-lime-200 rounded-xl px-4 py-2 text-xs text-lime-800 shadow">
            Sachi Ghani • Since 2024
          </div>
        </div>
      </div>
    </section>
  );
}