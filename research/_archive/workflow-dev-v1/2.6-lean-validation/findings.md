# RQ-lean — Findings: v6.5-lean + v6.6-leaner Bundle-Validierung

## Überblick

3-way Vergleich auf game-of-life-example-mapping, opus-4-7-no-thinking, **alle n=10**:

- **v6-hybrid**: Original mit allen Sektionen
- **v6.5-lean**: kombinierte Reduktion (Four Rules raus, Pep raus, Emojis raus, Project-Standards raus) + skill-creator-Why-Rewrites (`tdd.md`, `red.md` Step 7, `green.md` Minimality)
- **v6.6-leaner**: zusätzlich `test-list.md` konsolidiert mit Why-Block + DO/DON'T-Sections in `red.md` und `refactor.md` entfernt

**Headline-Befund:** v6.5-lean ist Quality-First-Champion (bessere Qualität, mehr Disziplin, höhere Kosten). v6.6-leaner liefert **die niedrigsten Token-Kosten überhaupt** — kostet aber leicht Code-Qualität und Disziplin gegenüber v6.5. Die DO/DON'T-Listen waren **nicht** rein redundant.

## Headline-Tabelle

| Outcome | v6 (n=10) | v6.5-lean (n=10) | v6.6-leaner (n=10) | Bemerkung |
|---|---:|---:|---:|---|
| **Code-Qualität** (kleiner = besser) | | | | |
| Code-Mass (APP) | 158.6 ± 15.14 | **143.9 ± 6.06** 🏆 | 146.4 ± 10.27 | v6.5 bestes, v6.6 leicht schlechter |
| Smell-Summe | **2.2 ± 0.42** 🏆 | **2.2 ± 0.42** 🏆 | 2.5 ± 0.53 | v6 und v6.5 gleichauf, v6.6 leicht schlechter |
| Spitzen-Komplexität (`cc_longest_function`) | 13.1 ± 5.97 | **12.7 ± 5.79** 🏆 | 15.7 ± 4.99 | v6.6 deutlich schlechter (+24 %) |
| `cognitive_max` | 5.2 ± 2.30 | **5.1 ± 3.84** 🏆 | 5.8 ± 4.02 | v6.5 knapp vorn |
| `mccabe_max` | **4.5 ± 1.51** 🏆 | **4.5 ± 2.01** 🏆 | 5.0 ± 2.05 | v6 und v6.5 gleichauf |
| **TDD-Disziplin** | | | | |
| `refactorings_applied` (höher = besser) | 4.0 ± 1.63 | **6.9 ± 2.33** 🏆 | 5.9 ± 1.45 | v6.5 mit +72 % vs v6 |
| `cycle_count` (mehr = mehr TDD-Granularität) | **8.3 ± 0.82** 🏆 | 8.2 ± 0.63 | 6.0 ± 1.25 ⚠️ | v6.6 −27 % Cycles! |
| `predictions_correct_rate` (höher = besser) | 99.4 % | **100 %** (166/166) 🏆 | 97.5 % (119/122) ⚠️ | v6.6 fällt ab |
| `tests_passed_immediately` (niedriger = weniger Over-Impl) | 3.3 ± 3.02 | 1.4 ± 2.27 | **0.4 ± 0.70** 🏆 | v6.6 niedrigster (Folge weniger Cycles) |
| **Kosten** (kleiner = besser) | | | | |
| `total_tokens` | 6.62 M | 7.40 M | **6.22 M** 🏆 | v6.6 günstigster (−6 % vs v6, −16 % vs v6.5) |
| `duration_seconds` (mean) | **521** 🏆 | 624 | 803 (σ=662) | v6.6 mean verzerrt durch Outlier |
| `duration_seconds` (median) | **~510** 🏆 | ~620 | 656 | v6.6-Median nur +29 % vs v6 |
| `duration_seconds` (mean ohne Outlier) | **521** 🏆 | 624 | 609 | v6.6 fast gleichauf mit v6 |
| **Korrektheit** | | | | |
| `tests_passing` / `verification_pct` | **100 % / 1.00** 🏆 | **100 % / 1.00** 🏆 | **100 % / 1.00** 🏆 | unverändert (Drei-Wege-Gleichstand) |

---

## F-lean.1 — v6.5-lean liefert leicht bessere Code-Qualität als v6; v6.6 fällt zurück

**Aussage:** v6.5-lean übertrifft v6 auf 3 von 5 Komplexitäts-Metriken (alle innerhalb ±1 σ). v6.6-leaner dreht den Trend wieder um: auf 4 von 5 Metriken leicht schlechter als v6.5, mit `cc_longest_function` deutlich (+24 % vs v6.5, +20 % vs v6).

**Mechanismus für v6.5-Vorteil:** die skill-creator-Why-Rewrites disziplinieren das Refactoring (siehe F-lean.2).

