# Mehrdeutigkeiten für die Versicherungs-Kata

Konkrete Mehrdeutigkeits-Entwürfe für die Domäne "HPSMV — Versicherung
für magische Gegenstände". Stand: 2026-05-07. Bezugsdokumente:
[kata-requirements.md](kata-requirements.md),
[kata-domain-ideas.md](kata-domain-ideas.md),
[kata-construction.md](kata-construction.md).

## Setting

**Hochwohllöbliche Privilegierte Schadenskasse für Magische Risiken
und Verfluchte Gegenstände** — kurz **HPSMV**. Versicherung für
magische Gegenstände, in der Tradition selbstadelnder behördlicher
Anstalten, mit dem entsprechenden Hang zu kleingedruckter Strenge und
Bearbeitungsgebühren. Das System unterstützt zwei Operationen:

- `quote(items, customer) → premium` — Prämie berechnen für eine Liste
  von Items (Hauptgegenstände wie Schwerter/Amulette und
  Bewertungs-Komponenten wie Runen/Edelsteine, gemischt zulässig).
- `claim(policy, incident) → payout` — Schadensregulierung gegen eine
  Police.

Hauptgegenstände haben Eigenschaften (Material, Verzauberungs-Stufe,
Fluchstatus). Komponenten haben Typ und werden in Mengen versichert.
Kunden haben eine Vertragshistorie.

(`renewPolicy` als dritte Operation und Mehrdeutigkeit B (Cap-Reset bei
Verlängerung) wurden 2026-05-07 verworfen — Aufgabe hatte ohne sie
genug Komplexität, und Lifecycle-Verwaltung wirkte erzählerisch
deplaziert. Siehe Verworfene Kandidaten weiter unten.)

## Festlegungen für die finale Kata (2026-05-07)

Pro Mehrdeutigkeit ist eine Lesart als **HPSMV-Standard** festgelegt.
Tonalität: bürokratisch-streng, Versicherung interpretiert Mehrdeutigkeit
zu ihren Gunsten.

| Mehrdeutigkeit | Festlegung | Beispiel-Wert |
|---|---|---|
| A | L1 — Block nur bei *exakt* 3 Komponenten, sonst alles einzeln | 7 Runen → 175 G |
| B₂ | L2 — Selbstbeteiligung *pro Item*, nicht pro Ereignis | Drachenangriff 500 + 300, 2×100 SB → 600 G |
| C | L2 — "Erstversicherung" sachbezogen (pro Gegenstand) | Stammkunde + neues Item: +10 % UND −15 % gleichzeitig |
| D | L1 — Modifikatoren werden *additiv* auf Grundpreis angewandt | alle Prozentsätze addiert/subtrahiert |
| F' | L1 — Risiko-Schwelle (Stufe ≥ 8) schlägt Material-Klausel | 50 %-Erstattung gewinnt gegen "Drachenmaterial voll" |

**Verschränkungen:** C und D wirken beide auf `quote` und stapeln sich.
Mit der additiven Festlegung (D-L1) und der sachbezogenen Festlegung
(C-L2) entsteht eine konsistente Berechnung — alle Modifikatoren wirken
additiv auf den Grundpreis, jeder zählt genau einmal. Der "Treuerabatt
20 %" aus D und der "Rabatt 15 % ab zweitem Vertrag" aus C sind zwei
*unterschiedliche* Rabatte und stapeln sich.

Beispiel: Stammkunde 3 Jahre, neuer Vertrag, verfluchtes Stufe-7-Schwert,
Grundpreis 100 G:
100 + 50 (Fluch) + 30 (Verzauberung) − 20 (D-Treuerabatt) +
10 (C-Erst-Aufschlag) − 15 (C-Rabatt) = **155 G**.

## Items, Komponenten und Aggregation

Zwei klar getrennte Item-Typen:

- **Hauptgegenstände** (Schwert, Amulett, Stab, …): haben Material,
  Verzauberungsstufe, Fluchstatus.
- **Komponenten** (Feuer-Rune, Eis-Rune, Mond-Edelstein, …): haben Typ
  und Anzahl, werden gesammelt versichert.

