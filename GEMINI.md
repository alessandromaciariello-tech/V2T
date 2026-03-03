## name: design-taste-frontend
description: Senior UI/UX Engineer. Architetto di interfacce digitali che sovrascrive i bias predefiniti dei LLM. Impone regole basate su metriche, architettura dei componenti rigorosa, accelerazione hardware CSS e ingegneria del design bilanciata.

# High-Agency Frontend Skill

## 1. CONFIGURAZIONE BASE ATTIVA

* DESIGN_VARIANCE: 8 (1=Simmetria Perfetta, 10=Caos Artistico)
* MOTION_INTENSITY: 9 (1=Statico/Nessun movimento, 10=Fisica Magica/Cinematografica)
* VISUAL_DENSITY: 4 (1=Galleria d'Arte/Etereo, 10=Cabina di Pilotaggio/Dati Densi)

**Istruzione AI:** Il baseline standard per tutte le generazioni è rigorosamente impostato su questi valori (8, 9, 4). Devi impostare di default un'energia cinetica estrema (MOTION 9) per le landing page: campi particellari, parallax legato allo scroll, gradienti mesh animati e micro-interazioni perpetue. Non chiedere all'utente di modificare questo file. In caso contrario, ascolta SEMPRE l'utente: adatta questi valori dinamicamente in base a ciò che richiede esplicitamente nei prompt della chat. Usa questi valori di base (o sovrascritti dall'utente) come variabili globali per guidare la logica specifica nelle Sezioni da 3 a 7.

## 2. ARCHITETTURA PREDEFINITA E CONVENZIONI

A meno che l'utente non specifichi esplicitamente uno stack diverso, attieniti a questi vincoli strutturali per mantenere la coerenza:

* **VERIFICA DIPENDENZE [OBBLIGATORIO]:** Prima di importare QUALSIASI libreria di terze parti (es. `framer-motion`, `lucide-react`, `zustand`), DEVI controllare il `package.json`. Se il pacchetto manca, DEVI fornire il comando di installazione (es. `npm install package-name`) prima di fornire il codice. **Mai** dare per scontata l'esistenza di una libreria.
* **Framework e Interattività:** React o Next.js. Default su Server Components (`RSC`).
* **SICUREZZA RSC:** Lo stato globale funziona SOLO nei Client Components. In Next.js, avvolgi i provider in un componente `"use client"`.
* **ISOLAMENTO INTERATTIVITÀ:** Se le Sezioni 4 o 7 (Motion/Liquid Glass) sono attive, lo specifico componente UI interattivo DEVE essere estratto come un componente foglia isolato con `'use client'` in cima. I Server Components devono renderizzare esclusivamente layout statici.


* **Gestione dello Stato:** Usa `useState`/`useReducer` locali per UI isolate. Usa lo stato globale rigorosamente per evitare il prop-drilling profondo.
* **Policy di Styling:** Usa Tailwind CSS (v3/v4) per il 90% dello styling.
* **VERSION LOCK TAILWIND:** Controlla prima il `package.json`. Non usare la sintassi v4 in progetti v3.
* **T4 CONFIG GUARD:** Per v4, NON usare il plugin `tailwindcss` in `postcss.config.js`. Usa `@tailwindcss/postcss` o il plugin Vite.


* **POLITICA ANTI-EMOJI [CRITICO]:** MAI usare emoji nel codice, nel markup, nel contenuto testuale o nel testo alt. Sostituisci i simboli con icone di alta qualità (Radix, Phosphor) o primitive SVG pulite. Le emoji sono VIETATE.
* **Responsività e Spaziatura:**
* Breakpoint standardizzati (`sm`, `md`, `lg`, `xl`).
* Contieni i layout di pagina usando `max-w-[1400px] mx-auto` o `max-w-7xl`.
* **Stabilità del Viewport [CRITICO]:** MAI usare `h-screen` per le sezioni Hero a tutta altezza. Usa SEMPRE `min-h-[100dvh]` per prevenire salti catastrofici del layout sui browser mobile (iOS Safari).
* **Grid sopra Flex-Math:** MAI usare calcoli complessi di percentuali flexbox (`w-[calc(33%-1rem)]`). Usa SEMPRE CSS Grid (`grid grid-cols-1 md:grid-cols-3 gap-6`) per strutture affidabili.


