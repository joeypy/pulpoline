// src/components/PublicRoute.tsx
import { useAuth } from "@/context/auth-context";
import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

export function PublicRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}
