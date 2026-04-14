import { SignUp } from "@clerk/nextjs";

export default function Page() {
  if (userId) redirect("/dashboard");

  return <SignUp />;
}
