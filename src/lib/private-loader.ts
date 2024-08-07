import {
  redirect,
  type LoaderFunction,
  type LoaderFunctionArgs,
} from "react-router-dom";

export function privateLoader(loader: LoaderFunction) {
  return function (params: LoaderFunctionArgs) {
    const token = sessionStorage.getItem("token");
    if (!token) {
      const url = new URL(params.request.url);
      return redirect(`/login?to=${url.pathname}`);
    }
    return loader(params);
  };
}
