import { redirect } from "next/navigation";
import { getUserRole } from "../lib/getRole";

export default async function Dashboard() {
  const role = await getUserRole();
  if (role === "admin") redirect("/admin");
  if (role === "officer") redirect("/officer");
  if (role === "staff") redirect("/staff");

  redirect("/citizen");
}
