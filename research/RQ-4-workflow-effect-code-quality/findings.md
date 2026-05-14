# RQ-4 Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Wie wirkt sich die Workflow-Struktur auf die Code-Qualitaet aus, und macht
die TDD-Striktheit einen Unterschied?**

Datenbasis: 22 Runs (5 Zellen, n=3–6), Stand 2026-05-14. Modell
`opus-4-7-no-thinking`, Kata `game-of-life` (Library-Form). Prompt-Pairing
nach Methodologie-Constraint: v1/v2 → prose, v3/v4/v5 → example-mapping.

---

## Übersicht: Code-Qualität nach Workflow (Mittelwerte)

| Workflow (+ Prompt) | `code_mass` | `smell_total` | `mccabe_max` | `cognitive_max` | `cc_longest_function` | `verification_pct` | n |
|---|---:|---:|---:|---:|---:|---:|---:|
| v1-oneshot (prose) | 191.33 | **2.33** | 8.33 | 9.33 | 21.33 | 0.07 | 3 |
| v2-iterative (prose) | 169.33 | **2.33** | 8.67 | 9.67 | 24.67 | 0.40 | 3 |
| v3-basic-tdd (EM) | 156.83 | 4.33 | 11.83 | 16.67 | 29.83 | **1.00** | 6 |
| v4-exact-subagents (EM) | **155.00** | 2.50 | **5.25** | **5.25** | **12.25** | 0.80 | 4 |
| v5-exact-single-context (EM) | 157.00 | 3.17 | 6.33 | 10.17 | 16.83 | **1.00** | 6 |

Bester Wert pro Spalte fett. Kleiner = besser (außer `verification_pct`: größer = besser).

---

## F-4.1 — TDD-Effekt: strukturiertes TDD (v4/v5) dominiert Code-Komplexität deutlich; minimal-TDD (v3) ist sogar schlechter als kein TDD ✅ stabil

**Aussage**: Auf den Komplexitäts-Metriken (`mccabe_max`, `cognitive_max`,
`cc_longest_function`) liefern v4 und v5 die kompaktesten Funktionen:

- **v4-exact-subagents**: `cognitive_max` 5.25, `mccabe_max` 5.25,
  `cc_longest_function` 12.25 — Bestwerte in allen drei Metriken.
- **v5-exact-single-context**: `cognitive_max` 10.17, `mccabe_max` 6.33,
  `cc_longest_function` 16.83 — zweitbeste Komplexität.
- **v1-oneshot / v2-iterative (non-TDD)**: `cognitive_max` ~9, `mccabe_max`
  ~8, `cc_longest_function` 21–25 — mittleres Niveau.
- **v3-basic-tdd**: `cognitive_max` 16.67, `mccabe_max` 11.83,
  `cc_longest_function` 29.83 — **schlechtester Wert über alle Zellen**.

H1 (TDD verbessert Code-Qualität) gilt also nur für *strukturierte* TDD-Workflows
(v4/v5); minimal-TDD (v3) ist auf Komplexität sogar messbar schlechter als
non-TDD. Die intuitive Lesart: ohne Phasen-Strukturierung führt "use TDD" zu
test-getriebenem Hacking ohne Refactor-Disziplin — die Tests werden geschrieben,
aber Komplexität sammelt sich an.

**Datenbasis**: 22 Runs, ESLint-basierte McCabe-/Cognitive-Metriken,
Funktionslängen aus dem Clean-Code-Reporter.

**Konsequenz**: Eine pauschale "TDD hilft"-Aussage ist auf diesem Setup
falsifiziert. Korrekte Formulierung: *strukturiertes* TDD (v4 oder v5) hilft;
unstrukturiertes TDD (v3) schadet auf Komplexität. Diese Differenzierung ist
für künftige RQs zu Workflow-Vergleichen bindend.

---

## F-4.2 — Phasen-Isolierung (v4) schlägt Shared-Context (v5) auf cognitive_max um Faktor 2 ⚠️ bedingt

**Aussage**: v4 und v5 implementieren beide das gleiche strukturierte
Red-Green-Refactor-Protokoll, unterscheiden sich aber in Phase-Isolation
(v4: pro Phase ein frischer Subagent-Kontext; v5: alle Phasen im selben
Kontext). Die Effekte:

| Metrik | v4 | v5 | v5/v4 |
|---|---:|---:|---:|
| `cognitive_max` | 5.25 | 10.17 | 1.94× |
| `cc_longest_function` | 12.25 | 16.83 | 1.37× |
| `mccabe_max` | 5.25 | 6.33 | 1.21× |
| `smell_total` | 2.50 | 3.17 | 1.27× |
| `code_mass` | 155 | 157 | 1.01× |

v4 ist auf allen Komplexitäts-Outcomes besser; `cognitive_max` zeigt den
deutlichsten Spread. Die plausible Mechanik: in v5 sammelt die Green-Phase
Kontext-Rauschen aus früheren Iterationen mit, der Agent baut auf bestehender
Logik auf statt aus frischem Kontext eine minimale Implementierung zu liefern.

**Bedingung**: n_v4 = 4, n_v5 = 6, σ_cognitive bei v5 mit 7.11 substanziell
(min 2, max 21). Der v5-Mittelwert wird von 1–2 Ausreißern getrieben.
Vorzeichen über alle fünf Metriken aber stabil → ⚠️ bedingt belastbar.

---

## F-4.3 — Aussen-Korrektheit ist scharf workflow-getrennt, getrieben durch Repräsentations-Wahl (vermutlich teils prompt-bedingt) ✅ stabil

