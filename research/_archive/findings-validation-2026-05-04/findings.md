# Findings-Validation: Re-Evaluation der alten 235-Run-Studie

Generiert: 2026-05-03.

Datenbasis (alle in `experiments/runs/` nach Bereinigung der 16 kontaminierten v1/v2-Runs):

- **smart-subset** (89 Runs, Modell-Mix Opus-4.7-with/no-thinking, Sonnet-4.6, Haiku-4.5; 4 Katas × 3 Prompt-Stile)
- **game-of-life-stability** (33 Runs, Opus-4.7-no-thinking, n=3 pro Workflow×Prompt-Zelle)
- **game-of-life-fair** (15 Runs, Opus-4.7-no-thinking, fairer Workflow×Prompt-Match: v1/v2 prose, v3/v4/v5 example-mapping)

Status-Legende:
- `✅ haltbar` — neue Daten bestätigen den Befund
- `⚠️ revidiert` — teilweise haltbar, Aussage muss präzisiert werden
- `❌ verworfen` — neue Daten widersprechen dem Befund klar
- `🚫 nicht prüfbar` — Datenbasis fehlt; Befund bleibt seiner Quell-Studie überlassen

Verweis auf die alten Aussagen: siehe `old-findings.md`.

---

## §1 Workflow-Effekt-Findings

Primär aus game-of-life-fair (n=3 pro Zelle, faire Workflow→Prompt-Zuordnung) und
game-of-life-stability (n=9 pro Workflow für v3/v4/v5 über 3 Prompt-Stile,
n=3 für v1/v2 auf prose).

### A1 — TDD produziert einfacheren Code · ⚠️ revidiert

**Alte Aussage**: "Alle drei TDD-Workflows (v3, v4, v5) produzieren niedrigere
Mass als die Non-TDD-Baselines."

**Neue Daten** (game-of-life-fair, mass = LoC + test_lines):

| Workflow | Prompt | n | mass μ |
|---|---|---:|---:|
| v1-oneshot | prose | 3 | 163.7 |
| v2-iterative | prose | 3 | 165.0 |
| v3-basic-tdd | example-mapping | 3 | **159.0** |
| v4-exact-subagents | example-mapping | 3 | 183.0 |
| v5-exact-single-context | example-mapping | 3 | **151.3** |

- v3 (159) und v5 (151) liegen unter v1 (164) und v2 (165) — Befund hält.
- **v4 (183) liegt ÜBER v1/v2** — die Subagent-Pipeline produziert mehr Code,
  nicht weniger. Das widerspricht dem alten Pauschalsatz.
- Reicheres Quality-Signal: smell_complexity v4=0.0 / v5=0.0 vs. v1=1.3 / v2=1.3
  / v3=1.3 — TDD-Workflows mit echten Refactor-Phasen (v4, v5) reduzieren
  Cognitive-Complexity-Smells sehr klar; v3 ohne Refactor-Phase tut das nicht.

