# RQ-harness — Findings

## Übersicht

Pivot über die vier Zellen (Kata × Harness). Alle Zellen: `model=opus-4-7-portkey-no-thinking`, `prompt=example-mapping`, `workflow=v6.2-with-why-cleaned{,-oc}`.

| Outcome | Richtung | CC × claim-office (n=8) | OC × claim-office (n=5) | CC × game-of-life (n=10) | OC × game-of-life (n=5) |
|---|---|---|---|---|---|
| `verification_pct` (mean ± σ) | höher = besser | 0.96 ± 0.09 | **1.00** 🏆 ± 0 | **1.00** 🏆 ± 0 | **1.00** 🏆 ± 0 |
| `tests_passing` (rate) | höher = besser | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `total_tokens` (mean, Mio) | kleiner = besser | 44.4 ± 3.4 | **30.8** 🏆 ± 16.3 | 8.32 ± 1.61 | **2.44** 🏆 ± 0.74 |
| `duration_seconds` (mean) | kleiner = besser | 2530 ± 401 | **2230** 🏆 ± 952 | 627 ± 117 | **516** 🏆 ± 196 |
| `code_mass` (APP, mean) | kleiner = besser | 879 ± 91 | **827** 🏆 ± 99 | 153 ± 14 | **149** 🏆 ± 12 |
| `lines_of_code` (mean) | kleiner = besser | **255** 🏆 ± 43 | 271 ± 44 | 41 ± 7 | **39** 🏆 ± 5 |
| `cognitive_max` (mean) | kleiner = besser | 5.0 ± 1.8 | **4.8** 🏆 ± 3.0 | **4.3** 🏆 ± 2.8 | 6.2 ± 2.6 |
| `mccabe_max` (mean) | kleiner = besser | **4.5** 🏆 ± 0.8 | 4.8 ± 1.8 | **4.2** 🏆 ± 1.3 | 5.4 ± 2.0 |
| `cc_longest_function` (mean) | kleiner = besser | **12.4** 🏆 ± 1.4 | 15.0 ± 7.0 | **12.2** 🏆 ± 6.9 | 17.0 ± 5.2 |
| `smell_total` (mean) | kleiner = besser | 0.38 ± 0.74 | **0.20** 🏆 ± 0.45 | 2.4 ± 0.5 | **2.2** 🏆 ± 0.5 |
| `cycle_count` (mean) | kontextabhängig | 37.4 ± 1.6 | 33.0 ± 10.7 | 8.5 ± 1.4 | 9.2 ± 0.8 |
| `refactorings_applied` (mean) | höher = besser | **24.9** 🏆 ± 6.9 | 19.0 ± 11.4 | **7.9** 🏆 ± 1.9 | 5.0 ± 2.8 |
| `predictions_correct_rate` (gepoolt) | höher = besser | 97.2 % (599 obs) | **99.6 %** 🏆 (256 obs) | **100 %** 🏆 (170 obs) | **100 %** 🏆 (86 obs) |

Trophy-Vergabe: alle Zellen erfüllen die Korrektheits-Gating-Regel (`verification_pct ≥ 0.95`), darum auch Effizienz- und Qualitätsmetriken bewertbar. Symbol `🏆` markiert besten Mittelwert pro Zeile; bei Spread innerhalb ≈1 σ kann es einzelne enge Calls geben (z.B. `code_mass` claim: 879 vs 827 mit σ ≈ 90 beidseitig → schwache Differenzierung; `cognitive_max` claim: 5.0 vs 4.8 → faktisch tie, Trophy nach Punktwert). Für Code-Komplexität (`mccabe_max`, `cc_longest_function`) führt CC weiterhin auf beiden Katas; bei `cognitive_max` kippt der Vorsprung zwischen den Katas — siehe F-harness.3.

---

## F-harness.1 — Korrektheit ist harness-invariant; CC × claim-office zeigt leichte Streuung

Alle vier Zellen liefern `verification_pct` nahe 1.0: drei Zellen erreichen 1.0 ± 0 (deterministisch perfekt), eine Zelle (CC × claim-office, n=8) liegt bei 0.96 ± 0.09 mit zwei Runs unterhalb (0.93 und 0.73, sonst 6/8 = 1.00). H1 (Korrektheit harness-invariant) ist im Rahmen der Messunsicherheit **bestätigt**. Die innere `tests_passing`-Sicht ist über alle 28 Runs durchgängig grün.

