import { Link, useLocation, useRouteError } from "react-router-dom";
import { CircleX } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";

export function ErrorPage() {
  const error = useRouteError();
  const location = useLocation();

  console.log(error);

  const message = error instanceof Error ? error.message : "";

  return (
    <Card className="m-auto my-6 flex max-w-md flex-col items-center gap-4 p-6">
      <CircleX className="size-10 text-destructive" />
      <h2 className="text-xl font-semibold">Something went wrong!</h2>

      {message && (
        <p className="text-center text-sm text-muted-foreground">{message}</p>
      )}

      {location.pathname !== "/" && (
        <Button asChild>
          <Link to="/">Home</Link>
        </Button>
      )}
    </Card>
  );
}
