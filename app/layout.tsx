import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import ThemeProvider from "@/components/theme-provider";
import { Toaster } from "sonner";
import QueryClientProvider from "@/components/query-provider";

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
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<QueryClientProvider>
						{children}
						<Toaster position="top-center" richColors />
				</QueryClientProvider>
			</body>
		</html>
	);
}
