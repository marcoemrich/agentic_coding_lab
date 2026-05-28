# RQ-model-novel-oc — Findings

**Setup**: claim-office-example-mapping × v5.1-testlist-scope-fix-oc × n=5 pro Zelle (40 Runs total, 8 Modelle). Stand 2026-05-28.

## Übersicht

Korrektheit außen (`verification_pct`, höher = besser) als primärer Outcome; Code-Qualitäts-Metriken sekundär (kleiner = besser außer wo notiert).

| Metrik | Richtung | opus-4-7-portkey | glm-5-1 | mistral-medium-3-5 | kimi-k2-6 | gemini-3-5-flash | deepseek-v4-flash | deepseek-v4-pro | minimax-m2-7 |
|---|---|---|---|---|---|---|---|---|---|
| `verification_pct` (mean) | höher | **1.00** 🏆 | **1.00** 🏆 | 0.95 | 0.84 | 0.80 | 0.60 | 0.60 | 0.04 |
| `verification_pct` (std) | kleiner | **0.00** 🏆 | **0.00** 🏆 | 0.09 | 0.26 | 0.45 | 0.55 | 0.55 | 0.09 |
| `smell_total` (mean) | kleiner | **0.8** 🏆 | 4.0 | 23.6 | 20 | 18 | 13.4 | 16.6 | 10.2 |
| `cognitive_max` (mean) | kleiner | **9.8** 🏆 | 12.2 | 74.8 | 21.8 | 40.2 | 11.6 | 17.4 | 11.4 |
| `mccabe_max` (mean) | kleiner | **7.6** 🏆 | 9.2 | 33.6 | 17.6 | 23.4 | 9.2 | 11.0 | 7.6 |
| `cc_longest_function` (mean) | kleiner | **25.4** 🏆 | 28.8 | 120 | 54.4 | 98.4 | 31.6 | 42.2 | 30.0 |
| `code_mass` (mean) | kleiner (bei gleicher Korrektheit) | **759.6** 🏆 | 816 | 712.6 | 741 | 526 | 566.2 | 554.6 | 364.4 |
| `total_tokens` (mean) | kleiner (bei gleicher Korrektheit) | **8.06 M** 🏆 | 10.97 M | 13.65 M | 6.65 M | 7.02 M | 6.77 M | 4.46 M | 8.48 M |
| `cost_usd` (mean, $/Run) | kleiner (bei gleicher Korrektheit) | $5.90 | **$2.10** 🏆 | $24.69 † | $2.78 | $2.23 | $0.28 ‡ | $0.11 ‡ | $2.40 |
| `cycle_count` (mean) | — | 1.2 | 2.0 | 1.2 | 2.0 | 2.2 | 3.2 | 2.6 | 4.8 |
| `predictions_total` (mean) | — | 2.4 | 4.0 | 0.8 | 0.4 | 0.4 | 2.0 | 2.6 | 2.6 |
| `duration_seconds` (mean) | kleiner | **664** 🏆 | 1726 | 4051 | 1811 | 395 | 1279 | 956 | 1428 |

`cycle_count` und `predictions_total` sind ambivalente Metriken ohne klare Richtung — kein Pokal. Bei `code_mass`, `total_tokens` und `cost_usd` ist weniger besser, aber nur bei vergleichbarer Korrektheit aussagekräftig: MiniMax' niedrige Werte sind Stub-Artefakt (verification 0.04), Flash' Werte werden vom 3-LoC-Abbruch-Run (siehe F-1.2) gezogen, DeepSeek-flash/pro liegen mit vpt=0.60 deutlich unter dem Gating-Schwellwert, Mistral mit vpt=0.95 knapp darunter — deshalb dort jeweils kein Pokal. Cost-Effizienz bei tatsächlich nutzbarer Korrektheit: siehe F-1.6.

‡ DeepSeek-Cost bezieht sich auf alle n=5 Runs inklusive der zwei CLI-Vertrags-Abbrüche vom 27.05. Auf den drei perfekten Runs (vpt=1.0) liegt der mean cost bei $0.32 (flash) bzw. $0.16 (pro) — beide damit ~1/7 GLM 5.1 und ~1/20 Opus. Pricing-Quelle: OpenRouter API (`deepseek-v4-flash` paid tier $0.10/$0.20/$0.02 cache_read; `deepseek-v4-pro` $0.435/$0.87/$0.003625 cache_read pro 1M Token, Stand 2026-05-28). Cost-Profil DeepSeek ist real, der Pokal wird wegen Gating dennoch nicht vergeben — siehe F-1.8.

