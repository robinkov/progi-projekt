import { type RouteObject } from "react-router";
import Exhibitions from "@/pages/exhibitions/Exhibitions";
import ExhibitionPage from "@/pages/exhibitions/ExhibitionsInstance";
import { Spinner } from "@/components/ui/spinner";

const routes: RouteObject = {
  path: "exhibitions",
  children: [
    {
      index: true,
      loader: Spinner,
      Component: Exhibitions,
    },
    {
      path: ":id",
      loader: Spinner,
      Component: ExhibitionPage,
    },
  ],
};

export default routes;
