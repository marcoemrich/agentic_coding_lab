# Findings — RQ-1.19: Lab/Product Rule Split Neutrality

Four workflows on `opus-5-no-thinking`. `v6.1-hybrid-testlist-scope-fix` is the
measurement basis; the other three are lab/product rule splits that differ only
in how much text the split carries and how it is worded. Production files
(`agents/refactor.md`, all three commands, `settings.json`) are byte-identical
across all four.

| Workflow | what the split carries | rules | vs. v6.1 |
|---|---|---:|---:|
| `v6.1-hybrid-testlist-scope-fix` | no split | 7202 B | — |
| `v6.1.5-pure-split-cc` | pure partition of v6.1, nothing added | 7451 B | +3.5 % |
| `v6.1.4-continuation-guard-cc` | v6.1.1 minus the duplicated cycle enumeration | 10320 B | +43 % |
| `v6.1.1-lab-split-cc` | derived from the v6.6 lineage | 10625 B | +48 % |

n per cell: v6.1 13 (claim-office) / 5 (GoL), v6.1.5 10 / 5, v6.1.1 and v6.1.4
5 / 5. The v6.1 claim-office cell spans two measurement periods (2026-08 and
2026-09) that are indistinguishable in cost and refactor rate.

**Tables are split by kata.** `kata_base` is a factor here and the two katas
differ in task size by roughly a factor of five (Code Mass (APP) ~180 against
~860). A cross-kata row would compare the kata, not the workflow.

## Übersicht — game-of-life

All four cells are 5/5 perfect on Correctness (external), so no gating applies.

| Metrik | `v6.1` | `v6.1.5` | `v6.1.4` | `v6.1.1` |
|---|---:|---:|---:|---:|
| **Correctness (external)** — höher = besser | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 |
| `cc_avg_loc_per_function` — kleiner = besser | 4.54 ± 1.03 | 5.41 ± 1.54 | **3.17 ± 1.52** 🏆 | 3.05 ± 1.39 |
| **Complexity Peak** — kleiner = besser | 10.80 ± 3.27 | 13.40 ± 6.35 | 6.20 ± 3.42 | **5.40 ± 4.56** 🏆 |
| `cognitive_max` — kleiner = besser | **1.80 ± 0.84** 🏆 | 3.60 ± 1.95 | 2.20 ± 1.10 | 2.40 ± 2.61 |
| `mccabe_max` — kleiner = besser | 3.20 ± 0.45 | 3.80 ± 1.48 | 3.00 ± 0.71 | **2.80 ± 1.30** 🏆 |
| **Smell Total** — kleiner = besser | 1.20 ± 1.64 | 1.20 ± 1.64 | **0.80 ± 1.10** 🏆 | 1.80 ± 1.64 |
| **Code Mass (APP)** — kleiner = besser | 182 ± 26 | 177 ± 24 | **156 ± 25** 🏆 | 180 ± 36 |
| `duration_seconds` — kleiner = besser | **621 ± 90** 🏆 | 679 ± 213 | 640 ± 131 | 687 ± 106 |
| `total_tokens` — kleiner = besser | **8.0 M ± 1.7 M** 🏆 | 10.4 M ± 3.4 M | 9.8 M ± 1.3 M | 9.8 M ± 1.4 M |
| `refactorings_applied` | 4.40 ± 0.55 | 5.60 ± 3.36 | 5.00 ± 2.45 | 6.20 ± 3.11 |
| `cycle_count` | 10.40 ± 1.52 | 9.80 ± 0.45 | 10.40 ± 1.52 | 10.00 ± 0.71 |
| **Refactor-Rate pro Zyklus** | **0.43 ± 0.05** | 0.58 ± 0.35 | 0.50 ± 0.30 | 0.63 ± 0.34 |
| Läufe mit Rate ≥ 0.95 | **0/5** | 1/5 | 1/5 | 2/5 |

> Die Qualitätszeilen dieser Tabelle tragen Pokale, weil alle vier Zellen
> korrektheitsseitig gleichauf sind. Sie sind trotzdem schwach: bei n=5 und
> σ von 1.0 bis 6.4 überlappen alle Zellen. `v6.1.5` sieht in der Dekomposition
> am schlechtesten aus, `v6.1.1` am besten — beides innerhalb 1 σ und in der
> Richtung entgegengesetzt zu claim-office. Auf dieser Kata trennt nichts.

