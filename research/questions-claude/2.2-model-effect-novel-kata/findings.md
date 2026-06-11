# RQ-model-novel Findings

Modell-Vergleich Fable 5 vs opus-4-8-no-thinking vs opus-4-7-no-thinking vs opus-4-6-portkey-no-thinking (jeweils no-thinking) auf `claim-office-example-mapping × v4-exact-subagents`.

## Übersicht

Primär-Outcome `verification_pct` (Korrektheit außen, höher = besser); sekundär Code-Qualität (`cognitive_max`/`mccabe_max`/`smell_total`/`cc_longest_function`, kleiner = besser) und Kosten (`total_tokens`/`duration_seconds`, kleiner = besser).

| Modell | n | verification_pct ↑ | σ | cognitive_max ↓ | mccabe_max ↓ | smell_total ↓ | total_tokens ↓ | duration_s ↓ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| fable-5-no-thinking | 5 | 0.83 | 0.10 | (4.0) | (4.2) | (0.2) | **13.4 M** 🏆 | 7826 |
| opus-4-8-no-thinking | 5 | **0.92** 🏆 | 0.09 | **7.4** 🏆 | **7.0** 🏆 | **1.2** 🏆 | 31.0 M | 5264 |
| opus-4-7-no-thinking | 10 | 0.67 | 0.36 | 10.5 | 7.9 | 1.8 | 13.7 M | **3693** 🏆 |
| opus-4-6-portkey-no-thinking | 5 | **0.93** 🏆 | 0.08 | 22.2 | 10.6 | 5.6 | 15.1 M | 4416 |

`verification_pct`: 4-6 (0.93) und 4-8 (0.92) sind innerhalb 0.1 σ ununterscheidbar → beide 🏆; fable-5 (0.83) liegt im Mittelfeld, 4-7 (0.67) fällt klar ab. **Korrektheits-Gating der Qualitäts-Pokale:** Die Qualitäts-Pokale gehen an opus-4-8, weil es als hoch-korrektes Modell (0.92, alle Runs ≥ 12/15, Runs bis 15/15) echte Vollimplementierungen liefert. fable-5 hat zwar die **niedrigsten Rohwerte aller Modelle** auf jeder Qualitäts-Metrik (cognitive 4.0, mccabe 4.2, smell 0.2 — rund ein Fünftel von opus-4-6), bekommt aber **bewusst keinen Qualitäts-Pokal** — bei 0.83 Korrektheit (max 14/15, **nie eine Vollimplementierung**) wäre niedrige Komplexität als Pokal irreführend, dieselbe Gating-Logik wie bei opus-4-7. Die Klammerwerte markieren genau das: führende Zahlen ohne volle Korrektheits-Deckung. opus-4-7s niedrigere Komplexität wäre als Pokal ebenso irreführend — seine bimodale Verteilung (Runs bis 3/15) drückt die Komplexität teils durch *unvollständige* Implementierungen, nicht durch Sparsamkeit.

**Kosten-Pokale (nicht korrektheits-gegated, aber mit Vorsicht):** Der `total_tokens`-Pokal geht an fable-5 (13.4 M, knapp vor 4-7s 13.7 M) — fable-5 ist das günstigste Modell *und* liefert dabei 0.83 Korrektheit (vs. 4-7s 0.67), also kein reiner Spar-durch-Abbruch-Effekt. Der `duration_s`-Pokal bleibt bei 4-7 (3693 s); fable-5 ist mit 7826 s am langsamsten, teils inflationiert durch Rate-Limit-Backoff in zwei Runs (ein Timeout). 4-7s Token-Wert ist wie gehabt mit Vorsicht zu lesen (niedrige Kosten bei teils abgebrochener Spec).

## F-model-novel.1 — opus-4-8 und opus-4-6 lösen claim-office zuverlässig, fable-5 im Mittelfeld, opus-4-7 nicht

