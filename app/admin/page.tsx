// app/admin/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import AdminPanel from "../components/AdminPanel"; // ✅ import the component
import { allowedEmails } from "@/lib/constants";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || !allowedEmails.includes(session.user?.email || "")) {
    redirect("/login");
  }


  return <AdminPanel />;
}
