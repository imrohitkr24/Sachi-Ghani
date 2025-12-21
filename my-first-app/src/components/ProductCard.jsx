export default function ProductCard({ name, price, desc, badge, image, whatsappMessage }) {
  // ... (unchanged parts handled by context matching, but I need to replace the export line and the link part)

  // Actually, replace_file_content works on a contiguous block. I need to change line 1 to add the prop, and lines 26-26 to update the link.
  // Since they are far apart, I should use multi_replace_file_content or just two calls.
  // Wait, I can just replace the whole function if it's small, or use multi_replace.
  // ProductCard is small (34 lines). I will use replace_file_content for the whole file to be safe and clean.

  const phoneNumber = "918406831332";
  const defaultMsg = `I would like to know more about ${name}`;
  const finalMsg = whatsappMessage || defaultMsg;

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
          href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded border border-lime-300 text-lime-800 text-sm hover:bg-lime-50"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}