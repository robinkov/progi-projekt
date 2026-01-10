import { type RouteObject } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import RoleChooseLayout from "@/pages/roleChoose/_layout";

const routes: RouteObject = {
  path: "/rolechoose",
  Component: RoleChooseLayout,
  loader: Spinner
};

export default routes;