# RQ-pep-emoji-claim-office — Findings

_Haelt der Interaktions-Befund aus RQ-pep-emoji-v6.1 auch auf claim-office?_

## Übersicht (Primär-Outcome **Korrektheit (außen)** — höher = besser)

| Workflow | n | `verification_pct` mean | min | std | `tests_passing` |
|---|---:|---:|---:|---:|---:|
| v6.1-hybrid (pep+emoji) | 5 | **1.00** 🏆 | 1.00 | 0.00 | **100%** 🏆 |
| v6.1-no-pep | 5 | 0.97 | 0.87 | 0.06 | **100%** 🏆 |
| v6.1-no-emoji | 5 | 0.80 | 0.00 | 0.45 | 80% |
| v6.1-no-pep-no-emoji | 5 | 0.95 | 0.73 | 0.12 | **100%** 🏆 |

Nur v6.1-hybrid liefert perfekte Korrektheit (5/5 × 100%, std=0). Alle Reduktionen verlieren — moderat (no-pep -3pp, kombiniert -5pp) bis katastrophal (no-emoji -20pp wegen einem Komplett-Failure).

---

## F-1.1 — Pep- und Emoji-Reduktion brechen Korrektheits-Garantie auf claim-office

**Aussage:** Auf der `claim-office`-Kata (komplex, echte Mehrdeutigkeiten in HPSMV-Regelwerk) ist **v6.1-hybrid der einzige Workflow mit reproduzierbar perfekter Korrektheit**. Alle drei Reduktionen zeigen Korrektheits-Verluste, mit unterschiedlichen Failure-Modes:

| Workflow | `verification_pct` mean | Pattern |
|---|---:|---|
| v6.1-hybrid | **1.00** 🏆 (std 0.00) | konstant perfekt |
| v6.1-no-pep | 0.97 (std 0.06) | konsistent leichte Drift (87%–100%) |
| v6.1-no-emoji | 0.80 (std 0.45) | 4/5 perfekt + **1 Komplett-Failure** (0/15, Agent stoppte nach Test-List) |
| v6.1-no-pep-no-emoji | 0.95 (std 0.12) | breitere Streuung (73%–100%) |

**Begründung:** Der eine 0/15-Run in v6.1-no-emoji ist kein Random-Outlier, sondern ein qualitativer Failure: der Agent erstellte die 92-zeilige `claim-office.spec.ts` und beendete den Run, ohne die Red-Phase zu starten — `experiment-done.txt` fehlt, keine Implementierungs-Datei. Eine plausible Lesart: die ✅/❌/🚨-Marker in den Skill-Templates dienen auf einer komplexen Multi-Section-Spec als "look at me, that's the next step"-Anker. Ohne sie verliert der Agent gelegentlich den Anschluss zwischen Test-List- und Red-Phase. Auf der trainingsbekannten game-of-life-Kata trat dieser Failure-Mode nicht auf — der Agent kennt das Muster ohne Marker.

v6.1-no-pep verliert milder und kontinuierlich; v6.1-no-pep-no-emoji liegt dazwischen. Hypothese H1 (Korrektheit invariant) ist damit **klar widerlegt**.

---

## F-1.2 — Disziplin-Interaktion kehrt sich um vs. game-of-life

**Aussage:** Das auf game-of-life beobachtete Disziplin-Muster ([RQ-pep-emoji-v6.1](../1.3-pep-emoji-combined-v6.1/findings.md) F-1.1: no-pep refactoriert mehr als hybrid, kombiniert refactoriert unter Baseline) **kehrt sich auf claim-office vollständig um**. Auf der komplexen Kata refactoriert v6.1-hybrid am meisten, alle Reduktionen kürzen die Iterationen ab.

| Metrik | game-of-life (RQ-1.3) | claim-office (hier) |
|---|---|---|
| `refactorings_applied` Sieger | no-pep (7.0) > hybrid (4.1) | **hybrid (11.6)** 🏆 > no-pep (6.6) |
| `refactorings_applied` (kombiniert) | 3.8 (unter Baseline) | 9.8 (zwischen Reduktionen) |
| `tests_passed_immediately` Sieger | **no-pep (1.2)** 🏆 | **no-pep (8.2)** 🏆 |
| `tests_passed_immediately` (kombiniert) | 1.2 (= no-pep, saturiert) | 13.8 (höher als Baseline 13.4) |

