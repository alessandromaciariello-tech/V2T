# Prompt per Claude Code — macOS Dictation-to-Anywhere App (Full-Stack)

Sei **Claude Code** e devi operare come un **Full Stack Developer esperto** (macOS native + UI/UX + security + networking + packaging). Devi progettare e sviluppare una applicazione **macOS** che mi consente di dettare testo ovunque (note, chat, editor, browser) e incollarlo automaticamente **nel punto in cui si trova il cursore** (campo di testo attivo / caret) nell’applicazione attualmente in focus.

---

## 1) Obiettivo (User Story principale)

- Io sto scrivendo in qualunque app (es. Google Docs, Microsoft Word, Note, Slack, WhatsApp Web, Mail, ecc.).
- **Trigger start**: quando premo **due volte** il tasto **Option (⌥)**, l’app entra in modalità registrazione audio.
- Io parlo.
- **Trigger stop**: quando premo **una volta** Option (⌥) mentre sto registrando, l’app:
  1) ferma la registrazione
  2) invia l’audio a OpenAI usando l’API di Whisper per trascrivere
  3) incolla automaticamente il testo trascritto **nel campo attivo**, esattamente dove stava il cursore prima (senza che io debba fare CMD+V manualmente)

**Requisito fondamentale:** deve funzionare “dappertutto dove si possa inserire testo”, quindi con app native e web-app, non solo in un editor specifico.

---

## 2) Ruolo e aspettative su di te (Claude Code)

Operi come **Full Stack Developer esperto** e ti prendi responsabilità end-to-end:

- **Frontend/UI:** menubar app + preferences window, UX chiara e minimale
- **Backend locale (core app):** state machine, servizi audio, hotkey, paste, permessi
- **Security:** gestione API key in Keychain, privacy, sanitizzazione log
- **Networking:** client robusto per OpenAI (multipart upload), retry/timeout/error handling
- **OS integration:** event tap / global monitors, Accessibility permissions, clipboard management
- **Packaging:** progetto Xcode pronto, README completo, troubleshooting, build ripetibile

---

## 3) Comportamento UI/UX (minimo ma solido)

### 3.1 Stati
- **Idle** (in attesa)
- **Recording** (registrazione in corso)
- **Transcribing** (invio e attesa trascrizione)
- **Pasting** (inserimento testo)

### 3.2 Feedback utente
- Menubar app (icona in alto a destra) con indicatore stato:
  - Idle: icona neutra
  - Recording: icona “rossa” / puntino (o badge) + opzionale beep iniziale
  - Transcribing: spinner/animazione
  - Success: breve notifica “Incollato”
  - Error: notifica con azione “Riprova” e fallback “Copia negli appunti”
- (Opzionale ma consigliato) overlay piccolo tipo HUD al centro alto che dica “Recording…” e poi “Transcribing…”

### 3.3 Fallback importantissimo
Se non è possibile incollare nel punto attivo (permessi mancanti, nessun campo di testo attivo, focus non valido, app che blocca incolla):

- Copia comunque la trascrizione negli appunti
- Notifica: “Non riesco a incollare qui. Testo copiato negli appunti.”

---

## 4) Hotkey globale: doppio Option e singolo Option

### 4.1 Requisiti funzionali hotkey
- **Double-tap Option**: parte registrazione SOLO se:
  - sono due press ravvicinati entro una soglia (es. 250–400ms configurabile)
  - Option viene premuto e rilasciato “da solo” (senza altre lettere/shortcut in mezzo)
- **Single Option**: se e solo se `state == Recording`, stop immediato.

### 4.2 Requisiti di robustezza
- Non deve triggerare accidentalmente durante l’uso normale di Option per caratteri speciali o scorciatoie.
- Gestire sinistro/destro Option:
  - trattali come equivalenti, oppure opzione “solo Left Option” nelle preferenze.
- Debounce: se tengo premuto Option a lungo non deve comportarsi come tap multipli.
- Non rubare eventi quando non serve: idealmente rileva ma non interferisce con la normale digitazione.

### 4.3 Implementazione consigliata
- Usa un global event monitor / event tap a livello sistema:
  - `CGEventTapCreate` oppure `NSEvent.addGlobalMonitorForEvents(matching:)` (valuta limiti).
- Serve un piccolo “state machine” con timestamp degli ultimi tap e regole anti-falsi positivi.

---

## 5) Registrazione audio (locale)

### 5.1 Requisiti
- Avvio immediato e latenza bassa.
- Formato audio compatibile con l’API di trascrizione (es. WAV / M4A).
- Preferenze:
  - lingua default: italiano (ma automatico va bene)
  - opzionale: scelta microfono input
- Gestione permessi microfono:
  - richiesta permessi al primo utilizzo con guida chiara se negati.

