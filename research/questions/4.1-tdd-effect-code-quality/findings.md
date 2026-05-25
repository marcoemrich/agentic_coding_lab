# RQ-tdd-quality Findings

Katas: `game-of-life` (Library-Form, trainingsbekannt) und `claim-office` (CLI, novel mit Mehrdeutigkeiten). Modell: `opus-4-7-no-thinking` (Portkey ODER Direct, OR-match). 8 Workflows (6 TDD-Achse + 2 Non-TDD-Kontrolle v8a/v8b) × 2 Katas = 16 Zellen, n=103 Runs.

## Methodische Notiz — silent workflow drops und abgebrochene Refactor-Loops

Während der claim-office-Erhebung trat ein v6.1-Run mit fehlender `experiment-done.txt` auf: das Modell hat aufgehört, Tools zu callen, Claude exited mit `exit_code=0`/`exit_reason=ok`, aber der Workflow lief nicht zu Ende — Stopp nach der Test-Liste vor dem ersten Red-Cycle (63 s, 11 Assistant-Messages).

Zusätzlich wurde ein v6.1-claim-office-Run mit abgebrochenem Refactor-Loop entfernt: `exit_reason=ok` und alle Tests grün, aber nur 4 statt der typischen 5+ Zyklen, 10 statt 14–27 Funktionen, längste Funktion 60 LoC (Median 17). Profil ist mit dem normalen v6.1-Verhalten inkonsistent — der Refactor-Subagent hat die Implementierung nicht zerlegt.

Diese zwei Runs wurden aus den n=5-Zellen entfernt und durch frische Runs ersetzt bzw. nicht ersetzt (n=7 für v6.1 claim-office ist > min_replicates=5). Begründung: für die TDD-Workflow-Frage interessiert das Outcome des **abgelaufenen** Workflows, nicht die Vollautonomie-Stabilität. Im praktischen Einsatz (HITL) wäre ein abgebrochener Refactor durch Resume/Re-Trigger zu beheben; nur unter Vollautonomie wird er zum Problem. Vollautonomie-Stabilität ist eine eigenständige Forschungsfrage (vgl. RQ-stability) und liegt außerhalb des Scopes dieser RQ.

## Übersicht — Code-Qualität pro Workflow

Alle Metriken in den Tabellen: kleiner = besser. 🏆 = bester Wert pro Spalte (auch bei Gleichstand mehrfach). **Nie über Katas gemittelt** — game-of-life (~30–40 Produktiv-LoC) und claim-office (~150–320 Produktiv-LoC) sind nicht vergleichbar.

### Kata: game-of-life

| Workflow | n | `cognitive_max` | `mccabe_max` | `cc_longest_function` | `smell_total` | `cc_loc` | `code_mass` |
|---|---:|---:|---:|---:|---:|---:|---:|
| v1-oneshot              | 10 | 18.8 | 12.8 | 31.7 | 4.8 | 33.6 | 155.0 |
| v2-iterative            | 10 | 16.2 | 11.6 | 32.1 | 4.1 | 32.5 | 157.8 |
| v3-basic-tdd            | 10 | 21.8 | 13.7 | 32.5 | 6.0 | 31.9 | 165.6 |
| v4.1-testlist-scope-fix |  5 | **6.4** 🏆 | **5.0** 🏆 | 16.4 | **2.4** 🏆 | 32.0 | 156.6 |
| v5.1-testlist-scope-fix |  5 | 17.6 | 10.2 | 20.8 | 4.8 | **26.6** 🏆 | 154.0 |
| v6.1-hybrid-…           | 10 | 6.5 | 5.2 | **14.2** 🏆 | **2.4** 🏆 | 29.2 | 153.7 |
| v8a-delayed-refactor-agent  |  5 | 10.6 | 7.4 | 17.6 | 3.0 | 31.2 | **142.0** 🏆 |
| v8b-delayed-refactor-native |  5 | 9.0 | 6.8 | 17.6 | **2.4** 🏆 | 31.0 | 145.8 |

### Kata: claim-office

