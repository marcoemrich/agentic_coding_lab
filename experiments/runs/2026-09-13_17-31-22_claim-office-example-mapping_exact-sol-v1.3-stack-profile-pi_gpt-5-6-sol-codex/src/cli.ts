import { readFileSync } from "node:fs";
import { executeScenario, type Scenario } from "./claim-office.js";

const input = readFileSync(0, "utf8");
const scenario = JSON.parse(input) as Scenario;
process.stdout.write(JSON.stringify(executeScenario(scenario)));
