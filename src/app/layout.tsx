import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KAVRO — AI Business Workspace",
  description: "Work smarter. Operate better. Grow faster. The premium AI workspace for founders, consultants, and enterprise teams.",
  keywords: ["AI Workspace", "Business Intelligence", "Document Generation", "Workflow Automation", "AI SaaS"],
  authors: [{ name: "KAVRO Inc." }],
  openGraph: {
    title: "KAVRO — AI Business Workspace",
    description: "Work smarter. Operate better. Grow faster. The premium AI workspace for founders, consultants, and enterprise teams.",
    type: "website",
    locale: "en_US",
    siteName: "KAVRO",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B0F19] text-slate-100 antialiased selection:bg-primary-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
