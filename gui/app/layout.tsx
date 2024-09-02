import type { Metadata } from "next";

import { Roboto } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Roboto({ subsets: ["latin"], weight: ["400"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex w-screen">
          <Sidebar />
          <main className="w-fit">{children}</main>
        </main>
      </body>
    </html>
  );
}