Die Aggregation für Mehrdeutigkeit A (Block-Bildung) erfolgt **pro Komponenten-Typ**.
3 Feuer-Runen + 2 Eis-Runen ergibt keinen Block (jeder Typ < 3); 3 Feuer +
3 Eis ergibt zwei Einzel-Blöcke.

**Sub-Mehrdeutigkeit Aₐ — "gleichartig" als Begriff:** Festlegung *gleichartig =
gleicher Typ-Bezeichner*. Feuer-Rune und Eis-Rune sind nie gleichartig,
auch wenn beide "Runen" sind. Diese Festlegung steht **bewusst nicht**
in den Regeln — sie ist ein Beispiel für *konstruktiv versteckte
Information*, die der Entwickler beim Lesen der Beispiele als Klärungs-
frage entdecken soll. Methodisch ist das Muster C (Begriffs-
Doppeldeutigkeit), realisiert als siebte (Sub-)Mehrdeutigkeit unter A.

Beispiel im Example-Mapping: "2 Feuer-Runen + 1 Eis-Rune → 75 G (kein
Block, weil ≠ gleicher Typ)".

## Trivial-Regeln (Mystische-Mutuale-Standards)

Eindeutige Verhalten, die in der Aufgabenstellung als reguläre Regeln
oder als implizite Annahmen mitgegeben werden. Sie geben der Aufgabe
Refactoring-Substanz und sind die Stationen, an denen TDD seinen
Tagesablauf zeigt.

### `quote`

- **Tabelle** für Hauptgegenstände mit Versicherungswert und Grundprämie:
  Schwert 1000 G / 100 G, Amulett 600 G / 60 G, Stab 800 G / 80 G,
  Trank 400 G / 40 G. Allgemeines Verhältnis: Grundprämie = 1/10 des
  Versicherungswerts.
- **Komponenten** einheitlich Versicherungswert 250 G, Grundprämie 25 G
  pro Stück (siehe Mehrdeutigkeit A für Block-Bonus).
- **Block-Bonus** auf 3 gleichartige Komponenten: Grundprämie 60 G
  (statt 75 G); Versicherungswert bleibt 750 G (3 × 250).
- **Versicherungssumme der Police** = Summe der Versicherungswerte aller
  Items. Bezugsgröße für den Cap im `claim`. (Nicht zu verwechseln mit
  der Prämie, die getrennt berechnet wird.)
- **Bearbeitungsgebühr** 5 G wird auf jede Prämie aufgeschlagen, *nach*
  allen anderen Modifikatoren, nie rabattiert.
- **Mindestprämie 0 G:** wenn Modifikatoren die Sub-Prämie unter 0
  drücken, wird auf 0 gedeckelt; danach kommt die Bearbeitungsgebühr
  obendrauf. Mindestbetrag also 5 G.

### `claim`

- **Selbstbeteiligung** ist eine Konstante 100 G, wird gemäß
  B₂-Festlegung pro Item abgezogen.
- **Cap** = Doppeltes der Versicherungssumme der Police. Die
  Versicherungssumme ist die Summe der Versicherungswerte (siehe
  `quote`), nicht die Prämie.
- **Cap-Zeitraum:** Lebenszeit der Police. Cap-Verbrauch kumuliert über
  alle Schadensfälle hinweg, kein Reset (Mehrdeutigkeit B verworfen).
- **Cap-Anwendung:** Payout darf den noch verfügbaren Cap nicht
  überschreiten; was darüber hinausgeht, wird gekürzt.
- **Cap-Verbrauch wird in der Police hochgezählt** nach jedem `claim`.

## Edge-Case-Festlegungen (nur in Beispielen, nicht in Regeln)

PO denkt Happy Path. Edge Cases werden ausschließlich durch Beispiele
im Example-Mapping-Stil festgelegt; in Prosa- und User-Story-Stil
bleiben sie offen. Damit sind Edge Cases selbst eine Form konstruktiv
versteckter Information — wer Example-Mapping macht, deckt sie auf.

