import Navbar from "@/components/app/Navbar";
import { useAuth } from "@/components/context/AuthProvider";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/config/supabase";
import AuthController from "@/controllers/authController";
import { fetchPost } from "@/utils/fetchUtils";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

type HomeLayoutProps = {
};



export default function HomeLayout({}: HomeLayoutProps) {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function guard() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        navigate("/auth", { replace: true });
        return;
      }

      const token = sessionData.session.access_token;

      try {
        const res = await fetchPost<{user_existed: boolean }>(
          "/user",
          {},
          { Authorization: `Bearer ${token}` },
        );

        if (!res.user_existed && window.location.pathname !== "/rolechoose") {
          navigate("/rolechoose", { replace: true });
        }
      } catch (err) {
        console.error(err);
        AuthController.logoutUser()
      }

    }

    guard()

  },[auth, navigate]);

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      { auth.status === "loading" ?
        <Spinner /> :
        <Outlet />
      }
    </div>
  );
}
