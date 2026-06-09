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
| Sphinx | B + Selbstbezug + C | Selbstbezug · Schwellen-Ellipse · UW-Aggregation | 2 Achsen streuen, 1 konvergent | Single |
| Mantikor | A (Kombination) | Zerlegung bei Überzahl, zwei Set-Größen | konvergent (max) | Single |

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
3. **Schwellen-Ellipse (Muster B — unterspezifizierte Operation):** *Nur
   in der Schwellen-Regelvariante* (siehe unten). Die Regel "2 Punkte pro
   Art ab vier Arten, sonst 1 Punkt" lässt im zweiten Teil die Bezugsgröße
   weg — gilt "pro Art" weiter (1 Punkt *pro Art*) oder ist es ein
   absoluter Wert (1 Punkt *pauschal*)? Klassische Ellipse.

### Finale Regel — Schwellen-Variante (gewählt 2026-06-09, User)

Die Sphinx trägt die Schwellen-Regel (statt des flachen "2 Punkte pro
Art"), weil sie zusätzlich die Ellipse-Mehrdeutigkeit (Achse 3) erzeugt:

```
Sphinx:
- Eine Sphinx zählt 4 Punkte.
- Jede Sphinx erhält außerdem 2 Punkte pro Art von Monster ab vier
  Arten in deiner Armee, sonst 1 Punkt.
```

Diese Variante ist die reichere: sie trägt Achse 3 (Ellipse) *und* — über
die Art-Zählung in der Schwelle — weiterhin Achse 2 (Selbstbezug). Achse 1
(UW-Aggregation) läuft in jeder Variante mit.

**Festlegung Selbstbezug (User, 2026-06-09): Sphinx zählt sich selbst
nicht.** Begründung: (1) Spielbalance — zählte sie sich selbst, hätte
jede Sphinx einen garantierten +1-Art-Sockel, die Karte wäre zu leicht
wertvoll; "ohne sich selbst" macht sie von der echten Vielfalt der
*übrigen* Armee abhängig. (2) Mess-Vorteil — die Festlegung geht *gegen*
die Vortest-Konvergenz (Sonnet/Haiku/Opus-thinking tendierten zu "mit
selbst"), was das stärkere Example-Mapping-Signal gibt. **Diese
Festlegung steht nur im Beispiel, nicht im Regeltext** — sonst löst der
Regeltext die Mehrdeutigkeit auf (Wegweiser).

### Lesarten

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

### Festlegung (nach Vortest 2026-06-09)

Pro Achse getrennt, nach Vortest-Streuung:

| Achse | Vortest | Strategie | Festlegung |
|---|---|---|---|
| 2 Selbstbezug | **streut** (Opus-o-think 8 vs. Rest 10) | gegen Konvergenz (User-Entscheid) | **ohne sich selbst** (Spielbalance + Mess-Vorteil) |
| 3 Schwellen-Ellipse | **streut** (Opus pauschal vs. Sonnet/Haiku je 2/5 pro Art) | Streuung-basiert (User-Entscheid) | **pauschal (Trostpunkt, =5)** — klarer Schwellen-Sprung |
| 1 UW-Aggregation | konvergent auf "eine Art", aber explizit benannt | konstruktiv-versteckte Klärungsfrage | "eine Art" (mit der Konvergenz; Wert liegt in der Klärung) |

Achse 2 ist durch den User auf "ohne sich selbst" gepinnt (gegen die
Mehrheits-Konvergenz → starkes Signal, bleibt plausibel). Achse 3 auf
"pauschal" (Trostpunkt) gepinnt — der klarere Schwellen-Sprung. Achse 1 =
"eine Art" (rulebook-konsistent).

**Finale Sphinx-Wertung (alle drei Achsen gepinnt):**

> Eine Sphinx zählt 4 Punkte. Enthält die Armee mindestens vier *andere*
> Monster-Arten, erhält die Sphinx zusätzlich 2 Punkte pro anderer Art;
> sonst genau 1 Punkt. (Kartenvarianten desselben Monster-Namens — z.B.
> die drei Untoten Krieger — zählen als *eine* Art.)

Beispiel-Werte: 2 andere Arten → 4+1 = **5**; 3 andere → **5**; 4 andere →
4 + 4×2 = **12**; 5 andere → **14**. Der Regeltext im Prompt bleibt
*neutral* (kein "andere", kein "pauschal") — die drei Festlegungen werden
nur über Example-Mapping-Beispiele kommuniziert.

**Wert-Verschiebung durch "ohne sich selbst":** Mit der Selbstbezug-
Festlegung ändern sich die Ellipse-Werte für Eingabe C (1 Sphinx, 1
Zombie, 1 Hydra → 2 *andere* Arten): pauschal = `4+1 =` **5**, pro Art =
`4 + 2×1 =` **6** (die im Vortest beobachtete 7 entfiel die Sphinx-
Selbstzählung). Analog braucht die 2-Punkte-Schwelle nun *vier andere*
Arten, nicht drei plus Sphinx.

### API-Schema

Neutral: alle Lesarten brauchen nur die vollständige Karten-Liste der
Armee. Das Schema entscheidet keine Lesart vor (kein Feld "distinctTypes"
o. ä.).

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
- [x] Regelvariante festgelegt: **Schwellen-Version** „2 pro Art ab vier,
      sonst 1" (User, 2026-06-09).
- [x] Selbstbezug festgelegt: **ohne sich selbst** (User; Spielbalance +
      gegen-Konvergenz-Mess-Vorteil).
- [x] Ellipse (Achse 3) festgelegt: **pauschal (Trostpunkt, =5)** (User).
- [ ] UW-Aggregation im Beispiel als „eine Art" klären (Stage-1-Szenario).
- [x] Mantikor festgelegt: **L1 strikt = 10** (User; gegen Konvergenz,
      Cyclops-Analogie). Frage-Zahl 5.
- [x] Umfang festgelegt: **beide Karten** (Sphinx + Mantikor) in die Kata.
- [ ] Falls Chimera/Orthrus auch in der Kata: Set-Auflösung mit Mantikor
      (strikt) vereinheitlichen oder Abweichung begründen.
- [ ] Falls vollständige Kata: drei Prompt-Stile + Verifikations-Szenarien
      (jede Achse isoliert in Stage 1, siehe Verschränkungs-Hinweis).
