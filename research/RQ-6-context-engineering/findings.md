# RQ-6 Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Welche Form der Kontext-Strukturierung — isolierte Subagent-Kontexte pro
TDD-Phase (v4) oder ein geteilter, akkumulierter Single-Context (v5) —
fuehrt zu besserer Code-Qualitaet?**

Datenbasis: 20 Runs (2 Zellen × n=10), Stand 2026-05-15. Modell
`opus-4-7-no-thinking`, Kata `game-of-life-example-mapping`. Identischer
Phasen-Skript-Inhalt in beiden Workflows; einziger Unterschied ist die
Kontext-Architektur. Runs wiederverwendet aus dem RQ-5-Pool.

---

## Ueberblick: Isolierter vs. geteilter Kontext

| Outcome | v4 (isolierte Subagents) | v5 (Single-Context) | v5 / v4 |
|---|---:|---:|---:|
| `cognitive_max` | **4.40** | 14.50 | **3.3×** |
| `mccabe_max` | **4.50** | 8.90 | 2.0× |
| `cc_longest_function` | **8.10** | 17.40 | 2.1× |
| `smell_total` | **2.60** | 4.10 | 1.6× |
| `code_mass` | 166.60 | **152.60** | 0.92× |
| `total_tokens` | **2.56 M** | 8.14 M | 3.2× |
| `duration_seconds` | 1163 | **380** | 0.33× |
| `tests_passing` | 100 % | 100 % | — |
| `verification_pct` | 100 % | 100 % | — |

Kleiner = besser auf allen Code-Qualitaets- und Kosten-Metriken (ausser
`tests_passing`/`verification_pct`, hier groesser = besser).

---

## F-6.1 — Isolierte Subagent-Kontexte (v4) reduzieren Code-Komplexitaet deutlich, Faktor 2–3× ✅ stabil

**Aussage**: Die Kontext-Architektur ist der dominante Faktor fuer die
Code-Qualitaets-Unterschiede zwischen v4 und v5. Bei identischem Phasen-
Skript-Inhalt (gleicher Predictor, Red, Green, Refactor) und identischem
Modell/Kata/Prompt liefert die **Phase-Isolation** strukturell besseren Code:

- `cognitive_max`: 4.40 vs 14.50 — Faktor 3.3×.
- `cc_longest_function`: 8.10 vs 17.40 — Faktor 2.1×.
- `mccabe_max`: 4.50 vs 8.90 — Faktor 2.0×.
- `smell_total`: 2.60 vs 4.10 — Faktor 1.6×.

H1 (Isolation reduziert Komplexitaet) bestaetigt. Plausible Mechanik: Im
v5-Shared-Context sieht die Green-Phase die bereits geschriebenen Tests
und kann opportunistisch *vorausschauend implementieren* (z.B. eine
Funktion gleich so generalisieren, dass spaetere Tests "automatisch"
gruen werden). Die Refactor-Phase erbt diesen Code mit eingebauter
Komplexitaet und kann ihn nicht mehr in Minimalform zerlegen.

In v4 hingegen startet jede Green-Subagent-Phase mit **leerem Kontext**
plus dem Phasen-Auftrag — sie kennt die zukuenftigen Tests nicht und
implementiert deshalb minimal. Die Refactor-Phase sieht den existierenden
Code aus einem frischen Blickwinkel und kann saubere Strukturentscheidungen
treffen.

**code_mass** ist die einzige Metrik, auf der v5 leicht besser ist
(152.6 vs 166.6, -8 %). v4 produziert mehr Helper-Funktionen — das ist
Teil der Mechanik: aufgesplittete Funktionen erhoehen die Gesamtzeilenzahl
geringfuegig, reduzieren aber die Komplexitaet pro Funktion drastisch.

**Datenbasis**: 20 Runs (10 pro Zelle). σ_v4_cognitive = 4.48 wegen einem
Refactor-Aussetzer (siehe F-6.4); v4-Median ist 3, IQR 1.25 — der typische
v4-Run ist deutlich besser als der Mittelwert suggeriert.

---

## F-6.2 — Korrektheit ist von der Kontext-Architektur unabhaengig ✅ stabil

**Aussage**: `tests_passing` und `verification_pct` liegen in beiden
Zellen bei 100 % (20/20 Runs). Die Wahl der Kontext-Architektur hat
**keinen Einfluss auf die Korrektheit** des generierten Codes — sie
beeinflusst ausschliesslich Strukturqualitaet und Effizienz.

H2 bestaetigt.

**Datenbasis**: 20 Runs × 15 Verifikations-Szenarien = 300 Szenario-Checks,
alle bestanden.

---

## F-6.3 — Kosten-Trade-off: v4 spart Tokens, v5 spart Wallclock ✅ stabil

**Aussage**: Beide Architekturen haben unterschiedliche Kosten-Profile:

