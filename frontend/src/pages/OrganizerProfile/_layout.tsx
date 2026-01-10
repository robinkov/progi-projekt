import Navbar from "@/components/app/Navbar";
import { supabase } from "@/config/supabase";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { fetchPost } from "@/utils/fetchUtils";
import { useAuth } from "@/components/context/AuthProvider";

export default function OrganizerProfileLayout() {
  const navigate = useNavigate();
  const auth = useAuth();

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

      if (auth.status === "unauthenticated" || !auth.user) {
        navigate("/auth")
      }
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
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
