import { readFileSync } from "node:fs";
import { processScenario } from "./claim-office.js";

const scenario = JSON.parse(readFileSync(0, "utf-8"));
const results = processScenario(scenario);
process.stdout.write(JSON.stringify({ results }));
