# Findings — RQ-4.7: Substituting the Inner TDD Loop (opus-5)

All figures: `claim-office-example-mapping` × `opus-5-no-thinking` (native
subscription route), n=5 per cell. Both external workflows are vendored
snapshots at the commits named in [README.md](README.md); every statement here
describes those snapshots, not the tools in general.

## Übersicht

Primary outcome is Correctness (external); the decomposition metrics follow the
binding quality metric from RQ-architecture-axis-opus5 F-1.6.

| Metrik | `v6.1.1-lab-split-cc` (per-cycle, subagent) | `v11-superpowers-tdd` (per-cycle, inline) | `v10-pocock-tdd` (no refactor) |
|---|---:|---:|---:|
| **Correctness (external)** `verification_pct` — höher = besser | 0.96 ± 0.04 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 |
| perfekte Runs | 2/5 | **5/5** 🏆 | **5/5** 🏆 |
| Correctness (internal) `tests_passing` | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `cc_avg_loc_per_function` — kleiner = besser | 4.49 ± 0.54 | 7.90 ± 1.15 | 10.41 ± 1.45 |
| **Complexity Peak** `cc_longest_function` — kleiner = besser | 17.60 ± 4.39 | 23.40 ± 3.13 | 26.60 ± 4.22 |
| `cognitive_max` — kleiner = besser | 2.80 ± 0.84 | 6.20 ± 2.17 | 6.60 ± 2.41 |
| `mccabe_max` — kleiner = besser | 3.40 ± 0.55 | 5.20 ± 1.10 | 5.40 ± 1.14 |
| **Smell Total** — kleiner = besser | 0.00 ± 0.00 | **0.00 ± 0.00** 🏆 | 0.20 ± 0.45 |
| **Code Mass (APP)** — kleiner = besser | 821 ± 111 | 666 ± 26 | **600 ± 60** 🏆 |
| `duration_seconds` — kleiner = besser | 3841 ± 1523 | **548 ± 57** 🏆 | **582 ± 66** 🏆 |
| `total_tokens` — kleiner = besser | 126.2 M ± 42 M | **12.2 M ± 1.3 M** 🏆 | **11.8 M ± 1.3 M** 🏆 |
| `refactorings_applied` — Konstruktionsmerkmal | 33.00 ± 14.27 | 4.20 ± 3.42 | 0.00 ± 0.00 |
| `test_blocks` | 48.40 ± 2.07 | 13.40 ± 2.51 | 19.00 ± 2.74 |
| `test_cases_total` | 49.00 ± 2.00 | 45.00 ± 11.51 | 36.80 ± 5.26 |
| `test_cases_first_block` | 1.00 ± 0.00 | 1.00 ± 0.00 | 1.00 ± 0.00 |
| `red_unverified` — kleiner = strikter | 0.00 ± 0.00 | 1.00 ± 1.73 | 0.20 ± 0.45 |

> **Warum die Qualitätszeilen keinen Pokal tragen.** Die Gating-Regel vergibt
> Qualitäts- und Kostenpokale nur an Zellen mit `verification_pct = 1.0`.
> `v6.1.1` liegt bei 0.96 mit nur 2/5 perfekten Runs — das ist kein Rundungsrest,
> sondern ein echtes Korrektheitsdefizit in 3 von 5 Läufen. `v6.1.1` ist damit
> nicht pokalberechtigt, hält aber auf allen vier Dekompositionsmetriken die
> besten Absolutwerte. Ein Pokal an die beste *berechtigte* Zelle würde ihn auf
> den schlechteren Wert der Zeile setzen, was die Konvention ausschließt — also
> bleiben diese Zeilen pokalfrei. Bei Kosten, `Code Mass (APP)` und
> `Smell Total` entsteht der Konflikt nicht: dort ist die beste Zelle ohnehin
> berechtigt.

> `refactorings_applied` trägt keinen Pokal: die drei Werte sind das
> Konstruktionsmerkmal der Zellen, nicht ein Ergebnis. 33 / 4.2 / 0 ist die
> Achse selbst.

---

## F-4.7.1 — Der innere Loop ist substituierbar, ohne Korrektheit zu verlieren

