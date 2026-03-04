import { NextResponse } from "next/server";

const WHISPER_URL = "https://api.openai.com/v1/audio/transcriptions";

// Known Whisper hallucinations when audio has low/no signal
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

async function callWhisperWithRetry(
  formData: FormData,
  retries = 1
): Promise<Response> {
  const response = await fetch(WHISPER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: formData,
    signal: AbortSignal.timeout(30_000),
  });

  if ((response.status === 429 || response.status >= 500) && retries > 0) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return callWhisperWithRetry(formData, retries - 1);
  }

  return response;
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not configured");
    return NextResponse.json(
      { error: "Servizio non configurato. Contatta l'amministratore." },
      { status: 500 }
    );
  }

  try {
    const incomingForm = await request.formData();
    const audioFile = incomingForm.get("audio");
    const language = (incomingForm.get("language") as string) || "it";

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { error: "Nessun file audio ricevuto." },
        { status: 400 }
      );
    }

    const mimeType = audioFile.type || "audio/webm";
    const extension = mimeType.includes("mp4")
      ? "mp4"
      : mimeType.includes("wav")
        ? "wav"
        : "webm";

    const whisperForm = new FormData();
    whisperForm.append(
      "file",
      new Blob([audioFile], { type: mimeType }),
      `recording.${extension}`
    );
    whisperForm.append("model", "whisper-1");
    whisperForm.append("language", language);
    whisperForm.append("response_format", "text");
    whisperForm.append("prompt", " ");

    const response = await callWhisperWithRetry(whisperForm);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(
        `Whisper API error ${response.status}:`,
        errorText.slice(0, 200)
      );

      if (response.status === 429) {
        return NextResponse.json(
          {
            error:
              "Servizio temporaneamente sovraccarico. Riprova tra qualche secondo.",
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: "Errore durante la trascrizione. Riprova." },
        { status: 500 }
      );
    }

    const text = (await response.text()).trim();

    // Filter known hallucinations
    if (
      !text ||
      HALLUCINATIONS.some((h) => text.toLowerCase().includes(h))
    ) {
      return NextResponse.json(
        { error: "Nessun audio rilevato. Parla piu' forte o avvicinati al microfono." },
        { status: 422 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "La trascrizione ha impiegato troppo tempo. Riprova." },
        { status: 504 }
      );
    }

    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Errore imprevisto. Riprova." },
      { status: 500 }
    );
  }
}
