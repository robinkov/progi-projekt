import { cn } from "@/utils/styleUtils";
import { Button, LoadingButton } from "@/components/ui/button";
import { useState } from "react";
import AuthController from "@/controllers/authController";
import { useAuth } from "@/components/context/AuthProvider";
import { Menu, ShoppingCart, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";

type NavbarProps = React.ComponentPropsWithRef<"nav">;

export default function Navbar({ className, ref, ...rest }: NavbarProps) {
  const auth = useAuth();
  const navigate = useNavigate();

  const [logoutLoading, setLogoutLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reservationsOpen, setReservationsOpen] = useState(false);

  async function handleLogout() {
    setLogoutLoading(true);
    AuthController.logoutUser()
      .catch((error: Error) => alert(error.message))
      .finally(() => setLogoutLoading(false));
  }

  function closeAndNavigate(path: string) {
    setSidebarOpen(false);
    navigate(path);
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

          <Button variant="ghost" onClick={() => navigate("/shop")}>
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
              onClick={() => { navigate("/shop"); setSidebarOpen(false); }}
            >
              Webshop
            </Button>
          </li>
          <li>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => { navigate("/workshops"); setSidebarOpen(false); }}
              >
                Radionice
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => { navigate("/exhibitions"); setSidebarOpen(false); }}
              >
                Izložbe
              </Button>
            </li>

            {/* Separator */}
            <li>
              <hr className="my-4 border-t border-muted-foreground" />
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
          {auth.user?.role === "organizator" && (
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate("/organizerprofile")}
              >
                Profile Organizacije
              </Button>
            </li>
          )}
          <li>
            <div>
              <Button
                variant="ghost"
                className="w-full justify-start items-center"
                onClick={() => setReservationsOpen((s) => !s)}
                aria-expanded={reservationsOpen}
              >
                <span className="text-left">Moje rezervacije</span>
                <ChevronDown className={cn("ml-auto size-4 transition-transform", reservationsOpen ? "rotate-180" : "")} />
              </Button>

              {/* Submenu */}
              <ul className={cn("mt-2 pl-4 space-y-2", reservationsOpen ? "block" : "hidden")}>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => closeAndNavigate("/reservations/workshops")}
                  >
                    Rezervirane radionice
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => closeAndNavigate("/reservations/exhibitions")}
                  >
                    Prijavljene izložbe
                  </Button>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </aside>

    </div>


    </>
  );
}
