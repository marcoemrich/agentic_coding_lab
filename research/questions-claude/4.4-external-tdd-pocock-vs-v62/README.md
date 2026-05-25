---
id: RQ-pocock-vs-v62
question: "Wie schneidet der externe Matt-Pocock-TDD-Skill (v9-pocock-tdd: Single-Skill, Inline-Phasen, Tail-Refactor) auf claim-office-example-mapping gegen die interne Default-Baseline v6.2-with-why-cleaned (Multi-Command + Refactor-Subagent, Per-Cycle-Refactor) ab — auf Korrektheit, Code-Qualitaet, TDD-Disziplin und Kosten?"
factors:
  workflow_x_prompt:
    - {workflow: v6.2-with-why-cleaned, prompt: example-mapping}  # interne Default-Baseline (RQ-1.6 / RQ-1.9-Pool)
    - {workflow: v9-pocock-tdd,         prompt: example-mapping}  # externe Pocock-Baseline (skills.sh/mattpocock)
controls:
  model: opus-4-7-portkey-no-thinking
  kata_base: claim-office
outcomes:
  # primaer: Korrektheit (claim-office ist die Korrektheits-Kata)
  - verification_pct
  - tests_passing
  - completed_within_budget
  # TDD-Disziplin (Per-Cycle-Refactor vs Tail-Refactor ist der Architektur-Unterschied)
  - refactorings_applied
  - tests_passed_immediately
  - predictions_correct_rate
  - cycle_count
  # Code-Qualitaet (Pocock fokussiert auf "deep modules" / "small interfaces" — interessantes Gegenstueck zu APP-Mass-Bewusstsein in v6.2)
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # Kosten
  - duration_seconds
  - total_tokens
min_replicates: 3
status: aktiv
---

# RQ-4.4: v9-pocock-tdd vs v6.2-with-why-cleaned (claim-office)

Wie schneidet der externe Pocock-TDD-Skill auf claim-office-example-mapping × opus-4-7-portkey-no-thinking gegen die interne v6.2-Default-Baseline ab?

Verwandt: [RQ-4.1](../4.1-tdd-effect-code-quality/) vergleicht v1-v8 ueber die ganze TDD-Workflow-Stufenleiter. Diese RQ ist die fokussierte Folge-Frage: externe vs interne Baseline auf der Korrektheits-Kata.

## Motivation

Die interne v6.x-Linie ist durch ~20 Iterationen aus v3-v6-Reduktions- und Audit-Bundle-Arbeit entstanden. Sie operiert mit getrennten Phasen-Commands (`/red`, `/green`) plus Refactor-Subagent pro Cycle. Das ist optimiert für die Marker-Pipeline und die kataspezifischen Eigenheiten dieses Frameworks.