| Workflow | n | `cognitive_max` | `mccabe_max` | `cc_longest_function` | `smell_total` | `cc_loc` | `code_mass` |
|---|---:|---:|---:|---:|---:|---:|---:|
| v1-oneshot              |  5 | 12.2 | 8.4 | 40.4 | 11.6 | 269.4 | 835.4 |
| v2-iterative            |  5 | 11.4 | 8.4 | 41.4 | 15.8 | 268.6 | 851.0 |
| v3-basic-tdd            |  5 | 19.8 | 15.4 | 51.6 | 16.8 | 317.4 | 992.4 |
| v4.1-testlist-scope-fix |  5 | 26.8 ⚠️ | 16.0 ⚠️ | 40.8 | 13.2 | **156.8** 🏆 | **621.6** 🏆 |
| v5.1-testlist-scope-fix |  6 | 14.8 | 10.2 | 32.7 | 6.8 | 167.2 | 692.7 |
| v6.1-hybrid-…           |  7 | **5.7** 🏆 | **5.7** 🏆 | **18.1** 🏆 | **1.3** 🏆 | 191.1 | 861.3 |
| v8a-delayed-refactor-agent  |  5 | 7.4 | 6.6 | 28.4 | 4.0 | 245.6 | 813.8 |
| v8b-delayed-refactor-native |  5 | 11.0 | 8.0 | 35.8 | 6.2 | 238.8 | 780.2 |

⚠️ v4.1-claim-office ist bimodal (`cognitive_max` σ=24, max=68) — gelegentliche extreme Fehlsteuerungen. Siehe F-tdd-quality.9.

Korrektheit ist auf den zwei Katas **unterschiedlich**: auf game-of-life sind alle 8 Workflows bei `verification_pct=1.00`. Auf claim-office variiert sie zwischen 0.28 (v1+v2, Vibe-Coding ohne Tests) und 1.00 (v3, v5.1, v6.1, v8a) — siehe F-tdd-quality.4 und F-tdd-quality.8. `mutation_score` wurde nur für v1/v2/v3 auf game-of-life erhoben (0.95 ± 0.01 in allen drei).

## F-tdd-quality.1 — Strikte phasen-strukturierte Workflows mit Refactor-Phase senken die Komplexitäts-Spitzen drastisch

v4.1 und v6.1 erreichen auf game-of-life `cognitive_max ≈ 6–7` und `mccabe_max ≈ 5` — das sind ~⅓ der Werte von v1/v2/v3 (`cognitive_max ≈ 16–22`, `mccabe_max ≈ 12–14`). `cc_longest_function` halbiert sich entsprechend (13–16 vs. 32). `smell_total` halbiert sich ebenfalls (≈2.3 vs. 4–6).

Auf claim-office hält das Muster für v6.1 **noch deutlicher**: `cognitive_max` 5.7, `mccabe_max` 5.7, `cc_longest_function` 18.1 — alle die niedrigsten Werte der gesamten Matrix. v4.1 dagegen bricht auf claim-office ein (siehe F-tdd-quality.9) — bleibt zwar auf `code_mass` und `cc_loc` an der Spitze (621.6/156.8, je beste über alle Workflows), kollabiert aber bei Verzweigungs-Komplexität.

Plausible Mechanik: v4.1 und v6.1 schreiben eine eigene Refactor-Phase pro Zyklus vor, die ausdrücklich Komplexität abbaut — und beide trennen Implementation (Green) und Refactor architekturell (v4.1 via isolierten Subagent, v6.1 via dediziertem Refactor-Subagent im Hybrid). Die Refactor-Disziplin schlägt sich direkt in den Komplexitäts-Spitzen nieder, nicht im `cc_loc` — der Code wird nicht kürzer, sondern flacher.

## F-tdd-quality.2 — Minimal-TDD (v3) bringt auf game-of-life keinen Komplexitäts-Vorteil gegenüber Non-TDD (v1/v2)

v3 liegt auf game-of-life in *allen* Komplexitäts-Metriken auf oder leicht über v1/v2: `cognitive_max` 21.8 (v3) vs. 18.8/16.2 (v1/v2), `mccabe_max` 13.7 vs. 12.8/11.6, `smell_total` 6.0 vs. 4.8/4.1, `code_mass` 165.6 vs. 155/157.8. Funktionsgrößen (`cc_longest_function`, `cc_loc`) sind vergleichbar.

Auf claim-office ist v3 sogar **deutlich schlechter** als v1/v2 in fast allen Metriken: `cognitive_max` 19.8 vs. 12.2/11.4, `mccabe_max` 15.4 vs. 8.4/8.4, `cc_longest_function` 51.6 vs. 40.4/41.4, `cc_loc` 317.4 vs. 269.4/268.6, `code_mass` 992.4 vs. 835.4/851.0. Minimal-TDD ohne Refactor-Phase produziert auf der novel Kata den schwersten Code der ganzen Matrix — die Test-First-Disziplin treibt die Implementation in eine inkrementell aufgebaute, fragmentierte Struktur ohne abschließendes Aufräumen.

