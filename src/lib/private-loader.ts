import {
  redirect,
  type LoaderFunction,
  type LoaderFunctionArgs,
} from "react-router-dom";

export function privateLoader(loader: LoaderFunction) {
  return function (params: LoaderFunctionArgs) {
    const url = new URL(params.request.url);

    const token = sessionStorage.getItem("token");
    if (!token) {
      return redirect(`/login?to=${url.pathname}`);
    }
    return loader(params);
  };
}
