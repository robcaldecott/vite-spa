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
        { index: true, element: <Index />, loader: Index.loader },
        {
          path: "test",
          element: <h1>Test</h1>,
        },
        {
          path: "test/:id",
          element: <h1>ID</h1>,
        },
        {
          path: "vehicles",
          element: <Vehicles />,
          loader: Vehicles.loader,
          shouldRevalidate: ({
            nextParams,
            currentParams,
            defaultShouldRevalidate,
          }) => {
            if (nextParams.id || currentParams.id) {
              // If we are showing or hiding vehicle details then do not revalidate
              return false;
            }
            return defaultShouldRevalidate;
          },
          children: [
            { path: ":id", element: <Details />, loader: Details.loader },
          ],
        },
        { path: "add", element: <h1>Add</h1> },
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
      </ThemeProvider>
    </React.StrictMode>,
  );
});
