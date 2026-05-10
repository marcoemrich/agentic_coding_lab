import { runScenario } from "./claim-office.js";
import { readFileSync } from "node:fs";
const input = JSON.parse(readFileSync(0, "utf-8"));
process.stdout.write(JSON.stringify(runScenario(input)));
