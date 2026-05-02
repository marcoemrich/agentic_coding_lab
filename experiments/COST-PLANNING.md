# Cost Planning: Smart-Subset vs. Full Matrix

Vergleich zwischen Claude **Max-Subscription (nativ)** und **Portkey
Gateway** als Backend für die Experiment-Runs. Grundlage: 235
historische Runs aus `old_runs/`, daraus abgeleitete Mittelwerte für
Tokenverbrauch und Wall-Clock pro Lauf.

> Alle Zahlen sind Schätzungen. Reale Verbräuche schwanken stark mit
> Kata-Komplexität und Workflow-Variante (v4/v5 mit Thinking sind
> deutlich teurer und langsamer als v1/v3).

---

## 1. Annahmen pro Lauf (Mittelwerte aus alten Runs)

| Workflow | Avg In-Tokens | Avg Out-Tokens | Avg Cache-Read | Avg Wall-Clock |
|----------|--------------:|---------------:|---------------:|---------------:|
| v1-oneshot              |  ~10k |  ~3k |  ~5k | ~90s |
| v2-iterative            |  ~25k |  ~8k | ~15k | ~180s |
| v3-basic-tdd            |  ~20k |  ~6k | ~12k | ~200s |
| v4-exact-subagents      | ~120k | ~25k | ~80k | ~480s |
| v5-exact-single-context | ~150k | ~20k | ~70k | ~440s |

Modell-Aufschlag bei aktiviertem Thinking: ca. ×1.4 auf Output-Tokens
und Wall-Clock.

---

## 2. Pricing-Modelle

### Max-Subscription (nativ)

- Pauschal (Max 5x): **100 USD / Monat**, Max 20x: **200 USD / Monat**.
- Rate-Limit: rollendes 5h-Fenster (~200-800 Claude-Code-Prompts je
  nach Plan und Modellmix) plus Wochenlimit.
- Effektiv "kostenlos" pro Lauf, aber **harte Drosselung**: bei
  Erschöpfung muss der Run auf das nächste Fenster warten.

### Portkey Gateway

Nutzt die Anthropic-Listenpreise (USD je 1M Tokens):

| Modell | Input | Output | Cache Write | Cache Read |
|--------|------:|-------:|------------:|-----------:|
| Opus 4.7    | 15.00 | 75.00 | 18.75 | 1.50 |
| Sonnet 4.6  |  3.00 | 15.00 |  3.75 | 0.30 |
| Haiku 4.5   |  1.00 |  5.00 |  1.25 | 0.10 |

Portkey-Aufschlag: einstellig (~Pauschalsatz pro Monat oder
Per-Request-Fee, abhängig vom Plan); für die Kalkulation hier
vernachlässigt.

---

## 3. Smart-Subset (90 Runs)

Aufschlüsselung aus `batch-plans/smart-subset.json`:

| Modell | Runs | Anteil |
|--------|-----:|-------:|
| opus-4-7 (mit Thinking)    | 24 | 27% |
| opus-4-7-no-thinking       | 16 | 18% |
| sonnet-4-6 (mit Thinking)  | 34 | 38% |
| haiku-4-5  (mit Thinking)  | 16 | 18% |

| Workflow | Runs |
|----------|-----:|
| v1-oneshot              |  8 |
| v2-iterative            |  2 |
| v3-basic-tdd            |  8 |
| v4-exact-subagents      | 36 |
| v5-exact-single-context | 36 |

### Geschätzte Portkey-Kosten

Pro Lauf grob: Workflow-Mittelwert × Modellpreis. Aufsummiert über
die Verteilung:

| Modell | Runs | ⌀ Kosten/Run | Subtotal |
|--------|-----:|-------------:|---------:|
| Opus 4.7   (Thinking)   | 24 | ~3.20 USD | **~77 USD** |
| Opus 4.7   (no-Thinking)| 16 | ~2.30 USD | **~37 USD** |
| Sonnet 4.6 (Thinking)   | 34 | ~0.65 USD | **~22 USD** |
| Haiku 4.5  (Thinking)   | 16 | ~0.22 USD | **~3.5 USD** |

**Smart-Subset (Portkey) total: ~140 USD**, ±30% Streuung.

### Geschätzte Max-Kosten

90 Runs × ⌀ ~7-8 Min Wall-Clock = **~12 Stunden Brutto-Compute**,
verteilt über ca. 3-4 Rate-Limit-Fenster (à 5h). Auf Max 20x machbar
in 1-2 Tagen ohne aktives Eingreifen, auf Max 5x eher 3-4 Tage mit
Pausen.

**Smart-Subset (Max 20x) total: 0 USD zusätzlich**, da der Pauschal-
Beitrag (200 USD/Monat) bereits gedeckt ist.

---

## 4. Volle Matrix (~630 Runs zum Vergleich)

7 Katas × 3 Stile (≈ 21 Slots, einige Katas nur Prosa) × 5 Workflows
× 6 Modell-Configs = ~630 Läufe ohne Replikate.

### Portkey

| Modell | Runs | ⌀ Kosten/Run | Subtotal |
|--------|-----:|-------------:|---------:|
| Opus 4.7   (Thinking + no-Thinking) | 210 | ~2.80 USD | **~590 USD** |
| Sonnet 4.6 (Thinking + no-Thinking) | 210 | ~0.55 USD | **~115 USD** |
| Haiku 4.5  (Thinking + no-Thinking) | 210 | ~0.18 USD | **~38 USD** |

**Volle Matrix (Portkey) total: ~740 USD.**

### Max-Subscription

630 Runs × ⌀ ~7 Min = **~73 Stunden Brutto**, also ~15 5h-Fenster.
Realistisch über ~3 Wochen verteilt mit aktivem Babysitting wegen
Rate-Limit-Aborts. Auf Max 20x noch durchhaltbar; auf Max 5x würde
das Wochenlimit reißen.

**Volle Matrix (Max 20x): 0 USD zusätzlich**, aber sehr lange
Wall-Clock-Zeit.

---

## 5. Empfehlung

| Szenario | Backend | Begründung |
|----------|---------|------------|
| Smart-Subset einmalig            | **Max 20x** | Gedeckt durch Pauschale; ~12h Wall-Clock ist gut handhabbar. Rate-Limit-Abbrüche werden durch das Hardening in `run-batch.sh` sauber abgefangen. |
| Smart-Subset mit schnellem Turnaround | Portkey   | ~140 USD kauft sofortige parallele Ausführung in ~3h ohne 5h-Fenster. |
| Volle Matrix (Replikation alter Auswertung) | **Portkey** | 740 USD ist überschaubar; spart Wochen Babysitting auf Max. |
| Iterative Workflow-Entwicklung       | Max          | Viele kleine Probeläufe, kein Bedarf an Parallelität. |

**Wahl für die nächste Iteration:** Smart-Subset (90 Runs) auf
**Max 20x**, weil bereits bezahlt und das Hardening in `record-run.sh`
und `run-batch.sh` Rate-Limits robust abfängt. Falls Wall-Clock zum
Engpass wird, einzelne v4/v5×Opus-Cells zusätzlich auf Portkey
auslagern.

---

## 6. Methodik / Reproduzieren

- Ø-Tokenwerte je Workflow: aus `metrics.json` von 235 alten Runs in
  `old_runs/runs/` gemittelt.
- Pricing-Tabelle: [docs.claude.com](https://docs.claude.com/en/docs/about-claude/pricing) Stand 2026-05.
- Wall-Clock: Median aus `run_status.duration_seconds`.
- Plan-Datei: `batch-plans/smart-subset.json`, generiert via
  `batch-plans/generators/smart-subset.py`.