Auf v4-exact-subagents erreichen **opus-4-8 (0.92, σ 0.09)** und **opus-4-6 (0.93, σ 0.08)** nahezu identische, hohe Korrektheit mit enger Streuung. opus-4-7 liegt mit 0.67 (σ 0.36) deutlich darunter und ist bimodal verteilt (4 perfekte Runs, 6 zwischen 0.20–0.87). fable-5 liegt mit 0.83 (σ 0.10, n=5) dazwischen — über 4-7, aber unter den beiden Spitzen-Modellen, mit moderater Streuung (0.73–0.93) und ohne 4-7s Totalausfälle. Alle opus-4-8- und opus-4-6-Runs liegen ≥ 0.80, mit Runs bis 15/15; fable-5 erreicht max 14/15 und **nie eine Vollimplementierung**, opus-4-7 hat kein vergleichbar konsistentes hohes Cluster.

Die naive Erwartung "neueres Modell = monoton besser" trägt nicht: nicht das mittlere Modell (4-7) liegt vorne, sondern die beiden Ränder (4-6 und 4-8). opus-4-7 ist auf dieser novel Kata mit v4 das schwächste der Opus-Modelle — konsistent mit der RQ-regression-Beobachtung, dass v4 ohne erzwungene Test-Listen-Vollständigkeit auf opus-4-7 ganze Spec-Operationen verlieren kann (Mechanismus siehe F-model-novel.4). **fable-5 (0.83)** reiht sich nicht oben ein: trotz neuester Generation erreicht es nicht die Spec-Treue von 4-6/4-8 (nie 15/15), sondern liegt im Mittelfeld zwischen 4-7 und den beiden Spitzen-Modellen — der Profil-Grund (sauberster Code, aber konsistent ein paar Spec-Punkte fehlend) siehe F-model-novel.6.

opus-4-8 schließt die Frage, ob die hohe 4-6-Korrektheit nur konservatives Parsen war: das neueste Modell erreicht dieselbe Korrektheit, ohne den Qualitäts-Preis zu zahlen (siehe F-model-novel.5). Damit ist die 4-6-Stärke auf claim-office reproduzierbar als "Spec-Treue", nicht als Routing- oder Generations-Artefakt.

Einschränkung: opus-4-6 läuft über Portkey (n=5, davon 4 innerhalb Budget — ein Timeout), opus-4-7 und opus-4-8 über die native API (n=10 bzw. n=5). Routing-Unterschied bleibt ein potenzieller Confound zwischen 4-6 und den beiden nativen Modellen; zwischen 4-7 und 4-8 (beide nativ) besteht er nicht.

## F-model-novel.2 — Workflow×Modell-Interaktion ist der dominierende Effekt

Der Befund "opus-4-6 ≈ opus-4-8 ≫ opus-4-7" gilt nur für v4-exact-subagents. Für opus-4-6 und opus-4-7 kehrt sich das Bild auf v6-hybrid um:

| Workflow | opus-4-7 vpct (n) | opus-4-6 vpct (n) |
|---|---:|---:|
| v4-exact-subagents | 0.67 (10) | **0.93** 🏆 (5) |
| v5-exact-single-context | 0.87 (10) | 0.87 (5) |
| v6-hybrid | **1.00** 🏆 (5) | 0.68 (15) |

Weder "opus-4-7 ist besser" noch "opus-4-6 ist besser" ist eine haltbare Aussage — **der Workflow bestimmt, welches Modell vorne liegt**. v5 ist modell-unabhängig konstant (0.87). Model-Vergleiche ohne Workflow-Kontrolle sind auf novel Katas nicht generalisierbar.

Mechanismus: v6-hybrid delegiert Orchestrierung an das Modell (Skill-Invocation im shared Context) — opus-4-7 beherrscht das, opus-4-6 verliert in ~40 % der Runs die Claim-Hälfte der Spec (implementiert nur Quote, `claim`-Operation komplett ignoriert, trotzdem `tests_passing=true` weil die internen Tests nur Quote abdecken). v4 gibt jeder Phase einen expliziten Subagent-Prompt — opus-4-6 profitiert von dieser Struktur.

opus-4-8 ist bisher nur auf v4 erhoben; ob es die Workflow-Sensitivität von 4-6/4-7 teilt oder (wie seine durchweg hohe v4-Korrektheit nahelegt) robuster über Workflows ist, ist offen — Hypothese im README.

## F-model-novel.3 — Korrektheit differenziert stärker als Code-Qualität