**Status**: ⚠️ revidiert. **TDD ≠ einfacher Code per se.** v4 und v5 (mit
echtem Red-Green-Refactor) reduzieren Smell-Komplexität auf 0; v3 ("nur TDD
sagen") reduziert sie nicht. v4 produziert dabei sogar mehr Mass als v1/v2.

---

### A2 — v2 schadet aktiv · ⚠️ revidiert

**Alte Aussage**: "v2 ist konsistent der komplexeste Code auf allen 7 Katas."

**Neue Daten** (game-of-life-fair, n=3):

| Workflow | smell_total μ | smell_complexity μ | smell_magic_numbers μ |
|---|---:|---:|---:|
| v1-oneshot | 4.0 | 1.3 | 2.3 |
| v2-iterative | **5.3** | 1.3 | **3.0** |
| v3-basic-tdd | 4.0 | 1.3 | 2.7 |
| v4-exact-subagents | 2.7 | 0.0 | 2.7 |
| v5-exact-single-context | 2.3 | 0.0 | 2.3 |

- v2 hat den höchsten smell_total (5.3) — Befund hält für game-of-life.
- Treiber ist `smell_magic_numbers` (3.0 vs. 2.3 bei v1) — die "checklist
  iteration" baut leicht mehr unbenannte Konstanten ein. `smell_complexity`
  unterscheidet sich nicht von v1/v3 (alle 1.3).
- Aussage "auf allen 7 Katas" ist nicht prüfbar (nur game-of-life hier).

**Status**: ⚠️ revidiert. v2 produziert tatsächlich den (leicht) schlechtesten
Code auf game-of-life — aber der Effekt ist klein (Δsmell = 1.3 vs. v1) und
nicht "Over-Engineering durch Komplexität", sondern "leicht mehr magic numbers".
Generalisierung über alle Katas bleibt offen.

---

### A3 — "Mach einfach TDD" (v3) reicht nicht · ✅ haltbar

**Alte Aussage**: "v3 hat akzeptable Mass-Werte, aber keine echte TDD-Disziplin:
keine Refactorings, keine Vorhersagen, häufige Über-Implementierung."

**Neue Daten**:

| Workflow | cycles μ | refactorings μ | predictions correct/total | Quelle |
|---|---:|---:|---|---|
| v3 | 1.0 | 0.0 | 0/0 | game-of-life-fair, n=3 |
| v4 | 8.7 | 4.0 | 15/16 (94 %) | game-of-life-fair, n=3 |
| v5 | 8.0 | 6.7 | 47/48 (98 %) | game-of-life-fair, n=3 |

In stability (n=9 pro Workflow): v3 → 1.0 cycles, 0 refactorings, 0/0
predictions. Identisches Muster.

- v3 macht **systematisch genau einen Cycle** — Test-Block schreiben →
  einmal `pnpm test` → Implementation → einmal `pnpm test`. Klassischer
  Batch-Stil ohne Red-Green-Refactor-Rigor.
- Smell-Wirkung: v3-smell_complexity = 1.3, v4/v5 = 0.0.

**Status**: ✅ haltbar. Bestätigt mit n=12 (3 fair + 9 stability).

---

### A4 — Bester Workflow hängt vom Thinking-Modus ab · 🚫 nicht prüfbar

**Alte Aussage**: "Mit Thinking: v4 (5/7 Katas niedrigste Mass). Ohne Thinking:
v5 (5/7 Katas niedrigste Mass)."

**Neue Datenbasis**: game-of-life-fair und stability laufen ausschließlich
auf opus-4-7-no-thinking. Smart-subset hat Thinking, aber nicht den Vergleich
v4/v5-with vs. without über mehrere Katas mit n≥3.

**Was wir aus smart-subset ableiten können** (n=1 pro Zelle): Thinking macht
keinen großen Unterschied auf Pass-Rate oder cc_longest_function (smart-subset
§3, §10). Auf v5+game-of-life zeigt smart-subset 19 (with thinking) vs. 29
(no thinking) — Trend, n=1.

**Status**: 🚫 nicht prüfbar mit dieser Studie. Der ursprüngliche
"v4-mit-Thinking vs. v5-ohne-Thinking"-Cross-Vergleich bleibt der alten
Studie überlassen; smart-subset (§3) deutet aber an, dass der
Thinking-Bonus klein ist.

---

### A5 — v4-Interaktionseffekt mit Thinking · 🚫 nicht prüfbar

**Alte Aussage**: "v4 mit Thinking gewinnt alle 7 Katas mit 19–82 % Mass-Reduktion;
v4-no-thinking auf game-of-life: 200; v4-thinking: 122 (-39 %)."

**Neue Datenbasis**: game-of-life-fair und stability nur no-thinking.
Smart-subset hat opus-4-7 vs. opus-4-7-no-thinking auf v4+game-of-life-prose
(je n=1):

| Workflow × Modell | LoC | smell_total | cc_longest |
|---|---:|---:|---:|
| v4 × opus-4-7 (Thinking) | 32 | 2 | 4 |
| v4 × opus-4-7-no-thinking | 41 | 2 | 10 |

→ Trend "Thinking macht v4 etwas kompakter" hält, aber n=1 — keine
σ-Schätzung möglich.

**Status**: 🚫 nicht prüfbar mit n≥3. smart-subset zeigt Trend, kein robuster
Befund.

---

### A6 — Speed-Ranking konstant · ✅ haltbar

**Alte Aussage**: "v1 ~1–2 min, v2 ~1.5–3 min, v3 ~3–5 min, v5 ~7–11 min,
v4 ~10–30 min. v4 ist 7–14× langsamer als v1."

**Neue Daten** (game-of-life-fair, n=3 pro Workflow, alle opus-4-7-no-thinking):

| Workflow | dur μ (s) | dur range (s) |
|---|---:|---|
| v1-oneshot | 48.7 | 46–51 |
| v2-iterative | 53.7 | 44–59 |
| v3-basic-tdd | 49.7 | 47–52 |
| v5-exact-single-context | 353.3 | 338–377 |
| v4-exact-subagents | 686.3 | 659–740 |

- Reihenfolge **v1 < v3 < v2 < v5 < v4** stimmt mit alter Aussage überein
  (v1<v2<v3<v5<v4 grob, mit v2/v3 fast gleichauf).
- v4/v1-Ratio: 686/49 ≈ **14×** — am oberen Ende der alten Spanne.
- Absolute Werte sind in unserer Studie deutlich kürzer (v1 ~1 min statt
  ~2 min) — vermutlich wegen besseren Modells (Opus 4.7 statt 4.x)
  und/oder Pipeline-Verbesserungen.

**Status**: ✅ haltbar. Reihenfolge und Faktor 14× bestätigen.

---

### A7 — v3 keine echte TDD-Disziplin · ✅ haltbar

**Alte Aussage**: "v3 macht kein echtes TDD: Null Refactorings, keine
Vorhersagen, häufige Über-Implementierung."

**Neue Daten**: identisch zu A3. v3 in fair (n=3) und stability (n=9):
0 Refactorings, 0 Predictions, 1.0 cycle, smell_complexity 1.3 (vs. 0.0 bei
v4/v5).

`tests_passed_immediately` ist bei v3 auf game-of-life-fair sogar 0.0
(nichts an "ge-fakter" Phase, alles in einem Schritt).

**Status**: ✅ haltbar. Stärker bestätigt als in der alten Studie.

---

### A8 — v5 kontrolliert Über-Implementierung am besten · ⚠️ revidiert

**Alte Aussage**: "v5 hält tests_passed_immediately bei 2–3, während
v3/Sonnet auf pixel-art-scaler 9 Tests sofort grün hat (effektiv null Red-Phasen)."

**Neue Daten** (game-of-life-fair, tests_passed_immediately μ):

| Workflow | tests_passed_immediately μ |
|---|---:|
| v1 | 0.7 |
| v2 | 0.3 |
| v3 | 0.0 |
| v4 | **5.7** |
| v5 | 1.3 |

Stability (n=9 pro Workflow): v4 = 5.1, v5 = 1.2, v3 = 0.0.

- v5 hält tests_passed_immediately tatsächlich niedrig (1.2–1.3) —
  konsistent mit der alten Aussage.
- **Aber v4 hat den HÖCHSTEN Wert** (5.1–5.7 von 8.7 cycles ≈ 60 %!) —
  in über der Hälfte der v4-cycles ist der neue Test direkt grün, weil
  vorhergehende Implementations-Schritte ihn bereits abdecken. Das ist das
  Gegenteil dessen, was die alte Studie für v4 angedeutet hat.
- v3 = 0 ist methodisch konsistent mit "v3 macht keine ehrlichen Phasen
  überhaupt" (A3, A7).

**Status**: ⚠️ revidiert. v5 hält Über-Implementierung gut in Schach;
**v4 hat aber paradoxerweise den höchsten Anteil sofort-grüner Tests** —
weil generalisierende Implementierungen früh kommen und nachfolgende Tests
mitabdecken.

---

### A9 — v5 ist Code-kompakter als v4 · ✅ haltbar

**Alte Aussage**: "v5 gewinnt 5/7 Katas (no-thinking) auf APP-Mass."

**Neue Daten** (game-of-life-fair, n=3):

| Workflow | LoC μ | mass μ |
|---|---:|---:|
| v4 | 41.0 | 183.0 |
| v5 | **35.7** | **151.3** |

Stability (n=9): v4 = 39.6 LoC, v5 = 36.6 LoC.

- v5 < v4 in beiden Datensätzen. Faktor ~10–17 % weniger LoC.
- mass-Differenz größer (151 vs. 183, -17 %), weil v4 tendenziell mehr
  Test-Lines schreibt.

**Status**: ✅ haltbar (auf game-of-life). Generalisierung über alle Katas
bleibt 🚫 nicht prüfbar.

---

## §2 Modell- und Thinking-Findings

Primär aus smart-subset (n=1 pro Zelle, multi-Modell). Diese Studie selbst
(game-of-life-fair, stability) ist single-model und kann zu B1–B3 nichts
unabhängig beitragen.

### B1 — Opus produziert einfacheren Code als Sonnet · ⚠️ revidiert

**Alte Aussage**: "Opus produziert einfacheren Code als Sonnet, besonders bei
komplexen Katas. Auf game-of-life: Opus Mass 171, Sonnet Mass 268 — Sonnet 57 %
komplexer."

**Smart-subset-Daten** (game-of-life-prose, v4, n=1):

| Modell | LoC | cc_longest | smell_total |
|---|---:|---:|---:|
| Opus 4.7 (Thinking) | 32 | **4** | 2 |
| Opus 4.7 no-thinking | 41 | 10 | 2 |
| Sonnet 4.6 | 42 | 18 | 3 |
| Haiku 4.5 | 59 | 22 | 4 |

→ Reihenfolge **Opus < Sonnet < Haiku** auf cc_longest und LoC bestätigt sich,
mit klar abnehmender Code-Qualität.

**Status**: ⚠️ revidiert. Befund hält qualitativ, aber:
- Mai-2026-Modelle sind absolut deutlich kompakter (Opus 32 LoC vs. 171
  Mass aus alter Studie — Skala kaum vergleichbar).
- Faktor 57 % aus alter Studie nicht direkt reproduzierbar; n=1 pro Zelle,
  σ unbekannt.

---

### B2 — Extended Thinking hilft Opus · ⚠️ revidiert

**Alte Aussage**: "Extended Thinking hilft Opus — 5/7 Katas niedrigere Mass auf v5,
7/7 auf v4."

**Smart-subset-Daten** (Opus thinking vs. no-thinking):

| Workflow | thinking | n | Pass-Rate | Dauer | LoC |
|---|---|---:|---:|---:|---:|
| v4 | thinking | 11 | 100 % | 549 s | 11.1 |
| v4 | no-thinking | 8 | 100 % | 650 s | 13.0 |
| v5 | thinking | 12 | 100 % | 245 s | 8.7 |
| v5 | no-thinking | 8 | 100 % | 230 s | 12.6 |

(LoC hier cross-Kata-gemittelt — heterogene Größenordnungen.)

Auf game-of-life-prose konkret (smart-subset §10):
- v5 + thinking: cc_longest = 19; v5 + no-thinking: cc_longest = 29 → Bonus
- v4 + thinking: cc_longest = 4; v4 + no-thinking: cc_longest = 10 → Bonus

**Status**: ⚠️ revidiert. Thinking hilft messbar bei Code-Qualität auf großen
Katas, aber:
- Pass-Rate-Effekt = 0 (in dieser Replikation 100 % bei beiden).
- Dauer-Effekt klein (-15 % auf v4, +7 % auf v5).
- Aussage "5/7 vs. 7/7" nicht reproduzierbar (anderes Kata-Set).

---

### B3 — TDD verkleinert den Modell-Abstand · 🚫 nicht prüfbar

**Alte Aussage**: "Opus produziert einfacheren Code als Sonnet, besonders bei
komplexen Katas. TDD verkleinert den Abstand."

**Smart-subset**: kein direkter Vergleich Opus-vs-Sonnet × v1-v5 in n≥3
verfügbar.

**Status**: 🚫 nicht prüfbar mit den neuen Daten. Bleibt der alten Studie
überlassen; smart-subset deutet eher "v4 macht Modell-Auswahl irrelevant
auf Pass-Rate, aber nicht auf cc_longest" an (smart-subset §10).

---

## §3 Prompt-Stil-, Reliability- und Datenqualitäts-Findings

### C1 — Zuverlässigkeit nahe 100 % · ⚠️ revidiert

**Alte Aussage**: "100 % überall außer v5+mars-rover+opus-no-thinking (75 %)."

**Neue Daten** (alle Studien zusammengezählt, post-Bereinigung):

- game-of-life-fair: 15/15 = **100 %**
- game-of-life-stability: 33/33 = **100 %**
- smart-subset: 89 Runs, davon **6 Failures** (alle Haiku-4-5 in v4/v5):
  - v4 × haiku × pixel-art-scaler-{example-mapping, user-story}: 2 Failures
  - v5 × haiku × verschiedene Katas: 4 Failures (`it.todo`-Stubs, keine
    Implementation)
  - smart-subset v5+haiku Pass-Rate: **50 %** (4/8)
  - smart-subset v4+haiku Pass-Rate: **75 %** (6/8)

**Status**: ⚠️ revidiert. Pass-Rate nicht universell 100 %, sondern
**modell-abhängig**:
- Opus (mit/ohne thinking) und Sonnet: 100 % über alle Workflows.
- Haiku 4.5 versagt in v4 (75 %) und v5 (50 %) — zu wenig Reasoning-Kapazität
  für Multi-Step-Subagent-Workflows.
- Workflows v1-v3 sind universell 100 % (auch Haiku).

---

### C2 — Trainingsdaten-Kontamination begrenzt Aussagen · ✅ haltbar

**Alte Aussage**: "Klassische Katas sind in Trainingsdaten dutzendfach;
pixel-art-scaler ist Gegenmaßnahme."

**Smart-subset** validiert: pixel-art-scaler und string-calculator sind so
trivial gelöst, dass smell-Differenzierung unmöglich ist (0 smells in 65/65
Runs). Code-Qualitäts-Signal ist **ausschließlich auf game-of-life und
mars-rover** sichtbar.

**Status**: ✅ haltbar. Verschärft sogar: pixel-art-scaler liefert nicht
nur kein Memorisation-Frei-Signal, sondern wegen Triviallösung gar kein
Smell-Signal. Aussagen über Code-Qualität müssen auf game-of-life basieren.

---

### C3 — Daten-Qualitäts-Probleme · ✅ haltbar (gefixt)

**Alte Aussage**: "Clean-Code-Metriken identisch über alle Workflows pro Kata.
Coverage identisch. Token-Zählung = 0 für einige TDD-Runs.
Vorhersage-Genauigkeit > 100 % in einzelnen Runs."

**Status**: ✅ haltbar als Beschreibung der alten Pipeline. Aktuelle Pipeline
hat folgende Bugs gefixt:
- **POSIX-awk-Bug** in `analyze-run.sh` (cc_functions=0 in Container) → fixed.
- **v3-Phasen-Inferenz** fehlte → neu via Tool-Sequenz-Inferenz.
- **v5-Predictions-Regex** matchte nicht → erweitert auf `(-|✅|❌)`.
- **tests_passing-Bug** ("X failed | Y passed" → fälschlich true) → gefixt.

Aktuelle Datenqualität (game-of-life-stability + fair, alle 48 Runs):
- cc_functions, cc_longest_function, cc_avg_loc_per_function: differenzieren
  klar zwischen Workflows.
- predictions_correct/total in v4 und v5 belastbar (94–99 %).
- coverage konsistent 100 % auf allen Workflows (kein Workflow-Signal mehr).

---

### C4 — Generalisierbarkeit offen · ✅ haltbar

**Alte Aussage**: "Klassische Katas sind in Trainingsdaten. Ein Novel-Kata reicht nicht."

**Status**: ✅ haltbar. Nichts in den neuen Daten widerspricht; smart-subset
hat zwar alle 4 Katas getestet, aber nur 2 (game-of-life, mars-rover) liefern
Quality-Signal.

---

### C5 — Skalierung auf komplexe Aufgaben offen · ✅ haltbar

**Alte Aussage**: "Game-of-life und mars-rover deuten auf andere Dynamiken bei
komplexen Problemen hin."

**Smart-subset** §9 bestätigt: cc_longest_function-Range auf game-of-life
4–29 (Faktor 7×); auf mars-rover 0–17. Auf den Trivial-Katas: ≤6 mit kaum
Spread.

**Status**: ✅ haltbar.

---

### C6 — Workflow-Ranking ohne Thinking · ⚠️ revidiert

**Alte Aussage** (no-thinking): "v5 (5/7 Mass-Niedrigste) > v3 > v4 > v1 > v2."

**Neue Daten** (game-of-life-fair, no-thinking, n=3):

| Rang | Workflow | LoC | smell_total | smell_complexity |
|---|---|---:|---:|---:|
| 1 | v5 | 35.7 | 2.3 | 0.0 |
| 2 | v4 | 41.0 | 2.7 | 0.0 |
| 3 | v3 | 40.3 | 4.0 | 1.3 |
| 3 | v1 | 41.0 | 4.0 | 1.3 |
| 5 | v2 | 42.7 | 5.3 | 1.3 |

- v5 in Position 1 bestätigt.
- **v4 (no-thinking) ist Position 2 in dieser Studie, nicht Position 3** —
  weil Refactor-Subagent auch ohne Thinking smell_complexity auf 0 drückt.
- v3 = v1 statistisch (smell 4.0/4.0, LoC 40.3/41.0).
- v2 als Schlusslicht stimmt.

**Status**: ⚠️ revidiert. Reihenfolge ist **v5 > v4 > v1 ≈ v3 > v2** auf
game-of-life-no-thinking, nicht "v5 > v3 > v4 > v1 > v2".

---

### C7 — Workflow-Ranking mit Thinking · 🚫 nicht prüfbar

**Alte Aussage**: "Mit Thinking: v4 (5/7 Niedrigste) > v5 > v3 > v1 > v2."

**Neue Datenbasis**: 0 Runs mit Thinking in fair/stability. smart-subset
hat Thinking, aber n=1 pro Workflow×Kata-Zelle.

**Status**: 🚫 nicht prüfbar mit n≥3. smart-subset deutet an, dass v4
mit Thinking auf game-of-life cc_longest=4 erreicht (vs. v5+thinking 19) —
also Position 1 für v4.

---

### C8 — TDD-Disziplin v3 vs v4 vs v5 · ✅ haltbar (mit Korrektur)

**Alte Aussage**: "v3 0–1 Refactorings / N/A Predictions / Hoch
Über-Implementierung; v4 1–6 Refactorings / 58–100 % Predictions / Mittel
Über-Implementierung; v5 1–7 Refactorings / 75–100 % Predictions / Niedrig."

**Neue Daten** (game-of-life-fair, n=3):

| Workflow | refactorings μ | predictions correct/total | tests_immediately μ |
|---|---:|---|---:|
| v3 | 0.0 | 0/0 | 0.0 |
| v4 | 4.0 | 15/16 (94 %) | 5.7 |
| v5 | 6.7 | 47/48 (98 %) | 1.3 |

- Refactor-Counts liegen genau in den alten Bändern (v3: 0; v4: ~4; v5: ~7).
- **Predictions in v5 sind jetzt belastbar** (alte Studie hatte
  "75–100 %"; bei uns 98 %; alte Aussage stimmt mit oberer Grenze überein).
- **Über-Implementierung-Reihenfolge ist anders**: alte Studie sagte "v3
  hoch, v4 mittel, v5 niedrig". Bei uns: v4 = 5.7 hat den höchsten
  tests_passed_immediately-Wert (s. A8), v5 = 1.3, v3 = 0.0. Aber v3 = 0
  bedeutet hier nicht "keine Über-Implementierung", sondern "keine
  Phasen-Mechanik überhaupt" — die Metrik trägt für v3 keine Information.

**Status**: ✅ haltbar für Refactor-Counts und Prediction-Genauigkeit.
Über-Implementierungs-Aussage muss präzisiert werden: v4 hat den höchsten
"sofort-grün"-Anteil im Phasen-Sinn, weil seine generalisierenden
Implementierungen (smell_complexity 0!) viele Tests gleichzeitig erfüllen.
Das ist nicht "schlechte Disziplin", sondern Konsequenz des
Refactor-Subagent-Drucks zur Generalisierung.

---

### C9 — pixel-art-scaler als Novel-Kata-Sanity-Check · ❌ verworfen

**Alte Aussage**: "Trends auf pixel-art-scaler stimmen mit klassischen
Katas überein, aber ein einzelnes Novel-Kata reicht nicht."

**Smart-subset** §7+§8: pixel-art-scaler hat in 30/30 Runs **smell_total=0**,
**cc_longest_function ≤ 6** in fast allen Runs. Es differenziert weder
Workflows noch Modelle.

**Status**: ❌ verworfen als Sanity-Check-Quelle. Pixel-art-scaler ist zu
trivial für jede Code-Qualitäts-Aussage. Es kann höchstens für Pass-Rate-
und Speed-Vergleiche dienen.

---

## §4 Zusammenfassung: was sich geändert hat

| Befund | Status |
|---|---|
| TDD ⇒ einfacher Code | ⚠️ nur v4/v5 (echte Refactor-Phasen); v3 nicht |
| v2 = schlechtester Workflow | ⚠️ ja auf game-of-life, kleiner Effekt |
| v3 = Fake-TDD | ✅ klar bestätigt |
| Thinking vs. workflow-pick | 🚫 nicht prüfbar |
| Speed-Ranking konstant (v4 14× v1) | ✅ bestätigt |
| Opus < Sonnet < Haiku in cc_longest | ⚠️ qualitativ ja, n=1 |
| Pass-Rate ≈ 100 % | ⚠️ Haiku in v4/v5 fällt aus (50–75 %) |
| Klassische Katas in Trainingsdaten | ✅ verschärft |
| Pixel-art-scaler als Sanity-Check | ❌ zu trivial |
| Workflow-Ranking no-thinking | ⚠️ v5 > v4 > v1 ≈ v3 > v2 (nicht v5 > v3 > v4) |
| TDD-Disziplin-Bänder (refac, pred) | ✅ Werte halten |
| Über-Implementierung v4 vs v5 | ⚠️ v4 hat mehr "sofort-grün", aber bessere smell |

**Drei Kern-Korrekturen**:
1. **v4 ist nicht der "Mass-Reduzierer"**: v4 produziert ~17 % MEHR mass als
   v5 auf game-of-life-fair, aber gleiche smell_complexity (beide 0.0). Die
   alte Studie hat die "Subagent-Pipeline reduziert Mass"-Story zu stark.
2. **v3 reduziert smell_complexity NICHT**: Trotz "TDD"-Label landet v3 bei
   smell_complexity 1.3 — gleichauf mit v1/v2 (no-TDD-baselines). Echtes
   Refactoring (v4/v5) macht den Unterschied.
3. **Reliability ist nicht universell**: Haiku 4.5 fällt in v4/v5 aus
   (50–75 % Pass-Rate). Workflow×Modell-Tauglichkeit muss separat
   validiert werden.

---

## Files

- Datenquellen:
  - `results/game-of-life-fair/runs.csv`, `summary.md`
  - `results/game-of-life-stability/runs.csv`, `summary.md`, `findings.md`
  - `results/smart-subset/runs.csv`, `summary.md`, `findings.md`
- Alte Findings: `old-findings.md` (in diesem Ordner)
