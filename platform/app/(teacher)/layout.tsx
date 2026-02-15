import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";

export default async function TeacherLayout({
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
  if (role !== "teacher") {
    redirect("/dashboard");
  }

  const userName = user.user_metadata?.name || user.email?.split("@")[0] || "教师";

  return (
    <div className="min-h-screen bg-background">
      <Navbar userName={userName} role="teacher" />
      <main>{children}</main>
    </div>
  );
}
