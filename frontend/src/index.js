import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/index.css";
import App from "@/App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById("root");
const tree = (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

// react-snap prerenders into #root at build time; hydrate if pre-rendered content exists.
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, tree);
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(tree);
}
