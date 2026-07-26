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

export const normalizeShaderData = (shader) => {
  // 1. Define the path to the image in your public folder
  const defaultImage = "/default-shader.jpg"; 
  const cleanScreenshots = (Array.isArray(shader.screenshots) ? shader.screenshots : []).filter(url => {
    if (typeof url !== 'string') return false;
    // Strip out CurseForge project/gallery links unless it's a direct media link
    if (url.includes('curseforge.com/minecraft-bedrock/') && !url.includes('media.forgecdn.net')) return false;
    // Strip out discord channel links
    if (url.includes('discord.com/channels')) return false;
    return true;
  });

  const hasScreenshots = cleanScreenshots.length > 0;

  return {
    ...shader,
    title: shader.title || "Untitled Shader",
    // 2. Use the cleaned screenshot array
    thumbnail: hasScreenshots ? cleanScreenshots[0] : defaultImage,
    description: shader.description || "No description available.",
    tags: Array.isArray(shader.tags) ? shader.tags : ["Shader"],
    platforms: Array.isArray(shader.platforms) ? shader.platforms : [],
    otherLinks: Array.isArray(shader.otherLinks) ? shader.otherLinks : [],
    supportedVersion: shader.supportedVersion || "Unknown",
    updated_at: shader.updated_at || "Unknown Date",
    // 3. Fallback the gallery to the clean array
    screenshots: hasScreenshots ? cleanScreenshots : [defaultImage]
  };
};