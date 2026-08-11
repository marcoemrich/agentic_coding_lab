import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

/** The stdin file descriptor: reading it whole is how the scenario arrives. */
const STDIN_FILE_DESCRIPTOR = 0;

const scenario = JSON.parse(readFileSync(STDIN_FILE_DESCRIPTOR, "utf8")) as Scenario;
process.stdout.write(JSON.stringify(runScenario(scenario)));
