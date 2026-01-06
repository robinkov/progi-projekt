import HomeLayout from "@/pages/app/_Layout";
import Membership from "@/pages/membership/Membership";
import PurchaseMembership from "@/pages/membership/PurchaseMembership";
import type { RouteObject } from "react-router";

const routes: RouteObject = {
  path: "membership",
  Component: HomeLayout,
  children: [
    {
      index: true,
      Component: Membership
    },
    {
      path: ":planId",
      Component: PurchaseMembership
    }
  ]
}

export default routes