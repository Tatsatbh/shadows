import type { Metadata } from "next";
import "./globals.css";
import "./lib/envSetup";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Shadows",
  description: "AI technical phone screens for software engineers",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Shadows",
    description: "AI technical phone screens for software engineers",
    siteName: "Shadows",
  },
  twitter: {
    title: "Shadows",
    description: "AI technical phone screens for software engineers",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </head>
      <body className={`antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
