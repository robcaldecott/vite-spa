import { useForm } from "react-hook-form";
import type { ActionFunctionArgs } from "react-router-dom";
import {
  redirect,
  useActionData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import Cookies from "js-cookie";
import { HTTPError } from "ky";
import { AlertCircle } from "lucide-react";
import { login } from "../api";
import { Alert, AlertDescription, AlertTitle } from "../components/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/card";
import { FormError } from "../components/form-error";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { LoadingButton } from "../components/loading-button";

type LoginFormData = {
  email: string;
  password: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const json = (await request.json()) as LoginFormData;

  try {
    const session = await login(json.email, json.password);
    // Store the token
    Cookies.set("token", session.token);
    // Get the URL and look for a "to" search param
    const url = new URL(request.url);
    // Redirect
    return redirect(url.searchParams.get("to") ?? "/");
  } catch (error) {
    // Is this a 401 error?
    if (error instanceof HTTPError && error.response.status === 401) {
      return "Invalid email or password.";
    }
    throw error;
  }
}

export function Component() {
  const submitError = useActionData() as string | undefined;
  const navigation = useNavigation();
  const submit = useSubmit();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        submit(data, { method: "post", encType: "application/json" });
      })}
    >
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
                defaultValue="jane.doe@company.com"
                inputMode="email"
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value:
                      /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i,
                    message: "Please enter a valid email address.",
                  },
                })}
              />
              {errors.email && <FormError>{errors.email.message}</FormError>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                defaultValue="verystrongpassword"
                {...register("password", { required: "Password is required." })}
              />
              {errors.password && (
                <FormError>{errors.password.message}</FormError>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <LoadingButton
              loading={navigation.state === "submitting"}
              type="submit"
              className="w-full"
            >
              Sign in
            </LoadingButton>
          </CardFooter>

          {submitError && (
            <CardFooter>
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Oops!</AlertTitle>
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            </CardFooter>
          )}
        </Card>
      </div>
    </form>
  );
}
Component.displayName = "Login";
