import type { Metadata } from "next";
import "./globals.css";
import { Space_Mono } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import PrivyWrapper from "@/components/privy-wrapper";

const font = Space_Mono({
	subsets: ["latin"],
	weight: "400",
});

export const metadata: Metadata = {
	title: "enklave.xyz",
	description: "the platform for creator economies",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${font.className} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<PrivyWrapper>
						<main>
							{children}
						</main>
					</PrivyWrapper>
				</ThemeProvider>
			</body>
		</html>
	);
}
