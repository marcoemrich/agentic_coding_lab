# v6 Reduction Recipe — Konservierte Schritte für Re-Test auf reparierter Basis

## Zweck

Die ursprüngliche v6-Reduktionskette (`v6-hybrid` → `v6.5-lean` → … → `v6.6-leaner`) wurde
weitgehend **auf einer korrektheits-defekten Basis** gemessen. RQ-regression
([5.1-correctness-regression](5.1-correctness-regression/findings.md), F-regression.1) lokalisiert
den Bruch am Sprung **v6-hybrid → v6.5-lean**: `verification_pct` auf `claim-office-example-mapping`
fällt von 1.00 auf 0.38 (opus-4-7-no-thinking) und wird von keiner Folge-Iteration repariert. Alle
v6.5.x-Quality-Wins sind valide gemessen, aber auf einem Workflow, der auf novel Code systematisch
falsche Ergebnisse produziert.

Die neue Basis **`v6.1-hybrid-testlist-scope-fix`** = `v6-hybrid` + testlist-scope-fix (Portierung
des bewährten v4→v4.1-Fixes in die test-list, siehe [RQ-testlist-fix](5.2-v4.1-testlist-scope-fix/findings.md)).
`v6-hybrid` selbst bleibt aktiv als verifizierte 1.00-Korrektheits-Vollform und Quelle.

Der Scope-Fix der neuen Basis betrifft zwei Files (Diff gegen `v6-hybrid`): `commands/test-list.md`
(„cover every rule/example/❓ + expected values" statt „base functionality ONLY") und `rules/tdd.md`
(zwei zurückgebliebene „BASE FUNCTIONALITY ONLY"-Reste entfernt, damit die Phasen-Beschreibung konsistent
zum test-list-Scope ist). Dieselben zwei `tdd.md`-Reste wurden auch in `v4.1-testlist-scope-fix` bereinigt
— der dortige test-list-Agent war scope-gefixt, die `tdd.md`-Beschreibung war es nicht.

Dieses Dokument konserviert **jeden Reduktionsschritt der alten Kette als wiederanwendbares Rezept**,
damit die Schritte auf der neuen Basis erneut getestet werden können. Die archivierten Workflow-Files
liegen unter `experiments/workflows/_archive/` und bleiben per `diff` gegen die neue Basis nachvollziehbar.

## Wichtige Vorbedingung

Vor jeder Wiederanwendung eines Schritts: `experiments/workflows/MARKERS.md` lesen. Alle archivierten
Schritte haben ihre Marker-Integrität in den jeweiligen `CHANGES.md` dokumentiert — beim Re-Bau auf
neuer Basis erneut prüfen.

## Spannung MARKERS.md ↔ RQ-regression (wichtig)

`MARKERS.md` listet „Psychological Resistance"-Sektionen und „Why this discipline works"-Pep-Talks als
**dekorativ / safe to drop** (rein parser-seitige Sicht: sie treiben keinen Marker). RQ-regression
(F-regression.3) verdächtigt dagegen genau die **Why-Rewrites** in `tdd.md` / `red.md` Step 7 /
`green.md` als Korrektheits-Täter (verhaltens-seitige Sicht). Beide stimmen: die Rewrites nullen keine
Metrik, aber sie verändern das Modell-Verhalten auf novel Katas. Lehre: „parser-safe" ≠ „verhaltens-neutral".

## Reduktionsschritte (Reihenfolge = alte Kette)

Jeder Schritt nennt: betroffene Files + Sektion-Header, ursprüngliche Mess-Basis, bekannter Effekt (RQ),
und ob er auf der **defekten** Basis gemessen wurde.

### Einzel-Cuts (Branches von v6-hybrid, je ein Aspekt)

| Schritt | Files / Sektion | Effekt | RQ | Basis |
|---|---|---|---|---|
| `-app` | `refactor.md` + `tdd.md`: APP-(Absolute-Priority-Premise)-Massen-Heuristik raus | Korrektheit 1.00 (kein Effekt) | [RQ-app](2.1-app-effect/) | v6-hybrid (intakt) |
| `-rules` | `refactor.md` + `tdd.md`: Four-Rules-of-Simple-Design-Block raus | Korrektheit 1.00 (kein Effekt) | [RQ-rules](2.2-rules-effect/) | v6-hybrid (intakt) |
| `-pep` | `green.md` + `red.md`: „Psychological Resistance"-Pep-Talks raus | Korrektheit 1.00 (kein Effekt) | [RQ-pep](2.3-pep-effect/) | v6-hybrid (intakt) |
| `-emoji` | **5 Files** (`refactor/green/red/test-list/tdd`): Emojis raus — **kein reiner Single-Cut** | marginal (0.93, n=3); cross-model kein Signal | [RQ-emoji](2.4-emoji-effect/), [RQ-emoji-cross-model](2.5-emoji-cross-model/) | v6-hybrid (intakt) |

Die vier isoliert getesteten Einzel-Cuts halten die Korrektheit auf claim-office (opus-4-7) — sie sind
**nicht** der Regressions-Täter (F-regression.2). Sie können auf der neuen Basis ohne Korrektheits-Risiko
wieder angewandt werden.

