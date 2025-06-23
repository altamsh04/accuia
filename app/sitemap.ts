import type { MetadataRoute } from "next"

const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND || "https://accuia.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: frontendUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: frontendUrl + "/login",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: frontendUrl + "/signup",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: frontendUrl + "/dashboard",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ]
}
