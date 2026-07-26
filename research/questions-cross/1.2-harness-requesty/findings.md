# RQ-harness-requesty — Findings

Harness-Effekt Claude Code (CC) vs OpenCode (OC) vs pi bei konstantem Modell
(opus-4-8 über Requesty, `vertex/claude-opus-4-8@eu`), Workflow-Intention
(`v6.2-with-why-cleaned{,-oc,-pi}`) und Prompt-Stil (`example-mapping`).
n=5 pro Zelle, 6 Zellen (3 Harnesse × 2 Katas).

**Kosten-Caveat (bindend für alle $-Aussagen):** Requesty liefert auf dieser
Route **kein** inline `cost_usd` mehr (CC=null, OC=0 im Response). Alle drei
Harnesse tragen darum die **Token×Preis-Schätzung** (`compute-cost.py`,
Requesty-vertex-Tarif $5.50/$27.50/$0.55/$6.25 pro 1M). Damit ist der
Kostenvergleich erstmals **einheitlich gemessen** — kein Methoden-Mix mehr
zwischen inline-CC/OC und geschätztem pi. Preis: die frühere Prämisse „CC/OC
tragen den real abgerechneten Betrag" gilt nicht; alle Zahlen sind
List-Preis-Baseline, nicht abgerechnet. Tokens inkl. `cache_read` sind für
alle drei korrekt erfasst (Cache greift echt: claim-office `cache_read`
CC ~53M, OC ~47M, pi im Mittel niedriger, weil pi insgesamt weniger Tokens zieht).

## Übersicht

Primär-Outcome **Korrektheit (außen)** `verification_pct` (höher = besser) +
Kern-Kostenmetrik `cost_usd` (kleiner = besser), je Harness × Kata.

### claim-office (CLI-Kata, Korrektheit außen zählt)

| Metrik (Richtung) | CC | OC | pi | cursor |
|---|---:|---:|---:|---:|
| `verification_pct` (höher) | 0.93 | 0.88 | 0.99 | **1.0** 🏆 |
| `tests_passing`-Rate (höher) | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `cost_usd` $ (kleiner) | 32.89 | 22.30 | 14.43 | **9.22** 🏆 |
| `total_tokens` (kleiner) | 49.9 M | 34.1 M | 13.8 M | **13.8 M** 🏆 |
| `duration_seconds` (kleiner) | 3149 | 2393 | 1884 | **1001** 🏆 |

### game-of-life (Code-Qualitäts-Kata, alle Zellen `verification_pct` = 1.0)

| Metrik (Richtung) | CC | OC | pi | cursor |
|---|---:|---:|---:|---:|
| `verification_pct` (höher) | **1.0** 🏆 | **1.0** 🏆 | **1.0** 🏆 | **1.0** 🏆 |
| `cost_usd` $ (kleiner) | 3.45 | 1.99 | 1.78 | **1.48** 🏆 |
| `total_tokens` (kleiner) | 4.09 M | 1.96 M | **1.07 M** 🏆 | 1.74 M |
| `cognitive_max` (kleiner) | **5.0** 🏆 | 12.6 | 11.0 | 16.6 |
| `mccabe_max` (kleiner) | **4.6** 🏆 | 8.8 | 8.0 | 10.6 |
| `smell_total` (kleiner) | **2.2** 🏆 | 3.2 | 3.4 | 4.0 |
| `refactorings_applied` (höher) | **8.8** 🏆 | 3.2 | 2.8 | 2.6 |

Trophy-Gating: `verification_pct` ist reine Korrektheit → ungated. Qualitäts-/
Kosten-Trophies auf claim-office gehen nur an Zellen mit `verification_pct` = 1.0 —
**das erreicht als einzige Zelle cursor (1.0)**, darum trägt cursor die
claim-office-$/Token/Dauer-Trophies berechtigt (voll grün *und* am günstigsten/
schnellsten). Bei game-of-life sind alle vier voll grün, alle Trophies regulär
vergeben.

**Cursor-Caveats (bindend, s. README § Cursor als 4. Harness):** (1) cursor-opus =
`claude-opus-4-8-medium` (**medium effort** ≠ plain opus-4-8 der anderen Arme) — der
schwächere Code-Qualitäts-Wert (höchste `cognitive_max`/`smell_total`, wenigste
`refactorings_applied`) kann Effort- statt Harness-Effekt sein. (2) cursor läuft auf
`v6.2.1-phase-continuation-cursor` (v6.2.1 ≈ v6.2, outcome-neutraler Fix). (3)
`cost_usd` ist wie bei allen Armen Token×Preis-Schätzung (cursor liefert keine
Inline-Kosten), native Listpreise.

---

## F-1.1 — Korrektheit ist harness-invariant

