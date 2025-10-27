import { User } from "@/types/User";
import { getUserWithToken } from "@/utils/auth/authApi";
import { createContext, useContext, useEffect, useState } from "react"

type AuthStatus = "loading" | "unauthenticated" | "authenticated";

type Auth = {
  user: User | null;
  status: AuthStatus;
  error: string | null;
}

const initialState: Auth = {
  user: null,
  status: "loading",
  error: null
}

export const AuthContext = createContext<Auth>(initialState);

type AuthProviderProps = {
  children: React.ReactNode
}

export function AuthProvider({
  children
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      setStatus("loading");

      try {
        const user = await getUserWithToken("token");
        setUser(user);
        setStatus("authenticated");
      } catch(error) {
        setError("Unable to authenticate");
        setStatus("unauthenticated");
      }
    }

    getUser();
  }, []);

  const value: Auth = {
    user,
    status,
    error
  }

  return (
    <AuthContext.Provider value={value}>
      { children }
    </AuthContext.Provider>
  );
}
