# Ein- und Ausgabeformat

Diese Beschreibung ergänzt die Aufgabe in [`prose.md`](prose.md). Sie
sagt, *wie* das Programm angesprochen wird — nicht, *was* es rechnet.
Die Rechenregeln stehen ausschließlich in der Aufgabe.

Die Feldnamen sind **verbindlich** — sie umzubenennen oder
umzustrukturieren steht nicht frei.

## Das Programm im Überblick

Es entsteht ein Kommandozeilen-Programm. Es liest ein JSON-Dokument von
der Standardeingabe und schreibt ein JSON-Dokument auf die
Standardausgabe. Keine Dateien, keine Datenbank, keine interaktiven
Rückfragen — rein hinein, raus heraus.

```
echo '{ ... }' | claim-office
{ ... }
```

Ein Aufruf verarbeitet ein **Szenario**: einen Kunden und eine Folge
von Vorgängen. Nach dem Aufruf ist das Programm fertig; es merkt sich
nichts über den Aufruf hinaus.

## Die Eingabe

Das Eingabe-Dokument hat zwei Felder: `customer` und `steps`.

```json
{
  "customer": { "yearsWithMHPCO": 0 },
  "steps": [ ... ]
}
```

### `customer` — der Kunde

Für das ganze Szenario gibt es **genau einen** Kunden. Er hat ein Feld:

- `yearsWithMHPCO` — wie viele volle Jahre der Kunde bereits Kunde ist,
  als ganze Zahl. Hieraus ergibt sich, ob der Treuerabatt greift.

> Das Kürzel im Feldnamen ist die englische Firmierung der Anstalt
> (*Most Honorable Privileged Claims Office*). Im Kontor hält man sich
> nicht damit auf; für das Programm zählt allein die Schreibweise.

### `steps` — die Vorgänge

`steps` ist eine Liste von Vorgängen, die **in der angegebenen
Reihenfolge** abgearbeitet werden. Jeder Vorgang hat ein Feld `op`, das
seine Art angibt: `"quote"` oder `"claim"`.

Die Reihenfolge ist bedeutsam: Ein späterer Vorgang darf sich auf eine
Police beziehen, die ein früherer Vorgang angelegt hat. Ob ein Vertrag
ein Folgevertrag ist, hängt ebenfalls davon ab, was vorher im selben
Szenario geschah.

#### Vorgang `quote` — eine Prämie berechnen

```json
{
  "op": "quote",
  "items": [
    { "type": "sword", "material": "steel", "enchantment": 3, "cursed": false }
  ]
}
```

- `items` — die Liste der Gegenstände, die versichert werden sollen.

Jeder Gegenstand hat:

- `type` — die Art des Gegenstands. Vorgesehen sind `sword`, `amulet`,
  `staff`, `potion` (Hauptgegenstände) sowie `rune` und `moonstone`
  (Komponenten).
- `material` — das Material, etwa `steel`, `silver`, `glass` oder
  `dragon`. Nur ein Wert ist für die Rechnung von Belang; welcher, steht
  in der Aufgabe.
- `enchantment` — die Verzauberungsstufe als ganze Zahl.
- `cursed` — ob der Gegenstand verflucht ist, `true` oder `false`.

Bei Komponenten dürfen `material`, `enchantment` und `cursed` fehlen.
Ein Gegenstand hat **keine Kennung** — zwei Schwerter in einer Police
sind zwei Einträge in der Liste und sonst nicht unterscheidbar.

#### Vorgang `claim` — einen Schaden regulieren

```json
{
  "op": "claim",
  "policy": 0,
  "incident": {
    "cause": "dragon attack",
    "damages": [
      { "itemType": "sword", "amount": 500 }
    ]
  }
}
```

- `policy` — auf welche Police sich der Schaden bezieht, als
  **nullbasierte Position im `steps`-Array**. `0` meint also den ersten
  Vorgang des Szenarios, und der muss ein `quote` sein.
- `incident` — der Schadensfall:
  - `cause` — die Ursache als Freitext (`"dragon attack"`, `"fire"`,
    `"fall"`, …). Sie steht im Hauptbuch und geht **nicht** in die
    Rechnung ein.
  - `damages` — die Liste der beschädigten Gegenstände. Jeder Eintrag
    hat `itemType` (die Art des beschädigten Gegenstands, passend zu
    einem `type` der Police) und `amount` (die Schadenshöhe in
    Goldstücken, ganze Zahl).

## Die Ausgabe

Das Ausgabe-Dokument hat ein Feld `results`.

```json
{ "results": [ ... ] }
```

`results` ist eine Liste, die **genauso lang ist wie `steps`** und
**dieselbe Reihenfolge** hat. Zum Vorgang an Position 0 gehört das
Ergebnis an Position 0.

Je nach Art des Vorgangs sieht ein Ergebnis anders aus:

- Zu einem `quote` gehört `{ "premium": <ganze Zahl> }` — die Prämie in
  Goldstücken.
- Zu einem `claim` gehört `{ "payout": <ganze Zahl> }` — die
  Auszahlungssumme in Goldstücken.

Alle Beträge sind **ganze Zahlen**. Wie gerundet wird, steht in der
Aufgabe.

## Ein vollständiges Beispiel

Ein Kunde, seit drei Jahren im Geschäft, versichert ein Amulett und
meldet später einen Brandschaden.

**Eingabe:**

```json
{
  "customer": { "yearsWithMHPCO": 3 },
  "steps": [
    {
      "op": "quote",
      "items": [
        { "type": "amulet", "material": "silver", "enchantment": 2, "cursed": false }
      ]
    },
    {
      "op": "claim",
      "policy": 0,
      "incident": {
        "cause": "fire",
        "damages": [
          { "itemType": "amulet", "amount": 200 }
        ]
      }
    }
  ]
}
```

**Ausgabe — die Gestalt:**

```json
{
  "results": [
    { "premium": 59 },
    { "payout": 100 }
  ]
}
```

Die beiden Zahlen ergeben sich aus den Regeln der Aufgabe.

## Was das Format nicht regelt

Diese Beschreibung legt die Gestalt der Dokumente fest, nicht ihre
Bedeutung. Was etwa geschieht, wenn eine `items`-Liste leer ist, eine
unbekannte Art auftaucht oder ein `amount` negativ ist, steht hier
nicht.

Auch das Datenmodell selbst lässt Fragen offen: Ein Gegenstand hat
keine Kennung, und ein `damages`-Eintrag nennt nur eine Art, keinen
bestimmten Gegenstand.

Wer solche Fragen hat, wendet sich an die Schadenskasse.

## Technische Vorgaben

- Das Programm liest von der Standardeingabe und schreibt auf die
  Standardausgabe.
- Die Ausgabe ist ein einzelnes JSON-Dokument.
- Innere Struktur, Modulaufteilung und Sprache sind frei, sofern das
  Team sich nicht auf etwas anderes verständigt hat.
