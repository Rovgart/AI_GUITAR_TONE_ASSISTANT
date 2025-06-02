import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainPage from "./pages/mainpage";
import { Toaster } from "react-hot-toast";
import ModalManager from "./organisms/ModalManager";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalManager />
      <Toaster />
      <MainPage />
    </QueryClientProvider>
  );
}

export default App;
