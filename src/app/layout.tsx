import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Virvel Analytics — E-commerce Dashboard",
  description:
    "Dashboard de análise de funil e-commerce com dados do GA4 e insights de IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
