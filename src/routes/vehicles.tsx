import * as React from "react";
import {
  Link,
  Outlet,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import { ChevronLeft, ChevronRight, Info, Loader2, Search } from "lucide-react";
import { getVehicles } from "../api";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Input } from "../components/input";
import { Separator } from "../components/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/table";
import type { VehicleList } from "../types";
import { getWebColor } from "../utils/color";
import { formatCurrency } from "../utils/intl";
import { privateLoader } from "../utils/private-loader";

const fuelLabels: Record<string, string> = {
  Gasoline: "Petrol",
  Diesel: "Diesel",
  Hybrid: "Hybrid",
  Electric: "Electric",
};

Vehicles.loader = privateLoader(async ({ request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || "1");
  const q = url.searchParams.get("q") || "";
  const vehicles = await getVehicles(page, q);

  return vehicles;
});

export function Vehicles() {
  const { summary, vehicles } = useLoaderData() as VehicleList;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const [query, setQuery] = React.useState(searchParams.get("q") || "");

  React.useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const setPage = (page: number) => {
    setSearchParams(
      { page: String(page), q: query },
      { preventScrollReset: true },
    );
  };

  return (
    <>
      <Card>
        <div className="flex flex-wrap items-center gap-4 p-4">
          <div className="flex grow gap-2">
            <h2 className="text-xl font-semibold">Inventory</h2>
            <Badge variant="default">{summary.total}</Badge>
          </div>

          {/* Search field */}
          <form
            className="relative w-full sm:w-64"
            id="search-form"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              setSearchParams({ q: query, page: "1" });
            }}
          >
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              className="rounded-full pl-10 [&::-webkit-search-cancel-button]:hidden"
              type="search"
              name="q"
              placeholder="Search"
              aria-label="Search inventory"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>

        <Separator />

        {summary.total === 0 && (
          <div className="flex flex-col items-center gap-4 p-6">
            <Info className="size-10 text-primary" />
            <h3 className="text-xl font-semibold">No results found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search
            </p>
            <Button variant="default" onClick={() => setSearchParams()}>
              Clear filters
            </Button>
          </div>
        )}

        {summary.total > 0 && (
          <>
            <Table className="table-auto sm:table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-auto lg:w-32">Registration</TableHead>
                  <TableHead className="w-auto lg:w-60">Manufacturer</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-auto text-right lg:w-32">
                    Fuel
                  </TableHead>
                  <TableHead className="w-auto text-right lg:w-32">
                    Price
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <Link
                        to={`/vehicles/${vehicle.id}`}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {vehicle.vrm}
                      </Link>
                    </TableCell>
                    <TableCell>{vehicle.manufacturer}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <div
                          className="size-5 shrink-0 rounded-full border"
                          style={{
                            backgroundColor: getWebColor(vehicle.color),
                          }}
                        />
                        <span>{`${vehicle.model} ${vehicle.type}`}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">
                        {fuelLabels[vehicle.fuel]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(parseInt(vehicle.price, 10), {
                        maximumFractionDigits: 0,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {summary.totalPages > 1 && (
              <>
                <Separator />

                {/* Pagination */}
                <div className="flex flex-wrap items-center justify-end gap-4 p-4">
                  <p className="w-full grow text-center text-sm sm:w-auto sm:text-left">
                    Page {summary.page} of {summary.totalPages}
                  </p>

                  {navigation.state === "loading" && (
                    <Loader2 className="hidden size-8 shrink-0 animate-spin text-primary sm:block" />
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="grow gap-1 sm:grow-0"
                    disabled={summary.page === 1}
                    onClick={() => setPage(summary.page - 1)}
                  >
                    <ChevronLeft className="size-4" />
                    <span>Previous</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="grow gap-1 sm:grow-0"
                    disabled={summary.page === summary.totalPages}
                    onClick={() => setPage(summary.page + 1)}
                  >
                    <span>Next</span>
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </Card>

      <Outlet />
    </>
  );
}
