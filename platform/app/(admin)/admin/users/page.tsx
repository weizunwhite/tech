import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  BookOpen,
  UserCheck,
  Mail,
  Calendar,
} from "lucide-react";

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  student: { label: "学生", color: "text-green-600 border-green-300", icon: GraduationCap },
  teacher: { label: "教师", color: "text-purple-600 border-purple-300", icon: BookOpen },
  parent: { label: "家长", color: "text-orange-600 border-orange-300", icon: UserCheck },
  admin: { label: "管理员", color: "text-red-600 border-red-300", icon: UserCheck },
};

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  // Group users by role
  const grouped: Record<string, NonNullable<typeof users>> = {};
  (users || []).forEach((u) => {
    const role = u.role || "student";
    if (!grouped[role]) grouped[role] = [];
    grouped[role].push(u);
  });

  const roleOrder = ["admin", "teacher", "parent", "student"];
  const sortedRoles = roleOrder.filter((r) => grouped[r]?.length);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">用户管理</h1>
          <p className="text-muted-foreground mt-1">
            管理平台上所有注册用户
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          共 {users?.length || 0} 名用户
        </div>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {roleOrder.map((role) => {
          const config = ROLE_CONFIG[role];
          const count = grouped[role]?.length || 0;
          const Icon = config.icon;
          return (
            <Card key={role}>
              <CardContent className="flex items-center gap-3 py-3">
                <Icon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-lg font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{config.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* User list grouped by role */}
      {sortedRoles.length > 0 ? (
        <div className="space-y-8">
          {sortedRoles.map((role) => {
            const config = ROLE_CONFIG[role];
            const roleUsers = grouped[role];
            return (
              <div key={role}>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  {config.label}
                  <Badge variant="secondary">{roleUsers.length}</Badge>
                </h2>
                <div className="grid gap-3">
                  {roleUsers.map((u) => (
                    <Card key={u.id}>
                      <CardContent className="flex items-center gap-4 py-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-sm font-medium text-primary">
                            {u.name?.slice(0, 1) || "?"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{u.name || "未知"}</p>
                            <Badge variant="outline" className={config.color}>
                              {config.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {u.email}
                            </span>
                            {u.grade && (
                              <span>{u.grade}年级</span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(u.created_at).toLocaleDateString("zh-CN")}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <p className="text-muted-foreground">暂无用户</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
