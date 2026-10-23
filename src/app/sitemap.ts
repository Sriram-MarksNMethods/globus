import type { MetadataRoute } from "next";
import { site } from "@/content/home";
import { projects } from "@/content/projects";
import { news } from "@/content/pages";

/* sitemap.xml for search engines. New projects and news posts are added automatically. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/homes", "/location", "/about", "/progress", "/news", "/contact", "/career", "/partner-with-us", "/privacy-policy"];

  return [
    ...pages.map((path) => ({ url: `${site.url}${path}` })),
    ...projects.map((project) => ({ url: `${site.url}/projects/${project.slug}` })),
    ...news.posts.map((post) => ({ url: `${site.url}/news/${post.slug}` })),
  ];
}