† Mistral-Cost wird durch fehlendes OpenCode-Prompt-Caching dominiert (kein `prompt_cache_key`); mit aktivem Caching wäre der Wert ~$3.25/Run statt $24.69. Details in der Cost-Sektion und F-1.7.

**Trophy-Regel zur Korrektheits-Gating**: Pokale für Qualitäts-/Effizienz-Metriken (`smell_*`, `cognitive_*`, `mccabe_*`, `cc_*`, `duration_seconds`, `total_tokens`, `cost_usd`) werden nur an Modelle mit `verification_pct = 1.0` vergeben. Begründung: niedrige Komplexität / kurze Dauer / niedrige Kosten bei nicht-korrekter Implementierung misst nicht das was die Metrik vorgibt zu messen, sondern Stub- oder Abbruch-Artefakte. In dieser Studie sind Opus und GLM 5.1 vpt=1.0 — beide qualifizieren sich. Pokal-Vergabe innerhalb dieses Pools: Opus gewinnt Code-Qualität (Smells, Komplexität, Code-Mass) und Wallclock; GLM 5.1 gewinnt Cost. `total_tokens` an Opus (8.06 M vs 10.97 M). Mistral mit vpt=0.95 fällt knapp aus dem Pool — siehe F-1.7 für das Mistral-spezifische Profil (hohe Korrektheit gepaart mit deutlich höheren Komplexitäts- und Kosten-Werten).

**Cost-Berechnung**: per-Run aus `transcript-metrics.json.total_tokens` × Pricing per 1M Token. Quellen 2026-05-26: Anthropic Pricing-Seite (Opus), OpenRouter API `/api/v1/models` (GLM/Kimi/MiniMax), Vertex Standard (Gemini Flash), Mistral Docs Model-Card (Mistral Medium 3.5).

