import { type RouteObject } from "react-router";
import CreateWorkshop from "@/pages/createEvent/CreateWorkshop";
import CreateExhibition from "@/pages/createEvent/CreateExhibition";
import HomeLayout from "@/pages/app/_Layout";

const routes: RouteObject = {
  path: "create-event",
  Component: HomeLayout,
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

