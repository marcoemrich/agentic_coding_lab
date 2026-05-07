# Kata Construction

Methodik und Learnings für den Bau von Kata-Aufgaben in diesem Repo.
Zielgruppe: zukünftige Claude-Code-Instanzen, die eine neue Kata bauen
oder eine bestehende erweitern. Stand: 2026-05-08.

Konkrete Beispiele sind aus der HPSMV-Versicherungs-Kata
(`experiments/katas/claim-office-*` und `research/kata-design/kata-mehrdeutigkeiten.md`).

## Worum es geht

Eine Kata ist eine Programmieraufgabe, mit der Workflows verglichen
werden (TDD-Stile, Modell-Versionen, Prompt-Stile). Sie soll
Refactoring-Substanz haben (komplexer als Game of Life), realistisch
genug sein, dass mehrdeutige Spezifikationen vorkommen, und in mehreren
Prompt-Stilen (`prose`, `user-story`, `example-mapping`) inhaltlich
äquivalent formulierbar sein.

Verifikation läuft über eine sprach-unabhängige CLI-Schicht (siehe
[Verifikations-Architektur](#verifikations-architektur)).

## Vorgehen beim Bauen einer neuen Kata

Diese Reihenfolge hat sich bewährt:

1. **Anforderungen** klären (Komplexität, Domäne, Original­ität,
   Spaß-/Workshop-Eignung). Siehe `kata-requirements.md`, falls neu
   geschrieben werden soll.
2. **Domäne** wählen — gerne als ironische Parodie einer realen
   Business-Domäne. Siehe [Domänen-Modellierung](#domänen-modellierung).
3. **Operationen und Datenmodell** entwerfen — kohärenter Lebenszyklus
   mit gemeinsamem Zustand, nicht eine lose Funktionsmenge. Siehe
   [Aufgaben-Kohärenz](#aufgaben-kohärenz).
4. **Mehrdeutigkeiten benennen** — pro Mehrdeutigkeit benennen,
   Lesarten ausschreiben, Konstruktions-Muster wählen. Siehe
   [Mehrdeutigkeits-Konstruktion](#mehrdeutigkeits-konstruktion).
5. **Vortest (Ambiguitäts-Probe)** durchführen, um zu prüfen, ob die
   Mehrdeutigkeiten wirklich mehrdeutig sind. Siehe
   [Vortest](#vortest-ambiguitäts-probe).
6. **Festlegungen** wählen — pro Mehrdeutigkeit eine Lesart als
   Standard-Auslegung, mit konsistenter Tonalitäts-Linie. Siehe
   [Festlegungs-Strategien](#festlegungs-strategien).
7. **Trivial-Regeln** drumherum entwerfen — Validierung, Defaults,
   einfache Berechnungen, die der Aufgabe Refactoring-Substanz geben.
8. **Drei Prompt-Stile** schreiben, inhaltlich äquivalent. Siehe
   [Drei Prompt-Stile](#drei-prompt-stile).
9. **Verifikations-Szenarien** schreiben (separat von der
   Aufgabenstellung). Siehe
   [Verifikations-Architektur](#verifikations-architektur).
10. **Pre-Publish-Checkliste** durchgehen. Siehe
    [Checkliste](#checkliste-vor-dem-veröffentlichen).

## Aufgaben-Kohärenz

**Eine Kata muss eine zusammenhängende Erzählung sein, kein loser
Funktions-Korb.** Game of Life hat einen Zustand (Grid), Mars Rover
hat Position und Orientierung. Operationen sind Transitionen auf
diesem Zustand.

Wenn eine Kata mehrere Operationen hat, müssen sie auf einem
gemeinsamen Zustand arbeiten — sonst sind es drei kleine Aufgaben
unter einem Domänen-Hut.

**Beispiel HPSMV:** Die Kata hat zwei Operationen `quote` und `claim`,
die beide auf einer Police arbeiten. Die Police trägt
Versicherungssumme, Cap-Verbrauch, Item-Liste. `claim` aktualisiert
sie, `quote` legt sie an.

**Anti-Pattern: Lifecycle-Operationen ohne eigene Mehrdeutigkeit.** Wir hatten
zunächst eine `renewPolicy`-Operation, die ausschließlich Mehrdeutigkeit B
(Cap-Reset bei Verlängerung) trug. Sie war erzählerisch deplaziert
("zwischen `quote` und `claim` plötzlich ein Verwaltungs-Akt") und
trug fachlich nichts. Korrektur: weglassen, Mehrdeutigkeit B verwerfen, weil
die Kata ohne sie genug Komplexität hatte.

→ **Regel:** Eine Operation ohne eigene fachliche Logik gehört nicht
in die Kata, auch wenn sie methodisch (für eine Mehrdeutigkeit) "praktisch"
wäre.

## Domänen-Modellierung

### Tonalitäts-Linie

**Eine konsistente Tonalität bindet die Festlegungen.** Sonst wirken
sie willkürlich. Bei der HPSMV: bürokratisch-streng, knauserig,
selbstadelig. Festlegungen interpretieren Mehrdeutigkeit zu Gunsten
der Versicherung.

Eine klare Tonalität hilft auch beim Schreiben des Settings (Name der
Institution, Sprache der Beispiele, Witz-Charakter).

### Getrennte Konzepte sauber halten

**Realwelt-Begriffe haben oft mehrere Werte/Konzepte, die in der
Kata unterschieden werden müssen.** Sonst entsteht versehentliche
Verwirrung, die nicht als Mehrdeutigkeit gewollt war.

**Beispiel HPSMV:** Wir hatten zunächst Versicherungswert und Prämie
zu einem einzigen Wert verschmolzen — der "Grundpreis" eines Schwerts
war 100 G und galt sowohl für Prämienberechnung als auch für den Cap.
Das ist real-versicherungs-technisch falsch. Korrektur: zwei Werte
pro Item (Versicherungswert + Grundprämie), Verhältnis 10:1.

→ **Regel:** Wenn die Realwelt zwischen zwei Konzepten unterscheidet,
sollte die Kata es auch tun.

### Numerische Konsistenz

**Konkrete Zahlen in der Aufgabenstellung müssen sich kohärent
ausrechnen lassen.** Inkonsistenzen werden zu unbeabsichtigten
Mehrdeutigkeiten.

**Beispiel HPSMV:** Wir hatten zunächst "Bonuspreis 80 G für 3
Komponenten", aber 3 Einzel-Komponenten kosteten 75 G — der "Bonus"
war ein Aufschlag. Modelle entdeckten diese unbeabsichtigte
Mehrdeutigkeit ("Pauschalpreis vs. zusätzlich"). Korrektur: Block-Preis
auf 60 G gesenkt, sodass das Set tatsächlich günstiger ist. Bonus:
die HPSMV-Festlegung "kein Block bei ≠ exakt 3" wird damit zur
*teuersten* Lesart, was die Knauserei-Tonalität verstärkt.

→ **Regel:** Vor dem Veröffentlichen alle Werte einmal komplett
durchrechnen, nicht nur die Headline-Beispiele. Inkonsistenzen
werden sonst zu Mess-Lärm.

### Eingabe-Schema zeigt keine Lesart an

**Das API-Schema darf eine Mehrdeutigkeit nicht durch seine Felder
vor-entscheiden.** Sonst liegt die Mehrdeutigkeit nicht im Verhalten,
sondern in der Datenstruktur — und die ist meist eindeutig.

**Beispiel HPSMV:** Wir hatten zunächst ein Feld `existingContracts: 3`
im Customer-Block. Das *gibt die Antwort schon vor* zu Mehrdeutigkeit C
(Erstversicherung kunden- vs. sachbezogen): wer "existingContracts: 3"
liest, weiß sofort, dass es nicht der erste Vertrag des Kunden ist.
Korrektur: Feld entfernt, Folgevertrag wird aus der Step-Sequenz im
Szenario abgeleitet.

→ **Regel:** Beim Schema-Entwurf prüfen: würde ein bestimmtes Feld
eine Lesart einer Mehrdeutigkeit automatisch entscheiden? Wenn ja, anders
modellieren.

## Mehrdeutigkeits-Konstruktion

### Was eine gute Mehrdeutigkeit leistet

1. **Zwei (oder mehr) plausible Auslegungen** sind aus den Regeln
   gleichermaßen konsistent ableitbar.
2. **Keine Lesart ist offensichtlich "richtig"** — beide klingen für
   einen sachverständigen Leser gleichwertig. Welche in der Domäne
   gilt, ist eine Festlegungs-Entscheidung der Fachexperten.
3. Das **Beispiel ist die Spezifikation**, nicht ein Lehrmittel. Es
   *legt fest*, welche Auslegung gilt — ohne neue Regelaspekte
   einzuführen.
4. Das **API-Schema bleibt neutral** (siehe oben).

### Indikator: zwei kompetente Personen wählen unterschiedlich

Wenn zwei kompetente Personen die Regeln unabhängig voneinander lesen
und unterschiedliche Auslegungen wählen, ist das **kein Defekt der
Mehrdeutigkeit, sondern ihr Qualitätsmerkmal**. Es zeigt, dass die Aufgabe
ohne Beispiele objektiv unterspezifiziert ist.

Beim Entwurf hilft: die eigene Lesart hinterfragen. Wenn man bei
"Default-Lesart = X, Festlegung = Y" festhängt, ist die Mehrdeutigkeit wahrscheinlich noch
in der "Default-vs.-Festlegung"-Form. Umformulieren, bis beide Lesarten
*gleich plausibel* klingen.

### Konstruktions-Muster

Vier Muster, an denen Mehrdeutigkeit entstehen kann, ohne in die
"versteckte Information"-Sackgasse zu laufen.

**Muster A — Kombination zweier in-sich-klarer Regeln.** Beide
Regeln sind eindeutig und definieren je einen abgeschlossenen
Sachverhalt. Ihre Anwendung auf einen *Grenzfall* hat zwei
konsistente Auslegungen.

*Beispiel:* "3 Chimeras = Set, 12 Punkte" + "Einzelne Chimera =
2 Punkte". Frage: "Wie viele Punkte sind 4 Chimeras?" → 8 (alle
einzeln, weil 4 ≠ 3) oder 14 (1 Set + 1 Einzel). Beide ableitbar.

**Muster B — Unterspezifizierte Operation.** Eine Regel benennt
einen Effekt, lässt aber Anwendungs-Reihenfolge, Bezugsgröße oder
Operator offen — ohne darauf hinzuweisen.

*Beispiel:* "+50 % Risikozuschlag, +30 % Risikozuschlag, 20 %
Treuerabatt." Additiv? Multiplikativ? Worauf bezieht sich der
Rabatt — Grundpreis oder Endpreis? Reihenfolge?

**Muster C — Begriffs-Doppeldeutigkeit.** Derselbe Fachbegriff wird
in zwei Welten unterschiedlich gefüllt; die Regel benutzt ihn ohne
Disambiguierung.

*Wichtig:* Der Begriff muss **selbst doppeldeutig** sein, ohne
präziseren Bruder. "Vertragsjahr" ist *kein* gutes Beispiel, weil
"Kalenderjahr" als sprachliche Disambiguierung existiert — das ist
keine echte Mehrdeutigkeit, sondern Schludrigkeit. Gute Begriffe sind
im Fachgebrauch genuin mehrwertig: "Police", "Schadensereignis",
"Erstversicherung".

**Muster D — Konkurrenz mehrerer Regeln.** Mehrere Regeln treffen
gleichzeitig zu, es ist nicht gesagt, welche dominiert.

*Wichtig:* Die Regeln dürfen keine eingebauten Vorrang-Signale
enthalten ("in jedem Fall", "vorrangig", "es sei denn"). Beide
müssen neutral formuliert sein.

### Wegweiser-Vokabular

**Bestimmte Formulierungen zeigen die Mehrdeutigkeit selbst an oder lenken
zu einer bestimmten Lesart.** Sie machen die Mehrdeutigkeit trivial — der
Leser fragt sowieso, oder die Modelle konvergieren auf die
gewegweiserte Lesart. Vermeiden:

- **Hinweis-Formulierungen:** "X kann Y beeinflussen", "kann auch
  bedeuten", "je nach Auslegung". Verraten, dass eine Klärung nötig
  ist.
- **Vorrang-Signale:** "in jedem Fall", "vorrangig", "ungeachtet
  dessen", "es sei denn". Lösen den Konflikt im Regeltext.
- **Disambiguierungen:** "Vertragsjahr (nicht Kalenderjahr)",
  "ausschließlich pro Item". Heben die Mehrdeutigkeit auf.
- **Rahmungs-Adjektive:** "mindestens", "höchstens", "lediglich".
  Geben implizit eine Auflösung vor.

### Häufige Konvergenz-Ursachen

Wenn Modelle im Vortest auf eine Lesart konvergieren, liegt das oft
an sprachlichen Mustern, die unbewusst eingebaut wurden:

- **Wegweiser-Formulierung in einer zweiten Regel.** Eine Regel wie
  "Mehrere zusammenhängende Schäden werden gemeinsam reguliert"
  lenkt zur "ein Ereignis = eine SB"-Lesart.
- **Ausnahme-Vokabular schlägt Garantie-Vokabular.** "Verfluchte
  Gegenstände sind ausgenommen" wirkt härter als "Stammkunden
  erhalten auf alle Verträge". Modelle nehmen die Ausnahme ernster.
- **Bei Modifikator-Stapeln tendieren Modelle zu multiplikativ.**
  Additive Verrechnung wird selten gewählt, obwohl im Alltag
  (E-Commerce-Rabattcodes) verbreitet.
- **Bei Set + Einzelpreis: greedy max-Set-Bildung als Default.** Die
  "alles einzeln, weil ≠ exakt"-Lesart wird selten gewählt.

### Konstruktiv versteckte Information

**Es gibt schädlich versteckte und konstruktiv versteckte
Information.** Erstere ist verboten, letztere ist gewollt.

**Schädlich versteckt:** Information, die in den Regeln vorenthalten
wird, ohne dass der Leser eine Chance hat, das Defizit zu bemerken.
Das Beispiel führt einen *neuen Aspekt* ein, der aus den Regeln
allein nicht ableitbar ist (z.B. "Verfluchung beeinflusst
Eigenverschulden" — ohne dass die Regeln das andeuten). Solche
Beispiele sind trivial — vermeiden.

**Konstruktiv versteckt:** Information, die in den Regeln nicht
steht, aber an einem konkreten Beispiel als *sichtbare Lücke*
aufscheint — sodass ein aufmerksamer Entwickler stutzt und eine
Klärungsfrage stellt. Das ist gewollt: Example-Mapping deckt nicht
nur Mehrdeutigkeit in vorhandenen Regeln auf, sondern macht
*fehlende* Regeln sichtbar.

**Beispiel HPSMV:** Regel "Ein Bauteil-Block aus 3 gleichartigen
Komponenten". Das Wort *gleichartig* hat keine Definition. Beim
Beispiel "2 Feuer-Runen + 1 Eis-Rune → 75 G (kein Block)" stutzt der
Entwickler: aha, "gleichartig" heißt offenbar "gleicher Typ", nicht
"gleiche Kategorie". Die Information war nicht in den Regeln, das
Beispiel macht sie sichtbar — und ein guter Entwickler hätte schon
beim Lesen der Regeln die Klärungsfrage gestellt.

**Wann ist eine versteckte Information konstruktiv?** Wenn ein
Entwickler beim sorgfältigen Lesen der Regeln *erkennen kann, dass
eine Lücke existiert*. Bei "gleichartig" ist erkennbar, dass das
Wort unscharf ist. Bei "Verfluchung beeinflusst Eigenverschulden"
gibt es keinen Anker im Regeltext, an dem der Leser die Lücke
vermuten könnte.

**Edge Cases als konstruktiv versteckte Information.** PO denkt
Happy Path. Edge Cases (leere Liste, negative Werte, nicht
versicherte Items) werden im `prose`/`user-story`-Stil bewusst nicht
erwähnt — sie tauchen erst im `example-mapping` auf. Das ist
realistisch ("PO kennt nur den Happy Path") und macht die Übung
authentischer.

### Numerische Schwellen in Beispielen

**Wenn ein Beispiel eine numerische Schwelle festlegt, die in der
Regel nicht steht, ist das grenzwertig versteckte Information.**
Akzeptabel nur, wenn die *Existenz* der Schwelle aus dem Begriff
ableitbar ist (z.B. "wirtschaftlich reparabel" impliziert irgendeine
Schwelle). Konkret: tendenziell vermeiden.

### Drei oder mehr Lesarten

Eine Mehrdeutigkeit mit drei plausiblen Lesarten ist nicht schlechter als
eine mit zwei — im Gegenteil. Sie liefert ein klareres Mess-Signal:
ohne Beispiele sollten die Modell-Antworten über alle drei Lesarten
streuen.

### Trainings-Bekanntheit von Reasoning-Patterns

Eine Mehrdeutigkeit, deren *Form* bekannt ist (z.B. "Set + Einzelkarten" wie
in Overlords), aber deren Domäne neu ist, ist trotzdem zulässig. Wir
messen Domänen-Unbekanntheit, nicht Reasoning-Pattern-Unbekanntheit.

## Vortest (Ambiguitäts-Probe)

**Vor der Festlegung einer Mehrdeutigkeit: prüfen, ob sie wirklich mehrdeutig
ist.** Skript und Vorgehen unter `ambiguity-probe/`.

**Ablauf:**
- Pro Mehrdeutigkeit die Regeln plus eine konkrete Eingabe-Frage formulieren
- An mehrere Modell-Konfigurationen schicken (Opus / Sonnet / Haiku,
  mit / ohne thinking)
- Ohne Beispiele, mit Default-Temperatur, n=5 Wiederholungen
- Antworten manuell durch Lesen klassifizieren

**Erwartung:** ohne Beispiele streuen die Antworten zwischen den
Lesarten. Konvergenz auf eine Lesart bei allen Modellen = der
Maßstab "zwei plausible Lesarten" hat in der Praxis nicht gehalten.

**Auswertungs-Hinweis:** Begründung lesen, nicht nur die Endzahl.
Modelle (besonders Opus 4.7 mit thinking) machen häufig Rechenfehler
in der finalen Antwort, obwohl die Zwischenrechnung korrekt ist.

## Festlegungs-Strategien

Pro Mehrdeutigkeit muss eine Lesart als HPSMV-Standard (oder das domänen-
äquivalent) festgelegt sein. Drei Strategien, in absteigender
Präferenz:

**Streuung (bevorzugt).** Wenn der Vortest zeigt, dass die Modelle
zwischen den Lesarten streuen — idealerweise schon auf Opus / Sonnet,
mindestens auf Haiku — ist die Mehrdeutigkeit methodisch stark. Die Streuung
beweist, dass die anderen Lesarten auch für ein Modell plausibel
sind. Festlegung: das Beispiel pinnt eine *beliebige* der plausiblen
Lesarten fest. Mess-Signal kommt aus der Konvergenz *mit* Beispielen
gegenüber der Streuung *ohne*.

**Festlegung gegen die Konvergenz (Fallback).** Wenn der Vortest
Konvergenz aller Modelle auf eine Default-Lesart zeigt, ist die
Mehrdeutigkeit trotzdem brauchbar — solange die *gegen die Konvergenz
festgelegte* Lesart aus den Regeln plausibel ableitbar bleibt.
Mess-Signal: Modelle ohne Beispiele liegen zuverlässig "falsch" (im
Sinne der Festlegung), mit Beispielen folgen sie der Festlegung.

**Festlegung mit der Konvergenz (zu vermeiden).** Schwacher
Mess-Effekt — Beispiele bringen kaum Information, weil Modelle die
Lesart ohnehin treffen.

**Plausibilitäts-Check vor dem Fallback:** Die nicht-konvergente
Lesart muss aus den Regeln ohne Zusatzwissen ableitbar sein. Eine
Festlegung, die niemand aus den Regeln allein erschließen kann, ist
verstecktes Wissen — nicht Example-Mapping.

### Tonalitäts-Konsistenz

Festlegungen sollten nicht beliebig gewählt sein, sondern durch ein
gemeinsames Charakter-Motiv gebunden. Bei der HPSMV: bürokratisch-
streng, knauserig. Festlegungen interpretieren Mehrdeutigkeit zu
Gunsten der Versicherung. Ausnahme: einzelne kunden-freundliche
Festlegungen sind okay, wenn sie methodisch (z.B. gegen Konvergenz)
sinnvoller sind.

### Rechenfehler als TDD-Indikator

Auch wenn Rechenfehler beim Example-Mapping-Effekt nichts beitragen,
sind sie für die Kata insgesamt wertvoll. Im späteren Workflow-
Vergleich können sie als Prüfgröße dienen: Modelle ohne TDD machen
Rechenfehler in der finalen Antwort, Modelle mit TDD decken diese
durch laufende Tests auf.

→ **Tipp:** Eine Mehrdeutigkeit mit numerisch knappen Lesarten (z.B. 175 /
180 / 185) verstärkt diesen Effekt zusätzlich, weil Rechenfehler
wahrscheinlicher zu Lesart-Verwechslungen führen.

## Drei Prompt-Stile

**Drei inhalts-äquivalente Stile.** Alle Stile müssen *fachlich
identisch* sein, nur in der Form variieren:

- **`prose`** — erzählerischer Fließtext, der die Domäne wie ein PO
  beschreibt. Mehrdeutigkeiten implizit, keine Edge Cases erwähnt.
- **`user-story`** — eine User Story pro Operation, mit
  Acceptance-Criteria-Liste. Selbe fachliche Tiefe wie Prose, andere
  Form. Edge Cases ebenfalls nicht erwähnt.
- **`example-mapping`** — Regel-Liste plus Sticky-artige Beispiele.
  Beispiele klären die Festlegungen *konkret* (Werte). Edge Cases
  hier explizit gemacht.

### Sticky-Format für Example-Mapping

**Echte Example-Mapping-Beispiele sind kurze Sticky-Notes**, isoliert
pro Regel, nicht Akzeptanz-Tests mit komplettem JSON. Roh-Werte
(z.B. base premium ohne Modifikatoren) statt Endwerte. Wenige
Integrations-Beispiele am Ende für Regel-Wechselwirkungen.

Format: `<Eingabe-Beschreibung> → <Ergebnis>`, optional mit knapper
Begründung in Klammern. Für Beispiele, in denen *isoliert* eine
Regel sichtbar wird, reichen Roh-Werte. Wo Wechselwirkungen geklärt
werden müssen (Modifikator-Stapelung, Kunden-Historie), kommen
vollständige End-Werte.

Genau **ein** technisches JSON-Schema-Beispiel am Schluss klärt den
CLI-Vertrag — keine fachliche Beispielrechnung, sondern reine
Format-Demonstration.

### Drift zwischen Stilen vermeiden

**Drift zwischen den Stilen entsteht leicht.** Beispiele aus der
HPSMV-Konstruktion:

- "to the base premium" stand nur in `user-story`, nicht in `prose`
  — schärfte die Bezugsgröße ein in einem Stil, im anderen nicht
- "from the second contract onwards" vs. "each contract after their
  first" — sprachlich unterschiedlich, fachlich identisch (sollte
  einheitlich sein)
- Reihenfolge der Claim-Regeln (Cap vs. Deductible) variierte
  zwischen Stilen

→ **Regel:** Nach jeder Änderung an einem Stil prüfen, ob die
anderen mitgezogen werden müssen. Diff-Lesen aller drei Dateien
nebeneinander hilft.

### Aufgabenstellung enthält keine Lösungswerte

**Erwartete Ergebnisse gehören nicht in die Aufgabenstellung.** Wenn
das Modell die Lösungswerte sieht, kann es sie auswendig lernen
statt aus den Regeln abzuleiten.

In Schema-Beispielen: Eingabe als konkrete JSON-Daten, Ausgabe nur
als *Form* mit `<integer>`-Platzhaltern. Konkrete Werte erst in der
separaten Verifikations-Schicht.

Im `example-mapping`-Stil sind konkrete Beispielrechnungen okay —
das ist der Zweck dieses Stils. Aber die *Verifikations-Szenarien*
(separate Dateien) zeigen weitere Werte, die *nicht* in der
Aufgabenstellung stehen.

## Verifikations-Architektur

**Sprach-unabhängige Verifikation über CLI-Schicht.**

Die Aufgabenstellung definiert nur das *Verhalten* + ein
*Schnittstellen-Format* (stdin/stdout JSON), nicht die
Implementation. Die Implementation ist beliebig (TypeScript, Python,
Rust, …) — die Verifikations-Suite läuft als Black-Box gegen die CLI.

### Format

CLI liest JSON-Szenario von stdin, schreibt Ergebnis-JSON auf
stdout. Bei Fehlern: non-zero Exit-Code + stderr, kein stdout.

Szenario-Struktur:
```json
{
  "customer": {...},
  "steps": [
    {"op": "...", ...},
    {"op": "...", ...}
  ]
}
```

Ergebnis-Struktur:
```json
{"results": [{...}, {...}]}
```

`results`-Array hat dieselbe Länge und Reihenfolge wie `steps`.

### Getrennte Eingabe- und Erwartungs-Dateien

**Pro Szenario zwei Dateien:**
- `<name>.input.json` — wird per stdin in die CLI gefüttert
- `<name>.expected.json` — wird *nicht* an die CLI gegeben, dient
  nur der Verifikations-Suite zum Vergleich

**Warum getrennt:** Die CLI sieht nie erwartete Werte. Sie kann
nicht "schummeln". Die Verifikations-Suite kennt sie und vergleicht
nach dem Lauf.

### Verifikations-Suite

Bash-Skript oder ähnlich:
```bash
for scenario in scenarios/*.input.json; do
  name="${scenario%.input.json}"
  actual=$(claim-office < "$scenario")
  diff <(echo "$actual" | jq -S .) <(jq -S . "$name.expected.json")
done
```

Score: X von Y Szenarien bestanden. Pro Szenario ggf. teilweise
Punkte (welche Steps korrekt waren).

### Was die Aufgabenstellung sagt

Die Aufgabenstellung enthält:
- Anforderung "CLI executable mit JSON über stdin/stdout"
- Eingabe-Format (Strukturbeschreibung)
- Ausgabe-Format (Strukturbeschreibung)
- 1–2 Schema-Beispiele mit konkreter Eingabe und Form-Platzhaltern
  in der Ausgabe (`<integer>` statt Werte)

Die Aufgabenstellung enthält *nicht*:
- Konkrete Erwartungs-Werte zu den Schema-Beispielen
- Implementations-Vorgaben (Klassen-Namen, Modul-Struktur)

## Anti-Pattern-Sammlung

Kurz-Liste für Nachschlagen.

- **Festlegung mit der Modell-Konvergenz** → schwacher Mess-Effekt;
  lieber gegen die Konvergenz oder Streuung suchen
- **Beispiel führt einen neuen Aspekt ein, der nicht in den Regeln
  steht** → schädlich versteckt, vermeiden
- **Regel mit Wegweiser-Formulierung ("kann beeinflussen", "in jedem
  Fall")** → trivialisiert die Mehrdeutigkeit
- **Eingabe-Schema zeigt die Lesart selbst an** (z.B. `existingContracts`-Feld
  beim Erstversicherungs-Streit) → umbauen
- **Lifecycle-Operation ohne eigene Mehrdeutigkeit** → weglassen, Aufgabe
  bleibt schlanker
- **Erwartete Werte in der Aufgabenstellung** → in separate
  Verifikations-Dateien auslagern
- **Domänen-Konzepte verschmolzen, die Realwelt trennt** (z.B.
  Versicherungswert + Prämie als ein Wert) → trennen
- **Numerische Inkonsistenz** ("Bonuspreis 80 G" bei 3×25=75 G) →
  vor Veröffentlichung durchrechnen
- **Drift zwischen den Prompt-Stilen** → nach jeder Änderung
  Cross-Check aller drei Stile
- **Vorrang-Signale in Konkurrenz-Regeln** ("in jedem Fall
  mindestens", "ausschließlich") → neutralisieren

## Checkliste vor dem Veröffentlichen

Pro Kata abhaken:

- [ ] Aufgaben-Kohärenz: alle Operationen arbeiten auf gemeinsamem
  Zustand; keine Lifecycle-Operation ohne eigene Mehrdeutigkeit
- [ ] Tonalitäts-Linie konsistent über alle Festlegungen
- [ ] Numerische Werte alle einmal komplett durchgerechnet, keine
  unbeabsichtigten Inkonsistenzen
- [ ] Eingabe-Schema entscheidet keine Lesart vor
- [ ] Pro Mehrdeutigkeit Vortest durchgeführt, Festlegungs-Strategie gewählt
- [ ] Wegweiser-Vokabular eliminiert (siehe Liste)
- [ ] Konstruktiv versteckte Information identifiziert (welche
  Lücken sind im `example-mapping` zu klären?)
- [ ] Drei Prompt-Stile geschrieben, fachlich äquivalent (Diff-Check)
- [ ] Aufgabenstellung enthält keine Lösungswerte
- [ ] Schema-Beispiele zeigen Form ohne Werte
- [ ] Verifikations-Szenarien als getrennte Input/Expected-Dateien
- [ ] Edge Cases nur im `example-mapping`-Stil, nicht in
  `prose`/`user-story`
