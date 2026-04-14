import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const role = user?.publicMetadata?.role;

  switch (role) {
    case "admin":
      redirect("/admin");
    case "RFIDTagging":
      redirect("/rfid");
    case "FilePreparation":
      redirect("/file-preparation");
    case "Numbering":
      redirect("/numbering");
    case "Scanning":
      redirect("/scanning");
    case "Quality":
      redirect("/quality");
    case "FinalReview":
      redirect("/final-review");
    case "Metadata":
      redirect("/metadata");
    case "DepartmentUser":
      redirect("/department");
    default:
      redirect("/");
  }
}
