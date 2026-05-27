# RQ-harness — Findings

## Übersicht

Pivot über die sechs Zellen (Kata × Harness). Alle Zellen: `model=opus-4-7-portkey-no-thinking`, `prompt=example-mapping`, `workflow=v6.2-with-why-cleaned{,-oc,-pi}`.

| Outcome | Richtung | CC × claim (n=8) | OC × claim (n=5) | pi × claim (n=5) | CC × GOL (n=10) | OC × GOL (n=5) | pi × GOL (n=5) |
|---|---|---|---|---|---|---|---|
| `verification_pct` (mean ± σ) | höher = besser | 0.96 ± 0.09 | **1.00** 🏆 ± 0 | **1.00** 🏆 ± 0 | **1.00** 🏆 ± 0 | **1.00** 🏆 ± 0 | **1.00** 🏆 ± 0 |
| `tests_passing` (rate) | höher = besser | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `total_tokens` (mean, Mio, **inkl. cache**) | nicht vergleichbar | 44.4 | 30.8 | 1.97 | 8.32 | 2.44 | 0.29 |
| `input+output` (mean, k Tokens, **ohne cache**) | kleiner = besser | **161** 🏆 | 468 | 1971 | **36** 🏆 | 156 | 287 |
| `cost_usd` (mean, Opus-4-7-Listpreis) | kleiner = besser | $30.47 | $18.80 | **$11.20** 🏆 | $6.22 | $2.26 | **$1.65** 🏆 |
| `duration_seconds` (mean) | kleiner = besser | 2530 ± 401 | 2230 ± 952 | **1647** 🏆 ± 205 | 627 ± 117 | 516 ± 196 | **317** 🏆 ± 43 |
| `code_mass` (APP, mean) | kleiner = besser | 879 ± 91 | 827 ± 99 | **807** 🏆 ± 16 | 153 ± 14 | **149** 🏆 ± 12 | 158 ± 13 |
| `lines_of_code` (mean) | kleiner = besser | **255** 🏆 ± 43 | 271 ± 44 | 266 ± 39 | 41 ± 7 | **39** 🏆 ± 5 | 43 ± 7 |
| `cognitive_max` (mean) | kleiner = besser | 5.0 ± 1.8 | 4.8 ± 3.0 | **4.2** 🏆 ± 1.6 | **4.3** 🏆 ± 2.8 | 6.2 ± 2.6 | 7.6 ± 3.1 |
| `mccabe_max` (mean) | kleiner = besser | 4.5 ± 0.8 | 4.8 ± 1.8 | **4.0** 🏆 ± 0 | **4.2** 🏆 ± 1.3 | 5.4 ± 2.0 | 6.0 ± 2.6 |
| `cc_longest_function` (mean) | kleiner = besser | **12.4** 🏆 ± 1.4 | 15.0 ± 7.0 | 14.6 ± 1.7 | **12.2** 🏆 ± 6.9 | 17.0 ± 5.2 | 18.2 ± 5.3 |
| `smell_total` (mean) | kleiner = besser | 0.38 ± 0.74 | **0.20** 🏆 ± 0.45 | **0.20** 🏆 ± 0.45 | **2.40** 🏆 ± 0.52 | **2.20** 🏆 ± 0.45 | 2.40 ± 0.89 |
| `cycle_count` (mean) | kontextabhängig | 37.4 ± 1.6 | 33.0 ± 10.7 | 56.2 ± 10.9 | 8.5 ± 1.4 | 9.2 ± 0.8 | 8.8 ± 1.5 |
| `refactorings_applied` (mean) | höher = besser | **24.9** 🏆 ± 6.9 | 19.0 ± 11.4 | 16.8 ± 2.8 | **7.9** 🏆 ± 1.9 | 5.0 ± 2.8 | 3.0 ± 0.7 |
| `predictions_correct_rate` (gepoolt) | höher = besser | 97.2 % (599 obs) | **99.6 %** 🏆 (256) | 99.4 % (167) | **100 %** 🏆 (170) | **100 %** 🏆 (86) | 95.9 % (49) |

**Wichtige Mess-Konvention:** `total_tokens` ist über die drei Harnesse **nicht direkt vergleichbar**, weil CC und OC aggressiv Prompt-Cache-Reads in `cache_read` zählen (40+ Mio pro Run), pi (Portkey-`openai-completions`-Pfad) liefert `cache_read=0` über alle Runs. Der vergleichbare Effizienz-Proxy ist `input + output` (Cache-bereinigt) — siehe F-harness.2. Trophy auf `total_tokens` darum unterdrückt; Trophy auf `input+output` zeigt das tatsächliche Footprint-Ranking.

