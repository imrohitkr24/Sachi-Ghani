// src/Header.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-lime-500 to-yellow-400 p-1.5 shadow-md group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-white w-full h-full">
              <path d="M12 2C7.5 2 4.5 6.5 4.5 9c0 4.14 3.36 7.5 7.5 7.5s7.5-3.36 7.5-7.5c0-2.5-3-7-7.5-7zm0 13c-2.48 0-4.5-2.02-4.5-4.5 0-1.5 1.5-4 4.5-5.5 3 1.5 4.5 4 4.5 5.5 0 2.48-2.02 4.5-4.5 4.5z" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-lime-700 to-emerald-800 group-hover:from-lime-600 group-hover:to-emerald-700 transition-all">
            Sachi Ghani
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-1.5 px-3 py-2 rounded-full text-lime-800 hover:bg-lime-50 transition-colors font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Home
          </Link>

          <Link to="/place-order" className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-lime-600 text-white hover:bg-lime-700 shadow-md transform hover:-translate-y-0.5 transition-all text-sm font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            Place Order
          </Link>

          {user ? (
            <>
              <Link to="/orders" className="flex items-center gap-1.5 px-3 py-2 rounded-full text-lime-800 hover:bg-lime-50 transition-colors font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                My Orders
              </Link>
              <button
                onClick={logout}
                className="ml-1 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm border border-lime-200 text-lime-700 hover:bg-lime-100 hover:text-lime-900 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-lime-600 text-lime-700 text-sm font-semibold hover:bg-lime-50 hover:text-lime-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
