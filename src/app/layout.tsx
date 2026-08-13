import type { Metadata } from "next";
import "./globals.css";
import "./lib/envSetup";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next"

const siteDescription =
  "Practice live technical interviews with an adaptive AI interviewer that talks with you, watches you code, runs your solution, and gives instant feedback."

export const metadata: Metadata = {
  metadataBase: new URL("https://shadows.sh"),
  title: {
    default: "Shadows — AI Technical Phone Screens for Software Engineers",
    template: "%s | Shadows",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    url: "https://shadows.sh",
    title: "Shadows — AI Technical Phone Screens for Software Engineers",
    description: siteDescription,
    siteName: "Shadows",
    images: [
      {
        url: "/meta.png",
        width: 3840,
        height: 2160,
        alt: "Shadows — live AI coding interviews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shadows — AI Technical Phone Screens for Software Engineers",
    description: siteDescription,
    images: ["/meta.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Shadows",
  url: "https://shadows.sh",
  logo: "https://shadows.sh/favicon.svg",
  description: "AI technical phone screens for software engineers",
  sameAs: ["https://github.com/Tatsatbh/shadows"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers>
          {children}
          <Analytics />
          </Providers>
        <Toaster />
      </body>
    </html>
  );
}
