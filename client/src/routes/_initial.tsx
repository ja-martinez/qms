import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_initial")({
  beforeLoad: ({ context: { user, deskId } }) => {
    if (user && deskId) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: Initial,
});

function Initial() {
  return (
    <div className="flex grow flex-col items-center justify-center">
      <div className="mb-10 flex w-[350px] grow flex-col items-stretch justify-center gap-5">
        <Outlet />
      </div>
    </div>
  );
}
