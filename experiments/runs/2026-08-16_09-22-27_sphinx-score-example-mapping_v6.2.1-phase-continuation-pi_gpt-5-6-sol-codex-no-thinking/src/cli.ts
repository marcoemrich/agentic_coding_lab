import { readFileSync } from "node:fs";
import { type Card, scoreSphinxes } from "./sphinx-score.js";

const { army } = JSON.parse(readFileSync(0, "utf8")) as { army: Card[] };
process.stdout.write(JSON.stringify({ score: scoreSphinxes(army) }));
