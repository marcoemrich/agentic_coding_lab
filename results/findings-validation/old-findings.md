# Alte Findings aus `experiment-overview_2026_03_02.pdf` (235 Runs)

Extrahiert aus dem PDF, Stand 2026-05-03.

**Status-Legende**:
- `[Pending]` — noch nicht re-evaluiert
- `[✅ haltbar]` — neue Daten bestätigen den Befund
- `[⚠️ revidiert]` — Befund teilweise haltbar, aber Aussage muss präzisiert werden
- `[❌ verworfen]` — neue Daten widersprechen dem Befund klar
- `[🚫 nicht prüfbar]` — Datenbasis (Modell-Mix, Kata-Mix, Thinking-Vergleich) nicht
  reproduziert in dieser Studie; Befund bleibt der jeweiligen Quell-Studie überlassen

**Bekannte Methoden-Verzerrung der alten Studie** (vgl. Plan-Kontext):
v1+v2 wurden auf example-mapping-Prompts gelaufen (Test-Beispiel-Hints frei
Haus), v3/v4/v5 ebenfalls. Bei n=1 für opus-with-thinking und n=3–5 für
opus-no-thinking ist die Varianz ohnehin nicht belastbar.

---

## §A — Workflow-Effekt-Findings

### A1 — TDD produziert einfacheren Code
**Original**: "TDD produziert einfacheren Code – alle drei TDD-Workflows (v3, v4, v5)
produzieren niedrigere Mass als die Non-TDD-Baselines auf den meisten Katas."
**Quelle**: §7 "Schlussfolgerungen / Gesicherte Erkenntnisse" #1 (S.9).
**Datenbasis**: APP-Mass-Tabelle §6.1, opus-no-thinking, n=3–5 pro Zelle, 7 Katas.
**Status**: [Pending]

### A2 — v2 schadet aktiv
**Original**: "Strukturierte Iteration ohne TDD (v2) schadet aktiv – konsistent
der komplexeste Code auf allen 7 Katas. Eine Checkliste ohne Test-First-Disziplin
foerdert Over-Engineering."
**Quelle**: §7 "Schlussfolgerungen / Gesicherte Erkenntnisse" #2 (S.9).
**Datenbasis**: APP-Mass-Tabelle §6.1: v2 ist auf 7/7 Katas der höchste Wert pro Zeile.
**Status**: [Pending]

### A3 — "Mach einfach TDD" (v3) reicht nicht
**Original**: "v3 reicht nicht – akzeptable Mass-Werte (wahrscheinlich aus
Trainingsdaten-Wissen), aber keine echte TDD-Disziplin: keine Refactorings,
keine Vorhersagen, haeufige Ueberimplementierung."
**Quelle**: §7 #3 (S.9), §6.4 TDD-Disziplin (S.8).
**Datenbasis**: §6.4: v3 hat 0–1 Refactorings, "N/A" Predictions, "Hoch"
Ueberimplementierung.
**Status**: [Pending]

### A4 — Bester Workflow hängt vom Thinking-Modus ab
**Original**: "Mit Thinking: v4-subagents (5/7 Katas niedrigste Mass).
Ohne Thinking: v5-single-context (5/7 Katas niedrigste Mass)."
**Quelle**: §7 #4 (S.9), §6.1 (S.6–7).
**Datenbasis**: §6.1: zwei separate Tabellen (no-thinking n=3–5, thinking n=1).
**Status**: [Pending]

### A5 — v4-Interaktionseffekt mit Thinking
**Original**: "v4 mit Thinking gewinnt alle 7 Katas mit 19–82% Mass-Reduktion
gegenüber v4 ohne Thinking. v4-no-thinking auf game-of-life: 200; v4-thinking: 122 (-39%)."
**Quelle**: §6.2 (S.7).
**Datenbasis**: 14 Runs (7 Katas × 2 Thinking-Modi auf v4).
**Status**: [Pending] *(potentiell partiell prüfbar an game-of-life-Daten)*

### A6 — Speed-Ranking konstant
**Original**: "Konsistente Reihenfolge über alle Katas (schnellstes zuerst):
v1 ~1–2 min, v2 ~1.5–3 min, v3 ~3–5 min, v5 ~7–11 min, v4 ~10–30 min.
v4 ist 7–14× langsamer als v1."
**Quelle**: §6.3 (S.7–8).
**Datenbasis**: Aggregierte Wallclock über 235 Runs.
**Status**: [Pending]

### A7 — v3 keine echte TDD-Disziplin
**Original**: "v3 macht kein echtes TDD: Null Refactorings, keine Vorhersagen,
haeufige Ueberimplementierung. Dem Agenten 'mach TDD' zu sagen produziert etwas
naeher an 'schreibe Tests und Code' ohne Red-Green-Refactor-Rigor."
**Quelle**: §6.4 (S.8).
**Datenbasis**: TDD-Disziplin-Tabelle, opus-no-thinking, n=3–5 pro Zelle.
**Status**: [Pending]

### A8 — v5 kontrolliert Überimplementierung am besten
**Original**: "v5 kontrolliert Ueberimplementierung am besten: Auf
pixel-art-scaler hat v3/Sonnet 9 Tests, die sofort bestehen (effektiv null
Red-Phasen). v5 haelt dies bei 2–3."
**Quelle**: §6.4 (S.8).
**Datenbasis**: tests_passed_immediately auf pixel-art-scaler, opus + sonnet.
**Status**: [Pending]

### A9 — v5 ist Code-kompakter als v4
**Original**: Implizit aus §6.1: "v5 gewinnt 5/7 Katas (no-thinking)" auf APP-Mass.
**Quelle**: §6.1 (S.6).
**Datenbasis**: APP-Mass-Tabelle no-thinking, n=3–5 pro Zelle.
**Status**: [Pending]

