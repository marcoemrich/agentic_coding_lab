---
id: RQ-cost-sol-pi-vs-opus-cc
question: "Wie viel günstiger ist das GPT-Modell gpt-5-6-sol auf dem pi-Harness gegenüber opus-4-8 auf Claude Code — bei gleichem Prompt-Stil und outcome-äquivalentem TDD-Workflow, über beide Katas?"
factors:
  # Gekoppelter Modell+Harness-Faktor: die beiden Achsen variieren gemeinsam
  # als Praxis-Bündel, NICHT als Kreuzprodukt (kein sol@cc / opus@pi).
  model_x_workflow:
    - model: gpt-5-6-sol
      workflow:
        any:
          - v6.2-with-why-cleaned-pi        # claim-office-Runs, kanonisch
          - v6.2.1-phase-continuation-pi    # game-of-life-Runs, outcome-neutraler Fix
    - model: opus-4-8-requesty
      workflow: v6.2-with-why-cleaned
  kata_base:
    - game-of-life
    - claim-office
controls:
  prompt: example-mapping
outcomes:
  # primär: Kosten
  - cost_usd
  - total_tokens
  - duration_seconds
  # Korrektheit als Gegengewicht zum Preis
  - verification_pct
  - tests_passing
  # "billiger heißt nicht sauberer"-Check (Code-Qualität)
  - cognitive_max
  - mccabe_max
  - smell_total
min_replicates: 5
status: aktiv
---

# RQ-cost-sol-pi-vs-opus-cc: Wie viel günstiger ist Sol@pi gegenüber Opus@Claude-Code?

## Motivation

Direkte Praxis-Frage: Wenn man vom Premium-Setup **opus-4-8 auf Claude Code**
(CC) auf das günstige Setup **gpt-5-6-sol ("Sol") auf pi** wechselt — wie viel
Kosten spart man real, und was gibt man dafür an Korrektheit/Code-Qualität auf?
Diese RQ isoliert nicht Modell- oder Harness-Effekt einzeln (das leisten die
Nachbar-RQs), sondern misst den **kombinierten Umstiegs-Effekt** als ein Bündel.

## Bündel-Definition + Confound-Caveat (bindend)

Dies ist ein **bewusst unkontrollierter** Vergleich. Modell UND Harness variieren
**gemeinsam** in zwei gekoppelten Bündeln:

- **sol-pi** — `gpt-5-6-sol` (GPT, `azure/gpt-5.6-sol@swedencentral`) auf pi
- **opus-cc** — `opus-4-8` (`vertex/claude-opus-4-8@eu`, Requesty) auf Claude Code

Beide Achsen sind verschränkt: der gemessene Unterschied ist die **Summe** aus
Modell-Effekt und Harness-Effekt, nicht einer von beiden allein. Wer die
isolierten Effekte braucht, findet sie in:

- **`RQ-harness-requesty`** (`../1.2-harness-requesty/`) — Harness-Effekt CC vs
  OC vs pi bei **konstantem** opus-4-8. Dort ist pi bei gleichem Modell auf
  claim-office ~56 % günstiger als CC, auf game-of-life ~48 %.
- **`RQ-model-quality-pi`** (`../../questions-pi/1.1-model-quality-pi/`) —
  Modell-Effekt (u.a. sol vs opus) bei **konstantem** pi-Harness auf
  game-of-life. Dort kostet sol ~$1.09/Run gegen opus ~$2.00/Run.

Diese RQ kombiniert beide Hebel und beantwortet damit die *Umstiegs*-Frage
end-to-end.

### Gekoppelter Faktor `model_x_workflow`

Der Harness ist im Workflow-Suffix kodiert (`-pi` = pi, kein Suffix = CC), das
Modell in `model`. Beide zusammen definieren ein Bündel. Das Framework paart sie
über den `model_x_workflow`-Faktor (analog `workflow_x_prompt`), sodass genau die
2 gewünschten Bündel × 2 Katas = **4 Zellen** entstehen — kein 4er-Kreuzprodukt
mit den nie gemessenen Geisterzellen sol@cc / opus@pi.

### Workflow-`any:`-Begründung (outcome-neutral)

