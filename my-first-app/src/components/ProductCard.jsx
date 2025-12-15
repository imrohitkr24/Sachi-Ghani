export default function ProductCard({ name, price, desc, badge, image }) {
  return (
    <div className="rounded-2xl border border-lime-200 p-4 hover:shadow-xl transition bg-white flex flex-col h-full">
      <div className="h-96 rounded-xl bg-lime-50 mb-4 overflow-hidden relative group">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-lime-700 text-sm">{name}</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lime-900">{name}</h3>
        <span className="text-lime-700 font-medium">{price}</span>
      </div>
      <p className="text-sm text-lime-700 mt-1">{desc}</p>
      <span className="inline-block mt-3 text-xs px-2 py-1 rounded-full bg-lime-100 text-lime-700">
        {badge}
      </span>
      <div className="mt-4 flex gap-2">
        <a href="#contact" className="px-4 py-2 rounded bg-lime-600 text-white text-sm">
          Order
        </a>
        <a
          href={`https://wa.me/91XXXXXXXXXX?text=I want ${encodeURIComponent(name)}`}
          className="px-4 py-2 rounded border border-lime-300 text-lime-800 text-sm"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}