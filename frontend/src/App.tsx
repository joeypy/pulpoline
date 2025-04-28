import { Link, Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./components/auth/private-routes";
import { useAuth } from "./context/auth-context";
import FavoritesPage from "./pages/favorite-page";
import HistoryPage from "./pages/history-page";
import HomePage from "./pages/home-page";
import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";
import { PublicRoute } from "./components/auth/public-routes";

export default function App() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div>
      <nav className="bg-gray-100 p-4 flex justify-between space-x-4">
        <div className="flex space-x-4">
          <Link to="/" className="font-medium">
            Home
          </Link>
          <Link to="/history" className="font-medium">
            History
          </Link>
        </div>
        <div className="flex space-x-4">
          {isAuthenticated && (
            <Link to="/favorites" className="font-medium">
              Favorites
            </Link>
          )}
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="font-medium">
                Login
              </Link>
              <Link to="/register" className="font-medium">
                Register
              </Link>
            </>
          ) : (
            <button onClick={logout} className="font-medium text-red-500">
              Logout
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <FavoritesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
