# Domänen-Ideen für die neue Kata

Brainstorm-Sammlung. Stand: 2026-05-07. Status: offen, noch nicht bewertet.
Bezugsdokument: [kata-requirements.md](kata-requirements.md).

Grundfilter aus den Anforderungen: spielartig, harmlos, fiktiv möglich,
in 2–3 Min erklärbar, mit fachexperten-würdigen Sonderregeln,
komplexer als Overlords/Game of Life, als interne programmatische API
abbildbar, selbst erfindbar.

## A. Spielartige Domänen (nahe Overlords)

1. **Fantasy-Bestiarium-Tauschbörse** — Spieler tauschen Kreaturen mit
   Eigenschaften (Element, Größe, Reife). Tausch-Regeln entscheiden,
   wer was bekommt; Wert berechnet sich aus Sets, Kombos, Reifegrad.
2. **Magischer Backwettbewerb-Scoring** — Jury bewertet Kuchen nach
   Zutaten, Form, Dekoration; Bonus-/Mali-Regeln pro Kombination,
   Disqualifikationen.
3. **Drachen-Postzustellung** — Drachen liefern Pakete; Routen-Regeln
   nach Wetter, Drachen-Laune, Paketgewicht; Pünktlichkeits-Score.
4. **Goblin-Marktplatz-Preisfindung** — Preisregeln für Waren mit
   Mengenrabatten, Tauschrate-Sonderfällen, Goblin-Verhandlungs-Quirks.
5. **Sternenkarten-Sternbildbestimmung** (fiktive Sternbilder) —
   gegeben Sternpositionen, klassifiziere Sternbild nach Form-Regeln
   mit Toleranzen.

## B. Wettbewerbs-/Turnier-Logik

6. **Fiktives Sportturnier-Tabellen-Berechner** (z.B. "Gummibärchen-Olympia") —
   Punkte, Tie-Breaker, Disqualifikationen, Wildcards.
7. **Gilden-Ranglisten** für ein erfundenes Online-Spiel —
   Beitrags-Regeln, Inaktivitäts-Strafen, Gilden-Bonus.

## C. Puzzle-/Welten-Logik

8. **Inselkönigreich-Steueramt** (fiktiv, als "Tribut an den König") —
   Tribut-Regeln nach Berufsstand, Ernte, Familienstand.
   *Risiko: zu nah an Steuerrecht, könnte Workshop-Stimmung dämpfen.*
9. **Magische Bibliotheks-Ausleihe** — Bücher mit Eigenschaften
   (Verfluchtheit, Sprache, Empfindlichkeit), Ausleih-Regeln, Mahngebühren.
10. **Robotik-Werkstatt: Bauteil-Kompatibilität** — Roboter aus Teilen
    zusammensetzen, Kompatibilitäts-/Synergie-Regeln, Leistungs-Score.

## D. Etwas business-näher (falls "spielerisch" auch ironisch geht)

11. **Café-Bestellsystem mit absurden Sonderwünschen** — Pricing mit
    Modifier-Regeln, Treuepunkten, "Stammgast-Quirks".
12. **Versicherung für magische Gegenstände** — Prämienberechnung
    nach Risikoklassen, Ausschlüssen, Schadensfällen.

## Leitmotiv (User, 2026-05-07)

Bevorzugt werden Domänen, die als **ironische Parodie echter
Business-Domänen** erkennbar sind. Vorteil: Workshop-Teilnehmer spüren,
dass solche Probleme in ähnlicher Form *wirklich* in ihrer Arbeit
auftauchen — ohne dass die Übung zu ernst oder langweilig wird.
Ironisches Framing schützt vor dem "trockene Business-Logik"-Eindruck
und legitimiert gleichzeitig die Komplexität.

## Engere Favoriten (User-Auswahl)

- **#3 Drachen-Postzustellung** — Parodie auf **Logistik**, eine bei
  codecentric-Kunden häufige Domäne.
