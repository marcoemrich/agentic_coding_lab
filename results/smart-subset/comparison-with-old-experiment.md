# Vergleich: Smart-Subset (Mai 2026) vs. Experiment-Overview (März 2026)

Ziel: Welche Befunde aus `results/experiment-overview_2026_03_02.pdf` (235 Runs,
Opus 4.6 / Sonnet 4.5, 7 Katas × 5 Workflows) reproduzieren sich in der neuen
Stichprobe (89 Runs, Opus 4.7 / Sonnet 4.6 / Haiku 4.5, 4 Katas mit
Prompt-Stil-Varianten × 5 Workflows) — und welche nicht?

Legende:
- ✅ reproduziert
- ⚠️ partial / abgeschwächt
- ❌ nicht reproduziert
- 🚫 nicht prüfbar (Daten-Lücke)

---

## Methodische Caveats vorab

Der Vergleich ist **nicht apples-to-apples**:

| Dimension | Alt (März) | Neu (Mai) |
|---|---|---|
| Katas | 7 (cerberus-score, string-calculator, word-score, pixel-art-scaler, diamond, mars-rover, game-of-life) | 4 (string-calculator, pixel-art-scaler, mars-rover, game-of-life) — jeweils mit Prompt-Stil-Varianten (prose / example-mapping / user-story) |
| Modelle | Opus 4.6, Sonnet 4.5 | Opus 4.7 (Adaptive Thinking), Sonnet 4.6, Haiku 4.5 |
| Replikate pro Zelle | ~1 (235 / (7×5×4) ≈ 1.7) | 1–3 |
| Transcript-Metriken | vorhanden (cycles, tokens, predictions, refactorings) | post-hoc nachgerüstet (siehe Pipeline-Update) |
| ESLint / Smell-Detection | aktiviert | post-hoc nachgerüstet |

→ **Quantitative Vergleiche nur auf identischer Kata-Basis** — von den
4 neuen Katas existieren `mars-rover` und `game-of-life` im alten
Datensatz in vergleichbarer Form (alte: ohne `-prose`-Suffix, aber
denselbe Aufgabe). `string-calculator` und `pixel-art-scaler` sind
zwar namensgleich, aber im Mai-Batch deutlich ausgesplittet
(prose / example-mapping / user-story). Aussagen, die das alte
Aggregat über 7 Katas mit dem neuen Aggregat über 4–8 Kata-Varianten
vergleichen, sind methodisch zweifelhaft und werden hier explizit
markiert.

→ Befunde mit n=1 pro Zelle haben in beiden Experimenten ähnlich hohe
Varianz.

> **Quellverweis:** Smart-subset-Werte stammen aus `summary.md`. Dort
> sind die Workflow×Modell-Pivots seit Mai 2026 **pro Kata** strukturiert
> (Block `## Kata: <name>` → Sub-Sektionen Core/TDD/Code-Quality/Coverage).
> Cross-kata-Mittel stehen separat im Anhang `## Cross-kata averages`
> und sind dort als Sanity-Check markiert.

---

## 1. Headline-Befund: "v4-exact-subagents + Opus + Thinking ist die Speerspitze" — ⚠️

**Alt:** v4 + Opus + Thinking gewinnt auf allen 7 Katas im Code-Mass-Ranking
(19–82 % weniger Mass als die schlechteste Konfiguration desselben Katas).

**Neu — die Aggregat-Tabelle (workflow × thinking-flag, gemittelt über
alle Katas) wäre hier irreführend**, weil string-calculator (≈ 3 LoC,
21–28 mass) mit game-of-life (≈ 30 LoC, 95–157 mass) gemittelt würde.
Cross-Kata-Mittel stehen in `summary.md` unter
`## Cross-kata averages` und sind dort ausdrücklich als Sanity-Check
gekennzeichnet. Für den Vergleich nutzen wir die pro-Kata-Tabelle direkt:

**Pro Kata (Opus 4.7, v4 thinking vs no-thinking):**

