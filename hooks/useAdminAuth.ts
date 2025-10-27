import { useEffect, useState } from "react";

interface Admin {
  adminId: string;
  email: string;
  role: string;
}

interface AdminAuthState {
  isAuthenticated: boolean;
  admin: Admin | null;
  loading: boolean;
}

export function useAdminAuth() {
  const [authState, setAuthState] = useState<AdminAuthState>({
    isAuthenticated: false,
    admin: null,
    loading: true,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const response = await fetch("/api/auth/admin/me");
      const data = await response.json();

      if (data.authenticated) {
        setAuthState({
          isAuthenticated: true,
          admin: data.admin,
          loading: false,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          admin: null,
          loading: false,
        });
      }
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        admin: null,
        loading: false,
      });
    }
  }

  return { ...authState, refetch: checkAuth };
}
