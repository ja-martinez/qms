import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_app/dashboard")({
  beforeLoad: ({ context, location }) => {
    if (!context.deskId) {
      throw redirect({
        to: "/chooseDesk",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