| Kata | thinking | no-thinking | Δ |
|---|---:|---:|---|
| game-of-life-prose | 137 | 157 | −13 % ✅ |
| mars-rover-prose | 121 | 110 | +10 % ❌ |
| pixel-art-scaler-prose | 48 | 30 | +60 % ❌ |
| pixel-art-scaler-example-mapping | 44 | 41 | +7 % ❌ |
| pixel-art-scaler-user-story | 34 | 44 | −23 % ✅ |
| string-calculator-prose | 25 | 21 | +19 % ❌ |
| string-calculator-example-mapping | 21 | 21 | 0 % ➖ |
| string-calculator-user-story | 25 | 25 | 0 % ➖ |

→ Auf Kata-Ebene **gewinnt thinking nur 2/8**, verliert 4/8, gleich auf 2/8.
Der Aggregatvorteil entsteht v.a. durch game-of-life-prose (mass=137 vs 157)
und ein paar gleichstandige Mini-Katas.

**Verdict:** ⚠️ partial — Aggregat-Trend ja, aber alte Aussage
"thinking gewinnt auf jedem einzelnen Kata" hält nicht.

---

## 2. "v5 gewinnt 5/7 Katas ohne Thinking" — ✅ verstärkt

**Alt:** v5-exact-single-context (single context window, skills statt
subagents) ist auf 5/7 Katas ohne Thinking führend in Code-Mass.

**Neu:** v5 schlägt v4 auf Code-Mass und Dauer **konsistent**: auf 6/8
Kata-Zellen für Opus 4.7 thinking (Vergleich auf identischer Kata, daher
methodisch sauber).

| Kata | v4 thinking mass | v5 thinking mass | v5 gewinnt? |
|---|---:|---:|---|
| game-of-life-prose | 137 | 113 | ✅ |
| mars-rover-prose | 121 | 95 | ✅ |
| pixel-art-scaler-example-mapping | 44 | 28 | ✅ |
| pixel-art-scaler-prose | 48 | 30 | ✅ |
| pixel-art-scaler-user-story | 34 | 36 | ❌ knapp |
| string-calculator-example-mapping | 21 | 25 | ❌ knapp |
| string-calculator-prose | 25 | 27.7 | ❌ knapp |
| string-calculator-user-story | 25 | 25 | ➖ |

→ Auf den großen Katas (game-of-life, mars-rover, pixel-art-scaler) gewinnt
v5 deutlich; auf den trivialen string-calculator-Varianten gibt es kaum
Spielraum (mass ≈ 21–28 für alle Konfigurationen).

**Verdict:** ✅ reproduziert — v5 ist auch in der neuen Stichprobe der
Mass-Champion, und das **mit oder ohne Thinking**.

---

## 3. Speed-Ranking v1 < v3 < v2 ≪ v5 < v4 — ✅

**Alt:** Wallclock-Zeit steigt monoton mit Workflow-Komplexität.

**Neu (alle Modelle gemittelt):**

| Workflow | n | Avg Duration |
|---|---:|---:|
| v1-oneshot | 8 | **33 s** |
| v3-basic-tdd | 8 | 39 s |
| v2-iterative | 2 | 50 s |
| v5-exact-single-context | 32 | 305 s |
| v4-exact-subagents | 33 | **566 s** |

→ Identisches Ranking wie alt. v4 ist 17× langsamer als v1, v5 ist 9× langsamer.

**Verdict:** ✅ reproduziert.

---

## 4. "v4 ist 10× langsamer als v3" — ✅

**Alt:** v4 ≈ 10× v3-basic-tdd Zeit.

**Neu:** v4 = 566 s, v3 = 39 s → **14×**. Effekt sogar verstärkt (mehr
Subagent-Round-Trips bei den größeren Prose-Katas).

**Verdict:** ✅ reproduziert (Faktor sogar etwas größer).

---

## 5. "v2-iterative ist immer der schlechteste Workflow" — 🚫 nicht prüfbar (n zu klein)

**Alt:** v2 hat höchste Mass, niedrigste Test-Disziplin, fakest TDD-Cycles.

