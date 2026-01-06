import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AZ-900 Prep | The Obsidian Path",
  description: "Advanced preparation for the Azure Fundamentals exam.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scrollbar-gutter-stable">
      <body className="bg-obsidian text-[#ededed] antialiased">{children}</body>
    </html>
  );
}
