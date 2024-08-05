import * as React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { getVehicle } from "../api";
import { Separator } from "../components/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/sheet";
import type { Vehicle } from "../types";
import { getColorName, getWebColor } from "../utils/color";
import { formatCurrency, formatNumber } from "../utils/intl";
import { privateLoader } from "../utils/private-loader";

function Detail(props: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <>
      <dt className="font-semibold text-muted-foreground">{props.label}</dt>
      <dd className="mb-4">{props.value}</dd>
    </>
  );
}

Details.loader = privateLoader(async ({ params }) => {
  const vehicle = await getVehicle(params.id as string);
  return vehicle;
});

// TODO: use defer
export function Details() {
  const vehicle = useLoaderData() as Vehicle;
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();

  return (
    <Sheet
      open={open}
      onOpenChange={() => {
        setOpen(false);
        setTimeout(() => navigate(-1), 150);
      }}
    >
      <SheetContent aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle>{vehicle.vrm}</SheetTitle>
        </SheetHeader>

        <dl className="mt-6 text-sm">
          <Detail label="Manufacturer" value={vehicle.manufacturer} />
          <Detail label="Model" value={vehicle.model} />
          <Detail label="Type" value={vehicle.type} />
          <Detail label="Fuel" value={vehicle.fuel} />
          <Detail
            label="Color"
            value={
              <div className="flex items-center gap-1.5">
                <div
                  className="size-4 shrink-0 rounded-full border"
                  style={{ backgroundColor: getWebColor(vehicle.color) }}
                />
                <span>{getColorName(vehicle.color)}</span>
              </div>
            }
          />
          <Detail label="Mileage" value={formatNumber(vehicle.mileage)} />
          <Detail
            label="Price"
            value={formatCurrency(parseInt(vehicle.price, 10), {
              minimumFractionDigits: 0,
            })}
          />
          <Detail
            label="Registration date"
            value={new Intl.DateTimeFormat("en-GB", {
              dateStyle: "long",
            }).format(new Date(vehicle.registrationDate))}
          />
          <Detail label="VIN" value={vehicle.vin} />
        </dl>
      </SheetContent>
    </Sheet>
  );
}
