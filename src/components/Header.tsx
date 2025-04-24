import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    }
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200">
      <Link to="/" className="text-blue-500 font-bold text-2xl">
        MORENT
      </Link>

      <form onSubmit={handleSearch} className="relative w-1/3">
        <input
          type="text"
          placeholder="Suchen Sie hier..."
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <button type="submit" className="hidden">
          Suchen
        </button>
      </form>

      <div className="flex items-center space-x-4">
        <Link
          to="/search"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Erweiterte Suche
        </Link>
        <button className="text-gray-600 relative">
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        {!loading && (
          <div className="flex items-center space-x-2">
            {" "}
            {session ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  title="My Account"
                >
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  title="Войти"
                >
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Link>

                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
