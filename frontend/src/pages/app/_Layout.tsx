import PageLayout from "@/components/layout/PageLayout";
import { useAuth } from "@/components/context/AuthProvider";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/config/supabase";
import { fetchPost } from "@/utils/fetchUtils";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

type HomeLayoutProps = {};

export default function HomeLayout({ }: HomeLayoutProps) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // <-- local loading state

  useEffect(() => {
    async function guard() {

      if (auth.status === "unauthenticated") {
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
      } finally {
        setLoading(false); // <-- stop spinner once done
      }
    }

    guard();
  }, [auth, navigate]);

  if (loading || auth.status === "loading") {
    return (
      <div className="flex flex-1 justify-center items-center">
        <Spinner className="size-12" />
      </div>
    );
  }

  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}
