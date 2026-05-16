# RQ-4 Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Wie wirkt sich die Workflow-Struktur auf die Code-Qualität aus, und macht
die TDD-Striktheit einen Unterschied?**

Datenbasis: 85 Runs, Stand 2026-05-16. Modell `opus-4-7-no-thinking`,
zwei Katas: `game-of-life` (Library-Form, n=10 pro Workflow) und
`claim-office` (CLI mit externer Acceptance-Suite, n=5–10 pro Workflow).
Prompt-Pairing nach Methodologie-Constraint: v1/v2 → prose,
v3/v4/v5 → example-mapping.

---

## Übersicht: Code-Qualität & Korrektheit nach Workflow (Mittelwerte)

### game-of-life (n=10)

| Workflow (+ Prompt) | `code_mass` | `smell_total` | `mccabe_max` | `cognitive_max` | `cc_longest_function` | `verification_pct` | `mutation_score` |
|---|---:|---:|---:|---:|---:|---:|---:|
| v1-oneshot (prose) | 155 | 4.80 | 12.8 | 18.8 | 31.7 | 1.00 | 0.953 |
| v2-iterative (prose) | 158 | 4.10 | 11.6 | 16.2 | 32.1 | 1.00 | **0.954** |
| v3-basic-tdd (EM) | 166 | 6.00 | 13.7 | 21.8 | 32.5 | 1.00 | 0.949 |
| v4-exact-subagents (EM) | 167 | **2.60** | **4.5** | **4.4** | **8.1** | 1.00 | 0.908 |
| v5-exact-single-context (EM) | **153** | 4.10 | 8.9 | 14.5 | 17.4 | 1.00 | 0.945 |

### claim-office (n=5–10)

| Workflow (+ Prompt) | `code_mass` | `smell_total` | `mccabe_max` | `cognitive_max` | `cc_longest_function` | `verification_pct` | `mutation_score` |
|---|---:|---:|---:|---:|---:|---:|---:|
| v1-oneshot (prose) | 835 | 11.6 | 8.4 | 12.2 | 40.4 | 0.28 | 0.861 |
| v2-iterative (prose) | 851 | 15.8 | 8.4 | 11.4 | 41.4 | 0.28 | 0.872 |
| v3-basic-tdd (EM) | 992 | 16.8 | 15.4 | 19.8 | 51.6 | **1.00** | 0.777 |
| v4-exact-subagents (EM) | **626** | **1.8** | **7.9** | **10.5** | **25.0** | 0.67 | **0.927** |
| v5-exact-single-context (EM) | 762 | 8.9 | 10.2 | 14.2 | 31.4 | 0.87 | 0.876 |

Bester Wert pro Spalte fett. Kleiner = besser (außer `verification_pct`, `mutation_score`).

---

## F-4.1 — Striktes TDD mit Phasen-Isolation (v4) verbessert Code-Qualität dramatisch ✅ stabil

**Aussage**: Strukturiertes TDD mit phasen-isolierten Subagents
(v4-exact-subagents) liefert auf jeder Komplexitäts-Metrik die mit Abstand
besten Werte — bestätigt auf beiden Katas, Effektgröße kata-abhängig:

| Metrik | v4 game-of-life | Schlechtester (GoL) | Faktor | v4 claim-office | Schlechtester (CO) | Faktor |
|---|---:|---|---:|---:|---|---:|
| `cognitive_max` | **4.4** | v3 (21.8) | 5.0× | **10.5** | v3 (19.8) | 1.9× |
| `mccabe_max` | **4.5** | v3 (13.7) | 3.0× | **7.9** | v3 (15.4) | 1.9× |
| `cc_longest_function` | **8.1** | v3 (32.5) | 4.0× | **25.0** | v3 (51.6) | 2.1× |
| `smell_total` | **2.60** | v3 (6.00) | 2.3× | **1.80** | v3 (16.80) | **9.3×** |
| `code_mass` | 167 | – | – | **626** | v3 (992) | 1.6× |

Über alle Komplexitäts-Outcomes ist v4 auf beiden Katas der Workflow mit den
niedrigsten Werten. Auf game-of-life ist der Effekt grösser bei
`cognitive_max`/`cc_longest_function`, auf claim-office besonders bei
`smell_total` und `code_mass` (claim-office ist komplexer, das absolute
Volumen ist hoeher, aber v4 hält die Komplexität pro Funktion klein).

