# Research

Dieses Verzeichnis bündelt alle **Forschungsfragen** (RQs) des Lab und die
darunter gesammelten Findings.

## Konzept

Eine RQ definiert per **Kontroll-Variablen** und **Faktoren** eine
Selektor-Query über `experiments/runs/`. Daraus werden on-demand
`runs.csv` und `summary.md` aggregiert (geplantes Tool:
`experiments/aggregate-by-query.sh`). Die `findings.md` der RQ sammelt
die Erkenntnisse als persistente, wachsende Liste.

Batch-Plans (`experiments/batch-plans/*.json`) sind reine
**Daten-Sammel-Werkzeuge**: Sie weisen den Batch-Runner an, welche Runs
noch fehlen, damit eine RQ ihre `min_replicates` erreicht. Geplant:
`batch-plan-from-rq.py` generiert sie automatisch aus dem RQ-Frontmatter.

Aggregationen sind **query-spezifisch**, nicht batch-spezifisch — die
Auswertung einer RQ konsumiert *alle* matching Runs in
`experiments/runs/`, nicht nur die eines bestimmten Batches. Mehr
Replikate sammeln = mehr Daten ohne Plan-Pflege.

## Aktuelle RQs

| RQ | Frage | Status |
|---|---|---|
| [RQ-1](RQ-1-workflow-effect/) | Wirkt der gewählte Workflow auf Code-Qualität, Korrektheit und TDD-Disziplin? | aktiv |
| [RQ-2](RQ-2-prompt-style/) | Wirkt Prompt-Stil (prose / example-mapping / user-story) auf Code-Qualität und Korrektheit? | aktiv |
| [RQ-3](RQ-3-model-and-thinking/) | Wirken Modell-Klasse (Opus / Sonnet / Haiku) und Thinking-Mode auf Output-Qualität und Effizienz? | aktiv |
| [RQ-4](RQ-4-workflow-model-interaction/) | Profitieren schwächere Modelle stärker von strikteren Workflows als starke? | aktiv |
| [RQ-5](RQ-5-run-stability/) | Wie groß ist die Run-zu-Run-Varianz innerhalb identischer Zellen? | aktiv |

## Methoden-Constraints

Diese Regeln gelten lab-weit und werden von allen RQs respektiert:

### Workflow → erlaubte Prompt-Stile

Aus methodischer Symmetrie:

| Workflow | erlaubte Prompt-Stile | Begründung |
|---|---|---|
| v1-oneshot, v2-iterative | nur **prose** | Test-Beispiele aus example-mapping/user-story wären für Non-TDD-Workflows ein verstecktes Test-Geschenk → unfair gegenüber den TDD-Workflows. |
| v3-basic-tdd, v4-exact-subagents, v5-exact-single-context | **prose, example-mapping, user-story** | Beispiele dienen als natürliche Test-Cases — für TDD-Workflows ist das das Idealbild der Aufgabe. |

Konsequenz für RQ-Designs:

- **Workflow als Faktor** (RQ-1, RQ-4): Faktor heißt `workflow_x_prompt`
  und ist eine gepaarte Liste `{workflow, prompt}`-Tupel. Default-Pairing:
  v1/v2 → prose, v3/v4/v5 → example-mapping (sog. "fairer" Vergleich).
- **Workflow als Kontroll-Variable** (RQ-2, RQ-3): `controls.workflow`
  und `controls.prompt` werden zusammen gesetzt, mit
  Constraint-Beachtung.

### Aktive Katas

Stand 2026-05-04: **game-of-life** und **mars-rover** (jeweils alle drei
Prompt-Stile). string-calculator und pixel-art-scaler wurden gedroppt
(zu trivial, 0 Smells durchgehend). Details siehe Commit-History.

Hinweis: Bisherige Runs decken hauptsächlich game-of-life (alle Stile)
und mars-rover-prose ab. mars-rover-{example-mapping, user-story}
wurden noch kaum erhoben — wenn eine RQ sie braucht, liefert die
Selektor-Query erstmal eine kleine Stichprobe.

### Kata-Constraint: Code-Quality-Signal nur auf game-of-life

