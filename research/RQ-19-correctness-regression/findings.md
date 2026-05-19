# RQ-19 Findings

Lokalisierung der `verification_pct`-Regression auf `claim-office-example-mapping` entlang der v6-Optimierungskette. Zwei Modelle: opus-4-7-no-thinking (Direct API) und opus-4-6-portkey-no-thinking (Portkey). n=3–12 pro Zelle (Triage-Probe + Nachschärfung auf Emoji-Effekt).

## Übersicht: verification_pct pro Workflow × Modell

### opus-4-7-no-thinking

| Workflow | n | mean | Einzelwerte |
|---|---:|---:|---|
| `v6-hybrid` | 5 | **1.00** | 1 1 1 1 1 |
| `v6.1-no-app` | 3 | **1.00** | 1 1 1 |
| `v6.2-no-rules` | 3 | **1.00** | 1 1 1 |
| `v6.3-no-pep` | 3 | **1.00** | 1 1 1 |
| `v6.4-no-emoji` | 3 | 0.93 | 0.80 1 1 |
| **`v6.5-lean`** | 3 | **0.38** | 0 0.13 1 |
| `v6.5.1-orchestration-audited` | 3 | 0.36 | 0 0.07 1 |
| `v6.5.2-bullets-cut` | 3 | 0.51 | 0.13 0.67 0.73 |
| `v6.5.3-targeted-cuts` | 1 | 0.73 | 0.73 (zu dünn) |
| `v6.5.4-refactor-cut-only` | 10 | 0.40 | 0 0 0 0.13 0.13 0.20 0.67 0.87 1 1 |

### opus-4-6-portkey-no-thinking

| Workflow | n | mean | Einzelwerte |
|---|---:|---:|---|
| `v6-hybrid` | 11 | 0.65 | 0 0 0 0.33 0.87 1 1 1 1 1 1 |
| `v6.2-no-rules` | 3 | 0.11 | 0 0 0.33 |
| `v6.3-no-pep` | 4 | 0.68 | 0 0.73 1 1 |
| `v6.4-no-emoji` | 12 | 0.64 | 0 0.20 0.27 0.33 0.33 0.73 0.87 1 1 1 1 1 |
| `v6.5-lean` | 4 | 0.47 | 0 0 0.87 1 |

## F-19.1 — Bruchstelle auf opus-4-7 ist v6-hybrid → v6.5-lean

Alle vier Einzel-Cut-Varianten (v6.1 bis v6.4) halten Korrektheit auf claim-office bei opus-4-7 stabil (mean ≥ 0.93). Der Sprung von 1.00 auf 0.38 tritt erst bei v6.5-lean auf — und keine nachfolgende Iteration (v6.5.1 Audit, v6.5.2 Bullets, v6.5.3 targeted, v6.5.4 cut-only) hat ihn repariert. Die gesamte v6.5er-Quality-Optimierungskette (RQ-13 bis RQ-17) lief auf einem schon defekten Workflow.

## F-19.2 — Die Einzel-Cuts sind nicht der Täter

v6.5-lean bündelt vier Reduktionen plus strukturelle Rewrites:

| Komponente | Isoliert getestet? | Effekt auf verification_pct (opus-4-7) |
|---|---|---|
| APP-Heuristik raus | v6.1-no-app | 1.00 (kein Effekt) |
| Four Rules raus | v6.2-no-rules | 1.00 (kein Effekt) |
| Pep-Talks raus | v6.3-no-pep | 1.00 (kein Effekt) |
| Emojis raus | v6.4-no-emoji | 0.93 (marginal, n=3) |
| Project-Standards raus | nicht isoliert | unbekannt |
| **skill-creator-Why-Rewrites** | nicht isoliert | **Hauptverdächtiger** |

Die vier isoliert getesteten Cuts tragen die Regression nicht. Bleiben zwei untestete Komponenten: der Project-Standards-Cut und die skill-creator-Why-Rewrites (strukturelle Umformulierungen in `tdd.md`, `red.md` Step 7, `green.md` Minimality).

## F-19.3 — Why-Rewrites sind der Hauptverdächtige

Die skill-creator-Why-Rewrites haben `tdd.md` strukturell umgeschrieben: Checklist + Remember + redundante DO-NOTs raus, stattdessen einleitender "Why skills required"-Block mit Marker-Compliance-Begründung. `red.md` Step 7 bekam einen Why-Block. `green.md` erhielt eine gemergte Minimal-Strategies-Section + Why-Minimality-Block.

Diese Rewrites sind die einzige Komponente, die:
1. in keiner v6.1–v6.4-Variante enthalten ist (dort nur Cuts, keine Rewrites),
2. die Phasen-Mechanik (`tdd.md`, `red.md`, `green.md`) direkt betrifft,
3. in v6.5-lean erstmals eingeführt wurde und ab dort in allen Folge-Varianten bleibt.

Hypothese: die Why-Rewrites lockern die prozedurale Test-List-Disziplin. Im Kontext von game-of-life (trainingsbekannt, wenige Mehrdeutigkeiten) ist das ein Qualitäts-Gewinn — weniger starre Vorgaben, kreativere Lösungen. Im Kontext von claim-office (novel, 5 Mehrdeutigkeiten) führt die gelockerte Disziplin dazu, dass der Agent Mehrdeutigkeiten nicht systematisch abarbeitet, sondern interpretiert und überspringt.