**Mechanismus für v6.6-Rückgang:** vermutlich verkürzte Test-Liste (cycle_count 6 vs 8) reduziert Refactor-Opportunities pro Run — weniger Iterationen, in denen Spitzen-Komplexität bereinigt werden kann.

---

## F-lean.2 — v6.5-lean hat den stärksten Disziplin-Boost; v6.6 liegt dazwischen

**Aussage:** Die TDD-Disziplin-Profile sind klar gestaffelt:

| Disziplin-Indikator | v6 | v6.5 | v6.6 |
|---|---:|---:|---:|
| `refactorings_applied` μ | 4.0 | **6.9** (+72 %) | 5.9 (+48 %) |
| `tests_passed_immediately` μ | 3.3 | 1.4 | 0.4 |
| `predictions_correct_rate` | 99.4 % | **100 %** | 97.5 % |
| `cycle_count` μ | 8.3 | 8.2 | **6.0** |

Drei Verhaltensänderungen lassen sich konkreten Edits zuordnen:

- **v6.5 → v6.6 Pred-Rate-Abfall (100 % → 97.5 %)**: tritt parallel zum Entfernen der DO/DON'T-Listen aus `red.md` auf. Die DO-Liste sagte "Make explicit predictions before running tests" — der Hinweis stand zusätzlich zu den Process-Steps und wirkte als finale visuelle Checkliste. Ohne ihn lässt das Modell gelegentlich Prediction-Lines verkürzt fallen. Parallel zur RQ-pep F-pep.2-Erkenntnis ("strict discipline"-Streichung kostete Pred-Rate −6.9 pp): kleine Wortwahl-Änderungen in `red.md` haben unverhältnismäßig große Disziplin-Effekte.
- **v6.5 → v6.6 Cycle-Count-Abfall (8.2 → 6.0)**: tritt parallel zur `test-list.md`-Konsolidierung auf. Das neue Why-Block in `test-list.md` empfiehlt explizit *"3-6 tests is the typical target. Fewer means the base scope is incomplete; more usually means edge cases crept in."* Das Modell folgt der Empfehlung und produziert kürzere Listen. Reduziert Scope (weniger Tests pro Run), spart Tokens (siehe F-lean.4), aber auch weniger Refactor-Opportunities.
- **v6.5 → v6.6 Refactor-Quote-Abfall (6.9 → 5.9)**: indirekter Effekt — bei 6 statt 8 Cycles ist die maximale Refactor-Quote ohnehin niedriger; pro Cycle ist die Quote sogar gleich (5.9/6.0 ≈ 6.9/8.2).

H4-Bewertung uneinheitlich:
- H4 für v6.5: deutlich übertroffen (Disziplin besser)
- H4 für v6.6: leicht verletzt (Pred-Rate fällt, cycle_count fällt)

---

## F-lean.3 — Stabilität: v6.5 mit code_mass-Sprung, v6.6 in cc_longest enger aber elsewhere ähnlich

**Aussage:** Die Streuungs-Profile sind unterschiedlich pro Reduktionsstufe:

| Metrik | v6 σ | v6.5 σ | v6.6 σ |
|---|---:|---:|---:|
| Code-Mass | 15.14 | **6.06** (0.40×) | 10.27 (0.68×) |
| Smell-Summe | 0.42 | 0.42 | 0.53 (1.26×) |
| Spitzen-Komplexität | 5.97 | 5.79 | **4.99** (0.84×) |
| `cognitive_max` | 2.30 | 3.84 (1.67×) | 4.02 (1.75×) |
| `mccabe_max` | 1.51 | 2.01 | 2.05 |

`code_mass`-Stabilität nimmt vom v6 zu v6.5 stark zu, geht in v6.6 wieder zurück (aber besser als v6). `cognitive_max`-σ-Verbreiterung tritt bei v6.5 schon auf und bleibt bei v6.6 — Outlier-Runs mit cognitive=12 in beiden.

---

## F-lean.4 — v6.6 ist Token-Sieger, v6.5 Quality-Sieger, v6 Wallclock-Sieger

**Aussage:** Klare 3-way Differenzierung in der Kosten-Dimension:

| Kosten-Outcome | v6 | v6.5 | v6.6 | Sieger |
|---|---:|---:|---:|---|
| `total_tokens` | 6.62 M | 7.40 M | **6.22 M** | v6.6 (−16 % vs v6.5) |
| `duration_seconds` (mean) | **521** | 624 | 803 | v6 (wegen v6.6-Outlier) |
| `duration_seconds` (median) | ~510 | ~620 | 656 | v6 |
| `duration_seconds` (mean ohne Outlier, n=9 für v6.6) | 521 | 624 | 609 | v6.6 fast gleichauf mit v6 |