Aus der Re-Evaluation der alten 235-Run-Studie (siehe
`_archive/findings-validation-2026-05-04/`) sind drei Constraints stabil:

1. **Klassische Katas sind in Trainingsdaten** (string-calculator,
   pixel-art-scaler, etc.). Modelle lösen sie zu trivial — `smell_total = 0`
   in 65/65 smart-subset-Runs.
2. **Pixel-art-scaler ist nicht als Novel-Kata-Sanity-Check brauchbar**
   (30/30 smart-subset-Runs `cc_longest ≤ 6`, keine Workflow- oder
   Modell-Differenzierung).
3. **Code-Qualitäts-Signal ist ausschließlich auf game-of-life und
   mars-rover sichtbar.** Aussagen über `smell_total`,
   `cc_longest_function` etc. müssen auf diesen Katas basieren —
   Cross-Kata-Mittel über Trivial-Katas verwässert das Signal
   (s. `experiments/aggregate-runs.sh`-Hinweis).

**Konsequenz für RQs**: Alle aktuellen RQs nutzen `kata_base: game-of-life`
als Default. mars-rover bleibt für Cross-Kata-Validierung verfügbar,
sobald genug Replikate erhoben sind. Generalisierbarkeits-Aussagen über
beliebige Katas sind 🚫 nicht prüfbar mit dem aktuellen Design.

### Modell-Aliase

In RQ-Frontmatter werden die **Lab-Varianten-IDs** gepinnt — nicht die
Claude-API-IDs (`claude-opus-4-7`), nicht die Kurz-Aliase (`opus`).
Eine Lab-Varianten-ID kombiniert Modell und Thinking-Modus eindeutig:

| Lab-Varianten-ID | API-ID | Thinking |
|---|---|---|
| `opus-4-7`               | `claude-opus-4-7`            | Adaptive |
| `opus-4-7-no-thinking`   | `claude-opus-4-7`            | aus |
| `sonnet-4-6`             | `claude-sonnet-4-6`          | Extended |
| `sonnet-4-6-no-thinking` | `claude-sonnet-4-6`          | aus |
| `haiku-4-5`              | `claude-haiku-4-5-20251001`  | Extended |
| `haiku-4-5-no-thinking`  | `claude-haiku-4-5-20251001`  | aus |

Die ID matcht exakt das `model`-Feld in `metrics.json` und das Suffix
im Run-Dir-Namen. Quelle: `MODEL_CONFIGS` in
`experiments/record-run.sh`.

`opus`/`sonnet` als Alias lösen NICHT zur jeweils neuesten Version auf.

## Frontmatter-Schema

```yaml
---
id: RQ-N
question: "Volltext der Forschungsfrage"
factors:                          # was variiert wird
  <faktor-name>: [<value>, ...]
  # ODER für gepaarte Faktoren:
  workflow_x_prompt:
    - {workflow: v1-oneshot, prompt: prose}
    - ...
controls:                         # was konstant gehalten wird
  kata_base: game-of-life         # Kata-Basis ohne Prompt-Suffix
  workflow: v4-exact-subagents    # nur wenn kein workflow_x_prompt-Faktor
  prompt: example-mapping         # nur wenn kein prompt-Faktor / Pairing
  model: <lab-variant-id>         # z.B. opus-4-7-no-thinking (siehe Tabelle)
outcomes: [<metric>, ...]         # welche Metriken gemessen werden
min_replicates: N                 # pro Zelle
status: aktiv | partiell | abgeschlossen
---
```

**Selektor-Auflösung**: Die Selektor-Query bildet die effektive Kata-ID
als `<kata_base>-<prompt>`. `prompt` kommt entweder aus `controls.prompt`,
aus dem `workflow_x_prompt`-Pairing, oder aus `factors.prompt`.

## Outcome-Konventionen

`outcomes` im Frontmatter sind CSV-Spaltennamen aus `runs.csv`
(siehe `CSV_COLUMNS` in `experiments/aggregate-by-query.py`).
`aggregate-by-query.py` wählt den Pivot-Typ automatisch:

