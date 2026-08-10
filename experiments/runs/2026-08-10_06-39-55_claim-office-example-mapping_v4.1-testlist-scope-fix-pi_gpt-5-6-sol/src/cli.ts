import { readFileSync } from "node:fs";
import { processScenario } from "./claim-office.js";

const input = readFileSync(0, "utf8");
const scenario: unknown = JSON.parse(input);

process.stdout.write(`${JSON.stringify(processScenario(scenario as Parameters<typeof processScenario>[0]))}\n`);
