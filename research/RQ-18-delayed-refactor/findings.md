# RQ-18 Findings

Vergleich: TDD-mit-periodischem-Refactor (`v6.5.4`) vs Oneshot-Implementation + nachträgliche Tests + End-Refactor in zwei Flavors (`v8a` mit spezialisiertem Refactor-Subagent, `v8b` mit nativem Inline-Refactor). Kata: `game-of-life-example-mapping`. Modell: `opus-4-7-no-thinking`. n=10 pro Arm, alle 30 Runs `tests_passing=true` und `completed_within_budget=true`.

## Übersicht

| Metrik | v6.5.4 TDD-periodic | v8a oneshot+agent | v8b oneshot+native |
|---|---:|---:|---:|
| `cognitive_max` | **4.2 ± 1.87** | 7.8 ± 4.89 | 4.4 ± 0.97 |
| `mccabe_max` | **3.8 ± 0.42** | 6.0 ± 2.54 | 4.1 ± 0.32 |
| `cc_longest_function` | 15.0 ± 3.23 | 15.3 ± 4.92 | **12.6 ± 1.58** |
| `lines_of_code` | **32.1 ± 3.35** | 38.7 ± 6.91 | 46.3 ± 5.60 |
| `code_mass` | 146.2 ± 7.47 | **144.1 ± 10.4** | 151.0 ± 6.32 |
| `smell_total` | **2.0 ± 0** | 2.4 ± 0.84 | 2.3 ± 0.48 |
| `tests_total` | 8.1 ± 0.74 | 18.8 ± 2.82 | 18.5 ± 2.76 |
| `test_lines` | 49.5 ± 6.06 | 190.1 ± 34.3 | 164.9 ± 29.5 |
| `duration_seconds` | 740.6 | 171.3 | 92.4 |
| `total_tokens` | 8.42 M | 0.99 M | 0.86 M |
| `tests_passing` | 10/10 | 10/10 | 10/10 |

## F-18.1 — Periodisches Refactoring senkt Verzweigungs-Komplexität, nicht Substanz

`cognitive_max` und `mccabe_max` sind unter v6.5.4 niedriger als unter beiden v8-Armen — bei `code_mass` und `cc_longest_function` gibt es **keinen** entsprechenden Vorteil. v6.5.4 produziert nicht weniger Code, sondern Code mit flacheren Verschachtelungen. Auf den naiven "Mehr Refactor = besserer Code"-Erwartungen hätten alle vier Metriken mitziehen müssen.

H1 (TDD-Periodizität schlägt End-Refactor) gilt damit nur auf der Verzweigungs-Achse. Auf Funktionslänge und Mass ist der Effekt im Rauschen.

## F-18.2 — Spezialisierter Refactor-Agent schadet beim End-Refactor

v8a (`refactor.md` 1:1 aus v6.5.4 als End-Refactor-Subagent) ist auf **allen drei Komplexitäts-Metriken** schlechter als v8b (nativer Inline-Refactor ohne APP, ohne Naming-Block, ohne Mandatory-Attempt):

- `cognitive_max` 7.8 ± 4.89 (max 17) vs 4.4 ± 0.97 (max 7)
- `mccabe_max` 6.0 ± 2.54 vs 4.1 ± 0.32 (σ 8×)
- `cc_longest_function` 15.3 ± 4.92 vs 12.6 ± 1.58 (σ 3×)

σ ist bei v8a 3–8× größer — der Subagent macht *gelegentlich schädliche* Refactorings, nicht *systematisch hilfreiche*. Die ursprüngliche H2 ("spezialisierter Refactor-Inhalt trägt") ist nicht nur falsifiziert, sondern **invertiert**.

Hypothese: APP-Mass-Reduktion und Verzweigungs-Reduktion sind keine kongruenten Ziele. Wenn der Agent unter Mandatory-Attempt-Pflicht steht und keinen periodischen Test-Kontext hat, der die Aufgabe natürlich bewahrt, optimiert er gegen Mass (Konstanten, Bindungen, Invocations) auf Kosten von Cognitive (verschachtelte Bedingungen, indirekte Aufrufe).

