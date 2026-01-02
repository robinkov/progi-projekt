import { type RouteObject } from "react-router";
import SellerProducts from "@/pages/shop/SellerProducts";
import { Spinner } from "@/components/ui/spinner";
import HomeLayout from "@/pages/app/_Layout";

const routes: RouteObject = {
  path: "sellers",
  loader: Spinner,
  Component: HomeLayout,
  children: [
    {
      path: ":id/products",
      Component: SellerProducts,
    },
  ],
};

export default routes;
