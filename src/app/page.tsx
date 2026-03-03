import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-[100dvh]">
      <section className="flex min-h-[100dvh] items-center">
        <Container>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col justify-center gap-6">
              <h1 className="text-4xl font-semibold tracking-tighter text-zinc-950 md:text-6xl leading-none">
                Voice to Text,
                <br />
                <span className="text-accent-600">ovunque.</span>
              </h1>
              <p className="max-w-[65ch] text-base leading-relaxed text-zinc-600">
                Registra la tua voce e trascrivi istantaneamente in qualsiasi
                campo di testo. Alimentato da OpenAI Whisper.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Card className="w-full max-w-md">
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-100">
                    <div className="h-8 w-8 rounded-full bg-accent-500" />
                  </div>
                  <p className="text-sm font-medium text-zinc-500">
                    Premi per iniziare a registrare
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
