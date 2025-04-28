import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Profile } from "../lib/supabase";

interface User extends Profile {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  handleLogout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  error: null,
  handleLogout: async () => {},
  updateProfile: async () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Получаем профиль пользователя из таблицы profiles
  const fetchProfile = async (userId: string, emailFromSession?: string) => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        setUser({
          ...(data as User),
          email: emailFromSession || data.email,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(
        error instanceof Error ? error : new Error("Failed to fetch profile")
      );
      setUser(null);
    }
  };

  // Обновляем профиль пользователя
  const updateProfile = async (updates: Partial<User>) => {
    try {
      setError(null);
      if (!session?.user?.id) throw new Error("No user logged in");

      // Сначала обновляем email в auth.users, если он изменился
      if (updates.email) {
        if (updates.email !== user?.email) {
          console.log("Перед supabase.auth.updateUser");
          const { error: authError } = await supabase.auth.updateUser({
            email: updates.email,
          });
          console.log("После supabase.auth.updateUser", authError);
          if (authError) {
            console.error("Ошибка обновления email в auth.users", authError);
            throw authError;
          }
        }
        // Удаляем email из updates, чтобы не обновлять его в profiles
        delete updates.email;
      }

      console.log("Перед supabase.from('profiles').update");
      const { data: updatedProfile, error: profileError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", session.user.id)
        .select()
        .single();
      console.log("После supabase.from('profiles').update", updatedProfile, profileError);

      if (profileError) {
        console.error("Ошибка обновления профиля в таблице profiles", profileError);
        throw profileError;
      }

      // Обновляем состояние user только после успешного обновления
      if (updatedProfile) {
        setUser((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            ...updatedProfile,
          };
        });
      }

      console.log("Профиль успешно обновлён", updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(
        error instanceof Error
          ? error
          : typeof error === 'object' && error !== null && 'message' in error
          ? new Error((error as any).message)
          : new Error(JSON.stringify(error))
      );
      if (error instanceof Error) {
        alert(error.message);
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        alert((error as any).message);
      } else {
        alert(JSON.stringify(error));
      }
      throw error;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setError(null);
        // Получаем текущую сессию
        const {
          data: { session: currentSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (mounted) {
          setSession(currentSession);
          if (currentSession?.user) {
            await fetchProfile(currentSession.user.id, currentSession.user.email);
          }
        }

        // Подписываемся на изменения авторизации
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
          if (mounted) {
            setSession(newSession);
            if (newSession?.user) {
              await fetchProfile(newSession.user.id, newSession.user.email);
            } else {
              setUser(null);
            }
          }
        });

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth error:", error);
        if (mounted) {
          setError(
            error instanceof Error ? error : new Error("Authentication failed")
          );
          setUser(null);
          setSession(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();
  }, []);

  const handleLogout = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Logout error:", error);
      setError(error instanceof Error ? error : new Error("Logout failed"));
    }
  };

  const value = {
    user,
    session,
    loading,
    error,
    handleLogout,
    updateProfile,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
