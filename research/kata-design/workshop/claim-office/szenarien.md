# Die fünfzehn Verifikations-Szenarien in Prosa

Begleitmaterial für den Trainer. **Nicht für Teilnehmer** — die
Szenarien enthalten die Lösungen.

Die maschinenlesbaren Fassungen liegen in
[`../../../../experiments/katas/claim-office-verification/scenarios/`](../../../../experiments/katas/claim-office-verification/scenarios/).
Dieses Dokument erzählt dieselben fünfzehn Fälle so, wie der
Sachverständige sie im Plenum vorlesen würde — mit Rechenweg, damit
der Trainer die Zahlen nicht am Flipchart neu herleiten muss.

Englische Fassung: [`scenarios-en.md`](scenarios-en.md).

Alle Beträge hier sind gegen die `*.expected.json` nachgerechnet.
Weicht eine Gruppe ab, liegt es an einer anderen Lesart einer
Mehrdeutigkeit, nicht an einem Rechenfehler in diesem Dokument —
welche Lesart welche Zahl erzeugt, steht bei jedem Szenario dabei.

## Wie man die Szenarien einsetzt

Die fünfzehn Fälle sind nach steigender Verschränkung sortiert. Für
den Workshop heißt das:

- **Stufe 1 (01–07)** eignet sich zum Pinnen einzelner roter Karten.
  Jeder Fall isoliert genau eine Mehrdeutigkeit — wer ihn nicht
  besteht, hat genau diese eine Regel anders gelesen.
- **Stufe 2 (08–11)** zeigt Wechselwirkungen. Wer hier scheitert,
  hat jede Regel für sich richtig, aber ihr Zusammenspiel falsch.
- **Stufe 3 (12–15)** sind Erzählungen. Sie eignen sich als
  Abschluss-Demo oder, in Zeitnot, als einziger Durchlauf.

Als Akzeptanztest-Demo nach dem Mapping reicht Stufe 1 plus eine
Geschichte. Die vollen fünfzehn sind für den Lab-Betrieb gedacht.

## Die Rechengrundlage in Kurzform

Damit die Rechenwege unten lesbar bleiben, hier die Größen, die in
jedem Szenario vorkommen:

| Stück | Versicherungswert | Grundprämie |
|-------|------------------:|------------:|
| Schwert | 1000 G | 100 G |
| Stab | 800 G | 80 G |
| Amulett | 600 G | 60 G |
| Trank | 400 G | 40 G |
| Komponente (Rune, Mondstein …) | 250 G | 25 G |
| Bauteil-Block (genau 3 gleichartige) | 3 × 250 G | 60 G pauschal |

Zuschläge und Rabatte werden **additiv** auf den jeweiligen
Grundpreis gerechnet, nicht multiplikativ verkettet. Item-bezogene
Modifikatoren (Fluch +50 %, hohe Verzauberung ab Stufe 5 +30 %)
hängen an der Grundprämie *des betroffenen Stücks*; police-bezogene
(Treue −20 % ab zwei Jahren, Erstversicherung +10 %, Folgevertrag
−15 %) an der Summe aller Grundprämien. Am Ende 5 G Stempelgebühr,
dann zugunsten des Kontors gerundet: Prämien auf, Auszahlungen ab.

Im Schadensfall: erst die Erstattungsklausel (ab Verzauberung 8 nur
50 %; Drachenmaterial 100 %; die 50 %-Klausel gewinnt bei Konflikt),
dann 100 G Selbstbeteiligung **pro Schadensposten**. Der Cap liegt
bei 2 × Versicherungssumme und gilt kumulativ über die Lebenszeit
der Police.

---

# Stufe 1 — Einzelne Regeln

## 01 — Drei Runen, ein Block

Ein Neukunde bringt drei Runen zur Begutachtung. Keine Vorgeschichte,
keine Flüche, nichts Verzaubertes — der einfachste Fall, den das
Kontor kennt.

**Prämie: 71 G**