Trophy-Vergabe sonst: alle sechs Zellen erfüllen die Korrektheits-Gating-Regel (`verification_pct ≥ 0.95`), darum auch Effizienz- und Qualitätsmetriken bewertbar. Symbol `🏆` markiert besten Mittelwert pro Zeile; bei Spread innerhalb ≈1 σ kann es einzelne enge Calls geben (z.B. `code_mass` claim: 879 vs 827 vs 807 mit σ ≈ 90 → schwache Differenzierung; `smell_total` GOL: alle drei bei 2.2–2.4 → Trophy an OC nach Punktwert, faktisch tie).

---

## F-harness.1 — Korrektheit ist harness-invariant; CC × claim-office zeigt leichte Streuung

Fünf von sechs Zellen liefern `verification_pct` deterministisch perfekt (1.0 ± 0). Eine Zelle (CC × claim-office, n=8) liegt bei 0.96 ± 0.09 mit zwei Runs unterhalb (0.93 und 0.73, sonst 6/8 = 1.00). H1 (Korrektheit harness-invariant) ist im Rahmen der Messunsicherheit **bestätigt** über alle drei Harnesse. Die innere `tests_passing`-Sicht ist über alle 38 Runs durchgängig grün.

| kata | harness | n | verification_pct mean | min | max | σ | perfect-rate (1.00/n) |
|---|---|---:|---:|---:|---:|---:|---|
| claim-office-example-mapping | CC | 8 | 0.96 | 0.73 | 1.00 | 0.09 | 6/8 |
| claim-office-example-mapping | OC | 5 | **1.00** 🏆 | 1.00 | 1.00 | 0.00 | 5/5 |
| claim-office-example-mapping | pi | 5 | **1.00** 🏆 | 1.00 | 1.00 | 0.00 | 5/5 |
| game-of-life-example-mapping | CC | 10 | **1.00** 🏆 | 1.00 | 1.00 | 0.00 | 10/10 |
| game-of-life-example-mapping | OC | 5 | **1.00** 🏆 | 1.00 | 1.00 | 0.00 | 5/5 |
| game-of-life-example-mapping | pi | 5 | **1.00** 🏆 | 1.00 | 1.00 | 0.00 | 5/5 |

Die zwei CC-claim-Runs mit verification < 1.0 trafen 11/15 bzw. 14/15 der externen Akzeptanz-Szenarien. Bei n=5 auf der OC- und pi-claim-Seite (jeweils 5/5 perfekt) gegen 6/8 = 0.75 perfect-Rate auf der CC-claim-Seite verdichtet sich die Hypothese "OC und pi treffen hier mit höherer Verlässlichkeit"; der Unterschied im Mittel bleibt aber bei 4 pp und das Konfidenzband auf der CC-Seite umfasst noch 1.00, also weiterhin kein statistisch belastbarer Harness-Vorteil, sondern eine plausible Richtungs-Hypothese.

Methoden-Caveat: Ein erster CC-Versuch mit `opus-4-7-portkey` (mit Thinking) zeigte einen **premature-end-Glitch** (siehe F-harness.4). Die hier ausgewerteten no-thinking-Runs sind frei von dieser Pathologie auf allen drei Harnessen.

---

## F-harness.2 — Token-Footprint und Listpreis-Kosten: pi ist die günstigste Variante

Drei Mess-Schichten, die nicht alle in dieselbe Richtung zeigen:

| kata | harness | n | input+output mean (k) | total_tokens mean (Mio, inkl. cache) | cache_read mean (Mio) | cost_usd mean | duration_s mean |
|---|---|---:|---:|---:|---:|---:|---:|
| claim-office-example-mapping | CC | 8 | **161** 🏆 | 44.4 | ~44.2 | $30.47 (σ=2.23) | 2530 (σ=401) |
| claim-office-example-mapping | OC | 5 | 468 | 30.8 | ~30.3 | $18.80 (σ=9.12) | 2230 (σ=952) |
| claim-office-example-mapping | pi | 5 | 1971 | 1.97 | 0 | **$11.20** 🏆 (σ=1.99) | **1647** 🏆 (σ=205) |
| game-of-life-example-mapping | CC | 10 | **36** 🏆 | 8.32 | ~8.28 | $6.22 (σ=1.00) | 627 (σ=117) |
| game-of-life-example-mapping | OC | 5 | 156 | 2.44 | ~2.28 | $2.26 (σ=0.55) | 516 (σ=196) |
| game-of-life-example-mapping | pi | 5 | 287 | 0.29 | 0 | **$1.65** 🏆 (σ=0.45) | **317** 🏆 (σ=43) |

