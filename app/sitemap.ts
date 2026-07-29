import type { MetadataRoute } from "next";
import { withBasePath } from "@/lib/base-path";
import { properties } from "@/lib/site";

export const dynamic = "force-static";

const baseUrl = `https://auto-cutter.com${withBasePath("")}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/strutture", "/verona", "/chi-siamo", "/contatti"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  const propertyRoutes = properties.map((property) => ({
    url: `${baseUrl}/strutture/${property.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...propertyRoutes];
}
