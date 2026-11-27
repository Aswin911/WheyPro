import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/useAuth";

export default function RoleGuard({ allowedRoles = [] }) {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
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

  if (!allowedRoles.includes(user.role)) {
    const fallback =
      user.role === "admin"
        ? "/admin"
        : "/account";

    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}