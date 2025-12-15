import React, { useState, useEffect } from 'react';

export default function FeedbackPage() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [form, setForm] = useState({ name: '', message: '', rating: 5 });
    const [submitting, setSubmitting] = useState(false);

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ message: '', rating: 5 });

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = () => {
        const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";
        fetch(`${apiBase}/api/feedback`)
            .then(res => res.json())
            .then(data => setFeedbacks(data))
            .catch(console.error);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.message) return alert("All fields are required");

        setSubmitting(true);
        try {
            const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";
            const res = await fetch(`${apiBase}/api/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (res.ok) {
                setForm({ name: '', message: '', rating: 5 });
                fetchFeedbacks(); // refresh list
                alert("Thank you for your feedback!");
            } else {
                alert("Failed to save feedback: " + (data.message || res.statusText));
            }
        } catch (err) {
            console.error(err);
            alert("Error submitting feedback: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this feedback?")) return;
        try {
            const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";
            await fetch(`${apiBase}/api/feedback/${id}`, { method: 'DELETE' });
            fetchFeedbacks();
        } catch (err) { console.error(err); alert("Failed to delete"); }
    };

    const startEdit = (item) => {
        setEditingId(item._id);
        setEditForm({ message: item.message, rating: item.rating });
    };

    const handleUpdate = async (id) => {
        try {
            const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";
            await fetch(`${apiBase}/api/feedback/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            setEditingId(null);
            fetchFeedbacks();
        } catch (err) { console.error(err); alert("Failed to update"); }
    };

    return (
        <div className="min-h-screen bg-lime-50 font-sans">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-extrabold text-lime-900 text-center mb-8">Customer Feedback</h1>

                {/* Feedback Form */}
                <div className="bg-white p-8 rounded-2xl shadow-xl mb-12 border border-lime-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Leave your review</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2">Your Name</label>
                                <input
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-lime-500 outline-none"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setForm({ ...form, rating: star })}
                                            className={`w-12 h-12 rounded-lg text-2xl flex items-center justify-center transition-all ${form.rating >= star ? 'bg-yellow-400 text-white shadow-md transform scale-105' : 'bg-gray-100 text-gray-400'
                                                }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Message</label>
                            <textarea
                                value={form.message}
                                onChange={e => setForm({ ...form, message: e.target.value })}
                                rows="4"
                                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-lime-500 outline-none resize-none"
                                placeholder="Share your experience with Sachi Ghani..."
                            ></textarea>
                        </div>
                        <button
                            disabled={submitting}
                            className="w-full py-4 bg-lime-700 text-white rounded-xl font-bold hover:bg-lime-800 transition shadow-lg disabled:opacity-50"
                        >
                            {submitting ? "Submitting..." : "Submit Feedback"}
                        </button>
                    </form>
                </div>

                {/* Feedback List */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">Recent Reviews</h3>
                    {feedbacks.length === 0 ? (
                        <p className="text-center text-gray-500 italic">No feedback yet. Be the first!</p>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {feedbacks.map((item) => (
                                <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition relative group">
                                    {editingId === item._id ? (
                                        <div className="space-y-3">
                                            <div className="flex gap-1 mb-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button key={star} onClick={() => setEditForm({ ...editForm, rating: star })} className={`text-xl ${editForm.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}>★</button>
                                                ))}
                                            </div>
                                            <textarea
                                                className="w-full p-2 border rounded bg-gray-50 text-gray-800"
                                                value={editForm.message}
                                                onChange={e => setEditForm({ ...editForm, message: e.target.value })}
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => setEditingId(null)} className="text-gray-500 text-sm">Cancel</button>
                                                <button onClick={() => handleUpdate(item._id)} className="bg-lime-600 text-white px-3 py-1 rounded text-sm hover:bg-lime-700">Save</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                                                    <div className="text-yellow-500 text-sm tracking-widest">
                                                        {"★".repeat(item.rating)}<span className="text-gray-200">{"★".repeat(5 - item.rating)}</span>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed">"{item.message}"</p>

                                            {/* Edit/Delete Actions */}
                                            <div className="absolute top-4 right-4 hidden group-hover:flex gap-2">
                                                <button onClick={() => startEdit(item)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition" title="Edit">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                </button>
                                                <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-full transition" title="Delete">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
