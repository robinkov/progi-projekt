import Navbar from "@/components/app/Navbar";
import { useAuth } from "@/components/context/AuthProvider";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/config/supabase";
import AuthController from "@/controllers/authController";
import { fetchPost } from "@/utils/fetchUtils";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

export default function ProfileLayout() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function guard() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }

      const token = session.access_token;

      try {
        const res = await fetchPost<{ user_role: string }>(
          "/user",
          {},
          { Authorization: `Bearer ${token}` }
        );

        if (res.user_role === "none" && window.location.pathname !== "/rolechoose") {
          navigate("/rolechoose", { replace: true });
          return;
        }
      } catch (err) {
        console.error(err);
        AuthController.logoutUser();
      } finally {
        setLoading(false);
      }
    }

    guard();

    // Optional: listen for auth changes to redirect instantly on logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth", { replace: true });
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
