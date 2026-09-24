# Design-Entscheidungen für den Human-in-the-Loop

Begleitmaterial für den Trainer. **Nicht für Teilnehmer**.

Die [`trainer-notes.md`](trainer-notes.md) sammeln die *fachlichen*
Mehrdeutigkeiten — die Fragen, die das Example Mapping klärt. Dieses
Dokument sammelt, was danach kommt: die **Design-Entscheidungen**, bei
denen die Fachlichkeit feststeht und trotzdem mehrere Lösungen richtig
sind.

Der Unterschied ist für den Workshop der springende Punkt. Eine
Mehrdeutigkeit hat eine Antwort, die der Product Owner kennt. Eine
Design-Entscheidung hat keine — sie muss getroffen werden, und kein
Test kann sie erzwingen. Genau dafür braucht es den Menschen in der
Schleife.

## Woher die Belege stammen

Alle vier Entscheidungen unten sind aus fünf Läufen des Labs
abgeleitet: Kata `claim-office-example-mapping`, Workflow
`exact-ptdd-v1.1-refactor-subagent-cc`, Modell `claude-opus-5`,
Batch vom 2026-09-17. Vier der fünf Läufe erreichen volle externe
Korrektheit (15/15), einer lief in einen Timeout.

Die Auswahl folgt einem Kriterium: **wo die fünf Läufe divergieren,
liegt Entscheidungsspielraum.** Wo alle fünf gleich entscheiden, ist es
keine Entscheidung, sondern Modellkonvergenz — und damit nichts, worüber
eine Gruppe sinnvoll beraten kann.

Pfad zu den Läufen:
`experiments/runs/2026-09-17_00-24-43_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking{,-2..-5}/`

Die Läufe sind als *Material* gedacht: Nachdem die Gruppe entschieden
hat, kann der Trainer die Gegenposition aus dem Code vorlegen — inklusive
der Begründung, die der Agent selbst dazugeschrieben hat.

---

## E1 — Die tote Regel: bauen oder weglassen?

**Stärkster Kandidat.** Wenn im Workshop nur eine Entscheidung Platz
hat, dann diese.

### Die Situation

Die Prosa nennt zwei Sonderklauseln im Schadensfall:

- Verzauberungsstufe ≥ 8 → nur 50 % erstattet
- Drachenmaterial → 100 % erstattet

Die zweite Klausel ist unter dem festgelegten Regelsatz **nicht
beobachtbar**. Volle Erstattung ist ohnehin der Normalfall für jedes
Item, auf das keine Klausel zutrifft. Und wo Drachenmaterial auf
Stufe ≥ 8 trifft, gewinnt laut Festlegung F' die 50-%-Klausel.

Es gibt also keine Eingabe, bei der die Drachenmaterial-Klausel ein
Ergebnis verändert. Man kann das Feld `material` komplett ignorieren
und besteht trotzdem alle fünfzehn Verifikations-Szenarien.

### Die Entscheidung

| | Weglassen | Bauen |
|---|---|---|
| **Argument** | YAGNI. Kein Test unterscheidet die Varianten, also ist der Code nicht belegt. | Die Klausel steht im Versicherungsvertrag. Wer sie nicht baut, verliert Fachwissen. |
| **Kosten** | Das Wissen lebt nur noch in der Prosa. Wer später eine Klausel ergänzt, die weniger als 100 % gewährt, muss die Wechselwirkung neu herleiten. | Toter Code, ungetesteter Zweig. Eine Regel, die nie greift, sieht aus wie ein Bug. |

Beides ist verteidigbar. Wichtig für die Moderation: **es gibt hier
keine HPSMV-Festlegung.** Der Trainer sollte nicht so tun, als hätte er
die Antwort in der Tasche.

### Was die Läufe gemacht haben

Lauf `-2` hat die Klausel bewusst **nicht** gebaut und die Entscheidung
im Code begründet (`src/reimbursement-clause.ts`):

> „…has deliberately not been written as a clause of its own, because
> under the present clause set it cannot change any payout. It would
> grant rate 1, which is what the fallback already grants […] This stops
> being true the moment a clause is added that grants less than full
> reimbursement and that dragon material should override. At that point
> dragon material becomes observable and earns its own entry."

