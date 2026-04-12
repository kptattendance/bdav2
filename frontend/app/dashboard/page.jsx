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
      if (role === "staff") {
        router.push("/staff");
      }
      if (role === "citizen") {
        router.push("/citizen");
      }
      if (role === "officer") {
        router.push("/officer");
      }
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) return <div>Loading...</div>;

  return <div>User Dashboard</div>;
}
