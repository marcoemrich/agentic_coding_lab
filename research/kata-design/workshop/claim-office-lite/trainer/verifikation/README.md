# Verifikations-Szenarien

Zehn Szenarien, mit denen sich eine Implementierung gegen die
HPSMV-Festlegungen prüfen lässt. Sie sind die Akzeptanztests der Kata.

**Für den Trainer**, nicht zur Ausgabe an die Teilnehmer zu Beginn. Die
erwarteten Werte verraten sämtliche Auflösungen der Mehrdeutigkeiten —
also genau das, was die Gruppe selbst erarbeiten soll. Sinnvoll wird
die Ausgabe erst, wenn die Gruppe ihre eigenen Festlegungen getroffen
hat.

## Aufbau

Jedes Szenario besteht aus zwei Dateien:

- `<name>.input.json` — wird dem Programm auf die Standardeingabe gegeben
- `<name>.expected.json` — das erwartete Dokument auf der Standardausgabe

Der Vergleich ist ein **struktureller JSON-Vergleich**, kein
Textvergleich. Einrückung, Schlüsselreihenfolge und Zeilenumbrüche sind
belanglos.

## Ausführen

Von Hand:

```bash
echo "$(cat szenarien/01-block-exact-three.input.json)" | claim-office
```

Und das Ergebnis gegen `01-block-exact-three.expected.json` halten.

Alle Szenarien auf einmal, wenn `jq` vorhanden ist:

```bash
for i in szenarien/*.input.json; do
  name=$(basename "$i" .input.json)
  erwartet="szenarien/$name.expected.json"
  ist=$(claim-office < "$i")
  if [ "$(echo "$ist" | jq -S .)" = "$(jq -S . "$erwartet")" ]; then
    echo "OK    $name"
  else
    echo "FEHL  $name"
    diff <(echo "$ist" | jq -S .) <(jq -S . "$erwartet")
  fi
done
```

`claim-office` steht hier für den Aufruf der eigenen Implementierung —
je nach Sprache und Aufbau ein anderer Befehl.

## Die Szenarien im Einzelnen

Die Szenarien 01–07 prüfen je eine Mehrdeutigkeit einzeln, 08–10 deren
Zusammenspiel. Die Spalte „prüft" nennt die Festlegung, die das
Szenario festnagelt; die Herleitungen stehen in
[`../trainer-notes.md`](../trainer-notes.md).

| # | Szenario | prüft | erwartet |
|---|----------|-------|----------|
| 01 | `block-exact-three` | Bauteil-Block bei genau drei Komponenten | `premium: 71` |
| 02 | `block-not-four` | kein Block bei vier — alles einzeln | `premium: 115` |
| 03 | `alike-different-types` | „gleichartig" heißt typgleich | `premium: 88` |
| 04 | `deductible-per-item` | Selbstbeteiligung pro Gegenstand, nicht pro Ereignis | `premium: 181`, `payout: 600` |
| 05 | `high-enchantment-clause` | 50-%-Klausel ab Verzauberungsstufe 8 | `premium: 145`, `payout: 400` |
| 06 | `dragon-material-clause` | Drachenmaterial wird voll erstattet | `premium: 115`, `payout: 700` |
| 07 | `clause-conflict` | bei beiden Klauseln gewinnt die 50-%-Klausel | `premium: 145`, `payout: 400` |
| 08 | `newcomer-cursed` | Fluchaufschlag beim Neukunden | `premium: 165` |
| 09 | `follow-up-customer` | Folgevertrag und Treuerabatt zusammen | `premium: 41`, dann `160` |
| 10 | `multi-items-same-type` | zwei gleichartige Gegenstände in einer Police | `premium: 225`, `payout: 2100` |

### Zwei Herleitungen zum Nachrechnen

**02 — vier Runen, Neukunde.** Vier Runen ergeben keinen Block, also
4 × 25 = 100 G Grundprämie. Darauf der Erst-Bewertungs-Aufschlag von
10 % = 10 G. Macht 110 G, plus 5 G Bearbeitungsgebühr: **115 G**. Der
Vergleich zu Szenario 01 (drei Runen, 71 G) ist der Kern der Aussage —
der vierte Gegenstand macht die Police deutlich teurer.

**07 — Drachenschwert, Verzauberungsstufe 9, Schaden 1000 G.** Beide
Klauseln greifen; die 50-%-Klausel schlägt die Materialklausel. Also
1000 × 0,5 = 500 G, davon 100 G Selbstbeteiligung: **400 G**. Das ist
derselbe Auszahlungsbetrag wie im Stahl-Szenario 05 — genau das ist der
Punkt, den das Szenario zeigt.

## Wenn die Gruppe anders entschieden hat

Kommt das Team zu einer anderen, in sich schlüssigen Lesart, dann
schlagen hier Szenarien fehl, ohne dass die Implementierung falsch
wäre. Das ist kein Mangel, sondern der lehrreiche Teil: Die Szenarien
sind die Festlegung *einer* HPSMV-Filiale, nicht die einzig denkbare
Wahrheit.

Empfehlung für diesen Fall: die betroffenen Szenarien benennen, die
abweichende Festlegung dazuschreiben und beides nebeneinander stehen
lassen. Der Trainer kann die Suite dann als „die Filiale in der
Hauptstadt rechnet so" einführen.

