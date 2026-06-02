---
id: RQ-prompt-correctness
question: "Steigert Example-Mapping die Korrektheit gegenüber Prose und User-Story — und ist der Effekt modellabhängig?"
factors:
  prompt: [prose, example-mapping, user-story]
  model:
    - opus-4-7
    - opus-4-7-no-thinking
    - opus-4-6-portkey
    - opus-4-6-portkey-no-thinking
    - sonnet-4-6-portkey
    - sonnet-4-6-portkey-no-thinking
    - haiku-4-5-portkey
    - haiku-4-5-portkey-no-thinking
controls:
  workflow: v5-exact-single-context
  kata_base: claim-office
outcomes:
  - verification_pct
  - verification_passed
  - verification_total
  - duration_seconds
  - total_tokens
  - completed_within_budget
min_replicates: 5
status: aktiv
---

# RQ-prompt-correctness: Prompt-Stil-Effekt auf Korrektheit

Steigert Example-Mapping die Korrektheit gegenüber Prose und User-Story
— und ist der Effekt modellabhängig?

## Motivation: Korrektheit vor Code-Qualität

Code-Qualität (Smells, Komplexität, Funktionslänge) ist wertlos, wenn
das Programm die falsche Sache tut. Ein eleganter, gut strukturierter
Algorithmus, der die Domänenregeln falsch umsetzt, hat keinen
Produktionswert. Deshalb muss die erste Forschungsfrage klären, **unter
welchen Bedingungen der Agent korrekte Lösungen produziert** — bevor
wir die Qualität dieser Lösungen untersuchen. Alle nachfolgenden
Code-Qualitäts-RQs können dann auf Konfigurationen einschränken, von
denen bekannt ist, dass sie korrekte Ergebnisse liefern.

## Prompt-Stile

| Stil | Beschreibung |
|---|---|
| **prose** | Beschreibung der Regeln in Fließtext, keine Beispiele. |
| **example-mapping** | Regel + 1–3 konkrete Input/Output-Beispiele pro Regel. |
| **user-story** | "Als X möchte ich Y, damit Z" — Stakeholder-Perspektive ohne Beispiele. |

Konfiguration: `experiments/katas/claim-office-{prose, example-mapping, user-story}/prompt.md`.

## Modelle

| Modell | Thinking | API-Route |
|---|---|---|
| opus-4-7 | Adaptive Thinking | Anthropic direct |
| opus-4-7-no-thinking | Aus | Anthropic direct |
| opus-4-6-portkey | Thinking | Portkey Gateway |
| opus-4-6-portkey-no-thinking | Aus | Portkey Gateway |
| sonnet-4-6-portkey | Extended Thinking | Portkey Gateway |
| sonnet-4-6-portkey-no-thinking | Aus | Portkey Gateway |
| haiku-4-5-portkey | Extended Thinking | Portkey Gateway |
| haiku-4-5-portkey-no-thinking | Aus | Portkey Gateway |

Opus 4.7 läuft über die Anthropic-direct-API (Rate-Limit). Alle anderen
Modelle laufen über das Portkey-Gateway (rate-limit-frei) und können in
einem einzigen Batch erhoben werden.

## Warum v5 als Kontroll-Workflow?

Diese RQ misst den Effekt des **Prompt-Stils** auf **Korrektheit**. Der
Workflow darf daher kein eigenes Rauschen in die Korrektheits-Metrik
einbringen. Die drei TDD-Workflow-Kandidaten unterscheiden sich auf
claim-office erheblich (alle Werte: claim-office × example-mapping,
modellübergreifend, Stand 2026-05-11):

| Workflow | mean(verification_pct) | σ | n | Spread |
|---|---:|---:|---:|---|
| **v5** (single-context) | **1.000** | **0.000** | 3 | 1.0–1.0 |
| v3 (basic TDD) | 0.844 | 0.275 | 15 | 0.0–1.0 |
| v4 (subagents) | 0.340 | 0.419 | 20 | 0.0–1.0 |

