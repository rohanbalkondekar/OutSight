import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import Topbar from "../components/Topbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next Gen AI Consultants",
  description: "Outsight is building the Next Generation of AI Consultants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Topbar/>
        {children}</body>
    </html>
  );
}