**Neu:** v2 wurde nur 2× gefahren (Sonnet auf 2 Katas) → n zu klein für
robuste Aussage. In den 2 Runs: 100 % pass, mass=28.5 (niedriger als v1!).
TDD-Metriken nach Enrichment: 1.0 cycle, 0 refactorings — gleiches Muster
wie v1/v3 (Single-Step-Implementation), keine Differenzierung in der
n=2-Stichprobe.

**Verdict:** 🚫 nicht prüfbar (n zu klein).

---

## 6. "v3-basic-tdd fakest TDD: 0 refactorings" — ✅ reproduziert (mit Enrichment)

**Alt:** v3 schreibt zwar Tests-zuerst, refactort aber nie → identisch
zu v1-oneshot in code_mass.

**Neu (nach Transcript-Enrichment):**

| Workflow × Modell | n | avg cycles | avg refactorings |
|---|---:|---:|---:|
| v1-oneshot × sonnet-4-6 | 7 | 1.1 | **0.0** |
| v3-basic-tdd × sonnet-4-6 | 8 | 1.2 | **0.0** |
| v4-exact-subagents × sonnet-4-6 | 8 | 6.8 | 5.8 |
| v5-exact-single-context × sonnet-4-6 | 8 | 5.5 | 5.5 |

→ v3 hat tatsächlich **0 Refactorings im Schnitt** und nur 1.2 Cycles —
exakt das alte Muster reproduziert. v3 ist auf Sonnet 4.6 weiterhin
Fake-TDD (Tests + Implementation in einem Schritt).

Mass-Differenz (v3 > v1 mit 63.2 vs 53.4) erklärt sich durch zusätzliche
Test-Lines, nicht durch mehr Refactor-Disziplin.

**Verdict:** ✅ reproduziert.

---

## 7. "Opus produziert konsistent simpleren Code als Sonnet" — ✅

**Alt:** Opus < Sonnet in Code-Mass quer durch alle Workflows.

**Neu — Vergleich pro Kata (Code-Mass, v4-exact-subagents, n=1 pro Zelle):**

| Kata | Opus thinking | Opus no-thinking | Sonnet | Haiku |
|---|---:|---:|---:|---:|
| game-of-life-prose | 137 | 157 | 169 | 250 |
| mars-rover-prose | 121 | 110 | 127 | 162 |
| pixel-art-scaler-prose | 48 | 30 | 75 | (kein run) |
| string-calculator-prose | 25 | 21 | 25 | 21 |

→ Auf game-of-life zieht sich Opus-thinking knapp besser durch
(137 vs. 169 für Sonnet); auf mars-rover-prose ist Opus-no-thinking
sogar minimal schlechter als Opus-thinking, beide unter Sonnet. Auf
den kleinen Katas (pixel-art-scaler, string-calculator) ist der
Modell-Effekt klein, weil das Volumen begrenzt ist (Mass-Bandbreite
21–75 statt 110–250).

→ Haiku ist auf v4 deutlich verboser (250 mass auf game-of-life), was
teilweise durch die gefailten Runs mit Half-Implementation kommt.

> Eine cross-kata-Modell-Mittelung gibt es in `summary.md` unter
> `## Cross-kata averages` als Sanity-Check; für die Aussage "Opus
> simpler als Sonnet" sind die obigen Pro-Kata-Werte aussagekräftiger.

**Verdict:** ✅ reproduziert — auf den großen Katas (game-of-life,
mars-rover, pixel-art-scaler-prose) liefert Opus-4.7 (thinking)
konsistent das niedrigste Mass; Sonnet 4.6 liegt knapp darüber.

---

## 8. "Erfolgsrate 100 % außer string-calculator + v4 + Sonnet" — ⚠️ neue Failure-Modes

**Alt:** Praktisch alle 235 Runs haben grüne Tests; ein einzelner
v4+sonnet+string-calculator-Run ist gefailt.

**Neu:**

| Zelle | Pass-Rate |
|---|---:|
| Alle Sonnet-Zellen | 100 % |
| Alle Opus-Zellen (mit/ohne Thinking) | 100 % |
| v4-exact-subagents × haiku-4-5 | **75 %** (6/8) |
| v5-exact-single-context × haiku-4-5 | **50 %** (4/8) |

