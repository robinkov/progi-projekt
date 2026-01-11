import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import routes from "@/routes";
import "@/index.css"
import AuthProvider from "./components/context/AuthProvider";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const router = createBrowserRouter([routes]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <PayPalScriptProvider options={{
      "clientId": "ARXyr_WfSF1KmFDFtp6FUNOJvCXnalaf9yBXHyouQFozXdmUHolBhU0iTIyf_N565XP08BX8G58aSOwF",
      currency: "EUR",
      locale: "en_HR"
    }}>
      <RouterProvider router={router} />
    </PayPalScriptProvider>
  </AuthProvider>
)
