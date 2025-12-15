import React, { useState, useMemo } from "react";

// Updated single-file React component (Tailwind CSS assumed)
// New behavior:
// - After successful submission, show a pleasant Order Confirmed panel with order id and summary.
// - Clear the form fields so user can place another order.
// - Keep merchant details intact.

export default function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | done

  // Customer fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [city, setCity] = useState("");

  // Merchant / receiver details (editable)
  const [merchantNumber, setMerchantNumber] = useState("8406831332");
  const [upiId, setUpiId] = useState("sachighani@upi");

  // Prices
  const priceMap = useMemo(
    () => ({
      "500ml": 150,
      "1l": 280,
      "5l": 1200,
    }),
    []
  );

  // Quantities for each pack type (user can order multiple types together)
  const [qty500, setQty500] = useState(1);
  const [qty1l, setQty1l] = useState(0);
  const [qty5l, setQty5l] = useState(0);

  // Payment & proof
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [utr, setUtr] = useState("");
  const [proofFile, setProofFile] = useState(null);

  // Saved order for confirmation display
  const [savedOrder, setSavedOrder] = useState(null);

  // Computed values
  const amount500 = priceMap["500ml"] * Math.max(0, Number(qty500 || 0));
  const amount1l = priceMap["1l"] * Math.max(0, Number(qty1l || 0));
  const amount5l = priceMap["5l"] * Math.max(0, Number(qty5l || 0));
  const orderValue = amount500 + amount1l + amount5l;

  const isCustomerPhoneValid = /^[6-9]\d{9}$/.test(customerPhone);
  const canSubmitOrder = utr.trim() !== "" || proofFile !== null;

  const upiLink = useMemo(() => {
    const amount = Number(orderValue).toFixed(2);
    const pa = encodeURIComponent(upiId);
    const pn = encodeURIComponent("Sachi Ghani");
    const tn = encodeURIComponent(`Order: 500ml x${qty500} 1L x${qty1l} 5L x${qty5l}`);
    const am = encodeURIComponent(amount);
    return `upi://pay?pa=${pa}&pn=${pn}&tn=${tn}&am=${am}&cu=INR`;
  }, [upiId, orderValue, qty500, qty1l, qty5l]);

  const handleFile = (e) => {
    const f = e.target.files && e.target.files[0];
    setProofFile(f || null);
  };

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      alert("UPI ID copied to clipboard. Open your UPI app and paste to pay.");
    } catch (err) {
      alert("Unable to copy. Please copy the UPI ID manually: " + upiId);
    }
  };

  const resetForm = () => {
    // Keep merchant details but clear customer/order-specific fields
    setCustomerName("");
    setCustomerPhone("");
    setCity("");
    setQty500(0);
    setQty1l(0);
    setQty5l(0);
    setUtr("");
    setProofFile(null);
    setPaymentMethod("UPI");
    setStatus("idle");
  };

  const handleSubmit = (e) => {
    e && e.preventDefault();

    if (orderValue <= 0) {
      alert("Please select at least one pack to order.");
      return;
    }

    if (!canSubmitOrder) {
      alert("Please enter the UTR or upload payment proof before submitting the order.");
      return;
    }

    if (!isCustomerPhoneValid) {
      alert("Please enter a valid 10-digit phone number starting with 6-9.");
      return;
    }

    setStatus("sending");

    // Simulate server save — here we snapshot the order and clear the form for a new order
    setTimeout(() => {
      const orderId = `SG-${Date.now().toString().slice(-6)}`; // simple order id
      const items = [];
      if (qty500 > 0) items.push({ pack: "500ml", qty: qty500, subtotal: amount500 });
      if (qty1l > 0) items.push({ pack: "1l", qty: qty1l, subtotal: amount1l });
      if (qty5l > 0) items.push({ pack: "5l", qty: qty5l, subtotal: amount5l });

      const orderSnapshot = {
        id: orderId,
        name: customerName,
        phone: customerPhone,
        city,
        items,
        total: orderValue,
        utr: utr || null,
        proofName: proofFile ? proofFile.name : null,
        placedAt: new Date().toISOString(),
      };

      setSavedOrder(orderSnapshot);

      // clear form fields so next order can be placed
      setCustomerName("");
      setCustomerPhone("");
      setCity("");
      setQty500(0);
      setQty1l(0);
      setQty5l(0);
      setUtr("");
      setProofFile(null);

      setStatus("done");
    }, 900);
  };

  const inputClass = "w-full px-4 py-2 rounded-lg bg-white/80 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lime-300";

  return (
    <section id="contact" className="min-h-screen w-full bg-gradient-to-br from-lime-50 via-white to-yellow-50 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: Hero / Info */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="p-6 rounded-2xl bg-white/80 shadow-lg backdrop-blur-md">
              <h1 className="text-2xl font-extrabold text-lime-900">Sachi Ghani — Order Now</h1>
              <p className="mt-2 text-gray-700">Fresh cold-pressed mustard oil. Choose packs, pay via UPI and send payment proof. We'll verify and confirm your order.</p>

              <div className="mt-4">
                <div className="text-sm text-gray-600">Merchant</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="bg-lime-100 text-lime-800 px-3 py-2 rounded font-mono">{merchantNumber}</div>
                  <div className="bg-white px-3 py-2 rounded shadow">{upiId}</div>
                </div>
                <div className="mt-3 text-xs text-gray-500">Tip: Tap "Pay with UPI" to open UPI apps or copy the UPI ID.</div>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={() => { navigator.clipboard?.writeText(upiId); alert('UPI copied'); }} className="px-3 py-2 rounded-md bg-lime-600 text-white">Copy UPI</button>
                <a href={`https://wa.me/91${merchantNumber}?text=I want to order`} className="px-3 py-2 rounded-md border">WhatsApp</a>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/90 shadow-md">
              <h3 className="font-semibold text-gray-800">Order Summary</h3>
              <div className="mt-3 text-lg font-bold text-lime-900">₹{orderValue}</div>
              <div className="text-sm text-gray-600 mt-1">Items: {qty500 + qty1l + qty5l}</div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-600">500 ml</div>
                <div className="text-right font-medium">₹{amount500}</div>

                <div className="text-sm text-gray-600">1 L</div>
                <div className="text-right font-medium">₹{amount1l}</div>

                <div className="text-sm text-gray-600">5 L</div>
                <div className="text-right font-medium">₹{amount5l}</div>
              </div>
            </div>
          </div>

          {/* Right: Form & Confirmation */}
          <div className="lg:col-span-2">
            {/* Confirmation panel shown when order placed */}
            {status === "done" && savedOrder && (
              <div className="mb-6 p-6 rounded-2xl bg-white shadow-2xl border-l-4 border-lime-600">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-lime-900">Order Placed Successfully!</h2>
                    <p className="text-sm text-gray-600 mt-1">Thank you. We've received your payment proof and will verify the transaction shortly.</p>

                    <div className="mt-4 text-sm text-gray-700 grid grid-cols-2 gap-2">
                      <div>Order ID</div>
                      <div className="font-mono text-right">{savedOrder.id}</div>

                      <div>Name</div>
                      <div className="text-right">{savedOrder.name}</div>

                      <div>Phone</div>
                      <div className="text-right">{savedOrder.phone}</div>

                      <div>City</div>
                      <div className="text-right">{savedOrder.city}</div>

                      <div>UTR</div>
                      <div className="text-right">{savedOrder.utr || "-"}</div>

                      <div>Proof</div>
                      <div className="text-right">{savedOrder.proofName || "-"}</div>
                    </div>

                    <div className="mt-4">
                      <div className="text-sm font-semibold">Items</div>
                      <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                        {savedOrder.items.map((it) => (
                          <li key={it.pack}>{it.pack} × {it.qty} — ₹{it.subtotal}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-600">Total</div>
                    <div className="text-2xl font-bold text-lime-900">₹{savedOrder.total}</div>
                    <div className="mt-4 flex flex-col gap-2">
                      <button onClick={() => { setSavedOrder(null); resetForm(); }} className="px-4 py-2 rounded bg-lime-600 text-white">Place another order</button>
                      <a href={`https://wa.me/91${merchantNumber}?text=I have placed order ${savedOrder.id}`} className="px-4 py-2 rounded border text-sm">Message on WhatsApp</a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white/90 shadow-xl backdrop-blur-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required name="name" placeholder="Full Name" className={inputClass} disabled={status === 'sending'} />
                <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))} required name="phone" placeholder="Phone (10 digits)" className={inputClass} disabled={status === 'sending'} />
              </div>

              <div className="mt-4">
                <input value={city} onChange={(e) => setCity(e.target.value)} name="city" placeholder="City" className={inputClass} disabled={status === 'sending'} />
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 500ml card */}
                <div className="p-4 rounded-xl border bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">Mustard Oil 500 ml</div>
                      <div className="text-sm text-gray-500">₹{priceMap["500ml"]} each</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setQty500(Math.max(0, qty500 - 1))} className="px-2 py-1 rounded border" disabled={status === 'sending'}>-</button>
                      <input type="number" min="0" value={qty500} onChange={(e) => setQty500(Math.max(0, Number(e.target.value || 0)))} className="w-16 text-center input" disabled={status === 'sending'} />
                      <button type="button" onClick={() => setQty500(qty500 + 1)} className="px-2 py-1 rounded border" disabled={status === 'sending'}>+</button>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">Subtotal: ₹{amount500}</div>
                </div>

                {/* 1L card */}
                <div className="p-4 rounded-xl border bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">Mustard Oil 1 L</div>
                      <div className="text-sm text-gray-500">₹{priceMap["1l"]} each</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setQty1l(Math.max(0, qty1l - 1))} className="px-2 py-1 rounded border" disabled={status === 'sending'}>-</button>
                      <input type="number" min="0" value={qty1l} onChange={(e) => setQty1l(Math.max(0, Number(e.target.value || 0)))} className="w-16 text-center input" disabled={status === 'sending'} />
                      <button type="button" onClick={() => setQty1l(qty1l + 1)} className="px-2 py-1 rounded border" disabled={status === 'sending'}>+</button>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">Subtotal: ₹{amount1l}</div>
                </div>

                {/* 5L card */}
                <div className="p-4 rounded-xl border bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">Mustard Oil 5 L Jar</div>
                      <div className="text-sm text-gray-500">₹{priceMap["5l"]} each</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setQty5l(Math.max(0, qty5l - 1))} className="px-2 py-1 rounded border" disabled={status === 'sending'}>-</button>
                      <input type="number" min="0" value={qty5l} onChange={(e) => setQty5l(Math.max(0, Number(e.target.value || 0)))} className="w-16 text-center input" disabled={status === 'sending'} />
                      <button type="button" onClick={() => setQty5l(qty5l + 1)} className="px-2 py-1 rounded border" disabled={status === 'sending'}>+</button>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">Subtotal: ₹{amount5l}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="rounded-xl p-4 bg-lime-50 border">
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="text-2xl font-bold text-lime-900">₹{orderValue}</div>
                  <div className="text-xs text-gray-500">Items: {qty500 + qty1l + qty5l}</div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => { setPaymentMethod("UPI"); window.location.href = upiLink; }} className="px-4 py-2 rounded-lg bg-gradient-to-r from-lime-600 to-emerald-500 text-white shadow" disabled={status === 'sending'}>Pay with UPI</button>
                  <button type="button" onClick={handleCopyUPI} className="px-4 py-2 rounded-lg border" disabled={status === 'sending'}>Copy UPI ID</button>
                  <a href={`https://wa.me/91${merchantNumber}?text=I want to order 500ml x${qty500} 1L x${qty1l} 5L x${qty5l} (₹${orderValue})`} className="px-4 py-2 rounded-lg border">Notify on WhatsApp</a>
                </div>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">Enter UTR / Transaction ID</label>
                  <input value={utr} onChange={(e) => setUtr(e.target.value)} placeholder="Eg: AX123456789012345" className={inputClass} disabled={status === 'sending'} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Or Upload Payment Proof (screenshot)</label>
                  <input onChange={handleFile} type="file" accept="image/*,application/pdf" className="mt-1" disabled={status === 'sending'} />
                  {proofFile && <div className="text-sm mt-1">Selected: {proofFile.name}</div>}
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button type="submit" disabled={status !== "idle"} className="px-6 py-3 rounded-full bg-lime-700 text-white shadow-lg hover:scale-102 transform transition">
                  {status === "idle" ? "Submit Order" : status === "sending" ? "Sending..." : "Sent!"}
                </button>
              </div>

              <div className="mt-4 text-xs text-gray-500">Important: This UI collects UTR/proof only. Backend verification is required to confirm orders.</div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
