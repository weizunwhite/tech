import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted rounded mt-2" />
        </div>
        <div className="h-10 w-28 bg-muted rounded" />
      </div>
      {[1, 2].map((i) => (
        <Card key={i} className="mb-4">
          <CardHeader>
            <div className="h-6 w-40 bg-muted rounded" />
            <div className="h-4 w-60 bg-muted rounded mt-2" />
          </CardHeader>
          <CardContent>
            <div className="h-2 w-full bg-muted rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StepSkeleton() {
  return (
    <div className="flex-1 flex overflow-hidden animate-pulse">
      <div className="flex-1 flex flex-col p-4">
        <div className="flex-1 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 bg-muted rounded-full shrink-0" />
              <div className="h-16 flex-1 bg-muted rounded-lg" />
            </div>
          ))}
        </div>
        <div className="h-12 bg-muted rounded-lg mt-4" />
      </div>
      <div className="w-96 border-l bg-card p-4 hidden lg:block">
        <div className="h-6 w-32 bg-muted rounded mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-muted rounded-lg mb-3" />
        ))}
      </div>
    </div>
  );
}

export function ProjectSkeleton() {
  return (
    <div className="p-6 max-w-4xl mx-auto animate-pulse">
      <div className="h-8 w-60 bg-muted rounded mb-2" />
      <div className="h-4 w-40 bg-muted rounded mb-8" />
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardContent className="py-6">
              <div className="h-6 w-48 bg-muted rounded mb-2" />
              <div className="h-4 w-full bg-muted rounded mb-4" />
              <div className="h-10 w-28 bg-muted rounded" />
            </CardContent>
          </Card>
        </div>
        <div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1">
                  <div className="h-4 w-20 bg-muted rounded" />
                  <div className="h-3 w-32 bg-muted rounded mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
