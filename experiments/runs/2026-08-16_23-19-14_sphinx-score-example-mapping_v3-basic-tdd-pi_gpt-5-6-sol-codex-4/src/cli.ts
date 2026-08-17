#!/usr/bin/env node
import { readFileSync } from "node:fs";

import { scoreSphinx, type Card } from "./sphinx-score.js";

interface ArmyDocument {
  army: Card[];
}

const input = JSON.parse(readFileSync(0, "utf8")) as ArmyDocument;
process.stdout.write(`${JSON.stringify({ score: scoreSphinx(input.army) })}\n`);
