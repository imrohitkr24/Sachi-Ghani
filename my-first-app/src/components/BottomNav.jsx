import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function BottomNav() {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    // Helper to sync fill color
    const getIconClass = (path) => isActive(path) ? "w-6 h-6 text-lime-700" : "w-6 h-6 text-gray-400";
    const getTextClass = (path) => isActive(path) ? "text-xs font-semibold text-lime-700" : "text-xs text-gray-500";

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 h-16 flex items-center justify-around px-2 safe-area-pb">
            <Link to="/" className="flex flex-col items-center gap-1 p-2">
                <svg className={getIconClass("/")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                <span className={getTextClass("/")}>Home</span>
            </Link>

            <Link to="/place-order" className="flex flex-col items-center gap-1 p-2">
                <div className={`p-1.5 rounded-full ${isActive("/place-order") ? "bg-lime-100" : ""}`}>
                    <svg className={getIconClass("/place-order")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
                <span className={getTextClass("/place-order")}>Order</span>
            </Link>

            <Link to={user ? "/orders" : "/login"} className="flex flex-col items-center gap-1 p-2">
                <svg className={getIconClass(user ? "/orders" : "/login")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {user ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    )}
                </svg>
                <span className={getTextClass(user ? "/orders" : "/login")}>{user ? "My Orders" : "Login"}</span>
            </Link>
        </div>
    );
}
