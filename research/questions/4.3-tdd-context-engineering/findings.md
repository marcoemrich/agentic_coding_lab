# RQ-context Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Welche Form der Kontext-Strukturierung — isolierte Subagent-Kontexte pro
TDD-Phase (v4) oder ein geteilter, akkumulierter Single-Context (v5) —
fuehrt zu besserer Code-Qualitaet?**

Datenbasis: 40 Runs (4 Zellen × n=10), Stand 2026-05-15. Modell
`opus-4-7-no-thinking`, zwei Katas: `game-of-life-example-mapping`
(Library-Form mit API-Vertrag) und `claim-office-example-mapping`
(CLI-Form mit externem Verifikations-Adapter, komplexere Domain). Beide
Workflows nutzen identischen Phasen-Skript-Inhalt; einziger Unterschied
ist die Kontext-Architektur.

---

## Ueberblick: v4 vs v5 ueber beide Katas

| Outcome | game-of-life v4 | game-of-life v5 | claim-office v4 | claim-office v5 |
|---|---:|---:|---:|---:|
| `cognitive_max` | **4.40** | 14.50 | **10.50** | 14.20 |
| `mccabe_max` | **4.50** | 8.90 | **7.90** | 10.20 |
| `cc_longest_function` | **8.10** | 17.40 | **25.00** | 31.40 |
| `smell_total` | **2.60** | 4.10 | **1.80** | 8.90 |
| `code_mass` | 166.60 | **152.60** | **625.90** | 761.60 |
| `verification_pct` | 1.00 | 1.00 | 0.67 | **0.87** |
| `total_tokens` (M) | **2.56** | 8.14 | 13.66 | 14.14 |
| `duration_seconds` | 1163 | **380** | 3693 | **655** |

Bester Wert pro Spalte fett. Auf Code-Qualitaets-Metriken: kleiner = besser.
Auf `verification_pct`: groesser = besser.

---

## F-context.1 — Isolierte Subagent-Kontexte (v4) verbessern Code-Qualitaet auf beiden Katas; Effekt auf GoL groesser als auf claim-office ✅ stabil

**Aussage**: v4 dominiert v5 auf jeder Code-Qualitaets-Metrik (außer
`code_mass` auf GoL marginal anders, auf claim-office aber wieder zugunsten
v4). Cross-Kata-Vergleich der v5/v4-Faktoren:

| Metrik | v5/v4 game-of-life | v5/v4 claim-office |
|---|---:|---:|
| `cognitive_max` | 3.3× | 1.35× |
| `mccabe_max` | 2.0× | 1.29× |
| `cc_longest_function` | 2.1× | 1.26× |
| `smell_total` | 1.6× | **4.94×** |

Vorzeichen ueber alle Komplexitaets-Outcomes konsistent zugunsten v4.
Effekt auf game-of-life dramatischer (Faktoren 1.6–3.3×); auf
claim-office gedaempft auf 1.3× — bis auf `smell_total`, wo v4 sogar
deutlich besser ist (1.8 vs 8.9 — fast 5×).

**Mechanik-Interpretation**: claim-office ist mit 600–760 LoC ein
substantieller Code-Korpus; die absoluten Komplexitaets-Werte sind
naturgemaess hoeher als bei der ~30-LoC-GoL-Implementation. Der
relative v4-Vorteil bleibt aber bestehen — die Phasen-Isolation
verhindert auch hier opportunistisches Vorausschauen in der Green-Phase.

H1 bestaetigt, H6 (Cross-Kata-Replikation) bestaetigt mit gedaempftem
Effekt-Magnitude.

**Datenbasis**: 40 Runs (10 pro Zelle). σ auf claim-office substanziell
groesser (z.B. v4-cognitive_max σ = 9.44, Range 4–30) — die Streuung
waechst mit Kata-Komplexitaet.

---

