import { type RouteObject } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import RoleChooseLayout from "@/pages/roleChoose/_layout";
import RoleChoose from "@/pages/roleChoose/roleChoose";

const routes: RouteObject = {
  path: "/rolechoose",
  Component: RoleChooseLayout,
  loader: Spinner,
  children: [
    {
      path: "",
      Component: RoleChoose
    }
  ]
};

export default routes;