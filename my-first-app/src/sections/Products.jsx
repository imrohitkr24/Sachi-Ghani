import ProductCard from "../components/ProductCard.jsx";

const products = [
  {
    id: "500ml",
    name: "Mustard Oil 500 ml",
    price: "₹95",
    desc: "Everyday cooking & tadka",
    badge: "Best for small families",
    image: "/product-500ml.jpg",
    whatsappMessage: "Regarding 500 ml bottle that i what to know detail about the prodeuct"
  },
  {
    id: "1l",
    name: "Mustard Oil 1 L",
    price: "₹165",
    desc: "Daily use & pickles",
    badge: "Most popular",
    image: "/product-1l.jpg",
    whatsappMessage: "I would like to know more about Mustard Oil 1 L"
  },
  {
    id: "5l",
    name: "Mustard Oil 5 L Jar",
    price: "₹800",
    desc: "Bulk family pack",
    badge: "Value pack",
    image: "/product-5l.jpg",
    whatsappMessage: "I would like to know more about Mustard Oil 5 L Jar"
  },
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