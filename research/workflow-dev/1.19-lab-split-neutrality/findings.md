# Findings — RQ-1.19: Lab/Product Rule Split Neutrality

`v6.1.1-lab-split-cc` against `v6.1-hybrid-testlist-scope-fix`, n=5 per cell,
`opus-5-no-thinking`. Production files (`agents/refactor.md`, all three
commands, `settings.json`) are byte-identical between the two; `tdd.md` differs
only in a filename reference, a rule-files table and a dropped `EXPERIMENT MODE:`
prefix. What differs is the rule *split*: `tdd-experiment-mode.md` (1271 B)
became `lab-only.md` + `subagent-prompts.md` (4254 B), so total rule content
grew from 7202 to 10625 bytes.

**Tables are split by kata.** `kata_base` is a factor here, and the two katas
differ in task size by roughly a factor of five (Code Mass (APP) ~181 against
~840). A cross-kata row would compare the kata, not the workflow.

## Übersicht — game-of-life

Both cells are 5/5 perfect on Correctness (external), so no gating applies.

| Metrik | `v6.1` | `v6.1.1` | σ |
|---|---:|---:|---:|
| **Correctness (external)** — höher = besser | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | 0.00 |
| `cc_avg_loc_per_function` — kleiner = besser | 4.54 ± 1.03 | **3.05 ± 1.39** 🏆 | 1.22 |
| **Complexity Peak** — kleiner = besser | 10.80 ± 3.27 | **5.40 ± 4.56** 🏆 | 1.36 |
| `cognitive_max` — kleiner = besser | **1.80 ± 0.84** 🏆 | 2.40 ± 2.61 | 0.31 |
| `mccabe_max` — kleiner = besser | 3.20 ± 0.45 | **2.80 ± 1.30** 🏆 | 0.41 |
| **Smell Total** — kleiner = besser | **1.20 ± 1.64** 🏆 | 1.80 ± 1.64 | 0.37 |
| **Code Mass (APP)** — kleiner = besser | 182 ± 26 | **180 ± 36** 🏆 | 0.07 |
| `duration_seconds` — kleiner = besser | **621 ± 90** 🏆 | 687 ± 106 | 0.67 |
| `total_tokens` — kleiner = besser | **8.0 M ± 1.7 M** 🏆 | 9.8 M ± 1.4 M | 1.16 |
| `refactorings_applied` | 4.40 ± 0.55 | 6.20 ± 3.11 | 0.80 |
| `cycle_count` | 10.40 ± 1.52 | 10.00 ± 0.71 | 0.34 |
| **Refactor-Rate pro Zyklus** | 0.43 | 0.63 | — |

## Übersicht — claim-office

| Metrik | `v6.1` | `v6.1.1` | σ |
|---|---:|---:|---:|
| **Correctness (external)** — höher = besser | **0.99 ± 0.03** 🏆 | 0.96 ± 0.04 | 0.80 |
| perfekte Runs | **4/5** 🏆 | 2/5 | — |
| `cc_avg_loc_per_function` — kleiner = besser | **4.04 ± 0.58** 🏆 | 4.49 ± 0.54 | 0.80 |
| **Complexity Peak** — kleiner = besser | **17.00 ± 4.47** 🏆 | 17.60 ± 4.39 | 0.14 |
| `cognitive_max` — kleiner = besser | **2.40 ± 0.89** 🏆 | 2.80 ± 0.84 | 0.46 |
| `mccabe_max` — kleiner = besser | **3.20 ± 0.45** 🏆 | 3.40 ± 0.55 | 0.40 |
| **Smell Total** — kleiner = besser | **0.00 ± 0.00** 🏆 | **0.00 ± 0.00** 🏆 | 0.00 |
| **Code Mass (APP)** — kleiner = besser | 862 ± 104 | 821 ± 111 | 0.38 |
| `duration_seconds` — kleiner = besser | **2661 ± 411** 🏆 | 3841 ± 1523 | 1.06 |
| `total_tokens` — kleiner = besser | **81.9 M ± 17 M** 🏆 | 126.2 M ± 42 M | 1.39 |
| `refactorings_applied` | 17.40 ± 5.03 | 33.00 ± 14.27 | 1.46 |
| `cycle_count` | 42.80 ± 5.76 | 48.00 ± 2.55 | 1.17 |
| **Refactor-Rate pro Zyklus** | 0.41 | 0.69 | — |

