import Navbar from "@/components/app/Navbar";
import { supabase } from "@/config/supabase";
import { useEffect} from "react";
import { Outlet, useNavigate } from "react-router";

export default function OrganizerProfileLayout() {
  const navigate = useNavigate();

  useEffect(() => {

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
