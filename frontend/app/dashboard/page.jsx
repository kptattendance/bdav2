"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }

    const role = user?.publicMetadata?.role;

    switch (role) {
      case "admin":
        router.replace("/admin");
        break;
      case "RFIDTagging":
        router.replace("/rfid");
        break;
      case "FilePreparation":
        router.replace("/file-preparation");
        break;
      case "Numbering":
        router.replace("/numbering");
        break;
      case "Scanning":
        router.replace("/scanning");
        break;
      case "Quality":
        router.replace("/quality");
        break;
      case "FinalReview":
        router.replace("/final-review");
        break;
      case "Metadata":
        router.replace("/metadata");
        break;
      case "DepartmentUser":
        router.replace("/department");
        break;
      default:
        router.replace("/");
    }
  }, [isLoaded, isSignedIn, user]);

  return <div>Redirecting...</div>;
}
