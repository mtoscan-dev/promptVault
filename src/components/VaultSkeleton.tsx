import { Terminal } from "lucide-react";

export function VaultSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-[180px] bg-black/20 border border-white/5 rounded p-4 flex flex-col gap-3"
        >
          <div className="flex justify-between items-start">
            <div className="h-5 w-1/3 bg-white/10 rounded" />
            <div className="h-4 w-4 bg-white/10 rounded" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="h-3 w-3/4 bg-white/5 rounded" />
            <div className="h-3 w-1/2 bg-white/5 rounded" />
          </div>
          <div className="flex gap-2 mt-auto">
            <div className="h-5 w-12 bg-white/5 rounded" />
            <div className="h-5 w-16 bg-white/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
