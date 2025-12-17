import { type RouteObject } from "react-router";
import Home from "@/pages/app/Home";
import HomeLayout from "@/pages/app/_Layout";

const routes: RouteObject = {
  path: "",
  Component: HomeLayout,
  children: [
    {
      path: "",
      Component: Home
    }
  ]
};

export default routes;
