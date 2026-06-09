# Trainer-Notizen — Overlords-Karten (Sphinx & Mantikor)

Begleitmaterial für den Trainer. **Nicht für Teilnehmer.**

Enthält die Festlegungen zu den eingebauten Mehrdeutigkeiten der beiden
Karten — also die Antworten, die im Example-Mapping herauskommen sollten
— plus Hinweise für die Durchführung.

Kartentexte (Teilnehmer): [`prompt.md`](prompt.md).
Entwurf, Vortest-Befunde und Begründungen der Festlegungen:
[`../../overlords-mehrdeutigkeiten.md`](../../overlords-mehrdeutigkeiten.md).

**Tonalität:** Overlords ist ein Spiel, keine Parodie-Institution wie die
HPSMV. Die Festlegungen sind schlicht *Hausregeln des Spiels* — der
Trainer tritt als Regel-Autorität / Spiel-Designer auf, nicht als
bürokratischer Charakter.

---

## Sphinx — drei Mehrdeutigkeiten

Kartentext: *„4 Punkte. 2 Punkte pro Art von Monster ab vier Arten in
deiner Armee, sonst 1 Punkt."* — Dieser neutrale Satz trägt **drei**
unabhängige offene Fragen. Keine davon ist im Kartentext aufgelöst.

### S1 — Zählt die Sphinx sich selbst als Art mit?

**Frage:** Gehört die Sphinx zu den „Arten von Monstern in deiner Armee"?

**Festlegung: Nein — die Sphinx zählt sich selbst nicht mit.** Gewertet
werden nur die *anderen* Monster-Arten.

**Begründung (Spielbalance):** Zählte sie sich selbst, hätte jede Sphinx
einen garantierten +1-Art-Sockel und wäre zu leicht stark. So hängt ihr
Wert an der echten Vielfalt der übrigen Armee.

**Trainer-Hinweis:** Das ist *konstruktiv versteckte Information* — die
Frage muss aktiv gestellt werden, sie steht nicht im Kartentext. Im
Vortest tendierten Sonnet/Haiku zu „mit sich selbst", Opus zu „ohne" —
es streut also. Wenn niemand fragt, kann der Trainer mit einem Beispiel
nachhaken („Eine Armee aus nur einer Sphinx — wie viele Punkte?").

### S2 — Was ist „eine Art"? (Untoter Krieger)

**Frage:** Der Untote Krieger kommt als drei Kartenvarianten (1, 2, 3
Punkte). Zählen die als *eine* Art oder als *drei*?

**Festlegung: eine Art.** Kartenvarianten desselben Monster-Namens sind
*eine* Art von Monster (sie werden ja auch sonst als eine Gruppe
gewertet, z.B. beim Straight-Bonus).

**Trainer-Hinweis:** Auch konstruktiv versteckt. Im Vortest erkannten
Opus *und* Sonnet die Doppeldeutigkeit oft explizit, wählten aber stabil
„eine Art" — eine gute Beispiel-Mapping-Klärungsfrage, deren Default
stabil ist. **Achtung Hebelwirkung:** In der Schwellen-Regel kann diese
Frage die Vier-Arten-Schwelle kippen (siehe Beispiel 3 unten).

### S3 — „sonst 1 Punkt": pauschal oder pro Art?

**Frage:** Unter der Schwelle (weniger als vier andere Arten) — gibt es
*einen* Punkt pauschal, oder *einen Punkt pro Art*?

**Festlegung: ein Punkt pauschal (Trostpunkt).** Unter der Schwelle
erhält die Sphinx genau 1 Zusatzpunkt, unabhängig von der Artenzahl. Erst
ab vier anderen Arten springt sie auf 2 Punkte pro Art.

**Trainer-Hinweis:** Klassische *Ellipse* — der zweite Satzteil lässt
„pro Art" weg. Im Vortest streute es (Opus pauschal, Sonnet/Haiku teils
pro Art). Die pauschale Lesart gibt den klareren Schwellen-Sprung.

### Sphinx — Beispiele zum Pinnen

