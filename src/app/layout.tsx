import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agnos Patient Form",
  description: "Real-time patient input form and staff view system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="antialiased">{children}</body>
    </html>
  );
}
