import { Github, Disc, Youtube, Twitter, Globe, Link as LinkIcon } from 'lucide-react';

export const getSocialIcon = (title) => {
  const lowerTitle = title?.toLowerCase() || "";
  if (lowerTitle.includes('github')) return <Github size={20} />;
  if (lowerTitle.includes('discord')) return <Disc size={20} />;
  if (lowerTitle.includes('youtube')) return <Youtube size={20} />;
  if (lowerTitle.includes('twitter')) return <Twitter size={20} />;
  if (lowerTitle.includes('website')) return <Globe size={20} />;
  return <LinkIcon size={20} />;
};

export const normalizeShaderData = (shader) => ({
  ...shader,
  title: shader.title || "Untitled Shader",
  thumbnail: shader.screenshots?.[0] || "https://via.placeholder.com/800x400?text=No+Image",
  description: shader.description || "No description available.",
  tags: Array.isArray(shader.tags) ? shader.tags : ["Shader"],
  platforms: Array.isArray(shader.platforms) ? shader.platforms : [],
  otherLinks: Array.isArray(shader.otherLinks) ? shader.otherLinks : [],
  supportedVersion: shader.supportedVersion || "Unknown",
  updated_at: shader.updated_at || "Unknown Date"
});
