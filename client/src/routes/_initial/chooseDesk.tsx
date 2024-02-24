import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getDesks } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSetDesk } from "@/contexts/DeskContext";

export const Route = createFileRoute("/_initial/chooseDesk")({
  beforeLoad: ({ context: { user } }) => {
    if (!user) {
      throw redirect({
        to: "/logIn",
      });
    }
  },
  component: ChooseDesk,
});

const FormSchema = z.object({
  desk: z.coerce.number({ required_error: "Please select a desk." }).positive(),
});

function ChooseDesk() {
  const setDesk = useSetDesk();
  const navigate = useNavigate();

  const { status, data: desks } = useQuery({
    queryKey: ["desks"],
    queryFn: getDesks,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const selectedDesk = desks?.find((desk) => desk.id === data.desk);

    if (!selectedDesk) {
      throw Error("selected desk not found");
    }
    setDesk(selectedDesk);
    navigate({ to: "/dashboard" });
  }

  let deskSelectItems: ReactElement[];
  if (status === "success") {
    deskSelectItems = desks.map((desk) => (
      <SelectItem value={String(desk.id)} key={desk.id}>
        {desk.number}
      </SelectItem>
    ));
  }

  return (
    <>
      <h2 className="font-medium text-2xl mx-auto tracking-wider">
        Please choose a desk
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="desk"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a desk number" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>{deskSelectItems}</SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Choose Desk
          </Button>
        </form>
      </Form>
    </>
  );
}