| kata | harness | n | verification_pct mean | min | max | σ |
|---|---|---:|---:|---:|---:|---:|
| claim-office-example-mapping | CC | 8 | 0.96 | 0.73 | 1.00 | 0.09 |
| claim-office-example-mapping | OC | 5 | **1.00** 🏆 | 1.00 | 1.00 | 0.00 |
| game-of-life-example-mapping | CC | 10 | **1.00** 🏆 | 1.00 | 1.00 | 0.00 |
| game-of-life-example-mapping | OC | 5 | **1.00** 🏆 | 1.00 | 1.00 | 0.00 |

Die zwei CC-claim-Runs mit verification < 1.0 trafen 11/15 bzw. 14/15 der externen Akzeptanz-Szenarien. Bei n=5 auf der OC-claim-Seite (alle 5/5 perfekt) vs 6/8 = 0.75 perfect-Rate auf der CC-claim-Seite verdichtet sich die Hypothese "OC trifft hier mit höherer Verlässlichkeit"; der Unterschied im Mittel bleibt aber bei 4 pp und das Konfidenzband auf der CC-Seite umfasst noch 1.00, also weiterhin kein statistisch belastbarer Harness-Vorteil für OC, sondern eine plausible Richtungs-Hypothese.

Methoden-Caveat: Ein erster Versuch mit `opus-4-7-portkey` (mit Thinking) zeigte auf der CC-Seite einen **premature-end-Glitch** (Claude Code beendete einen Run nach 8 von 38 Tests mit exit=0 ohne `experiment-done.txt`). Dieser Outlier wurde aus der RQ entfernt und ist in F-harness.4 als separater Befund festgehalten; die hier ausgewerteten 24 no-thinking-Runs sind frei von dieser Pathologie.

---

## F-harness.2 — Harness-Token-Footprint differenziert stark, in beide Richtungen abhängig von Kata-Größe

OC verbraucht in beiden Katas weniger Tokens und ist schneller als CC. Auf game-of-life ist der Effekt am größten (Faktor 3.4× Tokens, 0.82× Wallclock); auf claim-office bleibt der Effekt erkennbar (1.4× Tokens, 0.88× Wallclock), wird aber von der höheren Cycle-Anzahl und der breiteren OC-Streuung relativiert (σ liegt bei 53 % des Mittels). H2 (Token-Profil differenziert) ist **bestätigt** und der Effekt geht **konsistent zugunsten von OC**.

| kata | harness | n | total_tokens mean (Mio) | duration_s mean | Tokens/Cycle (gepoolt) |
|---|---|---:|---:|---:|---:|
| claim-office-example-mapping | CC | 8 | 44.4 (σ=3.4) | 2530 (σ=401) | ~1.19 Mio |
| claim-office-example-mapping | OC | 5 | **30.8** 🏆 (σ=16.3) | **2230** 🏆 (σ=952) | ~0.93 Mio |
| game-of-life-example-mapping | CC | 10 | 8.32 (σ=1.61) | 627 (σ=117) | ~0.98 Mio |
| game-of-life-example-mapping | OC | 5 | **2.44** 🏆 (σ=0.74) | **516** 🏆 (σ=196) | ~0.27 Mio |

Mechanistisch plausibel: OpenCode hat per Default einen kompakteren System-Prompt und weniger Auto-Tool-Choreographie als Claude Code. Der Footprint-Unterschied schlägt pro Cycle ~22 % auf claim-office und ~72 % auf game-of-life durch. Dass der relative Effekt auf der kleinen Kata so viel größer ist, deutet darauf hin, dass die OC-Einsparung primär aus *fixen* Overhead-Posten kommt (Boot-Prompt, Tool-Schema), nicht aus pro-Cycle-Reduktion. Die OC-claim-Verteilung ist breit (Range 13.7–57.1 Mio Tokens, σ ≈ 53 % vom Mittel): einzelne OC-Runs erreichen CC-Niveau, der typische Run liegt aber deutlich darunter.

---

## F-harness.3 — Code-Mass (APP) ist harness-invariant; mccabe/longest kippen zugunsten von CC, cognitive_max nicht mehr eindeutig