Beide externen Workflows erreichen `verification_pct` 1.00 in 5/5 Läufen. Die interne Baseline `v6.1.1` liegt mit 0.96 (2/5 perfekt) darunter.

| | perfekte Runs | `verification_pct` |
|---|---:|---:|
| `v11-superpowers-tdd` | 5/5 | 1.00 ± 0.00 |
| `v10-pocock-tdd` | 5/5 | 1.00 ± 0.00 |
| `v6.1.1-lab-split-cc` | 2/5 | 0.96 ± 0.04 |

Lesart: die Wertschöpfung von EXACT Coding liegt im Example Mapping und der Testliste, nicht in der eigenen Red/Green-Verrohrung. Ein extern verfasster Loop trägt die Methode auf dieser Kata mindestens so zuverlässig. H5 bestätigt für alle drei Zellen.

Die drei `v6.1.1`-Läufe bei 0.9333 scheitern an demselben Akzeptanzszenario-Muster wie der in RQ-4.5 F-1.4 dokumentierte Fall; der Effekt ist damit nicht neu, aber er trifft `v6.1.1` häufiger als die beiden externen Zellen.

---

## F-4.7.2 — Refactor-Position bestimmt die Dekomposition monoton

Über die drei Zellen fallen alle vier Dekompositions- und Komplexitätsmetriken monoton mit der Refactor-Häufigkeit.

| | `refactorings_applied` | `cc_avg_loc_per_function` | Complexity Peak | `cognitive_max` | `mccabe_max` |
|---|---:|---:|---:|---:|---:|
| `v6.1.1` per-cycle, Subagent | 33.00 | 4.49 | 17.60 | 2.80 | 3.40 |
| `v11` per-cycle, inline | 4.20 | 7.90 | 23.40 | 6.20 | 5.20 |
| `v10` kein Refactor | 0.00 | 10.41 | 26.60 | 6.60 | 5.40 |

Der saubere Test der Position ist `v11 ↔ v10` — gleiche Architektur (ein inline-Skill), nur die Position variiert. `cc_avg_loc_per_function` 7.90 gegen 10.41 ist der belastbarste Einzelbefund dieses Paares (Abstand 2.51 bei σ ≈ 1.3). Complexity Peak, `cognitive_max` und `mccabe_max` zeigen dieselbe Richtung, liegen aber innerhalb 1 σ.

H1 bestätigt: eine Refactor-Stufe wirkt. H2 bestätigt: `v10` ist auf allen vier Metriken das Qualitätsminimum des Feldes. Die Design-Doktrin im Prompt ("deep modules", "small interfaces") ersetzt die Stufe nicht.

---

## F-4.7.3 — Die isolierte Subagent-Architektur kauft Dekomposition, und sie ist teuer

`v6.1.1 ↔ v11` variiert Architektur und Mechanismus bei konstanter Position (beide refaktorieren pro Zyklus). Der Unterschied ist groß in beide Richtungen.

| | `cc_avg_loc_per_function` | `duration_seconds` | `total_tokens` | `refactorings_applied` |
|---|---:|---:|---:|---:|
| `v6.1.1` Phasen-Kommandos + Subagent | 4.49 ± 0.54 | 3841 ± 1523 | 126.2 M ± 42 M | 33.00 ± 14.27 |
| `v11` ein inline-Skill | 7.90 ± 1.15 | 548 ± 57 | 12.2 M ± 1.3 M | 4.20 ± 3.42 |
| Faktor | 0.57× | **7.0×** | **10.3×** | 7.9× |

Die Antwort auf die Leitfrage des RQ ist damit zweiteilig: der Subagent-Apparat **kauft** messbar bessere Dekomposition (4.49 gegen 7.90, ≈ 3 σ) — aber zum Preis von 7× Wallclock und 10× Tokens, bei gleichzeitig schlechterer Correctness (external). H3 in der Variante "per-cycle-Refactoring allein genügt" ist widerlegt: `v11` refaktoriert pro Zyklus und landet trotzdem klar außerhalb des `v6.1.1`-Niveaus. H4 bestätigt (`v11` deutlich günstiger als `v6.1.1`).

