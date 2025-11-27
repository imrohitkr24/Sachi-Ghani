export default function Hero() {
  return (
    <section id="home" className="w-full min-h-screen bg-gradient-to-b from-lime-50 to-white">
      <div className="w-full px-4 pt-12 pb-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-5xl md:text-5xl font-extrabold text-lime-600 leading-tight -mt-2">
            Pure Cold-Pressed Mustard Oil
          </h2>
          <p className="mt-4 text-lime-800">
            Traditional kachi ghani process, rich aroma, natural pungency, and uncompromised purity for your family.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#products" className="px-5 py-3 rounded bg-lime-600 text-white hover:bg-lime-700">
              View Products
            </a>
            <a href="#contact" className="px-5 py-3 rounded border border-lime-400 text-lime-800 hover:bg-lime-50">
              Order Now
            </a>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-2 text-sm text-lime-700">
            <li>• Cold-pressed nutrition</li>
            <li>• Strong aroma & taste</li>
            <li>• Unblended, no additives</li>
            <li>• Hygienic, lab-tested</li>
          </ul>
        </div>
        <div className="relative">
          <div className="rounded-2xl shadow-lg bg-gradient-to-b from-lime-100/60 to-white p-10">
            <div className="aspect-[4/3] md:aspect-[3/4] rounded-xl bg-[url('/bottle.jpg')] bg-cover bg-center" />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white border border-lime-200 rounded-xl px-4 py-2 text-xs text-lime-800 shadow">
            Sachi Ghani • Since 2024
          </div>
        </div>
      </div>
    </section>
  );
}
