import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muara AI - Muara V1 Flash API Portal",
  description: "Portal resmi API AI komunitas Muara AI. Dapatkan API key, pantau kuota, dan gunakan model Muara V1 Flash.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07070b" },
    { media: "(prefers-color-scheme: light)", color: "#fafafc" },
  ],
};

// Runs before first paint so the saved (or system) theme never flashes.
const themeScript = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-canvas text-ink antialiased">{children}</body>
    </html>
  );
}