`code_mass` (APP-gewichtete Summe) und `lines_of_code` zeigen zwischen CC und OC innerhalb 1 σ keine belastbare Differenz — Mittelwerte liegen auf beiden Katas eng beieinander (claim: 879 vs 827 CC-OC; GOL: 153 vs 149). H3 (Code-Mass-Drift) **nicht bestätigt**.

Bei den **Komplexitätsmaßen** ergibt sich nach Erweiterung auf n=5 ein **kata-abhängiges** Bild:

- `mccabe_max` und `cc_longest_function` liegen CC weiterhin auf beiden Katas niedriger als OC — am deutlichsten auf game-of-life (CC `longest=12.2` vs OC `17.0`; CC `mccabe_max=4.2` vs OC `5.4`).
- `cognitive_max` ist auf claim-office faktisch ein Tie (5.0 CC vs 4.8 OC, σ ≈ 2 beidseitig), während CC auf game-of-life vorn liegt (4.3 vs 6.2).

Damit verschiebt sich die Lesart gegenüber der n=3-Vorversion: die Richtung "CC hält Komplexitätsspitzen niedriger" bleibt **plausibel auf mccabe und cc_longest_function**, ist aber bei `cognitive_max` auf claim-office **nicht reproduziert**. σ liegt für die OC-Zellen weiterhin in der Größenordnung der Mittelwert-Differenz, also weiterhin Richtungs-Hypothese, kein bestätigter Effekt.

| kata | harness | n | code_mass | cognitive_max | mccabe_max | cc_longest_function |
|---|---|---:|---:|---:|---:|---:|
| claim-office-example-mapping | CC | 8 | 879 (σ=91) | 5.0 (σ=1.8) | **4.5** 🏆 (σ=0.8) | **12.4** 🏆 (σ=1.4) |
| claim-office-example-mapping | OC | 5 | **827** 🏆 (σ=99) | **4.8** 🏆 (σ=3.0) | 4.8 (σ=1.8) | 15.0 (σ=7.0) |
| game-of-life-example-mapping | CC | 10 | 153 (σ=14) | **4.3** 🏆 (σ=2.8) | **4.2** 🏆 (σ=1.3) | **12.2** 🏆 (σ=6.9) |
| game-of-life-example-mapping | OC | 5 | **149** 🏆 (σ=12) | 6.2 (σ=2.6) | 5.4 (σ=2.0) | 17.0 (σ=5.2) |

Methoden-Hinweis: Der "OC produziert komplexere Spitzenfunktionen"-Befund (auf mccabe/longest) ist konsistent mit einem Subagent-Architektur-Artefakt. In OC ist Refactor als externer `task`-Subagent implementiert (isolierter Kontext); der Refactor-Agent sieht nur den Auftrag, nicht den vollen Konversationskontext und schreibt nach eigener Beobachtung im Run-Transcript "ahead" — d.h. er fügt mehr Code auf einmal hinzu als unter CC, wo der Refactor in dieselbe Session zurückkehrt. Mit n=5 auf der OC-Seite bleibt der Effekt sichtbar, aber `cognitive_max`-Tie auf claim-office zeigt, dass die Richtung nicht uniform über alle Komplexitäts-Surrogate gilt — eine umfangreichere OC-Stichprobe (n ≥ 8) wäre für eine architekturkausale Aussage weiterhin nötig.

---

## F-harness.4 — Claude-Code-Harness-Glitch: premature `end_turn` auf claim-office (Thinking-Variante)

Ein erster RQ-Lauf mit `opus-4-7-portkey` (Thinking-Variante) zeigte einen Run, der bei `exit_code=0`/`exit_reason=ok` nach nur 8 von 38 Tests beendete, ohne `experiment-done.txt` zu schreiben (`context_utilization_pct=12 %`, also kein Kontext-Limit; letzte Assistant-Aktion: "🟢 Green Phase Complete. Proceeding to Refactor phase."). Der Code blieb fragmentarisch — externe Verification scheiterte mit einem `TypeError` bei Inputs, deren Tests der Agent nie aktiviert hat (`verification_pct=0.13`).

| Variante | n vorhandene Runs | premature-end-Frequenz |
|---|---:|---:|
| `opus-4-7-portkey` (Thinking) auf CC × claim-office | 3 | 1/3 (n=3 zu klein für Quantifizierung) |
| `opus-4-7-portkey-no-thinking` auf CC × claim-office | 8 | 0/8 |
| `opus-4-7-portkey-no-thinking` auf CC × game-of-life | 10 | 0/10 |

