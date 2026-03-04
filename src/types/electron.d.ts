interface ElectronAPI {
  transcribe: (
    audioBuffer: ArrayBuffer,
    mimeType: string
  ) => Promise<{ text?: string; error?: string }>;
  copyAndPaste: (text: string) => Promise<void>;
  resizeWindow: (width: number, height: number) => void;
  onToggleRecording: (callback: () => void) => () => void;
  onStartRecording: (callback: () => void) => () => void;
  onStopRecording: (callback: () => void) => () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
