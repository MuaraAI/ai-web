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
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
};

// Runs before first paint: applies the saved (or system) theme so there is no flash,
// and arms scroll motion unless the reader prefers reduced motion. If scripts never
// hydrate, motion disarms itself so hidden content still shows.
const prePaint = `(function(){var d=document.documentElement;var t;try{t=localStorage.getItem("muara-theme")}catch(e){}
if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}
d.setAttribute("data-theme",t);
if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){d.setAttribute("data-motion","");
setTimeout(function(){if(!window.__muaraMotion)d.removeAttribute("data-motion")},4000)}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prePaint }} />
      </head>
      <body className="min-h-screen bg-void text-bone antialiased">{children}</body>
    </html>
  );
}
