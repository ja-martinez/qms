import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
// import { toast } from "@/components/ui/use-toast"

const desks = Array(7)
  .fill(0)
  .map((_, i) => ({ id: i, number: i + 1 }));
const departments = ["Insurance", "Motor Vehicle Services"].map((name, i) => ({
  id: i,
  name,
}));

const FormSchema = z.object({
  desk: z.coerce.number({ required_error: "Please select a desk." }).positive(),
  department: z.string({ required_error: "Please select a department." }),
});

export default function CallClient() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  const deskSelectItems = desks.map((desk) => (
    <SelectItem value={String(desk.id)} key={desk.id}>
      {desk.number}
    </SelectItem>
  ));
  const departmentSelectItems = departments.map((department) => (
    <SelectItem value={String(department.id)} key={department.id}>
      {department.name}
    </SelectItem>
  ));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="desk"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desk</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a desk number" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {deskSelectItems}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
              <Select
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departmentSelectItems}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
