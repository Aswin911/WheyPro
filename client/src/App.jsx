
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import FeaturedProducts from "@/components/landing/FeaturedProducts";
import BrandStory from "@/components/landing/BrandStory";
import FinalCTA from "@/components/landing/FinalCTA";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GuestRoute from "@/components/auth/GuestRoute";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import { AuthProvider } from "@/context/AuthProvider";

import RoleGuard from "@/components/auth/RoleGuard";
import CustomerLayout from "@/components/layout/CustomerLayout";
import AdminLayout from "@/components/layout/AdminLayout";

import Account from "@/pages/Account";
import Orders from "@/pages/Orders";
import AdminDashboard from "@/pages/AdminDashboard";

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
              <Route element={<RoleGuard allowedRoles={["customer"]} />}>
                <Route element={<CustomerLayout />}>
                  {/* customer routes */}
                  <Route path="/account" element={<Account />} />
                  <Route path="/account/orders" element={<Orders />} />
                </Route>
              </Route>

                <Route element={<RoleGuard allowedRoles={["admin"]} />}>
                  <Route element={<AdminLayout />}>
                    {/* admin routes */}
                    <Route path="/admin" element={<AdminDashboard />} />
                  </Route>
                </Route>
            </Route>


        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