- **#12 Versicherung für magische Gegenstände** — Parodie auf
  **Versicherung**, ebenfalls häufige Kunden-Domäne.
- **#10 Robotik-Werkstatt: Bauteil-Kompatibilität** — anschlussfähig an
  **Automatisierung**, codecentrics eigene Kerndomäne (Prozess-/
  Workflow-Automatisierung, nicht Hardware-Roboter).

Alle drei haben den Reiz "wir kennen das Muster aus der Realität,
aber hier mit Drachen / verfluchten Schwertern / launischen Bauteilen".

## Verworfen / abgewertet

Aktuell keine — die übrigen 9 Ideen bleiben als Fallback in der Liste.

## Bewertung der drei Favoriten gegen Anforderungen (2026-05-07)

Bezugsdokument: [kata-requirements.md](kata-requirements.md). Anforderungen
1–7 in derselben Reihenfolge wie dort. Anforderung 8 (Validierung "nicht im
Training") ist methodisch und wird hier nicht pro Domäne bewertet.

Skala: **++** stark positiv · **+** positiv · **0** neutral · **–** negativ.

### #3 Drachen-Postzustellung (Logistik-Parodie)

| # | Anforderung | Effekt | Begründung |
|---|---|---|---|
| 1 | Komplexität > GoL | + | Routenplanung + Multi-Faktor-Scoring (Wetter, Drachen-Laune, Paketgewicht, Pünktlichkeit) liefert leicht 50–80 LoC, mehr Verzweigungen als GoL. |
| 2 | Originalität | + | "Drachen-Post" als Konzept frei erfindbar, keine kanonische Lösung im Training. *Risiko klein:* Routing-Algorithmen (Dijkstra etc.) sind bekannt — wenn das Modell Routenplanung als reines Graph-Problem erkennt, könnte es Standard-Patterns ziehen. |
| 3 | Domäne egal | 0 | Logistik passt. |
| 4 | TDD / API / keine Infra | + | Sauber als reine Funktion `deliver(packages, dragons, weather) → schedule` abbildbar, deterministisch, keine IO. |
| 5 | Example-Mapping-Mehrdeutigkeiten (3–5) | + | Sehr ergiebig: Drachen-Laune × Wetter × Paketart erzeugt unscharfe Regeln. Beispiele: "Feuerdrachen mögen keinen Regen — Verweigerung oder Verzögerung?", "Paket > Tragkraft, zweiter Drache frei?", Tie-Breaker bei gleicher Eignung. |
| 6 | Workshop-Zugang (2–3 Min) | + | "Drachen liefern Pakete, Regeln entscheiden welcher Drache wann was liefert" — sofort klar. Logistik-Vokabular ist Allgemeingut. |
| 7 | Spaß + seriös genug | + | Drachen sind charmant, harmlos. Logistik-Bezug für Kunden-Kontext glaubwürdig. |

**Wechselwirkungen:**

- (1) ↔ (6): Komplexität gefährdet Zugänglichkeit, *wenn* Routenplanung als
  Graph-Optimierung gefasst wird. **Mitigation:** Aufgabe als
  Zuteilungs-/Scoring-Problem framen, nicht als Wegfindung.
- (2) ↔ (5): Domänen-spezifische Mehrdeutigkeiten (Drachen-Quirks) drücken zusätzlich
  die Trainings-Bekanntheit nach unten. Doppelt positiv.

**Gesamt:** Sehr stark, ein Risiko (Graph-Mehrdeutigkeit).

### #10 Robotik-Werkstatt (Automatisierungs-Parodie)

| # | Anforderung | Effekt | Begründung |
|---|---|---|---|
| 1 | Komplexität > GoL | + | Bauteil-Kompatibilität, Synergien, Leistungs-Score, evtl. Energiebudget — viel Kombinationsraum. |
| 2 | Originalität | 0/– | "Roboter aus Teilen bauen" liegt nahe an bekannten Domänen: Crafting-Systeme aus Spielen (Minecraft, Factorio), Komponenten-Kompatibilität aus PC-Building. Modell hat dafür starke Priors. **Risiko, dass Trainings-Patterns durchschlagen.** |
| 3 | Domäne egal | 0 | Automatisierung passt. |
| 4 | TDD / API / keine Infra | + | `assemble(parts) → robot` mit Validierung — sauber als API. |
| 5 | Example-Mapping-Mehrdeutigkeiten (3–5) | + | Synergie-Regeln, Inkompatibilitäten, Stacking-Effekte sind klassisch mehrdeutig. "Zwei gleiche Sensoren — addieren sich Werte oder dominiert der bessere?" |
| 6 | Workshop-Zugang (2–3 Min) | + | Sehr intuitiv, jeder hat ein mentales Bild von "Roboter zusammenbauen". |
| 7 | Spaß + seriös genug | + | Charmant, harmlos. Automatisierungs-Bezug für codecentric ideal. |

**Wechselwirkungen:**

- (2) ↔ (5): **Konflikt.** Je näher die Mehrdeutigkeitn an klassischen
  Crafting-Mustern liegen, desto mehr greift das Modell auf Game-Design-Priors
  zurück und rät überraschend gut. Schwächt Anforderung 2 *und* 5 gleichzeitig.
- (6) ↔ (2): Die Vertrautheit, die den Workshop-Zugang erleichtert, ist
  genau die, die das Trainings-Risiko erhöht.

**Mitigation:** Robotik deutlich von Crafting wegführen — z.B. Fokus auf
Zertifizierung / Abnahmeprüfung von Robotern (TÜV-Parodie), nicht auf
"stärksten Roboter bauen". Verschiebt es weg von Game-Mechanik in Richtung
Compliance — zufällig näher an realer Automatisierung.

**Gesamt:** Stark, aber Trainings-Risiko und Spannung 2 ↔ 5 sind real.

### #12 Versicherung für magische Gegenstände

| # | Anforderung | Effekt | Begründung |
|---|---|---|---|
| 1 | Komplexität > GoL | + | Prämienberechnung mit Risikoklassen, Ausschlüssen, Kombinations-Klauseln, Schadensregulierung — sehr viel Substanz, leicht 80+ LoC. |
| 2 | Originalität | ++ | Versicherungs-Mathematik mit Fantasy-Twist ist sehr eigen. Modell hat keine kanonische "magische Versicherung"-Lösung; selbst echte Versicherungs-Patterns sind in Trainingsdaten unterrepräsentiert. |
| 3 | Domäne egal | 0 | Versicherung passt. |
| 4 | TDD / API / keine Infra | + | `quote(item, customer) → premium`, `claim(policy, damage) → payout` — saubere reine Funktionen. |
| 5 | Example-Mapping-Mehrdeutigkeiten (3–5) | ++ | **Beste Mehrdeutigkeits-Domäne der drei.** Versicherung lebt von Klauseln, die in Prosa harmlos klingen, aber harte Kanten haben: Selbstbeteiligung-Bedingungen, Ausschlüsse, Aggregations-Limits, Wartezeiten, Doppelversicherung. Genau das Profil, wo Leser ohne Beispiele zu einer abweichenden Auslegung kommen. |
| 6 | Workshop-Zugang (2–3 Min) | 0/– | **Schwächste Stelle.** "Versicherung" hat einen leichten Trocken-Beigeschmack; manche Teilnehmer haben Berührungsängste mit Prämien-/Klausel-Sprache. Magisches Framing entschärft das, aber nicht komplett. *Mitigation:* Sprache spielerisch halten ("Schadensfall: Schwert hat Besitzer in Kröte verwandelt"). |
| 7 | Spaß + seriös genug | + | Magische Gegenstände + Versicherungs-Bürokratie ist bewährter Comedy-Topos (Pratchett). Harmlos, charmant, Kunden-Bezug stark. |

**Wechselwirkungen:**

- (5) ↔ (2): Doppelt positiv — die spezifischen Versicherungs-Klauseln
  *sind* die Mehrdeutigkeitn, und sie sind im Training selten. Verstärken sich.
- (1) ↔ (5): Synergie — Komplexität entsteht *durch* die Klauseln, nicht
  zusätzlich.
- (6) ↔ (7): Schwache Spannung — der Charme muss aktiv gegen den
  Trocken-Eindruck arbeiten. Steht und fällt mit der Sprache der
  Aufgabenstellung.

**Gesamt:** Stärkstes Mehrdeutigkeits-Profil, einziges echtes Risiko ist die
Workshop-Eingangshürde.

### Vergleichs-Übersicht

| Anforderung | #3 Drachen-Post | #10 Robotik | #12 Versicherung |
|---|---|---|---|
| 1 Komplexität | + | + | + |
| 2 Originalität | + (Risiko Graph) | 0/– | ++ |
| 3 Domäne | 0 | 0 | 0 |
| 4 TDD / API | + | + | + |
| 5 Mehrdeutigkeits-Potenzial | + | + | ++ |
| 6 Workshop-Zugang | + | + | 0/– |
| 7 Spaß + seriös | + | + | + |

**Wechselwirkungen, die nicht für alle drei gleich sind:**

- **#10** hat eine Spannung 2 ↔ 5 ↔ 6: dieselbe Vertrautheit, die Zugang
  erleichtert, schwächt Originalität und Mehrdeutigkeits-Schärfe. Nur mit aktiver
  "Wegführung von Crafting" zu lösen.
- **#12** hat eine Spannung 5/2 ↔ 6: das stärkste Mehrdeutigkeits-Profil ist
  gleichzeitig das mit der höchsten Eingangshürde. Mit spielerischer
  Sprache lösbar.
- **#3** hat eine kleine Mehrdeutigkeit 1 ↔ 6 (Graph): vermeidbar durch Framing
  als Zuteilungs-/Scoring-Problem statt Wegfindung.

**Fazit:** Keine "alle drei gleich gut"-Situation. **#12 hat das schärfste
Mehrdeutigkeits-Profil**, **#3 das ausgewogenste**, **#10 das größte
Trainings-Risiko**.

### Re-Priorisierung mit Workshop-Anforderungen als "nice to have" (2026-05-07)

User-Entscheidung: Workshop-Anforderungen (6, 7) werden runtergestuft.
Research-Tauglichkeit (1, 2, 4, 5) hat Vorrang. Wenn die Kata für den
Workshop zu schwer wird, kommt dort ein anderes Beispiel zum Einsatz.

Folgen für das Ranking:

- **#12 Versicherung rückt nach vorne.** Ihre einzige relevante Schwäche
  war Workshop-Zugang (6). Auf den Research-Achsen (2 ++, 5 ++, 1 +)
  ist sie die stärkste der drei — höchste Originalität, schärfstes
  Mehrdeutigkeits-Profil.
- **#3 Drachen-Post bleibt solider Backup.** Auf allen Research-Achsen
  positiv, aber ohne Doppel-Plus auf 2 oder 5.
- **#10 Robotik fällt zurück.** Das Originalitäts-Risiko (2 = 0/–) ist
  jetzt nicht mehr durch leichten Workshop-Zugang kompensierbar.

**Neuer Vorzugsfavorit: #12 (Versicherung), Backup: #3 (Drachen-Post).**

## Offene Schritte

- [ ] Aus 12 Ideen 2–3 Favoriten auswählen.
- [ ] Pro Favorit: 3–5 konkrete Example-Mapping-Mehrdeutigkeiten skizzieren
      (Anforderung 5 in `kata-requirements.md`).
- [ ] Komplexitäts-Schätzung pro Favorit (LoC, Verzweigungen).
- [ ] Workshop-Eignung pro Favorit prüfen (Anforderung 6+7).
