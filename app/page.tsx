import type { Metadata } from "next"
import LandingPageClient from "./LandingPageClient"

const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND || "https://accuia.vercel.app";

export const metadata: Metadata = {
  title: "Accuia - Chat with Your Database | AI-Powered Database Intelligence",
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
}

export default function LandingPage() {
  return <LandingPageClient />
}
