import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { deleteVehicle } from "../api";

Destroy.action = async ({ params }: ActionFunctionArgs) => {
  await deleteVehicle(params.id as string);
  return redirect("/vehicles");
};

export function Destroy() {
  return null;
}
