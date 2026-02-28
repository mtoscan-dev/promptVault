"use client";

import { Link, usePathname } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";

const SECTORS = [
  {
    id: "01",
    name: "VAULT",
    path: "/vault",
    color: "var(--sector-vault, #22c55e)",
  },
];

export function BunkerHUD() {
  const pathname = usePathname();
  const t = useTranslations("Common");

  return (
    <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
      {SECTORS.map((sector) => {
        const isActive = pathname === "/" || pathname.includes(sector.path);

        return (
          <Link
            key={sector.id}
            href={sector.path}
            className={cn(
              "group relative flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono transition-all duration-300",
              isActive
                ? "text-(--text-primary)"
                : "text-(--text-secondary) hover:text-(--text-primary)",
            )}
          >
            {/* Sector ID */}
            <span
              className={cn(
                "opacity-50 group-hover:opacity-100 transition-opacity",
                isActive && "opacity-100 font-bold",
              )}
              style={{ color: isActive ? sector.color : undefined }}
            >
              [{sector.id}]
            </span>

            {/* Sector Name */}
            <span className="tracking-tighter hidden sm:inline whitespace-nowrap">
              {sector.name}
            </span>

            {/* Active Indicator */}
            {isActive && (
              <motion.div
                layoutId="hud-active"
                className="absolute inset-0 border-b-2"
                style={{ borderColor: sector.color }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}

            {/* Glitch Glow Overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
              style={{ backgroundColor: sector.color }}
            />
          </Link>
        );
      })}
    </nav>
  );
}