Mechanik: v4 spawnt für jede TDD-Phase (red, green, refactor) einen
frischen, isolierten Subagent-Kontext. Die Green-Phase startet ohne
Kenntnis der bisherigen Implementierung und schreibt deshalb die *minimale*
Lösung, die den aktuellen roten Test grün macht — kein Generalisieren,
kein "vorausschauendes Hinzufügen". Die Refactor-Phase läuft separat und
sieht den fertigen Code mit klarem Auftrag.

Konsequenz für die Forschungsfrage: **Striktes TDD (Phasen-getrennt) ist
das stärkste in dieser Studie gemessene Werkzeug zur Code-Qualitäts-
Verbesserung.** Der Effekt ist Größenordnungen größer als die Effekte von
Modell-Wahl (Opus-4.7 vs Sonnet vs Opus-4.6, RQ-3 F-3.2 zeigt
`cognitive_max`-Spread ~5 zwischen Modellen auf v4) oder Thinking-Mode
(RQ-3 F-3.3).

**Datenbasis**: v4 mit n=10 (game-of-life) bzw. n=10 (claim-office). Vergleichszellen
n=5–10. ESLint McCabe + SonarJS Cognitive, Funktionslängen aus dem
Clean-Code-Reporter.

**Hypothese H2 (Striktheit verbessert)**: bestätigt für v4 über alle
Komplexitäts-Outcomes, auf beiden Katas.

---

## F-4.2 — Aber: TDD-Effekt ist *nicht* uniform — minimal-TDD (v3) ist schlechter als kein TDD ✅ stabil

**Aussage**: Die F-4.1-Befunde könnten suggerieren, "TDD = besser". Das
hält *nicht*. Wird der Workflow nur als "use TDD" ohne Phasen-Struktur
realisiert (v3-basic-tdd), produziert er die **schlechtesten**
Komplexitäts-Werte aller getesteten Workflows — schlechter als v1
(oneshot-vibecoding) oder v2 (iterativ ohne TDD):

**game-of-life:**

| Workflow | TDD? | `cognitive_max` | `mccabe_max` | `cc_longest_function` |
|---|---|---:|---:|---:|
| v1-oneshot | ❌ Nein | 18.8 | 12.8 | 31.7 |
| v2-iterative | ❌ Nein | 16.2 | 11.6 | 32.1 |
| **v3-basic-tdd** | ✅ Ja, minimal | **21.8** | **13.7** | **32.5** |
| v4-exact-subagents | ✅ Ja, strikt | 4.4 | 4.5 | 8.1 |
| v5-exact-single-context | ✅ Ja, strikt (Shared-Context) | 14.5 | 8.9 | 17.4 |

**claim-office:**

| Workflow | TDD? | `cognitive_max` | `mccabe_max` | `cc_longest_function` | `smell_total` |
|---|---|---:|---:|---:|---:|
| v1-oneshot | ❌ Nein | 12.2 | 8.4 | 40.4 | 11.6 |
| v2-iterative | ❌ Nein | 11.4 | 8.4 | 41.4 | 15.8 |
| **v3-basic-tdd** | ✅ Ja, minimal | **19.8** | **15.4** | **51.6** | **16.8** |
| v4-exact-subagents | ✅ Ja, strikt | 10.5 | 7.9 | 25.0 | 1.8 |
| v5-exact-single-context | ✅ Ja, strikt (Shared-Context) | 14.2 | 10.2 | 31.4 | 8.9 |

v3 hat auf **beiden** Katas die schlechtesten Komplexitäts-Werte des gesamten
Vergleichsfelds — also auch schlechter als v1/v2 ohne jegliches TDD.

Plausible Mechanik: "use TDD" ohne Phasen-Strukturierung führt zu
test-getriebenem Hacking — Tests werden geschrieben, aber die Refactor-
Disziplin fehlt; pro Test wird inkrementell zu einer bestehenden Funktion
hinzugefügt, ohne dass ein separater Aufräum-Schritt die Komplexität
reduziert. v1/v2 können zumindest am Ende einmal aufräumen.

Zusatz: v3-Runs sind mit ~75 s Wallclock auf game-of-life auffällig kurz
(claim-office ~312 s); der Agent durchläuft offenbar einen *degenerierten*
TDD-Modus, der mehr "Test gleich miterzeugen" als echtes Red-Green-Refactor
ist. Dass v3 auch auf claim-office (wo die Aufgabe viel komplexer ist) die
schlechteste Komplexität liefert, bestätigt das Muster über die Katas hinweg.

