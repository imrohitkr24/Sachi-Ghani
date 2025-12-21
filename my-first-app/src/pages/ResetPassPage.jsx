import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function ResetPassPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!token) {
            setError("Invalid or missing token.");
            return;
        }

        if (!newPassword || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to reset password.");
            }

            setMessage("Password reset successfully! Redirecting to login...");
            setTimeout(() => {
                navigate("/login", { state: { message: "Password reset successful. Please login." } });
            }, 2000);
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-lime-50 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                    <h1 className="text-xl font-bold text-red-600 mb-4">Invalid Link</h1>
                    <p className="text-gray-600 mb-6">
                        The reset link is missing or invalid. Please request a new one.
                    </p>
                    <Link to="/forgot" className="text-lime-700 font-medium hover:underline">
                        Go to Forgot Password
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-lime-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-lime-700 mb-4">Reset Password</h1>

                <p className="text-sm text-lime-600 mb-6">
                    Enter your new password below.
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
                        <label htmlFor="newPassword" className="text-sm text-lime-700">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            type="password"
                            placeholder="Min 6 chars"
                            className="input mt-1 w-full border-gray-300 focus:border-lime-500 focus:ring-lime-500 rounded-md shadow-sm"
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="text-sm text-lime-700">
                            Confirm New Password
                        </label>
                        <input
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            placeholder="Re-enter password"
                            className="input mt-1 w-full border-gray-300 focus:border-lime-500 focus:ring-lime-500 rounded-md shadow-sm"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full btn btn-primary rounded-full mt-2 flex items-center justify-center py-2 bg-lime-700 text-white hover:bg-lime-800 transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Resetting..." : "Set New Password"}
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