## Übersicht — claim-office

| Metrik | `v6.1` (n=13) | `v6.1.5` (n=10) | `v6.1.4` (n=5) | `v6.1.1` (n=5) |
|---|---:|---:|---:|---:|
| **Correctness (external)** — höher = besser | 0.96 ± 0.03 | 0.95 ± 0.03 | 0.96 ± 0.04 | 0.96 ± 0.04 |
| perfekte Runs | 6/13 | 2/10 | 2/5 | 2/5 |
| `cc_avg_loc_per_function` — kleiner = besser | 3.95 ± 0.61 | 4.35 ± 0.87 | 4.47 ± 1.20 | 4.49 ± 0.54 |
| **Complexity Peak** — kleiner = besser | 17.23 ± 5.36 | 20.50 ± 4.88 | 24.00 ± 11.29 | 17.60 ± 4.39 |
| `cognitive_max` — kleiner = besser | 2.77 ± 1.54 | 3.20 ± 1.03 | 2.80 ± 0.84 | 2.80 ± 0.84 |
| `mccabe_max` — kleiner = besser | 3.54 ± 0.88 | 3.80 ± 0.79 | 3.40 ± 0.55 | 3.40 ± 0.55 |
| **Smell Total** — kleiner = besser | 0.00 ± 0.00 | 0.00 ± 0.00 | 0.00 ± 0.00 | 0.00 ± 0.00 |
| **Code Mass (APP)** — kleiner = besser | 864 ± 108 | 857 ± 177 | 954 ± 136 | 821 ± 111 |
| `duration_seconds` — kleiner = besser | 2688 ± 455 | 3215 ± 599 | 3521 ± 765 | 3841 ± 1523 |
| `total_tokens` — kleiner = besser | 88.1 M ± 16.2 M | 101.5 M ± 21.9 M | 116.5 M ± 25.1 M | 126.2 M ± 41.9 M |
| `refactorings_applied` | 19.00 ± 4.83 | 24.10 ± 4.79 | 26.40 ± 11.61 | 33.00 ± 14.27 |
| `cycle_count` | 45.69 ± 5.41 | 46.10 ± 3.67 | 46.80 ± 4.76 | 48.00 ± 2.55 |
| **Refactor-Rate pro Zyklus** | 0.41 ± 0.10 | 0.52 ± 0.08 | 0.56 ± 0.23 | 0.69 ± 0.29 |
| Läufe mit Rate ≥ 0.95 | 0/13 | 0/10 | 1/5 | 2/5 |

> **Keine Pokale auf claim-office.** Die Korrektheits-Gating-Regel vergibt
> Pokale für Qualitäts- und Kostenmetriken nur an Zellen mit
> `verification_pct` = 1.0. Keine der vier Zellen erreicht das im Mittel; alle
> liegen bei 0.95–0.96. Damit ist das Feld leer, und ein Pokal auf den
> Überlebenden einer leeren Auswahl wäre irreführend. Die Korrektheitszeile
> selbst ist ungegated, trägt aber ebenfalls keinen Pokal: die vier Zellen sind
> nicht unterscheidbar (F-1.19.4).

---

## F-1.19.1 — Der Regel-Split hebt die Refactor-Frequenz an, unabhängig vom Textvolumen

Alle drei Split-Varianten refaktorieren pro Zyklus häufiger als `v6.1`, bei
praktisch unveränderter Zyklenzahl.

| claim-office | Refactor-Rate | `refactorings_applied` | `cycle_count` | Regeltext |
|---|---:|---:|---:|---:|
| `v6.1` (n=13) | 0.41 ± 0.10 | 19.00 | 45.69 | 7202 B |
| `v6.1.5` (n=10) | 0.52 ± 0.08 | 24.10 | 46.10 | 7451 B |
| `v6.1.4` (n=5) | 0.56 ± 0.23 | 26.40 | 46.80 | 10320 B |
| `v6.1.1` (n=5) | 0.69 ± 0.29 | 33.00 | 48.00 | 10625 B |

