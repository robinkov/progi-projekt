import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"
import routes from "@/routes";
import "@/index.css"
import AuthProvider from "./components/context/AuthProvider";

const router = createBrowserRouter([routes]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)
