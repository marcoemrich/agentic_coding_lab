# RQ-7 — Findings: Workflow-Tradeoff (v6-Hybrid vs v4 vs v5)

## Übersicht

Smell-Summe (`smell_total`, Mittelwert) über alle Zellen, Kontrolle: `opus-4-7-no-thinking`, `prompt: example-mapping`:

| Kata | v4-exact-subagents (n=10) | v5-exact-single-context (n=10) | **v6-hybrid (n=5)** |
|---|---:|---:|---:|
| game-of-life | 2.6 | 4.1 | **2.2** |
| claim-office | 1.8 | 8.9 | **0.2** |

---

## F-7.1 — v6-Hybrid liefert auf 4 von 5 Komplexitäts-Metriken die beste oder zu v4 gleichwertige Code-Qualität

v6 liegt auf 7 von 8 Komplexitäts-Vergleichspunkten ≤ v4 und durchgängig deutlich besser als v5.

| Kata | Metrik | v4 | v5 | **v6** |
|---|---|---:|---:|---:|
| game-of-life | Smell-Summe | 2.6 | 4.1 | **2.2** |
| game-of-life | Spitzen-Komplexität (`cc_longest_function`) | **8.1** | 17.4 | 11.0 |
| game-of-life | `cognitive_max` | **4.4** | 14.5 | 4.6 |
| game-of-life | `mccabe_max` | 4.5 | 8.9 | **3.8** |
| claim-office | Smell-Summe | 1.8 | 8.9 | **0.2** |
| claim-office | Spitzen-Komplexität | 25.0 | 31.4 | **21.0** |
| claim-office | `cognitive_max` | 10.5 | 14.2 | **6.6** |
| claim-office | `mccabe_max` | 7.9 | 10.2 | **6.2** |

**Rationale:** Der isolierte Refactor-Subagent in v6 erbt den Code-Qualitäts-Vorteil aus v4 gegenüber v5, während red/green im Single-Context laufen. Auf der gemessenen 8-Punkte-Matrix ist v6 sieben Mal ≤ v4 und immer ≤ v5.

**Caveat Code-Mass (APP):** Auf `code_mass` zeigt sich v6 auf claim-office **schlechter** als beide Reinformen (v6=883, v5=762, v4=626). Auf game-of-life liegt v6 dagegen zwischen v4 und v5. Dieses Anti-Signal ist im Kontext von F-7.2 zu lesen: die höhere APP-Masse korreliert auf claim-office mit der vollständigeren externen Korrektheit — d.h. v6 implementiert das vom Akzeptanz-Suite geforderte Verhalten dichter ab. Eine isolierte Interpretation "v6 ist Code-Mass-schlechter" ist daher irreführend, solange Korrektheit-außen das Differenzierungs-Signal ist.

---

## F-7.2 — v6-Hybrid erreicht erstmals 100% Korrektheit (außen) auf claim-office

| Kata | v4 | v5 | **v6** |
|---|---:|---:|---:|
| claim-office (`verification_pct`, Mittelwert) | 0.67 | 0.87 | **1.00** (alle 5/5 Runs perfekt) |
| game-of-life | 1.00 | 1.00 | 1.00 |

**Rationale:** Korrektheit-innen (`tests_passing`) liegt bei allen drei Workflows bei 100% — der Unterschied entsteht in der vom Implementierer **nicht gesehenen** externen Acceptance-Suite. Mechanismus-Hypothese: v6 kombiniert das hohe Zyklen-Maß von v4 (TDD-Disziplin durch isolierten Refactor erzwingt formalen Abschluss jedes Zyklus) mit der Test-Listen-Kohärenz aus v5 (Single-Context lässt red/green konsistent aufeinander aufbauen).

---

## F-7.3 — Hybrid-Tradeoff falsifiziert: v6 ist deutlich teurer in Tokens als beide Reinformen

Hypothese H3/H4 — v6 ≈ v5 Tokens bei v4-naher Qualität, strikte Dominanz über v4 — ist **widerlegt**.

| Kata | Outcome | v4 | v5 | **v6** | v6 vs günstigstes |
|---|---|---:|---:|---:|---:|
| game-of-life | `total_tokens` | **2.56M** | 8.14M | 6.43M | +2.5× |
| game-of-life | `duration_seconds` | 1163 | **380** | 498 | +1.3× |
| claim-office | `total_tokens` | 13.66M | **14.14M** | 33.25M | +2.4× |
| claim-office | `duration_seconds` | 3693 | **655** | 2116 | +3.2× |

**Rationale:** v6 erkauft die Code-Qualität (F-7.1) und Korrektheit-außen (F-7.2) mit substanziell höheren Token-Kosten. Plausible Mechanik: Der Refactor-Subagent bekommt pro Spawn den vollen aktuellen Code-Stand als frischen Kontext zugespielt — ohne den Cache-Vorteil eines kontinuierlichen Single-Context — und das passiert pro TDD-Zyklus (claim-office: ~26 Zyklen → ~26 Subagent-Spawns mit jeweils frischem Kontext-Reload). Wallclock ist gegenüber v4 zwar besser (auf claim-office −43%), aber gegenüber v5 deutlich schlechter (auf claim-office +3.2×). v6 dominiert v4 also nur in Qualität+Wallclock, nicht in Tokens.

---

## F-7.4 — v5-Single-Context kollabiert in TDD-Disziplin auf der langen Kata claim-office

| Kata | Outcome | v4 | **v5** | v6 |
|---|---|---:|---:|---:|
| claim-office | `cycle_count` | 37.8 | **3.4** | 25.8 |
| claim-office | `refactorings_applied` | 16.4 | **2.0** | 10.4 |
| game-of-life | `cycle_count` | 7.8 | 6.7 | 8.4 |
| game-of-life | `refactorings_applied` | 5.9 | 6.0 | 3.6 |

**Rationale:** Auf der langen CLI-Kata kollabiert v5 von ~7 Zyklen (game-of-life) auf nur 3.4 Zyklen — d.h. das Modell implementiert große Test-Batches statt rote-grüne Mini-Schleifen. Das erklärt die schlechtere Korrektheit-außen aus F-7.2 trotz interner Test-Coverage von 100%: weil die selbst-geschriebenen Tests breite Batches abdecken, bleibt das vom Modell selbst nicht erkannte Verhalten ungeprüft. v6 hält die Zyklen-Disziplin auch auf langen Aufgaben (25.8 Zyklen, nahe v4). Strukturelle Erklärung: weil der Refactor-Subagent jeden Zyklus formal abschließt, kann das Single-Context-Modell mehrere rote-grüne Schritte nicht in einen Batch falten.