`v6.1.5` ist der belastbare Fall: eine reine Partition von `v6.1` bei +3.5 %
Text. Welch gegen `v6.1` ergibt für die Rate **p = 0.009**, für
`refactorings_applied` p = 0.021, für `cycle_count` p = 0.83. Es werden also
nicht mehr Zyklen gefahren, sondern innerhalb der Zyklen häufiger refaktoriert
— und das bei einem Textbudget, das dem der Messgrundlage entspricht.

Damit ist die naheliegende Erklärung — der Split kostet, weil er mehr Text in
jeden Turn schreibt — widerlegt. Es ist die Aufteilung selbst. Der Mechanismus
ist offen; eine Vermutung ist die Rahmung: in `v6.1` steht die Zyklus-Sequenz
in einer Datei namens „TDD Experiment Mode (No HITL)" und liest sich als
Messgerüst, in den Split-Varianten steht dieselbe Liste unter eigener
Überschrift „Workflow Sequence" in einer Methodik-Datei.

---

## F-1.19.2 — Der Split kostet rund 20 % Wallclock, und die Refactor-Frequenz erklärt zwei Drittel davon

| claim-office, `v6.1.5` gegen `v6.1` | | | Welch p |
|---|---:|---:|---:|
| Refactor-Rate | 0.41 → 0.52 | +27 % | **0.009** |
| `refactorings_applied` | 19.0 → 24.1 | +27 % | 0.021 |
| `cycle_count` | 45.7 → 46.1 | +1 % | 0.83 |
| `duration_seconds` | 2688 → 3215 | +20 % | 0.034 |
| `total_tokens` | 88.1 M → 101.5 M | +15 % | 0.12 |

Rechnung: 5.1 zusätzliche Subagent-Starts pro Lauf bei mittlerer Refactor-Dauer
von 66 s ergeben 335 s, gegen eine Gesamtlücke von 527 s. Der Rest verteilt
sich auf die übrigen Phasen.

Der belastbare Test ist die Rate. Bei fünf Vergleichen und Bonferroni-Korrektur
(α = 0.01) überlebt nur sie; die Dauer mit p = 0.034 ist mit dem Mechanismus
konsistent, stünde für sich allein aber nicht. Die Tokendifferenz ist nicht
nachweisbar.

Auf game-of-life ist nichts davon auflösbar (621 → 679 s, 8.0 → 10.4 M, alle
σ überlappend). Die Kata dämpft den Effekt, weil er multiplikativ mit
Zyklenzahl und Codebasis-Größe wirkt — auf zehn Zyklen sind +0.11 Rate rund
ein zusätzlicher Spawn, auf 46 Zyklen sind es fünf.

---

## F-1.19.3 — Das zusätzliche Refactoring hat keinen messbaren Qualitätsgegenwert

Auf claim-office sind alle Qualitätsmetriken über alle vier Zellen innerhalb
1 σ nicht unterscheidbar, `Smell Total` ist deterministisch 0. Die Zelle mit
der höchsten Refactor-Rate (`v6.1.1`, 0.69) hat weder die beste Dekomposition
noch die niedrigste Spitzen-Komplexität.

Auf game-of-life zeigen `v6.1.1` und `v6.1.4` bessere Dekomposition als `v6.1`
(`cc_avg_loc_per_function` 3.05 und 3.17 gegen 4.54), `v6.1.5` dagegen die
schlechteste des Feldes (5.41). Da alle drei dieselbe erhöhte Refactor-Rate
zeigen, kann die Rate diesen Unterschied nicht erklären — bei n=5 und σ bis
1.54 ist er Rauschen.

Der Aufpreis des Splits ist damit auf beiden Katas ohne Gegenwert.

---

## F-1.19.4 — Korrektheit trennt die vier Workflows nicht, und die Metrik hat ein Bit Auflösung

| claim-office | `verification_pct` | perfekte Runs |
|---|---:|---:|
| `v6.1` | 0.96 ± 0.03 | 6/13 |
| `v6.1.5` | 0.95 ± 0.03 | 2/10 |
| `v6.1.4` | 0.96 ± 0.04 | 2/5 |
| `v6.1.1` | 0.96 ± 0.04 | 2/5 |

Auf game-of-life sind alle vier Zellen 5/5 perfekt.

