import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Bot } from "lucide-react"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND || "https://accuia.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(frontendUrl),
  title: {
    default: "Accuia - Chat with Your Database | AI-Powered Database Intelligence",
    template: "%s | Accuia",
  },
  description:
    "Transform complex data into simple conversations. Search, explore, and interact with your product catalog using natural language — no SQL required. Connect your PostgreSQL database in seconds.",
  keywords:
    "AI database, natural language database, PostgreSQL chat, database intelligence, conversational AI, SQL generator, database search, data analytics, ecommerce database, product discovery",
  authors: [{ name: "Accuia Team" }],
  creator: "Accuia",
  publisher: "Accuia",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: frontendUrl,
    title: "Accuia - Chat with Your Database | AI-Powered Database Intelligence",
    description:
      "Transform complex data into simple conversations. Search, explore, and interact with your product catalog using natural language — no SQL required.",
    siteName: "Accuia",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Accuia - AI-Powered Database Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accuia - Chat with Your Database | AI-Powered Database Intelligence",
    description:
      "Transform complex data into simple conversations. Search, explore, and interact with your product catalog using natural language — no SQL required.",
    images: ["/og-image.jpg"],
    creator: "@accuia",
  },
  alternates: {
    canonical: frontendUrl,
  },
  verification: {
    google: "your-google-verification-code",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#0AF395" }],
  },
  manifest: "/site.webmanifest",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0AF395" />
        <meta name="msapplication-TileColor" content="#0AF395" />
      </head>
      <body className={inter.className}>
        <div className="flex items-center space-x-2 sr-only">
          <Bot className="w-4 h-4 text-[#0B2420]" />
          <span>Accuia - Chat with Your Database</span>
        </div>
        <Suspense>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