Lauf `-3` kommt zum selben Schluss, kürzer begründet. Die übrigen Läufe
bauen die Klausel aus, obwohl sie nichts bewirkt.

### Moderation

Die Frage taucht von selbst auf, sobald jemand den Test für
Drachenmaterial schreiben will und merkt, dass er auch ohne die
Implementierung grün ist. Wenn das niemand bemerkt, kann der Trainer
fragen: *„Ihr habt die Drachenmaterial-Klausel gebaut. Macht mal den
Zweig kaputt — welcher Test wird rot?"*

Der Aha-Moment ist nicht die Antwort, sondern die Einsicht, dass TDD
diese Frage strukturell nicht beantworten kann.

---

## E2 — Zwei Verzauberungs-Schwellen: ein Konzept oder zwei?

### Die Situation

Die Verzauberungsstufe wird an zwei Stellen ausgewertet:

- **Stufe ≥ 5** → 30 % Risikoaufschlag auf die *Prämie*
- **Stufe ≥ 8** → 50 % Erstattung im *Schadensfall*

Dieselbe Item-Eigenschaft, zwei Schwellen, zwei Seiten des Geschäfts.

### Die Entscheidung

Ist das **ein** Konzept („Verzauberungs-Risiko") mit zwei Auswertungen,
oder sind es **zwei** unabhängige Regeln, die zufällig dasselbe Feld
lesen?

Der Test: Was passiert, wenn die HPSMV *eine* der beiden Schwellen
verschiebt? Bei einem gemeinsamen Konzept muss man aufpassen, dass die
andere Seite nicht mitwandert. Bei zwei getrennten Regeln ist die
Änderung lokal — aber die Verwandtschaft ist nirgends sichtbar.

### Was die Läufe gemacht haben

Lauf `-2` entscheidet sich explizit für **getrennt**, und schreibt das
Warum dazu (`src/reimbursement-clause.ts`):

> „The claim office's own enchantment threshold, deliberately not shared
> with the premium side's. Both read the same item property, but they
> answer different questions — what a risk costs to insure against,
> versus what it settles at — and the spec fixes them at different levels
> and lets them move apart."

Lauf `-1` geht den anderen Weg und baut eine `RiskRating`-Abstraktion.

### Moderation

Eignet sich als Bonus-Frage, wenn die Gruppe zügig ist. Sie ist
subtiler als E1 und lohnt sich vor allem, wenn im Mapping schon
aufgefallen ist, dass 5 und 8 verdächtig nah beieinander liegen.

---

## E3 — Der Schnitt zwischen Prämie und Schaden

### Die Situation

Die Aufgabe nennt zwei Funktionen, `quote` und `claim`. Beide arbeiten
auf denselben Items und derselben Preisliste. Beide runden, aber in
entgegengesetzte Richtungen. Beide lesen die Verzauberungsstufe, aber
gegen verschiedene Schwellen (siehe E2).

Wie viele Module?

### Die Entscheidung

Das ist die Frage mit der **größten Streuung** über die Läufe — und
damit die, bei der der Automat am wenigsten „weiß", was richtig ist.
Gleiche Fachlichkeit, gleiche Tests, alle grün:

| Lauf | Dateien | Produktiv-LoC | Schnitt |
|---|---|---|---|
| `-4` | 2 | 542 | alles in `claim-office.ts` + CLI |
| `-5` | 4 | 596 | `quote` / `claim` / Preisliste getrennt |
| `-3` | 7 | 534 | Prämie / Schaden / Katalog / Register |
| `-1` | 13 | 791 | je Regel ein Modul |
| `-2` | 17 | 889 | je Regel ein Modul, plus Rollen-Typen |

Auffällig: Die kleinste Produktiv-LoC hat nicht der flachste Lauf,
sondern `-3` mit mittlerer Aufteilung. Mehr Dateien heißt hier nicht
weniger Code pro Datei, sondern schlicht mehr Code.

### Moderation

Gut geeignet als **Vorher-Nachher-Vergleich**: Die Gruppe entscheidet,
danach legt der Trainer die Extreme `-4` (2 Dateien) und `-2` (17
Dateien) nebeneinander. Beide bestehen dieselben Tests.

Die Frage, die daraus folgt: Woran hätte man die richtige Aufteilung
erkennen sollen? Die Antwort liegt nicht im Test-Ergebnis, sondern in
der Frage, welche Regeln sich gemeinsam ändern — und das steht in der
Prosa, nicht im Code.

---

## E4 — Ablehnung: Ausnahme oder Ergebnis?

### Die Situation

Die HPSMV lehnt einen Schadensfall komplett ab bei:

- unbekanntem Item-Typ
- negativer Schadenshöhe
- mehr Schadensmeldungen als versicherten Items

### Die Entscheidung

Ist eine Ablehnung ein **Programmfehler** (Exception) oder ein
**normaler Geschäftsvorfall** (Ergebnistyp)?

Das Argument kommt hier aus der Domäne, nicht aus dem Code: Die HPSMV
lehnt gerne ab. Ablehnung ist für dieses Kontor kein Ausnahmefall,
sondern Kerngeschäft — es gibt vermutlich einen Stempel dafür. Ein
Ergebnistyp würde das sichtbar machen; eine Exception behandelt den
Normalfall wie einen Unfall.

Gegenargument: Der Aufrufer will in vierzehn von fünfzehn Fällen eine
Zahl, und ein Ergebnistyp zwingt ihn, an jeder Stelle auszupacken.

### Was die Läufe gemacht haben

Vier der fünf Läufe werfen ein generisches `throw new Error` — jeweils
genau viermal, ohne eigenen Typ. Nur Lauf `-3` hat eine eigene
Ausnahme `ClaimOfficeRefusal` (`src/claim-office-refusal.ts`) und
begründet sie damit, dass Zulässigkeit eine eigene Frage ist:

> „Before the office asks whether the policy covers a damage, it asks
> whether the report is one it will consider at all. […] the office
> refuses the whole claim rather than settling it."

Kein einziger Lauf hat einen Ergebnistyp gebaut. Das macht E4 zur
Entscheidung mit der **stärksten Modell-Konvergenz** — und damit zur
interessantesten, wenn man zeigen will, dass der Automat eine Option
gar nicht erst in Betracht zieht.

### Moderation

Der Trainer kann die Frage über die Tonalität einführen, in
Sachverständigen-Rolle: *„Die Hausordnung kennt für Ablehnungen einen
eigenen Vordruck. Ist eine Ablehnung bei euch im Code auch ein
Vordruck, oder ein umgefallener Aktenschrank?"*

---

## Einordnung in den Ablauf

Keine dieser vier Entscheidungen taucht im Example Mapping auf. Das
Mapping klärt Fachlichkeit; diese Fragen entstehen erst beim
Implementieren, meist in der Refactor-Phase.

Im Referenz-Durchlauf zur RPG-Combat-Kata
(`~/sync/workspace/rpg-combat-exact-coding-tryout`) kam die
vergleichbare Entscheidung — Health als eigener Typ statt `number` im
Character — ebenfalls nicht aus dem Mapping, sondern als eigener
Refactor-Prompt nach der ersten Story:

> „refactor: Health should be its own type/class implementing the rules
> from a pure health perspective enforcing the invariants."

Für den Workshop heißt das: Es braucht einen **eigenen Checkpoint** im
Ablauf, nicht bloß eine rote Karte im Mapping. Vorschlag für die
Einordnung in den Ablauf aus [`trainer-notes.md`](trainer-notes.md):

| Schritt | Ergänzung |
|---|---|
| 4. Implementierung | nach dem ersten grünen Durchlauf von `quote`: **E3** (Schnitt) |
| 4. Implementierung | beim ersten Test für Drachenmaterial: **E1** (tote Regel) |
| 4. Implementierung | beim Bau der Ablehnungen: **E4** (Ausnahme oder Ergebnis) |
| — | **E2** als Reserve, wenn Zeit bleibt |

Bei Zeitdruck genügt **E1**. Sie ist die einzige der vier, die sich
strukturell nicht wegtesten lässt, und die Gegenposition liegt in Lauf
`-2` fertig begründet vor.
