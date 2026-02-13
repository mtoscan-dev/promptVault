import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Estrategia de Soberanía Digital: Modo Standalone para 8GB de RAM
  output: "standalone",

  // El nombre correcto y estable es este:
  serverExternalPackages: ["drizzle-orm"],

  // Optimización de peso de build para ahorrar recursos en la Patagonia
  productionBrowserSourceMaps: false,
};

export default withNextIntl(nextConfig);
