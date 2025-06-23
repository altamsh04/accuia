import type { MetadataRoute } from "next"

const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND || "https://accuia.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/"],
    },
    sitemap: frontendUrl + "/sitemap.xml",
  }
}