> **Gating auf claim-office:** keine der beiden Zellen erreicht `verification_pct`
> = 1.0 im Mittel. Die Pokale gehen an `v6.1` als die Zelle, die mit 4/5
> perfekten Runs gegen 2/5 deutlich näher dran liegt; das ist eine dokumentierte
> pragmatische Abweichung von der strikten Regel, nicht deren Anwendung. Auf
> game-of-life sind beide Zellen 5/5 perfekt, dort greift kein Gating.
>
> `Code Mass (APP)` auf claim-office trägt keinen Pokal: `v6.1.1` hat den
> kleineren Wert, ist aber nicht pokalberechtigt, und ein Pokal auf den
> schlechteren Wert der Zeile ist ausgeschlossen.

---

## F-1.19.1 — Die beiden Workflows sind nicht verhaltensgleich

Die Refactor-Rate pro Zyklus ist auf **beiden** Katas rund 50 % höher, obwohl `agents/refactor.md` und alle Phasen-Kommandos byte-identisch sind.

| Kata | `v6.1` Rate | `v6.1.1` Rate | Δ |
|---|---:|---:|---:|
| game-of-life | 0.43 | 0.63 | +47 % |
| claim-office | 0.41 | 0.69 | +68 % |

Der Zyklus-Zähler bleibt dabei nahezu unverändert (GoL 10.40 → 10.00; claim-office 42.80 → 48.00). Es werden also nicht mehr Zyklen gefahren, sondern innerhalb der Zyklen häufiger refaktoriert.

Da die Produktivdateien identisch sind, bleibt als Ursache der Regel-Split: das Regelvolumen wuchs von 7202 auf 10625 Bytes, und `lab-only.md` enthält unter anderem den Satz "Red/Green/Refactor for every test". H1 ist damit in der Richtung bestätigt; die Effektstärke bleibt bei gepoolter σ mit 0.80 (GoL) und 1.46 (claim-office) unterhalb einer sauberen 2-σ-Trennung.

Die Empfehlung in `workflow-construction.md`, `v6.1.1` sei inhaltsgleich und leistungsneutral zu `v6.1`, ist in dieser Form nicht gedeckt.

---

## F-1.19.2 — Der Aufpreis fällt nur auf der großen Kata an

Die höhere Refactor-Rate kostet fast nichts auf game-of-life und deutlich mehr auf claim-office.

| | `duration_seconds` | Δ | `total_tokens` | Δ |
|---|---:|---:|---:|---:|
| GoL `v6.1` → `v6.1.1` | 621 → 687 | +11 % | 8.0 M → 9.8 M | +23 % |
| claim-office `v6.1` → `v6.1.1` | 2661 → 3841 | **+44 %** | 81.9 M → 126.2 M | **+54 %** |

Mechanik: die Rate wirkt multiplikativ mit der Zyklenzahl und der Codebasis-Größe. Auf zehn Zyklen sind +0.20 Rate etwa zwei zusätzliche Subagent-Spawns auf einer Ein-Datei-Library; auf 48 Zyklen sind +0.28 rund 13 zusätzliche Spawns, jeder über eine größere Codebasis.

H2 und H3 bestätigt. Praktische Konsequenz: eine Workflow-Validierung auf game-of-life allein kann diesen Effekt strukturell nicht sehen — nicht weil die Metrik fehlt, sondern weil die Kata ihn um den Faktor vier dämpft.

---

## F-1.19.3 — Das zusätzliche Refactoring zahlt sich nur auf game-of-life aus

| Kata | `cc_avg_loc_per_function` | Complexity Peak |
|---|---:|---:|
| GoL `v6.1` → `v6.1.1` | 4.54 → **3.05** (1.22 σ) | 10.80 → **5.40** (1.36 σ) |
| claim-office `v6.1` → `v6.1.1` | 4.04 → 4.49 (0.80 σ) | 17.00 → 17.60 (0.14 σ) |