Der Grund für die fehlende Trennschärfe liegt in der Metrik. Über alle 33
claim-office-Läufe dieser vier Zellen scheitert **ausnahmslos derselbe** der 15
Verifikationsfälle, `14-family-steinheim`; die anderen 14 bestehen immer.
`verification_pct` ist auf dieser Kata also kein Korrektheitsgrad, sondern eine
Ja/Nein-Frage zu einem Szenario, und 0.9333 heißt nicht „93 % richtig", sondern
„diesen einen Fall falsch".

Der Fehler ist zudem deterministisch: die Claim-Hälfte des Szenarios stimmt in
jedem Lauf (`payout` 1800, `remainingCap` 5400), falsch ist nur die Prämie, und
zwar in **jedem** fehlschlagenden Lauf mit demselben Wert 137 gegen erwartete
401. Das Modell liest die Regel entweder richtig oder auf genau eine falsche
Weise.

Konsequenz für jede Aussage über Korrektheit auf claim-office: sie beruht auf
einem Münzwurf pro Lauf. Bei n=5 ist der Standardfehler eines Anteils rund
0.22 — Zellen können sich um 2/5 gegen 4/5 unterscheiden, ohne dass ein Effekt
vorliegt.

---

## F-1.19.5 — Der Always-Refactor-Kipper gehört zum Zusatztext, nicht zum Split

Ein Teil der Läufe refaktoriert nach **jedem** Zyklus — `refactorings_applied`
gleich `cycle_count`, oder einen Zyklus daneben. Diese Läufe sind die
teuersten im Feld (claim-office: 4860–5923 s gegen 2400–3700 s sonst).

| | Kipper (Rate ≥ 0.95), beide Katas | Fisher gegen `v6.1` 0/18 |
|---|---:|---:|
| `v6.1.1` | 4/10 | **0.010** |
| `v6.1.4` | 2/10 | 0.119 |
| `v6.1.5` | 1/15 | 0.455 |

Nur `v6.1.1` trennt sich. `v6.1.5` — die reine Partition — ist von `v6.1` nicht
zu unterscheiden und hat auf claim-office **0 von 10**. Der Kipper hängt also
am Zusatztext von `v6.1.1`, nicht an der Aufteilung.

Der Verdacht innerhalb dieses Zusatztexts fällt auf die zweite Nennung des
Zyklus. `v6.1` zählt den Zyklus einmal auf, in `tdd-experiment-mode.md`;
`v6.1.1` trägt dieselbe Liste in `subagent-prompts.md` weiter **und** stellt sie
ein zweites Mal als Pfeil-Kette in `lab-only.md` unter der Überschrift „Phase
Continuation", verstärkt durch „Red/Green/Refactor for every test" und „After
Green → launch the refactor subagent". `v6.1.4` entfernt genau diese zweite
Nennung und halbiert die Kipperquote — bei n=10 nicht signifikant, aber in der
Richtung konsistent.

---

## F-1.19.6 — `v6.1.1` streut in den Kosten drei- bis vierfach stärker, `v6.1.5` nicht

| claim-office | `duration_seconds` σ | `total_tokens` σ | Refactor-Rate σ |
|---|---:|---:|---:|
| `v6.1` | 455 | 16.2 M | 0.10 |
| `v6.1.5` | 599 | 21.9 M | **0.08** |
| `v6.1.4` | 765 | 25.1 M | 0.23 |
| `v6.1.1` | 1523 | 41.9 M | 0.29 |

Die Streuung folgt der Kipperquote, nicht dem Mittelwert: `v6.1.1`-Läufe
reichen von 2685 s bis 5923 s. `v6.1.5` hat die engste Ratenstreuung des
gesamten Feldes, enger als die Messgrundlage.

Für einen Workflow, der als Produkt-Baseline exportiert wird, ist die
Vorhersagbarkeit der Laufzeit ein eigenes Qualitätsmerkmal. Auf dieser Achse
ist `v6.1.5` gleichauf mit `v6.1` und `v6.1.1` deutlich schlechter.

---

## F-1.19.7 — Marker-Gesundheit ist über alle vier Workflows unverändert