| Wertetyp / Naming                | Pivot-Form                                                     |
|----------------------------------|----------------------------------------------------------------|
| Boolean                          | rate_% (Anteil `true`)                                         |
| Numerisch                        | mean / min / max / std über die Zelle                          |
| Suffix `<X>_correct_rate`        | **pooled** rate aus `<X>_correct` und `<X>_total`: Σ/Σ × 100   |

**Pooled rate**: Wird genutzt für Erfolgsquoten mit Zähler/Nenner pro
Run, z.B. `predictions_correct_rate` → Σ`predictions_correct` /
Σ`predictions_total`. Bevorzugt gegenüber dem Mittelwert pro-Run-
berechneter Raten, weil Runs mit kleinen Nennern sonst überproportional
gewichtet würden.

Beispiel:

```yaml
outcomes:
  - tests_passing              # Boolean → rate_%
  - cc_loc                     # Numeric → mean/min/max/std
  - cc_avg_loc_per_function    # Numeric
  - predictions_correct_rate   # pooled rate aus predictions_correct/_total
```

Damit eine `<X>_correct_rate`-Outcome funktioniert, müssen die Spalten
`<X>_correct` und `<X>_total` in `CSV_COLUMNS` (also in der
metrics.json-Struktur) vorhanden sein.

## Findings-Status-Legende

- `✅ haltbar` — Daten stützen den Befund robust (n≥3, klares Signal)
- `⚠️ revidiert` — teilweise haltbar, Aussage muss präzisiert werden
- `❌ verworfen` — Daten widersprechen dem Befund klar
- `🚫 nicht prüfbar` — Datenbasis fehlt; Status offen

## Skills

Zwei Skills automatisieren den RQ-Workflow:

| Skill | Zweck |
|---|---|
| [`/run-rq`](../.claude/skills/run-rq/SKILL.md) | Treibt eine einzelne RQ end-to-end voran: README validieren, Fill-Batch-Plan generieren, Docker-Batch im Hintergrund starten, Fortschritt monitoren, Aggregation laufen lassen, Findings-Updates vorschlagen. |
| [`/build-overview`](../.claude/skills/build-overview/SKILL.md) | Erzeugt einen Cross-RQ-Snapshot unter `_archive/experiment-overview-YYYY-MM-DD.md`. Reproduzierbar, weil Daten-Sektionen aus `findings.md` generiert und nur die Synthese-Texte vom Modell geschrieben werden. |

### `/run-rq RQ-N`

End-to-End-Loop für eine RQ. Reine Orchestrierung — alle Schritte rufen
bestehende Repo-Skripte auf (`batch-plan-from-rq.py`, `batch.sh`,
`aggregate-by-query.py`). Aufzurufen mit z.B. `/run-rq RQ-3`.

### `/build-overview`

`findings.md` ist **lebend** — Befunde wachsen, Status-Tags werden
aktualisiert, einzelne Findings können revidiert oder verworfen werden.
Für publizierbare Stichtag-Berichte (Tabellen-lastig, Cross-RQ-Synthese)
gibt es **Snapshots** unter `_archive/experiment-overview-YYYY-MM-DD.md`.

Lifecycle:

1. `experiments/generate-snapshot-skeleton.py` baut ein Skelett mit allen
   Daten-Sektionen (Datenbasis-Zahlen, Coverage, Befund-Rohlisten pro RQ,
   Caveats-Sektion über alle ⚠️/❌/🚫-Findings).
2. Der Skill füllt die Synthese-Sektionen (RQ-Absätze, Cross-RQ-Synthese,
   Schlussfolgerungen) aus den `findings.md` und schreibt nach
   `research/_archive/`.

So bleibt die `findings.md` einzige Quelle der Wahrheit, und der Snapshot
ist **reproduzierbar** statt aus dem Modellgedächtnis geschrieben.

## Archiv

`_archive/` enthält eingefrorene Wissensstände (z.B. Findings-Validation
2026-05-04 und alle generierten Experiment-Overview-Snapshots), die durch
die aktuellen RQs reproduziert werden, aber als historischer Snapshot
erhalten bleiben.
