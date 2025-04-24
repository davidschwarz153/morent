import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CarDetailPage from "./pages/CarDetailPage";
import SearchPage from "./pages/SearchPage";
import PaymentPage from "./pages/PaymentPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import UserProfile from "./pages/UserProfile";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cars/:id" element={<CarDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/payment/:id" element={<PaymentPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<UserProfile />} />
            {/* Weitere Routen hier hinzufügen */}
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