Plausible Mechanik: v3 ist "minimal-TDD" ohne explizite Refactor-Phase. Auf einer trainingsbekannten Kata produziert das Modell auch ohne TDD eine sortierte Lösung; auf einer novel Kata fügt v3 inkrementell Test-Erfüllung an Test-Erfüllung — ohne Refactor wird das Resultat klobiger als selbst eine schlechte oneshot-Lösung. Den messbaren Qualitätsvorteil bringt erst die Refactor-Disziplin in den strikten Workflows (F-tdd-quality.1).

Hypothese H1 ("v3/v4.1/v5.1 zeigen niedrigere Komplexität als v1/v2") trifft damit *nicht* uniform für alle TDD-Workflows zu — v3 erreicht (game-of-life) bzw. unterschreitet (claim-office) Non-TDD-Niveau, nur v4.1 (game-of-life) und v6.1 (beide Katas) trennen sich klar ab.

## F-tdd-quality.3 — Single-Context (v5.1) verliert den Komplexitäts-Vorteil der phasen-isolierten Subagents (v4.1) — aber nur auf game-of-life

v5.1 und v4.1 tragen denselben Phasen-Skript-Inhalt (test-list-scope-fix, Test-Liste → Red → Green → Refactor) und unterscheiden sich nur im Aufruf-Mechanismus: v4.1 spawnt einen frischen Subagent pro Phase (isolierter Kontext), v5.1 ruft Skills im selben Kontext auf.

Auf **game-of-life** zeigt v5.1 in den Spitzen-Metriken Werte auf v1/v2/v3-Niveau:

| Metrik (kleiner = besser) | v4.1 (isoliert) | v5.1 (geteilt) | Faktor v5.1 / v4.1 |
|---|---:|---:|---:|
| `cognitive_max` | **6.4** 🏆 | 17.6 | 2.8× |
| `mccabe_max`    | **5.0** 🏆 | 10.2 | 2.0× |
| `cc_longest_function` | **16.4** 🏆 | 20.8 | 1.3× |
| `smell_total`   | **2.4** 🏆 | 4.8 | 2.0× |

Auf **claim-office kehrt sich die Reihenfolge um** — v5.1 schlägt v4.1 klar:

| Metrik (kleiner = besser) | v4.1 (isoliert) | v5.1 (geteilt) |
|---|---:|---:|
| `cognitive_max` | 26.8 ⚠️ | **14.8** 🏆 |
| `mccabe_max`    | 16.0 ⚠️ | **10.2** 🏆 |
| `cc_longest_function` | 40.8 | **32.7** 🏆 |
| `smell_total`   | 13.2 | **6.8** 🏆 |

Plausible Mechanik: auf der kurzen game-of-life-Test-Liste hilft der frische Subagent-Kontext, weil jede Phase isoliert die ganze Test-Liste überblicken kann; auf der langen claim-office-Test-Liste verliert der frische Kontext pro Cycle die Kohärenz und re-interpretiert Spec-Mehrdeutigkeiten unterschiedlich. v5.1 mit geteiltem Kontext profitiert von der Spec-Konsistenz innerhalb einer Session. Der Hybrid v6.1 (Skill-Red/Green im Shared-Context + isolierter Refactor-Subagent) verbindet beide Stärken und dominiert claim-office über die Verzweigungs- und Größen-Metriken — siehe RQ-context (4.3) F-context.1 für die explizite Zerlegung.

## F-tdd-quality.4 — Korrektheit ist workflow-abhängig auf novel Kata; v1/v2 Vibe-Coding kollabiert auf claim-office

`verification_pct` ist auf den zwei Katas **strukturell unterschiedlich**:

| Kata | v1 | v2 | v3 | v4.1 | v5.1 | v6.1 | v8a | v8b |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| game-of-life | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 |
| claim-office | **0.28** | **0.28** | 1.00 | 0.96 | 1.00 | 1.00 | 1.00 | 0.97 |

