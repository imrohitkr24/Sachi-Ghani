import React from "react";

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-lime-600">
                    <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
                    <p className="text-3xl font-bold text-lime-700 mt-2">1,245</p>
                    <p className="text-sm text-gray-500 mt-1">+12% from last month</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
                    <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                    <p className="text-3xl font-bold text-blue-700 mt-2">3,890</p>
                    <p className="text-sm text-gray-500 mt-1">+5% new users</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-600">
                    <h3 className="text-lg font-semibold text-gray-700">Pending Deliveries</h3>
                    <p className="text-3xl font-bold text-orange-700 mt-2">45</p>
                    <p className="text-sm text-gray-500 mt-1">Needs attention</p>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b">
                        <p className="text-gray-500">No recent activity to show.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