Alle vier erzeugen auf beiden Katas die vier Marker aus `MARKERS.md`.
`predictions_total` liegt bei ≈ 2 × `cycle_count` (v6.1.5 GoL: 20 Vorhersagen
bei 10 Zyklen), `refactorings_applied` ist überall ungleich null, und
`tests_passing` ist in allen 53 Läufen wahr. Der Regel-Split ist messtechnisch
unschädlich — alle vier Zellen sind uneingeschränkt verwendbar.

---

## F-1.19.8 — Die ursprüngliche 2.9-σ-Auffälligkeit war ein n=3-Artefakt

Die Motivation dieses RQ war ein Wert von 2.9 σ auf `refactorings_applied` in
drei game-of-life-Kontrollläufen, gerechnet gegen die σ von `v6.1`.

| | Kontrolle (n=3, σ von `v6.1`) | dieses RQ (n=5, gepoolte σ) |
|---|---:|---:|
| `refactorings_applied` GoL | 2.9 σ | 0.80 σ |

Der Wert schrumpft, weil `v6.1.1` selbst breit streut (σ 3.11 gegen 0.55 bei
`v6.1`) — eine einseitig gegen die schmalere σ gerechnete Abweichung
überschätzt den Effekt.

Der Richtungsbefund bleibt (F-1.19.1), und der methodische Kern der Kritik
ebenfalls: `refactorings_applied` war in der Kontrolle gar nicht unter den
verglichenen Metriken, sie lief nur auf einer Kata, und sie lief außerhalb der
RQ-Pipeline.

---

## F-1.19.9 — Eine Perioden-Kontrolle war nötig und fiel negativ aus

Die ursprüngliche Messung verglich `v6.1`-Läufe aus 2026-08 gegen
`v6.1.1`-Läufe aus 2026-09, mit einem Container-Rebuild dazwischen
(2026-09-04, floatende `node:22-slim`-Basis). „`v6.1.1` kostet mehr" war damit
nicht von „September kostet mehr" zu unterscheiden.

| `v6.1`, claim-office | `duration_seconds` | `total_tokens` | Refactor-Rate | Kipper |
|---|---:|---:|---:|---:|
| 2026-08 (n=5) | 2661 ± 411 | 81.9 M ± 17.0 M | 0.41 | 0/5 |
| 2026-09 (n=8) | 2704 ± 507 | 92.0 M ± 15.5 M | 0.39 | 0/8 |

Keine Drift bei Kosten oder Rate; `v6.1` produziert in beiden Perioden keinen
Kipper. Die Zellen sind zusammengefasst.

Bei der Korrektheit blieb die Frage offen: `14-family-steinheim` gelingt in
2026-08 in 4 von 5 Läufen, in 2026-09 in 2 von 8 (Fisher p = 0.103). Der
August-Arm ist bei n=5 eingefroren, weitere Läufe können das nicht mehr
schließen. Es bleibt eine dokumentierte Auffälligkeit ohne Befundstatus — und
ein Grund mehr, Korrektheitsaussagen auf dieser Kata zurückhaltend zu lesen
(F-1.19.4).

---

## F-1.19.10 — Ein abgebrochener Lauf wird von der Pipeline als Erfolg geführt

Ein `v6.1.3`-Lauf beendete seinen Turn nach der Test-List-Phase: ein
`test-list`-Skill-Aufruf, kein Red/Green/Refactor, kein `experiment-done.txt`,
71 s. Er ist in `metrics.json` als `exit_reason: "ok"` verzeichnet, weil das
CLI mit 0 endete.

`aggregate-by-query.py:284` leitet `completed_within_budget` allein aus
`exit_reason` ab und schließt nur `timeout`, `rate-limited`,
`transient-api-error`, `quota-exhausted` und `pi-retries-exhausted` aus. Ein
solcher Lauf zählt damit als vollständig, bei durchgehend `null`-Metriken —
also genau die Klasse, vor der der Kommentar an dieser Stelle warnt
(„visually identical to a model that failed the task").

Das dokumentierte Abschluss-Signal aus `CLAUDE.md`
(`jq .run_status.exit_reason`) meldet diesen Lauf als in Ordnung. Verlässlich
ist nur die Existenz von `experiment-done.txt`. Alle Zahlen in diesem RQ sind
über dieses Kriterium gefiltert.
