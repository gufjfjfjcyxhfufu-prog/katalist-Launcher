# ⬡ KATALIST LAUNCHER

> A professional game launcher built with Electron, React, and Vite.
> Futuristic dark UI with glassmorphism, neon accents, and smooth animations.

---

## ✦ Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Desktop Shell| Electron 28                       |
| UI Framework | React 18                          |
| Build Tool   | Vite 5                            |
| Fonts        | Orbitron · Rajdhani · Share Tech Mono |
| Packaging    | electron-builder (NSIS installer) |

---

## ✦ Features

- **Futuristic dark UI** — void black, neon purple/cyan, glassmorphism panels
- **Boot animation** — terminal-style system boot with progress bar
- **Game selection** — native file picker, `.exe` / `.app` / `.sh` support
- **Game launching** — via `child_process.spawn` (detached, no blocking)
- **Persistent storage** — JSON config in `userData` directory
- **Animated sidebar** — status indicator, navigation, system info
- **Notification system** — slide-in toast notifications
- **Window controls** — custom frameless minimize / maximize / close
- **Status bar** — live clock, game status, runtime mode indicator
- **Keyboard shortcuts** — `Ctrl+L` launch, `Ctrl+,` settings, `Ctrl+Q` quit
- **App menu** — Launch Game / Settings / Exit

---

## ✦ Quick Start

### 1. Install dependencies

```bash
cd katalist-launcher
npm install
```

### 2. Run in development mode

```bash
npm run dev
```

This starts Vite dev server on `localhost:5173` and launches Electron.

### 3. Build for Windows

```bash
npm run build:win
```

Output: `dist-electron/` — contains the NSIS `.exe` installer.

---

## ✦ Project Structure

```
katalist-launcher/
├── electron/
│   ├── main.js          # Main process: window, IPC, game launching
│   └── preload.js       # Secure context bridge (contextIsolation)
├── src/
│   ├── components/
│   │   ├── TitleBar.jsx       # Frameless titlebar + nav + window controls
│   │   ├── Sidebar.jsx        # Futuristic sidebar with status
│   │   ├── HomeView.jsx       # Library, game card, launch bar
│   │   ├── SettingsView.jsx   # Settings panel
│   │   ├── LoadingScreen.jsx  # Boot animation
│   │   └── Notifications.jsx  # Toast notification system
│   ├── hooks/
│   │   └── useElectron.js     # Safe Electron ↔ React bridge
│   ├── styles/
│   │   └── global.css         # Design system, CSS variables, keyframes
│   ├── App.jsx                # Root component, state, routing
│   ├── main.jsx               # React entry point
│   └── index.html             # HTML shell
├── assets/
│   └── icons/                 # Place icon.ico and icon.png here
├── package.json
└── vite.config.js
```

---

## ✦ How to Use

1. **Launch the app** via `npm run dev` or the built installer
2. **Boot animation** plays (~2 seconds)
3. **Click "+ ADD GAME"** or the empty slot to open the file picker
4. **Select your game** `.exe` (e.g. `MyGame.exe`)
5. **Click "LAUNCH GAME"** in the bottom bar — or press `Ctrl+L`
6. The game runs detached; the launcher stays open
7. Status changes to **RUNNING** in the sidebar and status bar

---

## ✦ Building the Installer

```bash
# Full build pipeline:
npm run build:win

# Manual steps if needed:
npm run vite:build      # Build React app → dist/
npx electron-builder    # Package → dist-electron/
```

The installer will be in `dist-electron/Katalist Launcher Setup 1.0.0.exe`.

---

## ✦ Adding an Icon

Place your icon files at:
- `assets/icons/icon.ico` — Windows installer icon (256×256 recommended)
- `assets/icons/icon.png` — In-app window icon (512×512 recommended)

---

## ✦ Configuration File Location

Game path is saved at:
- **Windows:** `%APPDATA%\katalist-launcher\katalist-config.json`
- **macOS:** `~/Library/Application Support/katalist-launcher/katalist-config.json`
- **Linux:** `~/.config/katalist-launcher/katalist-config.json`

---

## ✦ Keyboard Shortcuts

| Shortcut     | Action       |
|--------------|--------------|
| `Ctrl+L`     | Launch Game  |
| `Ctrl+,`     | Open Settings|
| `Ctrl+Q`     | Exit         |
| `F12`        | DevTools     |
| `Ctrl+R`     | Reload       |

---

## ✦ License

MIT — Katalist Studios 2025
