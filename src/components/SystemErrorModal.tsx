import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface SystemErrorModalProps {
  message: string;
  onClose: () => void;
}

export function SystemErrorModal({ message, onClose }: SystemErrorModalProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-100 p-4 backdrop-blur-md">
      <div className="glass-error max-w-md w-full p-6 rounded-lg relative overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)] border border-red-500/30">
        {/* Background Glitch Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-full h-1 bg-red-500/20 animate-pulse" />

        <div className="flex flex-col items-center text-center gap-4 relative z-10">
          <div className="bg-red-500/20 p-4 rounded-full border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-bounce">
            <AlertTriangle className="text-red-500" size={40} />
          </div>

          <div className="space-y-2">
            <h2
              className="text-red-500 font-mono font-black text-2xl tracking-[0.2em] uppercase glitch-text"
              data-text="SYSTEM ERROR"
            >
              SYSTEM ERROR
            </h2>
            <div className="h-0.5 w-full bg-linear-to-r from-transparent via-red-500/50 to-transparent" />
            <p className="text-gray-300 font-mono text-sm leading-relaxed mt-4">
              {message}
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full py-2 bg-red-500/10 border border-red-500/50 hover:bg-red-500/30 text-red-500 font-mono text-xs font-bold uppercase tracking-[0.3em] transition-all duration-300 rounded hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] group"
          >
            <span
              className="group-hover:glitch-text"
              data-text="[ TERMINATE_ERROR_LOG ]"
            >
              [ TERMINATE_ERROR_LOG ]
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