Auf game-of-life (RQ-model-quality) trennt Code-Qualität die Modelle bei perfekter Korrektheit. Auf claim-office trennt **Korrektheit selbst** die Modelle: opus-4-7s `verification_pct`-Spread (0.20–1.00) ist die größte Modell-Differenz der ganzen RQ, während alle vier Modelle interne Tests zu 100 % grün haben (`tests_passing` 100 % für alle). Die externe Korrektheit deckt also Spec-Lücken auf, die die inneren Tests nicht sehen — die "stärkere Challenge" exponiert Unterschiede, die auf GOL unsichtbar waren. fable-5 ist ein gutes Beispiel: 100 % grüne Tests (bis 45 Tests/Run) bei 0.83 externer Korrektheit und nie 15/15 — grüne interne Suite ≠ vollständige Spec (F-model-novel.6).

## F-model-novel.4 — Präziserer Mechanismus auf opus-4-7: Test-Listen-Vollständigkeit, nicht Subagent-Isolation

Verfeinert F-model-novel.2. Aus RQ-tdd-correctness auf claim-office × opus-4-7-portkey-no-thinking (35 Runs):

| Workflow | n | verification_pct | passed_immediately | Test-List-Vollständigkeit | shared example-mapping |
|---|---:|---:|---:|---|---|
| v4-exact-subagents | 10 | 0.67 (σ 0.36) | 17.8 | nicht erzwungen | nein |
| **v4.1-testlist-scope-fix** | 5 | **0.96 (σ 0.09)** | 22.2 | "Cover every spec example" | nein |
| v4.2-shared-context† | 5 | 0.71 (σ 0.41) | 14.0 | "Cover every spec example" | ja |
| v4.2.1-fake-it-green† | 2 | 0.70 | 12.0 | "Cover every spec example" | ja + Green-Fake-it |
| v5-exact-single-context | 9 | 0.97 (σ 0.09) | **0.9** 🏆 | (single context, implizit vollständig) | n.a. |
| v6-hybrid | 5 | **1.00 (σ 0.00)** 🏆 | 10.0 | (single context, implizit vollständig) | n.a. |

`verification_pct`: höher = besser; 🏆 = bester Wert. `passed_immediately`: niedriger = besser (Disziplin-Gewinn, siehe Beobachtung 3); 🏆 = niedrigster Wert. Das Fett auf v4.1 markiert den Finding-Hero (schließt die v4-Lücke), nicht das Spalten-Maximum.

† Workflows archiviert in `experiments/workflows/_archive/` (2026-05-22). Aus RQ-tdd-correctness-Frontmatter entfernt, die abgeschlossenen Runs bleiben als Belege für diese Findings erhalten.

**Beobachtung 1 — v4.1 schließt die v4-Lücke fast komplett.** Der einzige inhaltliche Unterschied v4 → v4.1 ist im `test-list`-Subagent: explizite Pflicht "Every requirement in the spec MUST produce at least one test … Every operation the spec names". Sonst nichts. Damit erreicht v4.1 v5/v6-Niveau auf 4.7 (0.96), mit deutlich engerer Streuung (σ 0.09 vs. 0.36).

**Beobachtung 2 — v4.2 (shared example-mapping zusätzlich) bringt keine Verbesserung gegenüber v4.1.** v4.2 erbt den Test-List-Fix von v4.1 *und* schreibt zusätzlich `example-mapping/<feature>.md`, das Red und Green vor jeder Phase lesen. Trotzdem nur 0.71 — innerhalb der v4-Streuung und deutlich unter v4.1. Die bimodale Verteilung (σ 0.41, min 0, max 1.00) deutet darauf, dass die zusätzliche Spec-Sicht in Red/Green eher destabilisiert als hilft. Wenn fehlender Spec-Kontext im Red/Green-Subagent der Grund für die v4-Schwäche wäre, müsste v4.2 besser sein als v4.1 — ist es nicht.

