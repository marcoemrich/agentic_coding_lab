# Trainer-Notizen zur Kata "Magische Schadenskasse"

Begleitmaterial für den Trainer. **Nicht für Teilnehmer**.

Enthält die Festlegungen der Schadenskasse zu allen Mehrdeutigkeiten —
also die Antworten, die die Gruppe erarbeiten soll.

Ein Vorschlag für den Ablauf im Workshop steht separat in
[`workshop-durchfuehrung.md`](workshop-durchfuehrung.md).

## Setting

Aufgabe: [`prose.md`](../prose.md) (Deutsch).

Ein- und Ausgabeformat für die Teilnehmer:
[`ein-ausgabe-format.md`](../ein-ausgabe-format.md). Beschreibt nur die
Schnittstelle, keine Rechenregeln — die Mehrdeutigkeiten bleiben also
unangetastet.

Verifikations-Szenarien (zur Wertekontrolle / Demonstration, nachdem
die Gruppe ihre Festlegungen getroffen hat):
[`verifikation/`](verifikation/) — zehn Szenarien mit Erläuterung in
[`verifikation/README.md`](verifikation/README.md).

## Liste der Mehrdeutigkeiten

Fünf Haupt-Mehrdeutigkeiten plus eine Sub-Mehrdeutigkeit. Die Liste
folgt der internen Numerierung aus `kata-mehrdeutigkeiten.md`.

### A — Set-Wertung mit Überzähligen

**Frage:** Wie wird eine Sammlung von 4 oder mehr gleichartigen
Komponenten bewertet?

**HPSMV-Festlegung:** Ein Bauteil-Block gilt **nur bei genau drei**
Komponenten. Bei 4 oder mehr wird alles einzeln gezählt — kein
"greedy"-Block-Bilden, kein "nur ein Block, Rest einzeln".

**Beispiele zum Pinnen im Mapping:**
- 3 Runen → 60 G Grundprämie (Block)
- 4 Runen → 100 G Grundprämie (4 × 25, kein Block)
- 7 Runen → 175 G Grundprämie (7 × 25, kein Block)

**Trainer-Hinweis:** Diese Lesart ist die *teuerste* der drei
plausiblen — passt zur knausrigen Tonalität. Modelle und Teilnehmer
neigen typischerweise zu greedy max-Block. Wenn niemand auf "strikt
nur 3" kommt, kann der Trainer den Sachverständigen-Charakter
einsetzen ("Drei *gleichartige* Komponenten gelten als Block. Drei.").

### Aₐ — "Gleichartig" als Begriff

**Frage:** Was bedeutet "gleichartig"? Gleicher Typ, gleiche
Kategorie, gleiches Material?

**HPSMV-Festlegung:** Gleicher **Typ-Bezeichner**. Runen und
Mondsteine sind nie gleichartig zueinander, auch wenn beide
"Komponenten" sind.

**Beispiele:**
- 2 Runen + 1 Mondstein → 75 G (kein Block, unterschiedliche Typen)
- 3 Runen + 3 Mondsteine → 120 G (zwei separate Blöcke)

**Trainer-Hinweis:** Klassischer Begriffs-Stolper. Im Mapping fragt
typischerweise jemand "Moment, was heißt gleichartig?". Das ist
*konstruktiv versteckte Information* — die Frage muss aktiv gestellt
werden, sie steht nicht in den Regeln.

### B₂ — Selbstbeteiligung pro Schadensereignis

**Frage:** Greift die Selbstbeteiligung von 100 G einmal pro
Schadensfall (z.B. Drachenangriff) oder pro beschädigtem Item?

**HPSMV-Festlegung:** Die Selbstbeteiligung wird **pro Item**
abgezogen. Ein Drachenangriff, der zwei Items beschädigt, kostet
zweimal 100 G Selbstbeteiligung.

**Beispiele:**
- Drachenangriff: Schwert (500 G) + Amulett (300 G) →
  (500 − 100) + (300 − 100) = 600 G Payout