| Armee | andere Arten | Rechnung | Sphinx-Wert |
|---|---|---|---|
| Sphinx, Zombie, Hydra | 2 (unter Schwelle) | 4 + 1 (Trostpunkt) | **5** |
| Sphinx, Zombie, Hydra, Chimera, Orthrus | 4 (Schwelle erreicht) | 4 + 4×2 | **12** |
| Sphinx, 3× Untoter Krieger (1/2/3), Hydra | 2 (UK = eine Art!) | 4 + 1 | **5** |

- Beispiel 1 pinnt S1 (ohne sich selbst — sonst wären es 3 Arten) **und**
  S3 (Trostpunkt — sonst 2 Punkte).
- Beispiel 2 pinnt S1 (4 statt 5 Arten → 12 statt 14) und zeigt die
  Schwelle.
- Beispiel 3 pinnt S2: zählte man die drei Untoten Krieger als 3 Arten,
  wären es 4 andere Arten → Schwelle erreicht → **12** statt 5. Die
  Aggregations-Frage entscheidet hier über einen Unterschied von
  7 Punkten.

---

## Mantikor — eine Mehrdeutigkeit

Kartentext: *„Ein Paar zählt 7 Punkte. Drei bilden ein Rudel und zählen
12 Punkte. Einzelne zählen je 2 Punkte."*

### M1 — Wie zerlegt man eine Sammlung, die nicht glatt aufgeht?

**Frage:** Wie viele Punkte sind z.B. 5 Mantikore? Bildet man so viele
Sets wie möglich (Rudel + Paar = 19)? Höchstens eins (Rudel + Rest
einzeln = 16)? Oder zählt ein Set nur bei exakt passender Zahl?

**Festlegung: strikt — ein Set zählt nur, wenn die Gesamtzahl exakt
einem Set entspricht (genau 2 = Paar, genau 3 = Rudel). Bei jeder anderen
Zahl zählt alles einzeln.**

**Begründung (Mechanik-Konsistenz):** Das ist exakt die Logik des
Zyklopen („genau einer = 6, sonst 2 je") — bei Überzahl fällt der Bonus
weg. Damit fügt sich der Mantikor ins bestehende Spiel ein.

**Beispiele zum Pinnen:**

| Mantikore | Rechnung | Punkte |
|---|---|---|
| 2 | Paar | **7** |
| 3 | Rudel | **12** |
| 4 | 4 × 2 (kein Set) | **8** |
| 5 | 5 × 2 (kein Set) | **10** |
| 6 | 6 × 2 (kein Set) | **12** |

**Trainer-Hinweis:** Teilnehmer und Modelle neigen stark zur
punktmaximierenden Zerlegung (5 → 19). Die strikte Lesart kommt selten
spontan — wenn niemand sie wählt, pinnt der Trainer über die
Zyklop-Analogie („Der Zyklop gibt seinen Bonus auch nur bei *genau*
einem. Beim Mantikor genauso: ein Paar sind *genau zwei*, ein Rudel
*genau drei*."). Achtung: Die etablierte Chimera/Orthrus-Auslegung in
anderen Materialien ist *maximale* Zerlegung — wer beide Karten zusammen
einsetzt, sollte die Set-Logik einheitlich strikt halten und das ansagen.

---

## Workshop-Durchführung (Kurzform)

Da hier nur zwei Karten statt einer vollen Kata vorliegen, eignet sich
das Material als kompaktes Example-Mapping-Modul (ca. 30–45 min):

1. **Kartentexte verteilen** ([`prompt.md`](prompt.md)).
2. **Example Mapping:** pro Karte Regel- und Beispiel-Karten sammeln,
   offene Fragen als rote Karten. Erwartung: die vier Mehrdeutigkeiten
   (S1, S2, S3, M1) tauchen als rote Karten auf.
3. **Plenum:** Der Trainer beantwortet rote Karten gemäß den Festlegungen
   oben — erst, wenn sie gestellt werden. Entdeckt die Gruppe eine Lücke
   nicht selbst, ist das Teil der Erfahrung.

**Didaktischer Kern:** Vier kurze Kartentexte, die *eindeutig* wirken,
tragen vier verschiedene offene Fragen — drei davon (S1, S2, M1) sind
„konstruktiv versteckt": Die Lücke ist im Text erkennbar, die Antwort
nicht. Genau das macht Example Mapping sichtbar.