**Begründung:** Die game-of-life-Lesart "weniger Drumherum → strikterer Prozess" ist kata-spezifisch. Auf claim-office mit echten Mehrdeutigkeiten ist das umgekehrte Pattern aktiv: die Pep-Talks und Emoji-Marker liefern Re-Orientierungs-Anker, die der Agent für die längere Iterationsfolge braucht (claim-office: cycle_count Median 22-30 vs game-of-life 9). Ohne sie kürzt der Agent die Refactor-Phasen ab, was sich in der Korrektheits-Regression aus F-1.1 niederschlägt. Hypothesen H3 (stabiles Pattern) **widerlegt**, H4 (kata-spezifisch) **bestätigt**.

---

## F-1.3 — Recipe-Empfehlung für komplexe Katas: v6.1-hybrid behalten

**Aussage:** Die game-of-life-basierte Empfehlung "v6.1-no-pep beste Wahl für Code-Qualitäts-Forschung" oder "v6.1-no-pep-no-emoji für Speed" gilt **nicht für komplexe Katas mit echten Mehrdeutigkeiten**. Auf claim-office ist **v6.1-hybrid (mit Pep+Emoji) die einzige korrektheits-sichere Wahl**.

| Anwendungsfall | Empfehlung | Begründung |
|---|---|---|
| game-of-life / trainingsbekannte Katas | v6.1-no-pep | Code-Qualität leicht besser, mehr Refactor-Aktivität, Korrektheit invariant |
| claim-office / komplexe Katas mit Ambiguitäten | **v6.1-hybrid** | Einzige Variante mit 100/100 Korrektheit; Reduktionen verlieren systematisch |
| Speed-kritisch (akzeptiert -5pp Korrektheit) | v6.1-no-pep-no-emoji | Nur wenn Korrektheits-Drift bekannt und akzeptiert |

**Begründung:** Das ist die zentrale Konsequenz aus F-1.1 und F-1.2. Decoration-Marker und Pep-Talks sind auf trainingsbekanntem Code redundant, auf neuem komplexem Code aber funktional notwendig. Der Reduktions-Recipe ([`v6-reduction-recipe.md`](../v6-reduction-recipe.md)) muss um diese Kata-Komplexitäts-Dimension erweitert werden, bevor Reduktionen als allgemeine Empfehlung übernommen werden.

---

## Status der Hypothesen

| Hypothese | Status | Beleg |
|---|---|---|
| **H1** Korrektheit invariant | widerlegt | hybrid 1.00 vs no-emoji 0.80 (-20pp), no-pep 0.97 (-3pp), kombiniert 0.95 (-5pp) |
| **H2** no-pep-no-emoji-Regression ≥10pp | nicht bestätigt | kombiniert nur -5pp; aber no-emoji einzeln -20pp |
| **H3** Disziplin-Pattern stabil über Katas | widerlegt | `refactorings_applied`-Sieger kippt von no-pep (GoL) zu hybrid (claim-office) |
| **H4** Disziplin-Pattern kata-spezifisch | bestätigt | siehe F-1.2 |
| **H5** Code-Qualität indistinguishable | bestätigt | grosse Streuungen, keine konsistenten Trends; no-pep-no-emoji bei smell_total am besten (0.6) |

**Caveat zu n=5:** Die katastrophale 0/15-Failure in v6.1-no-emoji dominiert die Statistik. Bei n=10+ würde sich entscheiden, ob das ein 20%-Failure-Rate-Pattern oder ein 5%-Outlier ist. Für die Recipe-Empfehlung in F-1.3 ist aber das **Vorhandensein** des Failure-Modes entscheidend, nicht die exakte Frequenz — eine Reduktion, die manchmal komplett abbricht, ist als Default-Workflow nicht akzeptabel.
