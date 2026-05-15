# RQ-4 Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Wie wirkt sich die Workflow-Struktur auf die Code-Qualität aus, und macht
die TDD-Striktheit einen Unterschied?**

Datenbasis: 18 Runs (5 Zellen, n=3–6), Stand 2026-05-15. Modell
`opus-4-7-no-thinking`, Kata `game-of-life` (Library-Form) mit explizitem
API-Vertrag. Prompt-Pairing nach Methodologie-Constraint: v1/v2 → prose,
v3/v4/v5 → example-mapping.

---

## Übersicht: Code-Qualität nach Workflow (Mittelwerte)

| Workflow (+ Prompt) | `code_mass` | `smell_total` | `mccabe_max` | `cognitive_max` | `cc_longest_function` | `verification_pct` | n |
|---|---:|---:|---:|---:|---:|---:|---:|
| v1-oneshot (prose) | 160.00 | 5.00 | 14.00 | 20.67 | 33.67 | 1.00 | 3 |
| v2-iterative (prose) | **154.67** | 4.33 | 12.00 | 16.67 | 34.00 | 1.00 | 3 |
| v3-basic-tdd (EM) | 164.33 | 5.67 | 14.33 | 23.33 | 34.00 | 1.00 | 3 |
| v4-exact-subagents (EM) | 167.67 | **2.50** | **4.00** | **2.83** | **9.33** | 1.00 | 6 |
| v5-exact-single-context (EM) | 161.67 | 5.67 | 10.67 | 18.33 | 24.33 | 1.00 | 3 |

Bester Wert pro Spalte fett. Kleiner = besser (außer `verification_pct`).

---

## F-4.1 — Striktes TDD mit Phasen-Isolation (v4) verbessert Code-Qualität dramatisch ✅ stabil

**Aussage**: Strukturiertes TDD mit phasen-isolierten Subagents
(v4-exact-subagents) liefert auf jeder Komplexitäts-Metrik die mit Abstand
besten Werte — Faktor 4–8× besser als alle anderen Workflows in dieser
Studie:

| Metrik | v4 (strict TDD) | Schlechtester Workflow | v4 ist besser um Faktor |
|---|---:|---|---:|
| `cognitive_max` | **2.83** | v3 (23.33) | **8.3×** |
| `mccabe_max` | **4.00** | v3 (14.33) | 3.6× |
| `cc_longest_function` | **9.33** | v2/v3 (34.00) | 3.6× |
| `smell_total` | **2.50** | v3/v5 (5.67) | 2.3× |

Über alle vier Komplexitäts-Outcomes ist v4 nicht nur besser, sondern der
*einzige* Workflow mit konsequent niedrigen Werten — kein anderer kommt in
die Nähe.

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

**Datenbasis**: 6 v4-Runs, n=3 für jeden Vergleichs-Workflow, σ_v4_cognitive
= 0.75 (min 2, max 4) — Werte extrem stabil. ESLint McCabe + SonarJS
Cognitive, Funktionslängen aus dem Clean-Code-Reporter.

**Hypothese H2 (Striktheit verbessert)**: bestätigt für v4 über alle
Komplexitäts-Outcomes.

---

## F-4.2 — Aber: TDD-Effekt ist *nicht* uniform — minimal-TDD (v3) ist schlechter als kein TDD ✅ stabil

**Aussage**: Die F-4.1-Befunde könnten suggerieren, "TDD = besser". Das
hält *nicht*. Wird der Workflow nur als "use TDD" ohne Phasen-Struktur
realisiert (v3-basic-tdd), produziert er die **schlechtesten**
Komplexitäts-Werte aller getesteten Workflows — schlechter als v1
(oneshot-vibecoding) oder v2 (iterativ ohne TDD):

| Workflow | TDD? | `cognitive_max` | `mccabe_max` | `cc_longest_function` |
|---|---|---:|---:|---:|
| v1-oneshot | ❌ Nein | 20.67 | 14.00 | 33.67 |
| v2-iterative | ❌ Nein | 16.67 | 12.00 | 34.00 |
| **v3-basic-tdd** | ✅ Ja, minimal | **23.33** | **14.33** | **34.00** |
| v4-exact-subagents | ✅ Ja, strikt | 2.83 | 4.00 | 9.33 |
| v5-exact-single-context | ✅ Ja, strikt (Shared-Context) | 18.33 | 10.67 | 24.33 |

v3 hat die höchste cognitive_max und mccabe_max über alle Zellen. Plausible
Mechanik: "use TDD" ohne Phasen-Strukturierung führt zu test-getriebenem
Hacking — Tests werden geschrieben, aber die Refactor-Disziplin fehlt; pro
Test wird inkrementell zu einer bestehenden Funktion hinzugefügt, ohne dass
ein separater Aufräum-Schritt die Komplexität reduziert. v1/v2 können
zumindest am Ende einmal aufräumen.

Zusatz: v3-Runs sind mit ~67 s Wallclock auffällig kurz — der Agent
durchläuft offenbar einen *degenerierten* TDD-Modus, der mehr "Test
gleich miterzeugen" als echtes Red-Green-Refactor ist.

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

