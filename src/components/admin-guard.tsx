import type React from "react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService.initializeAuth();

    const token = authService.getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    setIsAuthenticated(true);
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};