| Edge Case | Verhalten | Beispiel-Wert |
|---|---|---|
| Leere Item-Liste in `quote` | Prämie 0 G + Bearbeitungsgebühr | 5 G |
| Modifikatoren drücken Sub-Prämie unter 0 | Auf 0 gedeckelt, dann Bearbeitungsgebühr obendrauf | min. 5 G |
| Schaden an nicht versichertem Item | Ignoriert, kein Payout-Anteil, kein Fehler | je nach Rest |
| Negative Schadenshöhe in Eingabe | Fehler / Exception | — |
| Gemischter Incident (Items teils versichert, teils nicht) | Versicherte regulieren, nicht versicherte ignorieren | je nach Rest |

**Tonalitäts-Linie:** Bei *kaputten Daten* (negative Werte) eskaliert
die Versicherung; bei *unrelevanten Daten* (nicht versicherte Items)
arbeitet sie still weiter. "Bürokratisch-streng, aber serviceorientiert".

**Headline-Beispiel mit Bearbeitungsgebühr:** Stammkunde 3 Jahre, neuer
Vertrag (zweiter Vertrag des Kunden), verfluchtes Stufe-7-Schwert.

- Versicherungswert 1000 G, Grundprämie 100 G.
- Prämien-Berechnung (additiv, Festlegung D-L1):
  100 + 50 (Fluch) + 30 (Verzauberung) − 20 (D-Treuerabatt) +
  10 (C-Erst-Aufschlag) − 15 (C-Rabatt) = 155 G
  + 5 G Bearbeitungsgebühr = **160 G**.
- Versicherungssumme der Police = 1000 G; Cap = 2000 G.

Items haben Eigenschaften (Typ, Verzauberungs-Stufe, Fluchstatus, Alter,
Material), Kunden haben Eigenschaften (Erfahrungs-Stufe, Schadenshistorie,
Vertragshistorie).

## Mehrdeutigkeit A — Set-Wertung mit Überzähligen (Muster A)

**Regeln:**

- Ein **Bauteil-Block** aus 3 gleichartigen Komponenten desselben Typs
  (z.B. drei Feuer-Runen) wird mit einem Bonuspreis von 60 G bewertet.
- Einzelne Komponenten zählen je 25 G.

(Der Bonuspreis liegt 15 G unter dem Einzelkauf-Wert von 75 G — das
Set-Angebot ist tatsächlich günstiger, wie es der Begriff "Bonus"
nahelegt.)

**Mehrdeutigkeit:** Wie wird eine Sammlung von 4 oder mehr Komponenten
desselben Typs bewertet?

- **Lesart 1 — Striktes Triple:** Ein Block ist nur exakt 3 Komponenten.
  Bei 4 oder mehr gibt es kein Block, alles wird einzeln gezählt.
  4 Komponenten = 4 × 25 = 100 G; 7 Komponenten = 7 × 25 = **175 G**.
- **Lesart 2 — Maximale Block-Bildung:** Bilde so viele Blöcke wie möglich,
  Rest einzeln. 4 Komponenten = 1 Block + 1 Einzel = 60 + 25 = 85 G;
  7 Komponenten = 2 Blöcke + 1 Einzel = 120 + 25 = 145 G.
- **Lesart 3 — Höchstens ein Block:** 7 Komponenten = 1 Block + 4 Einzel
  = 60 + 100 = 160 G.

Mit der HPSMV-Festlegung L1 ist das strikte Triple sogar die *teuerste*
Lesart — die HPSMV verdient daran, wenn es kein vollständiges Triple gibt.

**Beispiel (Festlegung):** "7 Feuer-Runen → 175 G" → Lesart 1 (alle einzeln,
weil ≠ exakt 3).

**API-Schema:** beide Lesarten brauchen Anzahl und Typ der Komponenten.
Schema neutral.

## Mehrdeutigkeit B — "Police" als Begriff (Muster C)

**Regeln:**

- Pro **Police** ist der Gesamt-Payout auf das Doppelte der
  Versicherungssumme begrenzt.
- Wird ein Vertrag verlängert, übernimmt die neue Police die Konditionen
  der alten.

**Mehrdeutigkeit:** Was ist "Police"?

