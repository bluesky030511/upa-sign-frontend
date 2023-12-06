import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { MainRoutes } from "./routes/main-routes";
import { ManagedUIContext } from "./context/ui.context";
import ErrorModal from "./components/modals/error-modal";
import SuccessToast from "./components/alerts/success-toast";
import ErrorToast from "./components/alerts/error-toast";

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  const paypalOptions = {
    "client-id":
      "AeIczBEY0DbGe3wAjH8f7sTPjqTPoxJJfuXBVqVnRGWYgfMSwDS3pmGWr0nvktz5SZya_A-mANLlbxar",
    currency: "USD",
    "disable-funding": "credit,venmo",
  };

  return (
    <React.StrictMode>
      <PayPalScriptProvider options={paypalOptions}>
        <QueryClientProvider client={queryClient}>
          <ManagedUIContext>
            <SuccessToast />
            <ErrorToast />
            <ErrorModal />
            <MainRoutes />
          </ManagedUIContext>
        </QueryClientProvider>
      </PayPalScriptProvider>
    </React.StrictMode>
  );
};
export default App;
