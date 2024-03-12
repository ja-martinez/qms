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
import { Input } from "@/components/ui/input";
import {
  createFileRoute,
  redirect,
  useNavigate,
  getRouteApi,
} from "@tanstack/react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";

const routeApi = getRouteApi("/_initial/logIn");

export const Route = createFileRoute("/_initial/logIn")({
  validateSearch: z.object({
    redirect: z.string().catch("/"),
  }),
  beforeLoad: async ({ context: { user, deskId } }) => {
    if (user && !deskId) {
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

export function LogIn() {
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [_isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const navigate = useNavigate();
  const search = routeApi.useSearch();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!user) return;
    if (search.redirect) {
      navigate({ to: search.redirect });
      return;
    }
    navigate({ to: "/chooseDesk" });
  }, [user, navigate, search.redirect]);

  async function onSubmit({ email, password }: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      setIsIncorrect(false);
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
        <h1 className="mx-auto text-2xl font-semibold tracking-wider">
          Welcome
        </h1>
        <p className="mx-auto text-sm text-muted-foreground">
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
                  <Input {...field} type="password" />
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
