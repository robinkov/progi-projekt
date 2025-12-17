import { type RouteObject } from "react-router";
import Profile from "@/pages/profile/Profile";
import { Spinner } from "@/components/ui/spinner";
import ProfileLayout from "@/pages/profile/_layout";

const profileRoutes: RouteObject = {
  path: "profile",
  loader: Spinner,
  Component: ProfileLayout,
  children: [
    {
        path:"",
        Component:Profile
    }
  ]
};

export default profileRoutes;
