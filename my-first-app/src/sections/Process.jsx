export default function Process() {
  const steps = ["Seed Selection", "Sun Drying", "Wooden Ghani Press", "Natural Filtration"];
  return (
    <section id="process" className="w-full bg-lime-50">
      <div className="w-full px-4 py-16">
        <h2 className="text-3xl font-bold text-lime-900">Cold-Pressed Process</h2>
        <p className="text-lime-700 mt-2">Traditional kachi ghani extraction preserves natural nutrients and flavor.</p>
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div key={i} className="rounded-xl border border-lime-200 bg-white p-4">
              <div className="text-xs text-lime-700">Step {i + 1}</div>
              <div className="font-semibold text-lime-900 mt-1">{step}</div>
              <p className="text-sm text-lime-700 mt-2">
                Carefully controlled process to maintain purity, aroma, and nutrition.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