Drei gleichartige Komponenten bilden einen Bauteil-Block: 60 G
pauschal statt 75 G einzeln. Darauf der Erst-Bewertungs-Aufschlag
von 10 % (6 G), macht 66 G, plus 5 G Stempelgebühr = 71 G.

**Was der Fall prüft:** Existiert der Block-Rabatt überhaupt? Wer
hier 80 G herausbekommt, hat ihn nicht implementiert.

## 02 — Vier Runen, kein Block

Derselbe Neukunde, eine Rune mehr.

**Prämie: 115 G**

Ein Block gilt **nur bei genau drei** Komponenten. Bei vier zählt
alles einzeln: 4 × 25 = 100 G. Plus 10 % Erstversicherung (10 G) =
110 G, plus Gebühr = 115 G.

**Was der Fall prüft:** die Kernfrage aus Mehrdeutigkeit A. Die
beiden verbreiteten Gegen-Lesarten erzeugen andere Zahlen — "ein
Block plus eine einzelne Rune" käme auf 99 G, "greedy blocken, so
viele wie möglich" ebenfalls. Nur die strikte Drei-Lesart trifft
115 G.

**Trainer-Hinweis:** Dieser Fall ist das schärfste Einzel-Instrument
im Satz. Gruppen und Modelle entscheiden sich fast immer für eine
greedy-Variante; 01 und 02 nebeneinander gelegt macht den
Unterschied in zwei Zeilen sichtbar.

## 03 — Zwei Runen und ein Mondstein

Wieder drei Komponenten, aber nicht dieselben.

**Prämie: 88 G**

"Gleichartig" heißt gleicher Typ-Bezeichner. Runen und Mondsteine
bilden zusammen keinen Block, auch wenn beide Komponenten sind:
3 × 25 = 75 G, plus 10 % (7,5 G) = 82,5 G, plus Gebühr = 87,5 G,
aufgerundet **88 G**.

**Was der Fall prüft:** Mehrdeutigkeit Aₐ. Wer "gleichartig" als
"gleiche Kategorie" liest, bildet hier einen Block und landet bei
71 G — derselben Zahl wie in Szenario 01, was den Fehler im
Nebeneinander sofort verrät.

**Trainer-Hinweis:** Hier ist auch die Rundung zum ersten Mal
sichtbar. 87,5 wird zu 88, nicht zu 87.

## 04 — Ein Drache, zwei beschädigte Stücke

Ein Neukunde versichert ein Schwert (Stahl, Stufe 3) und ein
silbernes Amulett. Dann kommt ein Drache und beschädigt beides: das
Schwert um 500 G, das Amulett um 300 G.

**Prämie: 181 G** — Grundprämien 100 + 60 = 160 G, plus 10 %
Erstversicherung (16 G) = 176 G, plus Gebühr = 181 G.

**Auszahlung: 600 G** — und zwar (500 − 100) + (300 − 100).

**Was der Fall prüft:** Mehrdeutigkeit B₂. Die Selbstbeteiligung
greift **pro beschädigtem Stück**, nicht pro Schadensereignis. Wer
"ein Drachenangriff, einmal 100 G" liest, zahlt 700 G aus.

**Restcap: 2600 G** — Versicherungssumme 1600 G, Cap 3200 G, davon
600 G verbraucht.

## 05 — Das hochverzauberte Schwert

Ein Neukunde versichert ein Stahlschwert der Verzauberungsstufe 9.
Ein Feuer beschädigt es um 1000 G.

**Prämie: 145 G** — 100 G Grundprämie, plus 30 % Hochverzauberungs-
Aufschlag (30 G), plus 10 % Erstversicherung (10 G) = 140 G, plus
Gebühr.

**Auszahlung: 400 G** — die Klausel für stark verzauberte
Gegenstände (ab Stufe 8) erstattet nur 50 % der Schadenshöhe:
1000 → 500 G, davon 100 G Selbstbeteiligung ab = 400 G.

**Was der Fall prüft:** dass es **zwei verschiedene
Verzauberungsschwellen** gibt — Stufe 5 für den Prämienaufschlag,
Stufe 8 für die Erstattungskürzung. Wer nur eine Schwelle kennt,
scheitert hier oder in 06.

