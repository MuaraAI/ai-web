import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muara AI - Muara V1 Flash API Portal",
  description: "Portal resmi API AI komunitas Muara AI. Dapatkan API key, pantau kuota, dan gunakan model Muara V1 Flash.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#eef1f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-background text-text antialiased selection:bg-accent selection:text-accent-dark relative min-h-screen">
        {/* Ambient floating glass blobs & grid overlay */}
        <div className="ambient-bg" aria-hidden="true">
          <div className="ambient-blob ambient-blob-1" />
          <div className="ambient-blob ambient-blob-2" />
          <div className="ambient-blob ambient-blob-3" />
          <div className="grid-overlay" />
        </div>

        {children}
      </body>
    </html>
  );
}
