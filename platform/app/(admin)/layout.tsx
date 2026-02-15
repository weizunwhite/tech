import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = user.user_metadata?.role;
  if (role !== "admin") {
    redirect("/login");
  }

  const userName = user.user_metadata?.name || "管理员";

  return (
    <div className="min-h-screen bg-background">
      <Navbar userName={userName} role="admin" />
      <main>{children}</main>
    </div>
  );
}
