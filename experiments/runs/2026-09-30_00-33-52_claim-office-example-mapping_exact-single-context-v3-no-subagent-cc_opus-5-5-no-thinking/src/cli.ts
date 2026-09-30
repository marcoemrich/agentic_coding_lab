import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

const STDIN = 0;

const scenario: Scenario = JSON.parse(readFileSync(STDIN, "utf8"));
process.stdout.write(JSON.stringify(runScenario(scenario)) + "\n");
