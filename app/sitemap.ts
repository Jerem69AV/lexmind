import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://lexmind-tawny.vercel.app";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/research`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/assistant`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/cgu`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/rgpd`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
