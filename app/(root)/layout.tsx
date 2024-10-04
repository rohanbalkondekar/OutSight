import type { Metadata } from "next";
import "../../styles/globals.css";

// Metadata for the app
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
      <head>
        {/* Import the Source Serif 4 font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Source Serif 4', serif" }}>
        {children}
      </body>
    </html>
  );
}



