// app/sign-in/[[...sign-in]]/page.jsx

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  const { userId } = auth();

  // ✅ SERVER SIDE redirect → NO flicker
  if (userId) {
    redirect("/dashboard");
  }

  return <SignIn />;
}
