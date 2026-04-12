"use client";

import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  return <div>Welcome {user?.firstName || "Guest"}</div>;
}
