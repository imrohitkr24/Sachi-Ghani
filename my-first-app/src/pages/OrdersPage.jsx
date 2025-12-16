import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

export default function OrdersPage() {
  const { token, user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !user) return;
    setLoading(true);
    const apiBase = API_URL;

    // If admin, fetch ALL orders. If user, fetch MY orders.
    const endpoint = user.isAdmin ? `${apiBase}/api/orders` : `${apiBase}/api/orders/me`;

    fetch(endpoint, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        // Admin endpoint returns { totalOrders, orders: [...] }
        // User endpoint returns [...]
        let fetchedOrders = [];
        if (Array.isArray(data)) {
          fetchedOrders = data;
        } else if (data.orders && Array.isArray(data.orders)) {
          fetchedOrders = data.orders;
        }
        setOrders(fetchedOrders);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token, user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lime-800">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 md:py-10 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{user?.isAdmin ? "All Orders (Admin View)" : "My Orders"}</h1>
          <Link to="/" className="text-lime-700 hover:text-lime-800 font-semibold px-4 py-2 border border-lime-200 rounded-lg hover:bg-lime-50 transition-colors">
            ← Back to Home
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <h3 className="text-xl text-gray-400 font-medium">No orders found</h3>
            <p className="text-gray-500 mt-2">Looks like you haven't bought any oil yet!</p>
            <Link to="/place-order" className="mt-6 inline-block bg-lime-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-lime-700 transition-transform hover:scale-105">
              Order Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</span>
                    <span className="font-mono text-sm text-gray-700">#{order._id}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date Placed</span>
                    <span className="text-sm text-gray-700 font-medium">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Method</span>
                    <span className="text-sm text-gray-700 font-medium capitalize">
                      {order.deliveryMethod === 'pickup' ? '🏪 Pickup' : '🚚 Delivery'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.status || 'Placed'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="space-y-3 flex-grow">
                      {order.items && order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-lime-500"></div>
                          <span className="text-gray-700 font-medium">{item.name}</span>
                          <span className="text-gray-400 text-sm">x {item.qty}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 md:mt-0 flex flex-col items-end min-w-[120px]">
                      <span className="text-xs text-gray-400 mb-1">Total Amount</span>
                      <span className="text-2xl font-bold text-gray-900">₹{order.total}</span>
                    </div>
                  </div>

                  {/* Actions / Info */}
                  {order.customerDetails && (
                    <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 flex flex-wrap gap-4">
                      <span>Phone: {order.customerDetails.phone}</span>
                      {order.deliveryMethod === 'pickup' ? (
                        <span className="text-lime-700 font-semibold">Store Pickup (Self Collection)</span>
                      ) : (
                        <>
                          <span>Address: {order.customerDetails.address || order.customerDetails.city}</span>
                          {order.customerDetails.district && <span>District: {order.customerDetails.district}</span>}
                          {order.customerDetails.pincode && <span>Pin: {order.customerDetails.pincode}</span>}
                        </>
                      )}
                      {order.customerDetails.utr && <span>UTR: {order.customerDetails.utr}</span>}
                      {order.paymentProof && (
                        <a
                          href={order.paymentProof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white bg-lime-600 px-2 py-1 rounded text-xs font-bold hover:bg-lime-700"
                        >
                          View Payment Proof
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
