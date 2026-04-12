import { redirect } from "next/navigation";
import { getUserRole } from "../../lib/getRole";

export default async function AdminPage() {
  const role = await getUserRole();

  if (role !== "admin") {
    return redirect("/dashboard");
  }

  return <div className="p-10">Admin Dashboard</div>;
}
