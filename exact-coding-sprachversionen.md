# EXACT Coding: Sprachversionen der Harnesses

Stand: 2026-09-13. Anlass: Java-Port von Oliver Roth (PR #2, jetzt `harness/copilot-java`).

## Problem

Die Branch-Liste in `exact-coding-exercises` mischt zwei Dimensionen:

- **Agent**: Claude Code (`main`), Copilot, Cursor, OpenCode, pi (`harness/*`)
- **Sprache**: TypeScript überall, seit PR #2 Java für Copilot, lokal existiert ein Branch `python`

Das ergibt eine Matrix Agent × Sprache. Jede Änderung am Workflow muss von Hand in
jede Zelle. Beispiel vom 2026-09-11: ESLint-Setup als 5 identische Commits, die
README-Änderungen als 6 identische Commits. Mit jeder weiteren Sprache wächst das
multiplikativ.

## Wo die Sprache heute steckt

Aus dem Java-Port und den Nacharbeiten. Pro Harness sind das rund zehn Dateien
plus Projektdateien:

| Datei | Sprachspezifisch |
|-------|------------------|
| `rules/tdd-with-<lang>.md` | Konventionen, Testbefehl, Test-Template |
| `skills/test-list` | Todo-Mechanik (`it.todo()` vs. `@Disabled`), Template |
| `skills/red` | Test aktivieren, Stub, erwartete Compiler- und Laufzeitfehler |
| `skills/green` | Beispiele für Minimal-Implementierungen |
| `skills/tdd` | Pfade, Testbefehl, Metrik-Tool |
| `skills/example-mapping` | eine Zeile (`it.todo()`) |
| `agents/refactor` | APP-Beispiel |
| `agents/end-refactor` | Linter, Befehl, Regelnamen, Pfade, McCabe-Details (z. B. Optional Chaining) |
| `rules/subagent-prompts` | Pfade, Metrik-Tool |
| `rules/human-in-the-loop` | Template-Text (`it.todo()`) |
| Projekt | `package.json` bzw. `pom.xml`, Lint-Config (`eslint.config.js` bzw. `pmd-ruleset.xml`), Beispielcode, `.gitignore` |
| `README.md` | Setup-Abschnitt, Workflow-Tabelle |

Sprachneutral sind dagegen: Phasenablauf, HITL-Logik, Marker und Reportformat,
Simple Design Rules, APP-Gewichte, Subagent-Isolation.

### Bereits vorhandene Profilgrenze

Beide originären Workflow-Familien besitzen schon ein TypeScript/Vitest-Profil:

- Opus/Hybrid: `.claude/rules/tdd_with_ts_and_vitest.md`
- Sol/Predictive TDD: `.pi/skills/predictive-tdd/stacks/typescript-vitest.md`

Das Problem ist daher **nicht**, erst eine referenzierte Profilform einzuführen.
Die Profilgrenze existiert bereits, ist aber unvollständig: Im Opus-Workflow
liegen konkrete Stackdetails weiterhin in `rules/tdd.md`, allen drei
Phasen-Commands und `agents/refactor.md`; im Sol-Workflow weiterhin in
`AGENTS.md` und `skills/test-list/SKILL.md`. Die nächste Frage ist, ob diese
Reste verlustfrei in das jeweils bestehende Profil verschoben werden können.

## Vorschlag: Sprache als eigene Schicht, Branches als Build-Ergebnis

### 1. Ein Sprachprofil pro Sprache

Alles Sprachspezifische liegt in einer Datei. Die Phasendateien verweisen darauf
("Run the test command from the language profile").

```markdown
---
language: java
test_command: mvn test
src_dir: src/main/java/
test_dir: src/test/java/
test_file: "<Feature>Test.java"
todo_marker: "@Disabled"
metrics_command: mvn pmd:check
metrics_config: pmd-ruleset.xml
cognitive_rule: CognitiveComplexity
---

## Test-List example
...

## Red example (activate test, stub, expected errors)
...

## Green example
...

## APP example
...
```

Die Code-Beispiele bleiben in der Zielsprache und werden **nicht** zu
Pseudocode. Für das Guessing Game ist es wichtig, dass das Modell echte Syntax und
echte Fehlermeldungen sieht ("cannot find symbol" vs. "Cannot find name").

### 2. Ein Quellbaum, ein Generator

Drei Eingaben ergeben die Harness-Verzeichnisse:

- **Kern**: Phasen, HITL, Marker, Reportformat
- **Agent-Adapter**: Frontmatter, Zielverzeichnis (`.claude/`, `.github/`, `.cursor/`, ...), Aufrufsyntax für Subagenten
- **Sprachprofil**: siehe oben, plus Projekt-Skelett (Build-Datei, Lint-Config, Beispielcode)

Laut README wird die Konfiguration schon heute generiert. Dort würde ich ansetzen
und die Sprache als dritte Achse ergänzen, statt einen zweiten Generator zu bauen.

### 3. Verteilung ohne Handarbeit

Empfehlung: **ein Repo pro Sprache**, z. B. `exact-coding-exercises-java`, mit
dem bekannten Schema (`main` = Claude Code, `harness/*` = weitere Agents).

Warum nicht Branches wie `java/copilot` in einem Repo:

- jede Sprache hat ihre eigene README und Projektstruktur
- Teilnehmende landen nicht versehentlich in der falschen Sprache
- das Branch-Schema bleibt unverändert, `git checkout harness/copilot` gilt in jedem Repo

Die Branches schreibt ein Script oder die CI. Niemand editiert sie mehr direkt.
Beiträge von außen (wie PR #2) landen im Quellbaum, als neues oder geändertes
Profil.

## Trade-offs und Risiken

- **Validierung**: Die aktuelle Opus/Hybrid-Basis ist auf `opus-5-no-thinking`
  validiert; die Sol/Predictive-TDD-Basis auf `gpt-5-6-sol-codex`. Neutralere
  Hauptdateien ändern die Verteilung des Prompt-Texts. Deshalb wird die
  vollständige Auslagerung pro Workflow-Familie und Modell separat gemessen.
- **Indirektion**: Der Profilverweis ist keine neue Grenze; beide Workflow-Familien
  verwenden ihn bereits. Das Risiko liegt in der **Aufmerksamkeitsverlagerung**:
  konkrete Beispiele und Befehle stehen künftig nur noch im vorhandenen Profil
  statt zusätzlich in den Phasendateien. RQ-1.19 zeigt, dass selbst eine reine
  Umverteilung von Promptinhalt Verhalten und Laufzeit verändern kann. Deshalb
  wird partielle gegen vollständige Profil-Auslagerung kontrolliert gemessen.
- **Contributor-Sichtbarkeit**: GitHub zählt nur Commits auf dem Default-Branch.
  Wer nur zu einer Sprache beiträgt, taucht in einem Repo pro Sprache dort auf, wo
  er beigetragen hat. In der heutigen Branch-Lösung taucht er gar nicht auf (siehe
  Oliver Roth, der nur über einen Co-authored-by-Trailer auf `main` gelistet ist).
- **Metrik-Tools sind nicht gleichwertig**: ESLint/SonarJS und PMD messen
  Cognitive Complexity ähnlich, aber mit anderen Regelnamen, Schwellen und
  Ausgabeformaten (JSON vs. Build-Log). Das Profil muss beschreiben, wie der
  End-Refactor die Werte ausliest.

## Offene Fragen

- Wo liegt der Generator heute? Die README nennt `agentic_coding_lab_project`, im
  Workspace gibt es `agentic_coding_lab` und `deprecated__agentic_coding_lab_project`.
  Vermutlich ist der README-Verweis veraltet.
- Was ist der Stand des lokalen Branches `python`? Kandidat für das erste Profil nach
  TypeScript und Java.
- Soll `harness/copilot-java` bis zum Umbau so bleiben oder schon in ein eigenes
  Repo wandern?
- Welche abstrakten Rollenbezeichnungen (`inactive-test mechanism`, `focused
  test command`, `minimal scaffold`) bleiben über TypeScript, Java und Python
  wirklich stabil?

## Nächste Schritte

1. Die verbleibenden TS/Vitest-Referenzen außerhalb der vorhandenen Profile
   vollständig inventarisieren.
2. Für beide originären Workflow-Familien je eine Variante bauen, die dieselben
   konkreten Informationen in das bestehende Profil verschiebt:
   `exact-hybrid-v2.9-stack-profile-cc` und
   `exact-sol-v1.3-stack-profile-pi`.
3. Die Verhaltensneutralität getrennt messen:
   `RQ-stack-profile-extraction-opus` und
   `RQ-stack-profile-extraction-sol`, jeweils auf game-of-life und claim-office.
4. Nur bei tragfähiger Neutralität das Profilformat als Sprachschnittstelle
   festschreiben und Java als zweites Profil ergänzen.
5. Einen Harness für TypeScript und Java generieren und gegen die heutigen
   Artefakte diffen; danach die Sprachübertragung messen.

### Umsetzungsstand SOL

`RQ-stack-profile-extraction-sol` hat die vollständige Auslagerung auf
TypeScript/Vitest mit 20/20 korrekten frischen Runs gestützt.
`exact-sol-v1.3-stack-profile-pi` ist deshalb als Default der SOL-Linie in
`research/workflow-dev/model-recommendation-matrix.md` promoviert. Der
`exact-coding-baseline-export` erkennt diese Empfehlung selbst und erzeugt aus
der nativen pi-Quelle getrennte Consumer-Bäume für Claude Code, pi, OpenCode,
Cursor und Copilot. Optional synchronisiert er daraus die parallelen
`sol/main`- und `sol/harness/*`-Branches im Distributions-Repository; die
Opus/Hybrid-Linie bleibt unverändert daneben bestehen.

## Präzisierung: Sprachunterstützung ohne Workflow-Duplikation

Ziel ist, pro Workflow nur **eine kanonische Workflow-Version** zu pflegen. Aktuell
sind zwei methodisch unterschiedliche Workflow-Familien relevant:

- **Opus / Hybrid EXACT Coding**
- **Sol / Predictive TDD**

Diese beiden Workflow-Cores bleiben getrennt, weil sie unterschiedliche
Phasen- und Refactor-Architekturen besitzen. Sprache und Harness sind davon
orthogonale Achsen:

```text
Workflow-Core × Harness-Adapter × Sprachprofil
```

Der Workflow-Core enthält ausschließlich Methodik und Phasensteuerung. Der
Harness-Adapter übersetzt Invocation, Frontmatter, Skills und Subagent-Aufrufe.
Das Sprachprofil enthält nur Stack-Semantik wie Test- und Build-Befehle, Pfade,
Todo-Mechanik, minimale Stubs, typische Compilerfehler, Codebeispiele und
Metrik-/Lint-Werkzeuge.

Vollständige sprachspezifische Kopien der Phasen (`red-java`, `red-python`,
`green-java` usw.) sind zu vermeiden. Sie würden die heutige Duplizierung nur
von Branches in Skills verschieben. Ebenso sollen Sprach-Agenten nicht ohne
Messung eingeführt werden: zusätzliche Agent-Grenzen verändern Kontext und
Delegationsstruktur und damit den Workflow selbst.

### Vollständigkeit der bestehenden Laufzeitgrenze

Der Lab-Split-Befund zeigt, dass inhaltlich gleiche Anweisungen nicht
verhaltensgleich sein müssen, wenn sie anders über Dateien verteilt werden.
Für die Sprachprofile wird jedoch **keine neue Laufzeitgrenze** eingeführt:
Opus und Sol laden bereits heute ein separates TypeScript/Vitest-Dokument.
Geprüft wird ausschließlich, ob diese bestehende Grenze vollständig werden
kann.

Die methodischen Hauptdateien verwenden danach nur noch stackneutrale Rollen:

- inactive-test mechanism
- test and implementation file paths
- focused and full-suite test commands
- load/compilation and runtime/assertion outcomes
- minimal scaffold
- language-specific Green and Refactor examples

Die konkrete Realisierung jeder Rolle liegt im Stackprofil. Marker,
Phasenfolge, Prediction-Disziplin, Refactor-Architektur, Four Rules und APP
bleiben im Workflow-Core.

### Kontrolliertes Extraktions-Experiment

Die Prüfung verwendet dieselbe Sprache und dieselbe bereits vorhandene
Profilgrenze. Der einzige Faktor ist die Vollständigkeit der Auslagerung:

| Variante | Laufzeitform | Zweck |
|---|---|---|
| A | heutiges TS/Vitest-Profil plus verbliebene Duplikate in Hauptdateien | Referenz |
| B | dasselbe Profil, um alle konkreten TS/Vitest-Details ergänzt; Hauptdateien stackneutral | vollständige Extraktion |

Es gibt keine zusätzlichen Varianten für Inline-Templating, einen Sprach-Skill
oder einen Sprach-Agenten. Sie würden eine andere Frage beantworten.

Die Prüfung läuft getrennt für die beiden originären Familien:

- `RQ-stack-profile-extraction-opus`:
  `exact-hybrid-v2-testlist-fix-cc` gegen
  `exact-hybrid-v2.9-stack-profile-cc` auf `opus-5-no-thinking` und Claude Code.
- `RQ-stack-profile-extraction-sol`:
  `exact-sol-v1-pi` gegen `exact-sol-v1.3-stack-profile-pi` auf
  `gpt-5-6-sol-codex` und pi.

Beide RQs verwenden game-of-life als trainingsbekannte Code-Quality-Kata und
claim-office als novelle Kata mit externer Verifikation. Die Katas werden
getrennt ausgewertet, nie gemittelt. Zu beobachten sind Correctness,
Testlisten-Vollständigkeit, Phasen- und Prediction-Compliance,
Refactor-Verhalten, Codequalität, Tokens, Wallclock und vorzeitige
Selbstbeendigung.

### Konsequenz für den Exporter

Nach bestätigter Neutralität wird der Exporter zur Kompositionsschicht:

```text
Workflow-Core
  + Harness-Adapter
  + Sprachprofil
  + Consumer-Transformationen
  = Exercise-Artefakt
```

Die bestehenden Consumer-Transformationen bleiben erhalten: Lab-Inhalte
entfernen, HITL aktivieren und Auto-Load in explizite Invocation umwandeln. Neu
kommen Workflow-Familie und Sprache als explizite Eingaben hinzu; das Profil
bleibt in der bereits etablierten referenzierten Laufzeitform. Die Branches im
Exercise-Repo dürfen als generierte Distributionsartefakte bestehen bleiben;
Workflow- oder Sprachlogik soll dort nicht mehr manuell gepflegt werden.

Leitregel:

> **Eine vorhandene Sprachprofil-Grenze soll vollständig werden, bevor weitere
> Sprachen darauf aufbauen.**