### v4 scheidet aus (σ = 0.42)

Das Subagent-Lotterie-Problem (State-Rekonstruktion scheitert beim
Phase-Wechsel) verschluckt den Prompt-Stil-Effekt. Einzelne Runs
landen bei 0 % obwohl das Modell die Aufgabe beherrscht — ein
Workflow-Artefakt, kein Prompt-Signal. Beispiel: Opus-4.7 × v4 ×
example-mapping zeigt Runs mit 0 %, 0.27 %, 0.73 %, 1.00 % — der
Workflow dominiert die Varianz.

### v3 ist suboptimal (σ = 0.28)

v3 hat keine expliziten Phasen-Skripte; das Modell entscheidet selbst
über TDD-Disziplin. Auf schwächeren Modellen zeigt v3 Ausreißer, die
nicht prompt-bedingt, sondern workflow-bedingt sind (Haiku × v3 ×
example-mapping: 0.0, 0.4, 0.8). Dieses Rauschen würde den
Prompt-Effekt konfundieren.

### v5 liefert das sauberste Signal (σ = 0)

v5 hält den gesamten Kontext in einer Konversation — kein
Phase-Handoff, kein State-Verlust. Damit ist jede beobachtete Varianz
im `verification_pct` auf den Prompt-Stil und/oder das Modell
zurückführbar, nicht auf den Workflow.

**Einschränkung**: Die v5-Daten stammen bisher nur aus
Opus-4.7-no-thinking (n=3, alle 100 %). Ob v5 auch auf schwächeren
Modellen stabil bleibt, wird diese RQ selbst zeigen. Falls Haiku ×
v5 × example-mapping streut, wäre das ein Modell-Effekt — und genau
das will diese RQ messen.

**Datenlücke Opus 4.7 geschlossen (Stand 2026-06-02)**: opus-4-7
liegt jetzt in allen drei Stilen × beiden Thinking-Modi mit n=5 vor
(EM −thinking n=9). Effektgröße belegt: EM − prose = +66 pp
(+thinking, 0.29 → 0.95) bzw. +76 pp (−thinking, 0.21 → 0.97). Die
ältere „1.00 (n=3)"-Angabe war ein Kleinstichproben-Artefakt — der
belastbare EM-Mittelwert liegt bei 0.95–0.97. Einzige verbleibende
Teil-Lücke: opus-4-6-portkey × example-mapping bei n=4 (ein Run
wegen Vertex-AI-Routing-Defekt verworfen).

## Design

```
Faktor 1:  prompt        — 3 Stufen (prose, example-mapping, user-story)
Faktor 2:  model         — 8 Stufen (4 Modell-Tiers × ±Thinking)
Kontrolle: workflow      — v5-exact-single-context
Kontrolle: kata_base     — claim-office

Zellen:    3 × 8 = 24
Replikate: n = 5
Runs:      120 total
```

### Warum claim-office?

#### Die Kata als Enterprise-Simulation

claim-office (*Most Honorable Privileged Claims Office for Magical
Risks and Cursed Items*, MHPCO) ist eine eigens für dieses Lab
entwickelte Kata, die **nicht** in den Trainingsdaten der Modelle
vorkommt. Sie modelliert eine an Versicherungen angelehnte Domäne mit
bürokratisch-spezifischer Business-Logik: Risikokategorien,
Rabattstaffeln, Erstversicherungs-Bedingungen, kumulative
Schadensbewertung.

Die Formulierung ist bewusst **realistisch im Sinne von
Enterprise-Software**: Die Regeln enthalten die Art von
Mehrdeutigkeiten, die in realen Versicherungs-, Finanz- oder
Verwaltungsdomänen typisch sind — Begriffe mit mehreren plausiblen
Lesarten ("Erstversicherung": erster Vertrag des Kunden oder erster
Vertrag für ein Risiko?), implizite Berechnungsreihenfolgen und
Grenzfälle, die der Regeltext nicht explizit adressiert. Diese
Mehrdeutigkeiten sind nicht als Fallen konstruiert, sondern spiegeln
wider, wie fachliche Anforderungen in der Praxis formuliert werden:
unvollständig, kontextabhängig, und mit Wissen beladen, das der
Autor für selbstverständlich hält.

