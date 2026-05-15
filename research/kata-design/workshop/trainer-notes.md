# Trainer-Notizen zur HPSMV-Kata

Begleitmaterial für den Trainer. **Nicht für Teilnehmer**.

Enthält die HPSMV-Festlegungen zu allen Mehrdeutigkeiten — also die
Antworten, die im Example-Mapping herauskommen sollten — sowie
Hinweise für die Workshop-Durchführung.

## Setting

Aufgabe: [`prose.md`](prose.md) (Deutsch, narrativer Galaxy-Trucker-Stil).

Verifikations-Szenarien (zur Wertekontrolle / Demonstration nach dem
Mapping): [`../../../experiments/katas/claim-office-verification/`](../../../experiments/katas/claim-office-verification/).

## Liste der Mehrdeutigkeiten

Fünf Haupt-Mehrdeutigkeiten plus eine Sub-Mehrdeutigkeit. Die Liste
folgt der internen Numerierung aus `kata-mehrdeutigkeiten.md`.

### A — Set-Wertung mit Überzähligen

**Frage:** Wie wird eine Sammlung von 4 oder mehr gleichartigen
Komponenten bewertet?

**HPSMV-Festlegung:** Ein Bauteil-Block gilt **nur bei genau drei**
Komponenten. Bei 4 oder mehr wird alles einzeln gezählt — kein
"greedy"-Block-Bilden, kein "nur ein Block, Rest einzeln".

**Beispiele zum Pinnen im Mapping:**
- 3 Runen → 60 G Grundprämie (Block)
- 4 Runen → 100 G Grundprämie (4 × 25, kein Block)
- 7 Runen → 175 G Grundprämie (7 × 25, kein Block)

**Trainer-Hinweis:** Diese Lesart ist die *teuerste* der drei
plausiblen — passt zur knausrigen Tonalität. Modelle und Teilnehmer
neigen typischerweise zu greedy max-Block. Wenn niemand auf "strikt
nur 3" kommt, kann der Trainer den Sachverständigen-Charakter
einsetzen ("Drei *gleichartige* Komponenten gelten als Block. Drei.").

### Aₐ — "Gleichartig" als Begriff

**Frage:** Was bedeutet "gleichartig"? Gleicher Typ, gleiche
Kategorie, gleiches Material?

**HPSMV-Festlegung:** Gleicher **Typ-Bezeichner**. Runen und
Mondsteine sind nie gleichartig zueinander, auch wenn beide
"Komponenten" sind.

**Beispiele:**
- 2 Runen + 1 Mondstein → 75 G (kein Block, unterschiedliche Typen)
- 3 Runen + 3 Mondsteine → 120 G (zwei separate Blöcke)

**Trainer-Hinweis:** Klassischer Begriffs-Stolper. Im Mapping fragt
typischerweise jemand "Moment, was heißt gleichartig?". Das ist
*konstruktiv versteckte Information* — die Frage muss aktiv gestellt
werden, sie steht nicht in den Regeln.

### B₂ — Selbstbeteiligung pro Schadensereignis

**Frage:** Greift die Selbstbeteiligung von 100 G einmal pro
Schadensfall (z.B. Drachenangriff) oder pro beschädigtem Item?

**HPSMV-Festlegung:** Die Selbstbeteiligung wird **pro Item**
abgezogen. Ein Drachenangriff, der zwei Items beschädigt, kostet
zweimal 100 G Selbstbeteiligung.

**Beispiele:**
- Drachenangriff: Schwert (500 G) + Amulett (300 G) →
  (500 − 100) + (300 − 100) = 600 G Payout

**Trainer-Hinweis:** Modelle streuen hier über Familien-Grenzen hinweg
(Opus zu "ein Ereignis = eine SB", Sonnet zu "pro Item"). Im Workshop
wahrscheinlich auch Diskussion. Festlegung passt zur knausrigen
Tonalität — die HPSMV behält gerne mehr ein.

### C — "Erstversicherung" als Begriff

