# RQ-12 — Findings: Emoji-Effekt cross-model

## Überblick

Cross-Model-Validierung der RQ-11-Befunde auf `sonnet-4-6-no-thinking` und `opus-4-6-portkey-no-thinking` (zusätzlich zu `opus-4-7-no-thinking` aus RQ-11). **Überraschendes Ergebnis: auf sonnet kehrt sich der Emoji-Effekt um — v6.4-no-emoji performt deutlich besser als v6 mit Emojis. Auf opus-4-6 versagen beide Workflow-Varianten gleichermassen.**

## Korrektheit-innen pro Zelle (n=5, ausser opus-4-7 n=10)

| Modell | v6 (mit Emojis) | v6.4 (ohne Emojis) | Δ |
|---|:---:|:---:|:---:|
| **opus-4-7-no-thinking** | 10/10 (100 %) | 10/10 (100 %) | ➡️ |
| **sonnet-4-6-no-thinking** | 2/5 (40 %) | **5/5 (100 %)** | **+60 pp** |
| **opus-4-6-portkey-no-thinking** | 1/5 (20 %) | 1/5 (20 %) | ➡️ |

Korrektheit-aussen (`verification_pct` Mittel):
- opus-4-7: v6=1.00 / v6.4=1.00
- sonnet-4-6: v6=0.28 / v6.4=0.88 — analoger Sprung
- opus-4-6-portkey: v6=0.20 / v6.4=0.20 — flach

---

## F-12.1 — v6-Hybrid generalisiert nicht auf sonnet-4-6 und opus-4-6-portkey

**Aussage:** Während v6-hybrid auf opus-4-7-no-thinking 100 % Korrektheit liefert (RQ-11 F-11.1, n=10 stabil), brechen schwaechere Modelle den Skill-Workflow vorzeitig ab:

- **Sonnet (mit Emojis)**: nur 2 von 5 Runs schliessen die TDD-Cycles ab; 3 Runs brechen nach der test-list-Phase ab (cycle_count=0). Run-Log endet typischerweise mit "Next Step: Invoke `/red` to activate the first test." — Skill wird angekuendigt, aber nicht aufgerufen.
- **Opus-4-6-portkey**: 4 von 5 Runs brechen ab; bei v6.4 kommen vier Runs immerhin einen Schritt weiter (cycle_count=1), aber nicht zum Abschluss.

**Mechanismus-Hypothese:** Der v6-Hybrid-Workflow setzt voraus, dass das Modell mehrfach pro Run explizite Skill-/Task-Tools aufruft (Skill für test-list/red/green, Task für refactor). Schwaechere Modelle behandeln diese Aufrufe als "optional fortzufuehren" und beenden den Loop frueh — moeglicherweise weil die Skill-Disziplin im Prompt nicht explizit genug ist fuer diese Modelle. Dies ist eine **Workflow-Generalisierbarkeits-Limitation**, nicht ein Emoji-Effekt.

**Konsequenz:** Aussagen ueber Code-Qualitaet auf sonnet/opus-4-6 sind aus dieser RQ **nicht ableitbar** — die Stichprobe der erfolgreichen Runs ist zu klein, und die abgebrochenen Runs verfaelschen die Mittelwerte.

---

## F-12.2 — ÜBERRASCHEND: Auf Sonnet vervielfacht Emoji-Entfernung die Korrektheits-Rate

