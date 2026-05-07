# Anforderungen an eine neue Kata

Arbeitsdokument zur Definition einer Kata, die als besseres Beispiel für die
Workflow-Experimente dient. Stand: 2026-05-07. Status: in Diskussion.

## Hintergrund / Problem

Die aktuell verwendeten Katas (`game-of-life`, `mars-rover`) sind in den
Trainingsdaten der Modelle enthalten. Das verzerrt die Messung der
Workflow-Effekte:

- Modelle "kennen" die kanonische Lösung — Refactoring-Effekte werden überdeckt.
- Example-Mapping-Effekte sind schwer zu zeigen, weil das Modell bei
  mehrdeutigen Regeln auf gelernte Standard-Interpretationen zurückfällt.

Wir brauchen eine **selbst erfundene Aufgabe**, die nicht im Training auftaucht
und gleichzeitig die didaktischen Eigenschaften erfüllt, die wir messen wollen.

## Anforderungen

### 1. Komplexität

- **Komplexer als Game of Life** (>30 LoC Lösung, mehr Verzweigungen).
- Genug Substanz, damit **Refactoring-Effekte sichtbar** werden — idealerweise
  deutlicher als bei GoL.
- Nicht ins Bodenlose: muss in einer typischen Run-Zeit (10–20 min) lösbar
  bleiben.

### 2. Originalität

- **Selbst erfunden**, nicht "obskure existierende Kata".
- Keine bekannten Katas mit Twist (z.B. GoL auf Hex-Grid) — auch das könnte
  noch im Training sein.

### 3. Domäne

- Egal (algorithmisch, Business-Logik, State Machine …), Hauptsache die
  anderen Anforderungen sind erfüllt.
- Faustregel: Business-Logik hat oft weniger "kanonische Lösung" im Training,
  aber das ist sekundär.

### 4. TDD- und Toolchain-Tauglichkeit

- TypeScript + Vitest (passt zur bestehenden Pipeline).
- Klare Akzeptanzkriterien, deterministisch testbar.
- **Keine Infrastruktur im Test-Scope**: Die gesamte Aufgabe muss sich als
  **interne programmatische API** abbilden lassen (reine Funktionen / Klassen,
  In-Memory-Datenstrukturen). Kein UI, kein HTTP, keine Datenbank, keine
  Filesystem-/Netzwerk-IO, keine Zeit-/Zufalls-Abhängigkeiten, die gemockt
  werden müssten. Tests rufen die API direkt auf und prüfen Rückgabewerte
  oder Zustand.
- In allen drei Prompt-Stilen (prose / user-story / example-mapping)
  sinnvoll beschreibbar.

### 5. Example-Mapping-Sensitivität (Kern-Anforderung)

Die Aufgabe muss **mehrere Mehrdeutigkeiten** enthalten, an denen sich der Wert von
Example-Mapping zeigt. Eine harte Mindest- oder Maximalzahl ist nicht
festgelegt — ausschlaggebend ist, dass genug Mehrdeutigkeit vorhanden ist,
um den Effekt messbar zu machen, und dass die Aufgabe insgesamt nicht
überfrachtet wird. Eine "Mehrdeutigkeit" hat folgende Struktur:

- Die Regel-Formulierung lässt **zwei (oder mehr) plausible Auslegungen**
  zu, die aus den Regeln **gleichermaßen konsistent ableitbar** sind.
- Welche Auslegung in der Domäne gilt, ist eine **Festlegungs-Entscheidung**
  der Fachexperten — kein Reasoning-Defizit eines unbedarften Lesers. Zwei
  kompetente Entwickler ohne Domänenwissen würden plausibel
  unterschiedlich entscheiden.
- Ein konkretes Beispiel ist die **Spezifikation**, die festlegt, welche
  Auslegung gilt. Das Beispiel ist nicht Lehrmittel, sondern verbindliche
  Wahl.

**Was die Regeln NICHT tun dürfen:**

- Keine versteckten Mechanismen einführen, die nicht in den Regeln
  beschrieben sind. Beispiele dürfen keine *neuen* Regelaspekte aufdecken
  — nur eine *Auslegung* festlegen.
- Keine Regel-Formulierung, die selbst auf die Mehrdeutigkeit hinweist
  ("X kann Y beeinflussen"). Solche Formulierungen zeigen an, dass
  Klärung nötig ist — Example-Mapping wird trivial.
