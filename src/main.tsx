// Font imports
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
// Main app CSS
import "./index.css";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLoading } from "./components/app-loading.tsx";
import { NotFound } from "./components/not-found.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Toaster } from "./components/toaster.tsx";
import { Add } from "./routes/add.tsx";
import { Destroy } from "./routes/destroy.tsx";
import { Details } from "./routes/details.tsx";
import { Index } from "./routes/index.tsx";
import { Login } from "./routes/login.tsx";
import { Root } from "./routes/root.tsx";
import { Vehicles } from "./routes/vehicles.tsx";

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
      loader: Root.loader,
      shouldRevalidate: () => {
        // Only load the user profile once
        return false;
      },
      children: [
        {
          index: true,
          element: <Index />,
          loader: Index.loader,
        },
        {
          path: "vehicles",
          element: <Vehicles />,
          loader: Vehicles.loader,
        },
        {
          path: "vehicles/:id",
          element: <Details />,
          loader: Details.loader,
        },
        {
          path: "vehicles/:id/destroy",
          element: <Destroy />,
          action: Destroy.action,
          errorElement: <h1>Error deleting the vehicle. Please try again.</h1>,
        },
        {
          path: "add",
          element: <Add />,
          loader: Add.loader,
          action: Add.action,
        },
      ],
    },
    {
      path: "login",
      element: <Login />,
      action: Login.action,
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
