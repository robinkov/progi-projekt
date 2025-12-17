import AuthLayout from "@/pages/auth/_Layout"
import AuthLanding from "@/pages/auth/AuthLanding";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { type RouteObject } from "react-router";

const routes: RouteObject = {
  path: "auth",
  Component: AuthLayout,
  children: [
    {
      path: "",
      Component: AuthLanding,
    },
    {
      path: "login",
      Component: Login,
    },
    {
      path: "register",
      Component: Register
    }
  ],
};

export default routes;