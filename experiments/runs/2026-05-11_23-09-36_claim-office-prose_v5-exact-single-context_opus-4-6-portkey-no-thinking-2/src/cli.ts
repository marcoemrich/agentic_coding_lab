import { processScenario } from "./claim-office.js";
import { readFileSync } from "fs";

const scenario = JSON.parse(readFileSync("/dev/stdin", "utf-8"));
const result = processScenario(scenario);
console.log(JSON.stringify(result));