- **Lesart 1 — Vertragszeitraum:** Police = einzelne Vertragsperiode. Bei
  Verlängerung beginnt eine neue Police, der Cap-Zähler resettet.
- **Lesart 2 — Versicherungsverhältnis:** Police = das übergeordnete
  Versicherungsverhältnis. Verlängerung ist Fortschreibung, der Cap-Zähler
  läuft police-übergreifend weiter.

Im realen Versicherungs-Sprachgebrauch wird "Police" beides genannt — das
einzelne Vertragsdokument ebenso wie das fortlaufende Verhältnis.

**Beispiel (Festlegung):** "Vertrag 2024 (Versicherungssumme 1000 G,
Cap 2000 G), Schaden 1500 G ausgezahlt. Verlängerung 2025, neuer Schaden
1500 G → nur 500 G Payout, weil der Cap police-übergreifend gilt." →
Lesart 2.

**API-Schema:** beide Lesarten brauchen Schadenshistorie und
Verlängerungs-Daten. Schema neutral.

## Mehrdeutigkeit B₂ — "Schadensereignis" als Begriff (Muster C)

**Regeln:**

- Pro **Schadensereignis** greift die Selbstbeteiligung von 100 G.
- Mehrere zusammenhängende Schäden werden gemeinsam reguliert.

**Mehrdeutigkeit:** Was ist ein "Schadensereignis"?

- **Lesart 1 — Auslösendes Event:** Ein Drachenangriff, der zwei Items
  gleichzeitig beschädigt, ist *ein* Ereignis → Selbstbeteiligung wird
  einmal abgezogen.
- **Lesart 2 — Schaden pro Item:** Jeder einzelne Schadensfall an einem
  Item ist ein Ereignis → Selbstbeteiligung pro Item.

Im echten Versicherungsrecht der klassische Streitpunkt um die
Serienschaden-Klausel.

**Beispiel (Festlegung):** "Drachenangriff beschädigt Schwert (500 G) und
Amulett (300 G) gleichzeitig. Selbstbeteiligung wird einmal abgezogen →
Payout 500 + 300 − 100 = 700 G." → Lesart 1.

**API-Schema:** beide Lesarten brauchen die einzelnen Schäden mit
Zeitstempel und Ursache. Schema neutral.

## Mehrdeutigkeit C — "Erstversicherung" (Muster C)

**Regeln:**

- Bei einer **Erstversicherung** wird ein Erst-Bewertungs-Aufschlag von
  10 % auf die Prämie erhoben.
- Ab dem zweiten Vertrag erhalten Versicherungsnehmer einen Treuerabatt
  von 15 %.

**Mehrdeutigkeit:** Worauf bezieht sich "Erstversicherung"?

- **Lesart 1 — Kundenbezogen:** Der erste Vertrag, den dieser Kunde bei
  uns abschließt. Beim zweiten Vertrag entfällt der Aufschlag, dafür greift
  der Treuerabatt.
- **Lesart 2 — Sachbezogen:** Die erste Police für diesen konkreten
  Gegenstand. Auch ein Stammkunde mit neuem Item zahlt den Aufschlag —
  der Gegenstand wird ja erstmals bewertet. Treuerabatt greift trotzdem
  über die Personen-Historie.

"Erstversicherung" ist im realen Versicherungs-Sprachgebrauch beides — der
Erstvertrag eines Kunden ebenso wie die erstmalige Versicherung einer
Sache (Abgrenzung zur Folge-/Anschlussversicherung).

**Beispiel (Festlegung):** "Stammkunde mit zweitem Vertrag (neues Schwert)
→ 10 % Aufschlag UND 15 % Rabatt, beides gleichzeitig." → Lesart 2.

**API-Schema:** beide Lesarten brauchen Kunden-Vertragshistorie und neuen
Vertrag. Schema neutral.

## Mehrdeutigkeit D — Faktor-Reihenfolge bei Prämienmodifikatoren (Muster B)

**Regeln:**

- Verfluchte Gegenstände: +50 % Risikozuschlag.
- Hochverzauberte Gegenstände (Stufe ≥ 5): +30 % Risikozuschlag.
- Stammkunden (≥ 2 Jahre): 20 % Treuerabatt.