Auf game-of-life sind alle 8 Workflows bei 100 % (15/15 Verifikations-Szenarien) — der Workflow-Effekt ist hier unsichtbar, weil das Modell die Lösung memoriert hat. Auf claim-office (novel mit Mehrdeutigkeiten) fallen **v1 und v2** auf ~28 % (4/15) — das Modell schreibt für die Vibe-Coding-Prosa-Variante eine Lösung, die in 11 von 15 Szenarien fehlschlägt. Alle Workflows mit einer **Test-Schreib-Phase** (v3+, v8a/v8b) bleiben bei ≥ 96 %; die meisten erreichen 100 %. Die kleineren Abweichungen bei v4.1 (0.96) und v8b (0.97) kommen von je 1 Run mit `verification_pct ∈ {0.80, 0.87}` (Implementation-Bugs, die die spec nicht ganz abdecken — nicht silent workflow drops).

**H4 (Korrektheit unabhängig vom Workflow) widerlegt.** Der Workflow-Effekt auf Korrektheit ist kata-abhängig: auf trainingsbekannten Katas unsichtbar, auf novel Katas dominant. Die Vibe-Coding-Workflows v1/v2 ohne Tests fallen aus; selbst ein nachträgliches Test-Schreiben (v8a/v8b) reicht aus, um auf TDD-Niveau zu kommen — siehe F-tdd-quality.8.

## F-tdd-quality.5 — Kostenspanne zwischen Workflows ist eine Größenordnung; strikte Workflows sind 5–50× teurer; Kata-Komplexität skaliert linear

### game-of-life

| Workflow | `duration_seconds` (mean) | `total_tokens` (mean) |
|---|---:|---:|
| v1-oneshot              | 88 | 994 k |
| v2-iterative            | 83 | 967 k |
| v3-basic-tdd            | **75** 🏆 | **799 k** 🏆 |
| v4.1-testlist-scope-fix | 838 | 4.32 M |
| v5.1-testlist-scope-fix | 293 | 8.40 M |
| v6.1-hybrid-…           | 508 | 6.94 M |
| v8a-delayed-refactor-agent  | 143 | 1.18 M |
| v8b-delayed-refactor-native | 116 | 1.32 M |

### claim-office

| Workflow | `duration_seconds` (mean) | `total_tokens` (mean) |
|---|---:|---:|
| v1-oneshot              | 231 | **2.11 M** 🏆 |
| v2-iterative            | 244 | 2.12 M |
| v3-basic-tdd            | 312 | 3.28 M |
| v4.1-testlist-scope-fix | 3229 | 14.10 M |
| v5.1-testlist-scope-fix | 641 | 18.73 M |
| v6.1-hybrid-…           | 1569 | 34.54 M ⚠️ |
| v8a-delayed-refactor-agent  | 308 | 2.12 M |
| v8b-delayed-refactor-native | **276** 🏆 | 3.45 M |

Die strikten TDD-Workflows kosten auf claim-office **3–10× mehr** als auf game-of-life — und v6.1 hat die größte Token-Spanne (σ=12 M, max 44.85 M). v4.1 dauert auf claim-office im Mittel **54 Minuten pro Run** — kombiniert mit dem Bimodal-Risiko (F-tdd-quality.9) der schlechteste Cost-Quality-Tradeoff der ganzen Matrix.

v8a/v8b liegen auf beiden Katas auf v1/v2/v3-Kosten-Niveau (~1–3 M Tokens, 2–5 min) und liefern dabei (auf claim-office) deutlich bessere Verzweigungs-Komplexität als v1/v2/v3 und vergleichbare Korrektheit zu den strikten TDD-Workflows — siehe F-tdd-quality.6 und F-tdd-quality.8.

## F-tdd-quality.6 — Vibe + End-Refactoring erreicht Volumen-Niveau der strikten TDD-Workflows zu Non-TDD-Kosten; Verzweigungs-Komplexität bleibt schwächer

Die Non-TDD-Kontrollgruppe v8a/v8b (Phase 1 Implementation ohne Tests → Phase 2 Tests gegen `prompt.md` → Phase 3 einmaliger Refactor) erreicht auf den Volumen-Metriken Niveau der strikten TDD-Workflows zu einem Bruchteil der Kosten.

### game-of-life

| Workflow | `code_mass` | `cc_longest_function` | `cognitive_max` | `duration_s` | `total_tokens` |
|---|---:|---:|---:|---:|---:|
| v4.1 (periodisches Refactor) | 156.6 | 16.4 | **6.4** 🏆 | 838 | 4.32 M |
| v6.1 (periodisches Refactor) | 153.7 | **14.2** 🏆 | 6.5 | 508 | 6.94 M |
| **v8a (end-refactor, agent)** | **142.0** 🏆 | 17.6 | 10.6 | 143 | **1.18 M** 🏆 |
| **v8b (end-refactor, command)** | 145.8 | 17.6 | 9.0 | **116** 🏆 | 1.32 M |

