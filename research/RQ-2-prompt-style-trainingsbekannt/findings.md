# RQ-2 Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Beeinflusst der Prompt-Stil bei einer trainingsbekannten Kata (Game of
Life) Korrektheit und Code-Qualität — und ist dieser Effekt
modellabhängig?**

Datenbasis: 45 Runs (9 Zellen × n=5), Stand 2026-05-13. Externe
Korrektheit via Verification-Adapter (importiert die Agent-Funktion
direkt, kein CLI-Vertrag nötig).

---

## Übersicht: verification_pct nach Prompt-Stil × Modell

| Modell | prose | user-story | example-mapping |
|---|---|---|---|
| opus-4-6-portkey-no-thinking | **1.00** (σ=0) | **1.00** (σ=0) | **1.00** (σ=0) |
| sonnet-4-6-portkey-no-thinking | **1.00** (σ=0) | **1.00** (σ=0) | **1.00** (σ=0) |
| haiku-4-5-portkey-no-thinking | 0.24 (σ=0.43) | 0.00 (σ=0) | 0.63 (σ=0.51) |

---

## F-2.1 — Opus und Sonnet liefern stilunabhängig perfekte Korrektheit

**Aussage**: Opus 4.6 und Sonnet 4.6 (no-thinking) erreichen auf
game-of-life `verification_pct = 1.00` über alle drei Prompt-Stile,
ohne Ausnahme (30/30 Runs). Der Spread zwischen Stilen ist 0 pp.

**Datenbasis**: 15 Opus-Runs (5 × 3 Stile), 15 Sonnet-Runs (5 × 3
Stile), alle vpct=1.00.

**Interpretation**: Bei trainingsbekannten Katas kompensieren starke
Modelle Stil-Unterschiede vollständig aus ihrem Vorwissen. Die
Conway-Regeln sind im Training omnipräsent — kein Prompt-Stil kann
das verbessern oder verschlechtern.

**Status**: ✅ stabil (n=30, σ=0)

---

## F-2.2 — Haiku scheitert kapazitätsbedingt, nicht stilbedingt

**Aussage**: Haiku 4.5 (no-thinking) zeigt auf game-of-life zwei
distinkte Modi:

1. **Sofort-Aufgeber** (dur=12–17s, code_mass=0–5): Agent schreibt nur
   ein Spec-File und gibt auf. Betrifft alle user-story-Runs (5/5)
   und die meisten prose-Runs (4/5).
2. **Durchläufer** (dur=299–710s, code_mass=129–318): Agent arbeitet
   die Aufgabe vollständig ab. Bei example-mapping 3/5 Runs perfekt
   (vpct=1.00), bei prose 1/5.

| Stil | n | vpct mean | Durchläufer | Sofort-Aufgeber |
|---|---:|---:|---:|---:|
| prose | 5 | 0.24 | 2 (1× vpct=1, 1× vpct=0.2) | 3 |
| user-story | 5 | 0.00 | 0 | 5 |
| example-mapping | 5 | 0.63 | 4 (3× vpct=1, 1× vpct=0.13) | 1 |

**Interpretation**: Der Unterschied ist nicht Regelkorrektheit,
sondern ob Haiku die Aufgabe überhaupt *beginnt*. Example-mapping
gibt dem schwächsten Modell genug konkreten Kontext, um in den
Arbeitsmodus zu kommen. User-story (abstrakt, keine Beispiele) liefert
zu wenig Anker — Haiku erkennt die Aufgabe nicht als machbar.

**Status**: ✅ stabil (bimodales Muster reproduzierbar über n=5)

---

## F-2.3 — H1 bestätigt: Prompt-Stil differenziert bei starken Modellen nicht

