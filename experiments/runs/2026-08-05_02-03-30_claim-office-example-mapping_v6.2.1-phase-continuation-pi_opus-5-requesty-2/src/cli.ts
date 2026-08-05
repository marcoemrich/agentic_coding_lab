#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

const STDIN_FILE_DESCRIPTOR = 0;

const readStdin = (): string => readFileSync(STDIN_FILE_DESCRIPTOR, "utf8");

const scenario = JSON.parse(readStdin()) as Scenario;
process.stdout.write(JSON.stringify(runScenario(scenario)));
