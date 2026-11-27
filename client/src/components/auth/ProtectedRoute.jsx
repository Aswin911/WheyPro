import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/useAuth";

export default function ProtectedRoute() {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F7F4]">
        <div className="text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-4 border-[#C7F36B] border-t-transparent" />
          <p className="mt-4 text-sm text-[#777A72]">
            Restoring your session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}