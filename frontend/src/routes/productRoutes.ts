import { type RouteObject } from "react-router";
import ProductInstance from "@/pages/shop/ProductInstance";
import { Spinner } from "@/components/ui/spinner";
import HomeLayout from "@/pages/app/_Layout";

const routes: RouteObject = {
  path: "products",
  loader: Spinner,
  Component: HomeLayout,
  children: [
    {
      path: ":id",
      Component: ProductInstance,
    },
  ],
};

export default routes;