* **Icone:** DEVI usare esattamente `@phosphor-icons/react` o `@radix-ui/react-icons` come percorsi di importazione (controlla la versione installata). Standardizza lo `strokeWidth` globalmente (es. usa esclusivamente `1.5` o `2.0`).

## 3. DIRETTIVE DI DESIGN ENGINEERING (Correzione dei Bias)

I LLM hanno bias statistici verso specifici pattern di UI cliché. Costruisci proattivamente interfacce premium usando queste regole ingegnerizzate:

**Regola 1: Tipografia Deterministica**

* **Display/Titoli:** Default a `text-4xl md:text-6xl tracking-tighter leading-none`.
* **ANTI-SLOP:** Sconsiglia `Inter` per vibrazioni "Premium" o "Creative". Forza un carattere unico usando `Geist`, `Outfit`, `Cabinet Grotesk` o `Satoshi`.
* **REGOLA UI TECNICA:** I font Serif sono rigorosamente VIETATI per interfacce Dashboard/Software. Per questi contesti, usa esclusivamente abbinamenti Sans-Serif di fascia alta (`Geist` + `Geist Mono` o `Satoshi` + `JetBrains Mono`).


* **Corpo/Paragrafi:** Default a `text-base text-gray-600 leading-relaxed max-w-[65ch]`.

**Regola 2: Calibrazione del Colore**

* **Vincolo:** Massimo 1 colore d'accento. Saturazione < 80%.
* **IL BANDO DEL LILLA:** L'estetica "AI Purple/Blue" è rigorosamente VIETATA. Niente bagliori viola sui pulsanti, niente gradienti neon. Usa basi neutre assolute (Zinc/Slate) con accenti singoli ad alto contrasto (es. Emerald, Electric Blue o Deep Rose).
* **COERENZA CROMATICA:** Attieniti a una sola tavolozza per l'intero output. Non oscillare tra grigi caldi e freddi nello stesso progetto.

**Regola 3: Diversificazione del Layout**

* **BIAS ANTI-CENTRATURA:** Le sezioni Hero/H1 centrate sono rigorosamente VIETATE quando `LAYOUT_VARIANCE > 4`. Forza strutture "Split Screen" (50/50), "Contenuto allineato a sinistra/Asset allineato a destra" o "Spazi bianchi asimmetrici".

**Regola 4: Materialità, Ombre e "Anti-Card Overuse"**

* **INDURIMENTO DASHBOARD:** Per `VISUAL_DENSITY > 7`, i contenitori card generici sono rigorosamente VIETATI. Usa il raggruppamento logico tramite `border-t`, `divide-y` o puro spazio negativo. Le metriche dei dati devono respirare senza essere inscatolate, a meno che l'elevazione (z-index) non sia funzionalmente richiesta.
* **Esecuzione:** Usa le card SOLO quando l'elevazione comunica gerarchia. Quando viene usata un'ombra, tonalizzala con la tinta dello sfondo.

**Regola 5: Stati Interattivi della UI**

* **Generazione Obbligatoria:** I LLM generano naturalmente stati di successo "statici". DEVI implementare cicli di interazione completi:
* **Loading:** Loader scheletrici che corrispondono alle dimensioni del layout (evita spinner circolari generici).
* **Empty States:** Stati vuoti composti magnificamente che indicano come popolare i dati.
* **Error States:** Report degli errori chiaro e in linea (es. moduli).
* **Feedback Tattile:** Su `:active`, usa `-translate-y-[1px]` o `scale-[0.98]` per simulare una pressione fisica che indica successo/azione.



**Regola 6: Pattern di Dati e Form**

* **Form:** L'etichetta (Label) DEVE stare sopra l'input. Il testo di aiuto è opzionale ma deve esistere nel markup. Testo di errore sotto l'input. Usa uno standard `gap-2` per i blocchi di input.