### claim-office

| Workflow | `code_mass` | `cc_longest_function` | `cognitive_max` | `duration_s` | `total_tokens` |
|---|---:|---:|---:|---:|---:|
| v4.1 (periodisches Refactor) | **621.6** 🏆 | 40.8 | 26.8 ⚠️ | 3229 | 14.10 M |
| v6.1 (periodisches Refactor) | 861.3 | **18.1** 🏆 | **5.7** 🏆 | 1569 | 34.54 M |
| **v8a (end-refactor, agent)** | 813.8 | 28.4 | 7.4 | 308 | **2.12 M** 🏆 |
| **v8b (end-refactor, command)** | 780.2 | 35.8 | 11.0 | **276** 🏆 | 3.45 M |

H5 (Periodizität des Refactorings trägt) **kata-abhängig**:
- Auf game-of-life: v8a/v8b nahezu gleichauf mit v4.1/v6.1 bei `code_mass` und `cc_longest_function`; `cognitive_max` bleibt v4.1/v6.1-dominiert (6.4/6.5 vs 9.0/10.6).
- Auf claim-office: v6.1 dominiert klar bei Verzweigungs-Komplexität (`cognitive_max` 5.7 vs v8a/b 7.4/11.0) und Funktionsgröße (`cc_longest_function` 18.1 vs 28.4/35.8). v4.1 (Code-Volumen-Champion bei 621.6) liefert dagegen die schlechteste Verzweigungs-Komplexität (26.8 ⚠️) — kein Workflow dominiert *alle* Metriken auf claim-office.

Lesart: ein einziges End-Refactoring nach Vibe-Coding reduziert Code-Volumen vergleichbar zu periodischem Refactoring, aber nicht Verzweigungs-Tiefe innerhalb einzelner Funktionen. Auf einer komplexen Kata mit längeren Funktionen wird der Periodizitäts-Vorteil sichtbarer — der TDD-Refactor pro Cycle zerlegt Funktionen früh, während ein End-Refactor sie nur oberflächlich glättet. Konsistent mit RQ-delayed-refactor "der TDD-Vorteil ist Verzweigungs-Komplexität, nicht Substanz".

## F-tdd-quality.7 — Subagent-Mechanismus für End-Refactor schlägt Slash-Command auf großer Kata; gleichauf auf kleiner Kata

Die zwei Non-TDD-Arme isolieren den **Refactor-Delivery-Mechanismus** bei identischem Refactor-Inhalt: v8a spawnt einen frischen Refactor-Subagent (`.claude/agents/refactor.md`, Task-Tool), v8b ruft denselben Inhalt als Slash-Command (`.claude/commands/refactor.md`, Skill-Tool) inline im Haupt-Session-Kontext auf. Beide Refactor-Specs sind byte-identisch (Four Rules of Simple Design + APP-Mass + Naming-Evaluation + Mandatory-Attempt). Phase 1 und Phase 2 ebenfalls identisch.

Auf **game-of-life sind beide Mechanismen praktisch gleichauf**:

| Metrik (kleiner = besser) | v8a (Subagent) | v8b (Command) |
|---|---:|---:|
| `cognitive_max` mean | 10.6 (max 15) | **9.0** (max 17) |
| `mccabe_max` mean | 7.4 (max 9) | **6.8** (max 11) |
| `cc_longest_function` mean | 17.6 (max 27) | 17.6 (max 27) |
| `smell_total` mean | 3.0 | **2.4** |
| `total_tokens` mean | **1.18 M** | 1.32 M |
| `code_mass` mean | **142.0** | 145.8 |

Differenzen liegen alle innerhalb 1 σ (z.B. `cognitive_max` σ_v8a=4.93, σ_v8b=4.47); kein systematischer Vorteil eines Mechanismus.

Auf **claim-office dominiert v8a (Subagent) klar bei Spitzen-Komplexität und Token-Effizienz**:

