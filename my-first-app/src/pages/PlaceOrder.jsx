import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const PRODUCTS = [
  { id: "500ml", name: "Mustard Oil 500 ml", price: 140 },
  { id: "1l", name: "Mustard Oil 1 L", price: 260 },
  { id: "5l", name: "Mustard Oil 5 L Jar", price: 1200 },
];

export default function PlaceOrder() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [form, setForm] = useState({ fullName: '', phone: '', city: '', utr: '' });

  // Load persistent cart on mount
  useEffect(() => {
    if (!token) return;
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";
    fetch(`${apiBase}/api/cart`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(cartItems => {
        const qtyMap = {};
        cartItems.forEach(i => qtyMap[i.productId] = i.qty);
        setQuantities(qtyMap);
      })
      .catch(console.error);
  }, [token]);

  // Save cart to backend whenever quantities change
  useEffect(() => {
    if (!token) return;
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";

    // Convert quantities map to array for saving
    const cart = PRODUCTS.map(p => {
      const q = quantities[p.id] || 0;
      return q > 0 ? { productId: p.id, name: p.name, qty: q, price: p.price } : null;
    }).filter(Boolean);

    fetch(`${apiBase}/api/cart`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ cart })
    }).catch(console.error);
  }, [quantities, token]);

  const updateQty = (id, delta) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const cartTotal = PRODUCTS.reduce((sum, p) => sum + (p.price * (quantities[p.id] || 0)), 0);
  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);

  const handlePlaceOrder = async () => {
    if (totalItems === 0) { alert('Multi-select at least one product'); return; }
    if (!form.phone || form.phone.length !== 10) { alert('Enter valid 10-digit phone'); return; }

    setPlacing(true);

    const items = PRODUCTS.map(p => {
      const q = quantities[p.id] || 0;
      if (q > 0) return { productId: p.id, name: p.name, qty: q, price: p.price };
      return null;
    }).filter(Boolean);

    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiBase}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items, total: cartTotal, customerDetails: form })
      });

      const data = await res.json();
      if (res.ok) {
        // Clear cart locally and optionally on server (server could handle this but we'll do it via state reset which triggers empty PUT)
        setQuantities({});
        alert('Order placed successfully! Order ID: ' + (data.order?._id || ''));
        navigate('/orders');
      } else {
        alert('Failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    } finally {
      setPlacing(false);
    }
  };

  const handleUPIPayment = () => {
    if (cartTotal <= 0) return;
    const upiId = "sachighani@upi";
    const name = "Sachi Ghani";
    const amount = cartTotal.toFixed(2);
    const note = `Order Payment: ${totalItems} items`;
    const url = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-lime-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col items-center mb-6">
        <Link to="/" className="text-lime-700 hover:underline font-bold text-lg">← Back to Home</Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-lime-100">
            <h2 className="text-xl font-bold text-lime-800">Sachi Ghani — Order Now</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Fresh cold-pressed mustard oil. Choose packs, pay via UPI and send payment proof. We'll verify and confirm your order.
            </p>

            <div className="mt-6">
              <label className="text-xs font-semibold text-gray-400 uppercase">Merchant UPI</label>
              <div className="flex flex-col space-y-2 mt-2">
                <div className="bg-lime-100 p-3 rounded-lg text-lime-800 font-mono text-center tracking-wider">8406831332</div>
                <div className="bg-gray-100 p-3 rounded-lg text-gray-600 font-mono text-center">sachighani@upi</div>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">Tap to open UPI app or copy ID.</p>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <button className="bg-lime-600 text-white py-2 rounded-lg font-semibold hover:bg-lime-700">Copy UPI</button>
                <button className="border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50">WhatsApp</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-lime-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-3">
              {PRODUCTS.map(p => quantities[p.id] > 0 && (
                <div key={p.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{quantities[p.id]} x {p.name}</span>
                  <span className="font-semibold text-gray-900">₹{p.price * quantities[p.id]}</span>
                </div>
              ))}
              {totalItems === 0 && <p className="text-gray-400 text-sm italic">Cart is empty</p>}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
              <span className="text-lg font-bold text-lime-700">Total</span>
              <span className="text-2xl font-extrabold text-gray-900">₹{cartTotal}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1 text-right">{totalItems} Items</div>
          </div>
        </div>

        {/* Right Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Address Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="fullName" placeholder="Full Name" className="p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-lime-300 outline-none" onChange={handleFormChange} />
              <input name="phone" placeholder="Phone (10 digits)" type="number" className="p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-lime-300 outline-none" onChange={handleFormChange} />
              <input name="city" placeholder="City / Address" className="p-3 border rounded-lg bg-gray-50 md:col-span-2 focus:ring-2 focus:ring-lime-300 outline-none" onChange={handleFormChange} />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRODUCTS.map(p => (
              <div key={p.id} className={`p-4 rounded-xl border-2 transition-all ${quantities[p.id] > 0 ? 'border-lime-500 bg-lime-50' : 'border-gray-100 bg-white'}`}>
                <h4 className="font-bold text-gray-800 h-10 leading-tight">{p.name}</h4>
                <p className="text-sm text-gray-500 mt-1">₹{p.price} each</p>
                <div className="mt-4 flex items-center justify-between">
                  <button onClick={() => updateQty(p.id, -1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-gray-500">-</button>
                  <span className="font-bold text-lg text-gray-800 w-8 text-center">{quantities[p.id] || 0}</span>
                  <button onClick={() => updateQty(p.id, 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-lime-100 text-lime-700">+</button>
                </div>
                {quantities[p.id] > 0 && <div className="mt-2 text-xs text-lime-700 font-semibold text-center">Subtotal: ₹{p.price * quantities[p.id]}</div>}
              </div>
            ))}
          </div>

          {/* Payment Actions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="bg-lime-100 px-6 py-3 rounded-xl border border-lime-200">
                <span className="block text-xs text-lime-700 font-semibold uppercase">Total Pay</span>
                <span className="text-3xl font-bold text-lime-800">₹{cartTotal}</span>
                <span className="text-xs text-lime-600 block">{totalItems} items selected</span>
              </div>
              <div className="flex gap-2">
                <button onClick={handleUPIPayment} className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-green-700 flex items-center gap-2">
                  Pay with UPI
                </button>
                <button className="border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50">Copy ID</button>
                <button className="border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50">Notify on WhatsApp</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">Enter UTR / Transaction ID</label>
                <input name="utr" placeholder="Eg: AX123456789" className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:border-lime-500 transition-colors" onChange={handleFormChange} />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">Or Upload Payment Proof</label>
                <input type="file" className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-lime-50 file:text-lime-700
                      hover:file:bg-lime-100
                    "/>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handlePlaceOrder}
                disabled={placing || totalItems === 0}
                className={`px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all ${totalItems > 0 ? 'bg-lime-700 text-white hover:bg-lime-800 hover:scale-105' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                {placing ? 'Submitting Order...' : 'Submit Order'}
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center">Important: This UI collects UTR/proof only. Backend verification is required to confirm orders.</p>
        </div>

      </div>
    </div>
  );
}
