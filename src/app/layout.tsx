import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muara AI - Muara V1 Flash API Portal",
  description: "Portal resmi API AI komunitas Muara AI. Dapatkan API key, pantau kuota, dan gunakan model Muara V1 Flash.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-void text-bone antialiased">{children}</body>
    </html>
  );
}
