import { useForm } from "react-hook-form";
import type { ActionFunctionArgs } from "react-router-dom";
import { Link, redirect, useLoaderData, useSubmit } from "react-router-dom";
import {
  createVehicle,
  getColors,
  getManufacturers,
  getModels,
  getTypes,
} from "../api";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/breadcrumb";
import { Button } from "../components/button";
import { Card, CardContent, CardFooter } from "../components/card";
import { FormError } from "../components/form-error";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Select } from "../components/select";
import { Separator } from "../components/separator";
import { getColorName } from "../lib/color";
import { privateLoader } from "../lib/private-loader";

export const loader = privateLoader(async () => {
  const [manufacturers, models, types, colors] = await Promise.all([
    getManufacturers(),
    getModels(),
    getTypes(),
    getColors(),
  ]);
  return { manufacturers, models, types, colors };
});

type AddFormData = {
  vrm: string;
  manufacturer: string;
  model: string;
  type: string;
  color: string;
  fuel: string;
  mileage: number;
  registrationDate: string;
  vin: string;
  price: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const data = (await request.json()) as AddFormData;
  const vehicle = await createVehicle(data);
  return redirect(`/vehicles/${vehicle.id}`);
}

export function Component() {
  const { manufacturers, models, types, colors } = useLoaderData() as {
    manufacturers: Array<string>;
    models: Array<string>;
    types: Array<string>;
    colors: Array<string>;
  };
  const submit = useSubmit();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddFormData>();

  return (
    <>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink to="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Vehicle</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <form
        onSubmit={handleSubmit((data) => {
          submit(data, { method: "post", encType: "application/json" });
        })}
      >
        <Card>
          <CardContent className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* VRM */}
            <div className="space-y-1">
              <Label htmlFor="vrm">Registration number</Label>
              <Input
                id="vrm"
                type="text"
                {...register("vrm", {
                  required: "Please enter the registration number",
                })}
              />
              {errors.vrm && <FormError>{errors.vrm.message}</FormError>}
            </div>

            <Separator className="col-span-full" />

            {/* Manufacturer */}
            <div className="col-start-1 space-y-1">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Select
                id="manufacturer"
                defaultValue=""
                {...register("manufacturer", {
                  required: "Please select a manufacturer",
                })}
              >
                <option value="" disabled>
                  Select a manufacturer
                </option>
                {manufacturers.map((manufacturer) => (
                  <option key={manufacturer}>{manufacturer}</option>
                ))}
              </Select>
              {errors.manufacturer && (
                <FormError>{errors.manufacturer.message}</FormError>
              )}
            </div>

            {/* Model */}
            <div className="space-y-1">
              <Label htmlFor="model">Model</Label>
              <Select
                id="model"
                defaultValue=""
                {...register("model", {
                  required: "Please select a model",
                })}
              >
                <option value="" disabled>
                  Select a model
                </option>
                {models.map((model) => (
                  <option key={model}>{model}</option>
                ))}
              </Select>
              {errors.model && <FormError>{errors.model.message}</FormError>}
            </div>

            {/* Type */}
            <div className="space-y-1">
              <Label htmlFor="type">Type</Label>
              <Select
                id="type"
                defaultValue=""
                {...register("type", {
                  required: "Please select a type",
                })}
              >
                <option value="" disabled>
                  Select a type
                </option>
                {types.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </Select>
              {errors.type && <FormError>{errors.type.message}</FormError>}
            </div>

            {/* Color */}
            <div className="space-y-1">
              <Label htmlFor="color">Colour</Label>
              <Select
                id="color"
                defaultValue=""
                {...register("color", {
                  required: "Please select a colour",
                })}
              >
                <option value="" disabled>
                  Select a colour
                </option>
                {colors.map((color) => (
                  <option key={color}>{getColorName(color)}</option>
                ))}
              </Select>
              {errors.color && <FormError>{errors.color.message}</FormError>}
            </div>

            {/* Fuel type */}
            <div className="space-y-1">
              <Label htmlFor="fuel">Fuel</Label>
              <Select
                id="fuel"
                defaultValue=""
                {...register("fuel", {
                  required: "Please select a fuel type",
                })}
              >
                <option value="" disabled>
                  Select a fuel type
                </option>
                <option value="Gasoline">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </Select>
              {errors.fuel && <FormError>{errors.fuel.message}</FormError>}
            </div>

            {/* Mileage */}
            <div className="space-y-1">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                inputMode="numeric"
                {...register("mileage", {
                  required: "Please enter the mileage",
                  valueAsNumber: true,
                })}
              />
              {errors.mileage && (
                <FormError>{errors.mileage.message}</FormError>
              )}
            </div>

            {/* Registration date */}
            <div className="space-y-1">
              <Label htmlFor="registrationDate">Registration date</Label>
              <Input
                id="registrationDate"
                type="date"
                {...register("registrationDate", {
                  required: "Please enter the registration date",
                })}
              />
              {errors.registrationDate && (
                <FormError>{errors.registrationDate.message}</FormError>
              )}
            </div>

            {/* VIN */}
            <div className="space-y-1">
              <Label htmlFor="vin">VIN</Label>
              <Input
                id="vin"
                type="text"
                {...register("vin", { required: "Please enter the VIN" })}
              />
              {errors.vin && <FormError>{errors.vin.message}</FormError>}
            </div>

            {/* Price */}
            <div className="space-y-1">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="text"
                inputMode="numeric"
                {...register("price", {
                  required: "Please enter the price",
                  pattern: {
                    value: /^\d*$/,
                    message: "Only whole numbers are allowed",
                  },
                })}
              />
              {errors.price && <FormError>{errors.price.message}</FormError>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link to="/">Cancel</Link>
            </Button>
            <Button type="submit">Add</Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
Component.displayName = "Add";
