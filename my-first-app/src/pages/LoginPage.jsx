import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../config";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      console.log(API_URL);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 CORS FIX
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Login failed. Try again.");
      }

      if (!data?.token || !data?.user) {
        throw new Error("Unexpected server response.");
      }

      // Save auth data
      login({ token: data.token, user: data.user });

      // Redirect after login
      navigate("/place-order", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lime-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-lime-700">
          Welcome to the Sachi Ghani family
        </h1>
        <p className="mt-2 text-sm text-lime-600">
          Join us for pure cold-pressed goodness. Login to place orders and track them.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="text-sm text-lime-700">
              Email
            </label>
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
            <label htmlFor="password" className="text-sm text-lime-700">
              Password
            </label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Your password"
              className="input mt-1"
              required
              autoComplete="current-password"
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm text-lime-700">
          <Link to="/forgot" className="hover:underline">
            Forgot password?
          </Link>
          <div>
            New here?{" "}
            <Link to="/register" className="text-lime-600 font-medium hover:underline">
              Create an account
            </Link>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          By logging in you agree to our <span className="underline">Terms</span> &{" "}
          <span className="underline">Privacy</span>.
        </div>
      </div>
    </div>
  );
}
