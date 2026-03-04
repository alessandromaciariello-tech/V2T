-- V2T Auto-Paste Helper
-- Monitora la clipboard e incolla automaticamente quando cambia.
--
-- REQUISITI:
--   Impostazioni di Sistema > Privacy e Sicurezza > Accessibilità
--   → Abilitare l'app "Terminal" (o "iTerm" se usi quello)
--
-- AVVIO:
--   osascript /path/to/v2t-autopaste.applescript
--
-- STOP:
--   Ctrl+C nel terminale, oppure chiudi il terminale

on run
	set lastClip to (the clipboard as text)

	repeat
		try
			set currentClip to (the clipboard as text)

			if currentClip is not equal to lastClip and currentClip is not equal to "" then
				set lastClip to currentClip

				-- Breve attesa per assicurarsi che l'app precedente sia in focus
				delay 0.3

				-- Simula CMD+V nell'app in foreground
				tell application "System Events"
					keystroke "v" using command down
				end tell
			end if
		end try

		delay 0.5
	end repeat
end run