**Restcap: 1600 G.**

## 06 — Das Drachenknochen-Schwert

Neukunde, Schwert aus Drachenmaterial, aber nur Verzauberungsstufe 3.
Es fällt zu Boden, Schaden 800 G.

**Prämie: 115 G** — Drachenmaterial kostet keinen Aufschlag; es ist
eine reine Schadensregulierungs-Klausel. Also 100 G, plus 10 %, plus
Gebühr.

**Auszahlung: 700 G** — Drachenmaterial wird zu 100 % erstattet:
800 G voll, minus 100 G Selbstbeteiligung.

**Was der Fall prüft:** dass Drachenmaterial die Prämie *nicht*
berührt. Eine häufige Fehl-Lesart macht daraus einen Risikozuschlag.

**Restcap: 1300 G.**

## 07 — Wenn beide Klauseln greifen

Neukunde, Schwert aus Drachenmaterial **und** Verzauberungsstufe 9.
Ein missratener Zauber beschädigt es um 1000 G.

**Prämie: 145 G** — wie in 05: die Stufe-9-Verzauberung kostet 30 %
Aufschlag, das Material nichts.

**Auszahlung: 400 G** — die 50 %-Klausel gewinnt. 1000 → 500 G,
minus 100 G = 400 G.

**Was der Fall prüft:** Mehrdeutigkeit F'. Beide Klauseln greifen
gleichzeitig, und die Risiko-Schwelle schlägt die Material-Klausel.
Die Gegen-Lesart ("Drachenmaterial gewinnt, 100 % Erstattung") zahlt
900 G aus.

**Trainer-Hinweis:** Das ist die Mehrdeutigkeit, die im Mapping am
häufigsten *gar nicht* auffällt — beide Klauseln stehen in
verschiedenen Absätzen der Prosa, und niemand legt sie nebeneinander.
Wenn nach 45 Minuten keine rote Karte dazu hängt, darf der
Sachverständige mit genau diesem Fall nachhaken.

**Restcap: 1600 G.**

---

# Stufe 2 — Regeln im Zusammenspiel

## 08 — Der verfluchte Neukunde

Ein Neukunde versichert ein verfluchtes Stahlschwert, Stufe 3.

**Prämie: 165 G** — 100 G Grundprämie, plus 50 % Fluch-Aufschlag
(50 G), plus 10 % Erstversicherung (10 G) = 160 G, plus Gebühr.

**Was der Fall prüft:** Mehrdeutigkeit D, die additive Verrechnung,
im kleinstmöglichen Aufbau. Multiplikativ gerechnet
(100 × 1,5 × 1,1 + 5) ergäbe 170 G statt 165 G — der Unterschied
beträgt hier nur 5 G, ist aber eindeutig.

**Trainer-Hinweis:** Weil der Abstand so klein ist, eignet sich
dieser Fall schlecht zum Überzeugen. Wer die Faktor-Reihenfolge im
Plenum demonstrieren will, nimmt Garras (12) — dort stehen 265 G
(additiv) gegen 349 G (multiplikativ).

## 09 — Der Stammkunde mit zwei Verträgen

Ein Kunde, seit drei Jahren im Haus, versichert zuerst einen
Heiltrank, später ein verfluchtes Schwert der Stufe 7.

**Erste Police: 41 G** — 40 G Grundprämie, −20 % Treuerabatt (8 G),
+10 % Erstversicherung (4 G) = 36 G, plus Gebühr.

**Zweite Police: 160 G** — 100 G Grundprämie, +50 % Fluch (50 G),
+30 % hohe Verzauberung (30 G), −20 % Treue (20 G), +10 %
Erstversicherung (10 G), −15 % Folgevertrag (15 G) = 155 G, plus
Gebühr.