**Aussage**: H1 ("Pro Modell ist der verification_pct-Spread zwischen
Stilen < 10 pp") ist für Opus und Sonnet vollständig bestätigt
(Spread = 0 pp). Für Haiku ist H1 trivialerweise falsifiziert
(Spread = 63 pp), aber die Ursache ist nicht Stil-Sensitivität,
sondern kapazitätsbedingte Instabilität (F-2.2).

**Implikation für Code-Qualitäts-RQs**: Prompt-Stil kann auf
game-of-life als Control fixiert werden (z.B. prose oder
example-mapping), ohne Korrektheits-Confound bei Opus/Sonnet.

**Status**: ✅ stabil

---

## F-2.4 — H4 bestätigt: Mehrdeutigkeits-Mechanismus greift nicht bei trainingsbekannter Kata

**Aussage**: Bei RQ-1 (claim-office, domain-novel) verbessert
example-mapping die Korrektheit, weil konkrete Beispiele
domänenspezifische Mehrdeutigkeiten auflösen. Bei RQ-2
(game-of-life, trainingsbekannt) gibt es keine solchen
Mehrdeutigkeiten — die Conway-Regeln sind eindeutig und im
Vorwissen. Example-mapping wirkt hier über einen anderen Mechanismus:

- **Starke Modelle (Opus, Sonnet)**: Kein Effekt — sie brauchen die
  Beispiele nicht. Alle Stile liefern vpct=1.00.
- **Schwaches Modell (Haiku)**: Example-mapping wirkt als
  *Aktivierungsanker* — nicht weil es Mehrdeutigkeiten löst, sondern
  weil konkrete Input/Output-Paare dem Modell zeigen, dass die
  Aufgabe machbar ist und wie die Lösung aussehen soll.

**Falsifikation H4**: H4 ist *nicht* falsifiziert. Example-mapping
verbessert die Korrektheit bei trainingsbekannten Katas *nicht*
für starke Modelle. Bei Haiku hilft es, aber über einen anderen
Mechanismus (Aktivierung, nicht Disambiguierung).

**Status**: ⚠️ bedingt (Haiku-Befund ist robust, aber die
mechanistische Erklärung "Aktivierungsanker" ist eine Hypothese,
kein gemessener Effekt)

---

## F-2.5 — H2 kann nicht bewertet werden: Code-Qualität nur bei funktionierenden Runs vergleichbar

**Aussage**: Code-Qualitäts-Outcomes (code_mass, smell_total,
cc_longest_function, mccabe_max, cognitive_max) sind nur bei Runs
mit vpct > 0 aussagekräftig. Bei Haiku fallen 7/15 Runs aus
(code_mass=0, Agent hat nichts implementiert). Für Opus und Sonnet
(alle vpct=1.00):

| Modell | prose mass | user-story mass | ex-mapping mass |
|---|---:|---:|---:|
| opus-4-6 | 249 (σ=56) | 230 (σ=30) | 241 (σ=36) |
| sonnet-4-6 | 238 (σ=10) | 250 (σ=37) | 223 (σ=26) |

Kein konsistentes Stil-Ranking: Opus hat die höchste Mass bei
prose, Sonnet bei user-story. Unterschiede liegen im Bereich
der Run-zu-Run-Varianz. **H2 qualitativ bestätigt**: Prompt-Stil
induziert bei trainingsbekannten Katas kein systematisches
Code-Qualitäts-Ranking.

**Status**: ⚠️ bedingt (nur Opus/Sonnet, n=5 pro Zelle)

---

## F-2.6 — RQ-1-Prognose bestätigt: Prompt-Stil differenziert nicht auf trainingsbekannter Kata

**Aussage**: Die Prognose in RQ-1 ("game-of-life ist als
Mehrdeutigkeits-Aufdecker für Prompt-Stile nicht brauchbar") ist
für Opus und Sonnet vollständig bestätigt: verification_pct = 1.00
über alle Stile, Code-Qualität variiert nicht systematisch.

**Konsequenz für nachfolgende RQs**: Code-Qualitäts-RQs auf
game-of-life können Prompt-Stil als Control fixieren, ohne einen
Stil-Confound zu riskieren — sofern Haiku ausgeschlossen oder
separat behandelt wird.

**Status**: ✅ stabil

---

## F-2.7 — Verification-Adapter eliminiert Interface-Artefakte

**Aussage**: Vor Einführung des Verification-Adapters zeigten Opus
und Sonnet scheinbare Korrektheits-Fehler, die tatsächlich
Interface-Probleme waren: fehlendes `src/cli.ts` (Agent fiel in
Library-Modus) oder Multi-Step-Bug (CLI iterierte nur 1×). Der
Adapter (importiert die Agent-Funktion direkt, iteriert und
sortiert selbst) eliminiert diese Artefakte vollständig.

**Datenbasis**: Vor Adapter: Opus×EM 0.60, Sonnet×prose 0.93.
Nach Adapter: beide 1.00.

**Methodische Konsequenz**: Für trainingsbekannte Katas, bei denen
der Aufgabenkern (Regeln implementieren) vom Interface-Vertrag
(CLI, JSON-IO, Sortierung) trennbar ist, sollte die
Verification-Suite den Kern direkt prüfen — nicht den
Interface-Wrapper. Sonst misst `verification_pct` die
Interface-Compliance, nicht die Regelkorrektheit.

**Status**: ✅ stabil (methodische Erkenntnis)
