import { Spinner } from "@/components/ui/spinner";
import HomeLayout from "@/pages/app/_Layout";
import Membership from "@/pages/membership/Membership";
import type { RouteObject } from "react-router";

const routes: RouteObject = {
  path: "membership",
  Component: HomeLayout,
  children: [
    {
      index: true,
      loader: Spinner,
      Component: Membership
    }
  ]
}

export default routes