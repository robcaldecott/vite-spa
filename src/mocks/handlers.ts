import { fakerEN_GB as faker } from "@faker-js/faker";
import type { DefaultBodyType, PathParams } from "msw";
import { delay, http, HttpResponse } from "msw";
import type {
  Chart,
  Session,
  Summary,
  User,
  Vehicle,
  VehicleList,
} from "../types";

const user: User = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  avatar: faker.image.avatarGitHub(),
};

const vehicleCount = faker.number.int({ min: 75, max: 125 });

// Generate vehicle mocks
const vehicles: Array<Vehicle> = [...Array(vehicleCount).keys()].map(() => ({
  id: faker.string.uuid(),
  vrm: faker.vehicle.vrm(),
  manufacturer: faker.vehicle.manufacturer(),
  model: faker.vehicle.model(),
  type: faker.vehicle.type(),
  fuel: faker.vehicle.fuel(),
  color: faker.vehicle.color(),
  vin: faker.vehicle.vin(),
  mileage: faker.number.int({ min: 1000, max: 25000 }),
  registrationDate: faker.date.past({ years: 10 }).toISOString().split("T")[0],
  price: faker.commerce.price({ min: 2000, max: 50000 }),
}));

export const handlers = [
  http.post<PathParams, DefaultBodyType, Session>(
    `${import.meta.env.VITE_API_URL}/api/login`,
    async () => {
      await delay();

      return HttpResponse.json({ token: faker.string.uuid() });
    },
  ),

  http.get<PathParams, DefaultBodyType, User>(
    `${import.meta.env.VITE_API_URL}/api/me`,
    async () => {
      await delay();

      return HttpResponse.json(user);
    },
  ),

  http.get<PathParams, DefaultBodyType, Summary>(
    `${import.meta.env.VITE_API_URL}/api/summary`,
    async () => {
      await delay();

      return HttpResponse.json({
        count: vehicles.length,
        oems: new Set(vehicles.map((vehicle) => vehicle.manufacturer)).size,
        value: vehicles.reduce(
          (total, vehicle) => total + Number(vehicle.price),
          0,
        ),
      });
    },
  ),

  http.get<PathParams, DefaultBodyType, Array<Chart>>(
    `${import.meta.env.VITE_API_URL}/api/chart`,
    async ({ request }) => {
      await delay();

      const url = new URL(request.url);
      const type = url.searchParams.get("type");

      if (type === "FUEL_TYPE") {
        return HttpResponse.json([
          {
            key: "petrol",
            value: vehicles.filter((v) => v.fuel === "Gasoline").length,
          },
          {
            key: "diesel",
            value: vehicles.filter((v) => v.fuel === "Diesel").length,
          },
          {
            key: "hybrid",
            value: vehicles.filter((v) => v.fuel === "Hybrid").length,
          },
          {
            key: "electric",
            value: vehicles.filter((v) => v.fuel === "Electric").length,
          },
        ]);
      }

      if (type === "OEM") {
        // Build a list of unique manufacturers
        const oems: Record<string, number> = {};

        for (let i = 0; i < vehicles.length; i++) {
          const vehicle = vehicles[i];
          if (typeof oems[vehicle.manufacturer] === "undefined") {
            oems[vehicle.manufacturer] = 1;
          } else {
            oems[vehicle.manufacturer]++;
          }
        }

        // Convert the object to an array
        return HttpResponse.json(
          Object.entries(oems)
            .map(([key, value]) => ({ key, value }))
            .sort((a, b) => a.key.localeCompare(b.key)),
        );
      }

      if (type === "REGISTRATION_YEAR") {
        // Find the earliest year
        const minYear = Math.min(
          ...vehicles.map((v) => new Date(v.registrationDate).getFullYear()),
        );

        // Create a map of year > count
        const years: Record<number, number> = {};
        const thisYear = new Date().getFullYear();
        for (let i = minYear; i <= thisYear; i++) {
          years[i] = 0;
        }

        // Count the number of vehicles per year
        for (let i = 0; i < vehicles.length; i++) {
          const vehicle = vehicles[i];
          const year = new Date(vehicle.registrationDate).getFullYear();
          if (typeof years[year] === "undefined") {
            years[year] = 1;
          } else {
            years[year]++;
          }
        }

        return HttpResponse.json(
          Object.entries(years)
            .map(([key, value]) => ({ key, value }))
            .sort((a, b) => a.key.localeCompare(b.key)),
        );
      }

      return HttpResponse.json([]);
    },
  ),

  http.get<PathParams, DefaultBodyType, VehicleList>(
    `${import.meta.env.VITE_API_URL}/api/vehicles`,
    async ({ request }) => {
      await delay();

      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page"));
      const pageSize = 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const q = url.searchParams.get("q");

      // Filter the results
      const filtered = vehicles.filter((vehicle) => {
        if (q) {
          if (vehicle.manufacturer.toLowerCase().includes(q.toLowerCase())) {
            return true;
          }
          if (vehicle.model.toLowerCase().includes(q.toLowerCase())) {
            return true;
          }
          if (vehicle.type.toLowerCase().includes(q.toLowerCase())) {
            return true;
          }
          return false;
        }
        return true;
      });

      return HttpResponse.json({
        summary: {
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / pageSize),
          page,
          pageSize,
        },
        vehicles: filtered.slice(start, end),
      });
    },
  ),
];
