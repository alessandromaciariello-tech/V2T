const {
  app,
  BrowserWindow,
  ipcMain,
  clipboard,
  globalShortcut,
  screen,
} = require("electron");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const WHISPER_URL = "https://api.openai.com/v1/audio/transcriptions";

const HALLUCINATIONS = [
  "sottotitoli creati dalla comunità amara.org",
  "sottotitoli e revisione a cura di qtss",
  "sottotitoli di amara.org",
  "subtitles by the amara.org community",
  "thanks for watching",
  "thank you for watching",
  "grazie per la visione",
  "you",
  "...",
];

function loadApiKey() {
  const envPath = path.join(app.getAppPath(), ".env.local");
  try {
    const content = fs.readFileSync(envPath, "utf-8");
    const match = content.match(/OPENAI_API_KEY=(.+)/);
    return match ? match[1].trim() : "";
  } catch {
    const userEnvPath = path.join(app.getPath("userData"), ".env");
    try {
      const content = fs.readFileSync(userEnvPath, "utf-8");
      const match = content.match(/OPENAI_API_KEY=(.+)/);
      return match ? match[1].trim() : "";
    } catch {
      return process.env.OPENAI_API_KEY || "";
    }
  }
}

let mainWindow = null;
let apiKey = "";

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 86,
    height: 86,
    resizable: true,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    hasShadow: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const display = screen.getPrimaryDisplay();
  const { width: screenWidth } = display.workAreaSize;
  mainWindow.setPosition(screenWidth - 120, 40);

  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../out/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  apiKey = loadApiKey();

  // IPC: resize window
  ipcMain.on("resize-window", (_event, width, height) => {
    if (mainWindow) {
      mainWindow.setSize(Math.ceil(width), Math.ceil(height), true);
    }
  });

  // IPC: transcription via OpenAI Whisper
  ipcMain.handle("transcribe", async (_event, audioBuffer, mimeType) => {
    if (!apiKey) {
      return { error: "API key non configurata." };
    }

    try {
      const ext = mimeType.includes("mp4")
        ? "mp4"
        : mimeType.includes("wav")
          ? "wav"
          : "webm";

      const formData = new FormData();
      formData.append(
        "file",
        new Blob([audioBuffer], { type: mimeType }),
        `recording.${ext}`
      );
      formData.append("model", "whisper-1");
      formData.append("language", "it");
      formData.append("response_format", "text");
      formData.append("prompt", " ");

      const response = await fetch(WHISPER_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: formData,
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return { error: "Servizio sovraccarico. Riprova tra qualche secondo." };
        }
        return { error: "Errore durante la trascrizione. Riprova." };
      }

      const text = (await response.text()).trim();

      if (!text || HALLUCINATIONS.some((h) => text.toLowerCase().includes(h))) {
        return { error: "Nessun audio rilevato. Parla piu' forte o avvicinati al microfono." };
      }

      return { text };
    } catch (err) {
      if (err && err.name === "TimeoutError") {
        return { error: "La trascrizione ha impiegato troppo tempo. Riprova." };
      }
      return { error: "Errore imprevisto. Riprova." };
    }
  });

  // IPC: copy to clipboard + auto-paste
  ipcMain.handle("copy-and-paste", async (_event, text) => {
    clipboard.writeText(text);
    await new Promise((r) => setTimeout(r, 200));

    try {
      if (process.platform === "darwin") {
        execSync(
          `osascript -e 'tell application "System Events" to keystroke "v" using command down'`
        );
      }
    } catch {
      // Fallback: text is in clipboard, user can CMD+V manually
    }
  });

  // Global shortcut: Alt+Space to toggle recording
  try {
    globalShortcut.register("Alt+Space", () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
        mainWindow.webContents.send("toggle-recording");
      }
    });
  } catch {
    // Shortcut might already be taken
  }

  createWindow();

  app.on("activate", () => {
    if (!mainWindow) createWindow();
  });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
