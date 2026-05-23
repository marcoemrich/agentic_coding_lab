# RQ-pep-emoji-v6.1 — Findings

_Sind die Effekte der pep- und emoji-Reduktionen auf v6.1-Basis additiv (zwei unabhaengige Kanaele) oder gemeinsam getragen (ein 'Prompt-Drumherum'-Mechanismus)?_

## Übersicht (Primär-Outcome Code-Qualität — kleiner = besser)

| Outcome | hybrid (pep+emoji) | no-pep | no-emoji | no-pep-no-emoji |
|---|---:|---:|---:|---:|
| `code_mass` (APP) | 153.7 | **144.6** 🏆 | 156.8 | 153.2 |
| `smell_total` | 2.4 | **2.0** 🏆 | **2.0** 🏆 | 2.2 |
| `cc_longest_function` | 14.2 | 13.2 | **11.4** 🏆 | 16.2 |
| `cognitive_max` | 6.5 | **4.6** 🏆 | 6.6 | 7.8 |
| `mccabe_max` | 5.2 | 4.8 | **4.6** 🏆 | 5.0 |

Die kombinierte Reduktion gewinnt **keine** Code-Qualitäts-Metrik. Alle Δ < 1σ — Code-Qualität bleibt indistinguishable, aber die Trophäen-Verteilung (no-pep 3×, no-emoji 2×, kombiniert 0×) ist konsistent mit dem Disziplin-Interaktions-Befund unten.

---

## F-1.1 — Pep- und Emoji-Reduktion: keine Additivität, sondern Sättigung mit Anti-Effekt

**Aussage:** Die kombinierte Entfernung von Pep-Talks UND Decoration-Emojis (v6.1-no-pep-no-emoji) auf v6.1-Basis verhält sich **nicht additiv** zu den Einzel-Reduktionen aus [RQ-pep-v6.1](../1.1-pep-effect-v6.1/findings.md) und [RQ-emoji-v6.1](../1.2-emoji-effect-v6.1/findings.md). Die Disziplin-Verschiebung saturiert bei `tests_passed_immediately` und **kehrt sich um** bei `refactorings_applied` — die Kombination refactoriert sogar weniger als die Baseline mit Pep+Emoji.

| Metrik (Richtung) | hybrid (Baseline) | no-pep | no-emoji | kombiniert | Additive Vorhersage |
|---|---:|---:|---:|---:|---:|
| `refactorings_applied` (höher = aktiver) | 4.1 | **7.0** 🏆 | 5.4 | 3.8 | ~9.1 |
| `tests_passed_immediately` (kleiner = disziplinierter) | 4.7 | **1.2** 🏆 | 2.2 | **1.2** 🏆 | ~0.6 (multiplikativ) |
| `cycle_count` | 8.7 | 8.8 | 8.8 | 9.2 | ≈ |
| `predictions_correct_rate` | 99.4% | **100%** 🏆 | 97.7% | 98.6% | ≈ |

**Begründung:** Die Interaktion ist nicht-monoton: für `tests_passed_immediately` reicht die Pep-Entfernung allein, um den maximalen Disziplin-Gewinn zu erzielen (1.2 = derselbe Wert in no-pep und no-pep-no-emoji). Für `refactorings_applied` *verkehrt* sich der Einzel-Effekt bei kombinierter Anwendung sogar in die Gegenrichtung. Eine plausible Lesart: jede der beiden Reduktionen entfernt eine "Reassurance/Wegweiser"-Schicht, die das Modell zum Refactor-Subagenten-Spawn motiviert. Bei *einer* fehlenden Schicht greift das Modell zur verbleibenden und überkompensiert. Bei *beiden* fehlenden Schichten fehlt der Triggertext für mehr Refactoring komplett — der Workflow läuft schneller durch, mit weniger Refactor-Subagent-Aufrufen. Hypothese A (additiv) ist damit klar **widerlegt**; Hypothese B (gemeinsamer Mechanismus / Sättigung) ist teilweise bestätigt, aber die Anti-Additivität bei `refactorings_applied` zeigt, dass die Kanäle nicht nur denselben Effekt verdoppeln, sondern miteinander interagieren.

---

## F-1.2 — Korrektheit robust gegen alle Reduktionskombinationen

**Aussage:** Alle vier Workflows erreichen 100 % **Korrektheit (innen)** (`tests_passing`) und 100 % **Korrektheit (außen)** (`verification_pct`) sowie 100 % `completed_within_budget`. Weder die Einzel-Reduktionen noch ihre Kombination beschädigen die Korrektheit auf game-of-life-example-mapping.

