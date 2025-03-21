import type { Metadata } from "next";
import "./globals.css";
import { Space_Mono } from 'next/font/google';

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
				{children}
			</body>
		</html>
	);
}