- Es muss nicht eine "richtige" und eine "falsche" Auslegung geben.
  Bevorzugt: **zwei gleichberechtigte plausible Auslegungen**, von denen
  das Beispiel eine festschreibt.

**Indikator für eine gute Mehrdeutigkeit:** Wenn zwei kompetente Personen die Regel
unabhängig voneinander lesen und unterschiedliche Auslegungen wählen, ist
das *kein* Defekt der Mehrdeutigkeit, sondern ihre Stärke — sie zeigt, dass die
Aufgabe ohne Beispiele objektiv unterspezifiziert ist. Erwartung im
Experiment: ohne Beispiele *streuen* die Modell-Antworten zwischen den
Auslegungen, mit Beispielen *konvergieren* sie.

**Zulässige Konstruktions-Muster:**

A. **Kombination zweier in-sich-klarer Regeln** — beide Regeln eindeutig,
   ihre Anwendung auf einen Grenzfall hat zwei konsistente Auslegungen.
   (Vorbild: Overlords, "wie viele Punkte sind 4 Chimeras?".)
B. **Unterspezifizierte Operation** — eine Regel benennt einen Effekt,
   lässt aber Anwendungs-Reihenfolge / Bezugsgröße / Operator offen, ohne
   darauf hinzuweisen.
C. **Begriffs-Doppeldeutigkeit zwischen Stakeholdern** — derselbe Fachbegriff
   wird in zwei Welten unterschiedlich gefüllt; die Regel benutzt ihn ohne
   Disambiguierung.
D. **Konkurrenz mehrerer Regeln** — mehrere Regeln treffen gleichzeitig zu,
   es ist nicht gesagt, welche dominiert.

**Negativ-Beispiel (versteckte Information):** Eine Regel "Verfluchte
Gegenstände können das Verhalten ihres Trägers beeinflussen" plus eine
Frage zum Eigenverschulden. Die Regel selbst signalisiert "hier fehlen
noch Details" — der Leser fragt sofort nach. Die Mehrdeutigkeit funktioniert nur,
weil Information *vorenthalten* wird, nicht weil die Auslegung mehrdeutig
ist. Das ist trivial: natürlich kann ein Modell nicht raten, was nicht
dasteht.

#### Muster für Example-Mapping-Mehrdeutigkeiten

Sammlung möglicher Strukturen, an denen Mehrdeutigkeit erzeugt werden kann.
Nur als Denk-Anregung, nicht abschließend:

1. **Tie-Breaking / Gleichstand**: Eine Sortier-/Ranking-Regel, die bei
   Gleichstand nicht das Offensichtliche tut (z.B. nicht "der Erste gewinnt",
   sondern "beide verlieren" oder "der mit der niedrigeren ID").
2. **Edge-of-Range / Inklusiv-vs-Exklusiv**: Regel sagt "zwischen 10 und 20" —
   Beispiel zeigt, dass 10 zählt, 20 nicht (oder umgekehrt).
3. **Reihenfolge bei Mehrfach-Treffern**: Mehrere Regeln greifen gleichzeitig —
   welche gewinnt? Naive Annahme: erste Regel. Tatsächlich: spezifischere /
   höher-priorisierte.
4. **Aggregation mit Ausnahme**: "Summe aller X" — Beispiel zeigt, dass eine
   Kategorie gar nicht in die Summe eingeht.
5. **Negation / Abwesenheit**: Regel definiert positiven Fall, lässt offen,
   was bei Abwesenheit passiert (Default vs. Fehler vs. neutral).

### 6. Workshop-Tauglichkeit (ExactCoding-Workshop) — *nice to have*

> **Priorität (2026-05-07):** runtergestuft. Research-Tauglichkeit
> (Anforderungen 1, 2, 4, 5) hat Vorrang. Wenn die Kata sich für den
> Workshop als zu schwer erweist, kann dort auf ein anderes Beispiel
> zurückgegriffen werden. Workshop-Anforderungen 6 + 7 dienen als
> Tie-Breaker, nicht als Ausschlusskriterium.

Die Kata **kann** auch im **ExactCoding-Workshop** einsetzbar sein.
Daraus folgen zwei Domänen-Anforderungen:

