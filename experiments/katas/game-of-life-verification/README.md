# Verification suite for game-of-life (Library-Form)

Externe Akzeptanz-Suite für die Library-Kata `game-of-life-{prose,user-story,example-mapping}`.

`adapter.ts` und `scenarios/` sind Symlinks auf das Schwester-Verzeichnis `game-of-life-cli-verification/` — die 15 Szenarien und der module-import-Adapter sind identisch. Unterschied zur CLI-Variante: hier wird kein `src/cli.ts` erwartet, der Adapter importiert die `evolve`/`nextGeneration`-Funktion direkt aus `src/game-of-life.{ts,…}` und ruft sie pro Szenario `steps` mal auf.

So bleibt die Außen-Korrektheit (`verification_pct`) auf der Library-Kata messbar, ohne den CLI-Overhead in die Code-Qualitäts-Metriken zu mischen.