| Metrik (kleiner = besser) | v8a (Subagent) | v8b (Command) |
|---|---:|---:|
| `cognitive_max` mean | **7.4** (max 10) | 11.0 (max 19) |
| `mccabe_max` mean | **6.6** (max 9) | 8.0 (max 13) |
| `cc_longest_function` mean | **28.4** (max 30) | 35.8 (max 49) |
| `smell_total` mean | **4.0** | 6.2 |
| `total_tokens` mean | **2.12 M** | 3.45 M |
| `verification_pct` mean | **1.00** | 0.97 |
| `code_mass` mean | 813.8 | **780.2** |

v8a führt auf 6 von 7 Metriken; bei `cc_longest_function` ist die Spanne besonders eng (v8a max 30, v8b max 49 — der Subagent verhindert die Outlier-Funktionen). v8b braucht 63 % mehr Tokens und produziert breitere Verteilungen.

**H6 (Subagent-Delivery trägt unabhängig vom Inhalt) auf claim-office bestätigt; auf game-of-life keine Trennung.** Plausible Mechanik: der frische Subagent-Kontext entlastet den Refactor von Anker-Bias aus Phase 1/2 — bei der kleinen, trainingsbekannten game-of-life-Codebase ist der Bias-Effekt gering und beide Mechanismen liefern ähnlich; bei der größeren novel claim-office-Codebase mit 240+ LoC pro Lösung verschleppt der Inline-Command (v8b) implizite Annahmen aus den Vorgänger-Phasen in den Refactor, während der Subagent (v8a) mit dem Refactor neu ansetzt. Konsistent mit RQ-delayed-refactor / F-delayed-refactor.2 (Refactor-Mechanismus ist nicht-trivial), jetzt sauber isoliert von Inhalts-Effekten.

## F-tdd-quality.8 — Test-Schreib-Phase rettet Korrektheit auf novel Kata; reines Vibe-Coding scheitert

Auf der novel Kata `claim-office` mit Mehrdeutigkeiten ist das **Vorhandensein einer Test-Schreib-Phase** der entscheidende Hebel für Korrektheit — nicht ihre Position (vor oder nach Implementation):

| Workflow | Test-Phase? | n | `verification_pct` mean | min |
|---|---|---:|---:|---:|
| v1-oneshot (prose) | nein | 5 | **0.28** | 0.20 |
| v2-iterative (prose) | nein | 5 | **0.28** | 0.20 |
| v4.1-testlist-scope-fix (em) | TDD strict | 5 | 0.96 | 0.80 |
| v8b-delayed-refactor-native (em) | nach Impl | 5 | 0.97 | 0.87 |
| v3-basic-tdd (em) | TDD strict | 5 | 1.00 | 1.00 |
| v5.1-testlist-scope-fix (em) | TDD strict | 6 | 1.00 | 1.00 |
| v6.1-hybrid-… (em) | TDD strict | 7 | 1.00 | 1.00 |
| v8a-delayed-refactor-agent (em) | nach Impl | 5 | 1.00 | 1.00 |

v1/v2 ohne Tests fallen auf 28 % (4/15 Verifikations-Szenarien). Sobald irgendeine Phase Tests gegen die Spec schreibt, springt die Korrektheit auf ≥ 96 %. Die strikten TDD-Workflows v3/v5.1/v6.1 sowie v8a (delayed-refactor via Subagent) erreichen 100 %; v4.1 und v8b liegen bei 96–97 % mit je einem Run unter 1.00 (Implementation-Bugs, die einzelne Verifikations-Szenarien verfehlen — nicht silent workflow drops).

Auf game-of-life ist dieser Hebel **unsichtbar** (alle 8 Workflows bei 100 %), weil das Modell die Lösung memoriert hat. Der Befund manifestiert sich nur auf novel Katas.

Konsequenz für offene Frage #4 ("reicht ein einziges End-Refactoring nach Vibe-Coding aus?"): **Ja für Korrektheit, wenn die nachträglich geschriebenen Tests die Spec abdecken** — v8a (mit scope-fix-Pflicht "Cover every spec example" in Phase 2) erreicht 100 % auf claim-office, gleich auf mit v3/v5.1/v6.1 (strict TDD); v8b 97 %, nahe an v4.1. Code-Qualität ist eine separate Achse (siehe F-tdd-quality.6/.7).

Caveat: v1/v2 nutzen `prose`-Prompt, v8a/v8b `example-mapping`. Die `example-mapping`-Spec ist faktisch eine implizite Test-Spec — der Effekt könnte teilweise dem Prompt-Stil zuzuschreiben sein, nicht nur der Test-Phase. RQ-prompt-correctness (1.1) zeigte aber, dass example-mapping allein auf v5 nur ~5 pp gegenüber prose bringt; der hier gemessene Effekt (+68 pp) ist zu groß für einen reinen Prompt-Stil-Effekt.