| Kosten-Outcome | v4 | v5 | Vergleich |
|---|---:|---:|---|
| `total_tokens` (Mittel) | **2.56 M** | 8.14 M | v4 -69 % |
| `duration_seconds` (Mittel) | 1163 s | **380 s** | v5 -67 % |

- **v4 ist token-effizient**, weil jeder Subagent nur einen Bruchteil
  des Gesamtkontexts traegt — die Phasen-spezifischen Prompts wiederholen
  sich zwar, aber die Konversations-History ist je Subagent kurz. v5
  haeuft alle Phasen im selben Kontext an; Tokens akkumulieren linear bis
  exponentiell mit Anzahl Phasen.
- **v5 ist wallclock-effizient**, weil keine Subagent-Spawn-Overheads
  anfallen. v4 zahlt fuer jeden der ~4 Subagents pro TDD-Zyklus eine
  Einrichtungs-Latenz, die ueber die typischen 8 TDD-Zyklen pro Run
  signifikant wird (Faktor 3× wallclock).

H3 bestaetigt (v4 spart Tokens, deutlich).

**Konsequenz**: Bei API-Kosten-getriebenen Setups ist v4 bevorzugt.
Bei interaktiven oder zeitkritischen Setups (Live-Pair-Programming, CI/CD
mit Wallclock-Budget) ist v5 attraktiver — solange die Code-Qualitaet
nicht das primaere Optimierungsziel ist.

**Streuung**: v5-Token-Verbrauch ist *sehr* breit gestreut (σ=3.79 M, Range
4.6–12.2 M). Bei v4 ist die σ enger (382k, Range 2.0–3.2 M). Plan-Budgets
fuer v5 muessen den schlechten Worst-Case beruecksichtigen.

---

## F-6.4 — Beide Workflows haben spezifische Tail-Risiken ⚠️ bedingt

**Aussage**: Bei n=10 zeigen beide Workflows je einen charakteristischen
Tail-Failure-Modus:

- **v4-Refactor-Aussetzer** (1/10 Run): cognitive_max=17 (Median: 3,
  IQR: 1.25). Manuelle Inspektion zeigt eine monolithische 28-zeilige
  Arrow-Function ohne Refactor-Split. Die Refactor-Subagent-Phase hat hier
  keine Strukturverbesserung vorgenommen — Korrektheit aber 100 %.
  Auftrittsrate ~10 %.
- **v4-Wallclock-Aussetzer** (1/10 Run): duration = 3923 s (~65 min) vs
  typischen 800–1100 s. Vermutlich Subagent-Stall oder API-Retries.
  Korrektheit ebenfalls 100 %.
- **v5-Komplexitaets-Aussetzer**: cognitive_max max=24 (Median: 14),
  cc_longest_function max=32. Keine isolierten Outlier — v5 ist generell
  breit gestreut.
- **v5-Token-Aussetzer**: total_tokens max = 12.2 M vs Median ~8 M.
  Single-Context-Akkumulation in einem laenger laufenden Run.

**Konsequenz fuer Produktivitaets-Planung**:
- v4: ~10 %-Risiko von Refactor-Failure → konsequente Refactor-Pruefung
  empfohlen (z.B. cognitive_max-Threshold in CI).
- v5: keine isolierten Failures, aber konsistent breitere Streuung →
  hoehere Token-Budget-Reserven.

**Bedingung**: ⚠️ bedingt — n=10 ist fuer Tail-Quantile knapp. Auftrittsraten
um 10 % entsprechen einzelnen Runs; Konfidenzintervalle der Rate sind
breit (95 % CI etwa 0–30 %).

---

## Caveats

- **Single model**: Nur `opus-4-7-no-thinking`. Bei schwaecheren Modellen
  koennte der v4-Vorteil groesser werden (kein Drift) oder kleiner
  (Subagent-Spawn-Overhead zu hoch fuer Modell-Kapazitaet).
- **Single kata**: Nur Game of Life (Library-Form). Cross-Kata-Validierung
  mit `claim-office` (CLI-Kata) ist eine offene Erweiterung — 2 Zellen
  × 10 Runs = 20 weitere Runs noetig.
- **Identischer Phasen-Skript-Inhalt**: garantiert durch die Workflow-
  Definition. Diese RQ misst nur den Effekt der Kontext-Architektur, nicht
  des Phasen-Skripts.
- **Tail-Praezision**: Auftrittsraten der Outlier (~10 %) sind bei n=10
  grob — fuer enge Konfidenzintervalle waere n=30+ noetig.
- **Refactor-Aussetzer als Workflow-Bug**: F-6.4 dokumentiert einen
  konkreten v4-Failure-Modus, der durch Workflow-Iteration adressierbar
  waere (z.B. expliziter Komplexitaets-Trigger fuer den Refactor-Subagent).
  Nicht Teil dieser RQ, aber dokumentiert als Verbesserungsansatz.
