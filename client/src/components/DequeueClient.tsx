import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dequeueClient, getDepartments } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { useDeskId } from "@/contexts/DeskContext";
import { toast } from "sonner";

const FormSchema = z.object({
  departmentId: z.string({ required_error: "Please select a department." }),
});

export default function DequeueClient() {
  const user = useUser()!;
  const deskId = useDeskId()!;
  const queryClient = useQueryClient();

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // useFormPersist("departmentId", {
  //   storage: window.localStorage,
  //   watch: form.watch,
  //   setValue: form.setValue,
  //   validate: true,
  //   dirty: true,
  //   touch: true
  // })

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      const departmentId = Number(data.departmentId);
      const token = await user.getIdToken();
      console.log(deskId, departmentId, token);
      const client = await dequeueClient(deskId, departmentId, token);

      if (!client) {
        toast("There are no clients to call.");
        return;
      }
      toast("Client has been called", {
        description: `Client number ${client.id}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["desks"] });
    },
  });

  const departmentSelectItems = departments?.map((department) => (
    <SelectItem value={String(department.id)} key={department.id}>
      {department.name}
    </SelectItem>
  ));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(mutation.mutate as SubmitHandler<{departmentId: string;}>)} className="space-y-6">
        <FormField
          control={form.control}
          name="departmentId"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>{departmentSelectItems}</SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Call Next Client
        </Button>
      </form>
    </Form>
  );
}
