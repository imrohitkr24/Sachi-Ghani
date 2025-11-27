import { useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState("idle");
  const onSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("done"), 800);
  };
  return (
    <section id="contact" className="w-full bg-white">
      <div className="w-full px-4 py-16">
        <h2 className="text-3xl font-bold text-lime-900">Order / Contact</h2>
        <p className="text-lime-700 mt-2">Place an order or ask a question. We’ll respond quickly.</p>
        <form onSubmit={onSubmit} className="mt-6 grid md:grid-cols-2 gap-5">
          <input required name="name" placeholder="Full Name" className="input" />
          <input required name="phone" placeholder="Phone" className="input" />
          <input name="city" placeholder="City" className="input md:col-span-2" />
          <select name="product" className="input">
            <option>Mustard Oil 500 ml</option>
            <option>Mustard Oil 1 L</option>
            <option>Mustard Oil 5 L Jar</option>
          </select>
          <input name="quantity" type="number" min="1" placeholder="Quantity" className="input" />
          <textarea name="message" placeholder="Message" rows="4" className="input md:col-span-2" />
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={status !== "idle"}
              className="px-5 py-3 rounded bg-lime-600 text-white disabled:opacity-60"
            >
              {status === "idle" ? "Submit Order" : status === "sending" ? "Sending..." : "Sent!"}
            </button>
            <a
              href="https://wa.me/91XXXXXXXXXX?text=I want to order Sachi Ghani Mustard Oil"
              className="px-5 py-3 rounded border border-lime-400 text-lime-800"
            >
              WhatsApp
            </a>
          </div>
        </form>
      </div>
    </section>
  );
}
