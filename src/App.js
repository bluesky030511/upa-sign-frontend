import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MainRoutes } from "./routes/main-routes";
import { ManagedUIContext } from "./context/ui.context";
import ErrorModal from "./components/modals/error-modal";
import SuccessToast from "./components/alerts/success-toast";
import ErrorToast from "./components/alerts/error-toast";
import { PaymentGatewayWrapper } from "./components/PaymentGatewayWrapper";

const App = () => {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <PaymentGatewayWrapper>
            <ManagedUIContext>
              <SuccessToast />
              <ErrorToast />
              <ErrorModal />
              <MainRoutes />
            </ManagedUIContext>
        </PaymentGatewayWrapper>
      </QueryClientProvider>
    </React.StrictMode>
  );
};
export default App;