**Was der Fall prüft:** gleich zwei Dinge. Erstens Mehrdeutigkeit C:
der Erst-Bewertungs-Aufschlag ist **sach-bezogen**, nicht
kunden-bezogen — auch der Stammkunde zahlt ihn, weil das *Stück* zum
ersten Mal begutachtet wird. Er gilt also auch auf der zweiten
Police, gleichzeitig mit dem Folgevertrags-Rabatt. Zweitens die
additive Verrechnung: multiplikativ verkettet
(100 × 1,5 × 1,3 × 0,8 × 1,1 × 0,85 + 5) ergäbe die zweite Police
151 G statt 160 G.

**Trainer-Hinweis:** Die häufigste Teilnehmer-Frage lautet "woran
sehe ich denn, dass das Schwert schon mal versichert war?" — Antwort:
gar nicht. Die Items im JSON haben keine Identität. Jedes Stück gilt
implizit als Erstversicherung. Das ist Absicht und keine Lücke.

## 10 — Der erschöpfte Deckel

Ein Neukunde versichert ein Stahlschwert, Stufe 3. Dann stürzt er
zweimal, jedes Mal Schaden 1500 G.

**Prämie: 115 G.** Versicherungssumme 1000 G, Cap also 2000 G.

**Erste Auszahlung: 1400 G** — 1500 minus 100 G Selbstbeteiligung.
Restcap 600 G.

**Zweite Auszahlung: 600 G** — rechnerisch stünden wieder 1400 G zu,
aber der Deckel gibt nur noch 600 G her. Restcap 0.

**Was der Fall prüft:** dass der Cap **kumulativ** ist und nicht pro
Schadensfall zurückgesetzt wird — und dass er *kappt*, statt den
Fall abzulehnen.

## 11 — Zwei Schwerter, ein Drache

Ein Neukunde versichert zwei identische Stahlschwerter. Ein Drache
beschädigt beide: eines um 1500 G, das andere um 800 G.

**Prämie: 225 G** — 2 × 100 G, plus 10 % Erstversicherung (20 G),
plus Gebühr.

**Auszahlung: 2100 G** — (1500 − 100) + (800 − 100). Zwei
Schadensposten, zwei Selbstbeteiligungen, auch wenn beide denselben
`itemType` tragen.

**Was der Fall prüft:** dass eine Police mehrere Stücke desselben
Typs führen kann und die Versicherungssumme linear aggregiert
(2 × 1000 = 2000 G, Cap 4000 G).

**Trainer-Hinweis:** Implementierungen, die Items in einer Map nach
Typ ablegen, verlieren hier eines der beiden Schwerter. Das ist ein
Datenmodell-Fehler, kein Regel-Missverständnis — und ein guter Anlass,
im Debriefing über Modellierung statt über Regeln zu sprechen.

**Restcap: 1900 G.**

---

# Stufe 3 — Die Geschichten

Die vier Geschichten haben je eine eigene `*.story.md` neben den
JSON-Dateien; die Erzählungen dort sind länger und eignen sich zum
Vorlesen. Hier stehen sie in Kurzform mit den Zahlen.

## 12 — Krieger Garras

Garras der Berserker ist seit fünf Jahren im Haus. Er versichert
zuerst seine Kampfausrüstung: ein verfluchtes Schwert der Stufe 5,
ein silbernes Schutzamulett und einen Heiltrank. Wochen später
beschwört er einen Stab aus Drachenknochen, Stufe 7, und nimmt dafür
eine zweite Police.

Auf der Straße nach Norden erwischt ihn ein roter Drache: Schwert
1500 G Schaden, Amulett 400 G. Später geht ihm in einer Schenke der
Stab bei einem ungeschickten Zauber fehl, Schaden 500 G.

**Erste Police: 265 G** — Grundprämien 100 + 60 + 40 = 200 G.
Item-bezogen: +50 G Fluch und +30 G hohe Verzauberung, beide auf die
Schwert-Grundprämie von 100 G. Police-bezogen auf die 200 G: −40 G
Treue, +20 G Erstversicherung. Summe 260 G, plus Gebühr.

**Zweite Police: 89 G** — 80 G Grundprämie, +24 G hohe Verzauberung
(Stufe 7), −16 G Treue, +8 G Erstversicherung, −12 G Folgevertrag =
84 G, plus Gebühr.