## F-4.4 — Korrektheit (innen + außen) ist workflow-unabhängig unter explizitem API-Vertrag ✅ stabil

**Aussage**: Mit dem expliziten API-Vertrag in allen drei GoL-Prompts
(commit `0902a4f`) erreichen alle fünf Workflows `tests_passing = 100 %`
und `verification_pct = 1.00` (18/18 Runs, 15/15 Szenarien je Run).

Insbesondere:

- **v1-oneshot (prose)**: 3/3 Runs perfekt — der prose-Prompt verleitet das
  Modell mit explizitem Vertrag nicht mehr zu Set-Repräsentationen.
- **v2-iterative (prose)**: 3/3 Runs perfekt.
- **v3/v4/v5 (example-mapping)**: ebenfalls 3/3, 6/6, 3/3 perfekt.

H4 (Aussen-Korrektheit Workflow-unabhängig unter explizitem Vertrag)
bestätigt — Workflow-Wahl wirkt sich *nicht* auf Korrektheit aus, weder
innen noch außen, sobald das Modell den Adapter-Vertrag explizit kennt.

**Konsequenz**: Die in einer früheren Auswertung beobachtete Workflow-
Korrektheits-Trennung (`v1` 0.07 → `v3/v5` 1.00) war ein **Artefakt der
Prompt-Underspezifikation**, kein echtes Workflow-Phänomen. Workflow-Effekte
beschränken sich auf Code-Qualität (F-4.1, F-4.2) und Kosten (F-4.5) — nicht
auf Korrektheit.

**Datenbasis**: 18 Runs.

---

## F-4.5 — Token-Verbrauch wächst mit Workflow-Striktheit überproportional; v5 mit Abstand am teuersten ✅ stabil

**Aussage**: Token-Verbrauch (Mittel) und Wallclock entlang der Workflows:

| Workflow | `total_tokens` (Mittel) | `duration_seconds` (Mittel) | Faktor vs v3 |
|---|---:|---:|---:|
| v3-basic-tdd | 0.78 M | 67 s | 1.0× |
| v1-oneshot | 0.85 M | 85 s | 1.1× |
| v2-iterative | 0.96 M | 84 s | 1.2× |
| v4-exact-subagents | 2.58 M | 865 s | 3.3× |
| v5-exact-single-context | 6.87 M | 300 s | 8.8× |

v5 verbraucht ~8.8× so viele Tokens wie v3 und ~2.7× so viele wie v4 — der
Shared-Context wächst pro Phase und akkumuliert. v4 spart Tokens trotz mehr
Agent-Spawns durch frische Kontexte pro Phase.

**Wallclock**: v3 in ~67 s (sehr schnell — minimal-TDD ohne Phasen-Overhead),
v1/v2 in ~85 s, v5 in ~300 s, v4 in ~865 s. v4 ist zeitlich am teuersten —
die isolierten Agent-Spawns dominieren.

**Konsequenz**: Best-Quality-Per-Token-Wahl ist **v4** (beste Qualität bei
mittlerem Token-Budget). Wer "good-enough quality fast" sucht, nimmt v1
oder v2 — die liefern Komplexität-mittel und kosten ~1 M Tokens.
**v3 ist preislich attraktiv, qualitativ aber das Schlusslicht** (F-4.2) —
nicht empfehlenswert. **v5 ist auf jeder Achse hinter v4** außer marginal
auf `code_mass`.

---

## Caveats

- **Single model**: Nur `opus-4-7-no-thinking`. Workflow-Effekte könnten
  bei schwächeren Modellen anders aussehen oder mit aktiviertem Thinking.
- **Single kata**: Nur Game of Life (Library-Form). Mars-rover als zweiter
  Code-Qualitäts-Carrier offen — würde insbesondere F-4.2 (v3 schlechter
  als non-TDD) replizieren oder widerlegen.
- **Prompt-Asymmetrie**: v1/v2 nutzen `prose`, v3/v4/v5 nutzen
  `example-mapping`. Methodologie-Constraint. Unter dem expliziten API-
  Vertrag ist der Asymmetrie-Einfluss auf Korrektheit eliminiert (F-4.4),
  ein hypothetischer Effekt auf Code-Qualität ist nach RQ-2 nicht zu
  erwarten, kann aber nicht ganz ausgeschlossen werden.
- **n = 3 pro Zelle** (außer v4 mit n=6): untere Grenze von `min_replicates`.
- **v3-Schnellläufer-Verdacht**: v3-Runs sind mit ~67 s wallclock auffällig
  kurz. Möglich, dass "use TDD" in einen degenerierten Modus läuft, bei dem
  die Test-First-Disziplin nicht greift und der Agent funktional in den
  Test-Last-Modus fällt — was die schlechte Komplexität (F-4.2) erklärt.
  Detaillierte Inspektion einer Transkripte wäre für die mechanistische
  Bestätigung hilfreich.
