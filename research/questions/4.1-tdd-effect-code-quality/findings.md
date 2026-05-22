# RQ-tdd-quality Findings

Kata: `game-of-life` (Library-Form). Modell: `opus-4-7-no-thinking` (Portkey ODER Direct, OR-match). 6 Workflows, n=39 Runs.

## Übersicht — Code-Qualität pro Workflow

Alle Metriken in der Tabelle: kleiner = besser. 🏆 = bester Wert pro Spalte (auch bei Gleichstand mehrfach).

| Workflow | n | `cognitive_max` | `mccabe_max` | `cc_longest_function` | `smell_total` | `cc_loc` | `code_mass` |
|---|---:|---:|---:|---:|---:|---:|---:|
| v1-oneshot              | 10 | 18.8 | 12.8 | 31.7 | 4.8 | 33.6 | 155.0 |
| v2-iterative            | 10 | 16.2 | 11.6 | 32.1 | 4.1 | 32.5 | 157.8 |
| v3-basic-tdd            | 10 | 21.8 | 13.7 | 32.5 | 6.0 | 31.9 | 165.6 |
| v4.1-testlist-scope-fix |  3 | **6.0** 🏆 | **4.7** 🏆 | 16.0 | 2.7 | 33.0 | 158.0 |
| v5.1-testlist-scope-fix |  3 | 19.7 | 11.0 | 23.0 | 5.0 | **25.3** 🏆 | **151.0** 🏆 |
| v6.1-hybrid-…           |  3 | 7.7 | 5.7 | **14.7** 🏆 | **2.3** 🏆 | 33.0 | 159.3 |

Korrektheit (`tests_passing`, `verification_pct`) und `completed_within_budget` sind in allen Zellen 100 %. `mutation_score` wurde nur für v1/v2/v3 erhoben (0.95 ± 0.01 in allen drei) — die strukturierten Workflows liefen ohne Mutation-Pass.

## F-tdd-quality.1 — Strikte phasen-strukturierte Workflows mit Refactor-Phase senken die Komplexitäts-Spitzen drastisch

v4.1 und v6.1 erreichen auf game-of-life `cognitive_max ≈ 6–8` und `mccabe_max ≈ 5–6` — das sind ~⅓ der Werte von v1/v2/v3 (`cognitive_max ≈ 16–22`, `mccabe_max ≈ 12–14`). `cc_longest_function` halbiert sich entsprechend (15–16 vs. 32). `smell_total` halbiert sich ebenfalls (≈2.5 vs. 4–6).

Plausible Mechanik: v4.1 und v6.1 schreiben eine eigene Refactor-Phase pro Zyklus vor, die ausdrücklich Komplexität abbaut — und beide trennen Implementation (Green) und Refactor architekturell (v4.1 via isolierten Subagent, v6.1 via dediziertem Refactor-Subagent im Hybrid). Die Refactor-Disziplin schlägt sich direkt in den Komplexitäts-Spitzen nieder, nicht im `cc_loc` — der Code wird nicht kürzer, sondern flacher.

## F-tdd-quality.2 — Minimal-TDD (v3) bringt auf game-of-life keinen Komplexitäts-Vorteil gegenüber Non-TDD (v1/v2)

v3 liegt in *allen* Komplexitäts-Metriken auf oder leicht über v1/v2: `cognitive_max` 21.8 (v3) vs. 18.8/16.2 (v1/v2), `mccabe_max` 13.7 vs. 12.8/11.6, `smell_total` 6.0 vs. 4.8/4.1, `code_mass` 165.6 vs. 155/157.8. Funktionsgrößen (`cc_longest_function`, `cc_loc`) sind vergleichbar.

Plausible Mechanik: v3 ist "minimal-TDD" ohne explizite Refactor-Phase und ohne Phasen-Trennung. Auf einer trainingsbekannten Kata wie game-of-life produziert das Modell auch ohne TDD eine sortierte Lösung; die Test-First-Disziplin allein bringt keine zusätzliche Strukturierung. Den messbaren Qualitätsvorteil bringt erst die Refactor-Disziplin in den strikten Workflows (F-tdd-quality.1).