`tests_passing` (Korrektheit innen) = 100 % in allen acht Zellen.
`verification_pct` (Korrektheit außen) auf game-of-life durchgängig 1.0
(σ=0). Auf claim-office liegen alle vier hoch beieinander; cursor und pi am tightesten.

| Kata | Outcome | CC | OC | pi | cursor |
|---|---|---:|---:|---:|---:|
| claim-office | `tests_passing` | 100 % | 100 % | 100 % | 100 % |
| claim-office | `verification_pct` (mean) | 0.93 | 0.88 | 0.99 | 1.0 |
| claim-office | `verification_pct` (σ) | 0.12 | 0.17 | 0.03 | 0.0 |
| game-of-life | `tests_passing` | 100 % | 100 % | 100 % | 100 % |
| game-of-life | `verification_pct` (mean) | 1.0 | 1.0 | 1.0 | 1.0 |

Der Harness-Wechsel verschiebt die Korrektheit bei konstantem Modell und
Workflow nicht systematisch. Die claim-office-Spanne (0.88–1.0) liegt
innerhalb der Replikat-Streuung (σ bis 0.17 bei OC) — kein belastbarer
Harness-Effekt auf die außen gemessene Korrektheit. cursor (1.0, σ=0, alle 5 Runs
15/15) und pi (0.99, σ=0.03) sind am konsistentesten — bei cursor mitzudenken, dass
es auf medium effort und v6.2.1 läuft (Caveats s. Übersicht).

---

## F-1.2 — cursor ist der günstigste und schnellste Harness; pi führt unter CC/OC/pi

Bei einheitlicher Token×Preis-Messung rangiert `cost_usd` auf beiden Katas
**cursor < pi < OC < CC**. Cursor unterbietet pi (den bisherigen Günstigsten) klar
und ist zusätzlich mit Abstand der schnellste Harness.

| Kata | Metrik | CC | OC | pi | cursor |
|---|---|---:|---:|---:|---:|
| claim-office | `cost_usd` $ | 32.89 | 22.30 | 14.43 | **9.22** |
| claim-office | `total_tokens` | 49.9 M | 34.1 M | 13.8 M | 13.8 M |
| claim-office | `duration_seconds` | 3149 | 2393 | 1884 | **1001** |
| game-of-life | `cost_usd` $ | 3.45 | 1.99 | 1.78 | **1.48** |
| game-of-life | `total_tokens` | 4.09 M | 1.96 M | **1.07 M** | 1.74 M |
| game-of-life | `duration_seconds` | 719 | 350 | 326 | **198** |

Auf claim-office zieht cursor etwa gleich viele Tokens wie pi (13.8 M), ist im $
aber günstiger, weil es nativ zum Anthropic-Listpreis abgerechnet wird statt zum
~10 % höheren Requesty-vertex-Tarif der anderen Arme. Auf game-of-life zieht cursor
sogar mehr Tokens als pi (1.74 M vs 1.07 M), bleibt im $ aber knapp vorn — derselbe
Tarif-Effekt. Beim reinen Token-Aufwand (cache-bereinigter Proxy) führt weiter pi
auf game-of-life; im abrechnungsnahen `cost_usd` führt cursor auf beiden Katas.

Die frühere H2-Erwartung (pi's Kostenvorteil kippt, wenn Caching überall echt
greift) traf für CC/OC/pi **nicht** zu — dort blieb pi vorn. Erst der native
Routing-Kanal von cursor (Listpreis statt Requesty-Aufschlag) unterbietet pi. Das
ist damit teils ein **Tarif-Effekt** (nativ vs Requesty), nicht rein ein
Token-Effizienz-Effekt: cursor gewinnt trotz gleicher/höherer Token-Zahl.

Dauer-Bild getrennt: cursor ist unabhängig vom Tarif der schnellste Harness
(claim-office 1001 s vs pi 1884 s, game-of-life 198 s vs pi 326 s) — hier zählt
reine Wallclock, kein Preis. Ein Teil davon ist plausibel dem medium-effort-Modell
zuzuschreiben (weniger Reasoning/Refactor-Tiefe → schneller; s. F-1.3 + Caveat).

Caveat: alle vier Werte sind List-Preis-Baseline (keine Inline-Kosten), nicht
abgerechnete Beträge. CC/OC/pi tragen den Requesty-vertex-Tarif, cursor den nativen
Anthropic-Listpreis — der Tarif-Unterschied ist Teil des cursor-Vorsprungs und beim
Vergleich mitzuführen.

---

## F-1.3 — Claude Code liefert auf game-of-life die schlankste Spitzen-Komplexität; cursor die höchste

Auf game-of-life (alle Zellen voll korrekt) erzeugt CC deutlich niedrigere
Komplexitäts-Peaks und mehr Refactorings als OC, pi und cursor. cursor liegt am
anderen Ende — höchste Komplexität und wenigste Refactorings.

