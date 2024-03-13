import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_initial/chooseDesk")({
  beforeLoad: ({ context: { user } }) => {
    if (!user) {
      throw redirect({
        to: "/logIn",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