In den 18 no-thinking-CC-Runs trat das Phänomen **nicht ein einziges Mal** auf. Das ist konsistent mit dem Memory-Hinweis `claude-code-premature-end-turn` und legt nahe, dass die Pathologie an die Thinking-Token-Verarbeitung im Claude-Code-Harness gekoppelt ist (möglicherweise: Thinking-Block wird als "end of intent" missinterpretiert). Da die RQ aktuell auf `no-thinking` läuft, ist der Effekt für die Vergleichsfindungen 1–3 nicht relevant. Für RQs, die Thinking als Faktor brauchen, ist er ein methodologischer Caveat.

---

## F-harness.5 — TDD-Disziplin ist harness-invariant; OC produziert weniger Refactor-Calls bei gleich hoher Prediction-Rate

Alle drei TDD-Disziplin-Metriken (`cycle_count`, `refactorings_applied`, `predictions_correct_rate`) lassen sich nach Nachzug von `analyze_transcript.py` (Whitespace-getrennter Prediction-Trenner im OC-`red`-Skill-Output, siehe Code-Kommentar) für CC und OC vergleichbar erheben. Damit ist H4 ("`predictions_correct_rate` harness-invariant") **bestätigt**: beide Harnesse erreichen 97–100 % Prediction-Korrektheit über die jeweilige Pool-Basis.

| kata | harness | n | cycle_count mean | refactorings_applied mean | predictions_correct / total (gepoolt) |
|---|---|---:|---:|---:|---|
| claim-office-example-mapping | CC | 8 | 37.4 (σ=1.6) | **24.9** 🏆 (σ=6.9) | 582 / 599 (97.2 %) |
| claim-office-example-mapping | OC | 5 | 33.0 (σ=10.7) | 19.0 (σ=11.4) | **255 / 256 (99.6 %)** 🏆 |
| game-of-life-example-mapping | CC | 10 | 8.5 (σ=1.4) | **7.9** 🏆 (σ=1.9) | **170 / 170 (100 %)** 🏆 |
| game-of-life-example-mapping | OC | 5 | 9.2 (σ=0.8) | 5.0 (σ=2.8) | **86 / 86 (100 %)** 🏆 |

Drei beobachtbare Effekte:

1. **`refactorings_applied`**: CC zählt mehr Refactor-Invocations als OC (claim: 24.9 vs 19.0; GOL: 7.9 vs 5.0). Auf claim-office ist die OC-σ allerdings groß (σ=11.4, Range 7–37), d.h. einzelne OC-Runs nähern sich dem CC-Niveau. Konsistent mit dem im OC-Transcript dokumentierten "der Refactor-Agent schreibt vor"-Pattern: OC verteilt Implementations-Arbeit auf weniger, aber inhaltlich größere Refactor-Aufrufe — mit hoher Run-zu-Run-Varianz.
2. **`cycle_count`**-Streuung auf claim-office × OC: σ=10.7 (Range 14–40) bei n=5, getrieben durch denselben "refactor-vorschreiben"-Mechanismus — manche Runs erreichen mit deutlich weniger Cycles dieselbe Test-Anzahl.
3. **`predictions_correct_rate`**: OC trifft auf claim-office sogar etwas zuverlässiger als CC (99.6 % vs 97.2 % bei 256 vs 599 Predictions), auf game-of-life liegen beide bei 100 %. Da Predictions ein Selbstreport sind und kein extern überprüfter Faktor, ist die 2-pp-Differenz nicht als "OC ist besser" zu lesen, sondern als "kein Harness-Effekt auf die self-reported Disziplin".

Parser-Historie: bis Mai 2026 enthielt `analyze_transcript.py` nur eine Regex, die einen `-`/`✅`/`❌`/`.`/`:`-Trenner vor `Correct`/`Incorrect` verlangte. CC-Outputs (✅-Variante) wurden erfasst, OC-Outputs ohne expliziten Trenner (`Compiles successfully Correct`) nicht. Die ergänzende, zeilenanker-basierte Regex (`^...(Compilation|Runtime) Prediction:...(Correct|Incorrect)$`) deckt jetzt beide Formate ab; CC-Pool-Werte bleiben dabei stabil (Drift −1/769, durch saubereren Line-Dedup auf einer Edge-Case-Zeile, kein Methoden-Schiff).
