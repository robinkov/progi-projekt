import { cn } from "@/utils/styleUtils";
import { Button, LoadingButton } from "@/components/ui/button";
import { useState } from "react";
import AuthController from "@/controllers/authController";
import { useAuth } from "@/components/context/AuthProvider";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useNavigate } from "react-router";

type NavbarProps = React.ComponentPropsWithRef<"nav">;

export default function Navbar({ className, ref, ...rest }: NavbarProps) {
  const auth = useAuth();
  const navigate = useNavigate();

  const [logoutLoading, setLogoutLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    setLogoutLoading(true);
    AuthController.logoutUser()
      .catch((error: Error) => alert(error.message))
      .finally(() => setLogoutLoading(false));
  }

  return (
    <>
      <nav
        className={cn("flex items-center w-full h-14 border-b px-4 bg-card", className)}
        ref={ref}
        {...rest}
      >
        <div className="inline-flex w-full gap-4">
          <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="size-6" />
          </Button>

          <Button variant="ghost" onClick={() => navigate("/webshop")}>
            <ShoppingCart className="size-6" />
          </Button>
        </div>

        <div>
          <h1 className="font-semibold text-xl">ClayPlay</h1>
        </div>

        <div className="inline-flex justify-end items-center w-full gap-4">
          <p>{auth.user?.fullName}</p>
          <LoadingButton loading={logoutLoading} onClick={handleLogout}>
            Logout
          </LoadingButton>
        </div>
      </nav>

      {/* Sidebar + overlay */}
    <div
      className={cn(
        "fixed inset-0 z-50 flex transition-opacity duration-300",
        sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Sidebar (LEFT) */}
      <aside
        className={cn(
          "w-64 bg-card h-full p-4 shadow-lg transform transition-transform duration-300 ease-in-out border-r-1",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </Button>
        </div>

        <ul className="space-y-3">
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/")}
            >
              Home
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/profile")}
            >
              Profile
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setSidebarOpen(false)}
            >
              Webshop
            </Button>
          </li>
        </ul>
      </aside>

    </div>


    </>
  );
}
