# Neue Mehrdeutigkeits-Karten für die Overlords-Kata

Mehrdeutigkeits-Entwürfe für zwei *neue* Monster-Karten im Overlords-
Kartenspiel. Ziel: die als "zu einfach" eingestufte Overlords-Kata
(siehe [kata-requirements.md](kata-requirements.md), Positiv-Referenz)
mit bewusst konstruierten Mehrdeutigkeiten nach der
[kata-construction.md](kata-construction.md)-Methodik anreichern.
Stand: 2026-06-09.

Bezugsdokumente: [kata-construction.md](kata-construction.md),
[kata-mehrdeutigkeiten.md](kata-mehrdeutigkeiten.md) (HPSMV als Vorbild
für Format und Qualitätsmaßstab).

## Setting

**Overlords** (© 2013 Pass That Chit) ist ein Set-Collection-/
Card-Drafting-Spiel. Jeder Monster-Typ hat eine eigene
Scoring-Mechanik; am Spielende zählt jeder Spieler seine Armee.

Bestehende Monster-Typen und ihre Wertung (Rulebook V3, Abschnitt IX):

| Karte | Mechanik | Reasoning-Pattern |
|---|---|---|
| Undead Warrior | 1/2/3 Pkt; Straight (1+2+3) = +6 | Set über verschiedene Werte |
| Zombie | 1/4/9/12/18/24 (1–6+) | Staffelung |
| Hydra | 3/7/12/18/25 (1–5+) | Staffelung |
| Orthrus | Paar = 7, sonst 2 je | Set (Größe 2) |
| Chimera | 3er-Set = 12, sonst 2 je | Set (Größe 3) |
| Cyclops | genau 1 = 6, sonst 2 je | "Solo-Bonus" |
| Minotaur | Mehrheit 24/16/8, Ties splitten | Cross-Player-Ranking |
| Hired Hand | alle 2 Pkt | konstant |

**Lücke im Pattern-Raum:** Es gibt keine Karte, deren Wert von der
*Zusammensetzung der übrigen Armee* abhängt (Begriffs-Doppeldeutigkeit
über "Art"), und keine, die *zwei Set-Größen gleichzeitig* anbietet
(Set-Zerlegung mit konkurrierenden Stückelungen). Die zwei neuen Karten
füllen genau diese Lücken.

**Tonalität:** Overlords hat keine Parodie-Linie wie die HPSMV. Eine
Festlegung ist hier eine reine Spielregel-Entscheidung ("Hausregel"),
keine Charakter-Frage. Damit entfällt das HPSMV-Kriterium
"Tonalitäts-Konsistenz"; an seine Stelle tritt **Mechanik-Konsistenz**
mit den bestehenden Karten (siehe je Karte).

## Übersicht

| Karte | Muster | Streitpunkt(e) | Vortest | Single-/Cross-Army |
|---|---|---|---|---|
| Sphinx | B + Selbstbezug + C | Selbstbezug · Ellipse · UW-Aggregation | 2 Achsen streuen, 1 konvergent | Single |
| Mantikor | A (Kombination) | Zerlegung bei Überzahl, zwei Set-Größen | konvergent (max) | Single |

