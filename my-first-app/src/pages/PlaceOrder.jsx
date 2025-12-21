
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';
import { useNavigate, Link } from 'react-router-dom';

const PRODUCTS = [
  { id: "500ml", name: "Mustard Oil 500 ml", price: 95 },
  { id: "1l", name: "Mustard Oil 1 L", price: 165 },
  { id: "5l", name: "Mustard Oil 5 L Jar", price: 800 },
];

export default function PlaceOrder() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofName, setPaymentProofName] = useState(null);
  const [form, setForm] = useState({ fullName: '', phone: '', address: '', district: '', pincode: '', utr: '' });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Load persistent cart on mount
  useEffect(() => {
    if (!token) return;
    const apiBase = API_URL;
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
    const apiBase = API_URL;

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

    // UTR Validation: Exact 12 digits
    if (form.utr && !/^\d{12}$/.test(form.utr)) {
      alert('UTR must be exactly 12 numeric digits');
      return;
    }

    setPlacing(true);

    const items = PRODUCTS.map(p => {
      const q = quantities[p.id] || 0;
      if (q > 0) return { productId: p.id, name: p.name, qty: q, price: p.price };
      return null;
    }).filter(Boolean);

    try {
      const apiBase = API_URL;
      const res = await fetch(`${apiBase}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items, total: cartTotal, customerDetails: form, deliveryMethod, paymentProof })
      });

      const data = await res.json();
      if (res.ok) {
        // Clear cart locally and optionally on server (server could handle this but we'll do it via state reset which triggers empty PUT)
        setQuantities({});

        // Show success modal
        setOrderId(data.orderId || data._id || data.order?.orderId || data.order?._id || 'Unknown');
        setShowSuccessModal(true);

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
    <div className="min-h-screen bg-lime-50 p-4 md:p-8 font-sans pb-32 md:pb-8">
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
          {/* Address / Pickup Toggle */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex gap-4 mb-6">
              <label className={`flex-1 cursor-pointer p-4 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${deliveryMethod === 'delivery' ? 'border-lime-600 bg-lime-50 text-lime-800' : 'border-gray-200 text-gray-500'}`}>
                <input type="radio" name="method" className="hidden" checked={deliveryMethod === 'delivery'} onChange={() => setDeliveryMethod('delivery')} />
                <span>🚚 Home Delivery</span>
              </label>
              <label className={`flex-1 cursor-pointer p-4 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${deliveryMethod === 'pickup' ? 'border-lime-600 bg-lime-50 text-lime-800' : 'border-gray-200 text-gray-500'}`}>
                <input type="radio" name="method" className="hidden" checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup')} />
                <span>🏪 Store Pickup</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="fullName" placeholder="Full Name" className="p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-lime-300 outline-none" onChange={handleFormChange} />
              <input name="phone" placeholder="Phone (10 digits)" type="number" className="p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-lime-300 outline-none" onChange={handleFormChange} />

              {deliveryMethod === 'delivery' ? (
                <>
                  <input name="address" placeholder="Address" className="p-3 border rounded-lg bg-gray-50 md:col-span-2 focus:ring-2 focus:ring-lime-300 outline-none" onChange={handleFormChange} />
                  <input name="district" placeholder="District" className="p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-lime-300 outline-none" onChange={handleFormChange} />
                  <input name="pincode" placeholder="Pin Code" type="number" className="p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-lime-300 outline-none" onChange={handleFormChange} />
                </>
              ) : (
                <div className="md:col-span-2 bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-yellow-800">
                  <h4 className="font-bold mb-1">Pickup Location</h4>
                  <p className="text-sm">Sachi Ghani Store</p>
                  <p className="text-sm">Bihar Muzaffarpur Kachi Packi chauk Gupta flour mill Pin code 842002</p>
                  <p className="text-xs mt-2 text-yellow-600">Please collect your order from the above address.</p>
                </div>
              )}
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
                <label className="text-sm font-semibold text-gray-600 mb-2 block">Enter UTR / Transaction ID (12 Digits)</label>
                <input name="utr" placeholder="Eg: 123456789012" maxLength={12} className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:border-lime-500 transition-colors" onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, ''); // Only allow numbers
                  setForm({ ...form, utr: val });
                }} value={form.utr} />
              </div>

            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="flex-1 mr-4">
                {/* Hidden File Input */}
                <input
                  type="file"
                  id="proof-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const formData = new FormData();
                    formData.append('file', file);

                    try {
                      const apiBase = API_URL;
                      const res = await fetch(`${apiBase}/api/upload`, {
                        method: 'POST',
                        body: formData
                      });
                      const data = await res.json();
                      if (data.url) {
                        setPaymentProof(data.url);
                        setPaymentProofName(file.name);
                        alert('Proof uploaded successfully');
                      }
                    } catch (err) {
                      console.error(err);
                      alert('Upload failed');
                    }
                  }}
                />
                <button
                  onClick={() => document.getElementById('proof-upload').click()}
                  className={`w-full py-3 rounded-lg border-2 border-dashed flex items-center justify-center gap-2 transition-colors ${paymentProof ? 'border-lime-500 bg-lime-50 text-lime-700' : 'border-gray-300 text-gray-500 hover:border-lime-400'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                  {paymentProofName || "Upload Payment Screenshot"}
                </button>
              </div>

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

      {/* Mobile Sticky Footer */}
      {totalItems > 0 && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 uppercase font-semibold">Total</span>
            <div className="text-xl font-bold text-lime-800">₹{cartTotal}</div>
            <div className="text-xs text-gray-400">{totalItems} items</div>
          </div>
          <button
            onClick={() => {
              // Scroll to payment section or open modal (for now just scroll to bottom form)
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }}
            className="bg-lime-600 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
          >
            Checkout
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-bounce-in">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h3>
            <p className="text-gray-500 mb-6">
              Thank you for your order. <br />
              Order ID: <span className="font-mono font-bold text-gray-800">{orderId}</span>
            </p>
            <button
              onClick={() => navigate('/orders')}
              className="w-full bg-lime-600 text-white py-3 rounded-xl font-bold hover:bg-lime-700 transition-colors shadow-lg"
            >
              View My Orders
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
