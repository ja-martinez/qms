import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { createClient, getDepartments } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

export default function CreateClient() {
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
      toast("Client has been created.", {
        description: `Client number ${clientId}`,
      });
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
      className="grow basis-0"
    >
      {department.name}
    </Button>
  ));

  return <div className="flex flex-wrap gap-4">{deskButtons}</div>;
}