**Umgesetzt ist nur die Sphinx** (2026-08-11) — siehe
[Umsetzung](#umsetzung). Der Mantikor bleibt Entwurf.

Beide bleiben **single-army** (Wertung hängt nur an der eigenen Armee) —
das hält die Verifikation einfach (CLI nimmt eine Karten-Liste, gibt
Punkte zurück; kein Multi-Player-Zustand wie bei Minotaur nötig).

---

## Mehrdeutigkeit S — Sphinx (Muster C + konstruktiv versteckte Information)

### Regeln

```
Sphinx:
- Eine Sphinx zählt 4 Punkte.
- Jede Sphinx erhält zusätzlich 2 Punkte für jede Art von Monster
  in deiner Armee.
```

Keine Beispiele, kein "andere", kein "verschiedene" — die Regel bleibt
neutral (siehe [Wegweiser-Vokabular](kata-construction.md#wegweiser-vokabular)).

### Mehrdeutigkeit

Zwei *unabhängige* Streu-Achsen, die sich kombinieren:

1. **Aggregations-Einheit "Art von Monster" (Muster C — Begriff):** Was
   ist *eine* Art? Der **Untote Krieger** ist der Schlüsselfall: im
   Rulebook ist er *ein* Monster-Name, kommt aber als *drei*
   Kartenvarianten (1-, 2-, 3-Punkte-Karten) und wird als *eine*
   Scoring-Gruppe gewertet (Straight-Bonus über die drei Varianten).
   Zählt die Sphinx den Untoten Krieger als *eine* Art (Monster-Name)
   oder als *drei* (Kartenvariante)? Genuin doppeldeutig — und
   **konstruktiv versteckt**: wer das Rulebook liest, *sieht* die
   Doppelnatur und stellt die Klärungsfrage. (Die im Vortest 2026-06-09
   geprüfte Typ-vs-Exemplar-Lesart trägt nicht — siehe Befunde — und ist
   durch diese präzisere Achse ersetzt.)
2. **Selbstbezug (konstruktiv versteckte Information):** Zählt die
   Sphinx ihre *eigene* Art / sich selbst mit? Die Regel sagt nichts —
   analog zur HPSMV-Sub-Mehrdeutigkeit Aₐ ("gleichartig"). Ein
   aufmerksamer Entwickler stutzt hier und stellt die Klärungsfrage.
   In der gestaffelten Fassung zerfällt die Achse in *zwei* Fragen, die
   sich getrennt beantworten lassen: zählt die Karte **sich selbst**, und
   zählt sie **andere Sphinxe**? Damit liegen drei Lesarten vor (nie /
   nur andere / immer), nicht mehr zwei — die Festlegung wird beidseitig
   diskriminierbar statt nur gegen eine Alternative.
3. **Ellipse (Muster B — unterspezifizierte Operation):** Die Regel
   "2 Punkte pro Art jenseits von drei, sonst 1" lässt im zweiten Teil
   die Bezugsgröße weg — gilt "pro Art" weiter (1 Punkt *pro Art*) oder
   ist es ein absoluter Wert (1 Punkt *pauschal*)? Klassische Ellipse.
   In der gestaffelten Fassung ist sie **schärfer** als in der
   Schwellen-Fassung: Die "pro Art"-Lesart erzeugt eine *Delle* im
   Kartenwert (4 · 5 · 6 · 7 · **6** · 8 bei 0–5 anderen Arten) — bei
   vier Arten wäre die Sphinx weniger wert als bei dreien. Ein sichtbarer
   Widersinn, an dem ein aufmerksamer Leser hängenbleibt.

### Zwischenstand — Schwellen-Variante (gewählt 2026-06-09, überholt)

Erste Festlegung, Grundlage der Vortest-Befunde weiter unten:

```
Sphinx:
- Eine Sphinx zählt 4 Punkte.
- Jede Sphinx erhält außerdem 2 Punkte pro Art von Monster ab vier
  Arten in deiner Armee, sonst 1 Punkt.
```

Selbstbezug damals: "ohne sich selbst"; Ellipse: "pauschal". Diese
Fassung ist am 2026-08-11 durch die gestaffelte Regel unten ersetzt
worden — die Vortest-Tabellen ab
[Vortest-Befunde](#vortest-befunde-ambiguitäts-probe-2026-06-09) beziehen
sich auf *diese* Fassung und bleiben als historische Messdaten stehen.

### Finale Regel — gestaffelte Variante (gewählt 2026-08-11, User)

```
Sphinx:
- 1 Punkt.
- 2 Punkte pro Art jenseits von drei, sonst 1.
```

Kartentext (Prompt-Fassung, englisch):
`Sphinx — 1 point. 2 per type beyond three, else 1.`

Gedruckte Karte:
[`experiments/katas/sphinx-score-verification/card.png`](../../experiments/katas/sphinx-score-verification/card.png).

Drei Änderungen gegenüber dem Zwischenstand, alle vom User entschieden:

**1. Gestaffelt statt Schwelle.** Nicht mehr "ab vier Arten zählen *alle*
Arten doppelt", sondern "jede Art *jenseits von drei* zählt doppelt". Der
Wert wächst dadurch linear (2 · 2 · 2 · 2 · 3 · 5 · 7 bei 0–6 anderen
Arten) statt schlagartig von 5 auf 12 zu springen.

**2. Basis 4 → 1.** Zusammen mit (1) bringt das den Grenznutzen in den
Korridor der Bestandskarten. Begründung: Balance — die Sphinx sollte im
Draft eine Entscheidung sein, kein Auto-Pick.

| Karte | Grenznutzen 1.–4. Exemplar |
|---|---|
| Zombie | 1 / 3 / 5 / 3 |
| Hydra | 3 / 4 / 5 / 6 |
| Orthrus | 2 / 5 / −1 / 2 |
| Chimera | 2 / 2 / 8 / −4 |
| Cyclops | 6 / −2 / 2 / 2 |
| Hired Hand | 2 / 2 / 2 / 2 |
| **Sphinx (alte Fassung)** | **5 … 19** |
| **Sphinx (neue Fassung)** | **2 … 7** |

Die alte Fassung lag mit bis zu 19 Punkten Grenznutzen weit über allen
Bestandskarten — verursacht nicht von der Basis, sondern vom
`2 Punkte × alle Arten`-Faktor über der Schwelle, der sich zusätzlich
über die Sphinx-Anzahl multipliziert. Eine reine Basis-Senkung hätte den
Ausreißer *vergrößert* (kleinerer Nenner unter der Schwelle).

**3. Selbstbezug: die eigene Karte zählt nicht, andere Sphinxe schon.**
Ersetzt "ohne sich selbst". Jede Sphinx-Karte wird gegen die *restliche*
Armee gewertet — aus Sicht einer Sphinx ist eine zweite Sphinx ein
anderes Monster in dieser Armee.

Begründung: (1) Wortlaut — die Karte spricht von "types in your army"
ohne "andere"; "ohne sich selbst" liest ein *other* in den Text hinein,
das nicht dasteht. (2) Ein Prinzip statt Sonderregel — *jede Karte wertet
die Armee um sich herum* deckt beide Fälle ab, ohne Ausnahmeklausel.
(3) Mechanik-Konsistenz — der Zyklop ist der Präzedenzfall für eine
Karte, deren Wert an der Anzahl ihresgleichen hängt.

Nebeneffekt, bewusst in Kauf genommen: Eine einzelne Sphinx sieht keine
Sphinx-Art, zwei sehen je eine. Die zweite Sphinx kann die erste damit
über die Drei-Arten-Grenze heben (2 Sphinxe + 3 andere Arten = 6 statt 4
Punkte). Das ist im Draft ein spürbarer, aber gedämpfter Effekt — in der
alten Fassung war derselbe Sprung 24 statt 10.

**Alle drei Festlegungen stehen nur in den Beispielen, nicht im
Regeltext** — sonst löst der Regeltext die Mehrdeutigkeit auf
(Wegweiser).

Der Nachtest zur gestaffelten Fassung ist am 2026-08-11 gelaufen — siehe
[Vortest-Befunde gestaffelte Fassung](#vortest-befunde-gestaffelte-fassung-2026-08-11).
Er hat eine **vierte, ungeplante Achse** freigelegt (Trostpunkt: addiert
oder ersetzt) und zeigt, dass alle drei Festlegungen gegen die
Modell-Mehrheit stehen.

### Lesarten (Vortest-Fassung 2026-06-09, historisch)

Die Probe-Eingaben und Werte dieses Abschnitts beziehen sich auf die
**Schwellen-Fassung** mit Basis 4. Sie dokumentieren, was am 2026-06-09
gemessen wurde, und sind nicht auf die gestaffelte Regel umgerechnet. Die
Lesart-Diskriminierung der finalen Fassung steht in
`experiments/katas/sphinx-score-verification/README.md`.

Zwei Probe-Eingaben isolieren je eine Achse; gefragt ist jeweils nur die
Sphinx-Wertung.

**Eingabe A — Selbstbezug isoliert:** *1 Sphinx, 3 Zombies, 1 Hydra*
(eindeutige, gut unterscheidbare Typen).

- **A-ohne sich selbst:** Arten = {Zombie, Hydra} = 2 → `4 + 2×2 =` **8**
- **A-mit sich selbst:** Arten = {Sphinx, Zombie, Hydra} = 3 → `4 + 2×3 =` **10**

**Eingabe B — Untote-Krieger-Aggregation isoliert:** *1 Sphinx, je 1
Untoter Krieger mit 1/2/3 Punkten, 1 Hydra*.

- **B-eine Art, ohne sich selbst:** {Untoter Krieger, Hydra} = 2 → **8**
- **B-eine Art, mit sich selbst:** {Sphinx, UK, Hydra} = 3 → **10**
- **B-drei Arten, ohne sich selbst:** {UK1, UK2, UK3, Hydra} = 4 → **12**
- **B-drei Arten, mit sich selbst:** + Sphinx = 5 → **14**

**Eingabe C — Schwellen-Ellipse isoliert** (nur Schwellen-Variante):
*1 Sphinx, 1 Zombie, 1 Hydra*. Bleibt unter der Schwelle (4) in *jeder*
Selbstbezug-Lesart (max. 3 Arten), sodass nur die "sonst 1 Punkt"-Ellipse
misst.

- **C-pauschal (1 Punkt flat):** `4 + 1 =` **5**
- **C-pro Art, ohne sich selbst:** 2 Arten × 1 → `4 + 2 =` **6**
- **C-pro Art, mit sich selbst:** 3 Arten × 1 → `4 + 3 =` **7**

Knapp gestaffelte Werte (8/10/12/14 bzw. 5/6/7, je +1/+2) — kleine
Rechen-Verwechslungen führen direkt zu Lesart-Verwechslungen, was den
[Rechenfehler-als-TDD-Indikator](kata-construction.md#rechenfehler-als-tdd-indikator)
verstärkt.

### Sub-Mehrdeutigkeit Sₐ — Hired Hands (verworfen, out-of-scope)

Erwogen: Zählen Hired-Hand-Karten als "Art von Monster"? Im Rulebook
sind Hired Hands *keine* Monster (eigene Kategorie, Abschnitt VII), die
Lesart wäre also "zählen nicht". **Verworfen 2026-06-09 (User):** zu
peripher; die Sphinx-Mehrdeutigkeit lebt vom Untote-Krieger-Aggregations-
Streit (Achse 1) und dem Selbstbezug (Achse 2).

### Festlegung (Stand 2026-08-11)

| Achse | Vortest 2026-06-09 | Festlegung |
|---|---|---|
| 2 Selbstbezug | streute auf der *alten* Fassung (Opus 8 / Rest 10); die dritte Lesart war nicht Teil der Probe | **die eigene Karte zählt nicht, andere Sphinxe schon** |
| 3 Ellipse | streute (Opus pauschal / Sonnet+Haiku je 2/5 pro Art) | **pauschal** (Trostpunkt) |
| 1 UW-Aggregation | konvergent auf "eine Art", aber explizit benannt | **"eine Art"** (mit der Konvergenz; Wert liegt in der Klärung) |

Achse 3 und 1 sind gegenüber dem Zwischenstand unverändert; Achse 2 ist
am 2026-08-11 auf die Karten-eigene Sicht umgestellt (Begründung oben).

**Finale Sphinx-Wertung (alle drei Achsen gepinnt):**

> Eine Sphinx zählt 1 Punkt. Für jede Monster-Art jenseits der dritten
> erhält sie zusätzlich 2 Punkte; gibt es keine Art jenseits der dritten,
> erhält sie stattdessen genau 1 Punkt. Gezählt werden die Arten der
> *übrigen* Armee — die eigene Karte zählt nicht mit, weitere Sphinxe
> schon. (Kartenvarianten desselben Monster-Namens — z.B. die drei
> Untoten Krieger — zählen als *eine* Art.)

Beispiel-Werte (eine Sphinx, nach Anzahl anderer Arten): 0–3 andere →
**2**; 4 andere → **3**; 5 andere → **5**; 6 andere → **7**. Mit zwei
Sphinxen: 2 andere Arten → **4**; 3 andere → **6** (jede Sphinx sieht die
andere als vierte Art). Der Regeltext im Prompt bleibt *neutral* (kein
"andere", kein "pauschal") — die Festlegungen werden nur über
Example-Mapping-Beispiele kommuniziert.

**Diskriminierung der Festlegungen.** Die Verifikations-Suite trennt jede
Lesart-Alternative an eigenen Szenarien; eine Implementierung, die eine
Achse anders liest, fällt messbar durch:

| Falsche Lesart | fällt durch bei (von 15 Szenarien) |
|---|---|
| Sphinx zählt nie als Art | 13, 14, 15 |
| Sphinx zählt sich selbst mit | 04, 05, 06, 09, 10 |
| UW-Varianten = drei Arten | 08, 09, 10 |
| "sonst 1" pro Art | 02, 03, 04, 07, 08, 09, 12 |

### API-Schema

Neutral: alle Lesarten brauchen nur die vollständige Karten-Liste der
Armee. Das Schema entscheidet keine Lesart vor (kein Feld "distinctTypes"
o. ä.).

Umgesetzt als CLI-Kata mit JSON über stdin/stdout, damit
`verification_pct` als externe Akzeptanz-Metrik zur Verfügung steht:

```json
{ "army": [ { "monster": "sphinx" },
            { "monster": "undead-warrior", "rank": 2 } ] }
→ { "score": 2 }
```

Das `rank`-Feld trägt die Punktvariante des Untoten Kriegers und ist
bewusst neutral: Es sagt nicht, ob die drei Varianten eine oder drei
Arten sind — genau Achse 1.

### Umsetzung

`experiments/katas/sphinx-score-{prose,user-story,example-mapping}/` plus
`sphinx-score-verification/` (15 Szenarien). Nur die Sphinx ist
scorebar — die übrigen Monster erscheinen ausschließlich als *Arten* für
die Zählung und haben keine eigene Wertung.

Damit entfällt der unter [Mechanik-Konsistenz](#mechanik-konsistenz-check-statt-tonalität)
beschriebene Set-Auflösungs-Konflikt: Da Chimera und Orthrus in dieser
Kata nicht gewertet werden, muss die strikte Mantikor-Lesart nicht mit
der Greedy-Auslegung dieser Karten vereinheitlicht werden. Der Mantikor
ist nicht Teil der Kata.

---

## Mehrdeutigkeit M — Mantikor (Muster A, konkurrierende Set-Größen)

### Regeln

```
Mantikor:
- Ein Paar Mantikore zählt 7 Punkte.
- Drei Mantikore bilden ein Rudel und zählen 12 Punkte.
- Einzelne Mantikore zählen je 2 Punkte.
```

Bewusst *kein* "genau", "höchstens", "exakt" — diese Rahmungs-Adjektive
würden die Auflösung vorgeben (siehe Wegweiser-Vokabular).

### Mehrdeutigkeit

Der Mantikor bietet **zwei** Set-Größen (Paar = 2, Rudel = 3)
gleichzeitig an. Damit ist nicht nur die HPSMV-A-Frage "was passiert bei
Überzahl?" offen, sondern auch "*welche* Set-Stückelung bildet man?".
Drei konsistente Auslegungen für eine Sammlung, die sich nicht glatt in
ein einzelnes Set teilt.

Effizienz pro Karte: Einzel 2,0 — Paar 3,5 — Rudel 4,0. Das Rudel ist am
wertvollsten, sodass "greedy größtes Set zuerst" und "wertmaximierend"
in vielen Fällen zusammenfallen — die Lesart-Trennung kommt über die
*strikte* und die *ein-Set*-Auslegung.

### Lesarten

Eingabe: **5 Mantikore**. (Bei 5 trennen sich alle drei Lesarten; bei 4
fallen ein-Set und max zusammen — siehe unten.)

- **L1 — Strikt (Set nur bei exakter Größe, sonst alles einzeln):**
  5 ∉ {2, 3} → kein Set. `5×2 =` **10 Pkt**
- **L2 — Höchstens ein Set (größtes nehmen, Rest einzeln):**
  Rudel + 2 Einzel = `12 + 2×2 =` **16 Pkt**
- **L3 — Maximale Zerlegung (wertvollste Set-Kombination):**
  Rudel + Paar = `12 + 7 =` **19 Pkt**

Probe-Tabelle (zur Auswahl der besten Frage-Zahl):

| Anzahl | L1 strikt | L2 ein-Set | L3 max | Trennung |
|---|---|---|---|---|
| 4 | 8 | Rudel+Einzel = 14 | Paar+Paar = 14 | L2=L3, schwach |
| **5** | **10** | **16** | **19** | **alle drei getrennt** |
| 6 | 12 | Rudel+3 Einzel = 18 | Rudel+Rudel = 24 | alle drei getrennt |
| 7 | 14 | Rudel+4 Einzel = 20 | Rudel+Paar+Paar = 26 | alle drei getrennt |

→ **5 Mantikore** als Vortest-Frage (engste Streuung 10/16/19, knappe
Zahlen). 6 oder 7 als Alternativen, falls der Vortest bei 5 nicht
sauber trennt.

### Festlegung — L1 strikt (gewählt 2026-06-09, User)

**L1 (strikt, = 10): Ein Set zählt nur bei exakt passender Gesamtzahl,
sonst alles einzeln.** Festlegung gegen die Modell-Konvergenz (alle
Modelle wählten ohne Beispiel L3 = max = 19).

**Plausibilität — Cyclops-Analogie trägt sie:** L1 ist *mechanik-identisch*
mit einer bestehenden Overlords-Karte — Cyclops wertet "genau eine = 6,
sonst 2 je", d.h. bei Überzahl fällt der Bonus weg und alles zählt
einzeln. "Ein Paar = 7 / ein Rudel = 12, sonst einzeln" ist exakt dieselbe
Logik. Damit ist L1 aus dem Regelwerk klar ableitbar (nicht verstecktes
Wissen) und sogar konsistenter als L3, das mit Cyclops bräche.

**Methodischer Vorbehalt (dokumentiert, nicht blockierend):** Im Vortest
wählte *kein* Modell L1 spontan — die Modelle benannten "alles einzeln =
10" nur als erwähnte Alternative. Der Plausibilitäts-Check
([Festlegungs-Strategien](kata-construction.md#festlegungs-strategien))
ist damit über die *Ableitbarkeit* (Cyclops-Analogie, Modell-Erwähnung)
erfüllt, nicht über *spontane Wahl*. Konsequenz: die Example-Mapping-
Beispiele müssen die Modelle vollständig von 19 auf 10 umdrehen — ein
starker, aber legitimer Hebel. Spiel-Design-Konflikt beachten: die
etablierte Chimera-Auslegung in Referenz-Implementierungen ist L3 (max);
in einer kombinierten Kata sollte die Set-Auflösung über Mantikor,
Chimera und Orthrus **einheitlich** sein (sonst unbeabsichtigte
Zusatz-Mehrdeutigkeit). Bei Festlegung Mantikor = L1 strikt müssten
Chimera/Orthrus mitgezogen oder die Abweichung bewusst begründet werden.

### API-Schema

Neutral: alle Lesarten brauchen nur die Mantikor-Anzahl (bzw. die
Karten-Liste). Keine Lesart wird vom Schema vorentschieden.

---

## Mechanik-Konsistenz-Check (statt Tonalität)

| Neue Karte | Konsistent mit | Spannung zu |
|---|---|---|
| Sphinx (Art = Typ) | Minotaur (Typ als Einheit), UW-Scoring (Varianten = eine Gruppe) | — |
| Mantikor (max) | Chimera/Orthrus (etablierte Greedy-Auslegung) | schwacher Mess-Effekt |
| Mantikor (strikt) | Cyclops ("genau eine") | bricht mit Chimera-Greedy → bewusst, für Mess-Signal |

Falls beide Karten zusammen in *eine* Kata-Variante kommen, sollte die
Set-Auflösung über Sphinx (n/a), Mantikor, Chimera und Orthrus
**einheitlich** festgelegt werden — sonst entsteht unbeabsichtigte
Zusatz-Mehrdeutigkeit ("warum löst Mantikor anders auf als Chimera?").

## Vortest-Befunde gestaffelte Fassung (2026-08-11)

Konfiguration: `ambiguity-probe/overlords-sphinx-gestaffelt.yaml`,
3 Fragen × 4 Modell-Konfigs × n=5 = 60 Calls, alle fehlerfrei.
Roh-Antworten: `results-overlords-sphinx-gestaffelt/`.
Klassifikation: Headline-Zahl je Antwort (die als Ergebnis präsentierte
Zahl, nicht die im Rechenweg genannte).

| Frage | misst | Festlegung | getroffen | verschiedene Antworten |
|---|---|---|---|---|
| G1 | Formulierung "jenseits von drei" | 5 | **2/20** | 5 (5·7·8·9·11) |
| G2a | zählt eine zweite Sphinx als Art? | 6 | **6/20** | 7 |
| G2b | zählt die Sphinx sich selbst? | 2 | **0/20** | 2 (1·3) |

### Befund 1 — vierte Achse: Trostpunkt addiert oder ersetzt?

**Nicht geplant, vom Vortest freigelegt.** Die Modelle lesen "sonst 1
Punkt" überwiegend als *Ersatz* für den Grundwert, nicht als Zusatz.
Wörtlich (Opus 4.7 mit thinking, G2b rep 5):

> Der Grundwert von 1 Punkt wird durch die Bonusregel ersetzt (nicht
> addiert)

und (Opus 4.7 ohne thinking, G2b rep 5):

> Somit: 1 Punkt (Grundwert) + 0 Bonus = 1.

In G2b antwortet **niemand** mit der Festlegung 2: 9/20 lesen "ersetzt"
(→ 1), 11/20 zählen die Sphinx selbst mit und kommen auf 3.

Ursache ist die Basis-Senkung von 4 auf 1: Bei Basis 4 waren "4+1 = 5"
und "ersetzt = 1" klar verschiedene Aussagen. Mit Basis 1 stehen zwei
Einsen nebeneinander, und "1 Punkt. … sonst 1" liest sich natürlicher als
Fallback denn als Summe. Die ursprünglich geplante Ellipse-Achse
(*pauschal vs. pro Art*) misst damit faktisch etwas anderes:
*addiert vs. ersetzt*.

**Festlegung (User, 2026-08-11): bleibt bei addiert (1 + 1 = 2).** Die
Lesart ist aus dem Regeltext ableitbar — die Modelle benennen die
Zweideutigkeit selbst ("ist unklar, ob …") —, also zulässig trotz
20:0-Konvergenz. Es ist der stärkste Beispiel-Hebel der Kata und damit
ein besonders klarer Beleg dafür, dass Example-Mapping nötig ist.
Abgesichert: 6 der 10 example-mapping-Beispiele und 8 der 15
Verifikations-Szenarien schließen die "ersetzt"-Lesart aus.

### Befund 2 — Selbstbezug streut weiter, aber anders als 2026-06

G2a (2 Sphinxe, 3 andere Arten) trennt die Lesarten sauber und streut
über alle vier Modelle: 6× die Festlegung 6, 5× 8 (Sonnet, konsistent),
4× 2, dazu 4, 3, 10 und eine unparsbare Antwort. Sonnet 4.6 antwortet
5/5 mit der Headline 8 — reproduzierbar, aber in 4 dieser 5 Läufe nennt
der Rechenweg die 6 (rep 2: "Jede Sphinx ist damit 1 + 2 = 3 Punkte wert.
Zwei Sphinxen = **6 Punkte**." — gefolgt von "Warte –" und der Headline
8). Sonnet *rechnet* hier also überwiegend die Festlegung und verwirft
sie in der Selbstkorrektur.

Die Karten-eigene Sicht ("andere Sphinxe zählen, die eigene nicht") wird
also weder spontan gewählt noch systematisch ausgeschlossen — sie liegt
im Streubereich. Damit bleibt die Festlegung plausibel.

### Befund 3 — Rechenchaos überlagert die Lesart-Streuung

G1 produziert fünf verschiedene Antworten und in **9/20** Läufen eine
sichtbare Selbstkorrektur mitten im Text ("Warte — ich zähle neu",
"Warte, die …"). Ein Opus-Lauf rechnet im Text `1 + 3 + 4 = 8` und
schreibt als Headline "11 Punkte".

Die häufigste G1-Antwort ist 7 (12/20) = "Überschuss-Lesart, aber mit
Selbstzählung". Die Formulierung *jenseits von drei* wird also
mehrheitlich korrekt als Überschuss verstanden; was streut, ist der
Selbstbezug — und zusätzlich die Arithmetik.

**Bewertung (User, 2026-08-11): akzeptiert als
[Rechenfehler-als-TDD-Indikator](kata-construction.md#rechenfehler-als-tdd-indikator).**
Eine Lösung ohne laufende Tests bezahlt den Fehler; genau das soll die
Kata messen. Einschränkung, die bei der Auswertung zu beachten ist: Bei
G1 lässt sich "anders gelesen" nicht sauber von "verrechnet" trennen.

### Konsequenz

Alle drei Festlegungen stehen **gegen** die Modell-Mehrheit (2/20, 6/20,
0/20). Das ist methodisch zulässig — jede Lesart ist aus dem Regeltext
ableitbar und wird von den Modellen teils selbst benannt — und ergibt das
stärkste erreichbare Example-Mapping-Signal: Ohne Beispiele streut die
Kata über 5 bzw. 7 verschiedene Ergebnisse, mit Beispielen muss sie
konvergieren. Die Kata bleibt unverändert.

## Vortest-Befunde (Ambiguitäts-Probe, 2026-06-09)

Drei Läufe mit `ambiguity-probe/probe.py <config>.yaml`, je 4 Modell-Konfigs
(Opus 4.7 ±thinking, Sonnet 4.6 +thinking, Haiku 4.5) × n=5, ohne Beispiele,
Default-Temperatur. Klassifikation durch Lesen der Roh-Antworten. Alle
Calls fehlerfrei.

- Lauf 1 (`overlords-mehrdeutigkeiten.yaml`): Sphinx-Selbstbezug (S) + Mantikor (M)
- Lauf 2 (`overlords-sphinx-undead.yaml`): Sphinx-UW-Aggregation (S2)
- Lauf 3 (`overlords-sphinx-schwelle.yaml`): Sphinx-Schwellen-Ellipse (S3)

### Sphinx Achse 2 — Selbstbezug (S, Eingabe „3 Zombies + Hydra") — **streut**

| Modell | Befund | Lesart |
|---|---|---|
| Opus 4.7 (thinking) | 4× **10**, 1× 8; Mehrdeutigkeit in 3/5 explizit benannt | überw. L2 (mit sich selbst) |
| Opus 4.7 (ohne thinking) | **5× 8**, Alternative „sonst 10" fast immer mitgenannt | konsistent L1 (ohne sich selbst) |
| Sonnet 4.6 (thinking) | 5× **10**, Mehrdeutigkeit in 4/5 explizit benannt | konsistent L2 (mit sich selbst) |
| Haiku 4.5 | 5× **10** | konsistent L2 |

- **Selbstbezug trägt die Streuung:** Opus-ohne-thinking konsistent „ohne
  sich selbst" (8), Sonnet/Haiku konsistent „mit sich selbst" (10),
  Opus-thinking gemischt. Dieselbe Opus-vs-Sonnet-Signatur wie die
  stärksten HPSMV-Mehrdeutigkeiten (B₂, F). Opus und Sonnet **thematisieren
  die Mehrdeutigkeit aktiv**.
- **Typ-vs-Exemplar (urspr. geplante Muster-C-Achse): tot.** *Keine*
  Antwort (0/20) liest „Art" als Exemplar (12/14 nie). „Art" ist als *Typ*
  eindeutig genug. Diese Achse wurde durch die präzisere
  UW-Aggregations-Achse (S2) ersetzt.

### Sphinx Achse 1 — UW-Aggregation (S2, Eingabe „je 1 UK 1/2/3 + Hydra") — **konvergent, aber als Klärungsfrage wertvoll**

| Modell | Befund | Lesart |
|---|---|---|
| Opus 4.7 (±thinking) | je 5× **10**; Doppeldeutigkeit „1 vs. 3 Arten" oft explizit benannt | „eine Art" |
| Sonnet 4.6 (thinking) | 5× **10** | „eine Art" |
| Haiku 4.5 | 5× **10** | „eine Art" |

- **20/20 → „eine Art"**: alle Modelle werten die drei UK-Punktvarianten
  als *eine* Art („Varianten derselben Art"). Die „drei Arten"-Lesart
  (12/14) kommt nie spontan vor → konvergent (wie HPSMV-A/C/D).
- **Aber: Opus und Sonnet benennen die Lücke aktiv** („je nach Lesart
  könnten die drei Untoten Krieger als 3 Arten zählen"). Genau die
  *konstruktiv-versteckte Klärungsfrage* — ein Example-Mapping-Teilnehmer
  muss sie stellen, auch wenn die Default-Antwort stabil ist.
- **Achsen-Interaktion (Nebenbefund):** In S2 zählt *jedes* Modell die
  Sphinx selbst mit (3 Arten → 10), auch Opus-ohne-thinking, das in S
  noch „ohne sich selbst" (8) wählte. Die prominente UW-Frage zieht
  Aufmerksamkeit vom Selbstbezug ab.

### Sphinx Achse 3 — Schwellen-Ellipse (S3, Schwellen-Regelvariante) — **streut**

| Modell | 5 (pauschal) | 7 (pro Art) |
|---|---|---|
| Opus 4.7 (thinking) | 5/5 | – |
| Opus 4.7 (ohne thinking) | ~5/5 (mit Rechen-Wirrwarr) | – |
| Sonnet 4.6 (thinking) | 3/5 | **2/5** |
| Haiku 4.5 | 3/5 | **2/5** |

- **Die Ellipse trägt:** Opus liest „sonst 1 Punkt" konsistent als
  *pauschal* (5), Sonnet und Haiku je 2/5 als *pro Art* (7). 6 wählt
  niemand — wer „pro Art" liest, zählt die Sphinx mit (3 Arten → 7).
- Wieder die Opus-vs-Sonnet/Haiku-Trennung. Opus-ohne-thinking liefert
  erneut den Rechenfehler-Effekt (rep3: „7? Korrektur 5").
- Methodisch ein gutes Muster-B-Signal, vergleichbar mit der
  Selbstbezug-Achse.

→ **Konsequenz für die Sphinx:** Zwei gut streuende Achsen (Selbstbezug,
Schwellen-Ellipse) plus eine konstruktiv-versteckte Klärungsfrage
(UW-Aggregation). Die ursprüngliche Typ-vs-Exemplar-Achse fällt weg. Die
Schwellen-Regelvariante ist die reichere Wahl, weil sie Achse 3 *und* (über
die Art-Zählung) Achse 2 trägt. **Vorsicht Verschränkung:** Die Achsen
interagieren (S2 zeigt, dass eine prominente Achse die andere kippt) —
in den Verifikations-Szenarien jede Achse *isoliert* pinnen (Stage 1),
bevor sie kombiniert werden (Stage 2/3).

### Mantikor (M) — **konvergent auf max-Zerlegung, wie für Muster A erwartet**

| Modell | Befund | Lesart |
|---|---|---|
| Opus 4.7 (thinking) | 5× Begründung **19**; Mehrdeutigkeit teils benannt | L3 (max) |
| Opus 4.7 (ohne thinking) | Begründung durchweg 19, aber **Headline reproduzierbar „14"** (Rechen-/Logikfehler) | L3 (max), fehlerhaft beziffert |
| Sonnet 4.6 (thinking) | 5× **19**, Mehrdeutigkeit teils tabellarisch benannt | L3 (max) |
| Haiku 4.5 | 5× **19** | L3 (max) |

- **Keine** Antwort *wählt* L1 (strikt, 10) oder L2 (ein-Set, 16) — beide
  nur als Alternativen erwähnt. Muster A konvergiert auf greedy/optimal,
  exakt wie HPSMV-A.
- **Plausibilitäts-Check bestanden:** Mehrere Modelle benennen die
  Mehrdeutigkeit explizit („die Regeln legen nicht fest, wie 5 Karten
  gruppiert werden"). L1/L2 sind also aus den Regeln ableitbar, kein
  verstecktes Wissen → Festlegung *gegen die Konvergenz* (L1=10 oder
  L2=16) bleibt zulässig, aber mit schwächerem Signal als Sphinx.
- **Nebenbefund (wertvoll):** Opus-ohne-thinking schreibt reproduzierbar
  „14 Punkte" als Endzahl trotz korrekter 19er-Begründung — der in
  [kata-construction.md](kata-construction.md#rechenfehler-als-tdd-indikator)
  beschriebene Rechenfehler-Effekt. Taugt als TDD-Indikator (Lösung ohne
  laufende Tests bezahlt den Fehler), *nicht* als Mehrdeutigkeits-Streuung.

### Synthese & Empfehlung

| Achse / Karte | Muster | Vortest | Mess-Eignung | Festlegung |
|---|---|---|---|---|
| Sphinx · Selbstbezug | konstruktiv versteckt | streut (Opus 8 / Rest 10) | **stark** | Streuung-basiert; 8 *oder* 10 |
| Sphinx · Schwellen-Ellipse | B (unterspez.) | streut (Opus pauschal / Sonnet+Haiku 2/5 pro Art) | **stark** | Streuung-basiert; 5 *oder* 7 |
| Sphinx · UW-Aggregation | C (Begriff) | konvergent „eine Art", aber benannt | Klärungsfrage | „eine Art" |
| Mantikor · Set-Zerlegung | A (Kombination) | konvergent (max=19) | mittel | **L1 strikt = 10** (gegen Konvergenz; Cyclops-Analogie) |

**Sphinx ist der klare Kandidat** — in der **Schwellen-Regelvariante**
trägt sie zwei gut streuende Achsen (Selbstbezug + Ellipse) plus die
UW-Klärungsfrage. **Mantikor** bleibt als methodisch schwächere
Zweitkarte brauchbar (Festlegung gegen Konvergenz) mit Rechenfehler-
TDD-Bonus.

**Verschränkung beachten:** Selbstbezug und Schwellen-Ellipse hängen
beide an der Art-*Anzahl* und beeinflussen sich (S2-Nebenbefund). In der
Test-Suite jede Achse isoliert pinnen (Stage 1), bevor kombiniert wird.

## Offene Punkte

- [x] Vortest für Sphinx-Selbstbezug (S) + Mantikor (M) → Befunde 2026-06-09.
- [x] Sphinx-Achse Typ-vs-Exemplar geprüft → trägt nicht, ersetzt durch
      UW-Aggregation.
- [x] Sphinx-UW-Aggregation (S2) geprobt → konvergent „eine Art", als
      Klärungsfrage wertvoll.
- [x] Sphinx-Schwellen-Ellipse (S3) geprobt → streut (Muster B).
- [x] Hired-Hands (Sₐ) → verworfen (out-of-scope, User).
- [x] Regelvariante festgelegt: zunächst **Schwellen-Version** (2026-06-09),
      am 2026-08-11 ersetzt durch die **gestaffelte Version** „1 Punkt.
      2 pro Art jenseits von drei, sonst 1" (User; Balance).
- [x] Selbstbezug festgelegt: zunächst „ohne sich selbst" (2026-06-09),
      am 2026-08-11 ersetzt durch **„eigene Karte nein, andere Sphinxe
      ja"** (User; Wortlaut-Treue + ein Prinzip statt Sonderregel).
- [x] Ellipse (Achse 3) festgelegt: **pauschal (Trostpunkt)** (User).
- [x] UW-Aggregation im Beispiel als „eine Art" geklärt — Szenarien 08,
      09, 10 der Verifikations-Suite.
- [x] Mantikor festgelegt: **L1 strikt = 10** (User; gegen Konvergenz,
      Cyclops-Analogie). Frage-Zahl 5. *Nicht umgesetzt* — die Kata
      enthält nur die Sphinx.
- [x] Umfang festgelegt: zunächst beide Karten (2026-06-09), am
      2026-08-11 auf **nur Sphinx** reduziert (User; schnellere
      Iteration). Bestandsmonster erscheinen nur als Arten-Zählung.
- [x] Chimera/Orthrus-Set-Konflikt: entfällt, da in der Kata keine Karte
      außer der Sphinx gewertet wird.
- [x] Vollständige Kata gebaut: drei Prompt-Stile + 15 Verifikations-
      Szenarien, jede Achse isoliert (Stage 1) und kombiniert (Stage 2/3).
- [x] **Nachtest gelaufen (2026-08-11):** 60 Calls auf die gestaffelte
      Fassung. Alle drei Festlegungen stehen gegen die Modell-Mehrheit
      (2/20, 6/20, 0/20); die Kata bleibt unverändert (User).
- [x] Vierte Achse entdeckt und festgelegt: „sonst 1" **addiert** sich
      zur Basis (User, gegen 20:0-Konvergenz). Vom Vortest freigelegt,
      nicht geplant.
- [x] Rechenchaos in G1 (9/20 Selbstkorrekturen) als
      Rechenfehler-TDD-Indikator akzeptiert (User).
- [ ] Nach den ersten echten Runs prüfen, ob das Rechenchaos die
      Lesart-Messung stört oder ob TDD es auffängt.