---

## §B — Modell- und Thinking-Findings

### B1 — Opus produziert einfacheren Code als Sonnet
**Original**: "Opus produziert einfacheren Code als Sonnet, besonders bei
komplexen Katas. Auf game-of-life: Opus Mass 171, Sonnet Mass 268 –
Sonnet produziert 57% komplexeren Code."
**Quelle**: §6.5 (S.8), §7 #5 (S.9).
**Datenbasis**: Opus-vs-Sonnet-Vergleich auf game-of-life, kleine Stichprobe.
**Status**: [Pending] *(nur in smart-subset belastbar)*

### B2 — Extended Thinking hilft Opus
**Original**: "Extended Thinking hilft Opus – 5/7 Katas mit niedrigerer Mass
auf v5, 7/7 auf v4."
**Quelle**: §6.5 (S.8), §7 #6 (S.9).
**Datenbasis**: Opus-no-thinking (n=3–5) vs. Opus-thinking (n=1) Vergleich.
**Status**: [Pending] *(nur in smart-subset prüfbar)*

### B3 — TDD verkleinert den Modell-Abstand
**Original**: "Opus produziert einfacheren Code als Sonnet, besonders bei
komplexen Katas. TDD verkleinert den Abstand."
**Quelle**: §7 #5 (S.9).
**Datenbasis**: Indirekt aus §6.1 + §6.5.
**Status**: [Pending] *(nur in smart-subset prüfbar)*

---

## §C — Sonstige Findings

### C1 — Zuverlässigkeit 100% (außer einer Kombi)
**Original**: "Success Rate: 100% ueberall ausser einer Kombination.
v5-single-context auf mars-rover mit opus-no-thinking: 75% (3 von 4 Runs).
Alle anderen 234 Runs: 100% Erfolg."
**Quelle**: §6.6 (S.8).
**Datenbasis**: Alle 235 Runs.
**Status**: [Pending]

### C2 — Trainingsdaten-Kontamination begrenzt Aussagen
**Original**: "Klassische Katas sind extrem verbreitet in Coding-Dojos,
Buechern, Blog-Posts. Claude hat mit hoher Wahrscheinlichkeit dutzende
Loesungen waehrend des Trainings gesehen. Pixel-art-scaler ist Gegenmaßnahme."
**Quelle**: §3 (S.3).
**Datenbasis**: A-priori-Annahme, kein numerischer Befund.
**Status**: [Pending]

### C3 — Daten-Qualitäts-Probleme
**Original**: "Clean-Code-Metriken (LoC, Functions, LoC/Func) identisch
ueber alle Workflows pro Kata. Coverage identisch. Token-Zaehlung = 0 fuer
einige TDD-Runs. Vorhersage-Genauigkeit > 100% in einzelnen Runs."
**Quelle**: §6.7 (S.8).
**Datenbasis**: Diverse Metrik-Spalten der alten 235-Run-Aggregation.
**Status**: [Pending]

### C4 — Generalisierbarkeit offen
**Original**: "Klassische Katas sind in Trainingsdaten. Ein Novel-Kata reicht nicht."
**Quelle**: §7 "Offene Fragen" #1 (S.9).
**Datenbasis**: Eigene Selbsteinschätzung der Studie.
**Status**: [Pending]

### C5 — Skalierung auf komplexe Aufgaben offen
**Original**: "Game-of-life und mars-rover deuten auf andere Dynamiken
bei komplexen Problemen hin."
**Quelle**: §7 "Offene Fragen" #3 (S.9–10).
**Datenbasis**: Beobachtung der nicht-monotonen Workflow-Reihenfolge auf
komplexen Katas.
**Status**: [Pending]

### C6 — Workflow-Ranking ohne Thinking
**Original**: "Rang 1: v5-single-context (niedrigste 5/7 Mass); Rang 2: v3
(2.–3. niedrigste); Rang 3: v4 (Mittelfeld); Rang 4: v1; Rang 5: v2 (höchste)."
**Quelle**: §7 "Workflow-Ranking / Ohne Thinking" (S.9).
**Datenbasis**: Aggregat über 7 Katas, no-thinking.
**Status**: [Pending]

### C7 — Workflow-Ranking mit Thinking
**Original**: "Rang 1: v4-subagents (Niedrigste 5/7); Rang 2: v5; Rang 3: v3;
Rang 4: v1; Rang 5: v2."
**Quelle**: §7 "Workflow-Ranking / Mit Thinking" (S.9).
**Datenbasis**: 7 Katas × 5 Workflows, n=1 pro Zelle.
**Status**: [Pending]

### C8 — TDD-Disziplin v3 vs v4 vs v5 (Refactor + Predictions)
**Original**: §6.4-Tabelle (S.8): v3 0–1 Refactorings / N/A Predictions / Hoch
Ueberimplementierung; v4 1–6 Refactorings / 58–100% Predictions / Mittel
Ueberimplementierung; v5 1–7 Refactorings / 75–100% Predictions / Niedrig
Ueberimplementierung.
**Quelle**: §6.4 (S.8).
**Datenbasis**: Aggregat opus-no-thinking, n=3–5.
**Status**: [Pending]

### C9 — pixel-art-scaler als Novel-Kata-Sanity-Check
**Original**: "Trends auf pixel-art-scaler stimmen mit klassischen Katas
überein, aber ein einzelnes Novel-Kata reicht nicht für belastbare Aussagen."
**Quelle**: §3 (S.3).
**Datenbasis**: pixel-art-scaler-Spalten in §6.1.
**Status**: [Pending]
