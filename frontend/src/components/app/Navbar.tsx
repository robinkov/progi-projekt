import { cn } from "@/utils/styleUtils";
import { Button, LoadingButton } from "@/components/ui/button";
import { useState } from "react";
import AuthController from "@/controllers/authController";
import { useAuth } from "@/components/context/AuthProvider";
import { Menu, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router";
import { useSidebar } from "../ui/sidebar";

type NavbarProps = React.ComponentPropsWithRef<'nav'> & {

}

export default function Navbar({
  className, ref, ...rest
}: NavbarProps) {
  const auth = useAuth();

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

  return (
    <nav
      className={cn("flex items-center w-full h-14 border-b px-4 bg-card", className)}
      ref={ref}
      { ...rest }
    >
      <div className="inline-flex w-full gap-4">
        <HamburgerButton />
        <WebshopButton />
      </div>
      <div>
        <h1 className="font-semibold text-xl">ClayPlay</h1>
      </div>
      <div className="inline-flex justify-end items-center w-full gap-4">
        <p>{ auth.user?.fullName }</p>
        <LoadingButton loading={logoutLoading} onClick={handleLogout}>
          Logout
        </LoadingButton>
      </div>
    </nav>
  );
}

function HamburgerButton() {
  const { toggleSidebar } = useSidebar();

  function handleClick() {
    toggleSidebar();
  }

  return (
    <Button variant="ghost" onClick={handleClick}>
      <Menu className="size-6" />
    </Button>
  );
}

function WebshopButton() {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/kosarica");
  }

  return (
    <Button variant="ghost" onClick={handleClick}>
      <ShoppingCart className="size-6" />
    </Button>
  );
}
