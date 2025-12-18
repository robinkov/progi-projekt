import { type RouteObject } from "react-router";
import ReservedWorkshops from "@/pages/reservations/ReservedWorkshops";
import RegisteredExhibitions from "@/pages/reservations/RegisteredExhibitions";

const routes: RouteObject = {
  path: "reservations",
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
