# Kimi K3 — Reevaluierung nach Route-Stabilisierung

**Datum:** 2026-08-05
**Anlass:** Die K3-Zelle war bis 2026-07-29 auf beiden Requesty-Routen instabil. Nach dem
Provider-seitigen Fix wurde sie am 2026-08-04 auf `requesty/sference/kimi-k3` neu befüllt
(5/5 `ok`). Dieser Report ordnet das Ergebnis gegen das Feld ein.

**Datenbasis:** `game-of-life-example-mapping` × `v6.2.1-phase-continuation-pi`, n=5 pro
Zelle, pi-Harness über Requesty. Quelle: `findings.md` dieser RQ (12 Zellen, alle gefüllt).

---

## Warum neu gemessen wurde

Die früheren `kimi-k3-nebius`-Runs wurden **verworfen, nicht wiederverwendet**. Beide
Requesty-Routen zu K3 waren im Zeitraum 2026-07-28/29 defekt: sference starb mitten im Run
mit `502 "problem with the provider stream"`, nebius lief in Timeouts und
Retry-Erschöpfung. Damit ließ sich nicht trennen, welche Werte das Modell beschreiben und
welche den Provider — eine Zelle, die keine Modellaussage trägt.

Der Routenwechsel verschiebt zusätzlich die Kostenbasis: sference rechnet mit
Cache-Rabatt ab, nebius nicht. Ein Vergleich der alten mit den neuen Zahlen wäre auch
preisseitig nicht sauber gewesen.

---

## Ergebnis im Feldvergleich

Alle vier Modelle erreichen `tests_passing` 100 % und Correctness (external) 1.00.

| Modell | Smell Total | `cognitive_max` | `mccabe_max` | Code Mass (APP) | Complexity Peak | Kosten/Run | Wall-Clock |
|---|---|---|---|---|---|---|---|
| **Opus 5** | 2.0 | **2.4** 🏆 | **3.4** 🏆 | 151.8 | **5.8** 🏆 | $3.10 | 436 s |
| **GLM 5.2** | **1.0** 🏆 | 7.8 | 6.6 | 178.2 | 22.6 | $2.53 | 883 s |
| **Kimi K3** | 2.4 | 7.0 | 5.8 | 143.8 | 15.0 | **$0.64** 🏆 | 359 s |
| **GPT-5.6 SOL** | 3.6 | 13.4 | 9.4 | **134.8** 🏆 | 21.2 | $1.09 | **240 s** 🏆 |

Alle Metriken: kleiner = besser. Pokale gelten gegen das komplette 12-Modell-Feld der RQ —
mit einer Ausnahme: bei Wall-Clock ist `deepseek-v4-pro` mit 200 s feldweit schneller,
GPT-5.6 SOL gewinnt nur innerhalb dieser vier.

---

## Der Versionssprung K2.7 → K3

K3 verbessert **jede** Qualitätsachse gegenüber der Vorgängergeneration, bei praktisch
unverändertem Preis.

| Modell | Smell Total | `cognitive_max` | `mccabe_max` | Complexity Peak | Kosten/Run | Wall-Clock | Tokens |
|---|---|---|---|---|---|---|---|
| Kimi K2.7 | 3.0 | 10.8 | 7.2 | 21.6 | $0.60 | 234 s | 1.34 M |
| **Kimi K3** | 2.4 | 7.0 | 5.8 | 15.0 | $0.64 | 359 s | 1.02 M |

Der `cognitive_max`-Sprung (10.8 → 7.0) fällt größer aus als der GLM-Schritt 5.1 → 5.2
(9.6 → 7.8), bleibt aber deutlich hinter dem Anthropic-Sprung 4.8 → 5 zurück (9.6 → 2.4).
Die Complexity Peak-Verbesserung hebt K3 vom Mittelfeld auf 15.0.

Bezahlt wird der Fortschritt mit Wanduhr: 53 % mehr Laufzeit bei **weniger** Tokens
(1.34 M → 1.02 M). K3 verbringt also mehr Zeit pro Token, statt mehr zu produzieren.

**Ein Confounder bleibt.** Die beiden Generationen laufen über verschiedene Backprovider
(K2.7 via TensorX, K3 via Sference). Provider-seitige Unterschiede lassen sich nicht vom
Modellverhalten trennen. Kosten sind kein Confounder mehr — beide Routen rechnen mit
Cache-Rabatt ab, und die 4-Cent-Differenz liegt innerhalb des Schätzrauschens.

---

## Einordnung

**K3 ist der beste All-Arounder und der Preis-Leistungs-Sieger des Felds.** Vierter Platz
bei Smell Total (2.4) und `cognitive_max` (7.0) für $0.64 — vier Cent über dem billigsten
Modell der gesamten RQ. Dazu das zweitkleinste Code Mass (143.8) und mit 359 s im schnellen
Drittel. Keine Achse außer dem Preis gewonnen, aber auf keiner abgeschlagen.

Gegen den Qualitätssieger steht Faktor 4.8 im Preis gegen Faktor drei in der
Spitzenkomplexität: Opus 5 nimmt alle drei Komplexitätsachsen mit großem Abstand
(`cognitive_max` 2.4 gegen 6.6 beim nächstbesten Modell des Felds), kostet aber $3.10. Ob
sich das lohnt, hängt daran, wie sehr Spitzenkomplexität für die Zielcodebasis zählt — auf
game-of-life sind die Absolutwerte in beide Richtungen klein.

Die Smell-Krone hält GLM 5.2 mit 1.0, allerdings weich: GLM streut über die fünf Runs von
0 bis 3 (σ = 1.41), während K3 bei σ = 0.55 liegt und Opus 5 jeden Run exakt auf 2 landet
(σ = 0). Bei n=5 hält die Reihenfolge, die Trennung nicht.

**Auf dieser Kata ist Correctness gesättigt** — neun der zwölf Modelle liegen bei 1.00. Die
Modellauswahl entscheidet sich hier allein über Qualität, Preis und Zeit, nicht über
Können. Für die harte Kata (`claim-office`, RQ-model-novel-pi) sieht das Bild anders aus;
dort trennt Correctness das Feld noch.

---

## Offene Punkte

- **Backprovider-Confounder K2.7/K3** bleibt bestehen. Auflösbar nur durch eine K2.7-Zelle
  auf sference — falls die Route das Modell führt.
- **Opus 5 auf claim-office** liegt als 5 Runs im Pool, ist aber nicht in der
  RQ-Aggregation und ohne ESLint-Analyse. Für einen Cross-Kata-Vergleich der hier
  betrachteten vier Modelle müsste die Zelle regulär durch die Pipeline
  (`/reanalyze RQ-model-novel-pi`).
