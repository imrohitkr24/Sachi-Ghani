export default function Testimonials() {
  const list = [
    "Aroma is authentic; perfect for pickles!",
    "Great pungency and taste—reminds me of home.",
    "Quality is consistent, packaging is excellent.",
  ];
  return (
    <section id="testimonials" className="w-full bg-lime-50">
      <div className="w-full px-4 py-16">
        <h2 className="text-3xl font-bold text-lime-900">What Customers Say</h2>
        <p className="text-lime-700 mt-2">Real feedback from households and restaurants.</p>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {list.map((t, i) => (
            <div key={i} className="rounded-xl border border-lime-200 bg-white p-5">
              <p className="text-lime-800">“{t}”</p>
              <div className="mt-3 text-sm text-lime-700">— Verified Buyer</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
