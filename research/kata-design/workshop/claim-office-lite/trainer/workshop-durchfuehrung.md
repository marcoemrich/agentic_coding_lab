# Workshop-Durchführung

Ein Vorschlag, wie sich die Kata im Workshop einsetzen lässt — einer von
mehreren. Die inhaltlichen Festlegungen, auf die sich der Ablauf
bezieht, stehen in [`trainer-notes.md`](trainer-notes.md).

## Empfohlener Ablauf (Halbtag, ca. 3 h)

1. **Setting vorlesen / verteilen** ([`prose.md`](../prose.md)) — ca. 10 min
2. **Example Mapping in Kleingruppen** — ca. 45 min
   - Story-Karte (gelb): "Police berechnen / Schaden regulieren"
   - Regel-Karten (blau): aus dem Setting extrahieren
   - Beispiel-Karten (grün): pro Regel mindestens ein Beispiel
   - Frage-Karten (rot): offene Punkte, die den PO/Trainer brauchen
3. **Plenum: Fragen beantworten** — Trainer als PO, beantwortet rote
   Karten gemäß den Festlegungen aus den Notizen — ca. 20 min
4. **Implementierung in Pair- oder Mob-Programming** — ca. 75 min
5. **Vergleich mit Verifikations-Szenarien** — Trainer demonstriert
   [`verifikation/szenarien/`](verifikation/szenarien/) als
   Akzeptanztests — ca. 20 min

Das [Ein- und Ausgabeformat](../ein-ausgabe-format.md) kommt
sinnvollerweise zu Schritt 4 dazu — oder schon zu Schritt 1, wenn die
Gruppe früh wissen will, worauf sie zusteuert.

## Tipps für den Trainer

- **Antworten erst auf rote Karten geben, wenn sie gestellt werden.**
  Wenn die Gruppe eine Mehrdeutigkeit nicht selbst entdeckt, ist das
  Teil der Erfahrung — der "PO" weist erst beim Implementieren auf
  Lücken hin.
- **In-Character bleiben.** Der Trainer ist nicht Trainer, sondern
  *der Sachverständige der Schadenskasse*. Bürokratisch, leicht passiv-
  aggressiv, mit Hinweisen auf "die Hausordnung".
- **Bei Konflikten zwischen Gruppen-Festlegung und Hausfestlegung:**
  flexibel sein. Wenn die Gruppe konsistent eine andere Lesart wählt
  und in sich schlüssig bleibt, ist das didaktisch wertvoll. Die
  Verifikations-Szenarien können dann als "die Filiale in der
  Hauptstadt rechnet so" präsentiert werden.
- **Numerik nicht überstrapazieren.** Bei Zeitdruck reicht es, wenn die
  Regeln *qualitativ* korrekt umgesetzt werden — die exakten Goldstücke
  kann der Trainer nachrechnen.
- **Keine Regeln erfinden.** Was nicht in `prose.md` steht, gibt es
  nicht. Eine im Plenum nachgeschobene Zusatzregel macht die Aufgabe
  für alle Gruppen ungleich schwerer.

## Häufige Stolpersteine

- **Versicherungswert ohne Verwendung:** Der Versicherungswert wird
  nirgends gebraucht. Teilnehmer suchen oft eine Regel dafür. Die
  Antwort steht in den Notizen unter "Keine Deckelung der Auszahlung".
- **Modifikator-Verrechnung:** zwischen additiv und multiplikativ wird
  oft hin- und hergeschwankt. Trainer kann mit Beispiel-Berechnung
  pinnen.
- **F'-Konflikt:** wird oft übersehen, dass beide Klauseln
  gleichzeitig greifen können. Hinweis-Beispiel "Drachenschwert mit
  Stufe 9" hilft.
- **"gleichartig":** Teilnehmer interpretieren manchmal als "gleiche
  Kategorie" (alle Komponenten gleichartig). Trainer pinnt Typ-genau.

## Verifikations-Szenarien als Trainings-Material

Die zehn Szenarien in [`verifikation/szenarien/`](verifikation/szenarien/)
lassen sich als **Akzeptanztests** vorzeigen, sobald die Gruppe ihre
eigenen Festlegungen getroffen hat (Aufrufbeispiele und
Erwartungstabelle: [`verifikation/README.md`](verifikation/README.md)):

- 01–07: pro Mehrdeutigkeit ein Test → für Diskussion einzelner
  Regel-Auflösungen
  - 01 Block genau drei, 02 kein Block bei vier, 03 "gleichartig"
    typ-genau, 04 SB pro Item, 05 50-%-Klausel, 06 Drachenmaterial,
    07 Klausel-Konflikt
- 08–10: kombinierte Tests → zeigen Wechselwirkungen
  - 08 Newcomer mit verfluchtem Item, 09 Folgevertrag, 10 mehrere
    Items desselben Typs

## Hinweise zur Tonalität

Die Schadenskasse ist als *bürokratisch-knausrige Versicherung*
konzipiert. Beim Antworten auf rote Karten:

- Festlegungen tendenziell zu Gunsten des Hauses (kleinere Sets, höhere
  Prämien, geringere Auszahlungen).
- Sprachlich neutral oder leicht beamtisch — keine emotionale
  Begründung, sondern "die Hausordnung sagt", "das ist seit 1612 so",
  "der Sachverständige hat entschieden".
- Bei Detail-Fragen *nicht* sofort die volle Antwort liefern — erst
  klären, ob die Gruppe selbst zu einer Lesart kommt. Erst wenn
  blockiert, mit der Festlegung antworten.
