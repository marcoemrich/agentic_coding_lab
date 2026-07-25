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

| Metrik (Richtung) | CC | OC | pi |
|---|---:|---:|---:|
| `verification_pct` (höher) | 0.93 | 0.88 | **0.99** 🏆 |
| `tests_passing`-Rate (höher) | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `cost_usd` $ (kleiner) | 32.89 | 22.30 | **14.43** 🏆 |
| `total_tokens` (kleiner) | 49.9 M | 34.1 M | **13.8 M** 🏆 |
| `duration_seconds` (kleiner) | 3149 | 2393 | **1884** 🏆 |

### game-of-life (Code-Qualitäts-Kata, alle Zellen `verification_pct` = 1.0)

| Metrik (Richtung) | CC | OC | pi |
|---|---:|---:|---:|
| `verification_pct` (höher) | **1.0** 🏆 | **1.0** 🏆 | **1.0** 🏆 |
| `cost_usd` $ (kleiner) | 3.45 | 1.99 | **1.78** 🏆 |
| `total_tokens` (kleiner) | 4.09 M | 1.96 M | **1.07 M** 🏆 |
| `cognitive_max` (kleiner) | **5.0** 🏆 | 12.6 | 11.0 |
| `mccabe_max` (kleiner) | **4.6** 🏆 | 8.8 | 8.0 |
| `smell_total` (kleiner) | **2.2** 🏆 | 3.2 | 3.4 |
| `refactorings_applied` (höher) | **8.8** 🏆 | 3.2 | 2.8 |

Trophy-Gating: `verification_pct` ist reine Korrektheit → ungated. Qualitäts-/
Kosten-Trophies auf claim-office gehen nur an Zellen mit `verification_pct` = 1.0;
dort erreicht das keine Zelle sauber (pi 0.99 am nächsten), darum tragen die
claim-office-$/Token/Dauer-Trophies den pi-Wert als niedrigsten unter der
Einschränkung, dass keine Zelle voll grün ist — bei game-of-life sind alle
drei voll grün, alle Qualitäts-Trophies regulär vergeben.

---

## F-1.1 — Korrektheit ist harness-invariant

`tests_passing` (Korrektheit innen) = 100 % in allen sechs Zellen.
`verification_pct` (Korrektheit außen) auf game-of-life durchgängig 1.0
(σ=0). Auf claim-office liegen alle drei hoch beieinander; pi am tightesten.

| Kata | Outcome | CC | OC | pi |
|---|---|---:|---:|---:|
| claim-office | `tests_passing` | 100 % | 100 % | 100 % |
| claim-office | `verification_pct` (mean) | 0.93 | 0.88 | 0.99 |
| claim-office | `verification_pct` (σ) | 0.12 | 0.17 | 0.03 |
| game-of-life | `tests_passing` | 100 % | 100 % | 100 % |
| game-of-life | `verification_pct` (mean) | 1.0 | 1.0 | 1.0 |

Der Harness-Wechsel verschiebt die Korrektheit bei konstantem Modell und
Workflow nicht systematisch. Die claim-office-Spanne (0.88–0.99) liegt
innerhalb der Replikat-Streuung (σ bis 0.17 bei OC) — kein belastbarer
Harness-Effekt auf die außen gemessene Korrektheit. pi's engste Streuung
(σ=0.03) ist der einzige nennenswerte Unterschied.

---

## F-1.2 — pi bleibt der günstigste Harness — auch bei einheitlich gemessenem Cache

Bei einheitlicher Token×Preis-Messung über alle drei Harnesse rangiert
`cost_usd` auf beiden Katas gleich: **pi < OC < CC**. Der Kostenvorteil von pi
kippt nicht.

| Kata | Metrik | CC | OC | pi |
|---|---|---:|---:|---:|
| claim-office | `cost_usd` $ | 32.89 | 22.30 | 14.43 |
| claim-office | `total_tokens` | 49.9 M | 34.1 M | 13.8 M |
| game-of-life | `cost_usd` $ | 3.45 | 1.99 | 1.78 |
| game-of-life | `total_tokens` | 4.09 M | 1.96 M | 1.07 M |

