---
id: RQ-harness-requesty
question: "Wie wirkt sich der Harness-Wechsel (Claude Code vs OpenCode vs pi) auf Korrektheit, Code-Qualität, TDD-Disziplin und Kosten aus, wenn Modell (opus-4-8 über Requesty), Workflow-Intention und Prompt-Stil konstant gehalten werden?"
factors:
  workflow:
    - v6.2-with-why-cleaned
    - v6.2-with-why-cleaned-oc
    - v6.2-with-why-cleaned-pi
    - v6.2.1-phase-continuation-cursor   # cursor-Harness; v6.2.1 ≈ v6.2 (nur continuation-Fix, outcome-neutral)
  kata_base:
    - claim-office
    - game-of-life
controls:
  model:
    any:
      - opus-4-8-requesty   # CC + OC: Route vertex/claude-opus-4-8@eu, kanonisch für neue Fill-Runs
      - opus-4-8            # pi: gleiches Modell, pi-Label ohne -requesty-Suffix (models.json-Route)
      - opus-cursor         # cursor: claude-opus-4-8-medium (gleiches Modell, cursor-Route, MEDIUM effort — Caveat)
  prompt: example-mapping
outcomes:
  # primär: Korrektheit (innen + außen)
  - tests_passing
  - tests_total
  - verification_pct
  - verification_passed
  # Code-Qualität
  - code_mass
  - cognitive_max
  - mccabe_max
  - cc_longest_function
  - lines_of_code
  - smell_total
  # TDD-Disziplin
  - cycle_count
  - predictions_correct_rate
  - refactorings_applied
  # Kontext + Kosten (cache-inklusive, Tarif-gleich über alle Harnesse; Quelle je Harness s. § Kostenvergleich)
  - completed_within_budget
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: aktiv
---

# RQ-harness-requesty: Harness-Effekt CC vs OC vs pi (Requesty-Routing)

## Motivation

Nachfolger der eingefrorenen `RQ-harness` (Portkey/opus-4-7). Das Lab ist 2026-07 von
Portkey auf **Requesty** umgestiegen; die alte RQ bleibt als Portkey-Snapshot bestehen und
wird nicht überschrieben. Diese RQ misst denselben Harness-Effekt (CC vs OC vs pi, volle
TDD-Mechanik, Workflow-Trio `v6.2-with-why-cleaned{,-oc,-pi}`) neu unter Requesty — mit
zwei entscheidenden Verbesserungen der Datenlage gegenüber der Portkey-Ära:

1. **Echtes Prompt-Caching auf allen Harnessen.** Der Portkey-Bug #1579 (cache_control
   gestrippt → pi `cache_read=0`) existiert auf Requesty nicht. Live verifiziert: Requesty's
   Anthropic-`/v1/messages`-Pfad liefert `cache_creation`→`cache_read` korrekt (Cache-Hit
   senkt den Preis um ~10×).
