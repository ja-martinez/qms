import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import logoUrl from "../assets/rl-jones-logo.png";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
// import { toast } from "@/components/ui/use-toast"
// import { auth } from "@/firebase";

import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";

export const Route = createFileRoute("/_initial/logIn")({
  beforeLoad: async ({ context: { user, desk } }) => {
    if (user && !desk) {
      throw redirect({
        to: "/chooseDesk",
      });
    }
  },
  component: LogIn,
});

const FormSchema = z.object({
  email: z.string().email().min(1, {
    message: "Enter a valid email.",
  }),
  password: z.string().min(1, {
    message: "Enter a password.",
  }),
});

function LogIn() {
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit({ email, password }: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      setIsIncorrect(false);
      console.log(`onSubmit user: ${JSON.stringify(user)}`);
      navigate({ to: "/chooseDesk" });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      setIsIncorrect(true);
    }
  }

  return (
    <>
      {/* <img src={logoUrl} alt="RL Jones Logo" className="object-scale-down" /> */}
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl mx-auto tracking-wider">
          Welcome
        </h1>
        <p className="text-sm text-muted-foreground mx-auto">
          Please enter your account information.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Sign In
          </Button>
          {isIncorrect && (
            <p className="text-destructive">
              The email and password do not match
            </p>
          )}
          {user && <p>The user id is {user.uid}</p>}
        </form>
      </Form>
    </>
  );
}
