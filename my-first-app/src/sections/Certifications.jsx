export default function Certifications() {
  return (
    <section id="certifications" className="w-full bg-white">
      <div className="w-full px-4 py-16">
        <h2 className="text-3xl font-bold text-lime-900">Certifications</h2>
        <p className="text-lime-700 mt-2">FSSAI, lab tests, and hygiene compliance for consumer trust.</p>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-lime-200 p-4">
            <div className="font-semibold text-lime-900">FSSAI License</div>
            <p className="text-sm text-lime-700 mt-1">Add your number here.</p>
          </div>
          <div className="rounded-xl border border-lime-200 p-4">
            <div className="font-semibold text-lime-900">Lab Test Reports</div>
            <p className="text-sm text-lime-700 mt-1">Acid value, moisture, and purity.</p>
          </div>
          <div className="rounded-xl border border-lime-200 p-4">
            <div className="font-semibold text-lime-900">Hygienic Packaging</div>
            <p className="text-sm text-lime-700 mt-1">Sealed, tamper-evident bottles.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