Die Kostenrangfolge folgt eins zu eins der Token-Rangfolge — pi zieht auf
claim-office nur ~28 % der CC-Tokens (13.8 M vs 49.9 M), auf game-of-life ~26 %.
Da alle Zellen denselben Tarif tragen, ist der Preisunterschied vollständig ein
Token-Aufwands-Unterschied, kein Tarif- oder Cache-Rabatt-Artefakt. Anders als in
der Portkey-Vorgänger-Ära (wo pi's Vorteil teils ein fehlender Cache-Rabatt bei
CC/OC-Vorteil war) ist der Vorteil hier real: pi verarbeitet strukturell weniger
Tokens für dasselbe Ergebnis. Die frühere Erwartung H2 (Vorteil schrumpft/kippt,
wenn Caching überall echt greift) bestätigt sich **nicht** — er bleibt bestehen.

Caveat: alle drei Werte sind List-Preis-Baseline (Requesty inline-cost auf dieser
Route weg), nicht abgerechnete Beträge. Die Rangfolge ist davon unberührt, weil
der Tarif für alle identisch ist.

---

## F-1.3 — Claude Code liefert auf game-of-life die schlankste Spitzen-Komplexität

Auf game-of-life (alle Zellen voll korrekt) erzeugt CC deutlich niedrigere
Komplexitäts-Peaks und mehr Refactorings als OC und pi.

| Metrik (kleiner = besser, außer refactorings) | CC | OC | pi |
|---|---:|---:|---:|
| `cognitive_max` | 5.0 | 12.6 | 11.0 |
| `mccabe_max` | 4.6 | 8.8 | 8.0 |
| `cc_longest_function` (Spitzen-Komplexität) | 11.6 | 21.8 | 17.8 |
| `smell_total` (Smell-Summe) | 2.2 | 3.2 | 3.4 |
| `refactorings_applied` (höher = besser) | 8.8 | 3.2 | 2.8 |

CC's `cognitive_max` (5.0) liegt bei rund 40–45 % der OC/pi-Werte (12.6 / 11.0);
der Abstand übersteigt die Replikat-Streuung (CC σ=1.87 vs OC σ=5.37). Parallel
wendet CC im Mittel 8.8 Refactorings an — fast das Dreifache von OC (3.2) und pi
(2.8). Der plausible Mechanismus: der Refactor-Subagent im CC-Workflow greift
strukturell häufiger, was die Spitzen-Komplexität drückt. `code_mass` (Code-Mass
APP) ist dagegen harness-nah (CC 158.6, OC 154.2, pi 150.8) — der Unterschied
liegt in der Komplexitäts-**Verteilung**, nicht im Code-Umfang.

Auf claim-office ist das Bild schwächer und teils umgekehrt (`cognitive_max`
CC 3.0 < pi 3.6 < OC 4.6; `cc_longest_function` CC 15.0 < OC 18.4 < pi 22.0) —
der klare CC-Vorteil ist game-of-life-spezifisch.

---

## F-1.4 — TDD-Disziplin ist über alle Harnesse strukturgleich, außer Refactor-Intensität

`cycle_count` und `predictions_correct_rate` laufen über alle drei Harnesse
parallel; nur `refactorings_applied` trennt CC (mehr) von OC/pi.

| Kata | Metrik | CC | OC | pi |
|---|---|---:|---:|---:|
| claim-office | `cycle_count` | 39.8 | 36.4 | 40.2 |
| claim-office | `predictions_correct_rate` | 99.5 % | 99.2 % | 99.4 % |
| claim-office | `refactorings_applied` | 28.0 | 23.2 | 19.4 |
| game-of-life | `cycle_count` | 8.8 | 8.4 | 9.8 |
| game-of-life | `predictions_correct_rate` | 100 % | 90.5 % | 97.6 % |
| game-of-life | `refactorings_applied` | 8.8 | 3.2 | 2.8 |

Die TDD-Grundmechanik (Zyklen, Vorhersage-Trefferquote) ist harness-invariant —
Zyklenzahl innerhalb ±1–2 pro Kata, Vorhersage-Trefferquote 90–100 % überall.
Das bestätigt H4 für die Kern-Disziplin. Der einzige robuste Unterschied ist die
Refactor-Intensität: CC refaktoriert auf game-of-life ~2.8× häufiger als OC/pi,
was direkt die niedrigere Spitzen-Komplexität aus F-1.3 speist. Die
game-of-life-`predictions_correct_rate` bei OC (90.5 %, gepoolt aus nur 84
Vorhersagen) liegt tiefer, ist aber wegen der kleinen Grundgesamtheit weniger
belastbar als die claim-office-Werte (>350 Vorhersagen, alle ~99 %).