**Aussage**: `verification_pct` zerfällt klar entlang der Workflow-Achse:

| Workflow | `tests_passing` | `verification_pct` | Gewählte Repräsentation in `src/game-of-life.ts` |
|---|---:|---:|---|
| v3-basic-tdd (EM) | 100 % | **1.00** | `Cell[]` mit `Cell = [number, number]` (durchgehend) |
| v5-exact-single-context (EM) | 100 % | **1.00** | `Cell[]` (durchgehend) |
| v4-exact-subagents (EM) | 100 % | 0.80 | 3/4 `Cell[]`, 1/4 `{x,y}[]`-Objekt |
| v2-iterative (prose) | 100 % | 0.40 | Mix: `Iterable<Cell>` + `Set<string>` (variabel pro Run) |
| v1-oneshot (prose) | 100 % | 0.07 | Durchgehend `ReadonlySet<string>` |

Die innere Korrektheit (`tests_passing`) ist überall 100 % — die Algorithmen
sind korrekt. Die externe Verifikation scheitert an Repräsentations-Mismatches
gegen die Tupel-Konvention des Adapters (vgl. RQ-3 F-3.5).

**Verflechtung mit dem Prompt**: Die scharfe Trennung verläuft entlang der
Prompt-Achse — alle prose-Zellen (v1, v2) wählen Set-basierte
Repräsentationen, alle example-mapping-Zellen (v3, v5; v4 zu 3/4) wählen
Tupel. Das ist konsistent mit der Hypothese, dass example-mapping konkrete
Koordinaten-Tupel zeigt und das Modell zu deren Übernahme nudged, während
prose nur die Regeln beschreibt und dem Modell die Repräsentations-Wahl
überlässt. Die Workflow-Variable und die Prompt-Variable sind in diesem RQ
gepaart (Methodologie-Constraint), daher *kann der Effekt nicht sauber
zerlegt werden*.

**Falsifikation H4** (Aussen-Korrektheit Workflow-unabhängig): falsifiziert.
v1 (0.07) vs v3/v5 (1.00) zeigt scharfen Workflow-Unterschied — der
allerdings sehr wahrscheinlich durch die Prompt-Asymmetrie verursacht wird.

**Datenbasis**: 22 Runs, manuelle Inspektion der `nextGeneration`-Signaturen
in `src/game-of-life.ts`.

---

## F-4.4 — Token-Verbrauch wächst mit Workflow-Striktheit überproportional ✅ stabil

**Aussage**: `total_tokens` (Mittel) entlang der Workflows:

| Workflow | total_tokens (Mittel) | Faktor vs v3 |
|---|---:|---:|
| v3-basic-tdd | 0.63 M | 1.0× |
| v1-oneshot | 1.03 M | 1.6× |
| v2-iterative | 1.33 M | 2.1× |
| v4-exact-subagents | 3.06 M | 4.9× |
| v5-exact-single-context | 8.85 M | 14.0× |

v5 verbraucht ~14× so viele Tokens wie v3, ~3× so viele wie v4 — der
Shared-Context wächst pro Phase und akkumuliert. v4 spart Tokens trotz mehr
Agent-Spawns durch frische Kontexte pro Phase.

**Wallclock**: v3 in ~57 s (sehr schnell, weil minimal-TDD ohne
Phasen-Overhead), v1/v2 in ~100 s, v5 in ~350 s, v4 in ~1090 s. v4 ist
zeitlich am teuersten — die isolierten Agent-Spawns dominieren.

**Konsequenz**: v4 ist die Code-Qualitäts-Bestwahl (F-4.1, F-4.2), aber mit
einem fast 5× Token-Aufschlag gegen die schlechteste Qualitäts-Variante (v3).
v5 ist Token-am-teuersten *und* in der Qualität unter v4. Wer "best quality
per token" als Ziel hat, landet bei v4. Wer "good-enough quality fast" sucht,
nimmt v1 oder v2 — die liefern auf Komplexität nicht das schlechteste
Ergebnis (besser als v3) und kosten ~1 M Tokens.

---

## Caveats

- **Single model**: Nur `opus-4-7-no-thinking`. Workflow-Effekte könnten bei
  schwächeren Modellen anders aussehen (vgl. RQ-3 Sonnet-Repräsentations-
  Problem) oder bei Modellen mit aktiviertem Thinking.
- **Single kata**: Nur Game of Life (Library-Form). Mars-rover bleibt offen,
  würde insbesondere F-4.1 (v3 schlechter als non-TDD) replizieren oder
  widerlegen.
- **Prompt-Asymmetrie**: v1/v2 nutzen `prose`, v3/v4/v5 nutzen
  `example-mapping`. Methodologie-Constraint, aber die F-4.3-Befunde
  (Repräsentations-Wahl) zeigen, dass diese Asymmetrie *real* Effekte
  produziert. Workflow- und Prompt-Effekt sind im Aussen-Korrektheits-Befund
  nicht zerlegbar.
- **n_v4 = 4**, **n_v1 = n_v2 = 3**: Untere Grenze von `min_replicates`. σ
  bei v5 auf `cognitive_max` mit 7.11 substanziell — F-4.2 daher ⚠️ bedingt.
- **v3-Schnellläufer-Verdacht**: v3-Runs sind mit ~57 s wallclock auffällig
  kurz. Möglich, dass "use TDD" hier in einen degenerierten Modus läuft, bei
  dem die Test-First-Disziplin nicht greift und der Agent funktional in den
  Test-Last-Modus fällt — was die schlechte Komplexität erklärt. Detaillierte
  Inspektion einer Transkripte wäre für die mechanistische Bestätigung
  hilfreich.
