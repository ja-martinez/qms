import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getDesks } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
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

import { useSetDeskId, useDeskId } from "@/contexts/DeskContext";

export const Route = createFileRoute("/_initial/chooseDesk")({
  beforeLoad: ({ context: { user } }) => {
    if (!user) {
      throw redirect({
        to: "/logIn",
        search: {
          redirect: location.href
        }
      });
    }
  },
  component: ChooseDesk,
});

const FormSchema = z.object({
  deskId: z.coerce
    .number({ required_error: "Please select a desk." })
    .positive(),
});

function ChooseDesk() {
  const setDeskId = useSetDeskId();
  const deskId = useDeskId();
  const navigate = useNavigate();

  const { data: desks } = useQuery({
    queryKey: ["desks"],
    queryFn: getDesks,
  });

  useEffect(() => {
    if (deskId) {
      navigate({ to: "/dashboard" });
    }
  }, [deskId, navigate]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setDeskId(data.deskId);
    console.log("first");
    // navigate({ to: "/dashboard" });
  }

  // let deskSelectItems: ReactElement[];
  // if (status === "success") {
  //   deskSelectItems = desks.map((desk) => (
  //     <SelectItem value={String(desk.id)} key={desk.id}>
  //       Desk {desk.number}
  //     </SelectItem>
  //   ));
  // }

  const deskSelectItems = desks?.map((desk) => (
    <SelectItem value={String(desk.id)} key={desk.id}>
      Desk {desk.number}
    </SelectItem>
  ));

  return (
    <>
      <h2 className="mx-auto text-2xl font-medium tracking-wider">
        Please choose a desk
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="deskId"
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