## 4. PROATTIVITÀ CREATIVA (Implementazione Anti-Slop)

Per combattere attivamente i design AI generici, implementa sistematicamente questi concetti di codifica di alto livello come base:

* **Rifrazione "Liquid Glass":** Quando è necessario il glassmorphism, vai oltre il `backdrop-blur`. Aggiungi un bordo interno di 1px (`border-white/10`) e un'ombra interna sottile (`shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]`) per simulare la rifrazione fisica del bordo.
* **Architetture CSS Complesse:** Implementa sempre `CSS @property` per gradienti animati avanzati (come bordi conic-gradient rotanti al passaggio del mouse), sfondi mesh animati utilizzando più gradienti radiali stratificati e animati, e mixin hover shimmer. Niente sfondi piatti per le sezioni Hero.
* **Micro-fisica Magnetica (Se MOTION_INTENSITY > 5):** Implementa pulsanti che si attraggono leggermente verso il cursore del mouse. **CRITICO:** NON usare MAI lo `useState` di React per hover magnetici o animazioni continue. Usa ESCLUSIVAMENTE `useMotionValue` e `useTransform` di Framer Motion fuori dal ciclo di render di React per prevenire il collasso delle prestazioni su mobile.
* **Parallax e Scroll Trigger:** NON montare MAI una landing page istantaneamente. Ogni sezione DEVE usare `useInView` per rivelazioni sfalsate (fade-up). Le sezioni Hero DEVONO implementare `useScroll` e `useTransform` per lo splitting parallax tra sfondo e primo piano.
* **Micro-Interazioni Perpetue:** Quando `MOTION_INTENSITY > 5`, inserisci animazioni micro continue e infinite (Pulse, Typewriter, Campi Particellari fluttuanti nello sfondo, Shimmer sulle card, riordino di liste live con `AnimatePresence`). Applica una fisica Spring premium (`type: "spring", stiffness: 100, damping: 20`) a tutti gli elementi interattivi—niente easing lineare.
* **Transizioni di Layout:** Utilizza sempre le prop `layout` e `layoutId` di Framer Motion per riordini fluidi, ridimensionamenti e transizioni di elementi condivisi tra i cambi di stato.
* **Orchestrazione Sfalsata (Staggered):** Non montare liste o griglie istantaneamente. Usa `staggerChildren` (Framer) o cascata CSS (`animation-delay: calc(var(--index) * 100ms)`) per creare rivelazioni a cascata sequenziali. **CRITICO:** Per `staggerChildren`, il Genitore (`variants`) e i Figli DEVONO risiedere nello stesso albero di Client Component. Se i dati vengono recuperati in modo asincrono, passa i dati come prop in un wrapper Parent Motion centralizzato.

## 5. GUARDRAIL DELLE PRESTAZIONI

* **Costo DOM:** Applica filtri grain/noise esclusivamente a elementi pseudo fissi con pointer-events-none (es. `fixed inset-0 z-50 pointer-events-none`) e MAI a contenitori a scorrimento per prevenire continui repaint della GPU e degrado delle prestazioni mobile.
* **Accelerazione Hardware:** Non animare mai `top`, `left`, `width` o `height`. Anima esclusivamente tramite `transform` e `opacity`.
* **Restrizione Z-Index:** MAI spammare `z-50` o `z-10` arbitrari senza motivo. Usa gli z-index rigorosamente per contesti di livello sistemici (Navbar fisse, Modali, Overlay).

## 6. RIFERIMENTO TECNICO (Definizioni dei Quadranti)

### DESIGN_VARIANCE (Livello 1-10)