**Frage:** Bezieht sich der Erst-Bewertungs-Aufschlag von 10 % auf
*den ersten Vertrag des Kunden* (Kunden-bezogen) oder auf *die erste
Police für ein Item* (Sach-bezogen)?

**HPSMV-Festlegung:** **Sach-bezogen.** Auch ein Stammkunde, der ein
neues Item versichert, zahlt den Erst-Aufschlag — denn das Item ist
zum ersten Mal in Begutachtung.

**Beispiele:**
- Stammkunde 3 Jahre, zweiter Vertrag mit neuem Schwert → +10 %
  (Erstversicherung des Schwerts) UND −15 % (Folgevertrag des Kunden),
  beide gleichzeitig.

**Trainer-Hinweis:** Die zwei Klauseln "Erstversicherung +10 %" und
"ab zweitem Vertrag −15 %" wirken zunächst widersprüchlich. Die
HPSMV-Lesart ist, dass sie *parallel* greifen — Item-Erst plus
Kunden-Folgevertrag.

**JSON-Lesart:** Items im Szenario-JSON haben keine Identität (keine
`id`, kein "wasInsuredBefore"-Flag). Konsequenz: jedes Item gilt
implizit als Erstversicherung — der +10 %-Aufschlag fällt also bei
*jedem* Quote-Step auf *jedes* Item an. Der −15 %-Folgevertrags-Rabatt
hingegen ist am JSON ablesbar: er greift bei jedem `quote`-Step *nach
dem ersten* im `steps`-Array (selber Kunde im ganzen Szenario). Häufige
Teilnehmer-Frage: "Wie sehe ich, dass das Schwert schon mal versichert
war?" — Antwort: gar nicht, das ist Absicht.

### D — Faktor-Reihenfolge bei Modifikatoren

**Frage:** Wie werden die Modifikatoren (Fluch, Verzauberung, Treue,
usw.) auf den Grundpreis angewandt? Additiv? Multiplikativ? In welcher
Reihenfolge?

**HPSMV-Festlegung:** **Additiv auf den Grundpreis**. Alle Prozentsätze
werden in absolute Goldstücke umgerechnet (jeweils prozentual vom
Grundpreis) und auf den Police-Grundpreis addiert/subtrahiert.

**Erweiterung — Item- vs. Police-Bezug:** Item-spezifische Modifikatoren
(Fluch, hohe Verzauberung) wirken auf den **Item-Grundpreis** des
betroffenen Items. Police-Modifikatoren (Treuerabatt, Erstversicherung,
Folgevertrag) wirken auf den **Police-Grundpreis** (Summe aller
Item-Grundprämien).

**Beispiele:**
- Verfluchtes Stufe-7-Schwert, 3-Jahre-Stammkunde, zweiter Vertrag,
  Grundpreis 100 G:
  100 + 50 (Fluch) + 30 (hohe Verzauberung) − 20 (Treuerabatt)
  + 10 (Erstvers.) − 15 (Folgevertrag) = 155 G
  + 5 G Bearbeitungsgebühr = **160 G**
- Police mit verfluchtem Schwert (100) + Amulett (60), Newcomer:
  Police-Grundpreis 160 G; Fluch-Aufschlag +50 G (50 % vom
  Sword-Grundpreis); Erst-Aufschlag +16 G (10 % vom
  Police-Grundpreis); Sub: 226 G + 5 = **231 G**

**Trainer-Hinweis:** Modelle konvergieren auf multiplikative
Berechnung; additiv ist die *Lebenswelt-Lesart* (E-Commerce-Rabatt-
codes), aber gegen die Modell-Konvergenz festgelegt. Wenn das Mapping
multiplikativ wählt, ist auch *das* eine valide Workshop-Erfahrung
("euer Tarif berechnet anders als der HPSMV-Tarif" — wertvolle
Erkenntnis über Anforderungs-Festlegung).

### F' — Risiko-Schwelle vs. Drachenmaterial

**Frage:** Was passiert bei einem Item, das *beide* Schadensregulierungs-
Klauseln auslöst — also Drachenmaterial UND Verzauberungsstufe ≥ 8?

