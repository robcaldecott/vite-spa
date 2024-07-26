import ky from "ky";
import type {
  Chart,
  Session,
  Summary,
  User,
  Vehicle,
  VehicleList,
} from "./types";

const api = ky.create({ prefixUrl: import.meta.env.VITE_API_URL });

export async function login(email: string, password: string) {
  const user: Session = await api
    .post("/api/login", { json: { email, password } })
    .json();
  return user;
}

export async function getUser() {
  const user: User = await api.get("/api/me").json();
  return user;
}

export async function getSummary() {
  const summary: Summary = await api.get("/api/summary").json();
  return summary;
}

export async function getChartData(
  type: "FUEL_TYPE" | "OEM" | "REGISTRATION_YEAR",
) {
  const chartData: Array<Chart> = await api
    .get("/api/chart", {
      searchParams: { type },
    })
    .json();
  return chartData;
}

export async function getVehicles(page: number, q: string) {
  const vehicles: VehicleList = await api
    .get("/api/vehicles", { searchParams: { page, q } })
    .json();
  return vehicles;
}

export async function getVehicle(id: string) {
  const vehicle: Vehicle = await api.get(`/api/vehicles/${id}`).json();
  return vehicle;
}