| Outcome | hybrid | no-pep | no-emoji | no-pep-no-emoji |
|---|---:|---:|---:|---:|
| **Korrektheit (innen)** | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| **Korrektheit (außen)** | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `completed_within_budget` | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |

**Begründung:** Bestätigt H3. Die v6.1-Basis (mit Test-List-Scope-Fix) ist robust gegen die untersuchten Decoration-/Pep-Reduktionen — der Korrektheits-Befund von RQ-pep-v6.1 und RQ-emoji-v6.1 übersetzt sich vollständig in die Kombination.

---

## F-1.3 — Kombinierte Reduktion läuft schneller mit weniger Refactor-Phasen

**Aussage:** v6.1-no-pep-no-emoji ist die **schnellste** Zelle (432 s, −15 % vs Baseline 508 s) und liegt bei Tokens unter beiden Einzelreduktionen. Mechanistisch ist das eine Konsequenz von F-1.1: weniger Refactor-Subagent-Spawns (3.8 vs 7.0 in no-pep, 5.4 in no-emoji) → geringere Wallclock- und Token-Last.

| Metrik (kleiner = besser) | hybrid | no-pep | no-emoji | no-pep-no-emoji |
|---|---:|---:|---:|---:|
| `duration_seconds` (Mittel) | 507.9 | 777.2 | 668.8 | **432.0** 🏆 |
| `total_tokens` (Mittel) | **6.94 M** 🏆 | 8.66 M | 7.78 M | 7.58 M |

**Begründung:** Im Gegensatz zur Einzel-Reduktions-Erwartung (no-pep / no-emoji kosten *mehr* Tokens wegen zusätzlicher Refactor-Phasen — siehe RQ-emoji-v6.1 F-1.2) spart die Kombination Zeit, weil der gegenläufige Effekt aus F-1.1 die Refactor-Phasenzahl reduziert. Die Kombination ist also operational günstiger — aber zum Preis der "fehlenden" Refactor-Aktivität, die in den Einzel-Reduktionen als positiver Disziplin-Effekt galt. Was hier "gespart" wird, ist möglicherweise dieselbe Aktivität, die der no-pep-Befund als Vorteil pries — die Kostenrechnung hängt davon ab, wie man "mehr Refactoring" wertet.

---

## Status der Hypothesen

| Hypothese | Status | Beleg |
|---|---|---|
| **H1** Effekte additiv | widerlegt | `refactorings_applied` kombiniert = 3.8 vs. additive Vorhersage ~9.1; sogar unter Baseline 4.1 |
| **H2** Effekte saturiert / gemeinsamer Mechanismus | teilweise bestätigt | `tests_passed_immediately` saturiert exakt bei no-pep-Wert; aber Anti-Additivität bei `refactorings_applied` ist mehr als reine Sättigung |
| **H3** Korrektheit invariant | bestätigt | 100/100/100/100 in beiden Korrektheits-Metriken und `completed_within_budget` |
| **H4** Code-Qualität indistinguishable | bestätigt | alle Δ < 1σ; Trophäen-Verteilung (no-pep 3×, no-emoji 2×, kombiniert 0×) ohne klarer Sieger |
| **H5** Token-Kosten kombiniert höher als hybrid | widerlegt (mit umgekehrtem Trend) | kombiniert sogar **schneller** als Baseline (-15 %), weil weniger Refactor-Phasen |

**Konsequenz für den Reduktions-Recipe:** Pep und Emoji sind **nicht orthogonal** als Reduktionshebel — ihre Kombination produziert qualitativ anderes Verhalten als die Summe der Einzeleffekte. Eine kombinierte v6.1-no-pep-no-emoji-Variante ist als "schnellster v6.1-Workflow ohne Korrektheits-Verlust" interessant, opfert aber einen Teil der Refactor-Aktivität, die die Einzel-Reduktionen als positiven Disziplin-Effekt zeigten. Welche dieser Lesarten ("schneller & schlanker" vs. "weniger diszipliniert") überwiegt, hängt vom Anwendungskontext ab und sollte im nächsten Schritt auf einer komplexeren Kata (claim-office) validiert werden, bevor v6.1-no-pep-no-emoji als Recipe-Empfehlung übernommen wird.

**Caveat Routing-Asymmetrie:** Die 5 neuen v6.1-no-pep-no-emoji-Runs liefen via Portkey-Gateway, die 15 wiederverwendeten Baseline-Runs direct API. Die `duration_seconds`-Differenz könnte teilweise Routing-Artefakt sein (Portkey-Latenz unterscheidet sich i.d.R. von Direct). Die Disziplin-Befunde (`refactorings_applied`, `tests_passed_immediately`) und Korrektheits-Befunde sollten Routing-unabhängig sein.
