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
    { "base": "1.21.111", "label": "1.21.111+" },
    { "base": "1.21.20", "label": "1.21.20+" },
    { "base": "1.20.80", "label": "1.20.80+" },
    { "base": "1.19.60", "label": "1.19.60+" }
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
        { "title": "Discord",  "link": "https://discord.gg/t8Y9aB4YQj" },
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
      "title": "Newb X Legacy",
      "creator": "0_devendrn", 
      "readme": "newb_x_legacy",
      "platforms": ["ANDROID", "IOS", "WINDOWS"],
      "supportedVersion": "1.21.20",
      "downloadLink": "https://github.com/devendrn/newb-x-mcbe/releases/download/v16/newb-x-legacy-16.0-merged.mcpack",
      "screenshots": [
        "https://media.forgecdn.net/attachments/1067/794/overworld-cave-0.jpg",
        "https://media.forgecdn.net/attachments/1067/806/underwater-1.jpg",
        "https://media.forgecdn.net/attachments/1067/805/overworld-sunrise-0.jpg"
      ],
      "otherLinks": [
        { "title": "GitHub", "link": "https://github.com/devendrn/newb-x-mcbe" }
      ],
      "tags": ["Low End", "Vanilla+"],
      "description": "The classic look. Soft lighting, vibrant clouds, and water reflections optimized for low-end devices.",
      "updated_at": "2023-10-20"
    }
  ]
};

export const PLATFORM_MAP = {
  'ANDROID': { label: 'Android', icon: <Smartphone size={14} /> },
  'IOS':     { label: 'iOS', icon: <Smartphone size={14} /> },
  'WINDOWS': { label: 'Windows', icon: <Monitor size={14} /> },
  'XBOX':    { label: 'Xbox/PS', icon: <Gamepad2 size={14} /> },
};

export const TAG_OPTIONS = ["Ultra", "Low End", "Vanilla+", "Atmospheric", "Cinematic"];
