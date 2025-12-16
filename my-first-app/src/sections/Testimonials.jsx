import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function Testimonials() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', message: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = () => {
    const apiBase = API_URL;
    fetch(`${apiBase}/api/feedback`)
      .then(res => res.json())
      .then(data => {
        // Filter for high quality reviews if needed, or just take latest. 
        // For marquee to look good, we need enough items. If few, duplicate them.
        let items = Array.isArray(data) ? data : [];
        if (items.length > 0 && items.length < 5) {
          items = [...items, ...items, ...items]; // duplicate to fill marquee
        }
        setFeedbacks(items);
      })
      .catch(console.error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return alert("All fields are required");

    setSubmitting(true);
    try {
      const apiBase = API_URL;
      const res = await fetch(`${apiBase}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setForm({ name: '', message: '', rating: 5 });
        setShowModal(false);
        alert("Thanks for your review! It will appear shortly.");
        fetchFeedbacks();
      } else {
        alert("Failed to submit.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="w-full bg-lime-50 overflow-hidden py-16">
      <div className="w-full px-4 mb-8 text-center">
        <h2 className="text-3xl font-bold text-lime-900">What Customers Say</h2>
        <p className="text-lime-700 mt-2">Real feedback from households and restaurants.</p>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 text-sm font-semibold text-lime-800 underline hover:text-lime-600 transition"
        >
          Write a Review
        </button>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full">
        {feedbacks.length > 0 ? (
          <div className="flex w-max animate-marquee pause-on-hover gap-6 px-4">
            {/* Show items twice to create seamless loop logic is handled by CSS usually needing double content, 
                but here we just mapped huge list. A true infinite marquee needs duplication in DOM. 
                Let's double the mapped list here for safety. */}
            {[...feedbacks, ...feedbacks].map((t, i) => (
              <div key={i} className="w-80 md:w-96 flex-shrink-0 p-6 rounded-2xl bg-white border border-lime-100 shadow-sm hover:shadow-md transition">
                <div className="flex text-yellow-500 mb-2">
                  {"★".repeat(t.rating || 5)}<span className="text-gray-200">{"★".repeat(5 - (t.rating || 5))}</span>
                </div>
                <p className="text-lime-800 italic leading-relaxed">"{t.message}"</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-sm">{t.name}</span>
                  <span className="text-xs text-lime-600">Verified Buyer</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">Loading reviews...</p>
        )}
      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-lime-900 mb-4">Share your experience</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <div className="flex gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button type="button" key={star} onClick={() => setForm({ ...form, rating: star })} className={`text-2xl transition ${form.rating >= star ? 'text-yellow-400 transform scale-110' : 'text-gray-300'}`}>★</button>
                  ))}
                </div>
              </div>
              <input
                className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-lime-500 outline-none"
                placeholder="Your Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
              <textarea
                className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-lime-500 outline-none"
                placeholder="What did you like about Sachi Ghani?"
                rows="3"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
              ></textarea>
              <button
                disabled={submitting}
                className="w-full py-3 bg-lime-700 text-white rounded-lg font-bold hover:bg-lime-800 transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}