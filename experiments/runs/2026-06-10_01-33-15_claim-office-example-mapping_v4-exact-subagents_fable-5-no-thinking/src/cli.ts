import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

const STDIN_FILE_DESCRIPTOR = 0;

const scenario = JSON.parse(readFileSync(STDIN_FILE_DESCRIPTOR, "utf8"));
process.stdout.write(JSON.stringify(runScenario(scenario)));
