import type { MetadataRoute } from "next";

const siteUrl = "https://idcare19.me";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin", "/admin/", "/maintenance", "/login", "/*?*utm_*"],
      },
      // Search crawlers may discover public pages; private application routes stay closed.
      { userAgent: ["Googlebot", "Bingbot"], allow: "/", disallow: ["/api/", "/admin", "/admin/", "/login"] },
      // Search fetchers and model-training crawlers are separate controls.
      { userAgent: ["OAI-SearchBot", "ChatGPT-User", "GPTBot", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended"], allow: "/", disallow: ["/api/", "/admin", "/admin/"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