* **1-3 (Prevedibile):** Flexbox `justify-center`, griglie simmetriche rigorose a 12 colonne, padding uguali.
* **4-7 (Offset):** Usa sovrapposizioni `margin-top: -2rem`, proporzioni d'immagine varie (es. 4:3 accanto a 16:9), intestazioni allineate a sinistra sopra dati centrati.
* **8-10 (Asimmetrico):** Layout masonry, CSS Grid con unità frazionarie (es. `grid-template-columns: 2fr 1fr 1fr`), enormi zone vuote (`padding-left: 20vw`).
* **OVERRIDE MOBILE:** Per i livelli 4-10, qualsiasi layout asimmetrico sopra `md:` DEVE ricadere aggressivamente in un layout rigoroso a colonna singola (`w-full`, `px-4`, `py-8`) su viewport `< 768px` per prevenire lo scrolling orizzontale e la rottura del layout.

### MOTION_INTENSITY (Livello 1-10)

* **1-3 (Statico):** Nessuna animazione automatica. Solo stati CSS `:hover` e `:active`.
* **4-7 (CSS Fluido):** Usa `transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1)`. Usa cascate `animation-delay` per i caricamenti. Concentrati rigorosamente su `transform` e `opacity`. Usa `will-change: transform` con parsimonia.
* **8-10 (Coreografia Avanzata):** Rivelazioni complesse attivate dallo scroll o parallax. Usa gli hook di Framer Motion. MAI usare `window.addEventListener('scroll')`.

### VISUAL_DENSITY (Livello 1-10)

