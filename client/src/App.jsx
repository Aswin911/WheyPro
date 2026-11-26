
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer"

import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import FeaturedProducts from "@/components/landing/FeaturedProducts";
import BrandStory from "@/components/landing/BrandStory";
import FinalCTA from "@/components/landing/FinalCTA";

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <FeaturedProducts />
        <BrandStory />
        <FinalCTA />

        <section
          id="products"
          className="min-h-96 scroll-mt-24"
        />

        <section
          id="about"
          className="min-h-96 scroll-mt-24"
        />

        <section
          id="contact"
          className="min-h-96 scroll-mt-24"
        />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
