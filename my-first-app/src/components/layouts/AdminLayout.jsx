import React, { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AdminLayout() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-lime-900 text-white flex flex-col shadow-xl">
                <div className="p-6 text-2xl font-bold border-b border-lime-800 tracking-wider">
                    Sachi Ghani <span className="text-xs block font-normal text-lime-300 mt-1">Admin Portal</span>
                </div>
                <nav className="flex-1 py-6 space-y-2 px-3">
                    <Link
                        to="/admin/dashboard"
                        className="block px-4 py-3 rounded hover:bg-lime-800 transition-colors flex items-center gap-3"
                    >
                        <span>📊</span> Dashboard
                    </Link>
                    <Link
                        to="/admin/orders"
                        className="block px-4 py-3 rounded hover:bg-lime-800 transition-colors flex items-center gap-3"
                    >
                        <span>📦</span> Orders
                    </Link>
                    <Link
                        to="/admin/users"
                        className="block px-4 py-3 rounded hover:bg-lime-800 transition-colors flex items-center gap-3"
                    >
                        <span>👥</span> Users
                    </Link>
                    {/* Add more admin links here */}
                </nav>
                <div className="p-4 border-t border-lime-800">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors shadow-md"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm z-10 p-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Admin Area</h2>
                    <Link to="/" className="text-lime-700 hover:underline text-sm">Return to Shop &rarr;</Link>
                </header>

                <main className="flex-1 overflow-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