| Modell | input | output | cache_read |
|---|---|---|---|
| opus-4-7 (via Vertex EU) | $5.00 | $25.00 | $0.50 (10%) |
| glm-5-1 (OpenRouter) | $0.98 | $3.08 | $0.18 |
| kimi-k2-6 (OpenRouter) | $0.73 | $3.49 | $0.37 |
| gemini-3-5-flash (Vertex Standard) | $1.50 | $9.00 | $0.15 |
| minimax-m2-7 (OpenRouter) | $0.279 | $1.20 | $0.279 (keine Cache-Rate von OpenRouter gelistet → input-Rate als konservative Obergrenze) |
| mistral-medium-3-5 (Mistral Direct) | $1.50 | $7.50 | $0.15 (10% der Input-Rate, gemäß Mistral-Doku [Prompt caching](https://docs.mistral.ai/studio-api/conversations/advanced/prompt-caching)) |
| deepseek-v4-flash (OpenRouter paid) | $0.10 | $0.20 | $0.02 |
| deepseek-v4-pro (OpenRouter) | $0.435 | $0.87 | $0.003625 |

Portkey-Markup nicht eingerechnet (Portkey listet keinen modell-spezifischen Aufschlag, Gateway-Plan-Kosten sind separate Tier-Pauschalen).

**Cost-Aufschlüsselung pro Mittel-Run** (Tokens als Mittelwert über n=5, Cost-Spalten = Tokens × Rate):

| Modell | input (mean) → cost | output (mean) → cost | cache_read (mean) → cost | total |
|---|---|---|---|---|
| opus-4-7-portkey | 143 k × $5.00 = $0.71 | 50.2 k × $25.00 = $1.25 | 7.86 M × $0.50 = $3.93 | **$5.90** |
| glm-5-1 | 143 k × $0.98 = $0.14 | 7.7 k × $3.08 = $0.02 | 10.77 M × $0.18 = $1.94 | **$2.10** |
| kimi-k2-6 | 649 k × $0.73 = $0.47 | 26.8 k × $3.49 = $0.09 | 5.97 M × $0.37 = $2.21 | **$2.78** |
| gemini-3-5-flash | 635 k × $1.50 = $0.95 | 35.7 k × $9.00 = $0.32 | 6.35 M × $0.15 = $0.95 | **$2.23** |
| minimax-m2-7 | 234 k × $0.279 = $0.07 | 38.4 k × $1.20 = $0.05 | 8.21 M × $0.279 = $2.29 | **$2.40** |
| mistral-medium-3-5 | 16.05 M × $1.50 = $24.08 | 63.2 k × $7.50 = $0.47 | 0.95 M × $0.15 = $0.14 | **$24.69** |
| deepseek-v4-flash | 1.73 M × $0.10 = $0.17 | 26.4 k × $0.20 = $0.005 | 4.99 M × $0.02 = $0.10 | **$0.28** |
| deepseek-v4-pro | 183 k × $0.435 = $0.08 | 20.8 k × $0.87 = $0.02 | 4.24 M × $0.003625 = $0.015 | **$0.11** |

Bemerkung: das `total_tokens`-Feld in der Übersichts-Tabelle täuscht über die Cost — z. B. Opus' "8 M Tokens" sind zu ~97 % `cache_read`, das bei Anthropic-Pricing nur 10 % des Input-Preises kostet (cache hit ↔ 0.1×). Echter Input pro Opus-Run liegt bei ~140 k Tokens; die Cache-Tokens stammen aus wiederholt eingelesenen System-Prompts/Tool-Definitionen, die im Skill-Workflow über mehrere Skill-Aufrufe pro Run mehrfach durchlaufen. Bei den OpenRouter-Modellen ist das Cache-Verhältnis ähnlich, aber die Cache-Rate variiert pro Provider (GLM $0.18, Kimi $0.37, MiniMax keine Cache-Rate gelistet → input-Rate als konservative Obergrenze).

**Mistral-Cost-Ausreißer ist ein OpenCode-Integrations-Artefakt, nicht Mistral-Pricing**: Mistral Medium 3.5 fällt mit $24.69/Run massiv aus dem Rahmen (4× Opus, 12× GLM). Ursache ist nicht die Modell-Pricing-Rate ($1.50/$7.50 ist vergleichbar mit Gemini Flash), sondern das **Caching-Verhalten der OpenCode-Mistral-Integration**. Token-Verteilung bei Mistral: 93 % `input`, 7 % `cache_read`. Bei Opus: 1.4 % `input`, 98 % `cache_read`. Mistral hat sehr wohl eine Prompt-Cache-Rate von 10 % der Input-Rate ($0.15/M), aber Caching ist bei der Mistral-API explizit **opt-in via `prompt_cache_key`** ([Mistral Docs / Prompt caching](https://docs.mistral.ai/studio-api/conversations/advanced/prompt-caching)). OpenCode bzw. das verwendete `@ai-sdk/openai-compatible`-Provider-NPM setzt diesen Key nicht — daher landen nur die ~5 % an Tokens im Cache, die Mistral automatisch via KV-Cache-Prefix-Match erkennt.

Hypothesen-Szenarien bei aktivem `prompt_cache_key` (gleiche Token-Volumen, aber 99 % Cache-Hit wie bei Opus auf Anthropic):

| Szenario | Cache-Hit-Rate | Mistral-Cost/Run | Vergleich |
|---|---|---|---|
| As-measured (Status quo OpenCode) | ~5 % | $24.69 | 4× Opus |
| Mit moderatem Caching | ~70 % | $9.91 | Faktor 2 unter Opus, doppelt GLM |
| Mit aggressivem Caching (Anthropic-Niveau) | ~99 % | $3.25 | Sonnet-Niveau, ~50 % über GLM |

In einem Modell-Vergleich, der den OpenCode-Harness konstant hält, ist der Status-quo-Wert ($24.69) die relevante Größe — denn das ist was eine produktive OpenCode-Pipeline heute tatsächlich kostet. Aber: **das Cost-Ergebnis ist deshalb kein robuster Modell-Befund über Mistral**, sondern hängt am Integrations-Detail. Bei Mistral-Direct-API mit `prompt_cache_key`-Patch oder bei einem anderen Harness mit nativem Caching-Support käme Mistral in den GLM/Sonnet-Cost-Bereich.

Bei nicht-cacheabler Workload (CI/CD-Pipelines die Container-Reset ohne Cache haben, Multi-Tenant ohne shared cache) wäre der Status-quo-Wert dagegen der realistische — dort verschwindet auch Opus' 12× Cost-Vorteil aus dem cache_read-Trick.

n_cost-Basis: Mistral-Cost auf n=4 aus n=5 berechnet (1 Run vom 2026-05-26_10-32-44 hatte kein `transcript-metrics.json` — vermutlich parallel zum CC-Smoke gestartetes Tracking-Artefakt). Verification, Code-Qualitäts- und Wallclock-Werte sind alle auf n=5 berechnet.

---

## F-1.1 — Opus 4.7 und GLM 5.1 erreichen vollständige Korrektheit; Tradeoff Code-Qualität ↔ Kosten

Zwei Modelle erreichen über alle 5 Replikate perfekte Korrektheit außen (15/15 in jedem Run, `verification_pct = 1.00 ± 0.00`): Opus 4.7 und GLM 5.1. Auf den sekundären Achsen ist die Wahl ein klarer Tradeoff:

| Metrik | opus-4-7-portkey | glm-5-1 | Sieger |
|---|---|---|---|
| smell_total mean ± std | 0.8 ± 0.45 | 4.0 ± 6.16 | Opus 5× besser |
| cognitive_max mean ± std | 9.8 ± 1.79 | 12.2 ± 4.15 | Opus 24 % niedriger |
| mccabe_max mean | 7.6 | 9.2 | Opus 21 % niedriger |
| cc_longest_function mean | 25.4 | 28.8 | Opus 12 % niedriger |
| code_mass mean ± std | 759.6 ± 33.8 | 816 ± 68.6 | Opus 7 % kleiner, halb so streuend |
| duration_seconds mean | 664 | 1726 | Opus 2.6× schneller |
| **cost_usd / Run** | **$5.90** | **$2.10** | **GLM 2.8× billiger** |

GLM 5.1 zeigt zwei bimodale Code-Qualitäts-Runs (smell 14 und 6) zwischen drei sauberen (smell 0) — das erklärt die σ-Streuung. Korrektheit bleibt davon unberührt.

Pattern: Bei reiner **Korrektheits-Garantie** ist GLM 5.1 die klar bessere Wahl (gleiche Determinismus, ~drittel der Kosten, Tradeoff: ~2.6× Wallclock und etwas weniger sauberer Code). Wenn Code-Qualität (Lesbarkeit, Komplexität) ein hartes Ziel ist, lohnt sich der Opus-Aufpreis. Mistral Medium 3.5 erreicht knapp daneben (vpt=0.95, σ=0.09) und gehört thematisch näher in diesen Cluster als zu den Kimi/Flash-Bimodalen — wird aber durch ein gegenteiliges Profil (hohe Komplexität, höchste Kosten) eingeordnet, siehe F-1.7.

---

## F-1.2 — Kimi K2.6 und Gemini 3.5 Flash: Spitzen-Korrektheit mit Varianz-Tail

Beide Modelle erreichen in der Mehrzahl der Runs perfekte Verifikation, fallen aber je einmal deutlich ab — der Spread zeigt sich erst bei n=5:

| Modell | verification-Verteilung (n=5) | mean | std |
|---|---|---|---|
| kimi-k2-6 | 15, 15, 15, 12, 6 | 0.84 | 0.26 |
| gemini-3-5-flash | 15, 15, 15, 15, 0 | 0.80 | 0.45 |

Flash ist **bimodal** (4× perfekt, 1× Total-Fail) — der 0/15-Run hat zusätzlich `tests_passing = false` und `code_mass = 3` (nahezu leere Implementierung), also Workflow-Abbruch, nicht Spec-Misverständnis. Kimi degradiert graduell (12/15, 6/15) ohne Internen-Test-Fail. Beide schaffen Top-Niveau, aber n=5 enthüllt eine Reliability-Lücke gegenüber Opus' deterministischer Perfektion.

---

## F-1.3 — MiniMax M2.7: stabiles Spec-Misverständnis, kein Einzelfall

Über 5 Replikate erreicht MiniMax nur einmal überhaupt einen Treffer (3/15), sonst 0/15 (mean 0.04, std 0.09). 4 von 5 Runs sind grün in den internen Tests (`tests_passing = true`) bei im Schnitt 30.8 selbst geschriebenen Tests — das Modell baut konsistent eine andere Spec als die Verifikations-Suite erwartet. Der Smoke-Befund (n=1: 0/15) und die Probe (n=3: 0,3,0) bestätigen sich vollständig.

| Run | verification | tests_passing | tests_total | code_mass |
|---|---|---|---|---|
| Replikate (n=5) | 0, 0, 0, 0, 3 | true ×4, false ×1 | 2–54 | 18–700 |

Klassischer claim-office-Mehrdeutigkeits-Effekt: das Modell liest die EM-Spec selbstkonsistent, aber abweichend von der intendierten Auflösung. Bestätigt die Konstruktion der Kata als robuster Filter für Spec-Verstehen (Memory `[[kata-construction-pretest-required]]`).

---

## F-1.4 — Predictions-Format-Compliance ist NICHT prädiktiv für Korrektheit

Die Marker-Compliance des v5.1-oc-Workflows (Prediction-Lines im Red-Phase-Block) korreliert nicht mit `verification_pct`:

| Modell | predictions_total | predictions_correct | verification_pct |
|---|---|---|---|
| glm-5-1 | 4.0 | 4.0 (100%) | 1.00 |
| minimax-m2-7 | 2.6 | 2.2 (85%) | 0.04 |
| opus-4-7-portkey | 2.4 | 2.4 (100%) | 1.00 |
| mistral-medium-3-5 | 0.8 | 0.8 (100%) | 0.95 |
| kimi-k2-6 | 0.4 | 0.4 (100%) | 0.84 |
| gemini-3-5-flash | 0.4 | 0.4 (100%) | 0.80 |

Die zwei extremsten Prediction-Frequenzen liegen an entgegengesetzten Korrektheits-Enden: GLM 4.0/Run mit perfekter Korrektheit, MiniMax 2.6/Run mit fast Null-Korrektheit. Kimi, Flash und Mistral ignorieren das Format weitgehend (0.4–0.8/Run) und liegen trotzdem an oder nahe der Spitze. Marker-Compliance misst die Adoption der Workflow-Affordance, nicht den TDD-Inhalt. Bestätigt H4 aus dem RQ-README.

---

## F-1.5 — Code-Mass-Spread innerhalb Modell: Flash und MiniMax bimodal/breit

`code_mass` und `cycle_count` zeigen pro Modell sehr unterschiedliche Streuung:

| Modell | code_mass range | code_mass std | cycle_count range |
|---|---|---|---|
| opus-4-7-portkey | 717–797 | 34 | 1–2 |
| glm-5-1 | 705–877 | 69 | 1–3 |
| kimi-k2-6 | 674–800 | 58 | 1–3 |
| mistral-medium-3-5 | 589–877 | 117 | 0–2 |
| gemini-3-5-flash | 3–680 | 293 | 1–4 |
| minimax-m2-7 | 18–700 | 290 | 1–18 |

Opus, GLM und Kimi schreiben konsistent ~700–880 LoC mit moderater Streuung (std 34–69); Mistral liegt mit std 117 dazwischen und schreibt trotz hoher Test-Zahlen (23–66 Tests pro Run, siehe F-1.7) nur 1.2 Cycles im Mittel — Mistral produziert große Test-Batches in einem Schwung statt klassischer Red-Green-Refactor-Schritte. Flash und MiniMax triggern die "es war fertig"-Heuristik variabel — Flash kann mit 3 LoC abbrechen (siehe F-1.2 Bimodalität), MiniMax variiert zwischen Minimal-Stub und voller Implementierung. `cycle_count = 18` bei einem MiniMax-Run (Outlier) deutet auf Loop-Verhalten ohne Abschluss — der Run lief zwar im Budget durch (`completed_within_budget = true`), aber die Anzahl Red-Skill-Aufrufe ist 9× höher als der Median.

Folgerung: Workflow-Selbstabbruch-Heuristik ist modellabhängig; sie schützt nicht zuverlässig vor "Modell hört zu früh auf" (Flash-Bimodalität), "Modell loop-t bis Budget-Cap" (MiniMax-Outlier) oder "Modell überspringt Cycles und schreibt alles auf einmal" (Mistral-Profil).

---

## F-1.6 — Cost-Effizienz pro perfektem Lauf: GLM 5.1 deterministisch UND günstig

Bei der einfachen "Cost pro Run"-Sicht (Übersichts-Tabelle) sehen GLM ($2.10), Flash ($2.23) und MiniMax ($2.40) am günstigsten aus, Mistral ($24.69) fällt deutlich aus dem Rahmen. Aussagekräftiger ist die Frage: was kostet ein **garantiert perfekter** Lauf (verification 1.00, also 15/15), inklusive der Retries die für die Misserfolge nötig wären?

| Modell | n_perfect / n | $/Run (mean) | $/perfekter Run (cond.) | erwartet $/perfekt-Resultat (mit Retry) |
|---|---|---|---|---|
| deepseek-v4-pro | 3/5 | 0.11 | 0.16 | **$0.19** 🏆 ‡ |
| deepseek-v4-flash | 3/5 | 0.28 | 0.32 | $0.46 ‡ |
| glm-5-1 | 5/5 | 2.10 | 2.10 | $2.10 (deterministisch) |
| opus-4-7-portkey | 5/5 | 5.90 | 5.90 | $5.90 (deterministisch) |
| gemini-3-5-flash | 4/5 | 2.23 | 2.69 | $2.78 |
| minimax-m2-7 | 0/5 | 2.40 | — | ∞ (kein perfekter Lauf in n=5) |
| kimi-k2-6 | 3/5 | 2.78 | 2.27 | $4.63 |
| mistral-medium-3-5 | 3/5 | 24.69 | 24.69 | $41.16 † |

"Erwartet" = totale Kosten der 5 Runs / Anzahl perfekter Runs — operativ: wenn ein perfektes Ergebnis das Ziel ist und Nicht-Perfekt-Läufe verworfen werden, dann ist das die Kosten-pro-Akzeptanz-Größe.

GLM 5.1 gewinnt klar: deterministisch perfekt (5/5) zu $2.10/Run, ~3× billiger als Opus' $5.90 bei gleicher Verlässlichkeit. Kimi und Flash konkurrieren auf der Cost-Achse, aber beide haben Reliability-Tail: Kimi degradiert (3/5 perfekt) und verteuert sich erwartet auf $4.63; Flash hat einen Total-Fail (4/5 → $2.78 erwartet, knapp hinter GLM aber stochastisch). MiniMax fällt komplett aus.

Mistral schreibt bei 3/5 Runs perfekte Korrektheit, aber unter aktuellem OpenCode-Caching-Verhalten liegt der erwartete Cost pro perfekt-Resultat bei $41.16. † Diese Größe ist Integrations-spezifisch: mit aktivem `prompt_cache_key` (siehe Cost-Sektion) wäre der Per-Run-Cost ~$3.25, der erwartete-Perfekt-Cost ~$5.42 — damit landet Mistral cost-mäßig auf Opus-Niveau, mit deutlich schwächerer Code-Qualität (F-1.7). Status quo, ohne Caching-Patch, ist Mistral die teuerste Wahl unter den vpt ≥ 0.8-Modellen in dieser Studie.

Pokal-Lage: Auf der **erwartet-perfekt-Cost**-Achse gewinnt DeepSeek V4 Pro mit $0.19 — Faktor ~11 günstiger als GLM 5.1 und ~31 günstiger als Opus. Auf der **deterministisch-perfekt**-Achse (5/5) bleibt GLM 5.1 die robusteste Wahl ($2.10, std=0); DeepSeek-pro/flash haben nur 3/5 mit der CLI-Vertrags-Falle (F-1.8). Operativ: wer Retry-Logik um die Kata baut, fährt mit DeepSeek pro pro perfektem Resultat am billigsten; wer keinen Retry haben kann, nimmt GLM. Opus bleibt für hohe Code-Qualitäts-Ansprüche relevant (F-1.1), nicht für reine Korrektheits-Garantie.

† Mistral-Cost im OpenCode-Harness ist durch fehlendes Prompt-Caching dominiert, nicht durch Mistral-Pricing — siehe Cost-Sektion oben.

‡ DeepSeek-Cost-Vorteil ist real (OpenRouter-Pricing $0.10–$0.87 pro 1M Token plus aggressive Cache-Reads bei $0.02–$0.0036/M), aber das 3/5-Korrektheits-Rating ist halb CLI-Vertrags-Drop (F-1.8) — auf den drei perfekten Runs zeigt das Modell aktuell volles Niveau. Eine Wiederholung mit n=5 ohne den frühen Smoke-Bias würde die erwartete Cost vermutlich Richtung Deterministik verschieben.

---

## F-1.8 — DeepSeek V4 (flash + pro): Workflow-Compat-Drop dominiert über Spec-Verstehen

Beide DeepSeek-V4-Varianten zeigen in n=5 ein temporal getrenntes bimodales Bild: die zwei frühesten Runs (Smokes vom 2026-05-27) brechen mit verification 0/15 ab, die drei darauf folgenden Runs (2026-05-28) erreichen 15/15 verification.

| Modell | verification-Verteilung (n=5) | mean | std |
|---|---|---|---|
| deepseek-v4-flash | 0, 0, 15, 15, 15 | 0.60 | 0.55 |
| deepseek-v4-pro | 0, 0, 15, 15, 15 | 0.60 | 0.55 |

Die zwei Null-Runs sind **keine** Spec-Misverständnisse (wie F-1.3 bei MiniMax), sondern mechanische CLI-Vertrags-Verletzungen:
- `deepseek-v4-flash` (1. Null-Run): kein `src/cli.ts` geschrieben — Verifikations-Suite kann den Entry-Point nicht aufrufen (`code_mass = 0`, `tests_passing = false`).
- `deepseek-v4-flash` (2. Null-Run): `cli.ts` da, aber Input-Schema-Drift (`category/declaredValue` statt `type`) — Suite liefert leeren stdout.
- `deepseek-v4-pro` analog: einmal kein `cli.ts`, einmal `runCLI()` definiert aber nirgends aufgerufen.

Auf den drei perfekten Runs sind beide Modelle korrektheits-stabil und produzieren auf Code-Qualität nahe dem GLM-Niveau:

| Metrik (n=3, nur vpt=1.0) | deepseek-v4-flash | deepseek-v4-pro |
|---|---|---|
| `smell_total` mean | 17.3 | 21.7 |
| `cognitive_max` mean | 13.3 | 22.0 |
| `mccabe_max` mean | 10.7 | 14.0 |
| `cc_longest_function` mean | 40.7 | 51.3 |
| `code_mass` mean | 738 | 702 |
| `duration_seconds` mean | 1576 | 1163 |
| `cycle_count` mean | 4.3 | 2.7 |
| `tests_total` mean | 38.7 | 37.7 |
| `cost_usd` mean | $0.32 | $0.16 |

Auf der korrekten Hälfte sind die DeepSeek-Modelle leistungsfähiger als die Übersicht suggeriert — Code-Qualität liegt zwischen GLM und Kimi, Wallclock im mittleren Feld. Die korrekten Runs lassen sich nicht mit "Modell ist schwächer" erklären, sondern nur mit "Modell stolpert in den frühen Runs am CLI-Wrapper-Vertrag".

Methodische Folgerung: das Fünf-Replikate-Bild mischt zwei verschiedene Failure-Modi (Workflow-Compat-Drop vs. Modell-Performance) zu einer mittleren Korrektheit von 0.60. **Der Mittelwert ist hier irreführend**: er sagt weder "Modell scheitert systematisch an der Kata" (wie MiniMax) noch "Modell ist gut" — er sagt nur "Modell hat in dieser Probe eine Workflow-Compat-Falle ausgelöst und sie dann nicht mehr getroffen". Mögliche Erklärungen für die Trennung 27.05. ↔ 28.05.: (a) Routing-/Provider-seitige Stabilisierung bei OpenRouter, (b) Glücksvarianz im Sampling, (c) leichte Container-/Plan-Änderung zwischen den Tagen. Keine davon ist im Datenmaterial isolierbar.

Bei einer Folgemessung ohne den 27.05.-Bias wäre eine genauere Charakterisierung möglich; nach der aktuellen Datenlage sind beide DeepSeek-Varianten **konditional auf erfolgreichem CLI-Setup** im Top-Cluster, **unkonditional** aber im Mittelfeld eingeordnet.

---

## F-1.7 — Mistral Medium 3.5: hohe Korrektheit gegen hohe Komplexität und höchste Kosten

Mistral Medium 3.5 erreicht über n=5 Replikate `verification_pct = 0.95 ± 0.09` (Verteilung 15, 15, 14, 15, 12) — die zweithöchste Korrektheit nach Opus/GLM und mit der zweitkleinsten Streuung im gesamten Modell-Set. Auf den sekundären Achsen entsteht aber ein gegenteiliges Profil zu den anderen Top-Modellen:

| Metrik | Mistral | Opus (Referenz) | GLM 5.1 (Referenz) |
|---|---|---|---|
| `verification_pct` mean ± std | 0.95 ± 0.09 | 1.00 ± 0.00 | 1.00 ± 0.00 |
| `cognitive_max` mean (range) | 74.8 (54–107) | 9.8 (8–12) | 12.2 (8–18) |
| `mccabe_max` mean (range) | 33.6 (27–44) | 7.6 (6–9) | 9.2 (7–14) |
| `cc_longest_function` mean (range) | 120 (0–242) | 25.4 (22–31) | 28.8 (23–39) |
| `smell_total` mean | 23.6 | 0.8 | 4.0 |
| `cycle_count` mean | 1.2 | 1.2 | 2.0 |
| `tests_total` mean (range) | 41 (23–66) | 25.6 (4–39) | 40.2 (35–44) |
| `duration_seconds` mean | 4051 | 664 | 1726 |
| `cost_usd` pro Run (Status quo OpenCode) | $24.69 † | $5.90 | $2.10 |

Beobachtungen:

1. **Komplexität 6–8× über Opus/GLM**: `cognitive_max` 74.8, `mccabe_max` 33.6, `cc_longest_function` 120. Mistral erreicht Korrektheit über stark verschachtelten und langen Code — die einzige längste Funktion sprengt mit 242 LoC den Outlier-Bereich, doppelt so lang wie der nächst-höchste Modell-Mittelwert.
2. **Viele Tests, wenige Cycles**: 41 Tests pro Run (Niveau GLM/Kimi) bei nur 1.2 Cycle-Aufrufen — Mistral schreibt Tests in großen Batches statt klassischer TDD-Cycles. Die Workflow-Skill-Aufrufe (Red/Green/Refactor) werden weitgehend übersprungen; effektiv ein Single-Shot-Pattern mit Test-First-Vorbereitung.
3. **Höchste Wallclock**: ~67 min pro Run, 6× Opus, 2.3× GLM. Kombiniert mit der Cost ($24.69/Run im aktuellen OpenCode-Setup) ergibt sich der schwächste Effizienz-Punkt des Modell-Sets im vpt ≥ 0.8-Pool — mit dem Caveat dass die Cost-Komponente integrations-bedingt ist (siehe unten).

Pattern: Mistral Medium 3.5 ist ein **Korrektheits-Solid, Code-Qualitäts-Schwach**-Modell auf dieser Kata. Der Korrektheits-Tail (12/15 in einem Run, 14/15 in einem weiteren) ist begrenzt, aber die Code-Qualität bleibt deutlich unter den Top-Modellen. Für Korrektheits-kritische Aufgaben ohne Code-Qualitäts-Anspruch denkbar; für CI/CD-Integration mit Code-Review-Auflagen klar unterlegen gegenüber Opus oder GLM 5.1.

† Cost-Caveat: Der $24.69-Wert misst Mistral-im-OpenCode-Harness, nicht Mistral-als-Modell. OpenCode setzt für Mistral keinen `prompt_cache_key` (Mistral-API-Caching ist opt-in), wodurch 93 % der Tokens als regulärer Input statt 10%-Cache-Tier abgerechnet werden. Bei aggressivem Caching (analog Opus auf Anthropic, ~99 % Cache-Hit) wäre der Per-Run-Cost ~$3.25 — vergleichbar mit Sonnet, klar über GLM 5.1. **Der Cost-Befund ist also ein Integrations-Befund über OpenCode×Mistral, kein Modell-Befund über Mistral.** Bei Mistral-Direct-API mit Caching-Patch, anderem Harness, oder bei nicht-cacheabler Workload (CI/CD ohne shared cache) sähe das Ranking anders aus. Die Code-Qualitäts-, Cycle- und Wallclock-Befunde sind davon unberührt — die sind echte Modell-Eigenschaften.
