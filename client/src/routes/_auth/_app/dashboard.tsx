import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import ClientTable from "@/components/ClientTable";
import DequeueClient from "@/components/DequeueClient";
import CreateClient from "@/components/CreateClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { useEffect } from "react";

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
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const user = useUser();

  useEffect(() => {
    if (!user) {
      navigate({ to: "/logIn" });
    }
  }, [user, navigate]);

  return (
    <div className="grid grid-cols-5 justify-between gap-14">
      <div className="col-span-2 flex flex-col gap-4">
        <h1 className="mb-5 text-4xl font-bold tracking-tight">Dashboard</h1>
        <Card className="rounded-md">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-medium tracking-tight">
              Call Next Client
            </h2>
          </CardHeader>
          <CardContent>
            <DequeueClient />
          </CardContent>
        </Card>
        <Card className="rounded-md">
          <CardHeader>
            <h2 className="text-xl font-medium tracking-tight">
              Create New Client
            </h2>
          </CardHeader>
          <CardContent>
            <CreateClient />
          </CardContent>
        </Card>
      </div>
      <div className="col-span-3 mt-6">
        <ClientTable />
      </div>
    </div>
  );
}
