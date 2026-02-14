import { getForgeData } from "@/db/queries/forge";
import { ForgeWorkspace } from "@/components/forge/ForgeWorkspace";

export default async function ForgePage() {
  const initialData = await getForgeData();

  return (
    <div className="flex-1 flex flex-col bg-black/20">
      {/* Header Stat Strip (Visual Decoration) */}
      <div className="h-1 w-full bg-linear-to-r from-cyan-500/20 via-amber-500/20 to-fuchsia-500/20" />

      <ForgeWorkspace initialData={initialData} />

      {/* Footer Stat Strip (Visual Decoration) */}
      <div className="h-1 w-full bg-linear-to-r from-fuchsia-500/20 via-amber-500/20 to-cyan-500/20" />
    </div>
  );
}
