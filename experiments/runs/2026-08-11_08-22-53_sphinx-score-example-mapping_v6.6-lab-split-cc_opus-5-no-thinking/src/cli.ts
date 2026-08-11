import { text } from "node:stream/consumers";
import { scoreArmy, type Card } from "./sphinx-score.js";

// The JSON document this CLI reads from stdin.
type ArmyDocument = {
  army: Card[];
};

const armyDocument = JSON.parse(await text(process.stdin)) as ArmyDocument;

process.stdout.write(JSON.stringify({ score: scoreArmy(armyDocument.army) }));
