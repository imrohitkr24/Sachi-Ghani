import React, { useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

export default function ForgotPassPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!email) {
            setError("Please enter your email.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to send reset link.");
            }

            setMessage("Reset link sent! Please check your email inbox (and spam).");
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-lime-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-lime-700 mb-4">Forgot Password</h1>

                <p className="text-sm text-lime-600 mb-6">
                    Enter your registered email address and we'll send you a link to reset your password.
                </p>

                {message && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm font-medium border border-green-200">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm font-medium border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="text-sm text-lime-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="you@example.com"
                            className="input mt-1 w-full border-gray-300 focus:border-lime-500 focus:ring-lime-500 rounded-md shadow-sm"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full btn btn-primary rounded-full mt-2 flex items-center justify-center py-2 bg-lime-700 text-white hover:bg-lime-800 transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-lime-700">
                    <Link to="/login" className="hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
