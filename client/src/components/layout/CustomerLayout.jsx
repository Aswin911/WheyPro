import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="min-h-[calc(100vh-160px)] pt-24">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}