#### Externe Verifikations-Suite

Die Korrektheit wird **nicht** durch die vom Agenten geschriebenen
Unit-Tests gemessen (diese prüfen nur, ob der Agent seine eigene
Interpretation konsistent umsetzt), sondern durch eine **externe
Verifikations-Suite** aus 15 Szenarien
(`experiments/katas/claim-office-verification/`). Die Suite deckt
drei Stufen ab: 7 isolierte Regelprüfungen, 4 kombinierte Szenarien
und 4 Story-basierte End-to-End-Fälle. Der Agent sieht diese Suite
nie — sie läuft nach dem Container-Run auf dem Host.

`verification_pct` (0.0–1.0) misst den Anteil bestandener Szenarien
und ist damit ein **objektives Korrektheitsmaß**, unabhängig von der
Selbsteinschätzung des Agenten.

#### Warum nicht game-of-life?

game-of-life ist als Mehrdeutigkeits-Aufdecker für Prompt-Stile
**nicht brauchbar**. Die Spec inkl. Beispiele ist in den Trainingsdaten
der Modelle — Modelle "kennen" die korrekte Lösung bereits, unabhängig
davon, ob der Prompt Beispiele mitliefert. Die Stile differenzieren
auf game-of-life nicht messbar in Korrektheit.

### Warum voller Modell-Mix?

Die Kernfrage ist, ob stärkere Modelle den Example-Mapping-Vorteil
**kompensieren** können — ob also ein Opus mit Prose die gleiche
Korrektheit erreicht wie ein Haiku mit Example-Mapping. Dafür braucht
es die volle Modell-Variation. Die Thinking-Dimension klärt zusätzlich,
ob Reasoning-Kapazität den Prompt-Stil-Effekt abschwächt.

## Hypothesen

- **H1**: Example-mapping erhöht `verification_pct` gegenüber
  prose bei Modellen mit ausreichender Reasoning-Kapazität.
- **H2**: User-story erhöht `verification_pct` gegenüber prose nur
  geringfügig — Stakeholder-Perspektive löst keine domänen-internen
  Mehrdeutigkeiten auf.
- **H3**: Stärkere Modelle (Opus) erreichen mit prose höhere
  `verification_pct` als schwächere (Haiku), aber der Abstand zu
  example-mapping bleibt — Modell-Stärke kompensiert fehlende
  Beispiele nicht vollständig.
- **H4**: Thinking-Mode verbessert `verification_pct` unabhängig vom
  Prompt-Stil, aber der Zugewinn ist kleiner als der
  Example-Mapping-Effekt.
- **H5**: Schwächere Modelle (Haiku) erreichen auch mit
  example-mapping keine volle Korrektheit — die Beispiele
  entschärfen die Mehrdeutigkeiten nur, wenn das Modell genug
  Reasoning-Kapazität hat, sie auf neue Eingaben zu generalisieren.

## Batch-Strategie

1. **Phase 1** (rate-limit-frei): Opus 4.6 + Sonnet + Haiku via
   Portkey — 18 Zellen × n=3 = 54 Runs in einem Batch.
2. **Phase 2** (zeitversetzt): Opus 4.7 via Anthropic direct —
   6 Zellen × n=3 = 18 Runs (strenges Rate-Limit).

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow=v5-exact-single-context`,
`kata=claim-office-{prose|example-mapping|user-story}`,
Modell ∈ {opus-4-7, opus-4-7-no-thinking, opus-4-6-portkey,
opus-4-6-portkey-no-thinking, sonnet-4-6-portkey,
sonnet-4-6-portkey-no-thinking, haiku-4-5-portkey,
haiku-4-5-portkey-no-thinking}.
