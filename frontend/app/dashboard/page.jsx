"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push("/sign-in");
        return;
      }

      const role = user?.publicMetadata?.role;

      if (role === "admin") {
        router.push("/admin");
      }
      if (role === "RFIDTagging") {
        router.push("/rfid");
      }
      if (role === "FilePreparation") {
        router.push("/file-preparation");
      }
      if (role === "Numbering") {
        router.push("/numbering");
      }

      if (role === "Scanning") {
        router.push("/scanning");
      }
      if (role === "Quality") {
        router.push("/quality");
      }
      if (role === "FinalReview") {
        router.push("/final-review");
      }
      if (role === "Metadata") {
        router.push("/metadata");
      }
      if (role === "DepartmentUser") {
        router.push("/department");
      }
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) return <div>Loading...</div>;

  return <div>User Dashboard</div>;
}
