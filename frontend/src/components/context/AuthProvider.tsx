import { supabase } from "@/config/supabase";
import { userToViewModel, type User } from "@/models/authModels";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchPost } from "@/utils/fetchUtils";

type AuthContextStatus = "authenticated" | "unauthenticated" | "loading";

type AuthContextType = {
  status: AuthContextStatus;
  user: null | User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  token: string | null
};


const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthContextStatus>("loading");
  const [user, setUser] = useState<null | User>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const token = session.access_token;
        try {
          const userData = await fetchPost<{ role: string | null }>(
            "/getrole", // url
            {}, // body
            { Authorization: `Bearer ${token}` }, //headers
          );

          setUser(
            userToViewModel(session.user, userData.role ?? null)
          );
          setToken(token);
          setStatus("authenticated");
        } catch (error) {
          console.error("Failed to fetch user role:", error);
          setUser(userToViewModel(session.user)); // fallback without role
          setToken(token);
          setStatus("authenticated");
        }
      } else {
        setStatus("unauthenticated");
        setToken(null);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Optional: log user updates
  useEffect(() => {
    console.log("AuthContext user:", user);
  }, [user]);

  const value: AuthContextType = { status, user, setUser, token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
