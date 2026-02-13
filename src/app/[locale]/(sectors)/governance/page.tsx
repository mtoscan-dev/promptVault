import { useTranslations } from "next-intl";

export default function GovernancePage() {
  const t = useTranslations("Common");

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 font-mono">
      <div className="max-w-2xl w-full border border-(--border-primary) bg-(--bg-surface)/30 backdrop-blur-md p-12 rounded-lg relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-fuchsia-500" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-fuchsia-500" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-fuchsia-500" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-fuchsia-500" />

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-fuchsia-500 rounded-sm animate-pulse" />
            <h1 className="text-2xl font-bold tracking-tighter text-(--text-primary)">
              [04] GOVERNANCE_BOARD
            </h1>
          </div>

          <div className="space-y-4 text-(--text-secondary) leading-relaxed">
            <p className="text-sm">
              <span className="text-fuchsia-500">POLICY_STATUS:</span> READ_ONLY
            </p>
            <p className="text-sm">
              <span className="text-fuchsia-500">COMPLIANCE:</span> VERIFIED
            </p>
            <p className="mt-8 text-xs opacity-50 uppercase tracking-widest">
              Rules library and ethical governance framework coming soon...
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-(--border-primary)/30">
            <div className="flex gap-2">
              <div className="h-1 flex-1 bg-fuchsia-500/20" />
              <div className="h-1 w-12 bg-fuchsia-500/50" />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(217,70,239,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.03)_1px,transparent_1px)] bg-size-[20px_20px]" />
      </div>
    </div>
  );
}
