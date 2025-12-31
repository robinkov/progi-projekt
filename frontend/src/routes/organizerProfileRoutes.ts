import { type RouteObject } from "react-router";
import OrganizerProfile from "@/pages/OrganizerProfile/OrganizerProfile";
import { Spinner } from "@/components/ui/spinner";
import OrganizerProfileLayout from "@/pages/OrganizerProfile/_layout";
import Pending from "@/pages/OrganizerProfile/Pending";
const profileRoutes: RouteObject = {
  path: "organizerprofile",

  loader: Spinner,
  Component: OrganizerProfileLayout,
  children: [
    {
      path: "",
      Component: OrganizerProfile
    },
    {
      path: "pending",
      Component: Pending
    }
  ]
};

export default profileRoutes;
