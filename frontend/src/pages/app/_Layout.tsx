import Navbar from "@/components/app/Navbar";
import { useAuth } from "@/components/context/AuthProvider";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

type HomeLayoutProps = {
};

export default function HomeLayout({}: HomeLayoutProps) {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.status === "unauthenticated") {
      navigate("/auth", { replace: true });
    }
  });

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
