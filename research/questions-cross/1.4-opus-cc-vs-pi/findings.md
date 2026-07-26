# RQ-model-quality-cc-vs-pi — Findings

Opus (`opus-4-8`) über den **Claude-Code-** vs. den **pi-Pfad**, je **mit und ohne Thinking**, Kata `game-of-life-example-mapping`, v6.2-Workflow-Generation. n=5 pro Zelle (20 Runs), alle korrekt (Korrektheit innen 100 %).

CC-Zellen: `v6.2-with-why-cleaned` (`opus-4-8-requesty` = thinking, `opus-4-8-no-thinking`). pi-Zellen: `v6.2.1-phase-continuation-pi` (`opus-4-8` = thinking, `opus-4-8-no-thinking`). Alle real über Requesty/Vertex-EU.

## Übersicht

Komplexität/Code-Qualität (alle **kleiner = besser**). Alle Zellen 100 % korrekt → Qualitäts-Pokale nicht korrektheits-eingeschränkt.

| Metrik (Richtung) | CC thinking | CC no-think | pi thinking | pi no-think |
|---|---:|---:|---:|---:|
| `cognitive_max` (↓) | **5.0** 🏆 | 5.6 | 9.6 | 8.2 |
| `cognitive_avg` (↓) | **3.17** 🏆 | 3.87 | 5.57 | 7.4 |
| `mccabe_avg` (↓) | 2.16 | **2.11** 🏆 | 2.9 | 3.13 |
| Smell-Summe `smell_total` (↓) | 2.2 | 2.0 | 3.4 | **1.2** 🏆 |
| Produktiv-LoC `lines_of_code` (↓) | 44.6 | 40.0 | **35.2** 🏆 | 42.2 |
| Code-Mass (APP) `code_mass` (↓) | 158.6 | 171.8 | **149.2** 🏆 | 159.6 |
| Korrektheit (innen) `tests_passing` (↑) | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `duration_seconds` (↓) | 718.6 | 579.2 | 339.4 | **318** 🏆 |

`cost_usd`: alle Zellen über Requesty (Werte in `summary.md`).

---

## F-1.1 — Der Harness-Effekt auf die Komplexität dominiert den Thinking-Effekt

Über beide Thinking-Stufen hinweg schreibt CC-Opus komplexitätsärmeren Code als pi-Opus:

| `cognitive_max` (↓) | thinking | no-thinking |
|---|---:|---:|
| **CC** | 5.0 | 5.6 |
| **pi** | 9.6 | 8.2 |

Die Harness-Differenz (CC ~5 vs. pi ~8–10) ist größer und konsistenter als die Thinking-Differenz *innerhalb* eines Harnesses. Der Harness-/Workflow-Pfad ist damit der stärkere Treiber des Code-Qualitäts-Profils, nicht die Reasoning-Stufe.

**Caveat (Workflow-Linie):** CC läuft `v6.2-with-why-cleaned` (`commands`/`rules`), pi `v6.2.1-phase-continuation` (`skills`/`extensions`/`AGENTS.md`) — zwei Linien der v6.2-Generation, per Setzung gleich behandelt. Der Effekt ist Harness ODER Workflow-Linie, nicht separierbar.

---

## F-1.2 — Thinking senkt die Code-Komplexität auf keinem der beiden Harnesse verlässlich

Der intuitive Effekt ("mehr Reasoning → aufgeräumterer Code") tritt nicht auf:

- **CC**: thinking vs. no-thinking praktisch gleich (`cognitive_max` 5.0 vs. 5.6, `cognitive_avg` 3.17 vs. 3.87). Thinking ist hier für die Code-Komplexität wirkungslos.
- **pi**: no-thinking verschlechtert `cognitive_avg` sogar (5.57 → 7.4) bei stark erhöhter Streuung (σ 1.87 → 5.9). Getrieben von einem realen Ausreißer-Run, der die gesamte Logik in eine einzige dichte Funktion legt (`cognitive_avg` = 17 bei 27 LoC) — dasselbe Dichte-Muster wie cursor-Opus in [RQ-model-quality-cursor](../../questions-cursor-cli/1.1-model-quality-cursor/findings.md). Ohne Thinking wird die Struktur unzuverlässiger, nicht schlechter im Mittel-ohne-Ausreißer.

Fazit: Thinking wirkt bei Opus-4-8 auf diesen Harnessen weniger auf die *mittlere* Komplexität als auf deren *Streuung* — mit Thinking sind die Läufe konsistenter (kleinere σ), ohne Thinking treten dichte Einzelfunktions-Ausreißer auf.

---

## F-1.3 — pi ist knapper und schneller, CC komplexitätsärmer und smell-stabiler

- **Parsimonie**: pi-thinking schreibt die wenigsten Produktiv-LoC (35.2) und geringstes Code-Mass (149.2). CC verteilt auf mehr Zeilen.
- **Laufzeit**: pi ist auf beiden Thinking-Stufen deutlich schneller (~318–339 s vs. CC ~579–719 s). Thinking kostet auf CC spürbar Zeit (719 vs. 579 s), auf pi kaum (339 vs. 318 s).
- **Komplexität/Smells**: CC führt bei `cognitive_*` durchgängig; `smell_total` ist bei CC stabil niedrig (2.0–2.2, kleine σ), bei pi schwankend (1.2–3.4, große σ).

Der Parsimonie/Komplexitäts-Tradeoff aus der cursor-RQ bestätigt sich: der knappere Pfad (pi) ist nicht der komplexitätsärmere (CC).

---

## Caveats

- **Workflow-Linie (zentral):** CC (with-why-cleaned) und pi (phase-continuation) sind zwei Linien der v6.2-Generation; Harness und Linie sind nicht separierbar (F-1.1).
- `cost_usd` aller Zellen über Requesty — vergleichbar.
- `verification_pct` = 100 % spiegelt `tests_passing` (game-of-life hat keine externe Suite).
- Die erhöhte σ der pi-no-thinking-Zelle ist echt (realer Dichte-Ausreißer-Run), kein Parser-Artefakt.