**Beobachtung 3 — v4.2 senkt `passed_immediately` (14.0 vs. v4.1's 22.2), ohne `verification_pct` zu verbessern.** Die Spec-Sicht in Red/Green reduziert offenbar Green-Antizipation (weniger Tests, die schon grün sind, bevor Red sie aktiviert). Aber dieser Disziplin-Gewinn übersetzt sich nicht in Korrektheit — was ein Hinweis darauf ist, dass passed_immediately ein sekundärer Mechanismus ist, nicht der dominante.

**Verfeinerte Hypothese (ersetzt "überkreativ" für 4.7):**

Auf opus-4-7 ist der dominante Failure-Mode in v4 **eine unvollständige Test-Liste, die eine ganze Spec-Operation (z.B. `claim`) ausblendet** — analog zum dokumentierten 4.6-Failure auf v6 (Claim-Hälfte verloren, F-model-novel.2). Sobald die Test-Liste vollständig ist (v4.1), sind die nachfolgenden Subagent-Phasen (Red/Green) durch die aktivierten Tests ausreichend gesteuert. Zusätzlicher Spec-Kontext in Red/Green (v4.2) bringt keinen Mehrwert und verschlechtert sogar — möglicher Mechanismus: Red/Green re-interpretieren die Spec statt sich strikt am aktiven Test zu orientieren.

**Folge für F-model-novel.2:** Der eigentliche Mechanismus liegt im `test-list`-Schritt. v6 ist auf 4.7 nicht überlegen, *weil* Red kein Subagent ist, sondern *weil* das Single-Context-Setup unvollständige Test-Listen strukturell verhindert.

**Aufgelöst (2026-05-22):** Zwei v4.2.1-Runs zeigen verification_pct 0.73 und 0.67 — beide innerhalb der v4.2-Range und deutlich unter v4.1. passed_immediately fiel auf 12 (vs. v4.2: 14, v4.1: 22.2), aber Korrektheit profitiert nicht. Die Wallclock stieg um ~50 % gegenüber v4.2 (5500s vs. 4500s), weil Refactor mehr Arbeit übernimmt, wenn Green nur fakes (40 Refactorings statt 25.7).

**Endgültiger Schluss:** Green-Antizipation ist KEIN zweiter unabhängiger Failure-Mode auf 4.7 — das Senken von passed_immediately durch Fake-it ist real, übersetzt sich aber nicht in Korrektheit. **Test-Listen-Vollständigkeit (v4.1) ist der einzig relevante Workflow-Hebel auf 4.7 für claim-office-Korrektheit.** Der v4.2-Zweig (shared-context-Files für Red/Green) wurde am 2026-05-22 verworfen; die Workflow-Definitionen liegen archiviert in `experiments/workflows/_archive/`. Konsequenz für künftige Workflow-Designs siehe `research/workflow-dev/workflow-construction.md` → "Shared-context-Files für Red/Green sind kein Korrektheits-Hebel auf 4.7".

## F-model-novel.5 — opus-4-8 erkauft beste Code-Qualität mit ~2× Token-Kosten

Bei nahezu gleicher Korrektheit wie opus-4-6 (0.92 vs 0.93) liefert opus-4-8 die beste Code-Qualität aller drei Modelle: `cognitive_max` 7.4 (vs 4-6: 22.2, 4-7: 10.5), `mccabe_max` 7.0 (vs 10.6 / 7.9), `smell_total` 1.2 (vs 5.6 / 1.8). Die `Spitzen-Komplexität` (`cc_longest_function`) liegt mit 28.4 nahe an 4-7 (25.0) und klar unter 4-6 (50.8). opus-4-8 vereint damit die Spec-Treue von 4-6 mit Code-Qualität, die 4-7 erreicht oder übertrifft — der Trade-off "konservativ-korrekt (4-6) vs. sauber-aber-unzuverlässig" aus dem Zwei-Modell-Bild löst sich auf der neuesten Generation auf.

Der Preis steht auf der Kosten-Achse: opus-4-8 verbraucht im Schnitt **31.0 M** `total_tokens` — etwa doppelt so viel wie 4-6 (15.1 M) und 4-7 (13.7 M) — und braucht mit 5264 s am längsten (vs 4416 / 3693 s). Es schreibt zugleich am meisten Code (`code_mass` 820, `lines_of_code` 303 vs. 4-7: 626 / 194), bei niedrigster Komplexität pro Funktion — d.h. das Mehr-Volumen verteilt sich auf mehr, einfachere Funktionen, nicht auf wenige komplexe. Für korrektheits- und qualitätskritische Arbeit auf v4 ist opus-4-8 die stärkste Wahl; wo Token-Budget oder Latenz bindet, bleibt opus-4-6 bei vergleichbarer Korrektheit die günstigere Option.

Einschränkung: n=5. Der `cognitive_max`-Mittelwert (7.4) wird von einem Ausreißer-Run (18) gezogen, der zugleich der einzige opus-4-8-Run mit `verification_pct` 0.80 ist; die übrigen vier liegen bei 3–7. Hoch-komplexer Ausreißer und schwächster Korrektheits-Run fallen also zusammen.

## F-model-novel.6 — fable-5: sauberster, am meisten getesteter Code — aber nie die volle Spec

fable-5 zeigt auf claim-office ein in sich konsistentes, aber paradoxes Profil: es schreibt den **mit Abstand saubersten Code** aller vier Modelle und gleichzeitig den **am wenigsten Spec-vollständigen** unter den brauchbaren Modellen.

- **Qualität (führend, aber un-getrophit):** `cognitive_max` 4.0 und `mccabe_max` 4.2 sind die niedrigsten der RQ — etwa ein Fünftel von opus-4-6 (22.2 / 10.6) und klar unter opus-4-8 (7.4 / 7.0). `cc_longest_function` 14.8 (vs. 4-8: 28.4, 4-6: 50.8) und `smell_total` 0.2 (vs. 4-8: 1.2, 4-6: 5.6) sind ebenfalls Bestwerte. Der Code ist zugleich gründlich getestet (alle Runs `tests_passing=true`, bis 45 Tests) bei der kompaktesten Code-Basis (`lines_of_code` 257.6, `code_mass` 743).
- **Korrektheit (Mittelfeld):** `verification_pct` 0.83 (σ 0.10, 0.73–0.93) — im Schnitt 12.4 von 15 externen Checks, max 14/15, **nie 15/15**. fable-5 liegt damit über opus-4-7 (0.67), aber unter opus-4-6/4-8 (~0.92). Die internen Tests sind grün, decken aber nicht die volle Spec ab: dasselbe "Tests grün, Spec lückenhaft"-Muster wie bei opus-4-6 auf v6 (F-model-novel.2) und opus-4-7 auf v4 (F-model-novel.4) — bei fable-5 aber milder ausgeprägt (kein Totalausfall einer ganzen Operation, eher einzelne Edge-Cases fehlend).
- **Kosten:** **günstigstes Modell** mit 13.4 M `total_tokens` (knapp unter 4-7s 13.7 M, etwa halb so viel wie opus-4-8) — und anders als 4-7 nicht durch Spec-Abbruch erkauft. Aber mit 7826 s die **längste Wallclock** der RQ; ein Run lief in den 7200 s Timeout (n_ok=4/5), und zwei Runs erlebten Rate-Limit-Backoff, was die Wallclock zusätzlich inflationiert.
- **Cycle-Granularität variabel:** Die fünf Runs reichen von 7 bis 46 RGR-Zyklen (pred/cycle-Ratio durchweg 2.0, Marker gesund). fable-5 batcht teils mehrere `it.todo`s pro Zyklus statt strikt eins-pro-Test — kein Qualitäts-Defizit, aber ein Unterschied im TDD-Rhythmus gegenüber den Opus-Modellen.

Interpretation: fable-5 optimiert sichtbar auf Code-Qualität und Test-Disziplin, „verliert" dabei aber etwas Spec-Breite — es implementiert die abgedeckten Operationen sauber und vollständig getestet, lässt aber konsistent ein paar Spec-Punkte aus (nie 15/15). Das ist das Spiegelbild von opus-4-8 (spec-treu bis 15/15, aber höhere Komplexität und 2× Tokens). Für token-/qualitätskritische Arbeit mit Toleranz für ~10 % fehlende Spec-Punkte ist fable-5 die günstigste und sauberste Wahl; wo Vollständigkeit zwingend ist, bleibt opus-4-8/4-6 vorne.

**Offene Folge-Frage:** Ob ein vollständigerer Test-Listen-Schritt (analog v4.1 für 4-7, F-model-novel.4) fable-5 von 0.83 auf 4-8-Korrektheit hebt, ist nicht erhoben — fable-5 wurde bisher nur auf v4 getestet.
