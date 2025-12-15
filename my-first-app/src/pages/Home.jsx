import Nav from "../components/Nav";
import Hero from "../sections/Hero";
import Products from "../sections/Products";
import Process from "../sections/Process";
import Certifications from "../sections/Certifications";
import Testimonials from "../sections/Testimonials";
import Contact from "../sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Products />
      <Process />
      <Certifications />
      <Testimonials />
      <Contact />
    </>
  );
}
