import { type RouteObject } from "react-router";
import ProductInstance from "@/pages/shop/ProductInstance";
import { Spinner } from "@/components/ui/spinner";

const routes: RouteObject = {
  path: "products",
  loader: Spinner,
  children: [
    {
      path: ":id",
      Component: ProductInstance,
    },
  ],
};

export default routes;