## F-tdd-quality.9 — v6.1-Hybrid ist der robusteste TDD-Workflow über beide Katas; v4.1 ist kata-instabil

Pro-Kata Komplexitäts-Ranking auf `cognitive_max` (kleiner = besser):

| Rang | game-of-life | claim-office |
|---:|---|---|
| 1 | **v4.1** (6.4) 🏆 | **v6.1** (5.7) 🏆 |
| 2 | v6.1 (6.5) | v8a (7.4) |
| 3 | v8b (9.0) | v8b (11.0) |
| 4 | v8a (10.6) | v2-iterative (11.4) |
| 5 | v2-iterative (16.2) | v1-oneshot (12.2) |
| 6 | v5.1 (17.6) | v5.1 (14.8) |
| 7 | v1-oneshot (18.8) | v3-basic-tdd (19.8) |
| 8 | v3-basic-tdd (21.8) | v4.1 (26.8) ⚠️ bimodal |

Strikte phasen-strukturierte Workflows (v6.1, v4.1) belegen auf beiden Katas die vordersten Plätze (mit der v4.1-Ausnahme auf claim-office); die v8-Kontrollgruppe folgt direkt dahinter. Die schwächsten TDD-Workflows (v3, v5.1) und v1+prose teilen sich das hintere Drittel. **v6.1 ist der einzige Workflow, der auf beiden Katas in den Top-2 landet** und auf claim-office in 4 von 6 Qualitäts-Metriken die Spitze hält.

**v4.1 stürzt auf claim-office von Platz 1 auf 8 ab** (`cognitive_max` mean 26.8, σ=24, max=68) — bimodal mit gelegentlichen extremen Fehlsteuerungen. Auf game-of-life ist v4.1 stabilster Performer. Lesart: der v4.1-Vorteil (phasen-isolierte Subagents) trägt nur auf einer Kata, deren Test-Liste vom Modell unmittelbar überschaut werden kann. Auf claim-office mit ~15 Test-Szenarien und vielen Mehrdeutigkeiten verliert der frische Kontext pro Phase die Kohärenz — der Subagent re-interpretiert die Spec pro Cycle. v6.1 (Hybrid: Skill-Red/Green im Shared-Context + isolierter Refactor) vermeidet diesen Effekt, weil Red und Green denselben Kontext teilen.

Empfehlung: **v6.1 als robuste Default-Wahl** über Kata-Komplexität hinweg. v4.1 nur auf Katas mit kompakter Test-Liste einsetzen, sonst Kollaps-Risiko.

Caveat: n=5 pro claim-office-Zelle, n=10 für v1/v2/v3 game-of-life. v4.1-claim-office `cognitive_max`-σ=24 — der mean ist von 1–2 Outliern dominiert. Größerer n könnte das Bild verschieben, das Bimodal-Risiko aber nicht.

## Praktische Empfehlung — Code-Qualität vs Token-Preis

### Klarstellung zur Kernfrage

Die ursprüngliche Forschungs-Motivation war: *ist der TDD-Zyklus mit kontinuierlichem Refactoring pro Cycle wertvoller als Vibe-Coding mit einmaligem End-Refactoring?* Die Datenlage ist eindeutig:

**Ja, kontinuierliches Refactoring im TDD-Zyklus produziert messbar bessere Code-Qualität.** Auf claim-office (komplexe novel Kata) gewinnt v6.1 auf 5 von 6 Code-Qualitäts-Metriken klar gegen die End-Refactor-Kontrollen:

| Metrik (kleiner = besser) | v6.1 (periodisch) | v8a (end-refactor, agent) | v8b (end-refactor, command) | Sieger |
|---|---:|---:|---:|---|
| `cognitive_max` | **5.7** | 7.4 | 11.0 | **v6.1** |
| `mccabe_max` | **5.7** | 6.6 | 8.0 | **v6.1** |
| `cc_longest_function` | **18.1** | 28.4 | 35.8 | **v6.1** |
| `smell_total` | **1.3** | 4.0 | 6.2 | **v6.1** |
| `cc_loc` | **191** | 246 | 239 | **v6.1** |
| `code_mass` | 861 | 814 | **780** | v8b (knapp) |

