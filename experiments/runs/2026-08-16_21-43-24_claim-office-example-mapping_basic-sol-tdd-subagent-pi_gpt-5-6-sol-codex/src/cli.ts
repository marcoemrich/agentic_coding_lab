import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
const result = runScenario(scenario);
process.stdout.write(JSON.stringify(result));
