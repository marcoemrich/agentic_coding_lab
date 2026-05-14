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

## F-4.1 — TDD-Effekt nicht uniform: v4 dominiert Code-Komplexität deutlich, v3 (minimal-TDD) ist sogar schlechter als kein TDD ✅ stabil

**Aussage**: Auf den Komplexitäts-Metriken liefert **v4-exact-subagents**
die mit Abstand niedrigsten Werte; v3-basic-tdd liegt dagegen auf
`cognitive_max`, `mccabe_max` und `cc_longest_function` **oberhalb** der
non-TDD-Workflows (v1, v2):

- v4: `cognitive_max` 2.83, `mccabe_max` 4.00, `cc_longest_function` 9.33,
  `smell_total` 2.50 — Bestwerte in allen vier Komplexitäts-Metriken.
- v5-exact-single-context: `cognitive_max` 18.33, `mccabe_max` 10.67,
  `cc_longest_function` 24.33 — zweitbeste TDD-Variante, aber 6× schlechter
  als v4 auf `cognitive_max`.
- v1-oneshot / v2-iterative (non-TDD): `cognitive_max` 17–21, `mccabe_max`
  12–14, `cc_longest_function` ~34 — mittleres Niveau.
- v3-basic-tdd: `cognitive_max` 23.33, `mccabe_max` 14.33,
  `cc_longest_function` 34.00 — **schlechteste Werte über alle Zellen**.

H1 ("TDD verbessert Code-Qualität") gilt also nur für *strukturiertes* TDD
(v4, partiell v5); unstrukturiertes TDD (v3) ist auf Komplexität messbar
schlechter als kein TDD. Die intuitive Lesart: ohne Phasen-Strukturierung
führt "use TDD" zu test-getriebenem Hacking ohne Refactor-Disziplin —
Tests werden geschrieben, aber Komplexität sammelt sich an.

**Konkurrenz-Hypothese geprüft und ausgeschlossen**: In einer früheren
Auswertung (vor commit `0902a4f`) wählten v1/v2 auf dem prose-Prompt eine
Set-basierte Repräsentation (`ReadonlySet<string>` mit Koordinaten-Hash-Keys),
während v3/v4/v5 die Cell-Tupel-Form nutzten. v1/v2-Werte lagen damals bei
cognitive_max ~9, v3 bei ~17. Eine plausible alternative Erklärung wäre
gewesen: v3 sieht *nicht wirklich* schlechter aus, sondern der Vergleich ist
unfair, weil v1/v2 mit einer kompakteren Hash-/Set-Abstraktion arbeiten, die
explizite Verzweigungen pro Funktion einspart und so McCabe/Cognitive
deflationiert.

Unter dem API-Vertrag müssen jetzt *alle* Workflows die `Cell[]`-Tupel-Form
verwenden — gleiche Datenstruktur über alle Zellen. Die Werte für v1/v2
verschlechtern sich erwartungsgemäß (cognitive_max ~9 → ~17–21), aber v3
bleibt **darüber** (23.33):

| Workflow | cognitive_max OLD | cognitive_max NEW |
|---|---:|---:|
| v1-oneshot | 9.33 | 20.67 |
| v2-iterative | 9.67 | 16.67 |
| v3-basic-tdd | 16.67 | 23.33 |

Wäre v1/v2 nur wegen der Set-Abstraktion günstig erschienen, müssten sie
unter dem fairen Vertrag *unter* oder *gleich* v3 fallen. Sie bleiben
oberhalb v3. F-4.1 ist damit ein echter Workflow-Effekt, kein
Repräsentations-Artefakt.

**Datenbasis**: 18 Runs, ESLint McCabe + SonarJS Cognitive, Funktionslängen
aus dem Clean-Code-Reporter.

**Konsequenz**: Pauschale "TDD hilft"-Aussage falsifiziert. Strukturiertes
TDD (v4) liefert die deutlich beste Code-Qualität; minimal-TDD (v3)
schadet. Diese Differenzierung ist für künftige TDD-Vergleiche bindend.

---

