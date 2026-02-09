import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptVault",
  description: "Secure, local-first prompt management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-mono bg-gray-950 text-gray-100" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