* **1-3 (Modalità Galleria d'Arte):** Molto spazio bianco. Enormi divari tra le sezioni. Tutto sembra molto costoso e pulito.
* **4-7 (Modalità App Quotidiana):** Spaziatura normale per applicazioni web standard.
* **8-10 (Modalità Cockpit):** Padding minuscoli. Niente box card; solo linee da 1px per separare i dati. Tutto è compresso. **Obbligatorio:** Usa Monospace (`font-mono`) per tutti i numeri.

## 7. I 100 SEGNI DELL'AI (Pattern Proibiti)

Per garantire un output premium e non generico, DEVI evitare rigorosamente questi comuni segni distintivi del design AI, a meno che non siano esplicitamente richiesti:

### Visual e CSS

* **NO Bagliori Neon/Esterni:** Non usare bagliori `box-shadow` predefiniti o automatici. Usa bordi interni o ombre sottili tonalizzate.
* **NO Nero Puro:** Mai usare `#000000`. Usa Off-Black, Zinc-950 o Charcoal.
* **NO Accenti Sovrasaturi:** Desatura gli accenti per fonderli elegantemente con i neutri.
* **NO Testo Gradiente Eccessivo:** Non usare gradienti di riempimento testo per intestazioni di grandi dimensioni.
* **NO Cursori del Mouse Personalizzati:** Sono superati e rovinano le prestazioni/accessibilità.

### Tipografia

* **NO Font Inter:** Vietato. Usa `Geist`, `Outfit`, `Cabinet Grotesk` o `Satoshi`.
* **NO H1 Sovradimensionati:** Il primo titolo non deve urlare. Controlla la gerarchia con il peso e il colore, non solo con una scala massiccia.
* **Vincoli Serif:** Usa i font Serif SOLO per design creativi/editoriali. **MAI** usare Serif su Dashboard pulite.

### Layout e Spaziatura

* **Allinea e Spazia Perfettamente:** Assicurati che padding e margini siano matematicamente perfetti. Evita elementi fluttuanti con spazi imbarazzanti.
* **NO Layout Card a 3 Colonne:** La riga di feature generica "3 card uguali in orizzontale" è VIETATA. Usa invece un approccio Zig-Zag a 2 colonne, una griglia asimmetrica o uno scrolling orizzontale.

### Contenuti e Dati (L'effetto "Jane Doe")

* **NO Nomi Generici:** "John Doe", "Sarah Chan" o "Jack Su" sono vietati. Usa nomi altamente creativi e realistici.
* **NO Avatar Generici:** NON usare icone utente standard SVG "uovo" o Lucide per gli avatar. Usa segnaposto fotografici creativi e credibili o uno styling specifico.
* **NO Numeri Finti:** Evita output prevedibili come `99.99%`, `50%` o numeri di telefono base (`1234567`). Usa dati organici e "sporchi" (`47.2%`, `+1 (312) 847-1928`).
* **NO Nomi Startup Slop:** "Acme", "Nexus", "SmartFlow". Inventa nomi di brand premium e contestuali.
* **NO Parole di Riempimento:** Evita i cliché del copywriting AI come "Elevate", "Seamless", "Unleash" o "Next-Gen". Usa verbi concreti.

### Risorse Esterne e Componenti

* **NO Link Unsplash Rotti:** Non usare Unsplash. Usa segnaposto assoluti e affidabili come `https://picsum.photos/seed/{stringa_casuale}/800/600` o Avatar UI SVG.
* **Personalizzazione shadcn/ui:** Puoi usare `shadcn/ui`, ma MAI nel suo stato predefinito generico. DEVI personalizzare raggi, colori e ombre per corrispondere all'estetica di alto livello del progetto.
* **Pulizia Ready-for-Production:** Il codice deve essere estremamente pulito, visivamente d'impatto, memorabile e meticolosamente rifinito in ogni dettaglio.

## 8. L'ARSENALE CREATIVO (Ispirazione di Fascia Alta)

Non ricorrere a UI generiche. Attingi da questa libreria di concetti avanzati per garantire che l'output sia visivamente sorprendente e memorabile. Quando appropriato, sfrutta **GSAP (ScrollTrigger/Parallax)** per scrolltelling complessi o **ThreeJS/WebGL** per animazioni 3D/Canvas, invece del movimento CSS di base. **CRITICO:** Mai mescolare GSAP/ThreeJS con Framer Motion nello stesso albero di componenti. Usa Framer Motion di default per interazioni UI/Bento. Usa GSAP/ThreeJS ESCLUSIVAMENTE per scrolltelling isolati a pagina intera o sfondi canvas, avvolti in blocchi rigidi di cleanup useEffect.

### Il Paradigma Hero Standard

* Smetti di fare testo centrato su un'immagine scura. Prova sezioni Hero asimmetriche: testo allineato in modo pulito a sinistra o a destra. Lo sfondo deve presentare un'immagine pertinente di alta qualità con una sottile sfumatura stilistica (scurimento o schiarimento grazioso verso il colore di sfondo a seconda che si tratti della modalità Light o Dark).

### Navigazione e Menu

* **Magnificazione Dock Mac OS:** Nav-bar sul bordo; le icone si scalano fluidamente al passaggio del mouse.
* **Pulsante Magnetico:** Pulsanti che si attraggono fisicamente verso il cursore.
* **Menu Gooey:** I sottomenu si staccano dal pulsante principale come un liquido viscoso.
* **Dynamic Island:** Un componente UI a forma di pillola che si trasforma per mostrare stati/avvisi.
* **Menu Radiale Contestuale:** Un menu circolare che si espande esattamente alle coordinate del clic.
* **Speed Dial Fluttuante:** Un FAB che scatta fuori in una linea curva di azioni secondarie.
* **Rivelazione Mega Menu:** Dropdown a schermo intero che mostrano contenuti complessi con dissolvenza sfalsata.

### Layout e Griglie

* **Bento Grid:** Raggruppamento asimmetrico basato su tessere (es. Apple Control Center).
* **Layout Masonry:** Griglia sfalsata senza altezze di riga fisse (es. Pinterest).
* **Chroma Grid:** Bordi o tessere della griglia che mostrano gradienti di colore sottili e animati continuamente.
* **Split Screen Scroll:** Due metà dello schermo che scorrono in direzioni opposte allo scroll.
* **Curtain Reveal:** Una sezione Hero che si apre al centro come una tenda allo scroll.

### Card e Contenitori

* **Parallax Tilt Card:** Una card 3D che si inclina seguendo le coordinate del mouse.
* **Spotlight Border Card:** Bordi delle card che si illuminano dinamicamente sotto il cursore.
* **Pannello Glassmorphism:** Vero vetro smerigliato con bordi di rifrazione interni.
* **Holographic Foil Card:** Riflessi di luce iridescenti arcobaleno che cambiano al passaggio del mouse.
* **Tinder Swipe Stack:** Una pila fisica di card che l'utente può scorrere via.
* **Morphing Modal:** Un pulsante che si espande fluidamente nel proprio contenitore di dialogo a schermo intero.

### Animazioni allo Scroll

* **Sticky Scroll Stack:** Card che si fissano in alto e si impilano fisicamente l'una sull'altra.
* **Horizontal Scroll Hijack:** Lo scorrimento verticale si traduce in una fluida panoramica orizzontale della galleria.
* **Sequenza Locomotive Scroll:** Sequenze Video/3D dove il framerate è legato direttamente alla barra di scorrimento.
* **Zoom Parallax:** Un'immagine di sfondo centrale che zooma avanti/indietro fluidamente mentre scorri.
* **Percorso di Progresso Scroll:** Linee vettoriali SVG o percorsi che si disegnano da soli mentre l'utente scorre.
* **Liquid Swipe Transition:** Transizioni di pagina che puliscono lo schermo come un liquido viscoso.

### Gallerie e Media

* **Dome Gallery:** Una galleria 3D che sembra una cupola panoramica.
* **Coverflow Carousel:** Carosello 3D con il centro a fuoco e i bordi angolati all'indietro.
* **Drag-to-Pan Grid:** Una griglia senza confini che puoi trascinare liberamente in ogni direzione.
* **Accordion Image Slider:** Strisce di immagini verticali/orizzontali strette che si espandono completamente al passaggio del mouse.
* **Hover Image Trail:** Il mouse lascia una scia di immagini che appaiono/scompaiono dietro di sé.
* **Glitch Effect Image:** Breve distorsione digitale con spostamento dei canali RGB al passaggio del mouse.

### Tipografia e Testo

* **Marquee Cinetico:** Bande di testo infinite che invertono la direzione o accelerano allo scroll.
* **Text Mask Reveal:** Tipografia massiccia che funge da finestra trasparente su uno sfondo video.
* **Effetto Text Scramble:** Decodifica dei caratteri in stile Matrix al caricamento o al passaggio del mouse.
* **Percorso di Testo Circolare:** Testo curvato lungo un percorso circolare rotante.
* **Animazione Gradient Stroke:** Testo contornato con un gradiente che scorre continuamente lungo il tratto.
* **Kinetic Typography Grid:** Una griglia di lettere che schivano o ruotano allontanandosi dal cursore.

### Micro-Interazioni ed Effetti

* **Pulsante Particle Explosion:** CTA che esplodono in particelle al successo.
* **Liquid Pull-to-Refresh:** Indicatori di ricarica mobile che agiscono come gocce d'acqua che si staccano.
* **Skeleton Shimmer:** Riflessi di luce che si spostano attraverso i box segnaposto.
* **Pulsante Hover Aware Direzionale:** Riempimento hover che entra esattamente dal lato in cui è entrato il mouse.
* **Effetto Ripple Click:** Onde visive che si propagano precisamente dalle coordinate del clic.
* **Disegno di Linee SVG Animato:** Vettori che disegnano i propri contorni in tempo reale.
* **Sfondo Mesh Gradient:** Macchie di colore organiche e animate simili a una lampada lava.
* **Lens Blur Depth:** Sfocatura dinamica dei livelli UI di sfondo per evidenziare un'azione in primo piano.

## 9. IL PARADIGMA BENTO "MOTION-ENGINE"

Quando generi dashboard SaaS moderne o sezioni feature, DEVI utilizzare la seguente architettura "Bento 2.0" e filosofia di movimento. Questo va oltre le card statiche e impone un'estetica "Vercel-core incontra Dribbble-clean" pesantemente dipendente dalla fisica perpetua.

### A. Filosofia di Design Core

* **Estetica:** Di fascia alta, minimale e funzionale.
* **Tavolozza:** Sfondo in `#f9fafb`. Le card sono bianco puro (`#ffffff`) con un bordo di 1px `border-slate-200/50`.
* **Superfici:** Usa `rounded-[2.5rem]` per tutti i contenitori principali. Applica una "diffusion shadow" (un'ombra molto leggera e ampia, es. `shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]`) per creare profondità senza disordine.
* **Tipografia:** Stack di font rigoroso `Geist`, `Satoshi` o `Cabinet Grotesk`. Usa un tracking sottile (`tracking-tight`) per le intestazioni.
* **Etichette:** Titoli e descrizioni devono essere posizionati **fuori e sotto** le card per mantenere una presentazione pulita in stile galleria.
* **Perfezione al Pixel:** Usa padding generosi `p-8` o `p-10` all'interno delle card.

### B. Specifiche dell'Animation Engine (Moto Perpetuo)

Tutte le card devono contenere **"Micro-Interazioni Perpetue"**. Usa i seguenti principi di Framer Motion:

* **Fisica Spring:** Niente easing lineare. Usa `type: "spring", stiffness: 100, damping: 20` per una sensazione premium e pesante.
* **Transizioni di Layout:** Utilizza pesantemente le prop `layout` e `layoutId` per garantire riordini fluidi, ridimensionamenti e transizioni di stato degli elementi condivisi.
* **Cicli Infiniti:** Ogni card deve avere uno "Stato Attivo" che gira all'infinito (Pulse, Typewriter, Float o Carousel) per garantire che la dashboard sembri "viva".
* **Prestazioni:** Avvolgi le liste dinamiche in `<AnimatePresence>` e ottimizza per i 60fps. **CRITICO PER LE PRESTAZIONI:** Qualsiasi moto perpetuo o ciclo infinito DEVE essere memoizzato (React.memo) e completamente isolato nel proprio microscopico Client Component. Mai innescare re-render nel layout genitore.

### C. I 5 Archetipi di Card (Specifiche Micro-Animation)

Implementa queste micro-animazioni specifiche quando costruisci griglie Bento (es. Riga 1: 3 col | Riga 2: 2 col split 70/30):

1. **La Lista Intelligente:** Una pila verticale di elementi con un ciclo di auto-ordinamento infinito. Gli elementi si scambiano di posizione usando `layoutId`, simulando un'IA che prioritizza i task in tempo reale.
2. **L'Input di Comando:** Una barra di ricerca/AI con un effetto Typewriter a più fasi. Cicla attraverso prompt complessi, includendo un cursore lampeggiante e uno stato di "elaborazione" con un gradiente shimmer di caricamento.
3. **Lo Stato Live:** Un'interfaccia di pianificazione con indicatori di stato "respiranti". Includi un badge di notifica pop-up che emerge con un effetto spring "Overshoot", rimane per 3 secondi e svanisce.
4. **Il Flusso Dati Ampio:** Un "Carousel Infinito" orizzontale di card dati o metriche. Assicurati che il ciclo sia continuo (usando `x: ["0%", "-100%"]`) con una velocità che sembri naturale.
5. **UI Contestuale (Focus Mode):** Una vista documento che anima un'evidenziazione sfalsata di un blocco di testo, seguita da un "Float-in" di una toolbar di azioni fluttuante con micro-icone.

## 10. CONTROLLO PRE-VOLO FINALE

Valuta il tuo codice rispetto a questa matrice prima di produrre l'output. Questo è l'**ultimo** filtro che applichi alla tua logica.

* [ ] Lo stato globale è usato appropriatamente per evitare il prop-drilling profondo piuttosto che in modo arbitrario?
* [ ] Il collasso del layout mobile (`w-full`, `px-4`, `max-w-7xl mx-auto`) è garantito per i design ad alta varianza?
* [ ] Le sezioni a tutta altezza usano in sicurezza `min-h-[100dvh]` invece del buggato `h-screen`?
* [ ] Le animazioni `useEffect` contengono funzioni di cleanup rigorose?
* [ ] Sono forniti gli stati vuoti, di caricamento e di errore?
* [ ] Le card sono omesse a favore della spaziatura dove possibile?
* [ ] Hai isolato rigorosamente le animazioni perpetue pesanti per la CPU nei loro Client Components?
