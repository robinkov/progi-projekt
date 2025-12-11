import { useAuth } from "@/components/context/AuthProvider";
import { LoadingButton } from "@/components/ui/button";
import AuthController from "@/controllers/authController";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Home() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);

  async function handleLogout() {
    setLogoutLoading(true);
    AuthController.logoutUser()
      .catch((error: Error) => {
        alert(error.message);
      })
      .finally(() => {
        setLogoutLoading(false);
      });
  }

  useEffect(() => {
    if (auth.status === "unauthenticated") {
      navigate("/auth", { replace: true });
    }
  }, [auth.status]);

  return (
    <div className="flex flex-1 justify-center items-center">
      <div>{ auth.user?.email }</div>
      <LoadingButton loading={logoutLoading} onClick={handleLogout}>
        Logout
      </LoadingButton>
    </div>
  );
}