Die σ-Werte sind Teil des Befunds: `v6.1.1` streut auf Dauer (± 1523 s) und Tokens (± 42 M) drei- bis vierfach stärker relativ zum Mittel als `v11`. Der Apparat ist nicht nur teurer, sondern in seinen Kosten schlechter vorhersagbar.

---

## F-4.7.4 — Die Review-Stufe kostet mehr, als der fehlende Refactor spart

`v10` hat keine Refactor-Stufe, dafür zwei Review-Subagenten am Ende. Es ist trotzdem nicht die günstigste Zelle.

| | `duration_seconds` | `total_tokens` |
|---|---:|---:|
| `v11` per-cycle-Refactor, keine Review | **548 ± 57** | **12.2 M ± 1.3 M** |
| `v10` kein Refactor, zwei Review-Subagenten | 582 ± 66 | 11.8 M ± 1.3 M |

H8 (`v10` ist die günstigste Zelle) ist **nicht bestätigt**: `v10` liegt bei der Wallclock über `v11`, bei den Tokens knapp darunter, beide Abstände innerhalb 1 σ. Lesart: die zwei Review-Subagenten kosten etwa so viel, wie das eingesparte per-cycle-Refactoring einbringt — und liefern dabei keinen Code, weil sie per Konstruktion nur berichten. Wer die Review-Stufe streicht, bekämt die billigste Variante des Feldes; mit ihr ist `v10` kostenneutral gegenüber `v11` und auf jeder Qualitätsmetrik schlechter.

---

## F-4.7.5 — Superpowers hält die Zyklusdisziplin, schreibt Tests aber nicht in einem Block

Die manuelle n=1-Beobachtung, Superpowers schreibe alle Tests auf einmal, reproduziert nicht.

| | `test_blocks` | `test_cases_total` | `test_cases_first_block` | Fälle pro Block |
|---|---:|---:|---:|---:|
| `v6.1.1` | 48.40 ± 2.07 | 49.00 ± 2.00 | 1.00 ± 0.00 | 1.01 |
| `v11` | 13.40 ± 2.51 | 45.00 ± 11.51 | 1.00 ± 0.00 | 3.36 |
| `v10` | 19.00 ± 2.74 | 36.80 ± 5.26 | 1.00 ± 0.00 | 1.94 |

`test_cases_first_block` ist in 15/15 Läufen genau 1: kein Workflow beginnt mit einem Testblock. H6 ist damit **widerlegt** — der Falsifikator (`test_blocks = 1` oder erster Block ≈ Gesamtzahl) tritt in keinem Lauf ein.

Die Schrittweite unterscheidet sich dennoch deutlich: `v6.1.1` bleibt bei einem Fall pro Block, `v11` schreibt im Mittel 3.36. Das Skript des Skills verlangt "one behavior" pro Test; `v11` legt das erkennbar breiter aus als die Phasen-Kommandos, ohne die Rot-Phase zu überspringen.

`red_unverified` bleibt niedrig, aber nicht bei null: `v6.1.1` 0.00, `v10` 0.20 ± 0.45, `v11` 1.00 ± 1.73. Die Streuung bei `v11` kommt aus einem einzelnen Lauf; H7 gilt für `v6.1.1` und `v10` und ist für `v11` nur schwach gestützt.

---

## F-4.7.6 — Wenig Code ist hier kein Qualitätssignal

Die Code-Mass-Reihenfolge ist der Komplexitätsreihenfolge entgegengesetzt.

| | Code Mass (APP) | `cc_avg_loc_per_function` |
|---|---:|---:|
| `v6.1.1` | 821 ± 111 | 4.49 |
| `v11` | 666 ± 26 | 7.90 |
| `v10` | 600 ± 60 | 10.41 |

`v10` schreibt am wenigsten und packt es in die längsten, komplexesten Funktionen; `v6.1.1` schreibt am meisten und verteilt es am feinsten. Konsequenz für die Auswertung: Code Mass (APP) allein trennt auf dieser Kata nicht zwischen "sparsam" und "verdichtet". Ohne die Dekompositionsmetriken daneben würde `v10` als das schlankere Ergebnis gelesen — es ist das ungegliederte.
