import { supabase } from "@/config/supabase";
import AuthController from "@/controllers/authController";
import { userToViewModel, type User } from "@/models/userModel";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextStatus = "authenticated" | "unauthenticated" | "loading";

type AuthContextType = {
  status: AuthContextStatus;
  user: null | User;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthContextStatus>("loading");
  const [user, setUser] = useState<null | User>(null);

  const getDbUser = async (email: string) => {
    try {
      const dbUser = await AuthController.getUserByEmail(email);
      setUser(userToViewModel(dbUser));
      setStatus("authenticated");
    } catch (err) {
      console.error(err);
      setStatus("unauthenticated");
      setUser(null);
    }
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.email) {
        getDbUser(session.user.email);
        setStatus("loading");
      } else {
        setStatus("unauthenticated");
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    status,
    user
  };

  return (
    <AuthContext.Provider value={value}>
      { children }
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
