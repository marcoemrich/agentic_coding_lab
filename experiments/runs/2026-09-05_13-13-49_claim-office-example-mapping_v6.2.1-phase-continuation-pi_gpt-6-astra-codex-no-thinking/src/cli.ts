import { readFileSync } from "node:fs";
import { processScenario } from "./claim-office.js";
console.log(JSON.stringify(processScenario(JSON.parse(readFileSync(0, "utf8")))));
