import { Smartphone, Monitor, Gamepad2 } from 'lucide-react';

export const API_URL = "https://newb-shader-backend.onrender.com/api/sync";

export const THEMES = {
  teal: {
    primary: 'bg-teal-500', secondary: 'bg-teal-100', 
    text: 'text-teal-600', textDark: 'text-teal-400', 
    border: 'border-teal-500', ring: 'focus:ring-teal-500', 
    darkBg: 'dark:bg-teal-900/30'
  },
  blue: {
    primary: 'bg-blue-500', secondary: 'bg-blue-100', 
    text: 'text-blue-600', textDark: 'text-blue-400', 
    border: 'border-blue-500', ring: 'focus:ring-blue-500', 
    darkBg: 'dark:bg-blue-900/30'
  },
  purple: {
    primary: 'bg-purple-500', secondary: 'bg-purple-100', 
    text: 'text-purple-600', textDark: 'text-purple-400', 
    border: 'border-purple-500', ring: 'focus:ring-purple-500', 
    darkBg: 'dark:bg-purple-900/30'
  },
  cyan: {
    primary: 'bg-cyan-500', secondary: 'bg-cyan-100', 
    text: 'text-cyan-600', textDark: 'text-cyan-400', 
    border: 'border-cyan-500', ring: 'focus:ring-cyan-500', 
    darkBg: 'dark:bg-cyan-900/30'
  },
  sky: {
    primary: 'bg-sky-500', secondary: 'bg-sky-100', 
    text: 'text-sky-600', textDark: 'text-sky-400', 
    border: 'border-sky-500', ring: 'focus:ring-sky-500', 
    darkBg: 'dark:bg-sky-900/30'
  }
};

export const DATABASE = {
  "versions": [
    { "base": "1.26.50", "start": { "major": 1, "minor": 26, "patch": 50 } },
    { "base": "1.26.30", "start": { "major": 1, "minor": 26, "patch": 30 } },
    { "base": "1.21.111", "start": { "major": 1, "minor": 21, "patch": 111 } },
    { "base": "1.21.100", "start": { "major": 1, "minor": 21, "patch": 100 }, "end": { "major": 1, "minor": 21, "patch": 101 } },
    { "base": "1.21.20", "start": { "major": 1, "minor": 21, "patch": 20 }, "end": { "major": 1, "minor": 21, "patch": 99 } },
    { "base": "1.20.80", "start": { "major": 1, "minor": 20, "patch": 80 }, "end": { "major": 1, "minor": 21, "patch": 19 } },
    { "base": "1.19.60", "start": { "major": 1, "minor": 19, "patch": 60 }, "end": { "major": 1, "minor": 20, "patch": 79 } }
  ],
  "developers": [
    {
      "id": "0_devendrn", 
      "name": "devendrn",
      "website": "https://devendrn.github.io",
      "icon": "https://avatars.githubusercontent.com/u/91605478?v=4",
      "verified": true,
      "socials": [
        { "title": "GitHub",   "link": "https://github.com/devendrn" },
        { "title": "Discord",  "link": "https://discord.gg/example" },
        { "title": "YouTube",  "link": "https://youtube.com/@devendrn" }
      ],
      "role": "Lead Developer",
      "location": "India",
      "bio": "Creator of Newb Shaders. Focused on performance and aesthetics."
    }
  ],
  "shaders": [
    {
      "id": 0,
      "title": "Newb Classic v16.54",
      "creator": "0_devendrn", 
      "readme": "newb_x_legacy",
      "platforms": ["ANDROID", "IOS", "WINDOWS"],
      "supportedVersion": "1.26.30+",
      "downloadLink": "https://www.curseforge.com/minecraft-bedrock/texture-packs/newb-shader/download/8305090",
      "screenshots": [
        "https://media.forgecdn.net/attachments/1067/794/overworld-cave-0.jpg",
        "https://media.forgecdn.net/attachments/1067/806/underwater-1.jpg",
        "https://media.forgecdn.net/attachments/1067/805/overworld-sunrise-0.jpg"
      ],
      "otherLinks": [
        { "title": "GitHub", "link": "https://github.com/devendrn/newb-x-mcbe" }
      ],
      "tags": ["Low End", "Vanilla+", "Atmospheric"],
      "description": "The classic look. Soft lighting, vibrant clouds, and water reflections optimized for low-end devices. Maintains the vanilla feel while enhancing atmosphere.",
      "updated_at": "Jun 2026"
    }
  ]
};

export const PLATFORM_MAP = {
  'ANDROID': { label: 'Android', icon: <Smartphone size={14} /> },
  'IOS':     { label: 'iOS', icon: <Smartphone size={14} /> },
  'WINDOWS': { label: 'Windows', icon: <Monitor size={14} /> },
  'XBOX':    { label: 'Xbox/PS', icon: <Gamepad2 size={14} /> },
};

export const TAG_OPTIONS = [
  "Ultra", "Low End", "Vanilla+", "Atmospheric", "Cinematic",
  "Complementary", "RenderDragon", "Vibrant", "Lite", "Performance"
];

/**
 * Checks if a shader's supportedVersion is >= 1.26.30 (i.e. needs a loader).
 * Handles formats like "1.26.30+", "1.26.50+", "1.21.111+", "1.20.0", etc.
 */
export const isLoaderRequired = (supportedVersion) => {
  if (!supportedVersion || typeof supportedVersion !== 'string') return false;
  // Strip trailing "+" and any whitespace
  const cleaned = supportedVersion.replace(/\+$/, '').trim();
  const parts = cleaned.split('.').map(Number);
  if (parts.length < 3 || parts.some(isNaN)) return false;
  
  const [major, minor, patch] = parts;
  // Compare against 1.26.30
  if (major > 1) return true;
  if (major < 1) return false;
  if (minor > 26) return true;
  if (minor < 26) return false;
  return patch >= 30;
};

/**
 * Checks if a shader's supportedVersion matches a given version filter base string.
 * e.g., does "1.26.30+" match filter "1.26.30"? Yes.
 *       does "1.26.50+" match filter "1.26.30"? No — it's a newer version.
 *       does "1.21.111+" match filter "1.21.111"? Yes.
 */
export const matchesVersionFilter = (supportedVersion, filterBase) => {
  if (!supportedVersion || typeof supportedVersion !== 'string') return false;
  // Direct substring match — "1.26.30+" includes "1.26.30"
  return supportedVersion.includes(filterBase);
};