## F-context.2 — Aussen-Korrektheit kehrt sich um: v4 fuehrt auf GoL, v5 fuehrt auf claim-office ⚠️ bedingt → wichtige Falsifikation von H2

**Aussage**: Auf game-of-life ist `verification_pct` 100 % in beiden
Workflows. **Auf claim-office kippt das Muster**: v5 erreicht 0.87
(σ=0.32), v4 nur 0.67 (σ=0.36). Per-Run-Verteilung:

| Workflow | 15/15 perfekt | 11/15 partial | ≤ 5/15 Failure |
|---|---:|---:|---:|
| v4 (claim-office) | 4/10 | 2/10 | **4/10** |
| v5 (claim-office) | 8/10 | 1/10 | 1/10 |

v4 hat eine 40 %-Rate von **Spec-Coverage-Failures**: Runs, in denen die
externe Akzeptanz-Suite ≤ 5/15 Szenarien besteht. Die `tests_passing`-
Rate ist trotzdem 100 % — die vom Agenten selbst geschriebenen Tests
laufen gruen, aber decken nur einen Teil der Spec ab.

**Mechanik-Interpretation — Kontext-Engineering-Trade-off**:

- Auf einer einfachen, eng spezifizierten Kata (game-of-life: 4 Regeln,
  klare Examples) ist v4s Phase-Isolation ein Vorteil: jeder Subagent
  implementiert minimal, ohne Drift.
- Auf einer komplexen, breit spezifizierten Kata (claim-office: 9
  Rabatt-Regeln, Erstkunden-Logik, Material-Block-Constraints,
  Currency-Rounding, Error-Codes fuer 5 Failure-Modi) wird v4s
  Minimalismus zur **Schwaeche**: die Green-Phase implementiert nur
  was der aktuelle Test verlangt; die Refactor-Phase fuegt keine
  Features hinzu; Edge-Cases, die der Agent in der Test-List-Phase
  nicht antizipiert hat, werden nie implementiert.
- v5s Shared-Context behaelt die volle Spec im Blick und implementiert
  defensiver — der Agent kennt die noch ausstehenden Tests und sieht
  die ganze Kata-Beschreibung kumuliert; Edge-Cases werden im
  Refactor-Schritt nachgezogen.

**H2 falsifiziert**: Aussen-Korrektheit ist *nicht* Kontext-Architektur-
unabhaengig auf komplexen Katas. Die Wahl der Kontext-Architektur ist
**eine Korrektheits-Frage**, nicht nur eine Qualitaets-Frage.

**Datenbasis**: 20 claim-office-Runs, 15 Verifikations-Szenarien pro Run.
n=10 → 95 % CI fuer die 40 %-Failure-Rate bei v4 etwa 12–74 %; auch im
optimistischen Fall (~12 %) waere die Rate kein zufaelliges Phaenomen.

**Bedingung**: ⚠️ bedingt — eine zweite komplexe Kata (z.B. mars-rover
mit aehnlicher Spec-Breite) wuerde das Muster festigen oder die
claim-office-Spezifitaet aufzeigen.

---

## F-context.3 — Kosten-Trade-off: v4 spart Tokens auf GoL, ist auf claim-office aber etwa gleich teuer; v5 immer wallclock-effizient ✅ stabil

**Aussage**: Kosten-Profile pro Kata:

| Kosten-Outcome | GoL v4 | GoL v5 | claim-office v4 | claim-office v5 |
|---|---:|---:|---:|---:|
| `total_tokens` (M) | 2.56 | 8.14 | 13.66 | 14.14 |
| `duration_seconds` | 1163 | 380 | 3693 | 655 |
| **Faktor v5/v4 Tokens** | **3.2×** | | **1.04×** | |
| **Faktor v4/v5 Wallclock** | **3.1×** | | **5.6×** | |