- **Zugänglich für Alltags-Background**: Teilnehmer müssen sich in
  praktikabler Zeit (wenige Minuten Erklärung) in die Domäne einfinden können.
  Keine hochspezialisierten Fachgebiete, die Vorwissen voraussetzen
  (z.B. Steuerrecht, Medizin, Finanz-Derivate).
- **Trotzdem speziell genug für Fachexperten-Wissen**: Die Domäne darf
  *Spezifika* haben, die nicht aus dem Alltag ableitbar sind — genau das ist
  der Hebel, an dem Example-Mapping seinen Wert zeigt
  (Fachexperte kennt die Regel, Leser ohne Beispiele rät anders). Die Spezifika dürfen
  aber nicht das Verständnis der Grundsituation blockieren.

Faustregel: Ein Teilnehmer soll nach 2–3 Minuten Domänen-Erklärung
sagen können "ah, ich verstehe worum es geht" — die *Feinheiten*
(= die Example-Mapping-Mehrdeutigkeiten) bleiben dann trotzdem überraschend.

### 7. Spaßfaktor / Spielerischkeit — *nice to have*

> **Priorität (2026-05-07):** ebenfalls runtergestuft, gemeinsam mit
> Anforderung 6. Tie-Breaker, kein Ausschlusskriterium.

Die Domäne sollte für Workshop-Teilnehmer **Spaß machen** — spielerisch,
charmant, leicht augenzwinkernd. Begründung: hält die Energie im Workshop
hoch und macht die Auseinandersetzung mit den Example-Mapping-Mehrdeutigkeiten
attraktiver.

- **Positiv-Referenz**: Das aktuell genutzte *Overlords*-Kartenspiel im
  Workshop hat diese Anforderung gut erfüllt — nur war es für die übrigen
  Anforderungen (insbesondere Komplexität, Refactoring-Substanz) zu einfach.
- **Grenze nach unten / "seriös genug"**: Die Domäne darf nicht so albern
  oder geschmacklos sein, dass sie **seriöse Wissenschaftler verschreckt**
  oder als gesellschaftlich untauglich gilt. Kein Glücksspiel-Framing,
  keine Gewalt-/Kriegs-Thematik als Hauptmotiv, keine politisch oder
  ethisch heiklen Domänen.

Sweet Spot: Spielartig (Karten, Brettspiel, Puzzle, fiktive Wettbewerbe,
fiktive Wesen / Welten), thematisch harmlos, mit Charakter.

#### Leitmotiv: Parodie echter Business-Domänen

Bevorzugt werden Domänen, die als **ironische Parodie / Fantasy-Variante
einer echten Business-Domäne** erkennbar sind (z.B. Logistik als
Drachen-Postzustellung, Versicherung für magische Gegenstände,
Automatisierung als Robotik-Werkstatt).

Vorteile:

- Workshop-Teilnehmer erkennen, dass die Probleme in ähnlicher Form
  *real* in ihrer Arbeit auftauchen — die Übung wirkt relevant statt
  beliebig.
- Das ironische Framing schützt vor dem "trocken-business"-Eindruck und
  legitimiert komplexe Sonderregeln (Fachexperten-Wissen kommt
  glaubwürdig rüber).
- Vorzugsweise Domänen, die bei codecentric-Kunden oder als eigene
  Kerndomäne (z.B. Automatisierung) ohnehin verbreitet sind.

Bezug zur Domänen-Auswahl siehe [kata-domain-ideas.md](kata-domain-ideas.md).

### 8. Validierung "nicht im Training" — offen

Wie prüfen wir, dass eine Aufgabe wirklich nicht im Training ist?
Optionen, noch zu diskutieren:

- "Schreib mir eine TypeScript-Lösung für X ohne Tests" → schauen, ob das
  Modell sofort eine Standard-Lösung kennt.
- Suche nach Schlüsselbegriffen der Aufgabe in öffentlichen Quellen.
- Mehrere Modelle querchecken.

## Offene Punkte

- [ ] Validierungs-Hebel für "nicht in Trainingsdaten" festlegen.
- [ ] Weitere Anforderungen sammeln (User: "es gibt noch mehr").
- [ ] Domänen-Brainstorming, sobald alle Anforderungen stehen.
- [ ] Konkrete Mehrdeutigkeits-Liste (3–5 Stück) entwerfen, sobald Domäne steht.
