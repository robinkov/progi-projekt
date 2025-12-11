import { Outlet } from "react-router";
import { useAuth } from "@/components/context/AuthProvider";
import { Spinner } from "@/components/ui/spinner";

export default function App() {
  const auth = useAuth();

  const SpinnerScreen = () => (
    <div className="flex flex-1 justify-center items-center">
      <Spinner className="size-12" />
    </div>
  );

  const Slot = auth.status === "loading" ? SpinnerScreen : Outlet;

  return (
    <div className="flex flex-col w-full min-h-screen h-full">
      <Slot />
    </div>
  );
}
