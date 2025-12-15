import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../Header";
import Footer from "../Footer";
import WhatsAppButton from "../WhatsAppButton";
import BottomNav from "../BottomNav";

export default function MainLayout() {
    return (
        <>
            <Header />
            <WhatsAppButton />
            <main className="min-h-screen pb-16 md:pb-0">
                <Outlet />
            </main>
            <Footer />
            <BottomNav />
        </>
    );
}
