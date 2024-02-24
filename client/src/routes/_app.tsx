import { createFileRoute, Outlet, Link, redirect } from "@tanstack/react-router";
// import logoUrl from "../assets/rl-jones-logo.png";
import DeskSwitcher from "@/components/DeskSwitcher";

export const Route = createFileRoute("/_app")({
  beforeLoad: ({context}) => {
    if (!context.user) {
      throw redirect({
        to: '/logIn'
      })
    }
    if (!context.desk) {
      throw redirect({
        to: '/chooseDesk'
      })
    }
  },
  component: App,
});

function App() {
  return (
    <>
      <div className="border-b flex justify-between items-center px-6">
        {/* <DeskSwitcher /> */}
        {/* <img src={logoUrl} alt="Logo" className="h-10" /> */}
      </div>
      <Outlet />
    </>
  );
}
