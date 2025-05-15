import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { allowedEmails } from "@/lib/constants";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || !allowedEmails.includes(session.user?.email || "")) {
    redirect("/login");
  }

  return <AdminDashboard />;
}
