import { createFileRoute, Outlet } from "@tanstack/react-router";
import DeskSwitcher from "@/components/DeskSwitcher";
import { ModeToggle } from "@/components/ModeToggle";
import MainNav from "@/components/MainNav";
import { UserNav } from "@/components/UserNav";

export const Route = createFileRoute("/_auth/_app")({
  component: App,
});

function App() {
  return (
    <>
      <div className="mb-6 flex items-center justify-between border-b px-10 py-3">
        <div className="flex gap-8">
          <DeskSwitcher />
          <MainNav />
        </div>
        <div className="flex gap-6 align-middle">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
      <div className="px-14">
        <Outlet />
      </div>
    </>
  );
}
