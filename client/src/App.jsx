
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer"

import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import FeaturedProducts from "@/components/landing/FeaturedProducts";
import BrandStory from "@/components/landing/BrandStory";
import FinalCTA from "@/components/landing/FinalCTA";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GuestRoute from "@/components/auth/GuestRoute";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import { AuthProvider } from "@/context/AuthContext";

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

      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public landing page */}
          <Route path="/" element={<Home />} />

          {/* Guest-only pages */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected pages */}
          <Route element={<ProtectedRoute />}>
            {/* We'll add the user dashboard here */}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