**Mehrdeutigkeit:** Wie werden die Modifikatoren auf den Grundpreis
angewandt?

- **Lesart 1 — Additiv auf Grundpreis:** Alle Prozentsätze werden zum
  Faktor 1 addiert/subtrahiert, einmal multipliziert.
  100 × (1 + 0.5 + 0.3 − 0.2) = **160 G**.
- **Lesart 2 — Multiplikativ in Listenreihenfolge, Rabatt am Ende auf
  Grundpreis:** Zuschläge multiplikativ stapeln, Treuerabatt nur auf den
  Grundpreis abziehen.
  100 × 1.5 × 1.3 − 100 × 0.2 = **175 G**.
- **Lesart 3 — Multiplikativ in Listenreihenfolge, Rabatt multiplikativ
  am Ende:** Zuschläge multiplikativ, Rabatt multiplikativ aufs
  Zwischenergebnis.
  100 × 1.5 × 1.3 × 0.8 = **156 G**.

Mindestens drei plausible Auslegungen, alle aus den Regeln konsistent
ableitbar — keine Regel sagt etwas über Reihenfolge, Bezugsgröße oder
Operator. Additiv ist im Alltag verbreitet (E-Commerce-Rabatt-Codes),
multiplikativ in Versicherungs-/Steuer-Kontexten.

**Beispiel (Festlegung):** "Verfluchtes Stufe-7-Schwert eines
3-Jahres-Stammkunden, Grundpreis 100 G → Prämie 175 G." → Lesart 2.

**API-Schema:** alle Lesarten brauchen Item-Eigenschaften, Kunden-Historie,
Grundpreis. Schema neutral.

## Mehrdeutigkeit F — Annahme vs. Sonderbegutachtung (Muster D)

**Bereich:** Antragsprüfung — wird ein Item beim Antrag direkt angenommen
oder zur Sonderbegutachtung weitergeleitet?

**Regeln:**

- Items mit Verzauberungsstufe ≥ 8 werden zur Sonderbegutachtung
  weitergeleitet.
- Items aus Drachenmaterial werden direkt angenommen.

**Mehrdeutigkeit:** Was passiert mit einem Item, das beide Bedingungen
gleichzeitig erfüllt (z.B. Schwert aus Drachenmaterial mit Stufe 9)?

- **Lesart 1 — Strenger Pfad gewinnt:** Sicherheits-/Risikoschwellen
  haben Vorrang vor Annahme-Shortcuts → Sonderbegutachtung.
- **Lesart 2 — Material-Regel absolut:** "Werden direkt angenommen" ist
  als unbedingte Annahme formuliert → Direkt angenommen.

