"use client";

import { loginSchema } from "@/lib/allSchemas";
import { LoginType } from "@/lib/allTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import loginHook from "@/lib/hooks/loginHook";
import { loginAction } from "@/lib/actions";

const LoginForm = () => {
  const [view, setView] = useState(false);

  const rhForm = useForm<LoginType>({
    resolver: zodResolver(loginSchema),

    mode: "all",

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginFormSubmit = async (lfData: LoginType) => {
    // console.log(lfData);

    const { success, message } = await loginHook(lfData);

    if (!success) {
      console.log(message);
    }

    if (success) {
      console.log(message);

      await loginAction();
    }
  };

  return (
    <>
      <Card className="w-full sm:w-[350px]">
        <CardHeader className="grid place-items-center text-center">
          <CardTitle>Login</CardTitle>

          <CardDescription>Log into your account</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...rhForm}>
            <form
              onSubmit={rhForm.handleSubmit(loginFormSubmit)}
              className="space-y-8"
            >
              <FormField
                control={rhForm.control}
                name={"email"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="xyz@example.com"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={rhForm.control}
                name={"password"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>

                    <FormControl>
                      <div className="relative">
                        <Input
                          type={view ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                        />

                        {view ? (
                          <Eye
                            className="absolute top-2 right-2"
                            onClick={() => setView(!view)}
                          />
                        ) : (
                          <EyeOff
                            className="absolute top-2 right-2"
                            onClick={() => setView(!view)}
                          />
                        )}
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={
                  rhForm.formState.isValid || rhForm.formState.isSubmitting
                    ? false
                    : true
                }
              >
                Login
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center text-center">
          <span>Don&apos;t have an account?&nbsp;</span>
          <Link
            href={"/auth/register"}
            className="font-bold underline"
          >
            Register
          </Link>
        </CardFooter>
      </Card>
    </>
  );
};

export default LoginForm;
