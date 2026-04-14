"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      router.replace("/dashboard"); // 🔥 redirect to dashboard
    } else {
      router.replace("/sign-in"); // optional
    }
  }, [isLoaded, isSignedIn]);

  return <div>Loading...</div>;
}
