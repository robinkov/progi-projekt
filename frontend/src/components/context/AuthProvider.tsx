import { supabase } from "@/config/supabase";
import { userToViewModel, type User } from "@/models/authModels";
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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(userToViewModel(session.user));
        setStatus("authenticated");
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
