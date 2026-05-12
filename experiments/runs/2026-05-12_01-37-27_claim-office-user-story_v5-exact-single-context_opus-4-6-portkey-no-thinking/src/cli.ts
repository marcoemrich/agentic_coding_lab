import { readFileSync } from "fs";
import { processScenario } from "./claim-office.js";

const scenario = JSON.parse(readFileSync("/dev/stdin", "utf-8"));
const result = processScenario(scenario);
console.log(JSON.stringify(result));