## F-4.2 — Phasen-Isolierung (v4) schlägt Shared-Context (v5) auf cognitive_max um Faktor 6 ✅ stabil

**Aussage**: v4 und v5 implementieren beide das gleiche strukturierte
Red-Green-Refactor-Protokoll, unterscheiden sich aber in Phase-Isolation
(v4: pro Phase ein frischer Subagent-Kontext; v5: alle Phasen im selben
Kontext). Effekte:

| Metrik | v4 | v5 | v5/v4 |
|---|---:|---:|---:|
| `cognitive_max` | 2.83 | 18.33 | **6.5×** |
| `cc_longest_function` | 9.33 | 24.33 | 2.6× |
| `mccabe_max` | 4.00 | 10.67 | 2.7× |
| `smell_total` | 2.50 | 5.67 | 2.3× |
| `code_mass` | 167.67 | 161.67 | 0.96× |

v4 ist auf allen Komplexitäts-Outcomes deutlich besser; der `cognitive_max`-
Spread ist mit Faktor 6.5× außerordentlich groß. v5 erreicht
zwar einen leicht kompakteren Code-Mass-Wert, zahlt das aber mit
dramatisch höherer Komplexität.

Plausible Mechanik: In v5 sammelt der Shared-Context Kontext-Rauschen aus
früheren Iterationen mit; die Green-Phase baut auf bestehender Logik auf
statt aus frischem Kontext eine minimale Implementierung zu liefern. v4
zwingt durch Phase-Isolation jeden Green-Subagent zu minimaler Lösung.

**Datenbasis**: n_v4 = 6 (RQ-3 + RQ-4 pooled), n_v5 = 3. σ_cognitive_max
bei v5 mit 6.66 substanziell, aber v5-Minimum (11) liegt immer noch
deutlich über v4-Maximum (4) → ✅ stabil.

---

## F-4.3 — Korrektheit (innen + außen) ist workflow-unabhängig unter explizitem API-Vertrag ✅ stabil

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
beschränken sich auf Code-Qualität (F-4.1, F-4.2) und Kosten (F-4.4) — nicht
auf Korrektheit.

**Datenbasis**: 18 Runs.

---

## F-4.4 — Token-Verbrauch wächst mit Workflow-Striktheit überproportional; v5 mit Abstand am teuersten ✅ stabil

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
**v3 ist preislich attraktiv, qualitativ aber das Schlusslicht** (F-4.1) —
nicht empfehlenswert. **v5 ist auf jeder Achse hinter v4** außer marginal
auf `code_mass`.

---

## Caveats

- **Single model**: Nur `opus-4-7-no-thinking`. Workflow-Effekte könnten
  bei schwächeren Modellen anders aussehen oder mit aktiviertem Thinking.
- **Single kata**: Nur Game of Life (Library-Form). Mars-rover als zweiter
  Code-Qualitäts-Carrier offen — würde insbesondere F-4.1 (v3 schlechter
  als non-TDD) replizieren oder widerlegen.
- **Prompt-Asymmetrie**: v1/v2 nutzen `prose`, v3/v4/v5 nutzen
  `example-mapping`. Methodologie-Constraint. Unter dem expliziten API-
  Vertrag ist der Asymmetrie-Einfluss auf Korrektheit eliminiert (F-4.3),
  ein hypothetischer Effekt auf Code-Qualität ist nach RQ-2 nicht zu
  erwarten, kann aber nicht ganz ausgeschlossen werden.
- **n = 3 pro Zelle** (außer v4 mit n=6): untere Grenze von `min_replicates`.
- **v3-Schnellläufer-Verdacht**: v3-Runs sind mit ~67 s wallclock auffällig
  kurz. Möglich, dass "use TDD" in einen degenerierten Modus läuft, bei dem
  die Test-First-Disziplin nicht greift und der Agent funktional in den
  Test-Last-Modus fällt — was die schlechte Komplexität (F-4.1) erklärt.
  Detaillierte Inspektion einer Transkripte wäre für die mechanistische
  Bestätigung hilfreich.