### Der Bundle-Sprung (Regressions-Quelle)

| Schritt | Files / Sektion | Effekt | RQ | Basis |
|---|---|---|---|---|
| **`-why-rewrites`** | `tdd.md` (Checklist + „Core TDD Principles" + „Remember" raus, „Why skills required"-Block rein), `red.md` Step 7 (Why-Block + Parser-Rationale), `green.md` („Minimal Implementation Strategies" + „Psychological Resistance" → „Why minimality matters") | **Korrektheits-Täter** — 1.00 → 0.38 auf claim-office | [RQ-regression](5.1-correctness-regression/) F-regression.3 | v6-hybrid → **v6.5-lean** |
| `-project-standards` | `refactor.md`: Hexagonal / DI / Named-exports-Block raus | **nie isoliert getestet** | (offen) | im v6.5-lean-Bundle |

`v6.5-lean` bündelte alle vier Einzel-Cuts **plus** diese zwei skill-creator-strukturellen Rewrites in
**einem** Schritt. Da die Einzel-Cuts unkritisch sind, bleiben die Why-Rewrites (Hauptverdächtiger) und
der nie-isolierte Project-Standards-Cut als Ursachen. **Beim Re-Bau auf neuer Basis: Why-Rewrites und
Project-Standards-Cut einzeln und mit claim-office-Smoke testen, nicht erneut bündeln.**

### Optimierungs-Kette nach dem Bruch (alle auf defekter Basis gemessen!)

| Schritt | Files / Sektion | Effekt (auf game-of-life) | RQ | Basis |
|---|---|---|---|---|
| commands→skills | `commands/{red,green,test-list}.md` → `skills/<name>/SKILL.md` + Frontmatter; Mandatory-Procedure-Preamble; „Wrong Predictions Are Data"; refactor-Decoupling; Rationale-Additions | Audit-Alignment; **fixte einen latenten Marker-1-Bug** (Skill-Tool fand commands/ nicht) | [RQ-audit](3.1-orchestration-audit/) | v6.5-lean → v6.5.1 |
| `-bullets` (alle 3) | `refactor.md` „Remember" + „Important Guidelines" DO/DON'T, `red/SKILL.md` DO/DON'T raus | Quality ↑ (cognitive_max −29 %), Kosten −15 %, aber Disziplin-σ ↑ | [RQ-bullets](3.2-bullets-cut/) | v6.5.1 → v6.5.2 |
| targeted (2 von 3) | wie bullets, aber `refactor.md` „Remember" **behalten** (Floor-Anker-Kandidat) | Quality-Win + Floor zurück, aber pred-rate 95.8 % | [RQ-targeted](3.3-targeted-cuts/) | v6.5.1 → v6.5.3 |
| refactor-cut (nur 10b) | nur `refactor.md` mid-file DO/DON'T raus; „Remember" + `red/SKILL.md` DO/DON'T behalten | isoliert Quality-Win ohne Floor-/Pred-Verlust → Default-Quality-Champion | [RQ-refactor-cut](3.4-refactor-cut-only/) | v6.5.1 → v6.5.4 |
| skills→commands-Revert + trim | `skills/` zurück zu `commands/`; AUDIT.md/CHANGES.md raus; `red.md` 138→124, `test-list.md` 110→71, `refactor.md` 254→249 | schlankste Variante | [RQ-lean](2.6-lean-validation/) | v6.5.4 → v6.6 |

**Kritische Einschränkung:** Die gesamte Kette ab v6.5.1 wurde nur auf game-of-life gemessen (keine
externe Verification-Suite, F-regression.4). Ihre Quality-/Disziplin-Befunde sind als Messungen gültig,
aber der Workflow war korrektheits-defekt. Auf der neuen Basis sind diese Schritte **mit
claim-office-Korrektheits-Smoke** zu wiederholen, bevor ein „Champion" gekürt wird (F-regression.5).

## Re-Test-Reihenfolge (Vorschlag, noch nicht ausgelöst)

1. Neue Basis `v6.1-hybrid-testlist-scope-fix` auf claim-office-EM × opus-4-7 verifizieren (Ziel ≈ 1.0).
2. Why-Rewrites isoliert auf neuer Basis (der verdächtige Schritt zuerst).
3. Project-Standards-Cut isoliert (nie zuvor getestet).
4. Restliche Optimierungs-Schritte (bullets/targeted/refactor-cut) je mit claim-office-n=3-Smoke.

Pro Schritt gilt die Methodik-Lehre aus F-regression.5: **mindestens eine Korrektheits-Stichprobe auf
einer Kata mit externer Verification-Suite**, auch wenn die RQ primär Code-Qualität untersucht.

## Archiv-Verweise

Alle alten Workflow-Files: `experiments/workflows/_archive/v6.1-no-app … v6.6-leaner`. Die Schritt-Doku
liegt zusätzlich in den jeweiligen `CHANGES.md` / `AUDIT.md` (v6.5.1–v6.5.4). Bestehende Runs der alten
Varianten bleiben in `experiments/runs/` auswertbar (sie tragen ihre `.claude/`-Definition einkopiert).
