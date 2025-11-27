import ProductCard from "../components/ProductCard.jsx";

const products = [
  { id: "500ml", name: "Mustard Oil 500 ml", price: "₹140", desc: "Everyday cooking & tadka", badge: "Best for small families" },
  { id: "1l", name: "Mustard Oil 1 L", price: "₹260", desc: "Daily use & pickles", badge: "Most popular" },
  { id: "5l", name: "Mustard Oil 5 L Jar", price: "₹1200", desc: "Bulk family pack", badge: "Value pack" },
];

export default function Products() {
  return (
    <section id="products" className="w-full bg-white">
      <div className="w-full px-4 py-16">
        <h2 className="text-3xl font-bold text-lime-900">Our Products</h2>
        <p className="text-lime-700 mt-2">Choose the perfect size for your kitchen needs.</p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
