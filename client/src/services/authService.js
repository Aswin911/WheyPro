
import api from "@/lib/api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const getCurrentUser = async (accessToken) => {
  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

// Read the CSRF cookie. The refresh cookie is HttpOnly
// and must never be read by JavaScript.
function getCsrfCookie() {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("wheypro_csrf="));

  return cookie
    ? decodeURIComponent(cookie.substring("wheypro_csrf=".length))
    : null;
}

// Prevent duplicate refresh requests, including React StrictMode
// development effect re-runs.
let refreshPromise = null;

export const refreshSession = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const csrfToken = getCsrfCookie();

    if (!csrfToken) {
      return null;
    }

    try {
      const response = await api.post(
        "/auth/refresh",
        {},
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        return null;
      }

      throw error;
    }
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};

export const logoutUser = async () => {
  const csrfToken = getCsrfCookie();

  if (!csrfToken) {
    throw new Error("CSRF token is missing");
  }

  const response = await api.post(
    "/auth/logout",
    {},
    {
      headers: {
        "X-CSRF-Token": csrfToken,
      },
    }
  );

  return response.data;
};
