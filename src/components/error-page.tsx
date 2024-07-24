import { useRouteError } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError();
  // @ts-expect-error error is unknown
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const message = error.statusText || error.message;

  return (
    <>
      <h1>{message}</h1>
    </>
  );
}
