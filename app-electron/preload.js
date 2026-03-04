const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  transcribe: (audioBuffer, mimeType) =>
    ipcRenderer.invoke("transcribe", audioBuffer, mimeType),

  copyAndPaste: (text) =>
    ipcRenderer.invoke("copy-and-paste", text),

  resizeWindow: (width, height) =>
    ipcRenderer.send("resize-window", width, height),

  onToggleRecording: (callback) => {
    ipcRenderer.on("toggle-recording", callback);
    return () => ipcRenderer.removeListener("toggle-recording", callback);
  },

  onStartRecording: (callback) => {
    ipcRenderer.on("start-recording", callback);
    return () => ipcRenderer.removeListener("start-recording", callback);
  },

  onStopRecording: (callback) => {
    ipcRenderer.on("stop-recording", callback);
    return () => ipcRenderer.removeListener("stop-recording", callback);
  },
});
