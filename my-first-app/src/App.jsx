import "./App.css";
import Nav from "./components/Nav.jsx";
import Hero from "./sections/Hero.jsx";
import Products from "./sections/Products.jsx";
import Process from "./sections/Process.jsx";
import Certifications from "./sections/Certifications.jsx";
import Testimonials from "./sections/Testimonials.jsx";
import Contact from "./sections/Contact.jsx";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-white text-lime-900">
      <Nav />
      <main>
        <Hero />
        <Products />
        <Process />
        <Certifications />
        <Testimonials />
        <Contact />
      </main>
      <footer className="border-t border-lime-200">
        <div className="w-full px-4 py-6 text-sm text-lime-700">
          © {new Date().getFullYear()} Sachi Ghani. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
