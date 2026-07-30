
# Newb Hub (Newb Shaders App)

A modern, fast, and lightweight mobile application built to browse, discover, and download community shaders for Minecraft Bedrock Edition (RenderDragon). Built with React, Vite, Tailwind CSS, and packaged natively for Android using Capacitor.

## ✨ Features

* **Sleek, App-Like UI:** Buttery smooth navigation, touch-friendly scrolling, and pull-to-refresh functionality.
* **Smart Filtering & Search:** Search by name, version compatibility (e.g., 1.26.30+), or platform (Android, iOS, Windows). Includes recent search history.
* **Customization:** Fully supports Dark/Light mode, Compact UI mode, and multiple color themes (Teal, Blue, Purple, Cyan, Sky) that persist locally.
* **Fullscreen Gallery:** Interactive lightbox to view high-quality shader screenshots.
* **Favorites System:** Save your favorite shaders directly to local storage for quick access.
* **Smart Warnings:** Built-in alerts guiding users to required game loaders (like MB Loader or Wyvern) for newer RenderDragon versions.
* **Developer Profiles:** Dedicated pages showcasing individual creators, their socials, and their public projects.

## 🛠️ Tech Stack

* **Frontend Framework:** React 19 + Vite
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Mobile Packaging:** Capacitor 7 (@capacitor/android, @capacitor/app)
* **Animations:** GSAP & Tailwind transitions
* **Data:** Fetch-based synchronization with a JSON REST API, utilizing local storage for offline state management.

## 🚀 Getting Started (Local Development)

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/BRSolanki/newb-shaders-app.git](https://github.com/BRSolanki/newb-shaders-app.git)
   cd newb-shaders-app

```

2. Install dependencies:
```bash
npm install

```


3. Start the Vite development server:
```bash
npm run dev

```


The app will be available at `http://localhost:5173`.

## 📱 Building for Android

This project uses Capacitor to bridge the web app to native Android. To build the APK:

1. Build the production web assets:
```bash
npm run build

```


2. Sync the web code to the Android project:
```bash
npx cap sync

```


3. Open Android Studio to compile and run the app on a physical device or emulator:
```bash
npx cap open android

```



### Quick Commands

* `npm run bump-version`: Automatically bumps the patch version and runs a Capacitor sync.
* `npm run bump-minor`: Automatically bumps the minor version and runs a Capacitor sync.

## 💡 Configuration

The app relies on a backend API endpoint defined in `src/App.jsx`. If the server is unreachable, it automatically falls back to a static `DATABASE` object located in `src/utils/constants.jsx` to ensure uninterrupted use.

## 👨‍💻 Author

Built by **Balvant Solanki** (BRSolanki).

## 📄 License

This project is licensed under the MIT License.

```

