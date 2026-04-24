import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/reset.css";
import "./styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ApiError } from "./lib/apiError";
import { authClient } from "./lib/auth-client";
import { routeTree } from "./routeTree.gen";

type RouterContext = {
  session: Awaited<ReturnType<typeof authClient.getSession>> | null;
};

const router = createRouter({
  routeTree,
  context: {
    session: null,
  } as RouterContext,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500
        ) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  const { data: session } = authClient.useSession();
  return (
    <RouterProvider router={router} context={{ session: session ?? null }} />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