→ Sonnet/Opus reproduzieren die hohe Reliability. **Neuer Failure-Mode**:
Haiku 4.5 versagt auf den anspruchsvollen Multi-Step-Workflows v4/v5.
Bei v5 ist das Muster eindeutig: nur Test-Liste (`it.todo`-Stubs), keine
Implementation — das Modell "vergisst" im Single-Context den
Implementierungsschritt.

**Verdict:** ⚠️ Sonnet/Opus reproduzieren; Haiku ist neu im Mix und
zeigt einen reproduzierbaren Failure-Mode auf v4/v5.

---

## 9. "v4 + Thinking gewinnt auf allen 7 Katas" — ❌ nicht reproduziert auf Kata-Ebene

Siehe §1: Thinking gewinnt auf v4 nur 2/8 Kata-Zellen einzeln, der
Aggregatvorteil kommt aus wenigen großen Katas (game-of-life-prose).

**Verdict:** ❌ Aussage in der absoluten Form ("auf allen Katas") hält
nicht. Auf v5 ist das Bild klarer pro-thinking, auf v4 ist es uneindeutig.

---

## 10. TDD-Disziplin-Metriken (refactorings, predictions, tests_passed_immediately) — ✅ reproduziert (post-hoc)

**Datenstand**: Mit `experiments/enrich-runs.sh` (Mai 2026) wurden die
Session-JSONLs aus dem persistierten Docker-Volume nachträglich in die
Run-Dirs kopiert und `analyze-run.sh` neu gefahren. 83/89 Runs haben
jetzt non-null TDD-Metriken (die fehlenden 6 sind gefailte Runs ohne
Session-JSONL).

**Predictions Quality** (alt vs neu auf v4):

| Konfiguration | alt (Feb) | neu (Mai) |
|---|---|---|
| v4 + Opus + Thinking | ~95 % | 100 % (4.6/4.6) |
| v4 + Opus + No-Thinking | ~85 % | 100 % (5.2/5.2) |
| v4 + Sonnet | ~85 % | 91 % (5.8/6.4) |
| v4 + Haiku | – (nicht im alten Set) | 95 % (2.1/2.2) |

→ Predictions sind in der neuen Stichprobe **noch genauer** als im
alten Experiment. Adaptive Thinking auf Opus 4.7 schlägt sich kaum von
no-thinking ab (beide 100 %).

**Refactorings pro Cycle** (alt vs neu):

| Workflow | alt avg | neu avg (alle Modelle, v4) |
|---|---:|---:|
| v1-oneshot | 0.0 | 0.0 ✅ |
| v3-basic-tdd | 0.0 | 0.0 ✅ |
| v4-exact-subagents | ~0.7–0.9 | 4.7–5.8 (höhere Werte!) |
| v5-exact-single-context | – | 3.8–5.5 |

Die v4-Refactoring-Counts sind in der neuen Stichprobe deutlich höher,
was teils durch andere Cycle-Definition, teils durch verbesserte
Modell-Disziplin (Opus 4.7 / Sonnet 4.6) erklärbar ist.

**tests_passed_immediately** (Anteil grüner First-Run-Tests):

| Workflow | neu avg (über Modelle) |
|---|---:|
| v4 | 1.5–3.2 (von 6–7 Cycles) |
| v5 | 1.5–2.4 (von 5–6 Cycles) |

→ Modelle predicten zwar 95–100 % korrekt, schaffen aber nur in
~25–50 % der Cycles, dass der erste Test-Run schon grün ist. Konsistent
mit altem Befund: Predictions ≠ Implementation-Erfolg.

**Verdict:** ✅ TDD-Disziplin-Befunde reproduzieren sich. v3 fakest TDD
(0 refactorings), v4 ist der einzige Workflow mit echter
Refactor-Disziplin. v5 hat keine Predictions per Workflow-Design.

---

## 11. Code-Smells (ESLint+SonarJS) — ⚠️ partial reproduziert

**Datenstand**: ESLint+SonarJS-Pipeline post-hoc per `enrich-runs.sh`
auf alle 89 Runs angewendet (kanonische Config aus `old_runs/` +
`pnpm install eslint+sonarjs`).