- **Token-Trade-off variiert mit Kata-Komplexitaet**: Auf game-of-life
  spart v4 Faktor 3.2× Tokens. Auf claim-office sind beide Workflows
  nahezu gleich teuer (Faktor 1.04×) — der claim-office-Loesungs-Pfad
  braucht so viele Tokens, dass die Akkumulation in v5s Single-Context
  kaum mehr als die Wiederholung in v4s Subagent-Kontexten wiegt.
- **Wallclock-Trade-off wird auf claim-office groesser**: 5.6× statt
  3.1× auf GoL. v4-claim-office-Runs dauern im Mittel ~62 min; v5
  ~11 min. Subagent-Spawn-Overhead skaliert mit Anzahl TDD-Zyklen, und
  claim-office hat mehr Zyklen als GoL.

H3 nur auf GoL bestaetigt, auf claim-office falsifiziert (Tokens etwa
gleich). H5 (Wallclock zugunsten v5) cross-kata sehr deutlich bestaetigt.

**Konsequenz fuer Setup-Wahl**:
- Auf einfachen, eng spezifizierten Aufgaben: v4 fuer Qualitaet *und*
  Token-Effizienz; nur Wallclock leidet.
- Auf komplexen, breit spezifizierten Aufgaben: v4 spart keine Tokens
  mehr, Code-Qualitaet ist nur marginal besser, **Aussen-Korrektheit
  ist sogar schlechter** (F-context.2), und Wallclock kostet 5.6× mehr. Der
  Vorteil von v4 schmilzt.

---

## F-context.4 — Tail-Risiken: v4 hat auf beiden Katas spezifische Failure-Modi ⚠️ bedingt

**Aussage**: Pro Workflow lassen sich charakteristische Tail-Risiken
benennen:

**v4 auf game-of-life** (10 Runs):
- 1/10 Refactor-Aussetzer (cognitive_max=17 in einer monolithischen
  Funktion ohne Helper-Split).
- 1/10 Wallclock-Aussetzer (3923 s ≈ 65 min vs Median ~14 min).
- Korrektheit aber 100 %.

**v4 auf claim-office** (10 Runs):
- **4/10 Spec-Coverage-Failures** (verification_pct ≤ 33 %, siehe F-context.2)
  — das mit Abstand schlimmste Tail-Risiko.
- Hoch korreliert mit *niedrigem* cognitive_max (Mittel ~5 in den
  Failures vs ~17 in den 15/15-Runs): minimale Implementation =
  schlechte Spec-Abdeckung.

**v5 auf game-of-life** (10 Runs):
- cognitive_max range 9–24, σ 4.84 — breit, aber kein expliziter Outlier.
- 1/10 Token-Aussetzer (12.2 M vs Median ~8 M).

**v5 auf claim-office** (10 Runs):
- 1/10 Total-Failure (verification_pct = 0.00).
- Sonst 9/10 mit ≥ 73 % Spec-Abdeckung — deutlich robuster als v4.

**Konsequenz**: v4 hat einen schaerferen Failure-Tail, der mit
Kata-Komplexitaet zunimmt. Auf einfachen Aufgaben ist das vertretbar
(~10 % minor failures, Korrektheit intakt). Auf komplexen Aufgaben wird
es zur dominanten Sorge (40 %-Rate von Spec-Coverage-Failures).

**Bedingung**: ⚠️ bedingt — n=10 ist zur Tail-Quantil-Charakterisierung
knapp; 95 %-CIs der Failure-Raten breit.

---

## F-context.5 — Test-Staerke (`mutation_score`) zeigt dieselbe Kata-Inkonsistenz wie Aussen-Korrektheit — verstaerkt F-context.2 ⚠️ bedingt

**Aussage**: Mutation-Score (Stärke der vom Implementierer selbst
geschriebenen internen Tests, Stryker) ist auf den beiden Katas
**entgegengesetzt verteilt**:

| Kata | v4 mean (σ, min, max) | v5 mean (σ, min, max) | Sieger |
|---|---|---|---|
| game-of-life (n=10) | 0.908 (σ=0.080, 0.735, 0.957) | **0.945** (σ=0.036, 0.843, 0.965) | **v5** (+0.037) |
| claim-office (n=10) | **0.927** (σ=0.042, 0.832, 0.980) | 0.876 (σ=0.035, 0.839, 0.957) | **v4** (+0.051) |

**Mechanik der Umkehrung**:
- Auf **game-of-life** schreibt v5 (single-context) strengere Tests, weil
  das Modell die bisherige Implementierung samt Lücken sieht und gezielt
  ergänzende Tests formuliert.
- Auf **claim-office** schreibt v4 (isolierte Subagents) strengere Tests:
  jeder Test wird ohne Kenntnis des bisherigen Codes entworfen und prüft
  damit eigenständig, statt auf bereits implementierte Pfade einzuschwenken.
- Welche Architektur gewinnt, hängt offenbar von der **Aufgaben-Spec-Dichte**
  ab: dichte, kleine Specs (GoL) → v5 sieht mehr Kontext und kann besser
  generalisieren. Spärliche, große Specs (claim-office) → v4's Isolation
  zwingt jeden Test zu eigenständiger Härte.

**Verbindung zu F-context.1 und F-context.2**: Auf game-of-life ist v4 zwar bei
Komplexität (F-context.1) und Aussen-Korrektheit besser, hat aber **schwächere
Tests** als v5 — d.h. das hohe `verification_pct` von v4 auf GoL ist
weniger ein Verdienst seiner Tests als der Modell-Generalisierung. Auf
claim-office liegen Test-Stärke (v4 > v5) und Aussen-Korrektheit (v5 > v4)
auseinander: v4 hat strengere interne Tests, trifft aber weniger
Acceptance-Szenarien. Das ist eine **dritte Falsifikations-Variante** für
H2 (uniforme v4-Überlegenheit): nicht nur kehrt sich Aussen-Korrektheit
zwischen Katas um — sondern auch die Trennung von Innen-Test-Stärke und
Aussen-Korrektheit verläuft pro Kata anders.

**v4-Streuung bestätigt**: σ=0.080 auf GoL, σ=0.042 auf claim-office —
auf beiden Katas hat v4 die breiteste Test-Stärke-Verteilung. Tail-Risiko-
Beobachtung aus F-context.4 wiederholt sich in dieser Metrik.

**Datenbasis**: 40 Runs (4 Zellen × n=10), opus-4-7-no-thinking,
example-mapping. Stryker 8.6.0.

---

## Caveats

- **Single model**: Nur `opus-4-7-no-thinking`. Bei staerkeren Modellen
  (Opus mit Thinking) koennte v4 mehr Spec-Antizipation in der Test-List-
  Phase leisten und die F-context.2-Spec-Coverage-Luecke schliessen — offen.
- **Zwei Katas**: game-of-life (eng spezifiziert) und claim-office
  (breit spezifiziert). Mars-rover als dritte Kata mittlerer Komplexitaet
  bleibt offen — wuerde die Magnituden-Skalierung (GoL → claim-office)
  weiter validieren.
- **Identischer Phasen-Skript-Inhalt**: garantiert durch die Workflow-
  Definition. Diese RQ misst nur den Effekt der Kontext-Architektur.
- **Tail-Praezision**: Auftrittsraten ~10 % bei GoL, ~40 % bei
  claim-office sind bei n=10 punktuell — Konfidenzintervalle breit.
  Trend (v4 instabiler bei komplexer Kata) aber konsistent ueber alle
  beobachteten Outcomes.
- **Refactor-Aussetzer als Workflow-Bug**: v4 Refactor-Phase verlaesst
  sich auf den Phasen-Trigger; bei Spec-Coverage-Failures koennte ein
  expliziter Komplexitaets-/Coverage-Trigger fuer den Refactor-Subagent
  helfen. Nicht Teil dieser RQ, aber dokumentiert als Verbesserungsansatz.