**HPSMV-Festlegung:** Die **50 %-Klausel gewinnt**. Risiko-Schwelle
schlägt Material-Klausel.

**Reihenfolge zur Selbstbeteiligung:** **Erst die Erstattungs-Klausel
anwenden, dann SB abziehen.**

**Beispiele:**
- Drachen-Schwert, Verzauberung 9, Schaden 1000 G →
  500 G (50 %) − 100 G SB = **400 G Payout**
- Drachen-Schwert, Verzauberung 5, Schaden 800 G →
  800 G (voll, Drachenmaterial) − 100 G SB = **700 G Payout**
- Stahl-Schwert, Verzauberung 9, Schaden 1000 G →
  500 G (50 %) − 100 G SB = **400 G Payout**

**Trainer-Hinweis:** Die Reihenfolge zwischen Klausel und SB ist eine
versteckte Mehrdeutigkeit innerhalb dieser Frage. Wenn niemand sie
anspricht, kann der Trainer mit einem konkreten Beispiel nachfragen
("Drachenmaterial-Schwert, ench 9, Schaden 1000 G — was zahlt die
HPSMV?").

## Weitere wichtige Festlegungen

Diese Punkte sind keine Mehrdeutigkeiten im engeren Sinne, kommen
aber häufig im Mapping auf.

### Bearbeitungsgebühr

- Immer 5 G obendrauf, *nach* allen Modifikatoren, *niemals* rabattiert.
- Auch bei leerer Item-Liste: Prämie 0 G + 5 G Gebühr = 5 G.

### Rundung

- Alle Beträge zugunsten der HPSMV: **Prämien aufrunden, Auszahlungen
  abrunden**.
- Rundung **am Ende** der Berechnung, Zwischenwerte bleiben fraktional.

### Cap

- Cap = **2 × Versicherungssumme**.
- Versicherungssumme = Summe der **Versicherungswerte** aller Items
  (nicht der Prämien!).
- Cap ist **kumulativ über die Lebenszeit** der Police, kein Reset.
- Cap basiert auf **unmodifiziertem** Versicherungswert — Fluch- und
  andere Aufschläge erhöhen den Cap nicht.
- Block-Bonus betrifft nur die Prämie, nicht den Versicherungswert
  (3 Runen-Block: Wert 750 G, Prämie 60 G).

### Mehrere Items desselben Typs

- Eine Police kann mehrere Items desselben Typs enthalten (zwei
  Schwerter, drei Tränke).
- Versicherungssumme aggregiert linear: 2 × Schwert = 2 × 1000 = 2000 G,
  Cap 4000 G.
- Pro `damages`-Eintrag eine Selbstbeteiligung — auch wenn beide
  Einträge denselben `itemType` haben.
- Wenn die Anzahl der Damage-Einträge die Anzahl der Items in der
  Police überschreitet → **Komplettablehnung** des claim (bürokratisch
  strikt).

### Unbekannte Items

- Item mit unbekanntem Typ (nicht in Hauptgegenstand-Tabelle, kein
  Komponenten-Typ) → Fehler / Komplettablehnung.
- Damage-Eintrag, dessen Item nicht in der Police ist → Fehler.
- Negative Schadenshöhe → Fehler.

### Edge Cases

- Leere Item-Liste in `quote` → Prämie 0 G (= 5 G mit Gebühr), kein
  Fehler.

## Workshop-Durchführung

### Empfohlener Ablauf

1. **Setting vorlesen / verteilen** ([`prose.md`](prose.md)) — ca. 10 min
2. **Example Mapping in Kleingruppen** — ca. 60 min
   - Story-Karte (gelb): "HPSMV-Police berechnen / Schaden regulieren"
   - Regel-Karten (blau): aus dem Setting extrahieren
   - Beispiel-Karten (grün): pro Regel mindestens ein Beispiel
   - Frage-Karten (rot): offene Punkte, die den PO/Trainer brauchen
3. **Plenum: Fragen beantworten** — Trainer als PO, beantwortet rote
   Karten gemäß Festlegungen oben — ca. 20 min
4. **Implementierung in Pair- oder Mob-Programming** — ca. 90+ min
5. **Vergleich mit Verifikations-Szenarien** — Trainer demonstriert
   `claim-office-verification/scenarios/` als Akzeptanztests

### Tipps für den Trainer

- **Antworten erst auf rote Karten geben, wenn sie gestellt werden.**
  Wenn die Gruppe eine Mehrdeutigkeit nicht selbst entdeckt, ist das
  Teil der Erfahrung — der "PO" weist erst beim Implementieren auf
  Lücken hin.
- **In-Character bleiben.** Der Trainer ist nicht Trainer, sondern
  *der Sachverständige der HPSMV*. Bürokratisch, leicht passiv-
  aggressiv, mit Hinweisen auf "die Hausordnung".
- **Bei Konflikten zwischen Gruppen-Festlegung und HPSMV-Festlegung:**
  flexibel sein. Wenn die Gruppe konsistent eine andere Lesart wählt
  und in sich schlüssig bleibt, ist das didaktisch wertvoll. Die
  Verifikations-Szenarien können dann als "alternative HPSMV-Filiale"
  präsentiert werden.
- **Numerik nicht überstrapazieren.** Bei Workshop-Zeitdruck reicht
  es, wenn die Regeln *qualitativ* korrekt umgesetzt werden — die
  exakten Goldstücke kann der Trainer nachrechnen.

### Häufige Stolpersteine

- **Versicherungswert ≠ Prämie:** Teilnehmer verwechseln häufig
  Versicherungswert (= was der Cap-Bezug ist) mit Grundprämie. Im
  Mapping sollte das früh geklärt werden.
- **Modifikator-Verrechnung:** zwischen additiv und multiplikativ wird
  oft hin- und hergeschwankt. Trainer kann mit Beispiel-Berechnung
  pinnen.
- **F'-Konflikt:** wird oft übersehen, dass beide Klauseln
  gleichzeitig greifen können. Hinweis-Beispiel "Drachenschwert mit
  Stufe 9" hilft.
- **"alike":** Teilnehmer interpretieren manchmal als "gleiche
  Kategorie" (alle Runen alike). Trainer pinnt Typ-genau.

## Verifikations-Szenarien als Trainings-Material

Die 15 Szenarien in `claim-office-verification/scenarios/` lassen sich
nach dem Mapping als **Akzeptanztests** vorzeigen:

- Stage 1 (01–07): pro Mehrdeutigkeit ein Test → für Diskussion
  einzelner Regel-Auflösungen
- Stage 2 (08–11): kombinierte Tests → zeigen Wechselwirkungen
- Stage 3 (12–15): Story-Szenarien → für Workshop-Wiederverwendung
  besonders geeignet, jede Story hat eine `*.story.md` mit Erzählung

Beispiele für Story-Verwendung im Workshop:
- **Krieger Garras** (12) — alle Item-Typen, mehrere Policen, Drachenangriff
- **Magus Velorin** (13) — Komponenten-Block, mehrere Policen
- **Familie Steinheim** (14) — mehrere Items derselben Art
- **Pechvogel Tordan** (15) — Cap-Erschöpfung über viele Schäden

## Hinweise zur Tonalität

Die HPSMV ist als *bürokratisch-knausrige Versicherung* konzipiert.
Beim Antworten auf rote Karten:

- Festlegungen tendenziell zu Gunsten der HPSMV (kleinere Sets, höhere
  Prämien, geringere Auszahlungen).
- Sprachlich neutral oder leicht beamtisch — keine emotionale
  Begründung, sondern "die Hausordnung sagt", "das ist seit 1612 so",
  "der Sachverständige hat entschieden".
- Bei Detail-Fragen *nicht* sofort die volle Antwort liefern — erst
  klären, ob die Gruppe selbst zu einer Lesart kommt. Erst wenn
  blockiert, mit der HPSMV-Festlegung antworten.