**Trainer-Hinweis:** Modelle streuen hier über Familien-Grenzen hinweg
(Opus zu "ein Ereignis = eine SB", Sonnet zu "pro Item"). Im Workshop
wahrscheinlich auch Diskussion. Festlegung passt zur knausrigen
Tonalität — die HPSMV behält gerne mehr ein.

### C — "Erstversicherung" als Begriff

**Frage:** Bezieht sich der Erst-Bewertungs-Aufschlag von 10 % auf
*den ersten Vertrag des Kunden* (Kunden-bezogen) oder auf *die erste
Police für ein Item* (Sach-bezogen)?

**HPSMV-Festlegung:** **Sach-bezogen.** Auch ein Stammkunde, der ein
neues Item versichert, zahlt den Erst-Aufschlag — denn das Item ist
zum ersten Mal in Begutachtung.

**Beispiele:**
- Stammkunde 3 Jahre, zweiter Vertrag mit neuem Schwert → +10 %
  (Erstversicherung des Schwerts) UND −15 % (Folgevertrag des Kunden),
  beide gleichzeitig.

**Trainer-Hinweis:** Die zwei Klauseln "Erstversicherung +10 %" und
"ab zweitem Vertrag −15 %" wirken zunächst widersprüchlich. Die
HPSMV-Lesart ist, dass sie *parallel* greifen — Item-Erst plus
Kunden-Folgevertrag.

**JSON-Lesart:** Items im Szenario-JSON haben keine Identität (keine
`id`, kein "wasInsuredBefore"-Flag). Konsequenz: jedes Item gilt
implizit als Erstversicherung — der +10 %-Aufschlag fällt also bei
*jedem* Quote-Step auf *jedes* Item an. Der −15 %-Folgevertrags-Rabatt
hingegen ist am JSON ablesbar: er greift bei jedem `quote`-Step *nach
dem ersten* im `steps`-Array (selber Kunde im ganzen Szenario). Häufige
Teilnehmer-Frage: "Wie sehe ich, dass das Schwert schon mal versichert
war?" — Antwort: gar nicht, das ist Absicht.

### D — Faktor-Reihenfolge bei Modifikatoren

**Frage:** Wie werden die Modifikatoren (Fluch, Verzauberung, Treue,
usw.) auf den Grundpreis angewandt? Additiv? Multiplikativ? In welcher
Reihenfolge?

**HPSMV-Festlegung:** **Additiv auf den Grundpreis**. Alle Prozentsätze
werden in absolute Goldstücke umgerechnet (jeweils prozentual vom
Grundpreis) und auf den Police-Grundpreis addiert/subtrahiert.

**Erweiterung — Item- vs. Police-Bezug:** Item-spezifische Modifikatoren
(Fluch, hohe Verzauberung) wirken auf den **Item-Grundpreis** des
betroffenen Items. Police-Modifikatoren (Treuerabatt, Erstversicherung,
Folgevertrag) wirken auf den **Police-Grundpreis** (Summe aller
Item-Grundprämien).

**Beispiele:**
- Verfluchtes Stufe-7-Schwert, 3-Jahre-Stammkunde, zweiter Vertrag,
  Grundpreis 100 G:
  100 + 50 (Fluch) + 30 (hohe Verzauberung) − 20 (Treuerabatt)
  + 10 (Erstvers.) − 15 (Folgevertrag) = 155 G
  + 5 G Bearbeitungsgebühr = **160 G**
- Police mit verfluchtem Schwert (100) + Amulett (60), Newcomer:
  Police-Grundpreis 160 G; Fluch-Aufschlag +50 G (50 % vom
  Sword-Grundpreis); Erst-Aufschlag +16 G (10 % vom
  Police-Grundpreis); Sub: 226 G + 5 = **231 G**

**Trainer-Hinweis:** Modelle konvergieren auf multiplikative
Berechnung; additiv ist die *Lebenswelt-Lesart* (E-Commerce-Rabatt-
codes), aber gegen die Modell-Konvergenz festgelegt. Wenn das Mapping
multiplikativ wählt, ist auch *das* eine valide Workshop-Erfahrung
("euer Tarif berechnet anders als der HPSMV-Tarif" — wertvolle
Erkenntnis über Anforderungs-Festlegung).

