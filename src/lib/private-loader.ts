import {
  redirect,
  type LoaderFunction,
  type LoaderFunctionArgs,
} from "react-router-dom";
import cookies from "js-cookie";

export function privateLoader(loader: LoaderFunction) {
  return function (params: LoaderFunctionArgs) {
    const token = cookies.get("token");
    if (!token) {
      const url = new URL(params.request.url);
      return redirect(`/login?to=${url.pathname}`);
    }
    return loader(params);
  };
}
