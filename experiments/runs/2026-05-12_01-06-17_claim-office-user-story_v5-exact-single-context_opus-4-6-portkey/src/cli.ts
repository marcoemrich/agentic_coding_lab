import { readFileSync } from "fs";
import { processScenario } from "./claim-office.js";

const scenario = JSON.parse(readFileSync(0, "utf-8"));
const result = processScenario(scenario);
process.stdout.write(JSON.stringify(result));
