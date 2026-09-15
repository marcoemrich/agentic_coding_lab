# Workflow Construction

Single Source of Truth für TDD-Workflows in diesem Repo. Drei Ebenen in einem File:

1. **[Inventar](#inventar)** — welche Workflow-Varianten sind aktiv, wofür?
2. **[Methodik](#methodik)** — wie baut man einen neuen Workflow / eine Reduktions-RQ?
3. **[Tragende Befunde](#tragende-befunde)** — welche RQ-Ergebnisse stützen die Methodik?

Schwester-Dokus:
- `experiments/workflows/MARKERS.md` — harte Parser-Anforderungen (Skill-Aufrufe, "Red Phase Complete"-String, Prediction-Lines, `experiment-done.txt`).
- `research/workflow-dev/model-recommendation-matrix.md` — pro Modell empfohlener Workflow.
- `research/kata-design/kata-construction.md` — Kata-Methodik.

Die Workflow-Files der vor-hybrid-v2-Generation + erste Reduktions-Kette (v6.5er, v6.6-leaner) liegen unter `experiments/workflows/_archive/`. Die zugehörigen RQ-Verzeichnisse der oneshot-v1-Generation wurden am 2026-08-11 gelöscht (Commit `953841cb`) und sind nur noch über die Git-Historie erreichbar. Befunde aus dieser Kette sind nicht in dieses File übernommen — die Kette war korrektheits-defekt (siehe Anti-Pattern "Bundle-Reduktion ohne Korrektheits-Stichprobe" unten), und alle Folge-Iterationen liefen auf gebrochenem Workflow. Die jetzige hybrid-v2-Linie ist der Neustart auf reparierter Basis.

---

## Inventar

### Generationen — Architektur-Achse

| Variante | Mechanik | Status / Verwendung |
|---|---|---|
| `baseline-oneshot-v1-cc` | Single-Shot, keine TDD-Struktur | Kontrolle für TDD-Effekt |
| `baseline-iterative-v1-cc` | Iterativ, keine expliziten Phasen | Kontrolle |
| `baseline-inline-tdd-v1-cc` | Inline TDD, kein Skill, kein Subagent | TDD-Basislinie |
| `exact-subagents-v1-cc` / `exact-subagents-v2-testlist-fix-cc` | Alle Phasen als Task-Subagents (isoliert) | maximale Isolation; subagents-v2 hat zusätzlich "Cover every spec example"-Pflicht im test-list |
| `exact-single-context-v1-cc` / `exact-single-context-v2-testlist-fix-cc` | Alles in einem Context | niedrigste Tokens, Disziplin-Kollaps auf langen Katas |
| `exact-hybrid-v1-cc` | Red/Green als Skills, Refactor als isolierter Subagent | erste Hybrid-Variante (Korrektheit-defekt nach Skill-Creator-Eingriff in v6.5-lean, siehe Anti-Patterns) |
| `exact-hybrid-v2-testlist-fix-cc` | exact-hybrid-v1-cc + Test-List-Scope-Fix | **Aktuelle Default-Basis für Reduktions-RQs** |
| `exact-green-refactor-v1-cc` / `v7.1-...-testlist-scope-fix` | Green und Refactor isoliert | Pareto-dominiert von hybrid-v1 (RQ-context, oneshot-v1-Archiv) |
| `baseline-end-refactor-only-v1-agent-cc` / `baseline-end-refactor-only-v1-native-cc` | Oneshot + End-Refactor (Vibe-Coding-Kontrolle) | Kontrolle für "periodisches TDD vs End-Refactor" |
| `basic-sol-tdd-*` (8 Varianten) | Predictive TDD aus dem `sol_tdd`-Projekt. Referenz `exact-sol-v1-pi` (pi-nativ, Refactor inline), Subagent-Arm, vier APP-/Mess-Varianten, Claude-Code-Port, vollständige Stackprofil-Extraktion | Fremd-Methodik-Import, siehe eigener Abschnitt unten |
| `exact-tcr-v1-pi` | Vollständige inaktive Test-Liste, danach native-Git TCRDD mit Commit-or-Revert für Red, Green und Refactor im gemeinsamen pi-Kontext | First-Party-Lab-Port aus `exact-coding-exercises/.pi` Version `2026-09-13`; autonom, mit P1–P7-Markern; empirische Referenz in RQ-1.7 |
| `exact-tcr-v1.1-srp-pi` | `exact-tcr-v1-pi` plus qualitative SRP-Prüfung im Refactor; konkrete TypeScript/Vitest- und Java/JUnit/Maven-Anwendung nur in den Stackprofilen | Faktor-isolierte SRP-Variante; `RQ-srp-effect-exact-tcr-sol`: Korrektheit intakt, kein konsistenter Dekompositions-/Komplexitätsgewinn, auf GoL mehr Production LoC, auf claim-office weniger Tokens/Kosten; nicht als Upgrade empfohlen |
| `exact-tcr-v1.2-domain-responsibility-pi` | Operationalisiert SRP als verpflichtenden Domain-Responsibility-Review: Verantwortung in Ubiquitous Language benennen, unabhängige Policy-Änderungsachsen prüfen und intent-revealing Domain-Grenzen ausdrücklich vor Fewest Elements priorisieren; keine DDD-Pattern-Pflicht, Stackprofile gegenüber v1.1 unverändert | `RQ-srp-effect-exact-tcr-sol`: auf claim-office kürzere durchschnittliche Funktionen und mehr policy-benannte Refactor-Commits als v1.1 bei voller Korrektheit, aber kein Spitzen-Komplexitätsgewinn und Kosten zurück auf v1-Niveau; auf GoL kein Dekompositionsgewinn |
| `exact-tcr-v1.3-domain-boundary-trial-pi` | v1.2 plus verpflichtender Versuch des stärksten plausiblen Domain-Boundary-Kandidaten durch TCR commit-or-revert; Änderungsgegenprobe gegen breite Oberbegriffe, konkrete semantische Moves und domänenspezifischer Vorher/Nachher-Nachweis; Stackprofile unverändert | `RQ-srp-effect-exact-tcr-sol`: auf claim-office klare Dekomposition (Ø LoC/Funktion 7.03→5.67, Complexity Peak 17.2→14.2, Refactor-Commits 3.8→9.4) bei voller Korrektheit, aber +35 % Dauer und +29 % Production LoC; auf GoL kein aufgelöster Qualitätsgewinn; quality-orientierte Claim-Office-Variante, kein allgemeiner Default |
| `exact-tcr-v1.4-domain-boundary-app-pi` | v1.3 plus qualitativer APP-Review nach der fachlichen Grenzentscheidung und eigener APP-TCR-Trial; Rules 1–3 und retained domain boundaries haben Vorrang, keine vollständige In-Run-Messung; Stackprofile unverändert | `RQ-srp-effect-exact-tcr-sol` | Kein APP-Gewinn: Code Mass auf claim-office 568.4→571.8, auf GoL 165.8→163.2, jeweils innerhalb der Streuung; volle Correctness und Dekomposition bleiben erhalten, claim-office Production LoC sinkt auf 134.8 bei höherer Varianz. Guard sicher, APP weitgehend inert; kein Default |

### `basic-sol-tdd`-Paar (Import aus `sol_tdd`, pi)

Quelle sind die Skills `predictive-tdd` und `test-list` des `sol_tdd`-Projekts.
Die Linie steht **außerhalb** der oneshot-v1–v9-Kette: sie ist kein Reduktionsschritt,
sondern eine unabhängig entstandene TDD-Methodik, die hier messbar gemacht wurde.

Inhaltliche Unterschiede zur hybrid-v1-Linie:

- **Predictions sind Prosa, kein Formular.** Die Vorschrift lautet "vor jedem
  deterministischen Check eine falsifizierbare Erwartung nennen", nicht
  "Compilation/Runtime-Block ausfüllen". Die zwei verbatim-Prediction-Zeilen
  sind hier nur die *mechanische Zusammenfassung* der Prosa-Erwartung — nötig
  für P5/P6, aber nicht die Methodik selbst.
- **Refactor kennt nur die Four Rules of Simple Design.** Keine APP-Mass-Rechnung,
  kein metric-driven End-Refactor-Pass. Damit fehlt bewusst der unter
  "Tragende Inhalte" Punkt 4 geschützte Vorher/Nachher-Zwang — ein Unterschied,
  den ein Vergleich gegen hybrid-v4/hybrid-v5 direkt misst.
- **Red ist verhaltensdefiniert.** Ein gültiges Red scheitert daran, dass das
  aktive Verhalten fehlt; das Compilation-Scaffold ist Mittel, keine eigene Phase.

Zwei Lab-Anpassungen gegenüber der Quelle: die Human-in-the-Loop-Autonomie-
Vereinbarung entfiel (der Harness läuft unbeaufsichtigt; die Eskalationsregeln
lösen sich stattdessen zu "verteidigbarste Lesart nennen und weitermachen" auf),
und die Marker aus `MARKERS.md` kamen hinzu. Beides liegt im LAB-ONLY-Block bzw.
ist dort dokumentiert, sodass ein Export die Quell-Semantik wiederherstellen kann.

Die beiden Varianten unterscheiden sich **ausschließlich** darin, wo der
Four-Rules-Review läuft — inline im Hauptkontext (`## Refactor`-Textmarker) oder
in einem isolierten `subagent` (Tool-Call als Signal). Das ist die Architektur-
Achse, isoliert auf einer fremden Methodik.

#### Verhältnis zu RQ-architecture-axis-sol-pi (1.14) — bindend

Die Architektur-Achse ist auf Sol/pi **bereits gemessen**: RQ-1.14, 50 Runs,
10 Zellen × n=5, inline-tdd-v1 / subagents-v2 / single-context-v2 / hybrid-v2 / hybrid-v6 × claim-office + game-of-life,
Prompt-Stil `example-mapping`, Modell `gpt-5-6-sol`. Wer das `basic-sol-tdd`-Paar
auswertet, muss diese RQ zuerst lesen — sie setzt den Rahmen.

Ihr Kernbefund (F-1.6) ist schärfer als ein bloßes Caveat: auf game-of-life
gewinnt **strukturloses inline-tdd-v1 fast jede Qualitätsmetrik** gegen jede Architektur,
bei 100 % Korrektheit in allen Zellen und 2.8–4.1× geringeren Kosten. Auf
claim-office erreicht inline-tdd-v1 ebenfalls 100 % `verification_pct` — bei 229 s gegen
1185 s (hybrid-v2) und $1.18 gegen $9.52. Die RQ hatte diesen Ausgang als H4-Counter-Case
vorab benannt: dann ist die ehrliche Empfehlung inline-tdd-v1.

**Was das Paar trotzdem hinzufügt.** RQ-1.14 variiert die Architektur *innerhalb*
der opus-Linie; der Schritt single-context-v2 → hybrid-v2 ändert Refactor-Isolation **und**
Skill-Struktur zugleich. Das `basic-sol-tdd`-Paar hält eine fremde Methodik
konstant und variiert **ausschließlich** inline-vs-Subagent. Damit isoliert es
den Refactor-Isolations-Effekt, der in RQ-1.14 konfundiert ist.

Anschluss an eine konkrete offene Stelle in F-1.6: dort liefert der isolierte
Refactor-Subagent (hybrid-v2) auf Sol *nicht* die Extraktion, für die er existiert —
inspizierte Runs lassen eine dreifach verschachtelte Schleife stehen, die der
inline-tdd-v1-Boden benennt. Auf opus-4-7 extrahiert derselbe Subagent (F-1.10). F-1.6 nennt
das eine Modell-Architektur-Interaktion. Das Paar prüft, ob der Effekt auch
auftritt, wenn der Refactor-Auftrag aus einer anderen Methodik kommt (Four Rules
ohne APP statt hybrid-v1-Refactor-Agent).

**Treiber-RQ: `RQ-native-sol-workflows-sub`** (`workflow-dev/1.16-native-sol-workflows-subscription/`),
3 Zellen × 2 Katas × n=5. Sie läuft bewusst **nicht** als Erweiterung von RQ-1.14,
sondern eigenständig auf der OpenAI-Subscription-Route (`gpt-5-6-sol-codex`):
RQ-1.14 kontrolliert auf `gpt-5-6-sol` (Requesty), und RQ-route-effect-pi F-1.3.6
belegt einen echten Routen-Effekt auf genau den hier gemessenen Qualitätsmetriken
(Complexity Peak 4.0 gegen 8.0/9.0, Smell Total 0.0 gegen 2.0) — nachweislich kein
Reasoning-Effekt. Ein Mischen würde den Lineage-Vergleich mit dem Transport
konfundieren, und zwar in genau die Richtung, in die die native Linie erwartet wird.

Deshalb fährt die neue RQ ihren **eigenen inline-tdd-v1-Boden** auf der Sub-Route mit —
`baseline-inline-tdd-v1-pi × gpt-5-6-sol-codex` hatte null vorhandene Runs, die RQ-1.14-Zahlen
sind nicht übertragbar. Ohne diesen Boden wäre die Kernfrage („schlägt die native
Linie inline-tdd-v1?") nicht beantwortbar, denn F-1.6 zeigt: inline-tdd-v1 ist auf Sol kein schwacher
Vergleichspunkt, sondern der amtierende Sieger.

Die beiden Smoke-Runs (`game-of-life-prose`) gehören in keine Zelle — falscher
Prompt-Stil, sie belegen nur die Marker-Mechanik.

**Stand: RQ-1.16 ist beantwortet.** Der inline-tdd-v1-Boden hält *nicht* überall — auf
claim-office schlägt die native Linie ihn deutlich, auf game-of-life und
sphinx-score nicht. Die Konsequenzen stehen im nächsten Abschnitt.

#### `predictions_total ≈ 2 × cycle_count` gilt hier nicht

Die MARKERS.md-Konvention "zwei Prediction-Lines pro Cycle" setzt voraus, dass
jeder Cycle ein echtes Red durchläuft. Diese Linie erzeugt systematisch
**already-green-Cycles**: die Quell-Regel verbietet ausdrücklich, ein Failure
zu fabrizieren, wenn eine frühere Generalisierung den nächsten Test schon
abdeckt ("do not manufacture a failure"). Solche Cycles zählen in
`cycle_count`, tragen aber korrekterweise keine Predictions bei.

Der Smoke-Run zeigt das deutlich (`game-of-life-prose` × `gpt-5-6-sol-codex`,
n=1 je Variante):

| | `exact-sol-v1-pi` | `exact-sol-v1.1-subagent-pi` |
|---|---|---|
| `phase_source` | `text-markers` | `subagents` |
| `cycle_count` | 10 | 9 |
| `refactorings_applied` | 10 | 10 |
| `predictions_correct` / `_total` | 8 / 8 | 12 / 12 |
| Red-Phasen gesamt | 10 | 9 |
| davon mit formalem Prediction-Block | 4 | 6 |
| davon explizit already-green | 3 | 3 |
| Rest (Prosa-Prediction ohne die zwei Zeilen) | 3 | 0 |
| `verification_pct` | 1.0 | 1.0 |
| `lines_of_code` | 43 | 37 |
| `code_mass` | 142 | 144 |
| `cognitive_max` | 4 | 4 |
| Wallclock (Batch-Log) | 320 s | 715 s |
| `cost_usd` | 1.18 | 1.43 |

Beide `tests_passing` true, `exit_reason: ok`. Bei n=1 je Zelle ist davon nur
die Marker-Mechanik belastbar, nicht der Qualitäts- oder Kostenunterschied —
der Subagent-Arm kostet hier gut das Doppelte an Wallclock, was zur bekannten
Architektur-Kostenkurve passt, aber bei einem Run keine Aussage trägt.

Die Lücke zwischen Red-Phasen und Prediction-Blöcken hat **zwei** Ursachen, die
man auseinanderhalten muss:

1. **Already-green (3 von 10 bzw. 3 von 9) — methodisch korrekt.** Die
   Quell-Regel verbietet, ein Failure zu fabrizieren; der Workflow schreibt
   für diesen Fall einen eigenen Block ohne Prediction-Zeilen vor.
2. **Prosa-Prediction ohne die zwei formalen Zeilen (3 von 10 in Variante A,
   0 in Variante B) — echter Compliance-Verlust.** Das Modell formuliert die
   Erwartung als Fließtext ("I predict TypeScript resolution succeeds …") und
   liefert den `Red Phase Complete:`-Block nicht nach. Diese Cycles hätten
   Predictions tragen müssen.

Punkt 2 ist der Preis dafür, dass die Quell-Methodik Predictions als Prosa
definiert und die zwei Zeilen nur nachträglich aufgesetzt sind — anders als in
der hybrid-v1-Linie, wo das Formular *die* Prediction ist. Sollte sich das über mehr
Runs bestätigen, ist der Hebel der verbatim-Hinweis in `red`-Position (siehe
"Tragende Inhalte" Punkt 2), nicht mehr Prosa.

Ein niedriges `predictions_total` ist auf dieser Linie also **kein
Compliance-Bruch**, sondern eine Eigenschaft der Methodik. Wer sie gegen die
hybrid-v1-Linie vergleicht, muss `predictions_correct_rate` (Anteil) statt
`predictions_total` (Absolutzahl) verwenden — sonst misst er die Häufigkeit
already-green-Schritte statt Prediction-Disziplin.

Nebenbefund für die pi-Parser-Mechanik: `## Red` und der zugehörige
`Red Phase Complete:`-Block landen hier in **getrennten** Assistant-Blöcken.
Nur weil `parse_pi_transcript.py` mit `loose_gate=True` arbeitet, werden die
Predictions überhaupt gezählt (P5-Hinweis in `MARKERS.md`).

#### Varianten der Sol-Linie und ihr Stand (RQ-1.16 bis RQ-1.18, RQ-1.21)

Aus dem Paar sind acht Workflows geworden. Sie teilen Methodik, Marker und die
beiden Lab-Anpassungen und unterscheiden sich im Refactor-Auftrag, darin, wo er
läuft, oder in der Vollständigkeit der bereits vorhandenen Stackprofil-Grenze.
`exact-sol-v1.3-stack-profile-pi` verändert keinen Refactor-Auftrag: Die Variante
verschiebt nur die verbliebenen TypeScript/Vitest-Details aus `AGENTS.md` und dem
Test-List-Skill in das Stackprofil. `RQ-stack-profile-extraction-sol` hat auf zwei
Katas bei je n=5 pro Zelle keine Korrektheits- oder Completion-Regression gefunden
und unterstützt die Variante als neue Main Line. Die Zahlen der Refactor-Varianten
unten stammen aus `claim-office-example-mapping` × `gpt-5-6-sol-codex`
(OpenAI-Subscription-Route), n=5 je Zelle; der Stackprofil-Befund umfasst zusätzlich
game-of-life und wird kata-getrennt berichtet.

| Variante | Was anders vs `exact-sol-v1-pi` | Treiber-RQ | Kernbefund |
|---|---|---|---|
| `exact-sol-v1-pi` | — (Referenz: Refactor inline, nur Four Rules, keine Mass-Metrik) | [RQ-1.16](1.16-native-sol-workflows-subscription/findings.md), [RQ-1.17](1.17-app-vs-four-rules-sol/findings.md) | Empirische Referenz und Elternvariante der aktuellen Main Line; beste oder gleichauf-beste Dekomposition im Refactor-Variantenfeld bei 100 % Korrektheit |
| `exact-sol-v1.1-subagent-pi` | Four-Rules-Review im isolierten `subagent` statt inline | [RQ-1.16](1.16-native-sol-workflows-subscription/findings.md) | **Verworfen.** Kein Qualitätsvorteil auf keiner der drei Katas, 1.9–2.7× Wallclock, letzter Platz bei externer Korrektheit auf beiden novellen Katas (F-1.16.3, F-1.16.4, F-1.16.8) |
| `exact-sol-v1.2-app-pi` | APP-Mass unter Rule 4 subordiniert, qualitativ; Rule-Reihenfolge explizit als bindend markiert | [RQ-1.18](1.18-app-subordination-and-measurement-sol/findings.md) | Kein Gewinn. Verhindert den APP-Schaden (F-1.17.1), erzeugt aber keinen Vorteil — und ist mit 1226 s die **langsamste** Zelle des Feldes bei den wenigsten Tokens (F-1.18.1, F-1.18.4) |
| `exact-sol-v1.2.1-measured-model-pi` | + Vorher/Nachher-Messung, Modell rechnet alle drei Metriken von Hand | [RQ-1.18](1.18-app-subordination-and-measurement-sol/findings.md) | Nimmt `cognitive_max`/`cognitive_avg`/`mccabe_max` — für +16 % Wallclock und +25 % Tokens (F-1.18.2) |
| `exact-sol-v1.2.2-measured-eslint-pi` | + ESLint für cognitive/McCabe, Mass weiter von Hand | [RQ-1.18](1.18-app-subordination-and-measurement-sol/findings.md) | Schlechteste Dekomposition der Mess-Arme bei +31 % Wallclock und +44 % Tokens |
| `exact-sol-v1.2.3-measured-tool-pi` | + ESLint **und** AST-Skript (`.pi/tools/app-mass.mjs`); Modell rechnet nichts | [RQ-1.18](1.18-app-subordination-and-measurement-sol/findings.md) | Teuerste Zelle (8.22 M Tokens, +78 %) ohne besseres Messergebnis als Handrechnung (F-1.18.3) |
| `exact-sol-v1-cc` | Port auf Claude Code (`.claude/commands/` + `rules/`) statt `.pi/skills/` | — | Andere Harness und andere Route. Runs existieren auf `opus-5-no-thinking` und `opus-4-8-no-thinking`; **nicht** mit den pi-Zellen poolen |
| `exact-sol-v1.3-stack-profile-pi` | Verbleibende TS/Vitest-Details in das vorhandene Stackprofil verschoben; keine neue Laufzeitgrenze | [RQ-stack-profile-extraction-sol](1.21-stack-profile-extraction-sol/findings.md) | **Main Line.** 20/20 frische Runs intern und extern korrekt; Completion invariant; übrige Unterschiede überwiegend innerhalb der Replikatstreuung, auf claim-office niedrigerer Complexity Peak |
| `exact-sol-v1.4-domain-boundary-trial-pi` | Auf dem local-Git-kontrollierten v1.3-Snapshot: derselbe Domain-Responsibility-/Boundary-Trial wie exact-tcr-v1.3, aber über Predictive predict/check/undo ohne TCR-Method-Commits; Stackprofile unverändert | `RQ-srp-effect-exact-tcr-sol` | Volle Korrektheit; auf claim-office nützliche, aber variable Zerlegung (13.0 ± 2.2 Funktionen) und schneller als TCR + Trial, während TCR + Trial konsistenter und stärker zerlegt (15.4 ± 0.9, niedrigerer `mccabe_avg`); auf GoL keine aufgelöste Methodendifferenz. Kein allgemeiner Ersatz der Predictive Main Line |

##### Was die vier RQs zusammen zeigen

**Die Linie schlägt die opus-Linie auf ihrem eigenen Terrain (RQ-1.17).** Bei konstantem
Modell, Kata und Prompt-Stil gewinnt `exact-sol-v1-pi` jede Dekompositions-Metrik
gegen `exact-hybrid-v4.2-phase-continuation-pi` — und gegen den inline-tdd-v1-Boden gleich mit:

| Metrik | inline-tdd-v1 (Boden) | `exact-sol-v1-pi` | `hybrid-v4.2` (opus-Linie) | Richtung |
|---|---:|---:|---:|---|
| `cc_avg_loc_per_function` | 8.45 | **6.60** | 9.52 | kleiner = besser |
| Complexity Peak | 27.0 | **18.0** | 24.0 | kleiner = besser |
| `cognitive_max` | 11.4 | **4.0** | 8.2 | kleiner = besser |
| `mccabe_max` | 9.8 | **5.4** | 6.2 | kleiner = besser |
| Smell Total | 4.2 | **0.0** | 9.6 | kleiner = besser |
| Code Mass (APP) | 750.0 | 556.8 | **492.4** | Mechanismus-Zeuge |

Der Mechanismus ist der Refactor-Brief selbst. `refactor.md` der opus-Linie bepreist
Extraktion (**Invocation (Mass: 2)**) — eine extrahierte Funktion wird doppelt
belastet, einmal fürs Existieren und einmal je Aufrufstelle. Mass-Minimierung
belohnt also Inlining, und die Zelle tut genau das: wenigster Code, in die wenigsten
Stücke geschnitten (6.6 Funktionen gegen 9.8). Der eingebaute Schutz dagegen
("Rule 2 trumps APP: Clarity over low mass") hält auf Sol nicht.

**Nichts, was seither draufgesetzt wurde, hat sich bezahlt gemacht (RQ-1.18).**
Vier Varianten, alle bei 100 % Korrektheit, keine besser als die nackte Referenz:
Die Basis hält `cc_avg_loc_per_function` (gleichauf mit Arm A, beide innerhalb 1 σ),
`cc_median_loc_per_function`, Production LoC und Duration allein. Die Mess-Arme
nehmen `cognitive_max` und `mccabe_max` — für +16–35 % Wallclock und +25–78 % Tokens
gegen die Basis. F-1.18.1 in einem Satz: Subordination verhindert den Schaden,
erzeugt aber keinen Gewinn.

Zwei Nebenbefunde, die über die Sol-Linie hinaus gelten:

- **Dauer und Tokens sind auf reasoning-on-Routen keine austauschbaren Kostenproxys
  (F-1.18.4).** Arm A ist die langsamste Zelle bei den *wenigsten* Tokens: ein
  längerer, präskriptiverer Brief schlägt sich als Denkzeit nieder, nicht als
  Output-Volumen. Ein Brief-Längen-Effekt ist in der Token-Spalte unsichtbar.
- **Prosa-Vorschriften ohne mechanische Durchsetzung werden bestenfalls teilweise
  befolgt (F-1.18.5).** Alle drei Mess-Arme waren angewiesen, *jedes* Refactoring mit
  einer Messung zu klammern; ein B1-Run lieferte einen einzigen Messblock auf 30
  Refactorings, ein anderer 46 auf 32. Die Effekte in F-1.18.2/F-1.18.3 sind damit
  Untergrenzen. Der Hebel wäre ein Marker pro Messung — so wie die Phasen-Marker,
  ohne die der Parser einen Run verwirft.

##### Empfehlung

- **Große, novelle Specs (claim-office-artig) auf Sol/Subscription: `exact-sol-v1.3-stack-profile-pi`.**
  Methodisch bleibt dies die schlanke Four-Rules-Fassung ohne Mass-Metrik, Messung oder
  Subagent; gegenüber `exact-sol-v1-pi` sind ausschließlich die verbliebenen
  TypeScript/Vitest-Details in das vorhandene Stackprofil verschoben. RQ-1.21 hält
  Korrektheit und Completion in 20/20 frischen Runs und findet keinen klaren Laufzeit-
  oder Kostenaufschlag. Der Preis der nativen Linie gegen den inline-tdd-v1-Boden bleibt
  der Gegenwert der Qualitäts- und Vorhersagbarkeits-Lücke aus F-1.16.1.
- **Kleine oder trainingsbekannte Katas (game-of-life, sphinx-score) auf Sol/Subscription:
  `baseline-inline-tdd-v1-pi`.** Die native Linie schlägt den Boden dort nicht und kostet 3.2×
  (GoL, F-1.16.2) bzw. 3.6× (sphinx, F-1.16.7) mehr. Auf sphinx aus einem anderen Grund
  als auf GoL: dort lösen die Metriken überhaupt nichts auf.
- **Keine der fünf Refactor-Zusatzvarianten ist als Default empfohlen.** Der
  Subagent-Arm ist verworfen, die vier APP-/Mess-Varianten sind kostenneutral bis
  teurer ohne Qualitätsgegenwert. Die Stackprofil-Variante ist keine zusätzliche
  Refactor-Methodik, sondern die vollständig geschichtete Main Line.
- **`sphinx-score` nicht für Workflow-Vergleiche auf Sol verwenden** (F-1.16.7). Als
  billige Korrektheits-Probe bleibt es brauchbar. Vor Zellen auf einem neuen
  Kata-Modell-Paar: `cc_functions` an einem einzelnen Probe-Run prüfen — ein Mittel
  nahe 1 heißt, dass keine Dekompositions-Metrik etwas auflösen wird.

##### Offene Fronten

- **Modell-Achse.** Alles oben ist auf **einem** Modell gemessen (`gpt-5-6-sol-codex`).
  [RQ-spark-vs-sol](../questions-pi/1.4-spark-vs-sol/findings.md) hat die Achse auf
  sphinx geöffnet (Spark hält die Korrektheit nicht),
  [RQ-astra-native-sol](../questions-pi/1.6-astra-native-sol-line/) öffnet sie auf
  claim-office für GPT-6 Astra — und prüft damit, ob F-1.17.1 eine Eigenschaft des
  Briefs oder eine Eigenschaft von Sol ist.
- **Route.** Ob F-1.16.1 auf der Requesty-Route überlebt oder mit dem Routen-Effekt
  (F-1.3.6) verschränkt ist, ist offen — die claim-office-Zellen müssten auf
  `gpt-5-6-sol` neu laufen.
- **Größe vs. Novelty.** Die Inversion zwischen claim-office und game-of-life ist
  belegt, ihre Ursache nicht: `sphinx-score` war als Novelty-Kontrolle vorgesehen und
  hat nichts aufgelöst (F-1.16.7). Eine echte Mittelgröße (`claim-office-lite`) steht aus.
- **Woher der Vorteil der Referenz kommt** — Methodik oder Abwesenheit von APP — ist
  nicht getrennt. Der Test wäre, den APP-Brief der opus-Linie bei konstanter Architektur
  in die native Linie zu tauschen.

### hybrid-v2-Reduktionslinie (aktuell aktiv)

Alle Varianten leben unter `experiments/workflows/exact-coding/opus/exact-hybrid-v2*` und differieren nur in den fünf Workflow-Files (`commands/test-list.md`, `commands/red.md`, `commands/green.md`, `agents/refactor.md`, `rules/tdd.md`). Settings, Marker und Subagent-Mechanik identisch zu `exact-hybrid-v2-testlist-fix-cc`.

| Variante | Was anders vs Basis | Treiber-RQ | Kernbefund |
|---|---|---|---|
| `exact-hybrid-v2-testlist-fix-cc` | — (Basis) | — | Vollständige MUST/CRITICAL/🚨-Imperative + PEP + Emoji |
| `exact-hybrid-v2.1-no-pep-cc` | "Psychological Resistance"-Sektion und motivierende Inline-Kommentare in red/green raus | [RQ-1.1](1.1-pep-effect-v6.1/findings.md) | Korrektheit invariant auf GOL; +67 % Refactorings, +30 % Wallclock. **Auf claim-office −3 pp Korrektheit** (RQ-1.4) |
| `exact-hybrid-v2.2-no-emoji-cc` | 95 Decoration-Emojis (✅❌🔴🟢🔄📋🚨⚠️) raus | [RQ-1.2](1.2-emoji-effect-v6.1/findings.md) | Korrektheit invariant auf GOL; +29 % Refactorings, **spart KEINE Tokens** (sogar +8.5 %). **Auf claim-office −20 pp Korrektheit** (1× Komplett-Failure, RQ-1.4) |
| `exact-hybrid-v2.3-no-pep-no-emoji-cc` | beide Reduktionen kombiniert | [RQ-1.3](1.3-pep-emoji-combined-v6.1/findings.md), [RQ-1.4](1.4-pep-emoji-claim-office/findings.md) | Effekte nicht additiv; kombiniert refactoriert *unter* Baseline. **Auf claim-office −5 pp Korrektheit** |
| `exact-hybrid-v2.9-stack-profile-cc` | alle konkreten TS/Vitest-Details aus Core, Phasen und Refactor-Agent in das vorhandene `tdd_with_ts_and_vitest.md` verschoben; keine neue Datei-Grenze | `RQ-stack-profile-extraction-opus` | **Offen.** Prüft, ob die bestehende Profilgrenze ohne Verhaltensverlust vollständig werden kann |
| `exact-hybrid-v3-with-why-cc` | 3 Why-Blöcke aus v6.5-lean (green.md, red.md Step 7, rules/tdd.md) **bei voll erhaltenen MUSTs** | [RQ-1.5](1.5-why-block-effect-v6.1/findings.md) | Korrektheit invariant auf claim-office (1× Outlier 0.27); +87 % Refactorings, −87 % Smells, Spitzen-Komplexität −37–43 % bei σ −82–90 %; +53 % Wallclock, +22 % Tokens |
| `exact-hybrid-v4-cleaned-cc` | exact-hybrid-v3-with-why-cc + 3 Hygiene-Cleanups aus archiviertem v6.5.1-Audit (`pnpm test:unit:basic`→`pnpm test`, rule-file-Hyphen, settings-Permission-Dedup; `refactor.md` role-neutral; `tdd-experiment-mode.md` ohne Phantom-HITL-Framing) | [RQ-1.6](1.6-v62-cleanup-validation-v61-with-why/findings.md) | Korrektheit nicht schlechter (Mean 0.91→0.96 inkl. hybrid-v2-Nudge-Outlier); +34 % Refactorings, cycle_count-Streuung σ 14.2→1.6; +13 % Wallclock, +12 % Tokens. Cleanups verhaltens-äquivalent, **neue Default-Baseline** |
| `exact-hybrid-v4.3-audit-bundle-cc` | exact-hybrid-v4-cleaned-cc + restliche Audit-Bundle-Items aus archiviertem v6.5.1-Audit: **Klasse 2** Rationale-Ergänzungen (measurement-pipeline-Rationale für Pflicht-Refactoring, Bisectability für ONE-at-a-time, konkreter Drei-Pfad-Bar für "no improvement possible", Green-Phase-Generalization-Rationale in test-list Step 3) + **Klasse 3** Red-Phase-Hardening (Mandatory-Procedure-Preamble, Streichung "STOP and explain" in Steps 3/6, Ersatz "Prediction Failure Protocol" → "Wrong Predictions Are Data"). Plus opt-in `HUMAN-IN-THE-LOOP.md` im Workflow-Root für nicht-autonome Profile (Prediction-Failure → Human-Escalation). | [RQ-1.8](1.8-audit-bundle-effect-v62/findings.md) (GoL) + [RQ-1.9](1.9-audit-bundle-validation-claim-office/findings.md) (claim-office) | **GoL (RQ-1.8):** Korrektheit invariant (100 % `tests_passing`); `tests_passed_immediately` 0.7 → **0** (deterministisch); `refactorings_applied` +10 % bei σ −64 %; Code-Qualität innerhalb 1 σ (leichte Verbesserung Code-Mass/Smell); `predictions_correct_rate` 100 → 97.4 %; +16 % Tokens, Wallclock neutral. **claim-office (RQ-1.9): `verification_pct` kippt 0.96 → 0.35 (bi-modal, 6/8 Runs ≤ 0.30)** — Agent erklärt sich nach 7–14 Cycles fertig statt 37–38 Cycles wie hybrid-v4; `experiment-done.txt` fehlt in 6/8 Runs. **Nicht** als Default-Baseline für claim-office promoten — bleibt GoL-spezifischer Quality-Champion |
| `exact-hybrid-v4.1-refactor-vocab-cc` (**verworfen**) | exact-hybrid-v4-cleaned-cc + additiver Vokabular-Block in `refactor.md` (Cyclomatic + Cognitive Complexity, Single Responsibility, Smell→Move-Tabelle mit 10 Einträgen) zwischen Naming Evaluation und Rule 3. Naming, APP, Process-Steps, Beispiele, Red-Flags byte-identisch. Keine numerischen Schwellwerte. | [RQ-1.10](1.10-refactor-vocab-effect-v62/findings.md) | **claim-office: `verification_pct` 0.96 → 0.23 (4/5 Runs ≤ 0.13, 1/5 bei 0.93)** — Agent self-terminiert nach 7-22 statt 36-40 Cycles, `code_mass` halbiert. Selbes Bundle-Kata-Asymmetrie-Muster wie exact-hybrid-v4.3-audit-bundle-cc. **GoL:** Komplexitäts-Metriken innerhalb 1 σ der Baseline (kein robuster Gewinn), +12 % `code_mass`, +14 % Wallclock, +15.5 % Tokens. Goodhart-Caveat: `cognitive_*`/`mccabe_*` werden im Block explizit benannt → Compliance-Metriken, asymmetrischer Vergleich. **Verworfen**; exact-hybrid-v4-cleaned-cc bleibt Default |

### Tragende Inhalte — vor jeder Reduktion schützen

1. **Vier Marker aus `MARKERS.md`** (Skill-Tool-Aufrufe; `Red Phase Complete`-Sentinel; Prediction-Lines per Regex `(- |✅ |❌ )(Correct|Incorrect)`; `experiment-done.txt`).
2. **Predictions-verbatim-Block in `red.md` Step 7** — ohne diesen mergen Cycles die zwei Prediction-Lines zu einer, `predictions_total` halbiert sich.
3. **"Mandatory refactoring attempt" in `refactor.md`** — ohne explizite Pflicht überspringt das Modell die Refactor-Phase auf einfachen Tests; `refactorings_applied` fällt.
4. **APP-Mass-Berechnung in `refactor.md`** — nicht für die Metrik (die wird extern berechnet), sondern weil der explizite Vorher/Nachher-Vergleich das Modell zwingt, Refactorings *messbar* zu machen statt nur kosmetisch.
   - **Modell-Caveat (bindend):** Das gilt für die hybrid-v1-Linie auf Opus. Auf Sol/pi kehrt sich der Effekt um — RQ-1.17 F-1.17.1 misst denselben Brief als *Ursache* der schlechtesten Dekomposition im Feld, schlechter als der strukturlose inline-tdd-v1-Boden, weil die Mass-Tabelle Extraktion bepreist und damit Inlining belohnt. Punkt 4 ist also kein modell-portabler Schutz, sondern eine Opus-Beobachtung. Vor der Übernahme auf ein neues Modell zu validieren.

### Aktuelle Front

- **Default für korrekheits-kritische Arbeit (exact-coding baseline) auf opus-5-no-thinking × Claude Code:** `exact-hybrid-v2-testlist-fix-cc` (RQ 4.5 / RQ-workflow-reduction-opus5, Trägerentscheidung aus RQ-1.19). Begründung steht in den Unterpunkten unten — sie ist bewusst aus dieser Zeile herausgehalten, weil der exact-coding-baseline-export-Skill den Workflow-Namen per Backtick-Match aus genau dieser Zeile zieht und sie deshalb genau einen Backtick-Namen tragen darf.
  - Das exact-coding-Profil ist eine **Abwägung von Qualität gegen Dauer**: hohe Qualität zählt, aber nicht zu jedem Preis. Die hybrid-v2-Linie trifft diesen Punkt auf opus-5 am besten — sie liefert **86 % des Dekompositionsgewinns von hybrid-v6 bei 47 % der Wallclock und 60 % der Tokens** (claim-office: `cc_avg_loc_per_function` 4.04 gegen v6.6s 3.21 bei 9.18 für strukturloses inline-tdd-v1; 44 min gegen 93 min). Der Schritt auf hybrid-v6 kauft die letzten 14 % mit +111 % Wallclock — das ist die Grenze, an der die Abwägung kippt.
  - **Messgrundlage und Export-Träger sind wieder dieselbe Datei.** Bis 2026-09 war `exact-hybrid-v2.4-lab-split-cc` der Träger, weil sein Dateilayout den Export vereinfachte: Lab-Infrastruktur isoliert in `rules/lab-only.md`, die beim Export nur gelöscht werden musste. RQ-1.19 hat diesen Komfort bepreist und die Wahl zurückgenommen. Der Export geht damit wieder den klassischen Weg — `rules/tdd-experiment-mode.md` wird nicht kopiert, sondern durch `templates/tdd-execution-mode.md` ersetzt, das die Subagent-Prompt-Kontrakte mit reproduziert. Der Skill erkennt das selbst (`SKILL.md` Step 1: kein `lab-only.md` → `LAYOUT=legacy`); es ist kein Umbau nötig.
  - **Der Regel-Split kostet, und zwar unabhängig vom Textvolumen.** RQ-1.19 (`research/workflow-dev/1.19-lab-split-neutrality/`, vier Workflows, claim-office n=13/10/5/5) misst auf claim-office eine Refactor-Rate von 0.41 (hybrid-v2) gegen 0.52 (hybrid-v2.8), 0.56 (hybrid-v2.7) und 0.69 (hybrid-v2.4), bei praktisch gleicher Zyklenzahl. Entscheidend ist `exact-hybrid-v2.8-pure-split-cc`: eine reine Partition von hybrid-v2 bei **+3,5 % Regeltext**, die trotzdem +27 % Refactorings (Welch p = 0.009) und +20 % Wallclock (p = 0.034) zeigt. Damit ist die Volumen-Erklärung widerlegt — es ist die Aufteilung selbst. Qualitätsgegenwert ist auf keiner Kata messbar (alle Metriken innerhalb 1 σ). Details: F-1.19.1 bis F-1.19.3.
  - **Der Always-Refactor-Kipper gehört zum Zusatztext von hybrid-v2.4, nicht zum Split.** Läufe, die nach *jedem* Zyklus refaktorieren, sind die teuersten im Feld (claim-office 4860–5923 s gegen 2400–3700 s). Quote über beide Katas: hybrid-v2 0/18, hybrid-v2.8 1/15, hybrid-v2.7 2/10, hybrid-v2.4 4/10 (Fisher gegen hybrid-v2: nur hybrid-v2.4 trennt, p = 0.010). Verdächtig ist die zweite Nennung des Zyklus in `lab-only.md` § "Phase Continuation" ("Red/Green/Refactor for every test", "After Green → launch the refactor subagent") — hybrid-v2.4 zählt den Zyklus zweimal auf, hybrid-v2 einmal. F-1.19.5.
  - **Korrektheit trennt hier nichts, und die Metrik taugt dafür auch nicht.** Auf claim-office liegen alle vier Workflows bei `verification_pct` 0.95–0.96. Über alle 33 Läufe scheitert ausnahmslos derselbe der 15 Verifikationsfälle (`14-family-steinheim`), immer mit demselben falschen Wert — die Metrik ist auf dieser Kata ein Bit, kein Grad. Die frühere Aussage, hybrid-v2.4 falle korrektheitsseitig ab (2/5 gegen 4/5), war ein n=5-Artefakt: hybrid-v2 liegt bei n=13 selbst nur bei 6/13. F-1.19.4. Wer maximale Code-Qualität ohne Kostenschranke braucht, nimmt weiterhin `exact-hybrid-v6-lab-split-cc` — das ist eine bewusste Profil-Abweichung, kein Upgrade, und erbt den hier gemessenen Split-Aufpreis.
  - **Externe Loops sind auf dieser Kata korrektheitsseitig nicht schlechter.** RQ-4.7 ersetzt den inneren Loop bei gleichem Example-Mapping-Einstieg durch zwei vendorte Fremd-Skills: `external-superpowers-2026-09-04-cc` und `external-pocock-2026-09-04-cc` erreichen auf claim-office × opus-5-no-thinking beide `verification_pct` 1.00 in 5/5 Läufen — bei 7× kürzerer Wallclock und 10× weniger Tokens. Der Preis ist die Dekomposition: `cc_avg_loc_per_function` 4.49 (hybrid-v2.4) gegen 7.90 (superpowers-2026-09-04) und 10.41 (pocock-2026-09-04). Das ist **keine** Empfehlung, den Export auf einen Fremd-Skill umzustellen — n=5, eine Kata, ein Modell, und beide Fremd-Skills sind Snapshots ohne Pflegezusage. Es begrenzt aber, was der Subagent-Apparat rechtfertigt: er kauft Dekomposition, nicht Korrektheit.
  - **Harness-Verzweigung bleibt.** Der Export liefert weiterhin pro Harness einen eigenen Config-Teilbaum (`.claude/`, `.opencode/`, `.cursor/`, `.pi/`) im Snapshot-Wurzelverzeichnis; siehe `exact-coding-baseline-2026-07-28` als Referenz. Die Trägerentscheidung betrifft nur, aus welchem Lab-Workflow die Claude-Code-Hälfte erzeugt wird, nicht die Mehr-Harness-Ausgabe.
  - **Harness-Caveat (bindend):** gemessen ist ausschließlich Claude Code. Für pi existiert `exact-hybrid-v2-testlist-fix-pi`, aber kein einziger opus-5-Run; für OpenCode und cursor existiert hybrid-v2 gar nicht. Auf Sol/pi ist die Architektur-Achse zudem ein Netto-Negativ — dort schlägt strukturloses inline-tdd-v1 jede Architektur (RQ-architecture-axis-sol-pi F-1.6). Diese Empfehlung darf nicht auf andere Harnesse übertragen werden, bis sie dort repliziert ist.
  - **Modell-Caveat:** gilt für opus-5. Auf opus-4-8 bleibt `exact-hybrid-v5-end-refactor-cc` der Default (RQ-1.13: niedrigste Spitzen-Komplexität auf beiden Katas, cognitive_max claim-office 3.6→2.8, GoL 5.6→2.4, deterministisch smell_total = 0, auf claim-office 5/5 perfekte Korrektheit); auf opus-4-7 ist der Spitzen-Sieger hybrid-v4.4 (Refactor-Hebel ist nicht modell-portabel, siehe unten). exact-hybrid-v4-cleaned-cc bleibt die parsimonische Baseline (minimale code_mass/Kosten) und Vorgänger-Referenz.
- **Default für Code-Qualität auf trainingsbekannten Katas (GoL) × opus-4-7-portkey-no-thinking:** `exact-hybrid-v4.3-audit-bundle-cc` (RQ-1.8). Eliminiert `tests_passed_immediately` deterministisch, +10 % Refactorings bei σ −64 %. **Nur** auf GoL/saturierter Korrektheit — auf claim-office bricht der Workflow (RQ-1.9).
- **Default für Speed/Token-Effizienz, trainingsbekannte Katas:** `exact-hybrid-v2.1-no-pep-cc` auf GOL. Auf claim-office nicht empfohlen.
- **Default für Methoden-Vergleichs-RQs (Reduktions-Kette):** `exact-hybrid-v2-testlist-fix-cc` als Baseline.
- **Default auf Sol/pi (OpenAI-Subscription-Route):** kata-abhängig, und die opus-Linie ist in beiden Fällen nicht die Antwort. Große novelle Specs → `exact-sol-v1.3-stack-profile-pi`; kleine oder trainingsbekannte Katas → `baseline-inline-tdd-v1-pi`. Die Promotion von v1.3 stützt RQ-1.21: vollständige TS/Vitest-Auslagerung bei 20/20 korrekten frischen Runs auf game-of-life und claim-office, ohne klare Laufzeit- oder Kostenregression. Begründung der Methodenwahl und die fünf verworfenen Refactor-Varianten: Abschnitt "Varianten der Sol-Linie und ihr Stand" oben (RQ-1.16 bis RQ-1.18, RQ-1.21).
- **Metric-driven Refactor lohnt über hybrid-v4, aber der wirksame Hebel-Zeitpunkt ist kata- UND modell-abhängig — kein globaler hybrid-v4-Ersatz.** Validiert in RQ-1.12 (opus-4-7) und RQ-1.13 (opus-4-8), je hybrid-v4 / v6.4-per-cycle / exact-hybrid-v5-end-refactor-cc × claim-office + game-of-life. Korrektheit durchgehend gehalten (kein Bundle-Bruch). Der Spitzen-Komplexitäts-Sieger **wechselt mit dem Modell**:
  - **opus-4-7:** der per-cycle-Refactor `exact-hybrid-v4.4-metric-refactor-cc` ist auf BEIDEN Katas der robuste Sieger (cognitive_max: claim-office 5.0→2.4, GoL 4.0→2.2; jeweils ≥ 1 σ). `exact-hybrid-v5-end-refactor-cc` wirkt nur auf mehrteiligen Codebasen (claim-office: gleichauf mit hybrid-v4.4 + kleinste code_mass durch Cross-file-Konsolidierung); auf der einteiligen GoL-Library ist hybrid-v5 von hybrid-v4 ununterscheidbar und erhöht code_mass.
  - **opus-4-8:** `exact-hybrid-v5-end-refactor-cc` hat auf BEIDEN Katas die niedrigste Spitzen-Komplexität (cognitive_max: claim-office 3.6→2.8, GoL 5.6→2.4); `hybrid-v4.4` fällt auf claim-office auf hybrid-v4-Niveau zurück (3.6 = 3.6, kein per-cycle-Gewinn). Der v6.5-Cross-file-Mehrwert aus 4.7 (kleinere code_mass) verschwindet auf 4.8 im σ-Rauschen — auf beiden Katas liegen alle drei code_mass-Means innerhalb 1 σ. Was bleibt, ist eine allgemeine Komplexitäts-Senkung, kein spezifischer Cross-file-Hebel.
  - Kata-übergreifend robust auf beiden Modellen ist nur `smell_total` = 0 (hybrid-v4.4/hybrid-v5 deterministisch sauber). Kosten steigen monoton mit der Refactor-Intensität (GoL: hybrid-v4.4 +17–18 %, hybrid-v5 +29–48 % Wallclock); hybrid-v4.4 ist auf großen Codebasen kosten-unvorhersehbar (per-cycle-Messung divergiert auf 4.7; auf 4.8 token-sparsamer).
  - **Empfehlung:** Der Default hängt davon ab, was Vorrang hat. Wenn **Kosten** zählen (parsimonisch, minimale code_mass): `exact-hybrid-v4-cleaned-cc`. Wenn **Korrektheit + Code-Qualität vor Kosten** rangieren (exact-coding-Profil): auf 4.8 `exact-hybrid-v5-end-refactor-cc` (siehe Front-Eintrag oben — niedrigste Spitzen-Komplexität auf beiden Katas, smell_total 0, robusteste claim-office-Korrektheit; Preis ist GoL-Wallclock +29 %), auf 4.7 `hybrid-v4.4` (dortiger robuster Spitzen-Sieger). Der Refactor-Hebel ist nicht modell-portabel und vor Einsatz pro Modell zu validieren. Auf 4.8 ist die nackte hybrid-v4-Baseline auf claim-office zudem weniger robust (1/5 CLI-Vertragsbruch durch Workflow-Umgehung, RQ-1.13 F-1.13.2), den hybrid-v4.4/hybrid-v5 nicht zeigen.
- **Niemals als Default verwenden:** `exact-hybrid-v2.2-no-emoji-cc`, `exact-hybrid-v2.3-no-pep-no-emoji-cc`, `exact-hybrid-v4.3-audit-bundle-cc`, `exact-hybrid-v4.1-refactor-vocab-cc` auf novel Code mit echten Mehrdeutigkeiten. Alle vier haben dokumentierte Korrektheits-Brüche auf claim-office (RQ-1.4, RQ-1.9, RQ-1.10).

---

## Methodik

### Leitprinzipien

#### 1. Theory of Mind statt MUSTs (oder neben MUSTs)

Direkt aus `~/.claude/skills/skill-creator/SKILL.md` (Zeilen 139, 302):

> *"Try to explain to the model why things are important in lieu of heavy-handed musty MUSTs. Use theory of mind and try to make the skill general and not super-narrow to specific examples."*
>
> *"Today's LLMs are smart. They have good theory of mind and when given a good harness can go beyond rote instructions."*

Empirisch in [RQ-1.5](1.5-why-block-effect-v6.1/findings.md) bestätigt: Why-Blöcke neben MUSTs (nicht statt) liefern messbar bessere TDD-Disziplin und Code-Qualität. Konkret bei `exact-hybrid-v3-with-why-cc` vs `v6.1-hybrid` auf claim-office:

- +87 % Refactorings, −87 % Smells
- Spitzen-Komplexität (`cognitive_max`, `cc_longest_function`, `mccabe_max`) −37 bis −43 % im Mean, **σ −82 bis −90 %**
- Korrektheit invariant (1× Outlier in 8 Runs, sonst 100 %)

Beispiel-Muster — `red.md` Step 7 in `exact-hybrid-v3-with-why-cc`:

```
You MUST output the full Step 7 block verbatim with `Correct` or `Incorrect`
chosen for each prediction. Do not abbreviate. Do not collapse the two
prediction lines into one.

**Why this format matters:** The block is mechanically parsed to compute
`predictions_correct_rate`. The parser expects two lines matching
`(- |✅ |❌ )(Correct|Incorrect)` per cycle — one for the compilation prediction,
one for the runtime prediction. Collapsing them into a single line, summarizing
them as "both correct", or skipping the block entirely drops the predictions
count for this cycle to zero. Format consistency here directly drives a metric
the experiment measures.
```

Das `MUST output … verbatim` bleibt erhalten; der Why-Block steht **zusätzlich**, nicht ersetzend. Wichtige Lehre: **Why-Blöcke ersetzen Imperative nicht — sie kontextualisieren sie.** Reine Why-Variante (lean-Stil, MUSTs raus) ist hier nicht direkt getestet, aber das v6.5-lean-Bundle hat gleichzeitig MUSTs UND PEP entfernt und brach die Korrektheit; die Effekte sind verflochten (siehe Anti-Patterns).

#### 2. Reduktion vor Addition

Default-Hypothese: ein Workflow-File enthält zu viel, nicht zu wenig. Empirisch bestätigt für mehrere Inhaltsklassen — aber **kata-abhängig**:

- **Pep talks** ([RQ-1.1](1.1-pep-effect-v6.1/findings.md)): "Psychological Resistance", "Trust the process" — auf GOL Code-Qualität invariant, aber Disziplin verschiebt sich (no-pep refactoriert +67 %). Auf claim-office: −3 pp Korrektheit.
- **Decoration-Emojis** ([RQ-1.2](1.2-emoji-effect-v6.1/findings.md)): ✅❌🔴🟢🔄📋🚨⚠️ — auf GOL invariant, **spart KEINE Tokens** (sogar +8.5 %). Auf claim-office: 1/5 Komplett-Failure (Agent stoppte nach Test-List ohne Implementation), −20 pp im Mittel.

**Konsequenz:** Reduktion vor Addition gilt — aber jede Reduktion braucht **separat eine Korrektheits-Stichprobe auf einer Kata mit externer Verification-Suite** (claim-office × n ≥ 5). Reduktionen, die auf GOL "neutral" wirken, brechen auf novel Code regelmäßig. Siehe auch Anti-Pattern "Bundle-Reduktion ohne Korrektheits-Stichprobe".

#### 3. Was *nicht* gestrichen werden darf

Siehe "Tragende Inhalte" im Inventar. Vor jeder Reduktion gegenlesen.

#### 4. Architektur-Achse: Skill vs Subagent

Orthogonal zur Inhaltsfrage. Der Befund stammt aus der oneshot-v1-RQ-Kette (vor hybrid-v2-Rebuild, RQ-workflow-tradeoff) und ist unter hybrid-v2 nicht re-validiert; das RQ-Verzeichnis wurde in `953841cb` gelöscht. Der Pareto-Befund **exact-hybrid-v1-cc (nur refactor isoliert) > subagents-v1 (alles isoliert) > single-context-v1 (alles single-context)** wird in der aktuellen Linie als Architektur-Default übernommen (`v6.1-*` erbt diese Architektur), eine systematische Re-Validierung auf hybrid-v2-Basis steht aus.

**Lesart aus der archivierten Kette:** Isolation hilft dort, wo Frische-Perspektive Wert hat (refactor sieht Code mit neuen Augen). Sie schadet dort, wo Kontinuität nötig ist (red→green braucht Test-Listen-Kohärenz). Pauschal "mehr Isolation = besser" ist falsch.

#### 5. Mechanismus: `commands/` mit Skill-Tool — bewusste Entscheidung

Alle hybrid-v1.x-Workflows legen die drei TDD-Phasen als `.claude/commands/{test-list,red,green}.md` ab, ruft sie aber aus `rules/tdd.md` als `Skill({ skill: "..." })` auf. Das ist **kein Mismatch**, sondern bewusste Wahl.

**Grundlage:** Laut [Claude Code Slash-Commands-Doku](https://code.claude.com/docs/en/slash-commands) sind Custom Commands in Skills "merged" — `.claude/commands/<name>.md` und `.claude/skills/<name>/SKILL.md` erzeugen beide `/name` und sind für das Skill-Tool gleichwertig adressierbar. Commands sind explizit **nicht** deprecated ("Your existing `.claude/commands/` files keep working").

**Empirische Bestätigung:** Im RQ-1.5-Baseline-Run mit `commands/` + `Skill({skill: "..."})` waren 61 Skill-Aufrufe (43× `red`, 17× `green`, 1× `test-list`) erfolgreich; alle vier Marker-Metriken (cycle_count=43, predictions_correct_rate=96%, refactorings_applied=17) korrekt populiert.

**Warum nicht auf `skills/<name>/SKILL.md` migrieren?** Skills bieten zusätzlich: Supporting-Files-Verzeichnis, Auto-Invocation via `description`-Frontmatter, `disable-model-invocation`, `paths`-Trigger. Für unsere expliziten `Skill({skill:"..."})`-Aufrufe aus `tdd.md` bringt keine dieser Features einen Mehrwert. Eine Migration wäre kosmetisch und würde das Risiko bergen, dass das `description`-Frontmatter die Skill-Auswahl unbeabsichtigt mit-triggert.

**Konsequenz für Reduktions-RQs:** Workflow-Varianten erben die `commands/`-Struktur unverändert. Skill-Tool-Aufrufe in `rules/tdd.md` zählen weiter als Marker-1 (siehe `MARKERS.md`).

**Caveat-Quelle:** Ein archivierter `/blueprint-audit`-Lauf (v6.5.1, 2026-05-17) flaggte `commands/` + Skill-Aufruf als "wrong mechanism = silent zero metric" und empfahl Migration. Diese Behauptung ist durch obigen Befund klar widerlegt — vermutlich basierte sie auf einer früheren Claude-Code-Version, in der die Merge-Semantik noch nicht galt. Der Audit-Befund ist als historisches Artefakt zu lesen, nicht als aktuelle Empfehlung.

### Vorgehen beim Bauen einer neuen Workflow-Variante

1. **Hypothese formulieren**: welche *eine* Sache wird geändert? "Mehrere Dinge gleichzeitig" macht die Variante nicht testbar.
2. **Baseline kopieren** (in der Regel `exact-hybrid-v2-testlist-fix-cc`): `cp -r experiments/workflows/exact-coding/opus/exact-hybrid-v2-testlist-fix-cc experiments/workflows/<new-variant>`.
3. **Änderung anwenden** — minimal, in einem Satz dokumentierbar, der in die spätere RQ-README passt.
4. **MARKERS.md gegenlesen** — alle vier Marker noch intakt? Insbesondere bei Reduktionen leicht zu übersehen.
5. **Smoke-Run** (1× game-of-life-example-mapping × opus-4-7-no-thinking, ~5–8 min):
   ```bash
   ./experiments/docker/batch.sh <smoke-plan>
   jq '.summary_metrics | {cycle_count, refactorings_applied,
      predictions_correct, predictions_total}' \
      experiments/runs/<latest>/metrics.json
   ```
   Healthy: `cycle_count ≥ 3`, `refactorings_applied ≥ 1`, `predictions_total ≈ 2 × cycle_count`.
6. Falls Marker brechen → fixen, **nicht** in den n=10-Batch gehen.
7. **n=5 → n=8 oder n=10** in zwei Schritten, nicht in einem Rutsch. Bei n=5 sind Standardabweichungen oft so breit, dass scheinbare Befunde sich bei n=8+ auflösen oder umkehren.
8. **Wenn die Reduktion strukturell ist (Test-List, Refactor-Mandat) oder die RQ Code-Korrektheit berührt**: zusätzlich Korrektheits-Stichprobe auf claim-office-example-mapping × n ≥ 5. GOL-only-Validierung verbirgt Korrektheits-Brüche systematisch (siehe Anti-Pattern).

### Anti-Patterns aus realen Reduktions-Versuchen

#### Bundle-Reduktion ohne Korrektheits-Stichprobe

Eine RQ, die mehrere Reduktionen gleichzeitig testet (z.B. das archivierte `v6.5-lean` = no-app + no-rules + no-pep + no-emoji + Why-Rewrites), kann nur die Bundle-Wirkung messen — nicht, *welche* Komponente trägt. Das ist OK für eine erste Validierung ("kostet uns das Bundle nichts?"), wird aber zur **Katastrophe**, wenn das Bundle auf GOL gemessen wird und einen Korrektheits-Bruch auf novel Code (claim-office) versteckt.

**Konkret passiert:** Die v6.5er-Kette (v6.5-lean, .1, .2, .3, .4 + v6.6-leaner) wurde nur auf GOL gemessen und lief ~5 Iterationen auf einem Workflow, der auf claim-office `verification_pct` von 1.00 auf 0.38 senkte. Die gesamte Kette ist als Quelle für Korrektheits-Empfehlungen unbrauchbar; sie steht im Archiv. Die jetzige hybrid-v2-Linie ist der Neustart auf reparierter Basis.

**Lehre:** **Jede Workflow-Iteration braucht eine Korrektheits-Stichprobe auf einer Kata mit externer Verification-Suite** (claim-office-example-mapping × n ≥ 3), auch wenn die RQ primär Code-Qualität misst. Faktor-isolierte RQs (eine Reduktion pro RQ) sind Bundle-RQs vorzuziehen — sie kosten am Ende oft weniger, weil sie die kausalen Pfade direkt liefern.

**Empirisch belegt durch die hybrid-v2-Reduktionslinie:** RQ-1.1 (PEP), 1.2 (Emoji), 1.3 (kombiniert) und 1.4 (claim-office-Stresstest) haben in vier separaten RQs gezeigt, was das v6.5-lean-Bundle in einem Schritt versteckt hatte:
- Einzeleffekte auf GOL waren neutral (passt zur ursprünglichen Bundle-Lesart)
- Auf claim-office bricht die Korrektheit moderat (no-pep) bis katastrophal (no-emoji), und das **Disziplin-Muster kehrt sich um** (Refactor-Sieger ist hybrid statt no-pep)

#### Reduktion ohne Marker-Check

Häufiger Fehler: ein "leaner" Workflow streicht versehentlich den Predictions-verbatim-Block oder die "Mandatory refactoring"-Klausel. Die Runs laufen, aber `predictions_total` oder `refactorings_applied` fallen auf null/halb. Erst beim Aggregieren fällt es auf — dann ist der Batch bereits durch.

**Konsequenz:** nach jeder Reduktion *vor* dem Mehr-Replikat-Batch: Smoke-Run + jq-Check der vier Marker-Metriken (Healthy-Baseline aus MARKERS.md). Siehe Schritt 5–6 in "Vorgehen beim Bauen einer neuen Variante".

#### Subagent ohne Prompt-Kontext

Wenn green oder refactor als Subagent läuft (subagents-v1, hybrid-v2, green-refactor-v1), bekommt er *keinen* Memory-Zugriff auf den vorhergehenden Skill-State. Der Aufruf-Prompt muss alles enthalten: file paths, failing test name, current error, passing test count, recent green summary.

In `exact-hybrid-v2-testlist-fix-cc/.claude/rules/tdd.md` ist das als Required-Prompt-Context-Block ausformuliert. Wer ein neues Subagent-Workflow baut, sollte dieses Muster übernehmen — sonst halluziniert der Subagent Files oder verfehlt die aktive Test-Phase.

#### Shared-context-Files für Red/Green sind kein Korrektheits-Hebel auf 4.7

Die intuitive Annahme, dass Red/Green-Subagents besser performen, wenn sie persistente Spec-Notizen (`example-mapping/<feature>.md`, `tdd-journal.md`, `architecture-notes.md`) zwischen Aufrufen lesen, hält empirisch nicht. Auf claim-office × opus-4-7-portkey-no-thinking (RQ-tdd-correctness, 2026-05-22):

| Workflow | n | verification_pct | duration_s |
|---|---:|---:|---:|
| exact-subagents-v1-cc | 10 | 0.67 | 3693 |
| **exact-subagents-v2-testlist-fix-cc** | 5 | **0.96** | 3229 |
| exact-subagents-v2.1-shared-context-cc | 5 | 0.71 | 4538 |
| exact-subagents-v2.1.1-fake-it-green-cc | 2 | 0.70 | ~5500 |

subagents-v2 fügt *nur* eine "Cover every spec example"-Pflicht zum test-list-Subagent hinzu — sonst nichts. Damit erreicht es single-context-v1/hybrid-v1-Niveau bei niedriger Streuung. subagents-v2.1 erbt diesen Fix UND fügt shared example-mapping für Red/Green hinzu — trotzdem zurück auf 0.71 mit bimodaler Streuung.

**Lehre:**
- Wenn ein Subagent-Workflow auf novel kata schlecht performt (`verification_pct` < 0.8), prüfe ZUERST die Test-Listen-Vollständigkeit des `test-list`-Subagents. "Cover every spec example" mit Failure-Mode "Missing an entire operation described in the spec" ist die einfachste und stärkste Intervention.
- Spec-Sharing in Red/Green-Subagents lädt die Subagents zum Re-Interpretieren der Spec ein, statt sich auf den aktivierten Test zu konzentrieren. Die Spec gehört in die Test-Liste (durch test-list), nicht in Subagent-Memory.
- subagents-v2.1/subagents-v2.1.1 liegen archiviert in `experiments/workflows/_archive/`. Wer ähnliche Architektur-Ideen testen will: erst den verlinkten Befund lesen, dann begründen warum der Mechanismus diesmal anders ist.

Verweis: F-model-novel.4 in `research/questions/2.2-model-effect-novel-kata/findings.md`.

#### Additive Bundles haben dasselbe Bundle-Risiko wie Reduktions-Bundles

Das Anti-Pattern "Bundle-Reduktion ohne Korrektheits-Stichprobe" wurde ursprünglich an v6.5-lean (gleichzeitige Entfernung mehrerer Inhalte) festgemacht. RQ-1.9 und RQ-1.10 zeigen: **dieselbe Falle gilt für additive Bundles**, die Inhalt ergänzen statt zu streichen — und das Muster ist mittlerweile zwei Mal unabhängig reproduziert.

Konkret 1 — `exact-hybrid-v4.3-audit-bundle-cc`: ergänzt Rationale-Blöcke, Mandatory-Procedure-Preamble, Drei-Pfad-Bar, Wrong-Predictions-Block. Auf GoL (RQ-1.8) klar positiv. Auf claim-office (RQ-1.9) kippt `verification_pct` von 0.96 auf 0.35, weil der Agent in 6/8 Runs vorzeitig stoppt.

Konkret 2 — `exact-hybrid-v4.1-refactor-vocab-cc`: ergänzt rein Refactor-Vokabular (Complexity-Awareness + SRP + Smell→Move-Tabelle), nichts am Prozess. Auf GoL (RQ-1.10) Komplexitäts-Metriken innerhalb 1 σ (kein Gewinn), Kosten +14 %. Auf claim-office (RQ-1.10) bricht `verification_pct` von 0.96 auf 0.23, weil der Agent in 4/5 Runs nach 7-22 statt 36-40 Cycles aufhört und nur halben `code_mass` schreibt.

Beide Fälle zeigen dasselbe Mikro-Muster auf claim-office: Self-Termination nach <½ der Baseline-Cycles, `code_mass` halbiert, interne `tests_passing = true` (die _geschriebenen_ Tests sind grün), externe `verification_pct` kollabiert. Welche Komponente das Self-Stop-Verhalten triggert, ist mit Bundle-Befunden nicht entscheidbar — kausale Lokalisierung bräuchte isolierte Sub-RQs.

**Lehre:** Jede Workflow-Iteration — additiv wie reduktiv — braucht eine Korrektheits-Stichprobe auf einer Kata mit externer Verification-Suite (claim-office-example-mapping × n ≥ 5). "Wir ergänzen nur Rationales, kann nichts kaputt machen" ist falsch. Inhalt-Additionen können Self-Stop-Verhalten triggern, das auf saturierten Katas (GoL: 9 Tests, schnell durch) unsichtbar bleibt, auf Multi-Iteration-Katas (claim-office: 41 Tests) aber sofort zuschlägt.

Faktor-isolierte Sub-RQs bleiben Bundle-RQs vorzuziehen, weil sie die kausalen Pfade direkt liefern. Bundle-Validierung ist akzeptabel als erster Schritt, *wenn* die Korrektheits-Stichprobe auf novel Code von Anfang an mit drin ist.

#### Disziplin-Muster aus GOL nicht auf andere Katas verallgemeinern

Die GOL-basierten Disziplin-Befunde der hybrid-v2-Linie (RQ-1.1, RQ-1.2, RQ-1.3) sehen klar und konsistent aus: "weniger Drumherum → mehr Refactoring → mehr Disziplin". Auf claim-office (RQ-1.4) **kippt das Muster komplett**:

| Metrik | GOL-Sieger (RQ-1.3) | claim-office-Sieger (RQ-1.4) |
|---|---|---|
| `refactorings_applied` | no-pep (7.0) > hybrid (4.1) | **hybrid (11.6)** > no-pep (6.6) |
| `refactorings_applied` (kombiniert) | 3.8 (unter Baseline) | 9.8 (zwischen Reduktionen) |
| `verification_pct` | 100/100/100/100 (alle) | **1.00 nur in hybrid**, sonst 0.80–0.97 |

**Lehre:** Disziplin-Effekte aus trainingsbekannten Katas (GOL) sind kein Beweis für die gleiche Wirkung auf novel Code mit Mehrdeutigkeiten. Vor Recipe-Empfehlungen: auf claim-office gegenchecken.

### Wann eine Workflow-RQ keine Antwort liefern kann

Bei drei Konstellationen verschwendet ein n=10-Batch Tokens, weil das Signal strukturell fehlt:

- **Faktor und Kata kollidieren**: z.B. Refactor-Variante auf string-calculator — die Kata ist zu trivial, `smell_total` ist konstant 0, Komplexitäts-Metriken fluktuieren nicht. Code-Quality-Signal nur auf game-of-life und claim-office.
- **Faktor und Modell kollidieren**: TDD-Disziplin-Faktoren auf Haiku — Haiku hält die Skill-Discipline nicht; alle Workflows kollabieren auf `cycle_count ≈ 3`. Disziplin-Effekte nur sichtbar auf Opus.
- **Faktor ohne Mechanismus-Hypothese**: "green-refactor-v1 könnte besser sein als hybrid-v1, mal sehen" ist keine RQ. Wenn unklar ist, *welcher* Mechanismus einen Unterschied erzeugen sollte, ist auch unklar, welche Outcomes zu messen sind und welche Cells controlled bleiben müssen. Erst Hypothese, dann Plan.

---

## Tragende Befunde

Empirische Stützen für die Leitprinzipien oben. Geordnet nach Design-Achse.

### Theory-of-Mind / Why-Blöcke

- **[RQ-1.5 F-1.1](1.5-why-block-effect-v6.1/findings.md#f-11)** — Why-Blöcke neben MUSTs (exact-hybrid-v3-with-why-cc): kein Korrektheits-Effekt, aber +87 % Refactorings, −87 % Smells, Spitzen-Komplexität −37–43 %, σ −82–90 %. Hypothese H2 aus RQ-1.5 bestätigt. **Theory-of-Mind hat empirische Stütze aus diesem Repo, nicht nur die Anthropic-Skill-Creator-Doku.**
- **[RQ-1.5 F-1.2](1.5-why-block-effect-v6.1/findings.md#f-12)** — Pro Cycle gleich schnell/teuer; der ~50 % Wallclock-Aufschlag und ~22 % Token-Aufschlag pro Run sind reine Konsequenz des höheren Cycle-Counts, nicht Why-Bloat-Overhead.

### exact-hybrid-v4-cleaned-cc — Hygiene-Cleanups (v6.5.1-Audit-Subset auf exact-hybrid-v3-with-why-cc, RQ-1.6 + RQ-1.7)

Subset des archivierten v6.5.1-Blueprint-Audits, beschränkt auf strukturelle Hygiene ohne MUST-/Why-/Marker-Eingriff:

- **Konsistenz-Renames** in `red.md`: `pnpm test:unit:basic` → `pnpm test` (matched `tdd.md` und Tech-Stack-Rule).
- **Rule-File-Hyphen-Rename**: `tdd_with_ts_and_vitest.md` → `tdd-with-ts-and-vitest.md` (matched die Hyphen-Konvention aller anderen Rules).
- **Settings-Permission-Dedup** in `.claude/settings.json`: Entfernung redundanter `Bash(pnpm test:*)`, `Bash(pnpm install:*)`, `Bash(pnpm run:*)` (bereits durch `Bash(pnpm:*)` abgedeckt).
- **refactor.md-Entkopplung**: Mission-Beschreibung und Steps role-neutral umformuliert ("Guide the requester through a refactoring pass" statt "After Green phase / Proceeding to next test / Skipping refactor"). Agent-File definiert jetzt Rolle/Capability, die TDD-Sequenz lebt nur noch in `tdd.md`. "Build and Tests"-Sektion gestrichen (bereits in `tdd-with-ts-and-vitest.md` abgedeckt).
- **tdd-experiment-mode.md-Reframing**: Phantom-HITL-Override-Framing entfernt, ersetzt durch positive Aussage der autonomen Default-Mode mit Measurement-Pipeline-Rationale.

Explizit **nicht** Teil dieses Cleanup-Subsets (deshalb Reservierung für späteres hybrid-v4.3-Audit-Bundle): Rationale-Ergänzungen, Red-Phase-Mandatory-Procedure-Preamble, Wrong-Predictions-Block, Mechanism-Migration `commands/` → `skills/`. Siehe `experiments/workflows/exact-coding/opus/exact-hybrid-v4-cleaned-cc/.claude/` für die exakten Files.

- **[RQ-1.6 F-1.1](1.6-v62-cleanup-validation-v61-with-why/findings.md#f-11)** — Drei Hygiene-Cleanups aus dem archivierten v6.5.1-blueprint-audit (Konsistenz-Renames + refactor.md-Entkopplung + tdd-experiment-mode-Reframing) sind auf claim-office × opus-4-7-portkey-no-thinking **verhaltens-äquivalent**. Korrektheits-Bruch klar widerlegt (verification_pct Mean 0.91 → 0.96, tests_passing 100 %/100 %). Damit ist das in [v6.5-correctness-setback](https://) dokumentierte Risiko von skill-creator-Cleanups *für diese spezifische Auswahl* gebannt — die Cleanups haben MUSTs, Why-Blöcke und alle MARKERS unangetastet gelassen.
- **[RQ-1.6 F-1.2](1.6-v62-cleanup-validation-v61-with-why/findings.md#f-12)** — Disziplin-Drift in eine Richtung: +34 % `refactorings_applied`, `cycle_count`-Streuung kollabiert von σ 14.2 auf σ 1.6 (letzteres teils durch Wegfall des hybrid-v2-Nudge-Outliers). Mechanistisch plausibel: refactor.md-Entkopplung entfernt die "TDD Refactor Phase specialist"-Verkettungs-Hemmung und produziert mehr Refactor-Iterationen.
- **[RQ-1.6 F-1.4](1.6-v62-cleanup-validation-v61-with-why/findings.md#f-14)** — Kosten-Aufschlag +13 % Wallclock, +12 % Tokens — ausschließlich getrieben durch +7 % Cycles und +34 % Refactorings, **pro Cycle nicht teurer** (+5 % Tokens/Cycle im Noise). Streuung sowohl bei Wallclock als auch Tokens drastisch reduziert (σ ungefähr halbiert).
- **[RQ-1.7 F-1.1](1.7-v62-cleanup-validation-gol/findings.md#f-11)** — Cleanup-Äquivalenz generalisiert auf game-of-life: 100/100 Korrektheit auf beiden Workflows. Cross-Kata-Validierung der RQ-1.6-Empfehlung ist stabil.
- **[RQ-1.7 F-1.2](1.7-v62-cleanup-validation-gol/findings.md#f-12)** — Komplexitäts-Streuungs-Kollaps wiederholt sich auf GoL: `cognitive_max` −42 % Mean / σ −81 %; `mccabe_max` −22 % Mean / σ −64 %. Damit ist das in RQ-1.5 erstdokumentierte Muster (σ-Kollaps bei Spitzen-Komplexität durch mehr Refactorings) auch in der nächsten Workflow-Iteration und auf einer zweiten Kata reproduziert — robuster Mechanismus, nicht claim-office-spezifisch.
- **[RQ-1.7 F-1.4](1.7-v62-cleanup-validation-gol/findings.md#f-14)** — Kosten-Aufschlag auf GoL +13 % Wallclock / +15 % Tokens — fast identisch zu claim-office (+13 % / +12 %). Der "hybrid-v4-Aufpreis" ist also kata-unabhängig.

**Konsequenz für die Methodik:** Cleanups, die strukturell auf "Style-Hygiene" beschränkt bleiben (Renames, role-neutrale Sprache, Reframing ohne MUST-Eingriff), sind in dieser Größenordnung sicher anwendbar. Das ersetzt nicht die Pflicht zur Korrektheits-Stichprobe — bestätigt aber, dass nicht *jeder* Cleanup-Versuch die v6.5-lean-Falle reproduziert. Die Cross-Kata-Validierung in RQ-1.7 stärkt die hybrid-v4-Default-Empfehlung über die ursprüngliche claim-office-only-Aussage hinaus.

### Audit-Bundle (v6.5.1-Audit auf exact-hybrid-v4-cleaned-cc, RQ-1.8 + RQ-1.9)

Bundle aus zwei Item-Klassen, isoliert auf hybrid-v4-Basis getestet:
- **Klasse 2** — Rationale-Ergänzungen in `refactor.md` (Measurement-Pipeline für Pflicht-Refactoring; Bisectability für ONE-at-a-time; konkreter Drei-Pfad-Bar für "no improvement possible") und in `test-list.md` (Green-Phase-Generalization-Rationale für simple→complex).
- **Klasse 3** — Red-Phase-Hardening in `red.md` (Mandatory-Procedure-Preamble; Streichung "STOP and explain"-Klausel in Steps 3/6; Ersatz "Prediction Failure Protocol" → "Wrong Predictions Are Data" mit Backfill-Verbot).

Plus eine opt-in `HUMAN-IN-THE-LOOP.md` im Workflow-Root (kein Auto-Load, kein Mess-Effekt) für nicht-autonome Profile, in denen Prediction-Failures an den Menschen eskaliert werden statt als Daten zu zählen.

- **[RQ-1.8 F-1.1](1.8-audit-bundle-effect-v62/findings.md#f-181)** — Mandatory-Procedure-Preamble eliminiert vorzeitige Greens auf GoL deterministisch: `tests_passed_immediately` 0.7 ± 2.21 → **0 ± 0** (10/10 Runs). Pattern identisch zur archivierten v6.5-lean → v6.5.1-Präzedenz; der Effekt repliziert auf MUST/PEP-tragender hybrid-v4-Basis (nicht nur als v6.5-lean-Reparatur).
- **[RQ-1.8 F-1.2](1.8-audit-bundle-effect-v62/findings.md#f-182)** — Refactor-Rationale + Drei-Pfad-Bar erhöht und stabilisiert Refactoring-Disziplin: `refactorings_applied` 7.9 → 8.7 (+10 %), σ 1.85 → 0.67 (−64 %). Effekt-Größe kleiner als beim v6.5-lean-Bundle (Why-Blöcke in hybrid-v4 tragen bereits einen Teil der Rationale-Wirkung), σ-Reduktion klar.
- **[RQ-1.8 F-1.4](1.8-audit-bundle-effect-v62/findings.md#f-184)** — Wrong-Predictions-Block macht ehrliche Falsch-Predictions sichtbar: `predictions_correct_rate` 100 % → 97.4 % (auf GoL). Nicht Disziplin-Verlust, sondern intendierter Effekt des Backfill-Verbots. Auf claim-office (RQ-1.9) ebenfalls leichter Drop (97.2 → 94.9 %).
- **[RQ-1.8 F-1.5](1.8-audit-bundle-effect-v62/findings.md#f-185)** — Bundle kostet +16 % Tokens (replizierte v6.5.1-Präzedenz), aber Wallclock-neutral auf GoL — vermutlich kompensiert durch eingesparte vorzeitige-Green-Detours auf hybrid-v4-Basis.
- **[RQ-1.9 F-1.1](1.9-audit-bundle-validation-claim-office/findings.md#f-191)** — Cross-Kata-Validierung auf claim-office bricht: `verification_pct` 0.96 → **0.35** (bi-modal). Internal `tests_passing` 100 %, CLI baut — aber Implementation unvollständig.
- **[RQ-1.9 F-1.2](1.9-audit-bundle-validation-claim-office/findings.md#f-192)** — Bi-modale Vollständigkeit: 6 von 8 hybrid-v4.3-Runs ohne `experiment-done.txt`, mit 7–14 Cycles (vs hybrid-v4: 35–40) und 8–19 min Wallclock (vs hybrid-v4: 37–55 min). Der Agent erklärt sich nach wenigen vollständigen Cycles selbst fertig. Mechanismus-Hypothese: das Audit-Bundle erzeugt mehr Per-Cycle-Aufwand; auf Multi-Iteration-Katas interpretiert der Agent die Pflicht zur disziplinierten Cycle-Vollendung als implizites Fertig-Signal nach wenigen vollen Cycles.

**Konsequenz für die Methodik:** Das Audit-Bundle ist auf GoL eindeutig wirksam (Disziplin + Code-Qualität), aber auf novel Code mit echten Mehrdeutigkeiten brennt es die Vollständigkeit aus. hybrid-v4.3 ist als GoL-spezifischer Quality-Champion empfohlen, **nicht** als allgemeine Default-Baseline. exact-hybrid-v4-cleaned-cc bleibt Default für korrektheits-kritische Arbeit. Das ist die dritte unabhängige Bestätigung des "GoL-Sieger ≠ claim-office-Sieger"-Anti-Patterns (vgl. RQ-1.4 für Reduktionen + F-model-novel.4 für Architektur; jetzt RQ-1.9 für additive Bundles).

### Pep-/Emoji-Reduktion (hybrid-v2-Linie)

- **[RQ-1.1 F-1.1](1.1-pep-effect-v6.1/findings.md#f-11)** — Pep-Talks (`"Psychological Resistance"`, motivierende Inline-Kommentare) auf GOL: Code-Qualität invariant, Disziplin verschiebt sich (`refactorings_applied` +67 %, `tests_passed_immediately` −75 %). +30 % Wallclock, +21 % Tokens.
- **[RQ-1.2 F-1.1](1.2-emoji-effect-v6.1/findings.md#f-11)** — Decoration-Emojis auf GOL: Code-Qualität invariant, leichte Disziplin-Verschiebung wie bei Pep-Reduktion (+29 % Refactorings, −54 % Sofort-Grün).
- **[RQ-1.2 F-1.2](1.2-emoji-effect-v6.1/findings.md#f-12)** — Emojis sparen **keine Tokens** (sogar +8.5 % Tokens, +12 % Wallclock). Der erwartete "Compactness-Gewinn" tritt nicht ein, weil die Token-Last der 95 Emojis im Promille-Bereich liegt.
- **[RQ-1.3 F-1.1](1.3-pep-emoji-combined-v6.1/findings.md#f-11)** — Pep- und Emoji-Effekte **nicht additiv**: kombiniert refactoriert mit 3.8 *unter* Baseline 4.1 (additive Vorhersage wäre ~9.1). `tests_passed_immediately` saturiert bei no-pep-Wert.
- **[RQ-1.3 F-1.3](1.3-pep-emoji-combined-v6.1/findings.md#f-13)** — Kombinierte Reduktion ist auf GOL die schnellste Zelle (−15 % Wallclock vs Baseline), aber zum Preis der reduzierten Refactor-Aktivität, die die Einzelreduktionen als positiv ausgaben.
- **[RQ-1.4 F-1.1](1.4-pep-emoji-claim-office/findings.md#f-11)** — Auf claim-office: nur v6.1-hybrid hat 100 % `verification_pct`. no-emoji bricht auf 80 % (1× Komplett-Failure, Agent stoppte nach Test-List), no-pep auf 97 %, kombiniert auf 95 %. **GOL-Korrektheits-Invarianz übersetzt sich NICHT auf novel Code.**
- **[RQ-1.4 F-1.2](1.4-pep-emoji-claim-office/findings.md#f-12)** — Disziplin-Pattern kehrt sich um: auf claim-office refactoriert hybrid (11.6) am meisten, no-pep (6.6) deutlich weniger. Die GOL-Lesart "weniger Drumherum = mehr Disziplin" ist kata-spezifisch.
- **[RQ-1.4 F-1.3](1.4-pep-emoji-claim-office/findings.md#f-13)** — Recipe-Empfehlung kata-abhängig: GOL → `exact-hybrid-v2.1-no-pep-cc` als Quality-Choice; claim-office → `v6.1-hybrid` als einzige korrektheits-sichere Wahl.

### Architektur-Achse (auf hybrid-v2 nicht re-validiert)

Die oneshot-v1-RQs (gelöscht in `953841cb`, nur noch in der Git-Historie) etablierten exact-hybrid-v1-cc als Pareto-Optimum: red/green als Skills (Test-Listen-Kohärenz), refactor als isolierter Subagent (Frische-Perspektive). Die jetzige hybrid-v2-Linie erbt diese Architektur, eine systematische Re-Validierung auf hybrid-v2-Basis steht aus.

Falls auf hybrid-v2 re-validiert werden soll: separate RQ aufsetzen mit v6.1-hybrid (Default), v6.1-all-skills, v6.1-all-subagents als Vergleichszellen. Achtung: das ist eine Architektur-Variation, kein Reduktions-Test — sie fällt nicht unter "Reduktion vor Addition".

### Test-List-Vollständigkeit als Korrektheits-Hebel

- **F-model-novel.4** (`research/questions/2.2-model-effect-novel-kata/findings.md`) — "Cover every spec example"-Pflicht im test-list-Subagent ist die stärkste isolierte Intervention für `verification_pct` auf novel Katas. subagents-v2 = subagents-v1 + dieser eine Fix erreicht single-context-v1/hybrid-v1-Niveau (0.96 vs 0.67). Spec-Sharing in Red/Green hingegen verschlechtert das Ergebnis (subagents-v2.1: 0.71).

### Generalisierung über Modelle hinweg

Die oneshot-v1-Archiv-RQ-emoji-cross-model warnt: Reduktionen sind nicht modell-agnostisch. Auf Sonnet-4-6 vervielfacht Emoji-Entfernung die Korrektheits-Rate; auf opus-4-6 versagen beide Varianten gleich. Die hybrid-v2-Linie wurde primär auf opus-4-7 (no-thinking, Direct API und Portkey) gemessen — Übertragung auf andere Modelle braucht separate Replikation. Aktuelle Modell-Empfehlungen: `model-recommendation-matrix.md`.

---

## Verweise

- `experiments/workflows/MARKERS.md` — harte Parser-Anforderungen.
- `experiments/workflows/_archive/` — verworfene, aber sauber gemessene Workflow-Files (u. a. `exact-hybrid-v4.1-refactor-vocab-cc`, RQ-1.10).
- `git show 478a0c5e^:experiments/workflows/_archive/` — Workflow-Files der defekten hybrid-v1-Reduktionskette (v6.1-no-app, v6.2-no-rules, v6.3-no-pep, v6.4-no-emoji, v6.5-lean, v6.5.1–.4, v6.6-leaner) samt ihrer 144 Runs. Am 2026-08-17 gelöscht, weil die Kette auf korrektheits-defekter Basis lief und ihre Runs im aktiven Pool nicht als solche erkennbar waren; nur noch in der Git-Historie.
- `git show 953841cb^:research/_archive/workflow-dev-v1/` — RQs der oneshot-v1-Generation (RQ-context, RQ-workflow-tradeoff, RQ-app/rules/pep/emoji/lean/audit/bullets/targeted/refactor-cut/delayed-refactor). Am 2026-08-11 gelöscht, weil die Kette auf korrektheits-defekter Basis lief; nur noch in der Git-Historie.
- `research/workflow-dev/1.1-pep-effect-v6.1/` bis `1.5-why-block-effect-v6.1/` — aktuelle Reduktions-RQs auf hybrid-v2-Basis.
- `research/workflow-dev/v6-reduction-recipe.md` — Reduktions-Rezept (Schritt-für-Schritt-Methodik aus der ersten v6.5er-Kette, jetzt auf hybrid-v2-Basis re-anwendbar).
- `research/workflow-dev/model-recommendation-matrix.md` — pro Modell empfohlener Workflow.
- `research/kata-design/kata-construction.md` — Kata-Methodik.
- `~/.claude/skills/skill-creator/SKILL.md` — Quelle des Theory-of-Mind-Prinzips (Zeilen 139, 302).