**Erster Schaden: 1700 G** — (1500 − 100) + (400 − 100). Weder
Schwert noch Amulett lösen eine Sonderklausel aus; Stufe 5 liegt
unter der Erstattungsschwelle von 8. Restcap 2300 G von 4000 G.

**Zweiter Schaden: 400 G** — der Stab ist aus Drachenmaterial, also
100 % Erstattung: 500 G voll, minus 100 G. Stufe 7 liegt wieder
unter der 50 %-Schwelle. Restcap 1200 G von 1600 G.

**Was die Geschichte prüft:** die Unterscheidung zwischen
item-bezogenen und police-bezogenen Modifikatoren. Auf einer Police
mit drei Stücken macht es einen sichtbaren Unterschied, ob der
Fluch-Aufschlag auf 100 G oder auf 200 G gerechnet wird — 50 G
gegenüber 100 G. Zusätzlich: zwei Policen unter einem Kunden, und
Drachenmaterial bei niedriger Verzauberung.

## 13 — Magus Velorin

Velorin, Hexenmeister vom Ostmoor, ist seit gut einem Jahr Kunde —
also **noch kein** Stammkunde, der Treuerabatt greift nicht. Er
versichert sein Arbeitsset: einen Eichenstab der Stufe 5, ein
silbernes Amulett der Stufe 6 und drei zusammengehörige Runen für
seine Bannkreise. Später nimmt er eine zweite Police auf eine
Lieferung von sieben weiteren Runen.

Eine Bibliothekskatze wirft ihm den Stab vom Tisch (Schaden 200 G);
kurz darauf geht ein Gegenzauber durch das Amulett schief (300 G).

**Erste Police: 267 G** — Grundprämien: Stab 80 G, Amulett 60 G,
drei Runen als Block 60 G, zusammen 200 G. Item-bezogen: +24 G für
den Stab (30 % von 80 G) und +18 G für das Amulett (30 % von 60 G),
beide über Verzauberungsstufe 5. Police-bezogen: +20 G
Erstversicherung. Kein Treuerabatt bei einem Jahr. Summe 262 G, plus
Gebühr.

**Zweite Police: 172 G** — sieben Runen bilden **keinen** Block:
7 × 25 = 175 G. Plus 10 % Erstversicherung (17,5 G), minus 15 %
Folgevertrag (26,25 G) = 166,25 G, plus Gebühr = 171,25 G,
aufgerundet **172 G**.

**Erster Schaden: 100 G** — 200 G Schaden minus 100 G
Selbstbeteiligung.

**Zweiter Schaden: 200 G** — 300 G minus 100 G.

**Was die Geschichte prüft:** zweierlei. Erstens, dass der
Block-Rabatt nur die *Prämie* betrifft, nicht den
*Versicherungswert*: die drei Runen kosten 60 G Prämie, sind aber
mit 3 × 250 = 750 G versichert. Die Versicherungssumme der ersten
Police liegt damit bei 2150 G, der Cap bei 4300 G — wer den Wert an
der Prämie festmacht, bekommt einen zu kleinen Cap. Zweitens die
Verzauberungsschwelle auf *zwei verschiedenen Stücken*: Stab (Stufe
5) und Amulett (Stufe 6) lösen den Aufschlag beide aus, jeweils auf
ihre eigene Grundprämie.

**Trainer-Hinweis:** Dass hier **kein** Treuerabatt greift, ist der
stillste Stolperstein im ganzen Satz. Ein Jahr ist nicht
"mindestens zwei Jahre" — Implementierungen mit `>= 1` statt `>= 2`
fallen genau hier durch und sonst nirgends (227 G statt 267 G). Und die
Sieben-Runen-Police wiederholt Szenario 02 im Erzählkontext.

**Restcap nach beiden Schäden: 4000 G.**

## 14 — Familie Steinheim

Die drei Brüder Steinheim, allesamt Soldaten, legen für eine
gemeinsame Familienpolice zusammen. Sie melden ihre drei
abgekämpften Schwerter an und dazu das Schutzamulett der Großmutter.
Sie sind neu im Haus.