Wichtige Einschränkung der Hypothese: derselbe Agent funktioniert in v6.5.4 — also im periodischen TDD-Kontext — gut. Es ist nicht der Agent allein, sondern die Kombination aus Agent und Einmal-Schuss auf vollständig vorhandenem Code.

## F-18.3 — Vibe-Tests sind regressionsförmig

v8a/v8b haben 18.5–18.8 Tests bei 165–190 `test_lines` (~9–10 lines/test). v6.5.4 hat 8.1 Tests bei 49.5 `test_lines` (~6 lines/test). Die nachträglichen Tests sind 2.3× zahlreicher und doppelt so verbose pro Test.

H3 war explorativ, das Muster ist klar: Tests, die nach einer fertigen Implementierung gegen `prompt.md` geschrieben werden, sind **breit und implementierungsspiegelnd** — sie verifizieren Verhaltensdetails, die in der Spec nicht explizit gefordert sind. TDD-Tests sind **minimal und spec-treu**. Welche Variante "besser" ist, hängt vom Bewertungsmaßstab ab (Detection-Strength vs Lesbarkeit/Refactor-Freundlichkeit). Mutation-Score wäre die nächste Messung, falls die Frage relevant wird.

## F-18.4 — Kosten-Quotient ~10×

`total_tokens`: v6.5.4 = 8.42 M, v8a/v8b ≈ 0.9 M. `duration_seconds`: v6.5.4 = 740 s, v8b = 92 s. Der TDD-Qualitätsvorteil auf cognitive/mccabe kostet eine Größenordnung Tokens und Zeit gegen den nativen End-Refactor.

Auf claim-office (Korrektheit-außen, RQ-1) ist der Token-Faktor bei TDD-Workflows typischerweise durch besseres `verification_pct` aufgewogen — hier auf game-of-life (Code-Qualität-innen) gibt es kein Korrektheits-Argument: alle 30 Runs sind `tests_passing=true`. Der Kosten-Trade-off steht damit nackt.

## F-18.5 — Native Inline-Refactor ist deterministischer als der Subagent

σ auf `mccabe_max`: 0.32 (v8b) vs 0.42 (v6.5.4) vs 2.54 (v8a). σ auf `cognitive_max`: 0.97 (v8b) vs 1.87 (v6.5.4) vs 4.89 (v8a). v8b ist auf reinen Disziplin-Outcomes der **deterministischste** Arm.

Das passt zur Lesart: der native Inline-Refactor macht *konservative* Refactorings — keine Mandatory-Attempt-Pflicht, kein APP-Druck, keine Naming-Evaluierungs-Schleife — und produziert daher weniger Varianz. Der Agent macht aggressivere Eingriffe und trifft dabei manchmal das Falsche.

## Quintessenz

Die naive "Vibe-Coding + End-Refactor"-These ist auf Komplexitäts-Achsen *nicht trivial widerlegbar*: v8b liegt auf `cognitive_max` (4.4 vs 4.2) und `mccabe_max` (4.1 vs 3.8) statistisch nahe an v6.5.4 — und ist deterministischer. Der reale TDD-Vorteil liegt bei `lines_of_code` (32 vs 46, ein Drittel weniger Code) und bei der `smell_total`-Stabilität (σ=0).

Das Hauptargument *für* periodisches Refactoring innerhalb von TDD-Cycles ist damit:

1. **Kompaktheit**: 30 % weniger LoC bei gleichen Tests.
2. **Smell-Stabilität**: σ=0 statt σ=0.48–0.84.
3. **Code-Qualität ohne harten Outlier**: max-`cognitive_max` 7 (v6.5.4) vs 17 (v8a) vs 7 (v8b).

Das Hauptargument *gegen* ist der ~10× Kosten-Faktor.

Ein Folge-Befund, der den Workflow-Bau direkt betrifft: **die `refactor.md`-Mechanik mit APP + Mandatory-Attempt funktioniert nur im periodischen Kontext**. Als End-Refactor-Mechanik schadet sie (F-18.2). Wer Refactor-Agenten außerhalb von TDD-Loops verwenden will, sollte das `Mandatory-Attempt`-Element herausnehmen und das APP-Optimierungsziel auf Cognitive umstellen — beides nicht in dieser RQ getestet.
