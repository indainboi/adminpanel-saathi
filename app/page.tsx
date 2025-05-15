import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function HomeRedirectPage() {
  const session = await getServerSession(authOptions);

  if (session && session.user?.email) {
    redirect("/admin"); // redirect authenticated users to admin
  }

  redirect("/login"); // otherwise, go to login
}
