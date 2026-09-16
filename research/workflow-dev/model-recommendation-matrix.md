# Workflow-Empfehlung pro Modell

Leitplanke für die Workflow-Weiterentwicklung: **es gibt keinen universell besten Workflow.** Die
Güte eines Workflows hängt vom eingesetzten Modell ab — auf der Architektur-Achse (subagents-v1/single-context-v1/hybrid-v1) tauschen
subagents-v1 und hybrid-v1 je nach Modell die Plätze. Wer einen Workflow optimiert, muss das Zielmodell mitnennen;
eine Verbesserung auf opus-4-7 ist nicht automatisch eine auf opus-4-6.

Vollständiger Befund (Tabelle, Stichproben, Mechanismus):
`research/questions/3.1-workflow-model-interaction/findings.md` (RQ-workflow-model, F-workflow-model.1/F-workflow-model.2).

## Empfehlung opus-4-6 / opus-4-7 (Korrektheit auf novel Kata, `claim-office-example-mapping`)

| Modell | empfohlener Workflow | verification_pct (n) | Begründung |
|---|---|---:|---|
| opus-4-7-no-thinking | **exact-hybrid-v1-cc** | 1.00 (5) | beherrscht die Orchestrierungs-Delegation im shared Context |
| opus-4-6-portkey-no-thinking | **exact-subagents-v1-cc** | 0.93 (5) | profitiert vom expliziten Subagent-Prompt pro Phase |
| (modell-unabhängig als Fallback) | exact-single-context-v1-cc | 0.97 (9) / 0.87 (5) | am wenigsten modell-sensitiv, kein Spitzenwert |

## Empfehlung opus-5-no-thinking

**`exact-ptdd-v1-cc` ist der universelle EXACT-Coding-Default auf native Opus 5.**
Er ersetzt `exact-hybrid-v2-testlist-fix-cc` als gepflegte und exportierte Linie. Die
Hybrid-Linie bleibt reproduzierbare Forschungs- und Dekompositionsreferenz, wird aber wegen
ihres deutlich höheren Kontext-, Token- und Laufzeitbedarfs nicht mehr als Produktprofil
empfohlen.

| Ziel | empfohlener Workflow | Evidenz | Begründung |
|---|---|---|---|
| Correctness und Preis/Leistung | **`exact-ptdd-v1-cc`** | RQ-test-list-dimensions-opus-native; RQ-test-list-dimensions-replication | n=10 auf Claim Office: Correctness (external) 0.993, 9/10 perfekte Runs, Minimum 0.933; Median-Kosten praktisch gleich zu PTDD v1.5, aber stabilerer Correctness-Floor |
| Historische Dekompositionsreferenz | `exact-hybrid-v2-testlist-fix-cc` | RQ-current-ptdd-vs-exact-opus-native | kleinere typische Funktionen, aber wesentlich mehr Laufzeit und Tokens; superseded, keine aktive Produktempfehlung |

`exact-ptdd-v1-cc` ist der kanonische Produktname für den in
`exact-sol-v1.6-test-list-dimensions-cc` gemessenen Inhalt. Die Umbenennung ändert keine
Methodik: Single-Context Predictive TDD, Compilation- und Runtime-Predictions, Four Rules,
Domain-Boundary-Trial, narrow undo und der unabhängige Dimensions-Cross-Check der Testliste
bleiben erhalten.

Die n=10-Replikation korrigiert die frühe Kosteninterpretation: Der große Mittelwertvorteil
von v1.6 gegenüber v1.5 auf Opus wurde von langen v1.5-Ausreißern getragen. Die Mediane von
Tokens und Listenpreis sind praktisch gleich. Die Promotion beruht deshalb primär auf dem
Correctness-Floor, nicht auf einem behaupteten intrinsischen Kostenvorteil innerhalb der
PTDD-Linie. Gegenüber dem früheren Hybrid-Default bleibt PTDD jedoch deutlich schlanker.

## Empfehlung GPT-5.6 SOL auf pi (OpenAI-Subscription-Route)

**`exact-ptdd-v1-pi` ist der universelle EXACT-Coding-Default auf GPT-5.6 SOL/pi.**
Er ist der kanonische Produktname für den in
`exact-sol-v1.6-test-list-dimensions-pi` gemessenen Inhalt.

| Einsatz | empfohlener Workflow | Evidenz | Begründung |
|---|---|---|---|
| Große oder novelle Spezifikationen | **`exact-ptdd-v1-pi`** | RQ-test-list-dimensions-sol-pi; RQ-test-list-dimensions-multikata-sol-pi; RQ-test-list-dimensions-replication | vollständige Correctness auf Claim Office bei n=10; derselbe gepflegte Vertrag wie der Opus-Port |
| Kleine/trainingsbekannte Katas ohne Bedarf an der vollständigen Methode | `baseline-inline-tdd-v1-pi` | RQ-1.16 | günstiger Vergleichsboden, aber kein zweiter EXACT-Coding-Produktworkflow |

PTDD v1.5 bleibt eine reproduzierbare Forschungsreferenz: Auf SOL/pi erreicht sie dieselbe
Correctness und ist auf Claim Office bei Dauer und Median-Tokens günstiger. Die Differenz
rechtfertigt jedoch keine zweite gepflegte und exportierte Produktlinie. Die Wahl von PTDD v1
ist damit ausdrücklich eine Wartungsentscheidung unter empirisch überschaubarem SOL-Aufpreis,
keine Behauptung, dass v1.6 jede Effizienzmetrik auf jedem Modell gewinnt.

Der universelle Vertrag enthält den unabhängigen Dimensions-Cross-Check der Testliste. Auf
SOL zeigt er über Claim Office, Game of Life und Sphinx Score keinen zusätzlichen
Correctness-Gewinn; auf Opus verbessert er den beobachteten Correctness-Floor. Ein einziger
Workflow behält deshalb den robusteren Cross-Check auf allen Ports.

## Konsequenz für die Weiterentwicklung

- Neue produktive Predictive-TDD-Varianten zweigen von `exact-ptdd-v1-pi` beziehungsweise dem passenden Harness-Port ab und erhalten versionierte Namen (`exact-ptdd-v2-*`, danach weitere Major- oder Branch-Versionen). Historische `exact-sol-*`-Namen bleiben ausschließlich für Reproduktion und RQ-Zuordnung bestehen.
- Workflow-Optimierungen, die auf opus-4-7 gemessen wurden (die gesamte v6.5-Reduktionskette unter
  `research/workflow-dev/2.*`/`3.*`), gelten **nur für opus-4-7**, bis sie cross-model repliziert
  sind.
- Vor jeder „dieser Workflow ist besser"-Aussage: auf welchem Modell? Cross-Model-Replikation ist
  Pflicht, bevor eine Empfehlung modell-unabhängig formuliert wird.
- **Und auf welcher Zielgröße?** Auf opus-5 fallen Qualität, Preis/Leistung und Dauer/Leistung
  auseinander; eine Empfehlung ohne genanntes Optimierungsziel ist unvollständig.
- Die Rangfolge selbst ist nicht modell-invariant: auf Sol schlug strukturloses inline-tdd-v1 jede
  Architektur (`RQ-architecture-axis-sol-pi` F-1.6), auf opus-5 hält die Ordnung
  (`RQ-architecture-axis-opus5` F-1.1).
