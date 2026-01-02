import { type RouteObject } from "react-router";
import ReservedWorkshops from "@/pages/reservations/ReservedWorkshops";
import RegisteredExhibitions from "@/pages/reservations/RegisteredExhibitions";
import HomeLayout from "@/pages/app/_Layout";

const routes: RouteObject = {
  path: "reservations",
  Component: HomeLayout,
  children: [
    {
      path: "workshops",
      Component: ReservedWorkshops,
    },
    {
      path: "exhibitions",
      Component: RegisteredExhibitions,
    },
  ],
};

export default routes;