**Konkurrenz-Hypothese geprüft und ausgeschlossen** (Repräsentations-
Artefakt): In einer früheren Auswertung (vor commit `0902a4f`) wählten
v1/v2 auf dem prose-Prompt eine Set-basierte Repräsentation
(`ReadonlySet<string>`), während v3/v4/v5 Cell-Tupel nutzten. v1/v2-Werte
lagen damals bei cognitive_max ~9, v3 bei ~17. Plausible alternative
Erklärung: v3 sieht *nicht wirklich* schlechter aus, sondern der Vergleich
ist unfair, weil v1/v2 mit einer kompakteren Hash-/Set-Abstraktion arbeiten.

Unter dem API-Vertrag müssen jetzt *alle* Workflows `Cell[]`-Tupel
verwenden. Die Werte für v1/v2 verschlechtern sich erwartungsgemäß
(cognitive_max ~9 → ~17–21), aber v3 bleibt **oberhalb** (23.33):

| Workflow | cognitive_max OLD | cognitive_max NEW |
|---|---:|---:|
| v1-oneshot | 9.33 | 20.67 |
| v2-iterative | 9.67 | 16.67 |
| v3-basic-tdd | 16.67 | 23.33 |

Wäre v1/v2 nur wegen der Set-Abstraktion günstig erschienen, müssten sie
unter dem fairen Vertrag *unter* oder *gleich* v3 fallen. Sie bleiben
darüber. F-4.2 ist damit ein echter Workflow-Effekt, kein
Repräsentations-Artefakt.

**Konsequenz**: Die pauschale "TDD verbessert Code-Qualität"-Aussage ist
falsifiziert. *Die Striktheit* — konkret: explizite Phasen-Strukturierung
mit isolierter Green-Phase — ist der wirksame Hebel, nicht das TDD-Label
an sich. Ein Team, das "use TDD" ohne weitere Struktur einführt, riskiert
qualitativ schlechteren Code als gar kein TDD.

---

## F-4.3 — v4 vs v5: Kontext-Architektur-Effekt — siehe RQ-6 ➡

Der Vergleich v4-exact-subagents vs v5-exact-single-context ist eine
eigenstaendige Forschungsfrage zum **Context-Engineering** und wird in
[RQ-6](../RQ-6-context-engineering/findings.md) gesondert behandelt.
Beide Workflows teilen denselben Phasen-Skript-Inhalt; der einzige
Unterschied ist die Kontext-Architektur (isolierte Subagent-Kontexte vs
geteilter Single-Context). Headline-Befund aus RQ-6 (n=10 pro Zelle):

- `cognitive_max`: v4 = 4.40 vs v5 = 14.50 (Faktor 3.3×)
- `mccabe_max`: v4 = 4.50 vs v5 = 8.90 (Faktor 2.0×)
- `total_tokens`: v4 = 2.56 M vs v5 = 8.14 M (v5 ~3× teurer)
- `duration_seconds`: v5 = 380 s vs v4 = 1163 s (v5 ~3× schneller)

v4 dominiert auf Code-Qualitaet, v5 spart Wallclock. Volle Argumentation
und Tail-Risiko-Analyse in RQ-6.

---

## F-4.4 — Korrektheit ist auf game-of-life workflow-unabhängig; auf claim-office bleibt ein Workflow-Effekt *innerhalb* der example-mapping-Gruppe ⚠️ bedingt

**Aussage (game-of-life)**: Mit dem expliziten API-Vertrag in allen drei
GoL-Prompts (commit `0902a4f`) erreichen alle fünf Workflows
`tests_passing = 100 %` und `verification_pct = 1.00` (50/50 Runs). Hier
ist Korrektheit workflow-unabhängig.

**Aussage (claim-office)**: Die innere Korrektheit (`tests_passing`) ist
ebenfalls überall 100 % (35/35 Runs). Die äußere Korrektheit
(`verification_pct`) variiert dagegen stark:

| Workflow | Prompt | `verification_pct` (mean) |
|---|---|---:|
| v1-oneshot | prose | 0.28 |
| v2-iterative | prose | 0.28 |
| v3-basic-tdd | example-mapping | **1.00** |
| v4-exact-subagents | example-mapping | 0.67 |
| v5-exact-single-context | example-mapping | 0.87 |

**Wichtige Abgrenzung — Konfundierung**: Die Lücke v1/v2 (prose) → v3
(example-mapping) ist **nicht** primär ein Workflow-Effekt, sondern weitgehend
der **example-mapping-Prompt-Vorteil**, der bereits in RQ-1 und RQ-2 für
claim-office dokumentiert ist (konkrete Beispiele im Prompt liefern dem
Modell de-facto-Acceptance-Cases). Dieser Anteil wird nicht erneut als
RQ-4-Befund geführt — siehe RQ-1/RQ-2.

