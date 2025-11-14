import { createContext, useEffect, useState } from "react";
import { createUserSchema, LoginUser, loginUserSchema, type CreateUser, type User } from "@/dtos/authDtos";
import supabase from "@/config/supabase";
import { validateObjectWithSchema } from "@/utils/validation";

type AuthContextStatus = "authenticated" | "unauthenticated" | "loading";

type AuthContextType = {
  status: AuthContextStatus;
  user: User | null;
  registerUserWithEmailAndPassword: (createUserObj: CreateUser) => Promise<void>;
  loginUserWithEmailAndPassword: (loginUserObj: LoginUser) => Promise<void>;
  userLogout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
}

export default function AuthProvider({
  children
}: AuthProviderProps) {
  const [status, setStatus] = useState<AuthContextStatus>("loading");
  const [user, setUser] = useState<User | null>(null);

  async function registerUserWithEmailAndPassword(createUserObj: CreateUser): Promise<void> {
    const createUserDto = validateObjectWithSchema(createUserSchema, createUserObj);

    const { email, password } = createUserDto;
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      throw new Error(error.message);
    }

    setStatus("authenticated");

    return Promise.resolve();
  }

  async function loginUserWithEmailAndPassword(loginUserObj: LoginUser): Promise<void> {
    const loginUserDto = validateObjectWithSchema(loginUserSchema, loginUserObj);

    const { email, password } = loginUserDto;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw new Error(error.message);
    }

    setStatus("authenticated");

    return Promise.resolve();
  }

  async function onLoadGetStatus() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
  }

  async function userLogout() {
    await supabase.auth.signOut();

    setStatus("unauthenticated");

    return Promise.resolve();
  }

  useEffect(() => {
    onLoadGetStatus();
  }, []);

  const value = {
    status,
    user,
    registerUserWithEmailAndPassword,
    loginUserWithEmailAndPassword,
    userLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      { children }
    </AuthContext.Provider>
  );
}
