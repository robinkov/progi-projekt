import { type RouteObject } from "react-router";
import OrganizerProfile from "@/pages/OrganizerProfile/OrganizerProfile";
import { Spinner } from "@/components/ui/spinner";
import OrganizerProfileLayout from "@/pages/OrganizerProfile/_layout";

const profileRoutes: RouteObject = {
  path: "organizerprofile",
  loader: Spinner,
  Component: OrganizerProfileLayout,
  children: [
    {
        path:"",
        Component: OrganizerProfile
    }
  ]
};

export default profileRoutes;
