"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { Terminal } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Artificial delay for "init" vibe
    const timer = setTimeout(() => {
      router.push("/vault");
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-(--bg-page) text-(--text-primary) font-mono">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <Terminal size={48} />
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl font-bold tracking-[0.2em]">
            INITIALIZING_BUNKER
          </span>
          <span className="text-xs opacity-50 uppercase tracking-widest">
            Loading Sector [01] VAULT
          </span>
        </div>
      </div>

      {/* Loading Progress Bar */}
      <div className="mt-8 w-64 h-1 bg-(--bg-surface) rounded-full overflow-hidden">
        <div className="h-full bg-(--acc-primary) animate-[loading_1.5s_ease-in-out_infinite]" />
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
