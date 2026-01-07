import { type RouteObject } from "react-router";
import AddProduct from "@/pages/addProduct/addProduct";
import HomeLayout from "@/pages/app/_Layout";

const routes: RouteObject = {
  path: "add-product",
  Component: HomeLayout,
  children: [
    {
      path: "",
      Component: AddProduct,
    },
  ]
};

export default routes;

