import Navbar from "@/components/app/Navbar";
import { useAuth } from "@/components/context/AuthProvider";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/config/supabase";
import AuthController from "@/controllers/authController";
import { fetchPost } from "@/utils/fetchUtils";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

export default function ProfileLayout() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(true); // <-- local loading state

  useEffect(() => {

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth", { replace: true });
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    async function guard() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        navigate("/auth", { replace: true });
        return;
      }

      const token = sessionData.session.access_token;

      try {
        const res = await fetchPost<{ user_role: string }>(
          "/user",
          {},
          { Authorization: `Bearer ${token}` },
        );

        if (res.user_role == "none" && window.location.pathname !== "/rolechoose") {
          navigate("/rolechoose", { replace: true });
          return;
        }
      } catch (err) {
        console.error(err);
        AuthController.logoutUser();
      } finally {
        setLoading(false); // <-- stop spinner once done
      }
    }

    guard();
  }, [auth, navigate]);


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