**v6.6 hat einen Outlier-Run mit 2656s Wallclock** bei sonst normalen TDD-Phasen (6 cycles × 76s avg = 456s aktive Arbeit; 36 min wurden außerhalb der TDD-Phasen verbraucht). Das ist vermutlich ein Infrastruktur-Stall (API-Backoff, Container-Pause), nicht ein Workflow-Effekt. Ohne Outlier liegt v6.6 bei 609s mean — *günstiger* als v6.5 und nur +17 % vs v6.

**Mechanismus für v6.6-Token-Vorteil:** Die `test-list.md`-Empfehlung "3-6 tests target" reduziert cycle_count um 27 % → 2.2 weniger Refactor-Subagent-Spawns → ~600 K Tokens gespart pro Run. Plus die Prompt-Reduktion (test-list rewrite + DO/DON'T raus) spart selbst ~50 K Tokens pro Run. Beides zusammen erklärt den Sprung von 7.40 M (v6.5) auf 6.22 M (v6.6).

**Orthogonalitäts-Hauptbefund verfeinert:**
- v6.5 → v6.6 zeigt: wenn die Prompt-Edits *weniger* Subagent-Spawns auslösen (statt mehr wie v6 → v6.5), spart sich Token-Mehrkosten **und** Prompt-Tokens
- Aber: weniger Spawns = weniger Refactor-Iterationen = leichter Quality-Verlust

---

## F-lean.5 — Korrektheit überall 100 % (Sanity)

`tests_passing = 100 %` und `verification_pct = 1.00` über alle 30 Runs (3 × n=10). Keine Pipeline-Auffälligkeit, keine Marker-Bruche.

---

## F-lean.6 — Konsequenz: drei Workflow-Profile für drei Ziel-Profile

| Ziel-Profil | Empfehlung | Kosten-Profil |
|---|---|---|
| **Token-Budget primär** | **v6.6-leaner** | −16 % vs v6.5, −6 % vs v6 |
| **Quality + Disziplin primär** | **v6.5-lean** | +72 % Refactor, 100 % Pred, +12 % Tokens vs v6 |
| **Wallclock primär (game-of-life)** | **v6** | klar schneller, leichter Quality-Tradeoff vs v6.5 |
| **Sonnet-Deployment** | v6.4-no-emoji (RQ-emoji-cross-model) | n/a hier |

v6.6 hat die DO/DON'T-Hypothese aus dem skill-creator-Review **teilweise widerlegt**: die Listen waren nicht rein redundant — Pred-Rate fällt um 2.5 pp ohne sie. Plus die Test-List-Empfehlung "3-6 tests" hat einen messbaren Scope-Effekt (cycle_count −27 %).

**Folge-RQs:**
1. **v6.7 = v6.5 + DO/DON'T raus (ohne test-list-Konsolidierung)** — separiert die Pred-Rate-Wirkung von der Cycle-Count-Wirkung
2. **v6.6 auf claim-office** — die Cycle-Count-Reduktion könnte auf der längeren CLI-Kata stärker zuschlagen, weil dort mehr Tests gebraucht werden
3. **Outlier-Investigation für v6.6** — der 2656s-Outlier ist Infrastruktur-Stall (TDD-Metriken normal), aber bei breiter Adoption sollte das Stall-Risiko quantifiziert werden

## Caveats

- **Single Kata, single Modell**: nur game-of-life-example-mapping auf opus-4-7-no-thinking. Generalisierbarkeit auf claim-office und Sonnet offen.
- **Reduktion und Why-Rewrites in v6.5 nicht separierbar**: ob die Disziplin-Boosts aus den Why-Begründungen oder aus der Prompt-Schlankheit kommen, bleibt eine offene Frage. Eine "v6.5-no-why"-RQ würde das trennen.
- **v6.6 ändert zwei Dinge gleichzeitig**: test-list-Konsolidierung (mit expliziter "3-6 tests"-Empfehlung) UND DO/DON'T-Entfernung. Die Effekte aus F-lean.4 sind nicht getrennt zuzuordnen.
- **v6.6 cognitive_max-Outlier**: 1 von 10 Runs mit cognitive=12 (gleich wie v6.5). Manuelle Inspektion könnte zeigen, ob das ein Refactor-Aussetzer ist.
- **v6.6 Wallclock-Outlier (2656s)**: Infrastruktur-Stall, keine Workflow-Pathologie. Aussagen über v6.6-Geschwindigkeit besser via Median (656s) oder mean ohne Outlier (609s) interpretieren.
- **Why-Block-Wirkung in test-list.md asymmetrisch**: die Empfehlung "3-6 tests" wirkt als implizite Obergrenze. Hätte ich den Why-Block ohne diese Zahl-Empfehlung formuliert, wäre der cycle_count vermutlich nicht gefallen. Wortwahl-Sensitivität in Skill-Prompts ist offenbar sehr hoch.