**Aussage:** Sonnet-4-6-no-thinking laeuft mit v6.4 (ohne Emojis) **5 von 5 mal vollstaendig durch**, mit v6 (mit Emojis) nur **2 von 5 mal**. Bei n=5 ist dieser Δ-Sprung von +60 Prozentpunkten zwar statistisch grenzwertig (Fisher's exact einseitig p ≈ 0.07), aber das Muster ist klar und konsistent ueber alle drei Korrektheits-Indikatoren:

| Outcome | Sonnet v6 | Sonnet v6.4 |
|---|---:|---:|
| `tests_passing` rate | 40 % | **100 %** |
| `verification_pct` Mittel | 0.28 | **0.88** |
| `cycle_count` Mittel | 1.6 | **5.6** |

**Mechanismus-Hypothese:** Die Emoji-Dekoration im Workflow-Prompt scheint Sonnet **aktiv zu stoeren** — moeglicherweise als Stilbruch gegenueber Sonnets "nuechternem" Default-Style, der das Modell aus dem Skill-Loop wirft. Ohne Emojis liest sich der Prompt eher wie eine technische Spezifikation und Sonnet folgt ihm zuverlaessig.

Das **kehrt die a-priori-Hypothese H2** komplett um: erwartet wurde, dass schwaechere Modelle Emojis als Disziplin-Anker brauchen. Daten zeigen das **Gegenteil** fuer Sonnet.

**Konsequenz:** Falls Sonnet-Deployment ein Ziel ist, sollte v6.4 (Emojis raus) **bevorzugt** werden — nicht trotz, sondern **wegen** der Emoji-Entfernung.

---

## F-12.3 — Auf Opus-4-6 versagen beide Varianten gleichermassen

**Aussage:** Opus-4-6-portkey-no-thinking erreicht nur 1/5 Korrektheit in beiden Zellen. Die Emoji-Reduktion macht hier keinen Unterschied — das Modell scheitert generell am v6-Hybrid-Workflow.

| Outcome | Opus-4-6 v6 | Opus-4-6 v6.4 |
|---|---:|---:|
| `tests_passing` rate | 20 % | 20 % |
| `cycle_count` Mittel | 1.8 | 2.6 |
| `verification_pct` Mittel | 0.20 | 0.20 |

**Hypothese:** Kapazitaets-Limit oder Portkey-Routing-Artefakt dominiert. Eine getrennte Untersuchung der opus-4-6 vs opus-4-7 Workflow-Performance waere noetig — RQ-3 hatte opus-4-6 mit v4-subagents getestet (F-3.1: 100 % Korrektheit), also kann das Modell die Aufgabe loesen, aber nicht in der Skill-basierten Hybrid-Architektur.

**Konsequenz:** Fuer Opus-4-6 ist v6-Hybrid generell ungeeignet — Workflow-Wechsel zu v4-Subagents waere wahrscheinlich notwendig, unabhaengig von Emojis.

---

## F-12.4 — Code-Qualitaet auf sonnet/opus-4-6 mit dieser RQ nicht messbar

**Aussage:** Wegen F-12.1 (abgebrochene Runs) sind die Code-Qualitaets-Mittelwerte (`code_mass`, `smell_total`, `cc_longest_function`, `cognitive_max`, `mccabe_max`) auf sonnet/opus-4-6 **nicht interpretierbar als Workflow-Effekt** — abgebrochene Runs haben kleine, unfertige Codebases, was die Mittel kuenstlich nach unten zieht. Selbst bei den 5/5 erfolgreichen Sonnet-v6.4-Runs ist n=5 zu klein, um RQ-11-Befunde zu replizieren.

**Konsequenz:** Die RQ-11-Aussage "Emojis ohne Code-Qualitaets-Mittel-Effekt" gilt streng nur fuer opus-4-7-no-thinking. Cross-Model-Replikation der **Mittel-Effekte** waere eine separate Folge-RQ, die zuerst die Workflow-Compliance-Probleme aus F-12.1 loest.

---

## F-12.5 — Konsequenz fuer die Workflow-Optimierung

| Modell | Empfehlung |
|---|---|
| opus-4-7-no-thinking | **v6.4** (Emojis raus) ist gleichwertig in Qualitaet, −5 % Tokens — siehe RQ-11 |
| sonnet-4-6-no-thinking | **v6.4 stark bevorzugt** — Korrektheits-Sprung 40 % → 100 % |
| opus-4-6-portkey-no-thinking | weder v6 noch v6.4 zuverlaessig; **andere Workflow-Architektur** (v4-Subagents?) |

Damit ist **v6.4 fuer alle Direct-API-Modelle der Empfehlungs-Kandidat** — opus-4-7 unkritisch, sonnet sogar dringend empfehlenswert. Opus-4-6-Deployment ueber Portkey erfordert separate Workflow-Untersuchung.

**Folge-RQs:**
1. **RQ: v4-Subagents auf sonnet/opus-4-6 Korrektheits-Replikation** — pruefen, ob die Workflow-Compliance-Probleme aus F-12.1 spezifisch fuer Skill-basierte Hybrid-Workflows sind, oder allgemein fuer schwaechere Modelle.
2. **RQ-11 Replikation auf sonnet mit n=10** der erfolgreichen v6.4-Runs — Code-Qualitaets-Mittel-Effekt sauber messen, nachdem F-12.2 zeigt, dass der Workflow auf Sonnet ueberhaupt zuverlaessig durchlaeuft.

## Caveats

- **n=5 pro neuer Zelle**: bei extremem Korrektheits-Sprung (40 → 100 %) statistisch marginal (Fisher p ≈ 0.07), das Muster ist aber klar.
- **Workflow-Compliance-Effekt überlagert Emoji-Effekt**: die RQ-12-Frage "wirkt Emoji-Entfernung modell-uebergreifend auf Code-Qualitaet" ist nicht ohne weiteres beantwortbar — der primaere Effekt ist Korrektheits-/Compliance-Differenz, nicht Code-Qualitaet.
- **Opus-4-6 via Portkey**: nicht ausgeschlossen, dass Portkey-spezifische Routing-Eigenheiten die Performance druecken. Direct-API-Opus-4-6 ist nicht verfuegbar fuer Vergleich.
- **Vorzeitiger Abbruch verfaelscht alle Mittelwerte**: die opus-4-6 und sonnet-v6-Mittelwerte fuer code_mass etc. enthalten unfertige Codebases und sind **nicht** als Code-Qualitaets-Schaetzungen zu lesen.
