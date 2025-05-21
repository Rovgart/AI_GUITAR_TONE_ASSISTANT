import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./organisms/Header";
function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Header />
      </QueryClientProvider>
    </>
  );
}

export default App;
