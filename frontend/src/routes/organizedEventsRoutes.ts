import { type RouteObject } from "react-router";
import organizedWorkshops from "@/pages/organizedEvents/organizedWorkshops";
import publishedExhibitions from "@/pages/organizedEvents/publishedExhibitions";
import HomeLayout from "@/pages/app/_Layout";

const routes: RouteObject = {
  path: "organizedEvents",
  Component: HomeLayout,
  children: [
    {
      path: "workshops",
      Component: organizedWorkshops,
    },
    {
      path: "exhibitions",
      Component: publishedExhibitions,
    },
  ],
};

export default routes;