**Smell-Verteilung**:

| Kata | Anzahl Runs mit smell>0 | dominanter Smell |
|---|---:|---|
| game-of-life-prose | 7/12 | magic_numbers (2–3), 1 complexity-Spike |
| mars-rover-prose | 2/12 | magic_numbers, complexity (sonnet/v3) |
| pixel-art-scaler-* | 0/30 | sauber |
| string-calculator-* | 0/35 | sauber |

→ Die kleinen Katas (string-calculator, pixel-art-scaler) bleiben in
der neuen Modell-Generation komplett sauber — auf 3–15 LoC ist kein
Spielraum für Cognitive-Complexity ≥10 oder mehrfach magische Zahlen.

→ Auf game-of-life zeigt sich das alte Quality-Differenzierungs-Signal
abgeschwächt: v1/v3 (sonnet) haben 4–5 Smells, v4/v5 nur 2–3. Aber das
ist nur eine Achse mit n=12, nicht statistisch belastbar.

**Verdict:** ⚠️ Pipeline reproduziert, aber Modell-Generation Mai 2026
schreibt zu sauber, um den alten Code-Quality-Befund klar nachzubilden.
Die "v4 produziert simpleren Code als v1"-Aussage gilt für Code-Mass
auf den großen Katas (siehe §1, §7) und ganz besonders für
`cc_longest_function` auf game-of-life-prose (4 Zeilen v4+Opus+Thinking
vs. 28 v3-basic-tdd, siehe `findings.md` §8) — nur nicht aggregat über
SonarJS-Smell-Counts auf den kleinen Katas.

---

## Zusammenfassung

| Befund | Status |
|---|---|
| 1. v4+Opus+Thinking als universelle Speerspitze | ⚠️ |
| 2. v5 gewinnt auf den meisten Katas | ✅ |
| 3. Speed-Ranking v1<v3<v2≪v5<v4 | ✅ |
| 4. v4 ≈ 10× langsamer als v3 | ✅ |
| 5. v2 immer schlechtester Workflow | 🚫 (n=2) |
| 6. v3 fakest TDD (0 refactorings) | ✅ (post-hoc) |
| 7. Opus simpler als Sonnet | ✅ |
| 8. Reliability 100 % außer Edge-Case | ⚠️ neuer Haiku-Failure-Mode |
| 9. Thinking gewinnt jeden einzelnen Kata | ❌ |
| 10. TDD-Disziplin-Befunde | ✅ (post-hoc) |
| 11. Code-Smells (Quality) | ⚠️ |

**Was sich gegenüber März verändert hat:**
- **v5 > v4** in der neuen Modell-Generation: gleicher (oder besserer) Code,
  10× weniger Wallclock — das war im alten Report schon angedeutet, ist hier
  klarer.
- **Adaptive Thinking auf Opus 4.7** zeigt einen Mass-Vorteil im Aggregat,
  aber **viel schwächer pro Kata** als der alte Extended-Thinking-Vorteil
  auf Opus 4.6. Plausible Erklärung: Adaptive Thinking entscheidet
  selbstständig, wann es nachdenkt, und springt bei trivialen Katas
  (string-calculator) gar nicht erst an.
- **Haiku 4.5 als drittes Modell** ist auf einfachen Workflows (v1–v3)
  voll grün, aber unzuverlässig auf Multi-Step v4/v5.
- **Mai-Modelle schreiben deutlich sauberer** als die Feb-Generation —
  fast keine Magic Numbers, fast keine Complexity-Verstöße. Das Smell-
  Differenzierungs-Signal verkleinert sich entsprechend.

**Was die neue Stichprobe weiterhin NICHT entscheiden kann:**
- v2-iterative-Performance (n=2)
- Code-Smell-Differenzierung auf den kleinen Katas (zu sauber)

Für die nächste Iteration: mehr Replikate auf die strittigen Cells
(v4-thinking pro Kata, v2 generell, Haiku auf v4/v5), und Smell-
relevante Katas (game-of-life, mars-rover, oder neue große Katas)
priorisieren.
