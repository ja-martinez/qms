import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_initial")({
  beforeLoad: ({context: {user, desk}}) => {
    if (user && desk) {
      throw redirect({
        to: "/dashboard"
      })
    }
  },
  component: Initial
});

function Initial() {
  return (
    <div className="flex flex-col justify-center items-center grow">
      <div className="flex flex-col justify-center w-[350px] items-stretch grow gap-5 mb-10">
        <Outlet />
      </div>
    </div>
  );
}
