import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "../components/Header";

const RootLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