**Echter RQ-4-Befund** (gleicher Prompt, gleicher Kata): *Innerhalb* der
example-mapping-Gruppe (v3 / v4 / v5) bleibt ein signifikanter Workflow-
Effekt auf `verification_pct`: 1.00 (v3) → 0.87 (v5) → 0.67 (v4). Die
Reihenfolge ist die *Umkehrung* der Code-Qualitäts-Reihenfolge (F-4.1): v4
liefert den saubersten Code, trifft aber am wenigsten zuverlässig die
spezifizierten Acceptance-Szenarien. v3 liefert den schmutzigsten Code,
trifft aber jedes Szenario.

Mechanistische Hypothese: v3 schreibt minimale Tests, die nahe an den
Beispielen aus dem Prompt liegen — die Implementierung passt sich diesen
direkten Beispielen an und reproduziert sie deshalb 1:1. v4 abstrahiert
über die Phasen-Isolation hinweg, generalisiert Tests und Implementierung —
und entfernt sich dabei vom konkreten Acceptance-Verhalten. Verbindung zu
F-4.6 (Mutation-Score) bestätigt das (siehe dort).

**Konsequenz**: Workflow wirkt auf claim-office-Aussen-Korrektheit *real*,
aber gegenläufig zur Code-Qualität. Wer im example-mapping-Setting beides
will, hat auf claim-office einen Tradeoff zu lösen.

**Datenbasis**: 85 Runs, beide Katas.

---

## F-4.5 — Token-Verbrauch und Wallclock skalieren stark mit Workflow und Kata ✅ stabil

**Aussage**: Token-Verbrauch (Mittel) und Wallclock entlang der Workflows,
getrennt nach Kata:

**game-of-life:**

| Workflow | `total_tokens` | `duration_seconds` |
|---|---:|---:|
| v3-basic-tdd | 0.80 M | 75 s |
| v2-iterative | 0.97 M | 83 s |
| v1-oneshot | 0.99 M | 88 s |
| v4-exact-subagents | 2.56 M | 1163 s |
| v5-exact-single-context | 8.14 M | 380 s |

**claim-office:**

| Workflow | `total_tokens` | `duration_seconds` |
|---|---:|---:|
| v1-oneshot | 2.11 M | 231 s |
| v2-iterative | 2.12 M | 244 s |
| v3-basic-tdd | 3.28 M | 312 s |
| v5-exact-single-context | 14.14 M | 655 s |
| v4-exact-subagents | 13.66 M | **3693 s** (~62 min) |

**Game-of-life-Muster**: v5 ist 8.4× teurer als v3 (Shared-Context
akkumuliert), v4 zeitlich am teuersten (~19 min) wegen Subagent-Spawns,
aber 3× günstiger in Tokens als v5.

**Claim-office-Muster**: Skalen sind anders. v4 und v5 verbrauchen
*beide* ~14 M Tokens — der Token-Vorteil von v4 aus game-of-life
verschwindet. Wallclock zeigt v4 ~6× länger als v5 (~62 min vs ~11 min).
v3 ist auf claim-office mit 312 s nicht mehr ein Schnellläufer.

**Konsequenz**: Auf game-of-life ist v4 die Best-Quality-Per-Token-Wahl. Auf
claim-office hat v4 den gleichen Token-Preis wie v5 *plus* den hohen
Wallclock-Aufschlag — die Workflow-Wahl im realistischeren Setting ist also
nicht mehr "v4 dominiert", sondern ein Tradeoff zwischen Code-Qualität
(v4 dominiert weiter), Aussen-Korrektheit (v3 > v5 > v4, siehe F-4.4) und
Kosten (v3 << v5 ≈ v4).

---

## F-4.6 — Mutation-Score: Test-Stärke und Aussen-Korrektheit divergieren auf claim-office innerhalb example-mapping ✅ stabil

**Aussage**: Der Mutation-Score (Anteil der durch die vom Agenten selbst
geschriebenen Vitest-Tests gekillten Mutanten, Stryker) misst die Stärke
der internen Tests — wie streng prüfen sie tatsächlich die Implementierung?

**game-of-life (n=10):** alle Workflows clustern eng zwischen 0.91 und 0.95.
Keine Workflow-Differenzierung. v4 hat den niedrigsten Mittelwert (0.908)
bei zugleich auffällig hoher Streuung (σ=0.080, min 0.735) — ein Tail-
Risiko, das mit F-4.1 / F-4.3 zusammen passt (v4 ist auf Qualität dominant,
zeigt aber gelegentlich schwache Test-Runs).

**claim-office (n=5–10), example-mapping-Gruppe:**

