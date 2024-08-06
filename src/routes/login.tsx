import type { ActionFunctionArgs } from "react-router-dom";
import { Form, redirect } from "react-router-dom";
import { login } from "../api";
import { Button } from "../components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/card";
import { Input } from "../components/input";
import { Label } from "../components/label";

interface LoginFormData {
  email: string;
  password: string;
}

Login.action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const obj = Object.fromEntries(formData) as unknown as LoginFormData;
  // TODO: handle errors
  const session = await login(obj.email, obj.password);
  // Store the token
  sessionStorage.setItem("token", session.token);
  // Get the URL and look for a "to" search param
  const url = new URL(request.url);
  // Redirect
  return redirect(url.searchParams.get("to") ?? "/");
};

export function Login() {
  return (
    <Form method="post">
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-r from-cyan-500 to-primary">
        <Card className="m-6 w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue="user@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                defaultValue="Password123"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Form>
  );
}
