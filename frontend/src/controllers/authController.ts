import { supabase } from "@/config/supabase";
import type { User } from "@/models/userModel";
import type { Session } from "@supabase/supabase-js";

export default class AuthController {
  static async loginWithEmailAndPassword(email: string, password: string): Promise<void> {    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return Promise.reject(new Error(error.message));
    }

    return Promise.resolve();
  }

  static async signUpWithEmailAndPassword(email: string, password: string, fullName: string): Promise<void> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      return Promise.reject(new Error(error.message));
    }

    return Promise.resolve();
  }

  static async signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: import.meta.env.VITE_APP_URL
      }
    });

    if (error) {
      return Promise.reject(new Error(error.message));
    }

    return Promise.resolve();
  }

  static async signInWithGitHub() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: import.meta.env.VITE_APP_URL
      }
    });

    if (error) {
      return Promise.reject(new Error(error.message));
    }

    return Promise.resolve();
  }

  static async getCurrentSession(): Promise<Session> {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (!session || error) {
      return Promise.reject(new Error(error?.message || "No active session."));
    }

    return Promise.resolve(session);
  }

  static async logoutUser(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return Promise.reject(new Error(error.message));
    }

    return Promise.resolve();
  }

  static async getUserByEmail(email: string): Promise<User> {
    const { data, error } = await supabase.from("users").select("*").eq("mail", email).maybeSingle();

    if (error || !data) {
      return Promise.reject(error ? error.message : `User with email ${email} not found`);
    }

    return data;
  }
}
