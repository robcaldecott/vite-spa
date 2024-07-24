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
import { Index } from "./routes/index.tsx";
import { Login } from "./routes/login.tsx";
import { Root } from "./routes/root.tsx";

async function enableMocking() {
  const { worker } = await import("./mocks/browser");
  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({ onUnhandledRequest: "bypass" });
}

// function Details() {
//   const [open, setOpen] = React.useState(true);
//   const navigate = useNavigate();

//   return (
//     <Sheet
//       open={open}
//       onOpenChange={() => {
//         setOpen(false);
//         setTimeout(() => navigate(-1), 150);
//       }}
//     >
//       <SheetContent>
//         <SheetHeader>
//           <SheetTitle>Are you absolutely sure?</SheetTitle>
//           <SheetDescription>
//             This action cannot be undone. This will permanently delete your
//             account and remove your data from our servers.
//           </SheetDescription>
//         </SheetHeader>
//       </SheetContent>
//     </Sheet>
//   );
// }

void enableMocking().then(() => {
  // const router = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <Root />,
  //     children: [
  //       {
  //         path: "/",
  //         element: (
  //           <>
  //             <Index />
  //             <Outlet />
  //             <Link to="/create">Create</Link>
  //           </>
  //         ),
  //         loader: Index.loader,
  //         children: [{ path: ":id", element: <Details /> }],
  //       },
  //       {
  //         path: "/create",
  //         element: <div>Create</div>,
  //       },
  //     ],
  //   },
  //   {
  //     path: "*",
  //     element: <NotFound />,
  //   },
  // ]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      loader: Root.loader,
      children: [
        { index: true, element: <Index />, loader: Index.loader },
        { path: "vehicles", element: <h1>Vehicles</h1> },
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