v6.1 dominiert die Verzweigungs- und Struktur-Metriken durchgehend; v8b gewinnt nur knapp bei `code_mass` (Reduktion ~9 %). Auf game-of-life ist das Muster konsistent (v6.1 `cognitive_max` 6.5 vs v8a/v8b 10.6/9.0; `cc_longest` 14.2 vs 17.6/17.6). Die Periodizitäts-These hält uniform.

### Der Tradeoff: Token- und Wallclock-Preis

Diese Qualität ist **nicht umsonst**. Auf claim-office:

| Workflow | `cognitive_max` | `total_tokens` | `duration_s` | Tokens-Verhältnis |
|---|---:|---:|---:|---:|
| v8a-delayed (Agent) | 7.4 | **2.12 M** | 308 | 1.0× |
| v8b-delayed (Command) | 11.0 | 3.45 M | **276** | 1.6× |
| v6.1-hybrid | **5.7** | 34.54 M | 1569 | **16×** |
| v4.1-strict | 26.8 ⚠️ | 14.10 M | 3229 | 7× |

v6.1 kostet **16× mehr Tokens und ~5× mehr Wallclock** als v8a für eine Reduktion von 7.4 → 5.7 in `cognitive_max` (und weitere Verbesserungen bei `cc_longest`, `smell_total`, `cc_loc`). Das ist die ehrliche Bilanz.

### Empfehlung nach Anwendungsfall

| Situation | Workflow | Begründung |
|---|---|---|
| **Langlebiger Produktiv-Code** — wird oft gelesen, refactored, erweitert; Onboarding-relevant | **v6.1-hybrid** | Beste Verzweigungs-Komplexität auf beiden Katas; Token-Aufschlag amortisiert sich über die Code-Lebensdauer |
| **Wartungs-kritischer Code** mit hohen Korrektheits-Ansprüchen, der nicht häufig geändert wird | **v6.1-hybrid** oder **v5.1** | v5.1 ist auf claim-office in `cognitive_max` zweitbester TDD-Workflow (14.8) bei ~½ der Tokens von v6.1 |
| **Prototyping / Throwaway-Code** — wird wenig oder nie wieder angefasst | **v8b-delayed-refactor-command** | Niedrigste Wallclock unter den Workflows mit Test-Schreib-Phase; Korrektheit 0.97 gleichauf mit v4.1; `cognitive_max` (11.0) ist für kurze Lebensdauer akzeptabel |
| **Hohe Iterations-Frequenz** unter Token-Budget — viele kleine Aufgaben, häufige Re-Runs | **v8a-delayed-refactor-agent** | ~16× günstiger als v6.1; `cognitive_max` 7.4 (vs v6.1 5.7) ist nicht ideal, aber für kurze Lebensdauer akzeptabel; 100 % Korrektheit auf claim-office |
| **Reines Vibe-Coding ohne Tests** | **Nicht empfohlen für novel Probleme** | v1/v2 brechen auf novel Kata auf 28 % Korrektheit ein; die Test-Schreib-Phase aus v8a/v8b ist die billigste Versicherung dagegen |
| **Korrektheit zählt mehr als Qualität** (z.B. Skript, Tooling, Glue-Code) | **v3-basic-tdd** | 100 % Korrektheit auf claim-office bei 3.28 M Tokens — günstigster Korrektheits-Workflow; akzeptiert die schlechteste Code-Qualität (cog 19.8, größter `code_mass`) als Preis |

v4.1-strict bleibt **nicht generell empfohlen** wegen des Bimodal-Risikos auf längeren Test-Listen (claim-office σ=24, max cog=68). Nur auf Katas mit kompakter, übersichtlicher Test-Spec.

### Was diese Empfehlung NICHT trifft

- **Modell-Abhängigkeit**: alle Befunde gelten für `opus-4-7-no-thinking`. Auf Sonnet/Haiku kann die Reihenfolge sich verschieben (vgl. F-emoji-cross-model in RQ-emoji-cross-model: Workflow-Reduktionen sind nicht modell-agnostisch).
- **Domänen-Abhängigkeit**: die Katas sind ~30–320 LoC Library/CLI-Code. Auf Web-Apps, Datenbank-Code, Async-Systems sind die Befunde nicht direkt übertragbar.
- **Team-Faktoren**: HITL-Workflows (Mensch reviewed Cycle), Pair-Programming-Setups, IDE-Integration sind außerhalb des Scopes.
