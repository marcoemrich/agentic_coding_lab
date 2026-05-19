import { processScenario } from "./claim-office.js";
import { readFileSync } from "fs";

const input = readFileSync("/dev/stdin", "utf-8");
const scenario = JSON.parse(input);
const result = processScenario(scenario);
process.stdout.write(JSON.stringify(result) + "\n");
