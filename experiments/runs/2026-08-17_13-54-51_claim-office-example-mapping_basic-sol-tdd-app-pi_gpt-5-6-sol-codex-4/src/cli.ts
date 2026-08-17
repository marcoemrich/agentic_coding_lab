import { readFileSync } from "node:fs";
import { processScenario, type Scenario } from "./claim-office.js";

const input = readFileSync(0, "utf8");
const scenario = JSON.parse(input) as Scenario;
const output = processScenario(scenario);
process.stdout.write(JSON.stringify(output));