### 5.2 Implementazione
- `AVAudioEngine` o `AVAudioRecorder`:
  - salva su file temporaneo in sandbox (Application Support / tmp)
  - al termine chiudi file e passa `URL` al layer di upload
- (Opzionale) Noise suppression: non obbligatorio per MVP.

---

## 6) Trascrizione via OpenAI Whisper (API)

### 6.1 Requisiti
- Usa endpoint “audio transcriptions”.
- Modello: di default `whisper-1` (coerente con richiesta), ma rendilo configurabile (es. `gpt-4o-mini-transcribe`) senza cambiare architettura.
- Supporta:
  - `language = "it"` opzionale
  - output testo semplice
- Networking:
  - timeout sensato
  - retry 1 volta su errori transient (429/5xx)
  - gestione errori (API key mancante, quota, rete assente)

### 6.2 Sicurezza
- API Key salvata in **Keychain** (NON in plaintext).
- Possibilità di inserire/modificare la key da preferenze menubar.
- Log: mai stampare la key.

---

## 7) Incollare “dove sta il cursore” in qualunque app

### 7.1 Strategia consigliata (universale): clipboard + paste shortcut
1) Salva contenuto attuale clipboard (clipboard snapshot).
2) Imposta clipboard = testo trascritto.
3) Simula CMD+V nella app in focus (con `CGEventCreateKeyboardEvent`).
4) Attendi un attimo (es. 150–300ms) e ripristina clipboard originale.

**Note:**
- Questo è il metodo più compatibile cross-app.
- Richiede permessi di **Accessibilità** (“Accessibility”) per inviare eventi e spesso anche **Input Monitoring** per la rilevazione tasti (dipende da versione macOS).

### 7.2 Requisiti
- Richiedere e verificare permessi:
  - Microfono
  - Accessibility (per inviare CMD+V)
  - (eventuale) Input Monitoring a seconda di macOS per cattura tasti
- In assenza permessi: non crashare, mostra wizard “Enable permissions” con deep link alle impostazioni.

### 7.3 Edge cases
- Se l’utente cambia focus durante `Transcribing`:
  - MVP: incolla nel focus corrente *al momento dell’incolla*.
  - Notifica se fallisce.
- Se campo è password/secure input:
  - non incollare
  - fallback clipboard + warning.

---

## 8) Architettura del progetto

### 8.1 Tecnologie
- Swift + SwiftUI per UI base (menubar, preferences)
- AppKit dove serve (status bar item, permessi, event tap)
- Un layer “Core” con:
  - `HotkeyService`
  - `AudioRecorder`
  - `TranscriptionService` (OpenAI API client multipart/form-data)
  - `PasteService`
  - `PermissionsService`
  - `AppStateMachine`

### 8.2 Struttura cartelle (esempio)
- `/App` (SwiftUI views, menu bar)
- `/Core/State` (state machine)
- `/Core/Services` (hotkey, audio, transcription, paste, permissions)
- `/Core/Models` (config, errors)
- `/Core/Utils` (keychain, logging)

### 8.3 Configurazioni (UserDefaults)
- threshold double-tap (ms)
- modello transcription
- lingua default (it/auto)
- beep on/off
- “use left option only” on/off

---

## 9) Deliverable richiesti a Claude Code (output finale)

1) Repo Xcode pronto a buildare (macOS app).
2) Menubar app funzionante.
3) Double Option → start recording.
4) Single Option (solo in recording) → stop → trascrivi → incolla.
5) Preferenze minime: API key + scelta modello + lingua.
6) Gestione permessi con schermata guida.
7) Logging + gestione errori + fallback clipboard.
8) README con:
   - setup (API key)
   - permessi macOS necessari e come abilitarli
   - troubleshooting (perché non incolla, perché non rileva Option, ecc.)

---

## 10) Criteri di accettazione (test manuale)

- In Safari/Chrome su Google Docs: dettatura e incolla ok.
- In Note.app: ok.
- In un campo chat (es. Slack/Discord): ok.
- Se tolgo permessi Accessibility: non incolla, ma copia in clipboard e notifica.
- Se rete assente: mostra errore e non perde l’audio; conserva temporaneamente e permette retry (almeno 1 tentativo).
- Non parte registrazione mentre uso Option per un simbolo singolo (evitare falsi positivi grazie alle regole di double-tap).

---

## 11) Note implementative importanti

- L’app deve restare leggera: niente finestre full-screen, solo menubar + preference window.
- Performance: registrazione e transcribing asincroni, UI sempre responsive.
- Privacy: non salvare audio a lungo termine; cancella file temporaneo dopo successo (o dopo N minuti se errore).
- Evita dipendenze pesanti: preferire API native Apple.
- Garantire compatibilità macOS moderna (definisci deployment target ragionevole e documentalo).

---

## 12) Riferimenti API (solo per implementazione)
- OpenAI Audio / Transcriptions (Whisper): https://developers.openai.com/api/docs/guides/audio/