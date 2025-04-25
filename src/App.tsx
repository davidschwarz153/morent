import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import CarDetailPage from "./pages/CarDetailPage";
import PaymentPage from "./pages/PaymentPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import HowItWorks from "./pages/HowItWorks";
import Featured from "./pages/Featured";
import Partnership from "./pages/Partnership";
import BusinessRelation from "./pages/BusinessRelation";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/cars/:id" element={<CarDetailPage />} />
              <Route path="/payment/:id" element={<PaymentPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/featured" element={<Featured />} />
              <Route path="/partnership" element={<Partnership />} />
              <Route path="/business-relation" element={<BusinessRelation />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
