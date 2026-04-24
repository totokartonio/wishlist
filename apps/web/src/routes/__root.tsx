import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { authClient } from "../lib/auth-client";
import Layout from "../components/Layout";

type RouterContext = {
  session: Awaited<ReturnType<typeof authClient.getSession>> | null;
};

const RootLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
