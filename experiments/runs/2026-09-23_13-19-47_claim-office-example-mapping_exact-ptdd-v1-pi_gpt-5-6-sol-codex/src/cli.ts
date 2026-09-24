import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";
import type { Scenario } from "./claim-office.js";

const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
process.stdout.write(JSON.stringify(runScenario(scenario)));
