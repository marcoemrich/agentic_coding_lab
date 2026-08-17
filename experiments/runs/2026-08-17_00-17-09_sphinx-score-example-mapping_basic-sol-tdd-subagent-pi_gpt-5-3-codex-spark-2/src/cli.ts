import { readFileSync } from "node:fs";
import { scoreSphinxes } from "./sphinx-score.js";

const input = readFileSync(0, "utf8");
const parsed = JSON.parse(input);
const score = scoreSphinxes(parsed.army || []);
process.stdout.write(JSON.stringify({ score }));
