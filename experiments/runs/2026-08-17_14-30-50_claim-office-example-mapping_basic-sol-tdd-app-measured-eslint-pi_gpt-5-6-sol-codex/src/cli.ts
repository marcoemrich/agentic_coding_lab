#!/usr/bin/env -S node --import tsx
import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
process.stdout.write(JSON.stringify(runScenario(scenario)));
