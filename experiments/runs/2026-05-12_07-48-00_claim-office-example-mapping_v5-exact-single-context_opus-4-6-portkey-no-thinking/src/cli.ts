import { readFileSync } from "fs";
import { processScenario } from "./claim-office.js";

const input = readFileSync(0, "utf-8");
const scenario = JSON.parse(input);
const result = processScenario(scenario);
process.stdout.write(JSON.stringify(result));
