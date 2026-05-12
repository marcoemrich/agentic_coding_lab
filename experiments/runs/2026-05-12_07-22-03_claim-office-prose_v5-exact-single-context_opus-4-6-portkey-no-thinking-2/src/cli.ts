import { processScenario } from "./claim-office.js";
import { readFileSync } from "fs";

const input = readFileSync(0, "utf-8");
const result = processScenario(JSON.parse(input));
process.stdout.write(JSON.stringify(result));
