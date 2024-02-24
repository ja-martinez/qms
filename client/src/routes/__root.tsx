import { Desk } from "@/lib/types";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { User } from "firebase/auth";

interface MyRouterContext {
  user: User | null;
  desk: Desk | null;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="px-8 min-h-screen flex flex-col">
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
});
