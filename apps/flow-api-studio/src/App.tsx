import { StrictMode, useState } from "react";

import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Layouts from "./Layouts";
import Dashboard from "./pages/Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import APIs from "./pages/APIs";
import UseCases from "./pages/UseCases";

export default function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layouts />}>
              <Route index element={<Home />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="apis" element={<APIs />} />
              <Route path="use-cases" element={<UseCases />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
}