`cost_usd` ist eine **Listpreis-Schätzung** (Opus 4.7: $5/M input, $25/M output, $0.50/M cache_read, $6.25/M cache_write) — siehe `experiments/compute-cost.py` und `research/model-pricing.md`. Portkey-Workspace-Tarife können abweichen.

Vier Befunde, die sich nicht alle in dieselbe Richtung erklären lassen:

1. **Listpreis-Kosten: pi < OC < CC**, monoton über beide Katas. pi ist auf claim-office mit $11.20 nur ~37 % der CC-Kosten ($30.47), auf game-of-life mit $1.65 sogar nur ~27 % der CC-Kosten ($6.22). OC liegt jeweils dazwischen ($18.80 / $2.26).
2. **Cache-bereinigter Input/Output-Aufwand kehrt das Ranking um: CC < OC < pi.** Auf claim-office liegt pi bei ~12× CC, OC bei ~3× CC; auf game-of-life bei ~8× CC vs ~4× CC. Mechanistische Erklärung: pi spawnt für jeden Refactor-Subagent einen eigenen pi-Prozess, der den ganzen Workflow-Kontext (Skills + Test-File + Implementation-File + AGENTS.md) frisch lädt — keine Provider-Session-Wiederverwendung. CC's `Task`-Tool und OC's `task`-Tool teilen die Provider-History besser.
3. **Provider-Caching erklärt die Differenz zwischen Befund 1 und Befund 2.** Anthropic billt cache_read mit nur 10 % des Input-Preises ($0.50 vs $5.00 pro 1M Token). CC × claim-office liest 44.2 Mio Cache-Tokens — bei $0.50/M sind das allein ~$22 nur für Cache-Reads. pi via Portkey-`openai-completions`-Pfad bekommt diese Caching-Rabatte gar nicht (cache_read=0 in allen Runs), zahlt dafür aber jedes Input-Token zum vollen Tarif. Cache-bereinigt ist pi ineffizienter; mit Cache-Tarif gerechnet ist pi günstiger.
4. **Wallclock auch zugunsten pi: pi < OC < CC.** Auf claim-office: 27 min (pi) vs 37 min (OC) vs 42 min (CC); auf game-of-life: 5 min vs 9 min vs 10 min. pi profitiert davon, dass Subagent-Prozesse keine Konversations-Synchronisation mit dem Hauptlauf brauchen und durchgehend streamen können.

H2 (Token-Profil differenziert) ist **bestätigt**, aber die Antwort hängt von der Mess-Schicht ab:

- "Welcher Harness brennt das Modell am meisten an?" → CC (cache-bereinigt am sparsamsten, Modell macht weniger frische Inputs).
- "Welcher Harness ist am teuersten in $?" → CC (die Cache-Last summiert sich trotz Rabatt).
- "Welcher Harness ist am schnellsten?" → pi (Subagent-Parallelität).
- "Welcher Harness ist beim Standardziel 'günstig und schnell' am besten?" → pi, mit deutlichem Vorsprung in beiden Dimensionen.

Caveat: Wenn ein Portkey-Workspace-Tarif Cache nicht zum Anthropic-Listpreis abrechnet, kann der CC-Kostenvorteil aus Cache schrumpfen oder verschwinden. Die hier gezeigten cost_usd-Werte sind die Listpreis-Baseline.

