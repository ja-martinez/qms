import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@/contexts/UserContext";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClient, getDepartments } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useThrottle from "@/hooks/useThrottle";

interface idColorMapType {
  [key: number]: string
}

const idColorMap: idColorMapType = {
  1: "bg-indigo-800",
  2: "bg-green-700",
  3: "bg-red-700"
}

function getDepartmentColor(id: number) {
  return idColorMap[id] ?? "bg-black"
}

export const Route = createFileRoute("/_auth/kiosk")({
  component: Kiosk,
});

function Kiosk() {
  const user = useUser()!;
  const queryClient = useQueryClient();

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const mutation = useMutation({
    mutationFn: async (e: React.SyntheticEvent) => {
      const departmentId = (e.target as HTMLButtonElement).value;
      const token = await user.getIdToken();
      const { id: clientId } = await createClient(Number(departmentId), token);
      toast.dismiss();
      toast(`Usted es el cliente numero ${clientId}`, {
        position: "top-left",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const handleClick = useThrottle(mutation.mutate, 1500, []);

  const deskButtons = departments?.map((department) => (
    <Button
      onTouchStart={handleClick}
      value={department.id}
      key={department.id}
      variant={"default-no-hover"}
      className={`tracking-width h-full grow basis-0 text-wrap rounded-md ${getDepartmentColor(department.id)} px-8 text-5xl`}
    >
      {department.name_es}
    </Button>
  ));
  
  return (
    <div className="align-center grid h-full grow grid-rows-3 px-7 py-10">
      <div>
        <h1 className="mb-5 text-center text-6xl font-bold tracking-tight">
          Welcome
        </h1>
        <h3 className="text-center text-3xl mb-2">
          Please select the reason for your visit.
        </h3>
        <h3 className="text-center text-3xl mb-1">
          Por favor seleccione el motivo de su visita.
        </h3>
      </div>
      <div className="row-span-2 grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-3">{deskButtons}</div>
    </div>
  );
}