Einschränkung: der Project-Standards-Cut (Hexagonal, DI, Named exports aus `refactor.md`) ist als Einzelfaktor nicht getestet. Ein Interaktions-Effekt zwischen diesem Cut und den Why-Rewrites ist nicht ausschließbar, aber unplausibel — die Project-Standards betreffen `refactor.md`, nicht die Phasen-Mechanik.

## F-19.4 — Die Korrektheits-Blindheit der v6.5er-RQ-Kette

RQ-13 bis RQ-17 haben Code-Qualität auf game-of-life gemessen. game-of-life hat keine externe Verification-Suite — `tests_passing=true` war die einzige Korrektheits-Prüfung, und die misst nur interne Konsistenz ("Code besteht seine eigenen Tests"). Ob der Agent die richtige Interpretation der Aufgabe gewählt hat, wurde nie extern geprüft.

Konsequenz: alle v6.5er-Quality-Wins (cognitive_max-Reduktion, Smell-Reduktion, σ-Stabilisierung) sind als Messungen valide, aber sie wurden auf einem Workflow erzielt, der auf novel Code systematisch falsche Ergebnisse produziert. Der "Default-Champion" v6.5.4 (RQ-17 F-17.2) ist nur Code-Quality-Champion, nicht Korrektheits-Champion.

## F-19.5 — Lehre für die Workflow-Methodik

Jede Workflow-Iteration braucht mindestens eine Korrektheits-Stichprobe auf einer Kata mit externer Verification-Suite, auch wenn die RQ primär Code-Qualität untersucht. Vorschlag: `claim-office-example-mapping × n=3` als Pflicht-Smoke vor jedem n=10-Quality-Batch in `workflow-construction.md` verankern.

## F-19.6 — Workflow×Modell-Interaktion: v4 und v6 tauschen die Plätze

| Workflow | opus-4-7 (n) | opus-4-6 (n) |
|---|---:|---:|
| v4-exact-subagents | 0.67 (10) | **0.93** (5) |
| v5-exact-single-context | 0.87 (10) | 0.87 (5) |
| v6-hybrid | **1.00** (5) | 0.68 (15) |

v4 und v6 sind **modell-abhängig komplementär**: v6-hybrid ist opus-4-7-Optimum (1.00), aber auf opus-4-6 instabil (0.68). v4-exact-subagents ist auf opus-4-6 stabil (0.93), aber auf opus-4-7 bimodal (0.67). v5 ist modell-unabhängig konstant (0.87).

Mechanismus: v6-hybrid delegiert die Orchestrierung an das Modell (Skill-Invocation-Semantik im shared Context). opus-4-7 beherrscht das. opus-4-6 verliert in ~40 % der Runs die Claim-Hälfte der Spec — das Modell implementiert nur Quote und ignoriert Claim komplett (`grep "claim\|payout\|deductible" claim-office.ts` = 0 Treffer, `tests_total` trotzdem 19–23 weil die internen Tests nur Quote abdecken).

v4 gibt jeder Phase einen expliziten Subagent-Prompt. opus-4-6 profitiert von dieser Struktur, opus-4-7 wird auf v4 "überkreativ" und trifft bei Mehrdeutigkeiten häufiger die falsche Lesart.

## F-19.7 — Emoji-Effekt auf opus-4-6 existiert nicht

Nachschärfung auf n=12 zeigt: `v6-hybrid` (0.68, n=15) und `v6.4-no-emoji` (0.64, n=12) sind auf opus-4-6 praktisch identisch. Ein Initialbefund bei n=3/4 (0.03 vs 1.00) stellte sich als Artefakt kontaminierter Early-Runs heraus (Portkey-Warmup-Effekt, drei `tests=1`-Ausreißer bei Batch-Start). Nach Bereinigung und Nachfüllung auf n=12+ kein Signal. Konsistent mit dem opus-4-7-Befund (1.00 vs 0.93, marginal bei n=3).

## F-19.8 — Portkey-Warmup-Effekt als methodische Warnung

Die ersten opus-4-6-Batches (05-18 und 05-19 06:49) zeigten konzentrierte Null-Runs (`tests=1`, Skill-Loop sofort abgebrochen). Spätere Batches auf demselben Routing-Pfad reproduzierten das nicht. Hypothese: Portkey-seitiger Cold-Start-Effekt oder transiente Routing-Instabilität. Konsequenz: erste 1–2 Runs eines neuen Portkey-Batches sind potenziell unzuverlässig und sollten nicht ohne Nachprüfung in die Aggregation einfließen.

## Nächster Schritt

Isolation der verdächtigen Komponente auf opus-4-7: v6.5-lean minus Why-Rewrites (alle vier Cuts angewandt, aber originale MUST/Procedure-Formulierungen aus v6-hybrid beibehalten) × claim-office-example-mapping × n=3. Falls dort verification_pct ≈ 1.0 → Why-Rewrites bestätigt als Täter. Falls auch dort Bruch → Bundle-Interaction-Effekt oder Project-Standards-Cut.
