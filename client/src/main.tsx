import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import {
  UserProvider,
  useIsInitializing,
  useUser,
} from "./contexts/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DeskProvider, useDesk } from "./contexts/DeskContext";

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    user: undefined!,
    desk: undefined!,
  },
});

const queryClient = new QueryClient();

function App() {
  const user = useUser();
  const isInitializing = useIsInitializing();
  const desk = useDesk();
  if (isInitializing) {
    return null;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ user, desk }} />
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <DeskProvider>
        <App />
      </DeskProvider>
    </UserProvider>
  </StrictMode>
);
