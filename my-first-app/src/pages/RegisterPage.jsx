import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../config";

export default function RegisterPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const apiBase = API_URL;
      const res = await fetch(`${apiBase}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Registration failed. Try again.");
      }

      if (!data?.token || !data?.user) {
        throw new Error("Unexpected server response.");
      }

      // Show success modal instead of immediate redirect
      setShowModal(true);

    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Registration failed. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (showModal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-opacity-50 fixed inset-0 z-50 px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-6 text-center animate-bounce-in">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Registration Successful!</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              You are registered now you can log in.
            </p>
          </div>
          <div className="mt-5">
            <button
              onClick={() => navigate("/login", { state: { email: email } })}
              className="w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-4 py-2 bg-lime-600 text-base font-medium text-white hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 sm:text-sm"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-lime-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-lime-700">Create your account</h1>
        <p className="mt-2 text-sm text-lime-600">
          Join Sachi Ghani — create an account to place orders and track them.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="text-sm text-lime-700">Full name</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Your full name"
              className="input mt-1"
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm text-lime-700">Email</label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="input mt-1"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-lime-700">Password</label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="At least 6 characters"
              className="input mt-1"
              required
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="text-sm text-lime-700">Confirm password</label>
            <input
              id="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              type="password"
              placeholder="Repeat password"
              className="input mt-1"
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div role="alert" className="text-sm text-red-600 mt-1">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full btn btn-primary rounded-full mt-2 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <div className="mt-4 text-sm text-lime-700">
          Already have an account?{" "}
          <Link to="/login" className="text-lime-600 font-medium hover:underline">Log in</Link>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          By creating an account you agree to our <span className="underline">Terms</span> & <span className="underline">Privacy</span>.
        </div>
      </div>
    </div>
  );
}
