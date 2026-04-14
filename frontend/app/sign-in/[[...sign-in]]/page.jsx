import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  const { userId } = auth();

  // 🔥 If already logged in → redirect
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignIn />
    </div>
  );
}