Auf game-of-life liefert `v6.1.1` die bessere Dekomposition — die Mehrarbeit wird sichtbar. Auf claim-office sind alle Qualitätsmetriken innerhalb 1 σ nicht unterscheidbar, `Smell Total` ist in beiden Zellen deterministisch 0.

H5 gilt damit nur für die kleine Kata. Auf claim-office ist der Aufpreis von +44 % Wallclock und +54 % Tokens ohne messbaren Qualitätsgegenwert.

---

## F-1.19.4 — Auf claim-office sinkt die Zuverlässigkeit der Korrektheit

| | perfekte Runs | `verification_pct` |
|---|---:|---:|
| claim-office `v6.1` | 4/5 | 0.99 ± 0.03 |
| claim-office `v6.1.1` | 2/5 | 0.96 ± 0.04 |
| GoL `v6.1` | 5/5 | 1.00 ± 0.00 |
| GoL `v6.1.1` | 5/5 | 1.00 ± 0.00 |

Im Mittel ist der Abstand mit 0.80 σ nicht signifikant, und H4 ("Korrektheit wird gehalten") ist auf Mittelwertebene nicht widerlegt. Auf Lauf-Ebene fällt die Trefferquote auf claim-office aber von 4/5 auf 2/5. Bei n=5 ist das ein schwaches Signal — es ist als Beobachtung festzuhalten und bei einer Erweiterung auf n=8 erneut zu prüfen, nicht als Effekt zu berichten.

---

## F-1.19.5 — `v6.1.1` streut in den Kosten drei- bis vierfach stärker

| Metrik (claim-office) | `v6.1` σ | `v6.1.1` σ | Faktor |
|---|---:|---:|---:|
| `duration_seconds` | 411 | 1523 | 3.7× |
| `total_tokens` | 17 M | 42 M | 2.5× |
| `refactorings_applied` | 5.03 | 14.27 | 2.8× |

Der Median-Aufpreis unterschätzt damit das Risiko: `v6.1.1`-Läufe auf claim-office reichen von rund 2700 s bis über 5000 s. Für einen Workflow, der als Produkt-Baseline exportiert wird, ist die Vorhersagbarkeit der Laufzeit ein eigenes Qualitätsmerkmal — und sie ist hier schlechter als bei der Messgrundlage.

---

## F-1.19.6 — Marker-Gesundheit ist unverändert

`v6.1.1` erzeugt auf beiden Katas alle vier Marker aus `MARKERS.md`. Auf claim-office: `cycle_count` 48.00, `refactorings_applied` 33.00, `predictions_total` ≈ 2 × `cycle_count`. H6 bestätigt — der Regel-Split ist messtechnisch unschädlich, und `v6.1.1` ist als Zelle uneingeschränkt verwendbar.

---

## F-1.19.7 — Die ursprüngliche 2.9-σ-Auffälligkeit war ein n=3-Artefakt

Die Motivation dieses RQ war ein Wert von 2.9 σ auf `refactorings_applied` in den drei game-of-life-Kontrollläufen, gemessen gegen die σ von `v6.1`.

| | Kontrolle (n=3, σ von `v6.1`) | dieses RQ (n=5, gepoolte σ) |
|---|---:|---:|
| `refactorings_applied` GoL | 2.9 σ | 0.80 σ |

Der Wert schrumpft, weil `v6.1.1` selbst breit streut (σ 3.11 gegen 0.55 bei `v6.1`) — eine einseitig gegen die schmalere σ gerechnete Abweichung überschätzt den Effekt. Die Zahl war also kein belastbarer Befund.

Der Richtungsbefund bleibt trotzdem bestehen (F-1.19.1), und der methodische Kern der Kritik ebenfalls: `refactorings_applied` war in der Kontrolle gar nicht unter den verglichenen Metriken, sie lief nur auf einer Kata, und sie lief außerhalb der RQ-Pipeline. Dass die Kontrolle im Ergebnis "neutral" schrieb, war für game-of-life vertretbar — für claim-office, wo der Aufpreis anfällt, war es ungeprüft.
