import { type RouteObject } from "react-router";
import SellerProducts from "@/pages/shop/SellerProducts";
import { Spinner } from "@/components/ui/spinner";

const routes: RouteObject = {
  path: "sellers",
  loader: Spinner,
  children: [
    {
      path: ":id/products",
      Component: SellerProducts,
    },
  ],
};

export default routes;