**Pi-Caching-Sondersituation (Stand 2026-05-27):** Pi unterstützt Anthropic-Prompt-Caching technisch (Config `api: "anthropic-messages"` + `baseUrl: "https://api.portkey.ai"` + Portkey-Provider-Header) — Cache-Write wurde mit ~3 k cache_creation Tokens verifiziert. Cache-**Read** schlägt aber konsistent fehl: Portkey strippt beim Routing zu Vertex-AI-Anthropic-Modellen die `cache_control`-Marker, was sich in cache_read=0 auf identischen Folgecalls äußert. Bekanntes offenes Issue: [Portkey-AI/gateway #1579](https://github.com/Portkey-AI/gateway/issues/1579) (gefiled 2026-03-25, kein PR). CC und OC sind nicht betroffen, weil sie nicht den Anthropic-`/v1/messages`-Pfad nutzen, sondern direkte API-Endpoints mit `ANTHROPIC_CUSTOM_HEADERS`. Damit ist die pi-Token/Cost-Lage in dieser RQ ein Gemisch aus echter Subagent-Architektur-Effekte und gateway-Caching-Bug. Wenn Portkey #1579 behoben wird, ist eine Re-Messung der pi-Zellen angezeigt — pi-cost würde wahrscheinlich um Faktor 5–10 fallen.

---

## F-harness.3 — Code-Mass (APP) ist harness-invariant; mccabe/longest/cognitive variieren kata-abhängig

`code_mass` (APP-gewichtete Summe) und `lines_of_code` zeigen über alle drei Harnesse innerhalb 1 σ keine belastbare Differenz — Mittelwerte liegen auf beiden Katas eng beieinander (claim: 879/827/807 für CC/OC/pi; GOL: 153/149/158). H3 (Code-Mass-Drift) **nicht bestätigt** — der erweiterte Vergleich auf drei Harnesse macht das nochmal robuster.

Bei den **Komplexitätsmaßen** ergibt sich ein **kata-abhängiges, aber neu-strukturiertes** Bild gegen die n=3-Vorversion:

- `mccabe_max`: pi auf claim-office bemerkenswert eng (alle 5 Runs exakt 4.0, σ=0). CC zweiter (4.5), OC dritter (4.8). Auf game-of-life kehrt sich das um: CC vorn (4.2), pi schlechter (6.0).
- `cc_longest_function`: CC führt auf beiden Katas (12.4 claim / 12.2 GOL), pi und OC liegen 2–6 Punkte höher mit großer σ.
- `cognitive_max`: gemischt. Auf claim-office pi am niedrigsten (4.2 vs 5.0/4.8); auf game-of-life kehrt es sich um (CC 4.3 vs pi 7.6).

| kata | harness | n | code_mass | cognitive_max | mccabe_max | cc_longest_function |
|---|---|---:|---:|---:|---:|---:|
| claim-office-example-mapping | CC | 8 | 879 (σ=91) | 5.0 (σ=1.8) | 4.5 (σ=0.8) | **12.4** 🏆 (σ=1.4) |
| claim-office-example-mapping | OC | 5 | 827 (σ=99) | 4.8 (σ=3.0) | 4.8 (σ=1.8) | 15.0 (σ=7.0) |
| claim-office-example-mapping | pi | 5 | **807** 🏆 (σ=16) | **4.2** 🏆 (σ=1.6) | **4.0** 🏆 (σ=0) | 14.6 (σ=1.7) |
| game-of-life-example-mapping | CC | 10 | 153 (σ=14) | **4.3** 🏆 (σ=2.8) | **4.2** 🏆 (σ=1.3) | **12.2** 🏆 (σ=6.9) |
| game-of-life-example-mapping | OC | 5 | **149** 🏆 (σ=12) | 6.2 (σ=2.6) | 5.4 (σ=2.0) | 17.0 (σ=5.2) |
| game-of-life-example-mapping | pi | 5 | 158 (σ=13) | 7.6 (σ=3.1) | 6.0 (σ=2.6) | 18.2 (σ=5.3) |

Mechanistisch konsistent: Der Refactor-Subagent auf OC und pi sieht nur Auftrag + Test/Impl-File, nicht den vollen Konversationsverlauf. Auf der kleineren game-of-life-Kata führt das offenbar zu konzentrierterem, aber komplexerem Code pro Refactor-Schritt (höhere Spitzen-Komplexität). Auf claim-office ist pi mit `mccabe_max=4.0` für alle 5 Runs sehr stabil — möglicherweise weil die größere Kata den Subagent zwingt, die Logik aufzubrechen statt in eine einzelne Funktion zu konzentrieren, oder weil pi-Subagent-Prozesse durchgehend "frisches" Refactoring machen.

Richtung gegen die n=3-Vorversion: "CC hält Komplexitätsspitzen niedriger" bleibt **plausibel auf game-of-life**, ist auf claim-office aber **gekippt** — pi liegt dort bei den drei Spitzen-Komplexitätsmaßen entweder vorn oder gleichauf.

---

## F-harness.4 — Claude-Code-Harness-Glitch: premature `end_turn` auf claim-office (Thinking-Variante)

Ein erster RQ-Lauf mit `opus-4-7-portkey` (Thinking-Variante) zeigte einen Run, der bei `exit_code=0`/`exit_reason=ok` nach nur 8 von 38 Tests beendete, ohne `experiment-done.txt` zu schreiben (`context_utilization_pct=12 %`, also kein Kontext-Limit; letzte Assistant-Aktion: "🟢 Green Phase Complete. Proceeding to Refactor phase."). Der Code blieb fragmentarisch — externe Verification scheiterte mit einem `TypeError` bei Inputs, deren Tests der Agent nie aktiviert hat (`verification_pct=0.13`).

| Variante | n vorhandene Runs | premature-end-Frequenz |
|---|---:|---:|
| `opus-4-7-portkey` (Thinking) auf CC × claim-office | 3 | 1/3 (n=3 zu klein für Quantifizierung) |
| `opus-4-7-portkey-no-thinking` auf CC × claim-office | 8 | 0/8 |
| `opus-4-7-portkey-no-thinking` auf CC × game-of-life | 10 | 0/10 |

In den 18 no-thinking-CC-Runs trat das Phänomen **nicht ein einziges Mal** auf, ebenso wenig in den 20 OC/pi-Runs. Das ist konsistent mit dem Memory-Hinweis `claude-code-premature-end-turn` und legt nahe, dass die Pathologie an die Thinking-Token-Verarbeitung im Claude-Code-Harness gekoppelt ist (möglicherweise: Thinking-Block wird als "end of intent" missinterpretiert). Da die RQ aktuell auf `no-thinking` läuft, ist der Effekt für die Vergleichsfindungen 1–3, 5–6 nicht relevant. Für RQs, die Thinking als Faktor brauchen, ist er ein methodologischer Caveat.

---

## F-harness.5 — TDD-Disziplin ist harness-invariant; Refactor-Häufigkeit fällt CC → OC → pi monoton ab

Alle drei TDD-Disziplin-Metriken (`cycle_count`, `refactorings_applied`, `predictions_correct_rate`) lassen sich nach Parser-Erweiterungen (OC: Whitespace-Trenner-Regex; pi: Text-Marker-Fallback weil Skills auf pi Auto-Load-Dokumente sind) für alle drei Harnesse vergleichbar erheben. Damit ist H4 ("`predictions_correct_rate` harness-invariant") **bestätigt**: alle drei Harnesse erreichen 96–100 % Prediction-Korrektheit über die jeweilige Pool-Basis.

| kata | harness | n | cycle_count mean | refactorings_applied mean | predictions_correct / total (gepoolt) |
|---|---|---:|---:|---:|---|
| claim-office-example-mapping | CC | 8 | 37.4 (σ=1.6) | **24.9** 🏆 (σ=6.9) | 582 / 599 (97.2 %) |
| claim-office-example-mapping | OC | 5 | 33.0 (σ=10.7) | 19.0 (σ=11.4) | **255 / 256 (99.6 %)** 🏆 |
| claim-office-example-mapping | pi | 5 | 56.2 (σ=10.9) | 16.8 (σ=2.8) | 166 / 167 (99.4 %) |
| game-of-life-example-mapping | CC | 10 | 8.5 (σ=1.4) | **7.9** 🏆 (σ=1.9) | **170 / 170 (100 %)** 🏆 |
| game-of-life-example-mapping | OC | 5 | 9.2 (σ=0.8) | 5.0 (σ=2.8) | **86 / 86 (100 %)** 🏆 |
| game-of-life-example-mapping | pi | 5 | 8.8 (σ=1.5) | 3.0 (σ=0.7) | 47 / 49 (95.9 %) |

Drei beobachtbare Effekte:

1. **`refactorings_applied`** zeigt ein **monotones Ranking CC > OC > pi** auf beiden Katas. Auf claim-office: 24.9 → 19.0 → 16.8; auf game-of-life: 7.9 → 5.0 → 3.0. pi ist auf game-of-life mit 3.0 ± 0.7 sehr eng — der Refactor-Subagent wird systematisch weniger oft aufgerufen. Mechanistisch konsistent mit F-harness.2: pi's Subagent-Spawn ist teuer (eigener Prozess pro Aufruf, voller Kontext-Reload), darum bündelt das Modell vermutlich Refactor-Arbeit oder überspringt sie häufiger als bei den günstigeren CC/OC-Mechanismen.
2. **`cycle_count` auf claim-office × pi**: 56.2 (σ=10.9) gegen ~37 (CC) und 33 (OC). pi macht auf claim-office **systematisch mehr Red-Phase-Cycles als CC/OC** — siehe F-harness.6 für Erklärung.
3. **`predictions_correct_rate`** liegt für alle drei Harnesse bei 96–100 %. Da Predictions ein Selbstreport sind und kein extern überprüfter Faktor, ist die Differenz zwischen 97.2 % (CC claim) und 99.4–99.6 % (OC/pi claim) nicht als "OC/pi ist disziplinierter" zu lesen, sondern als "kein harness-strukturierter Einfluss auf die self-reported Disziplin".

Parser-Historie: bis Mai 2026 enthielt `analyze_transcript.py` nur eine Regex für ein `-`/`✅`/`❌`/`.`/`:`-Trenner-Pattern. Erweiterung Mai 2026: Whitespace-getrennte Variante für OC; Text-Marker-Fallback (`## Red`/`## Green`-Header) für pi, weil pi-Skills Auto-Load-Dokumente sind und nicht als Tool-Calls in den Event-Stream geschrieben werden. CC-Pool-Werte sind über alle Parser-Iterationen stabil.

---

## F-harness.6 — Pi-Cycle-Inflation auf claim-office: deutlich mehr Red-Marker als CC/OC bei gleicher Test-Anzahl

Auf claim-office × pi liegt `cycle_count` bei 56.2 (σ=10.9, Range 41–66), während CC bei 37.4 (σ=1.6) und OC bei 33.0 (σ=10.7) liegt — und das **bei vergleichbarer Anzahl tatsächlich aktiver Tests** (CC 37.25 ± 1.67; OC 38.2 ± 2.17; pi 38.2 ± 3.96). Auf game-of-life ist der Effekt nicht da (alle drei bei 8.5–9.2 Cycles).

| kata | harness | n | tests_total mean | cycle_count mean | cycles per test |
|---|---|---:|---:|---:|---:|
| claim-office-example-mapping | CC | 8 | 37.25 | 37.38 | ~1.00 |
| claim-office-example-mapping | OC | 5 | 38.20 | 33.00 | ~0.86 |
| claim-office-example-mapping | pi | 5 | 38.20 | **56.20** | **~1.47** |
| game-of-life-example-mapping | CC | 10 | 8.50 | 8.50 | ~1.00 |
| game-of-life-example-mapping | OC | 5 | 9.20 | 9.20 | ~1.00 |
| game-of-life-example-mapping | pi | 5 | 8.40 | 8.80 | ~1.05 |

Auf claim-office produziert pi pro Test im Schnitt **1.47 Red-Marker** — das Modell aktiviert Tests mehrfach (z.B. revidiert Predictions nach erstem Failure, schreibt zweite `## Red`-Sektion mit korrigierter Erwartung) oder splittet einen logischen Test in mehrere `## Red`-Phasen auf. Auf game-of-life passiert das nicht.

Mechanistisch zwei mögliche Erklärungen, ohne dass die Daten zwischen ihnen unterscheiden:

1. **AGENTS.md-Marker-Pflicht-Artefakt**: Die pi-`AGENTS.md` erzwingt `## Red` als Marker pro Phase, mit hoher Strenge ("MISSING OUTPUT MARKERS — The most critical failure mode on pi"). Bei einer ambigen Spec wie claim-office könnte das dazu führen, dass das Modell beim Auftauchen einer Klärungsfrage einen zweiten `## Red`-Block zur selben Test-Aktivierung schreibt, statt die Klärung inline zu machen.
2. **Größere Kata triggert mehr Re-Predictions**: claim-office ist deutlich größer (38 Tests, ~300 LoC) als game-of-life (8 Tests, ~40 LoC). Bei der größeren Test-Liste mit Inter-Test-Abhängigkeiten könnte pi öfter Predictions zurückziehen und neu anlaufen.

Konsequenz für die Auswertung: `cycle_count` bei pi-claim ist **nicht direkt vergleichbar** mit CC/OC ohne Normierung auf `cycles_per_test`. Die Markdown-Strict-Konvention der pi-AGENTS.md (siehe Memory `pi-harness-integration`) ist Teil der Harness-Mechanik und kann nicht ohne Workflow-Re-Design entfernt werden — der Cycle-Inflation-Effekt ist also ein **echter Harness-Effekt**, kein Mess-Artefakt.

`refactorings_applied` ist von dieser Inflation **nicht** betroffen (16.8 ± 2.8 auf pi-claim ist kongruent zur Tendenz aus F-harness.5: pi ruft Refactor seltener, nicht häufiger). Das stützt These 1: die Inflation entsteht in Red-Phase-Markierung, nicht in tatsächlicher TDD-Aktivität.
