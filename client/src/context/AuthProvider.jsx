import {
  useEffect,
  useState,
} from "react";

import { refreshSession } from "@/services/authService";
import { logoutUser } from "@/services/authService";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const data = await refreshSession();

        if (!active) return;

        if (data?.success) {
          setUser(data.user);
          setAccessToken(data.accessToken);
          setStatus("authenticated");
        } else {
          setUser(null);
          setAccessToken(null);
          setStatus("unauthenticated");
        }
      } catch (error) {
        console.error("Session restoration failed:", error);

        if (active) {
          setUser(null);
          setAccessToken(null);
          setStatus("unauthenticated");
        }
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const login = (data) => {
    setUser(data.user);
    setAccessToken(data.accessToken);
    setStatus("authenticated");
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setAccessToken(null);
      setStatus("unauthenticated");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        status,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}