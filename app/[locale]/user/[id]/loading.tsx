import Topbar from "@/components/Topbar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col">
      <Topbar />

      <div className="flex flex-1 justify-center px-10 py-20">
        <Card className="relative w-full max-w-5xl overflow-hidden py-0">
          {/* Banner */}
          <Skeleton className="h-56 w-full rounded-none" />

          {/* Avatar */}
          <div className="absolute right-10 top-50">
            <Skeleton className="w-40 h-40 rounded-full border-2" />
          </div>

          {/* Content */}
          <div className="px-10 pb-10 pt-24 flex flex-col gap-6">
            {/* Name */}
            <div className="flex flex-col gap-2 max-w-md">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-6 text-sm max-w-2xl">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
