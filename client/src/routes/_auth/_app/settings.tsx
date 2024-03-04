import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_app/settings")({
  component: () => <div>Hello /_layout/settings!</div>,
});
