import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // show friendly errors

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // backend may send { message: "..." }
        const msg = data?.message || "Login failed. Check credentials and try again.";
        throw new Error(msg);
      }

      // expected response: { token, user: { id, name, email } }
      if (!data?.token || !data?.user) {
        throw new Error("Unexpected server response. Please try again.");
      }

      // call context login to save token & user
      login({ token: data.token, user: data.user });

      // navigate to protected page
      navigate("/place-order", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Try again later.");
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
            {loading ? (
              <>
                <svg
                  className="animate-spin mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
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
