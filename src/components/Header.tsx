import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { FiSun, FiMoon, FiBell, FiSearch, FiUser } from "react-icons/fi";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const { session, loading, handleLogout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 dark:text-blue-400 w-[120px]"
          >
            Morent
          </Link>

          <div className="flex-1 w-[500px] mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder={t("search.placeholder")}
                className="w-full pl-10 pr-[120px] py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Link
                to="/search"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 w-[100px] text-center"
              >
                {t("search.advanced")}
              </Link>
            </form>
          </div>

          <div className="flex items-center space-x-2 min-w-[300px] justify-end">
            <div className="flex items-center space-x-2 border-r border-gray-200 dark:border-gray-700 pr-4 mr-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-[40px] h-[40px] flex items-center justify-center"
                title={
                  theme === "light"
                    ? "Switch to dark mode"
                    : "Switch to light mode"
                }
              >
                {theme === "light" ? (
                  <FiMoon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <FiSun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>

              <button
                onClick={toggleLanguage}
                className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium w-[60px] text-center"
              >
                {language.toUpperCase()}
              </button>
            </div>

            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative w-[40px] h-[40px] flex items-center justify-center"
              title="Notifications"
            >
              <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {!loading && (
              <div className="flex items-center space-x-2 pl-2">
                {session ? (
                  <>
                    <Link
                      to="/profile"
                      className="w-[40px] h-[40px] rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center overflow-hidden"
                      title="My Account"
                    >
                      {user?.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "";
                            target.parentElement?.classList.add(
                              "bg-gray-200",
                              "dark:bg-gray-700"
                            );
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-[80px] text-center"
                    >
                      {t("auth.logout")}
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-[80px] text-center"
                  >
                    {t("auth.login")}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
