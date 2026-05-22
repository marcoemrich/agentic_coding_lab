# RQ-regression Findings

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

## F-regression.1 — Bruchstelle auf opus-4-7 ist v6-hybrid → v6.5-lean

Alle vier Einzel-Cut-Varianten (v6.1 bis v6.4) halten Korrektheit auf claim-office bei opus-4-7 stabil (mean ≥ 0.93). Der Sprung von 1.00 auf 0.38 tritt erst bei v6.5-lean auf — und keine nachfolgende Iteration (v6.5.1 Audit, v6.5.2 Bullets, v6.5.3 targeted, v6.5.4 cut-only) hat ihn repariert. Die gesamte v6.5er-Quality-Optimierungskette (RQ-lean bis RQ-refactor-cut) lief auf einem schon defekten Workflow.

## F-regression.2 — Die Einzel-Cuts sind nicht der Täter

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

## F-regression.3 — Why-Rewrites sind der Hauptverdächtige

Die skill-creator-Why-Rewrites haben `tdd.md` strukturell umgeschrieben: Checklist + Remember + redundante DO-NOTs raus, stattdessen einleitender "Why skills required"-Block mit Marker-Compliance-Begründung. `red.md` Step 7 bekam einen Why-Block. `green.md` erhielt eine gemergte Minimal-Strategies-Section + Why-Minimality-Block.

Diese Rewrites sind die einzige Komponente, die:
1. in keiner v6.1–v6.4-Variante enthalten ist (dort nur Cuts, keine Rewrites),
2. die Phasen-Mechanik (`tdd.md`, `red.md`, `green.md`) direkt betrifft,
3. in v6.5-lean erstmals eingeführt wurde und ab dort in allen Folge-Varianten bleibt.

Hypothese: die Why-Rewrites lockern die prozedurale Test-List-Disziplin. Im Kontext von game-of-life (trainingsbekannt, wenige Mehrdeutigkeiten) ist das ein Qualitäts-Gewinn — weniger starre Vorgaben, kreativere Lösungen. Im Kontext von claim-office (novel, 5 Mehrdeutigkeiten) führt die gelockerte Disziplin dazu, dass der Agent Mehrdeutigkeiten nicht systematisch abarbeitet, sondern interpretiert und überspringt.

Einschränkung: der Project-Standards-Cut (Hexagonal, DI, Named exports aus `refactor.md`) ist als Einzelfaktor nicht getestet. Ein Interaktions-Effekt zwischen diesem Cut und den Why-Rewrites ist nicht ausschließbar, aber unplausibel — die Project-Standards betreffen `refactor.md`, nicht die Phasen-Mechanik.

## F-regression.4 — Die Korrektheits-Blindheit der v6.5er-RQ-Kette

RQ-lean bis RQ-refactor-cut haben Code-Qualität auf game-of-life gemessen. game-of-life hat keine externe Verification-Suite — `tests_passing=true` war die einzige Korrektheits-Prüfung, und die misst nur interne Konsistenz ("Code besteht seine eigenen Tests"). Ob der Agent die richtige Interpretation der Aufgabe gewählt hat, wurde nie extern geprüft.

Konsequenz: alle v6.5er-Quality-Wins (cognitive_max-Reduktion, Smell-Reduktion, σ-Stabilisierung) sind als Messungen valide, aber sie wurden auf einem Workflow erzielt, der auf novel Code systematisch falsche Ergebnisse produziert. Der "Default-Champion" v6.5.4 (RQ-refactor-cut F-refactor-cut.2) ist nur Code-Quality-Champion, nicht Korrektheits-Champion.

## F-regression.5 — Lehre für die Workflow-Methodik

Jede Workflow-Iteration braucht mindestens eine Korrektheits-Stichprobe auf einer Kata mit externer Verification-Suite, auch wenn die RQ primär Code-Qualität untersucht. Vorschlag: `claim-office-example-mapping × n=3` als Pflicht-Smoke vor jedem n=10-Quality-Batch in `workflow-construction.md` verankern.

## F-regression.6 — Workflow×Modell-Interaktion (verschoben)

Der v4/v5/v6 × opus-4-7/opus-4-6-Befund („v4 und v6 tauschen je nach Modell die Plätze") ist als
eigenständige generische Forschungsfrage herausgelöst:
`research/questions/3.1-workflow-model-interaction/` (RQ-workflow-model, F-workflow-model.1/F-workflow-model.2).

## F-regression.7 — Emoji-Effekt auf opus-4-6 existiert nicht

Nachschärfung auf n=12 zeigt: `v6-hybrid` (0.68, n=15) und `v6.4-no-emoji` (0.64, n=12) sind auf opus-4-6 praktisch identisch. Ein Initialbefund bei n=3/4 (0.03 vs 1.00) stellte sich als Artefakt kontaminierter Early-Runs heraus (Portkey-Warmup-Effekt, drei `tests=1`-Ausreißer bei Batch-Start). Nach Bereinigung und Nachfüllung auf n=12+ kein Signal. Konsistent mit dem opus-4-7-Befund (1.00 vs 0.93, marginal bei n=3).

## F-regression.8 — Portkey-Warmup-Effekt als methodische Warnung

Die ersten opus-4-6-Batches (05-18 und 05-19 06:49) zeigten konzentrierte Null-Runs (`tests=1`, Skill-Loop sofort abgebrochen). Spätere Batches auf demselben Routing-Pfad reproduzierten das nicht. Hypothese: Portkey-seitiger Cold-Start-Effekt oder transiente Routing-Instabilität. Konsequenz: erste 1–2 Runs eines neuen Portkey-Batches sind potenziell unzuverlässig und sollten nicht ohne Nachprüfung in die Aggregation einfließen.

## Nächster Schritt

Die Reduktionskette wird auf einer korrektheits-reparierten Basis neu aufgesetzt: `v6-hybrid` +
testlist-scope-fix → **`v6.1-hybrid-testlist-scope-fix`** (siehe [RQ-testlist-fix](../5.2-v4.1-testlist-scope-fix/findings.md)).
Die alten v6.x-Reduktionsschritte sind nach `experiments/workflows/_archive/` konserviert und als
wiederanwendbares Rezept dokumentiert: [v6-reduction-recipe.md](../v6-reduction-recipe.md).

Erste Isolation auf der neuen Basis (opus-4-7 × claim-office-example-mapping × n=3): die als Täter
verdächtigten Why-Rewrites einzeln anwenden — originale MUST/Procedure-Formulierungen ersetzt durch die
Why-Block-Variante. Falls dort verification_pct ≈ 1.0 → Why-Rewrites bestätigt; falls Bruch →
Project-Standards-Cut oder Bundle-Interaction. Re-Test noch nicht ausgelöst.