| Workflow | `mutation_score` | `verification_pct` | Beziehung |
|---|---:|---:|---|
| v3-basic-tdd | **0.78** | **1.00** | schwache Tests, perfekte Aussen-Korrektheit |
| v4-exact-subagents | **0.93** | 0.67 | starke Tests, mittlere Aussen-Korrektheit |
| v5-exact-single-context | 0.88 | 0.87 | beides mittel |

Die beiden Korrektheits-Dimensionen **stehen in Spannung**:

- **v3** liefert *minimale Tests, die nahe an den Prompt-Beispielen liegen*.
  Die Implementierung passt sich diesen Beispielen 1:1 an und trifft die
  Acceptance-Suite (die im example-mapping ja teilweise leak-äquivalent ist,
  vgl. RQ-1/RQ-2). Aber: Mutationen der Implementierung überleben oft —
  die Tests prüfen das *Verhalten* nicht streng, sondern nur die *Beispiele*.
- **v4** schreibt durch die isolierte Red/Green-Phase strengere Tests, die
  Implementierungs-Variationen aktiv falsifizieren. Die Generalisierung
  erweitert das geprüfte Verhalten — entfernt sich aber gleichzeitig vom
  konkreten Acceptance-Korpus.
- **v5** liegt in beiden Dimensionen dazwischen.

**Konsequenz**: `verification_pct` und `mutation_score` sind **keine
redundanten Korrektheits-Signale**. Sie messen unterschiedliche
Eigenschaften der Test-Suite — Treue zu spezifizierten Beispielen vs.
Robustheit gegen Code-Mutationen. Für die RQ-4-Headline-Interpretation
bedeutet das: v4 verbessert *Test-Stärke* und *Code-Qualität*, kostet aber
*Aussen-Korrektheit*; v3 invertiert das. Die Hypothese "TDD-Workflows
schreiben substanziellere Tests" ist auf claim-office im example-mapping-
Setting bestätigt für v4 (und v5), für v3 jedoch widerlegt.

**Datenbasis**: 85 Runs, alle 85 mit Mutation-Score (100 % coverage der
grünen Runs). Stryker 8.6.0 mit `@stryker-mutator/vitest-runner`.
Score-Formel: `(Killed + Timeout) / (Killed + Survived + Timeout + NoCoverage)`.
`src/cli.ts` ist von der Mutation ausgeschlossen (wird durch
`verification_pct` extern geprüft).

**Hinweis zur Replikation auf game-of-life**: Hier liefert Mutation-Score
keine Workflow-Differenzierung — die Kata ist zu klein/wohlbekannt, alle
Workflows produzieren bereits hochwertige interne Tests. Mutation-Score
zeigt sein Diskriminierungs-Potenzial erst auf der größeren Kata.

---

## Caveats

- **Single model**: Nur `opus-4-7-no-thinking`. Workflow-Effekte könnten
  bei schwächeren Modellen anders aussehen oder mit aktiviertem Thinking.
- **Zwei Katas, kein Mars-Rover**: game-of-life (n=10) + claim-office (n=5–10).
  Mars-rover als dritter Code-Qualitäts-Carrier offen — würde insbesondere
  F-4.2 (v3 schlechter als non-TDD) auf einer weiteren Kata replizieren oder
  widerlegen.
- **Prompt-Asymmetrie & Konfundierung mit RQ-1/RQ-2**: v1/v2 nutzen
  `prose`, v3/v4/v5 nutzen `example-mapping`. Auf claim-office ist
  example-mapping bekanntermassen aus RQ-1/RQ-2 mit höherer
  `verification_pct` assoziiert; die v1/v2 → v3 Verifikations-Lücke auf
  claim-office (F-4.4) ist daher *nicht* als Workflow-Effekt zu lesen.
  Workflow-Effekte werden konservativ nur *innerhalb* der example-mapping-
  Gruppe (v3/v4/v5) ausgewertet.
- **n=5 untere Grenze für claim-office prose-Zellen** (v1, v2); n=10 für die
  bisher umfangreich besetzten Zellen.
- **v3-Schnellläufer-Verdacht (game-of-life)**: v3-Runs sind dort mit ~75 s
  wallclock auffällig kurz. Möglich, dass "use TDD" in einen degenerierten
  Modus läuft, bei dem die Test-First-Disziplin nicht greift und der Agent
  funktional in den Test-Last-Modus fällt — was die schlechte Komplexität
  (F-4.2) erklärt. Auf claim-office ist v3 nicht mehr auffällig kurz
  (~312 s), aber liefert weiterhin die schlechteste Code-Qualität.