[Matt Pocock's TDD-Skill](https://www.skills.sh/mattpocock/skills/tdd) ist ein extern entwickelter, hier-noch-nicht-betrachteter Workflow mit anderer Architektur:

- **Ein einziger Skill** statt mehrerer Commands — alle Phasen laufen inline.
- **Tail-Refactor** statt Per-Cycle-Refactor — Refactor erst am Ende, wenn alle Tests gruen.
- **HITL-Planning** im Original (User-Approval vor Tracer Bullet) — fuer unseren Batch ersetzt durch die These "example-mapping IST die Plan-Approval", siehe `v9-pocock-tdd/.claude/skills/tdd/SKILL.md`.
- **"Deep modules / small interfaces"** als explizites Design-Prinzip aus *A Philosophy of Software Design*.

Die RQ liefert das erste Mess-Datum gegen eine externe Baseline ausserhalb unserer eigenen Workflow-Evolution. Sie testet implizit auch eine Architektur-Frage:

> Per-Cycle-Refactor (v6.2) vs Tail-Refactor (Pocock): macht das auf einer Multi-Iteration-Kata wie claim-office einen Unterschied?

## Pocock-Skill: Anpassungen gegenueber dem Original

Damit der Skill in unserem Batch-Setup laeuft, sind drei minimal-invasive Aenderungen am `SKILL.md` noetig (alle in `experiments/workflows/v9-pocock-tdd/.claude/skills/tdd/SKILL.md` dokumentiert):

1. **Planning-Approval-Block** ersetzt durch: "example mapping IS the approval, proceed without further questions".
2. **RED Reporting Block** als verbatim-Pflicht eingefuegt (`Red Phase Complete` + zwei Prediction-Lines) — sonst werden cycle_count und predictions_* der Pipeline unsichtbar (siehe `experiments/workflows/MARKERS.md`).
3. **DONE-Marker** ergaenzt: `experiment-done.txt` mit `DONE` am Ende, sonst Container-Timeout.

Sub-Files (`tests.md`, `mocking.md`, `refactoring.md`, `interface-design.md`, `deep-modules.md`) sind 1:1 vom Original.

## Smoke-Befund (vorab, n=1, opus-4-7-portkey MIT thinking)

Run `2026-05-25_20-22-06_claim-office-example-mapping_v9-pocock-tdd_opus-4-7-portkey`:

- `verification_pct = 1.00` (15/15)
- `tests_passing = true`, 36 Tests
- `cycle_count = 12`, `predictions_correct_rate = 1.00` (40/40)
- `refactorings_applied = 0` (Tail-Refactor: Modell sah keinen Bedarf)
- `cognitive_max = 7`, `mccabe_max = 7`, LOC 182, code_mass 631
- Wallclock 589s, ~12.2 M Tokens

Die RQ-Messung erfolgt mit `no-thinking`, um die existierenden v6.2-Runs aus RQ-1.9 als Vergleichspool wiederverwenden zu koennen.

## Hypothesen

- **H1 (Korrektheit, Pocock-Sanity)** — Pocock erreicht ≥ 80 % `verification_pct` im Mittel. Schwaecheres Cut-off als bei v6.2 (≥ 95 % erwartet), weil Pocock nicht auf unsere Kata optimiert ist und Tail-Refactor potentiell laenger in instabilem Zustand verweilt. Falsifizierer: Pocock unter 60 % → Skill ist auf no-thinking nicht batch-tauglich.
- **H2 (Korrektheit, gleichwertig)** — Pocock und v6.2 erreichen aehnliche `verification_pct` (Spread < 5 pp), trotz unterschiedlicher Architektur. Wenn das stimmt: claim-office-example-mapping unterspezifiziert nicht; beide Workflows finden den gleichen Korrektheitsraum.
- **H3 (Refactorings-Asymmetrie)** — `refactorings_applied` liegt bei Pocock signifikant unter v6.2. Smoke zeigte 0 vs RQ-1.6 v6.2-Mean ≈ 4-6. Erwartet: Pocock < 2, v6.2 > 3.
- **H4 (Code-Qualitaet)** — Pocock's "deep modules" + "minimal code" + Tail-Refactor erzeugt aehnliche oder leicht bessere Code-Qualitaet (`cognitive_max`, `mccabe_max`, `code_mass`) wie v6.2's Per-Cycle-Refactor. Smoke-Single zeigte `cognitive_max=7` — sehr gut. Hypothese: Per-Cycle-Refactor ist nicht zwingend noetig fuer gute Code-Qualitaet, wenn das Initial-Design "deep modules" anstrebt.
- **H5 (Disziplin)** — `cycle_count` aehnlich (~10-14); `predictions_correct_rate` aehnlich (~0.9-1.0). Beide haben explizite Prediction-Blocks.
- **H6 (Kosten)** — Pocock braucht weniger Wallclock und weniger Tokens als v6.2, weil ein einzelner Skill weniger Phase-Overhead hat als Skill-Hopping + Subagent-Spawn. Erwartet: Pocock −20 % Wallclock, −15 % Tokens. Smoke (mit thinking): 589s; v6.2-no-thinking-Vergleichspool aus RQ-1.9 sollte aehnliches Niveau haben.

## Design

```
Faktor:    workflow_x_prompt — 2 Stufen, beide example-mapping
Kontrolle: model            — opus-4-7-portkey-no-thinking
Kontrolle: kata_base        — claim-office

Zellen:    2 (2 Workflows × 1 Kata)
Replikate: n = 3 je Zelle (min_replicates)
Runs:      3 neue Pocock-Runs + Wiederverwendung v6.2 aus RQ-1.9-Pool (8 verfuegbar)
```

**Replikate-Anzahl n=3** ist bewusst klein als Erst-Annaeherung an die externe Baseline. Falls der Vergleich uneindeutig ist oder die Effekt-Richtung interessant: spaeter auf n=8 auffuellen (matched RQ-1.9-Standard fuer claim-office).

**Wallclock-Erwartung** Pocock × no-thinking: ~5-8 min/Run (single-shard), 3 Runs ≈ 20-25 min. v6.2-Runs liegen schon vor.

**Sharding:** single-shard fuer die Pocock-Neuruns (3 Runs lohnen Sharding nicht).

## Caveats

- **n=3 ist klein** — Memory-Note `replicates-n-reliability`: n=3 reicht meist nicht fuer Rangordnung (15-62 % korrekt laut RQ-stability/F-stability.3). Diese RQ ist explizit eine Erst-Annaeherung; bei interessantem Befund auf n=8 erweitern.
- **Pocock × no-thinking nicht gesmoket** — der erfolgreiche Smoke lief mit thinking. Falls die 3 no-thinking-Runs deutlich anders aussehen, vorher die Marker-Pickup-Sanity (Red-Block, DONE-File) pruefen, bevor Findings geschrieben werden.
- **Tail-Refactor ist Workflow-Eigenschaft, kein Bug** — `refactorings_applied = 0` bei Pocock ist normal, wenn der Code nach allen Tests bereits sauber ist. Das ist NICHT mit der v6.x-Refactor-Skipping-Pathologie aus dem RQ-1.x-Reduktions-Zweig zu verwechseln (dort war Refactor pro Cycle vorgesehen und wurde fallweise ausgelassen). Vergleich `refactorings_applied` darum **mit Vorsicht** interpretieren: bei Pocock ist 0 erwartbar, bei v6.2 ist 0 ein Warnzeichen.
- **Pocock-Skill ist angepasst, nicht 1:1 das Original** — die HITL-Approval-Bullets und die Marker-Phrasen sind hinzugefuegt. Das ist methodisch ehrlicher als "Pocock ohne Markers laufen lassen und dann 0 Cycles messen", aber kein perfekter Authentik-Vergleich. Diff: siehe `experiments/workflows/v9-pocock-tdd/.claude/skills/tdd/SKILL.md` vs `https://raw.githubusercontent.com/mattpocock/skills/main/skills/engineering/tdd/SKILL.md`.
- **Skill-Mechanik unterscheidet sich vom v6.x-Setup** — v6.x verwendet `.claude/commands/`, v9-pocock-tdd verwendet `.claude/skills/`. Beide werden vom Claude-Code-Skill-Tool entdeckt (vgl. Memory `skills-vs-commands-decision`), aber die Discovery-Pfade sind verschieden. Im Smoke hat Skill-Discovery funktioniert (Skill-Tool-Use count = 1 am Anfang); falls in no-thinking-Runs unklar: transcript pruefen.

## Findings

Siehe [findings.md](findings.md) (folgt nach Batch-Lauf).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v6.2-with-why-cleaned, v9-pocock-tdd}`,
`kata = claim-office-example-mapping`,
`model = opus-4-7-portkey-no-thinking`.

v6.2-Pool aus RQ-1.9 wiederverwendbar (8 Runs); 3 neue Pocock-Runs noetig.

## Quellen

- Pocock-Skill Original: <https://www.skills.sh/mattpocock/skills/tdd>, Source <https://github.com/mattpocock/skills/tree/main/skills/engineering/tdd>
- Smoke-Run: `experiments/runs/2026-05-25_20-22-06_claim-office-example-mapping_v9-pocock-tdd_opus-4-7-portkey/`
- v6.2-Baseline-Praezedenz: [RQ-1.6](../../workflow-dev/1.6-v62-cleanup-validation-v61-with-why/findings.md)
- v6.2 auf claim-office: [RQ-1.9](../../workflow-dev/1.9-audit-bundle-validation-claim-office/findings.md)
- Workflow-Marker-Anforderungen: `experiments/workflows/MARKERS.md`
- Pocock-Workflow-Anpassungen: `experiments/workflows/v9-pocock-tdd/.claude/skills/tdd/SKILL.md` + `.claude/rules/tdd-experiment-mode.md`
