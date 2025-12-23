import { type RouteObject } from "react-router";
import organizedWorkshops from "@/pages/organizedEvents/organizedWorkshops";
import publishedExhibitions from "@/pages/organizedEvents/publishedExhibitions";

const routes: RouteObject = {
  path: "organizedEvents",
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