2. **Kosten cache-inklusive über alle Harnesse.** Alle drei tragen `cost_usd` auf demselben
   Requesty-Tarif; die Cache-Rabatte greifen echt (kein #1579-Strip). CC und pi über die
   Token×Preis-Schätzung (`compute-cost.py`), OC potenziell inline (`info.cost`) — Details
   und Caveat in § Kostenvergleich. Entscheidend: der Cache-Effekt ist erstmals auf allen
   Harnessen real, nicht nur bei CC/OC wie in der Portkey-Ära.

Beide Punkte machen den Harness-Kostenvergleich erstmals sauber messbar — Details,
Preis-Baseline und Kosten-Herkunft pro Harness stehen unten in § Kostenvergleich.

## Routing (wichtiger Punkt)

`controls.model` ist ein **`any:`-Match** über zwei Labels desselben Modells:
- **`opus-4-8-requesty`** (CC + OC): CC routet über `ANTHROPIC_BASE_URL=router.eu.requesty.ai`
  + `ANTHROPIC_AUTH_TOKEN=$REQUESTY_API_KEY` (Route `vertex/claude-opus-4-8@eu`); OC über
  den `requesty`-Provider-Block in `opencode.json`. Das `-requesty`-Suffix hält diese Runs
  von etwaigen künftigen nativen opus-4-8-Runs unterscheidbar (anderer Tarif).
- **`opus-4-8`** (pi): pi routet über `pi-config/agent/models.json` (`vertex/claude-opus-4-8@eu`)
  und schreibt `model=opus-4-8` ohne Suffix.

Beide Labels bezeichnen **dasselbe Modell auf derselben Requesty-Route** — nur der
Harness-Kanal (und damit das Modell-Label) unterscheidet sich. Der `any:`-Match kollabiert
sie in eine Zelle (CLAUDE.md-Ausnahme für Routing-Varianten desselben Modells). Erster
Eintrag `opus-4-8-requesty` ist kanonisch für neue Fill-Runs (CC/OC); pi-Fill nutzt `opus-4-8`.

Thinking ist deaktiviert (no-thinking-Arme), konsistent mit der alten RQ.

### Cursor als 4. Harness (später ergänzt)

`v6.2.1-phase-continuation-cursor` + `opus-cursor` bringt cursor-cli als vierten Arm
neben CC/OC/pi. Eigener Routing-Kanal: `cursor-agent` über die Cursor-API
(`CURSOR_API_KEY`), unabhängig von Requesty und der nativen Anthropic-Subscription.
Das `opus-cursor`-Label ist Teil des `any:`-Modell-Matches (dritter Eintrag) und
bezeichnet `claude-opus-4-8-medium`.

**Zwei bindende Caveats für jeden cursor-Vergleich:**
1. **Effort-Confound.** cursor-opus läuft auf **medium effort** (`claude-opus-4-8-medium`);
   die drei anderen Arme fahren plain `opus-4-8` (default effort). Das ist ein echter
   Modell-Confound — ein beobachteter cursor-Unterschied kann Effort- statt Harness-Effekt
   sein. Cursor kodiert Effort nur im Modellnamen; ein exakt-vergleichbarer default-effort-Arm
   existiert (noch) nicht.
2. **Workflow-Version.** cursor läuft auf `v6.2.1-phase-continuation-cursor`, die anderen auf
   `v6.2-with-why-cleaned{,-oc,-pi}`. v6.2.1 unterscheidet sich von v6.2 nur durch den
   outcome-neutralen continuation-Fix und wird darum als äquivalenter Harness-Arm geführt.

## Kostenvergleich

Kernfrage dieser RQ: **Welcher Harness ist bei gleichem Modell und Workflow am
günstigsten — und kippt die alte "pi ist am billigsten"-Aussage, wenn Prompt-Caching
auf allen drei Harnessen echt greift?** Der Vergleich läuft auf zwei Mess-Schichten,
die nicht verwechselt werden dürfen:

1. **`cost_usd` (Abrechnungs-Schicht, cache-inklusive).** Der Betrag in $, den der Run
   real gekostet hätte. Cache-Reads gehen zum Rabatt-Tarif ein (Opus 4.8: $0.55/M statt
   $5.50/M Input). Das ist die entscheidende Vergleichsmetrik der RQ.
2. **`total_tokens` bzw. Input+Output cache-bereinigt (Aufwands-Schicht).** Wie viele
   frische Tokens das Modell tatsächlich verarbeitet hat. Proxy für den Rechenaufwand,
   **nicht** für den Preis — die beiden Schichten können gegenläufig ranken (siehe
   F-harness.2 der Vorgänger-RQ: cache-bereinigt CC < OC < pi, in $ aber pi < OC < CC).

### Preis-Baseline

Alle drei Harnesse routen dasselbe Modell über dieselbe Requesty-Route
(`vertex/claude-opus-4-8@eu`), also gilt **ein** Tarif für den ganzen Vergleich
(USD pro 1M Token, Stand `research/model-pricing.md` 2026-07-25):

| Input | Output | Cache Read | Cache Write |
|------:|-------:|-----------:|------------:|
| $5.50 | $27.50 | $0.55      | $6.25       |

Der Requesty-vertex-Tarif liegt ~10 % über dem nativen Anthropic-Listpreis
($5.00/$25.00/$0.50). Da alle Zellen denselben Tarif tragen, verschiebt das den
absoluten Betrag, nicht das Harness-Ranking.

### Kosten-Herkunft pro Harness (Caveat)

Der `cost_usd`-Wert stammt je nach Harness aus unterschiedlichen Quellen — beim
Vergleich zwingend als Caveat mitführen:

| Harness | cost_usd-Quelle | Cache-Read echt? |
|---------|-----------------|------------------|
| CC | **Schätzung** Token×Preis via `compute-cost.py`. Die Claude-Code-CLI verwirft das `cost`-Feld aus dem Requesty-Messages-Response beim Schreiben von `transcript.jsonl` (nur Anthropic-Standard-Token-Felder bleiben, `usage.cost` fehlt) — live an einem opus-4-8-requesty-Run verifiziert (`cost_usd=null`, cache_read=4.16M). Der Parser-Hook in `analyze_transcript.py` bleibt, greift aber nur, falls eine künftige CLI-Version `cost` durchreicht. | ja |
| OC | **inline** aus Requesty-Messages (OC-Parser `info.cost`) → `transcript-metrics.json.cost_usd`, **falls** OpenCode das Feld füllt (nach Batch-Ende zu verifizieren); sonst Fallback auf Schätzung | ja |
| pi | **Schätzung** Token×Preis via `compute-cost.py` (Requesty-`openai-completions`-Pfad liefert `cost=0`) | ja (route-abhängig, opus: ja) |
| cursor | **Schätzung** Token×Preis via `compute-cost.py`. cursor-agent liefert `cost_usd=null` (keine Inline-Kosten im stream-json); Modell `claude-opus-4-8-medium` nativ → native Listpreise ($5/$25), nicht der Requesty-Tarif. | ja (nativ) |

Faktenlage nach dem ersten Cross-Harness-Batch (2026-07-25): **CC bekommt entgegen der
ursprünglichen Annahme KEINE Inline-Kosten** — die CLI ist die Engstelle, nicht der Parser
oder Requesty. CC und pi tragen damit beide die Token×Preis-Schätzung auf demselben Tarif;
nur OC *könnte* echte Kosten liefern (offen bis zur Verifikation). Alle drei sind über
`compute-cost.py` mindestens vergleichbar geschätzt. **Kein Trophy-Automatismus** ohne
diesen Hinweis. Voraussetzung für belastbare pi-Zahlen: der Main-Thread-Summierungs-Fix in
`parse_pi_transcript.py` (sonst massiver cache_read-Undercount, s. § Methodologische Anmerkungen).

### Was gegenüber der Portkey-Vorgänger-RQ neu ist

Die alte F-harness.2 ("pi am günstigsten") war **teils ein Gateway-Artefakt**: Portkey
strippte `cache_control` beim Vertex-Routing (Issue #1579) → pi bekam gar keine
Cache-Rabatte, CC/OC schon; zusätzlich unterzählte der pi-Parser den Cache. Auf
Requesty existiert der Strip-Bug nicht — pi bekommt auf der opus-Route echte
Cache-Reads. Damit wird zum ersten Mal *sauber* gemessen, ob pi's Kostenvorteil real
ist oder nur ein fehlender-Rabatt-plus-Undercount-Effekt war. Erwartung (H2): der
Vorteil schrumpft oder kippt, weil CC/OC ihre kumulative Cache-Last jetzt gegen ein
pi hält, das auf derselben Route ebenfalls Cache-Rabatte zieht.

## Workflow-Trio

Identisch zur alten RQ-harness — `v6.2-with-why-cleaned{,-oc,-pi}` (vollständiges Trio,
Marker-Dirs `.claude`/`.opencode`/`.pi` verifiziert). Skills (test-list/red/green) +
Subagent (refactor), gleiche Marker-Konventionen. Harness-Syntax-Unterschiede und der
Übersetzungs-Confound wie in `RQ-harness` dokumentiert (siehe dort § Methodologische
Anmerkungen — gelten unverändert).

## Vorhandene Daten

Keine unter Requesty-opus-4-8 mit diesem Trio — voll von neu.
6 Zellen (3 Workflows × 2 Katas) × 5 Replikate → 30 Runs.

Da CC-Routing container-global ist, kann ein einzelner Plan CC-requesty + OC-requesty +
pi-requesty mischen (getrennte Routing-Kanäle) — kein Split nötig.

## Hypothesen

- **H1 (Korrektheit harness-invariant)**: `tests_passing`/`verification_pct` ohne
  systematischen Harness-Unterschied bei konstantem Modell+Workflow.
- **H2 (Kosten/Token differenziert — jetzt sauber)**: Anders als die Portkey-RQ ist der
  Cache-Effekt hier auf allen Harnessen echt. Erwartung: die alte "pi ist am günstigsten"-
  Aussage könnte kippen, weil CC/OC nun ebenfalls Cache-Rabatte über Requesty bekommen und
  pi weiterhin ohne Inline-Caching auf dem `openai-completions`-Pfad läuft. Kernfrage der RQ.
- **H3 (Code-Mass-Drift)**: `code_mass`/`cognitive_max` auf game-of-life mit harness-typischer
  Stil-Tendenz.
- **H4 (TDD-Disziplin harness-invariant)**: `cycle_count`/`predictions_correct_rate`/
  `refactorings_applied` strukturgleich über alle drei Harnesse.

## Methodologische Anmerkungen

- **Parser-Undercount-Fix (pi)**: `parse_pi_transcript.py` summiert seit 2026-07 die
  Main-Thread-Usage über alle Assistant-Messages (vorher nur letzter Wert → massiver
  Undercount, v. a. cache_read). Alle pi-Runs dieser RQ müssen mit dem gefixten Parser
  analysiert sein. Siehe Memory `pi-requesty-cost-and-parser-undercount`.
- **Kosten-Herkunft dokumentieren**: CC/OC tragen echte inline-Kosten (Requesty Messages),
  pi die Token×Preis-Schätzung. Beim Kostenvergleich als Caveat notieren — nicht 1:1
  gleichwertig, aber beide nahe am tatsächlichen Requesty-Tarif.
- **Marker-Disziplin/Übersetzungs-Confound**: wie `RQ-harness` — pi trägt die AGENTS.md-
  Marker-Mehrlast strukturell; Prompt-Files vor Interpretation signifikanter Diffs diff-en.
- **Spend-Limit-Guard**: vor Aggregation `grep -l 'Reached monthly spend limit'` über die
  Run-Logs (Memory `pi-requesty-412-spend-limit`).
