// src/components/PrivateRoute.tsx
import { useAuth } from "@/context/auth-context";
import { JSX } from "react";
import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}
