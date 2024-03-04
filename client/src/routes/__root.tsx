import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { User } from "firebase/auth";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeProvider";

interface MyRouterContext {
  user: User | null;
  deskId: number | null;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="flex h-full min-h-screen flex-col">
        <Outlet />
        <Toaster closeButton position="bottom-left" />
      </div>
    </ThemeProvider>
  ),
});
