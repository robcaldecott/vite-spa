// Font imports
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
// Main app CSS
import "./index.css";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import {
  createVehicle,
  deleteVehicle,
  getChartData,
  getColors,
  getManufacturers,
  getModels,
  getSummary,
  getTypes,
  getUser,
  getVehicle,
  getVehicles,
  login,
} from "./api.ts";
import { AppLoading } from "./components/app-loading.tsx";
import { ErrorPage } from "./components/error-page.tsx";
import { NotFound } from "./components/not-found.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Toaster } from "./components/toaster.tsx";
import { privateLoader } from "./lib/private-loader.ts";
import { Index } from "./routes/index.tsx";
import { Root } from "./routes/root.tsx";

async function enableMocking() {
  const { worker } = await import("./mocks/browser");
  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({ onUnhandledRequest: "bypass" });
}

void enableMocking().then(() => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      loader: privateLoader(async () => await getUser()),
      errorElement: <ErrorPage />,
      shouldRevalidate: () => {
        // Only load the user profile once
        return false;
      },
      children: [
        {
          index: true,
          element: <Index />,
          loader: privateLoader(async () => {
            const [summary, fuelChart, oemChart, yearChart] = await Promise.all(
              [
                getSummary(),
                getChartData("FUEL_TYPE"),
                getChartData("OEM"),
                getChartData("REGISTRATION_YEAR"),
              ],
            );
            return { summary, fuelChart, oemChart, yearChart };
          }),
          errorElement: <ErrorPage />,
        },
        {
          path: "vehicles",
          lazy: () => import("./routes/vehicles.tsx"),
          loader: privateLoader(async ({ request }) => {
            const url = new URL(request.url);
            const page = Number(url.searchParams.get("page") || "1");
            const q = url.searchParams.get("q") || "";
            const vehicles = await getVehicles(page, q);
            return vehicles;
          }),
          errorElement: <ErrorPage />,
        },
        {
          path: "vehicles/:id",
          lazy: () => import("./routes/details.tsx"),
          loader: privateLoader(
            async ({ params }) => await getVehicle(params.id as string),
          ),
          errorElement: <ErrorPage />,
        },
        {
          path: "vehicles/:id/destroy",
          element: null,
          action: async ({ params }) => {
            await deleteVehicle(params.id as string);
            return redirect("/vehicles");
          },
          errorElement: <ErrorPage />,
        },
        {
          path: "add",
          lazy: () => import("./routes/add.tsx"),
          loader: privateLoader(async () => {
            const [manufacturers, models, types, colors] = await Promise.all([
              getManufacturers(),
              getModels(),
              getTypes(),
              getColors(),
            ]);
            return { manufacturers, models, types, colors };
          }),
          action: async ({ request }) => {
            const formData = await request.formData();
            const vehicle = await createVehicle({
              vrm: formData.get("vrm") as string,
              manufacturer: formData.get("manufacturer") as string,
              model: formData.get("model") as string,
              type: formData.get("type") as string,
              color: formData.get("color") as string,
              fuel: formData.get("fuel") as string,
              mileage: Number(formData.get("mileage")),
              price: formData.get("price") as string,
              registrationDate: formData.get("registrationDate") as string,
              vin: formData.get("vin") as string,
            });
            return redirect(`/vehicles/${vehicle.id}`);
          },
          errorElement: <ErrorPage />,
        },
      ],
    },
    {
      path: "login",
      lazy: () => import("./routes/login.tsx"),
      action: async ({ request }) => {
        const formData = await request.formData();
        const session = await login(
          formData.get("email") as string,
          formData.get("password") as string,
        );
        // Store the token
        sessionStorage.setItem("token", session.token);
        // Get the URL and look for a "to" search param
        const url = new URL(request.url);
        // Redirect
        return redirect(url.searchParams.get("to") ?? "/");
      },
      errorElement: <ErrorPage />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ThemeProvider>
        <RouterProvider router={router} fallbackElement={<AppLoading />} />
        <Toaster />
      </ThemeProvider>
    </React.StrictMode>,
  );
});
