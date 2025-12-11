import { type RouteObject } from "react-router";
import Home from "@/pages/home/Home";
import { Spinner } from "@/components/ui/spinner";

const routes: RouteObject = {
  path: "",
  loader: Spinner,
  Component: Home,
};

export default routes;