Beide Regeln rein deklarativ, keine eingebauten Vorrang-Signale ("in
jedem Fall", "ausgenommen"). Konflikt-Auflösung steht nicht in den
Regeln.

**Beispiel (Festlegung — offen):** Eine sinnvolle Festlegung kann je
nach gewünschtem Kata-Profil die Strenger- oder die Material-Lesart
treffen. Vortest zeigt klare Modell-Trennung.

**API-Schema:** beide Lesarten brauchen Item-Eigenschaften
(Verzauberungsstufe, Material), Output ist Status-Kategorie. Schema
neutral.

## Mehrdeutigkeit E — Konkurrierende Klauseln Sach- vs. Personenbezug (Muster D, verworfen)

**Regeln:**

- Verfluchte Gegenstände sind vom Treuerabatt ausgenommen.
- Stammkunden ab 5 Jahren erhalten 10 % Treuerabatt auf alle ihre Verträge.

**Mehrdeutigkeit:** Welche Regel gilt für einen 5-Jahres-Stammkunden, der
einen verfluchten Gegenstand versichert?

- **Lesart 1 — Sachbezogene Ausnahme dominiert:** Die erste Regel definiert
  eine Eigenschaft des *Gegenstands*. Der Kunde mag treu sein, aber dieser
  Vertrag betrifft einen ausgenommenen Gegenstand → kein Rabatt.
- **Lesart 2 — Personenbezogenes Recht dominiert:** Die zweite Regel
  definiert ein Recht des *Kunden* ("auf alle ihre Verträge"). Wer 5 Jahre
  treu ist, hat das Recht erworben — es gilt für jeden Vertrag unabhängig
  vom Item → 10 % Rabatt.

Sach- vs. Personenbezug ist ein realer Streitpunkt im Versicherungsrecht —
Risikoausschlüsse vs. erworbene Kundenrechte kollidieren regelmäßig.

**Beispiel (Festlegung):** "5-Jahres-Stammkunde versichert verfluchtes
Schwert → 10 % Treuerabatt wird gewährt." → Lesart 2.

**API-Schema:** beide Lesarten brauchen Kundenhistorie und Item-Eigenschaften.
Schema neutral.

## Verworfene Kandidaten

### Mehrdeutigkeit B — "Police" als Begriff (Muster C, verworfen 2026-05-07)

Ursprünglich als Mehrdeutigkeit vorgesehen: Cap-Reset bei Vertragsverlängerung.
Vortest zeigte tragfähige Streuung (Haiku 40/60). Festlegung war L1
(Cap-Reset bei Verlängerung) gegen die Modell-Konvergenz von Opus/Sonnet.

**Verworfen, weil** die Mehrdeutigkeit eine eigene `renewPolicy`-Operation
erforderte, die im Erzählfluss zwischen `quote` und `claim` deplaziert
wirkte. Die Aufgabe hat ohne Mehrdeutigkeit B genug Komplexität (5 Haupt-Mehrdeutigkeiten +
Sub-Mehrdeutigkeit Aₐ). Bei Bedarf könnte Mehrdeutigkeit B später als implizite
Mehrdeutigkeit in der Cap-Regel von `claim` rein-modelliert werden,
ohne eigene Operation.

### Mehrdeutigkeit G — Sturm vom Wettermagier (Muster A, verworfen 2026-05-07)

**Bereich:** Schadensdeckung — magische Einwirkung vs. Naturgewalt.

**Regeln:**
- Schäden durch magische Einwirkung sind voll abgedeckt.
- Schäden durch Naturgewalten sind nur bei Premium-Tarif abgedeckt.

**Frage:** Ein Standard-Tarif-Kunde meldet einen Schaden durch einen
Sturm, der von einem Wettermagier ausgelöst wurde.

**Lesarten:** Ursache (Magie → 1000 G) vs. Erscheinungsform (Sturm → 0 G).

**Verworfen, weil:** Vortest zeigt komplette Konvergenz aller Modelle
auf die Ursachen-Lesart (1000 G). Die Frage-Formulierung "wurde durch
Wettermagier ausgelöst" lenkt zu stark zur Ursache. Festlegung gegen
Konvergenz auf L2 (0 G) wäre möglich, aber Plausibilität ist grenzwertig.

## Übersicht

| Mehrdeutigkeit | Muster | Begriff / Streitpunkt | Lesarten |
|---|---|---|---|
| A | Kombination zweier Regeln | Block-Bildung bei ≥ 4 Komponenten | 3 |
| B₂ | Begriffs-Doppeldeutigkeit | "Schadensereignis" (Event vs. Item) | 2 |
| C | Begriffs-Doppeldeutigkeit | "Erstversicherung" (Kunde vs. Sache) | 2 |
| D | Unterspezifizierte Operation | Modifikator-Reihenfolge | 3 (+ L4 144 G) |
| F | Konkurrenz mehrerer Regeln | Sicherheit vs. Material-Shortcut | 2 |
| Aₐ | Begriffs-Doppeldeutigkeit | "gleichartig" (konstruktiv versteckt) | 2 |
| ~~B~~ | ~~Begriffs-Doppeldeutigkeit~~ | ~~"Police" (Zeitraum vs. Verhältnis)~~ | verworfen |
| ~~E~~ | ~~Konkurrenz~~ | ~~Sach- vs. Personenbezug~~ | verworfen |
| ~~G~~ | ~~Kombination~~ | ~~Magie vs. Naturgewalt~~ | verworfen |

Insgesamt 6 verwertbare Mehrdeutigkeiten. Verteilung über Konstruktions-Muster:
- Muster A (Kombination): A
- Muster C (Begriff): B, B₂, C
- Muster B (Unterspezifiziert): D
- Muster D (Konkurrenz): F

## Vortest-Befunde (Ambiguitäts-Probe)

Drei Vortest-Runs durchgeführt mit dem Skript in `ambiguity-probe/`. Pro
Run: 4 Modell-Konfigurationen (Opus 4.7 mit/ohne thinking, Sonnet 4.6 mit
thinking, Haiku 4.5 ohne thinking) × n=5 Wiederholungen pro Mehrdeutigkeit. Default-
Temperatur. Klassifikation manuell durch Lesen der Roh-Antworten.

**Hinweis zu Mehrdeutigkeit A:** Die Vortest-Werte (130 G / 185 G / 180 G) basieren
auf einem Bonuspreis von 80 G. Nach Überarbeitung wurde der Bonuspreis
auf 60 G gesenkt (Set ist günstiger als Einzelkauf, wie der Begriff
"Bonus" nahelegt). Die Modell-Konvergenz auf greedy max-Block-Bildung
bleibt aber methodisch unverändert — die Streuungs-Diagnose gilt weiter.

### Run 1 — 2026-05-07

Mehrdeutigkeiten: A (5 Komponenten), B, B₂ (mit Wegweiser-Regel), D, E. Mehrdeutigkeit C
ausgelassen wegen Operator-Mehrdeutigkeits-Kollision mit D.

| Mehrdeutigkeit | Befund | Bewertung |
|---|---|---|
| A | alle Modelle → L2 (max-Block, 130 G); L1 nie | konvergent |
| B | Opus/Sonnet → L2 (500 G), Haiku 2/5 → L2, 3/5 → L1 (1500 G) | Streuung auf Haiku; Opus/Sonnet erkennen Mehrdeutigkeit explizit |
| B₂ | alle Modelle → L1 (700 G einmalige SB) | total konvergent — zweite Regel wirkt als Wegweiser |
| D | alle → L3 (alles multiplikativ, 156 G); Sonnet/Haiku zeigen *neue* L4 (144 G); L1/L2 nie | konvergent auf L3, mit Auftauchen von L4 |
| E | alle → L1 (kein Rabatt, 0 G) | total konvergent — "ausgenommen" zu hart |

**Nebenbefund:** Auffällige Rechenfehler in Endzahlen bei korrekter
Zwischenrechnung (besonders Opus 4.7 mit thinking). Z.B. "80 + 50 = 130" als
Zwischenrechnung, "155 G" als Endzahl.

### Run 2 — 2026-05-07

Anpassungen gegenüber Run 1: A auf 7 Komponenten erweitert (mehr
Lesarten 175/180/185), B₂ Wegweiser-Regel gestrichen, E entfernt, C
wieder aufgenommen (Operator-Frage durch andere Frage-Formulierung
umgangen).

| Mehrdeutigkeit | Befund | Bewertung |
|---|---|---|
| A (7) | alle → L2 (greedy max-Block, 185 G); L1/L3 nie | konvergent — 7 statt 5 ändert nichts |
| B | wie Run 1: Opus/Sonnet → L2, Haiku 3/5 → L2, 2/5 → L1 | stabil, Streuung nur Haiku |
| B₂ (ohne Wegweiser) | **Opus 5/5 → L1 (700)**, **Sonnet 5/5 → L2 (600)**, Haiku 3/5 → L1, 2/5 → L2 | **stärkste Streuung des Tests — modell-übergreifend** |
| C | alle → L1 (Kundenbezug, 85 G); L2 nie | konvergent |
| D | Opus/Haiku → L3 (156); Sonnet 2/5 → L3, 3/5 → L4 (144); L1/L2 nie | begrenzte Streuung, falsche Lesart-Achse |

**Bemerkenswert bei A (Run 2):** Sonnet entdeckt eine *andere*
Mehrdeutigkeit ("Bonuspreis 80 G" = Pauschalpreis vs. Aufschlag zusätzlich
zu Einzelpreisen), die wir nicht angedacht hatten. Diese Mehrdeutigkeit
könnte bewusst zur Mehrdeutigkeit umgebaut werden.

### Run 3 — 2026-05-07

Anpassungen gegenüber Run 2: zwei neue Kandidaten F (Annahme/Sonder-
begutachtung, Muster D neutral) und G (Sturm vom Wettermagier, Muster A
zur Schadensdeckung). Die anderen 5 Mehrdeutigkeiten (A, B, B₂, C, D) liefen als
Bestätigungslauf mit.

| Mehrdeutigkeit | Befund | Bewertung |
|---|---|---|
| F | **Opus 5/5 → Sonderbegutachtung** (mit expliziter Mehrdeutigkeits-Notiz), **Sonnet 5/5 → Direkt angenommen**, Haiku 4/5 → Sonder, 1/5 → Direkt | **starke modell-übergreifende Streuung, ähnlich B₂** |
| G | alle Modelle → L1 (1000 G, Ursache zählt) | konvergent, "ausgelöst durch Wettermagier" lenkt zu stark zur Ursachen-Lesart |
| A, B, B₂, C, D | Befunde aus Run 2 bestätigt | stabil |

**Bemerkenswert bei F:** Opus thematisiert in allen Antworten die
Mehrdeutigkeit explizit ("ohne Vorrangregel nicht eindeutig", "Welche
Lesart soll gelten?"), wählt dann konservativ Sonderbegutachtung. Sonnet
liest die Material-Regel als absolut formuliert und entscheidet
gegenteilig. Klarere Modell-Trennung als B₂.

### Synthese

**Stärkste Mehrdeutigkeiten:** **B₂ (Schadensereignis ohne Wegweiser)** und
**F (Sonderbegutachtung)**. Beide zeigen saubere modell-übergreifende
Streuung mit klarer Trennlinie zwischen Opus-Familie und Sonnet, plus
Haiku-Mischung. Beste Mess-Grundlage für Example-Mapping-Effekt — ohne
Beispiele streut es zwischen Modellen, mit Beispielen sollten alle
konvergieren. F hat den Zusatzwert, dass Opus die Mehrdeutigkeit aktiv
thematisiert.

**Mittelstark:** **B (Police).** Streuung nur auf Haiku, aber Opus/Sonnet
*erkennen* die Mehrdeutigkeit explizit und thematisieren sie in ihrer
Antwort. Auch das ist ein verwertbares Mess-Signal.

**Konvergent (Fallback "Festlegung gegen Konvergenz" nötig):** A, C, D.
Drei zeigen Modell-Konvergenz auf eine Default-Lesart. Festlegung auf
die jeweils nicht-konvergente Lesart bleibt möglich, solange sie
plausibel ist.

**Verworfen:** E (Sach- vs. Personenbezug, "ausgenommen" zu hart),
G (Sturm vom Wettermagier, Frage-Formulierung lenkt zu stark).

**Lesart-Sets korrigiert:** Bei A und D haben Modelle Lesarten produziert,
die nicht in unserem ursprünglichen Set waren (A: "Bonus = pauschal vs.
zusätzlich"; D: L4 = additiv-Zuschlag-dann-multiplikativ-Rabatt = 144 G).
Vor weiteren Tests sollten die Lesart-Sets ergänzt werden.

## Offene Punkte

- [ ] Pro Mehrdeutigkeit Festlegungs-Strategie wählen: Streuung-basiert (B, B₂)
      oder Fallback "gegen Konvergenz" (A, C, D); E ggf. verwerfen.
- [ ] Lesart-Sets bei A und D um die im Vortest aufgetauchten Lesarten
      ergänzen.
- [ ] Jede Mehrdeutigkeit in `prose`-, `user-story`- und `example-mapping`-Variante
      formulieren (drei Prompt-Stile aus der Pipeline).
- [ ] Komplexitäts-Schätzung der Gesamtaufgabe (LoC, Verzweigungen) gegen
      Anforderung 1 prüfen.
