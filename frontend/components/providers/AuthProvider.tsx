import { createContext, useEffect, useState } from "react";
import { createUserSchema, LoginUser, loginUserSchema, type CreateUser, type User } from "@/dtos/authDtos";
import supabase from "@/config/supabase";
import { validateObjectWithSchema } from "@/utils/validation";
import endpoints from "@/constants/endpoints";
import { set } from "zod";

type AuthContextStatus = "authenticated" | "unauthenticated" | "loading";

type AuthContextType = {
  status: AuthContextStatus;
  token: string | null;
  user: User | null;
  registerUserWithEmailAndPassword: (createUserObj: CreateUser) => Promise<void>;
  loginUserWithEmailAndPassword: (loginUserObj: LoginUser) => Promise<void>;
  userLogout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
}

export default function AuthProvider({
  children
}: AuthProviderProps) {
  const [status, setStatus] = useState<AuthContextStatus>("loading");
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  async function getUser() {
    try {
      const response = await fetch(endpoints.GET_USER, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      setUser({
        firstName: result["user"]["first_name"],
        lastName: result["user"]["last_name"],
        email: result["user"]["mail"],
        displayName: result["user"]["username"],
      });
    } catch (error) {
      console.log(error);
    }

    return Promise.resolve();
  }

  async function registerUserWithEmailAndPassword(createUserObj: CreateUser): Promise<void> {
    const createUserDto = validateObjectWithSchema(createUserSchema, createUserObj);

    const { email, password } = createUserDto;
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      throw new Error(error.message);
    }

    const token = data.session?.access_token;

    if (!token) {
      throw new Error("No access token provided.");
    }
    
    try {
      await fetch(endpoints.PROFILE, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

    } catch (error) {
      throw new Error((error as Error).message);
    }

    setToken(token);
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

    const token = data.session?.access_token;

    if (!token) {
      throw new Error("No access token provided.");
    }

    setToken(token);
    setStatus("authenticated");

    return Promise.resolve();
  }

  async function signInWithGoogle(): Promise<void> {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google"
    });

    if (error) {
      throw new Error((error as Error).message);
    }

    setStatus("authenticated");

    return Promise.resolve();
  }

  async function signInWithGitHub(): Promise<void> {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

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
      setToken(session.access_token);
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
    getUser();
  }, [token]);

  useEffect(() => {
    onLoadGetStatus();
  }, []);

  const value = {
    status,
    user,
    token,
    registerUserWithEmailAndPassword,
    loginUserWithEmailAndPassword,
    signInWithGoogle,
    signInWithGitHub,
    userLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      { children }
    </AuthContext.Provider>
  );
}