Sol's Runs liegen auf zwei pi-Workflow-Ständen: game-of-life unter
`v6.2.1-phase-continuation-pi`, claim-office unter `v6.2-with-why-cleaned-pi`.
Der `.1`-Stand ist ein **outcome-neutraler** Fix des `-pi`-Stands (nur
Phasenübergangs-Drop → Durchlauf, alle Marker P1–P7 unverändert; Memory
`pi-workflow-continuation-drop-v621`). Nach der CLAUDE.md-Ausnahme für
outcome-neutrale Workflow-Bugfixes (`rq-workflow-any-match-tooling`) kollabieren
beide Stände per `workflow: {any: [...]}` in **eine** sol-pi-Zelle. Opus@CC nutzt
in beiden Katas denselben `v6.2-with-why-cleaned`.

## Kosten-Baseline

Beide Bündel routen über Requesty; `cost_usd` ist eine **Listenpreis-Schätzung**
(Token × Preis via `compute-cost.py`, Stand `research/model-pricing.md`
2026-07-25), **kein** abgerechneter Betrag — Requesty liefert auf diesen Routen
keine Inline-Kosten. Cache-Reads gehen zum Rabatt-Tarif ein; Token-Zahlen inkl.
`cache_read` sind für beide Harnesse korrekt erfasst (pi nach dem
Main-Thread-Summierungs-Fix, Memory `pi-requesty-cost-and-parser-undercount`).

**Wichtig:** die beiden Bündel tragen **unterschiedliche Tarife** (sol =
`azure/gpt-5.6-sol` $5.00/$30.00/$0.50; opus = `vertex/claude-opus-4-8@eu`
$5.50/$27.50/$0.55/$6.25 pro 1M). Anders als in `RQ-harness-requesty` (dort ein
Tarif für alle Zellen) ist der Preisunterschied hier also Tarif **und** Aufwand
zusammen — was der Umstiegs-Frage entspricht: man zahlt real den jeweiligen
Modell-Tarif auf dem jeweiligen Harness.

## Vorhandene Daten

Alle 4 Zellen sind bereits mit **n=5** vollständig analysierten Runs belegt
(`cost_usd` + `verification_pct` gefüllt) — **keine** Fill-Runs nötig. Die RQ ist
eine Re-Selektion vorhandener Daten aus den Batches vom 2026-07-25.

| Bündel | Kata | Modell | Workflow | n |
|---|---|---|---|--:|
| sol-pi | game-of-life | gpt-5-6-sol | v6.2.1-phase-continuation-pi | 5 |
| sol-pi | claim-office | gpt-5-6-sol | v6.2-with-why-cleaned-pi | 5 |
| opus-cc | game-of-life | opus-4-8-requesty | v6.2-with-why-cleaned | 5 |
| opus-cc | claim-office | opus-4-8-requesty | v6.2-with-why-cleaned | 5 |

## Hypothesen

- **H1 (Kosten)**: sol-pi ist auf beiden Katas deutlich günstiger als opus-cc;
  der Spread ist auf claim-office (teure CLI-Kata, hohe Token-Last) größer als
  auf game-of-life.
- **H2 (Korrektheit)**: sol-pi hält auf game-of-life volle Korrektheit
  (`verification_pct`=1.0); auf claim-office liegt es nahe an opus-cc, ohne
  systematischen Einbruch trotz drastisch niedrigerer Kosten.
- **H3 (Qualität-Kosten-Tradeoff)**: sol-pi erkauft den Preisvorteil mit höherer
  Spitzen-Komplexität (`cognitive_max`/`mccabe_max`) — "billiger heißt nicht
  sauberer".

## Methodologische Anmerkungen

- **Confound Modell×Harness ist Design, kein Fehler** — bei jeder $-Aussage der
  gekoppelte Charakter mitführen; isolierte Effekte via Nachbar-RQs oben.
- **Zwei Tarife** — der Kostenvergleich ist Tarif+Aufwand, nicht Aufwand allein
  (Unterschied zu `RQ-harness-requesty`).
- **Spend-Limit-Guard**: vor Aggregation `grep -l 'Reached monthly spend limit'`
  über die sol-Run-Logs (Memory `pi-requesty-412-spend-limit`).
- **Nie über Katas mitteln** — string-calculator-Skala ≠ game-of-life-Skala;
  Aggregation pro Zelle.