Monate später brennt ein Teil der Familienburg. Zwei der drei
Schwerter kommen verzogen heraus (Schaden 1200 G und 800 G); das
dritte hing in einem Saal, den das Feuer nicht erreichte, und das
Amulett trug der jüngste Bruder auf dem Markt.

**Prämie: 401 G** — Grundprämien 3 × 100 + 60 = 360 G, plus 10 %
Erstversicherung (36 G) = 396 G, plus Gebühr.

**Auszahlung: 1800 G** — (1200 − 100) + (800 − 100).

**Was die Geschichte prüft:** dass die Schadensmeldung eine **echte
Teilmenge** der versicherten Stücke betreffen darf. Zwei von drei
Schwertern sind beschädigt, das dritte und das Amulett nicht — die
Police bleibt gültig, es wird nur für die gemeldeten Posten gezahlt.

**Trainer-Hinweis:** Der Gegen-Fall steht in den Trainer-Notizen:
*mehr* Schadensposten als versicherte Stücke führen zur
Komplettablehnung. Hier ist es umgekehrt und völlig unauffällig —
aber Implementierungen, die die Anzahl prüfen, verwechseln die
Richtung gern.

**Restcap: 5400 G** — Versicherungssumme 3600 G, Cap 7200 G.

## 15 — Pechvogel Tordan

Tordan ist seit vier Jahren Kunde und nach Aktenlage der
unglücklichste Versicherte im Haus. Er hält es schlicht: ein
Schwert, ein Heiltrank. Keine Flüche, keine exotischen
Verzauberungen, nur schlechtes Timing.

In rascher Folge stürzt er eine Treppe hinunter (Schwert, 800 G),
verschüttet seinen Trank in einer Wirtshausrauferei (300 G), fällt
auf dem Heimweg erneut (Schwert, 1500 G) und bringt schließlich
einen vierten Sturz zustande (Schwert, 1000 G).

**Prämie: 131 G** — Grundprämien 100 + 40 = 140 G, −20 % Treue
(28 G), +10 % Erstversicherung (14 G) = 126 G, plus Gebühr.

Versicherungssumme 1400 G, **Cap 2800 G.**

**Die vier Schäden:**

| Schaden | Rechnung | Auszahlung | Restcap |
|---------|----------|-----------:|--------:|
| Treppensturz | 800 − 100 | 700 G | 2100 G |
| Verschütteter Trank | 300 − 100 | 200 G | 1900 G |
| Zweiter Sturz | 1500 − 100 | 1400 G | 500 G |
| Vierter Sturz | 1000 − 100 = 900, gekappt | **500 G** | 0 G |

**Was die Geschichte prüft:** Cap-Erschöpfung über eine längere
Folge von Schäden, mit gemischten Stücktypen dazwischen. Der letzte
Posten ist der interessante: rechnerisch stünden 900 G zu,
ausgezahlt werden 500 G, und der Deckel steht danach exakt auf null.

**Trainer-Hinweis:** Diese Geschichte eignet sich gut als
Abschluss-Demo, weil der Rechenweg pro Zeile trivial ist und die
ganze Spannung im Cap liegt. Wer sie besteht, führt den Cap-Zustand
korrekt über mehrere Schritte mit.

---

## Anhang — Was die Szenarien nicht abdecken

Die Trainer-Notizen legen einige Punkte fest, für die es **keinen**
Verifikations-Fall gibt. Sie können im Mapping aufkommen, werden
aber nicht getestet:

- leere Item-Liste beim `quote` (Prämie 0 G + 5 G Gebühr)
- unbekannter Item-Typ (Ablehnung)
- Schadensposten für ein Stück, das nicht in der Police steht
  (Ablehnung)
- negative Schadenshöhe (Ablehnung)
- mehr Schadensposten als versicherte Stücke (Komplettablehnung)

Wer im Workshop eine Gruppe hat, die zügig durchkommt, kann diese
Fälle als Zusatzaufgabe ausgeben — die Festlegungen dazu stehen in
[`trainer-notes.md`](trainer-notes.md) unter "Weitere wichtige
Festlegungen".
