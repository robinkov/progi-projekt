import { type RouteObject } from "react-router";
import CreateWorkshop from "@/pages/createEvent/CreateWorkshop";
import CreateExhibition from "@/pages/createEvent/CreateExhibition";

const routes: RouteObject = {
  path: "create-event",
  children: [
    {
      path: "workshop",
      Component: CreateWorkshop,
    },
    {
      path: "exhibition",
      Component: CreateExhibition,
    },
  ],
};

export default routes;

