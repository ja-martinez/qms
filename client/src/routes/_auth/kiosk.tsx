import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@/contexts/UserContext";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClient, getDepartments, throttle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

export const Route = createFileRoute("/_auth/kiosk")({
  component: Kiosk,
});

function Kiosk() {
  const user = useUser()!;
  const queryClient = useQueryClient();

  const { status, data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const mutation = useMutation({
    mutationFn: async (e: React.SyntheticEvent) => {
      const departmentId = (e.target as HTMLButtonElement).value;
      const token = await user.getIdToken();
      const { id: clientId } = await createClient(Number(departmentId), token);
      toast(`Usted es el cliente numero ${clientId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const deskButtons = departments?.map((department) => (
    <Button
      onClick={mutation.mutate}
      value={department.id}
      key={department.id}
      className="tracking-wid h-full grow basis-0 text-wrap rounded-md bg-blue-800 px-8 text-4xl"
    >
      {department.name_es}
    </Button>
  ));

  return (
    <div className="align-center grid h-full grow grid-rows-3 px-7 py-10">
      <div>
        <h1 className="mb-6 text-center text-5xl font-bold tracking-tight">
          Bienvenido
        </h1>
        <h3 className="text-center text-xl">
          Por favor seleccione el motivo de su visita.
        </h3>
      </div>
      <div className="row-span-2 flex gap-14">{deskButtons}</div>
    </div>
  );
}