| Metrik (kleiner = besser, außer refactorings) | CC | OC | pi | cursor |
|---|---:|---:|---:|---:|
| `cognitive_max` | 5.0 | 12.6 | 11.0 | 16.6 |
| `mccabe_max` | 4.6 | 8.8 | 8.0 | 10.6 |
| `cc_longest_function` (Spitzen-Komplexität) | 11.6 | 21.8 | 17.8 | 23.2 |
| `smell_total` (Smell-Summe) | 2.2 | 3.2 | 3.4 | 4.0 |
| `refactorings_applied` (höher = besser) | 8.8 | 3.2 | 2.8 | 3.0 |

CC's `cognitive_max` (5.0) liegt bei rund 30–45 % der OC/pi/cursor-Werte;
der Abstand übersteigt die Replikat-Streuung (CC σ=1.87). Parallel
wendet CC im Mittel 8.8 Refactorings an — fast das Dreifache der übrigen Harnesse.
Der plausible Mechanismus: der Refactor-Subagent im CC-Workflow greift
strukturell häufiger, was die Spitzen-Komplexität drückt. `code_mass` (Code-Mass
APP) ist dagegen harness-nah (CC 158.6, OC 154.2, pi 150.8, cursor 141.8) — der
Unterschied liegt in der Komplexitäts-**Verteilung**, nicht im Code-Umfang; cursor
schreibt sogar die geringste Code-Mass, packt die Logik aber am dichtesten.

**cursor als Komplexitäts-Schlusslicht — Effort-Caveat greift hier am stärksten:**
cursor läuft auf `claude-opus-4-8-medium` (medium effort). Weniger Reasoning- und
Refactor-Tiefe passt genau zum Bild (wenigste Refactorings, höchste Peaks). Ob das
ein Harness- oder ein Effort-Effekt ist, lässt sich mit diesem Arm nicht trennen —
ein default-effort-cursor-Arm existiert nicht. Der cursor-Qualitäts-Nachteil ist
darum **nicht als Harness-Aussage** zu lesen, sondern als konfundierter Effort+Harness-Wert.

Auf claim-office ist das Bild schwächer und teils umgekehrt (`cognitive_max`
CC 3.0 < pi 3.6 < OC 4.6 < cursor 7.2; `cc_longest_function` CC 15.0 < OC 18.4 <
cursor 19.0 < pi 22.0) — der klare CC-Vorteil ist game-of-life-spezifisch, cursor
bleibt aber auch hier am oberen Komplexitäts-Ende.

---

## F-1.4 — TDD-Disziplin ist über alle Harnesse strukturgleich, außer Refactor-Intensität

`cycle_count` und `predictions_correct_rate` laufen über alle vier Harnesse
parallel; nur `refactorings_applied` trennt CC (mehr) von OC/pi/cursor.

| Kata | Metrik | CC | OC | pi | cursor |
|---|---|---:|---:|---:|---:|
| claim-office | `cycle_count` | 39.8 | 36.4 | 40.2 | 46.0 |
| claim-office | `predictions_correct_rate` | 99.5 % | 99.2 % | 99.4 % | 98.9 % |
| claim-office | `refactorings_applied` | 28.0 | 23.2 | 19.4 | 18.0 |
| game-of-life | `cycle_count` | 8.8 | 8.4 | 9.8 | 8.4 |
| game-of-life | `predictions_correct_rate` | 100 % | 90.5 % | 97.6 % | 100 % |
| game-of-life | `refactorings_applied` | 8.8 | 3.2 | 2.8 | 3.0 |

Die TDD-Grundmechanik (Zyklen, Vorhersage-Trefferquote) ist harness-invariant —
Zyklenzahl innerhalb der Streuung pro Kata (cursor auf claim-office mit 46.0 leicht
höher, aber σ=16 breit), Vorhersage-Trefferquote 90–100 % überall. Das bestätigt
H4 für die Kern-Disziplin über alle vier Harnesse. Der einzige robuste Unterschied
ist die Refactor-Intensität: CC refaktoriert auf game-of-life ~2.8× häufiger als
OC/pi/cursor, was direkt die niedrigere Spitzen-Komplexität aus F-1.3 speist. cursor
reiht sich bei der Refactor-Intensität zu OC/pi (game-of-life 3.0) — konsistent mit
dem medium-effort-Bild. Die game-of-life-`predictions_correct_rate` bei OC (90.5 %,
gepoolt aus nur 84 Vorhersagen) liegt tiefer, ist aber wegen der kleinen
Grundgesamtheit weniger belastbar als die claim-office-Werte (>340 Vorhersagen, alle ~99 %).

Marker-Provenienz-Hinweis: cursor-Runs tragen `marker_source=null` (der cursor-Parser
dokumentiert seinen Parse-Pfad so); die TDD-Metriken sind dennoch voll befüllt
(cycle_count 32–69, predictions 44–96) und plausibel — kein Parser-Ausfall.
