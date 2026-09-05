import { readFileSync } from "node:fs";
import { processScenario } from "./claim-office.js";

const scenario = JSON.parse(readFileSync(0, "utf8"));
process.stdout.write(JSON.stringify(processScenario(scenario)) + "\n");