### F' — Risiko-Schwelle vs. Drachenmaterial

**Frage:** Was passiert bei einem Item, das *beide* Schadensregulierungs-
Klauseln auslöst — also Drachenmaterial UND Verzauberungsstufe ≥ 8?

**HPSMV-Festlegung:** Die **50 %-Klausel gewinnt**. Risiko-Schwelle
schlägt Material-Klausel.

**Reihenfolge zur Selbstbeteiligung:** **Erst die Erstattungs-Klausel
anwenden, dann SB abziehen.**

**Beispiele:**
- Drachen-Schwert, Verzauberung 9, Schaden 1000 G →
  500 G (50 %) − 100 G SB = **400 G Payout**
- Drachen-Schwert, Verzauberung 5, Schaden 800 G →
  800 G (voll, Drachenmaterial) − 100 G SB = **700 G Payout**
- Stahl-Schwert, Verzauberung 9, Schaden 1000 G →
  500 G (50 %) − 100 G SB = **400 G Payout**

**Trainer-Hinweis:** Die Reihenfolge zwischen Klausel und SB ist eine
versteckte Mehrdeutigkeit innerhalb dieser Frage. Wenn niemand sie
anspricht, kann der Trainer mit einem konkreten Beispiel nachfragen
("Drachenmaterial-Schwert, ench 9, Schaden 1000 G — was zahlt die
HPSMV?").

## Weitere wichtige Festlegungen

Diese Punkte sind keine Mehrdeutigkeiten im engeren Sinne, kommen
aber häufig im Mapping auf.

### Bearbeitungsgebühr

- Immer 5 G obendrauf, *nach* allen Modifikatoren, *niemals* rabattiert.
- Auch bei leerer Item-Liste: Prämie 0 G + 5 G Gebühr = 5 G.

### Rundung

- Alle Beträge zugunsten der HPSMV: **Prämien aufrunden, Auszahlungen
  abrunden**.
- Rundung **am Ende** der Berechnung, Zwischenwerte bleiben fraktional.

### Keine Deckelung der Auszahlung

- Es gibt **keine Obergrenze** für die Gesamtauszahlung. Jeder
  Schadensfall wird unabhängig gerechnet; eine Police kann über die Zeit
  beliebig viel auszahlen.
- Konsequenz: die Police braucht **keinen kumulativen Zustand**. Wer
  trotzdem einen "verbrauchten Betrag" mitführt, hat sich Arbeit
  gemacht, die hier niemand verlangt.
- Der Versicherungswert (1000 G für ein Schwert usw.) steht zwar in der
  Preisliste, wird aber nirgends gebraucht. **Häufige
  Teilnehmer-Frage:** "Wofür ist der Versicherungswert dann da?"
  Antwort in-character: "Für das Hauptbuch. Der Sachverständige trägt
  ihn ein. Was das Kontor damit später tut, ist nicht Ihre Sorge."

### Mehrere Items desselben Typs

- Eine Police kann mehrere Items desselben Typs enthalten (zwei
  Schwerter, drei Tränke).
- Pro `damages`-Eintrag eine Selbstbeteiligung — auch wenn beide
  Einträge denselben `itemType` haben.
- Wenn die Anzahl der Damage-Einträge die Anzahl der Items in der
  Police überschreitet → **Komplettablehnung** des claim (bürokratisch
  strikt).

### Unbekannte Items

- Item mit unbekanntem Typ (nicht in Hauptgegenstand-Tabelle, kein
  Komponenten-Typ) → Fehler / Komplettablehnung.
- Damage-Eintrag, dessen Item nicht in der Police ist → Fehler.
- Negative Schadenshöhe → Fehler.

### Edge Cases

- Leere Item-Liste in `quote` → Prämie 0 G (= 5 G mit Gebühr), kein
  Fehler.