Hypothese H1 ("v3/v4.1/v5.1 zeigen niedrigere Komplexität als v1/v2") trifft damit *nicht* uniform für alle TDD-Workflows zu — v3 und v5.1 erreichen Non-TDD-Niveau, nur v4.1 und v6.1 trennen sich klar ab.

## F-tdd-quality.3 — Single-Context (v5.1) verliert den Komplexitäts-Vorteil der phasen-isolierten Subagents (v4.1)

v5.1 und v4.1 tragen denselben Phasen-Skript-Inhalt (test-list-scope-fix, Test-Liste → Red → Green → Refactor) und unterscheiden sich nur im Aufruf-Mechanismus: v4.1 spawnt einen frischen Subagent pro Phase (isolierter Kontext), v5.1 ruft Skills im selben Kontext auf. Trotz identischem Skript zeigt v5.1 in den Spitzen-Metriken Werte auf v1/v2/v3-Niveau:

| Metrik (kleiner = besser) | v4.1 (isoliert) | v5.1 (geteilt) | Faktor v5.1 / v4.1 |
|---|---:|---:|---:|
| `cognitive_max` | **6.0** 🏆 | 19.7 | 3.3× |
| `mccabe_max`    | **4.7** 🏆 | 11.0 | 2.3× |
| `cc_longest_function` | **16.0** 🏆 | 23.0 | 1.4× |
| `smell_total`   | **2.7** 🏆 | 5.0 | 1.9× |

v5.1 liegt zwischen v3 und v4.1 — die Kontext-Architektur allein verschiebt das Niveau klar in Richtung Non-TDD, obwohl die Phasen-Anweisungen identisch sind. Plausible Mechanik: im geteilten Kontext "sieht" die Refactor-Phase die Green-Implementation und ihre Begründungen weiter — der Druck zum strukturellen Aufräumen ist geringer. RQ-context (4.3) prüft denselben Effekt auf claim-office und zerlegt ihn mit einem dritten Workflow (v6.1, Hybrid: Skill-Red/Green + isolierter Refactor-Subagent); siehe dort F-context.1 für die Diagnose, dass der Architektur-Vorteil aus der **Refactor-Isolation** kommt, nicht aus der Phasen-Isolation aller Phasen — und für die kata-abhängige Umkehr der v4.1↔v5.1-Reihenfolge auf claim-office.

## F-tdd-quality.4 — Korrektheit ist workflow-unabhängig auf game-of-life

`tests_passing`, `verification_pct` und `verification_passed/15` sind in allen 6 Zellen exakt 100 % (15/15 Verifikations-Szenarien, σ=0). H4 bestätigt — auf einer trainingsbekannten Kata mit Opus 4.7 ist Aussen-Korrektheit nicht der Engpass; der Workflow-Effekt zeigt sich ausschließlich in Code-Qualität und Kosten.

## F-tdd-quality.5 — Kostenspanne zwischen Workflows ist eine Größenordnung; strikte Workflows sind 50-100× teurer

`total_tokens` und `duration_seconds` per Workflow (beide kleiner = besser):

| Workflow | `duration_seconds` (mean) | `total_tokens` (mean) |
|---|---:|---:|
| v1-oneshot              | 88 | 994 k |
| v2-iterative            | 83 | 967 k |
| v3-basic-tdd            | **75** 🏆 | **799 k** 🏆 |
| v4.1-testlist-scope-fix | 790 | 3.78 M |
| v5.1-testlist-scope-fix | 273 | 7.66 M |
| v6.1-hybrid-…           | 379 | 6.19 M |

v1/v2/v3 liegen bei ~80 s und <1 M Tokens pro Run. Die strikten Workflows brauchen 3–10× länger und 4–10× mehr Tokens. v5.1 hat zudem die größte Token-Spanne (5.2 M – 11.2 M, σ=3.1 M) — Konsistenz im Verbrauch ist im Single-Context deutlich schlechter als im Subagent-Setup (v4.1: σ=0.7 M).

Der Kosten-Aufschlag der strikten Workflows steht der Komplexitäts-Reduktion von v4.1 und v6.1 (F-tdd-quality.1) gegenüber; ob das Verhältnis lohnt, hängt vom Anwendungsfall ab. v3 (Minimal-TDD) ist günstig, bringt aber keinen Qualitätsvorteil (F-tdd-quality.2) — es ist der schwächste Tradeoff der sechs Workflows auf dieser Kata.
