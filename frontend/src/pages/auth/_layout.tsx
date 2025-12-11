import { useAuth } from "@/components/context/AuthProvider";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

type AuthLayoutProps = {
};

export default function AuthLayout({}: AuthLayoutProps) {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.status === "authenticated") {
      navigate("/", { replace: true });
    }
  });

  return (
    <div className="flex flex-1 items-center justify-center">
      <Outlet />
    </div>
  );
}
