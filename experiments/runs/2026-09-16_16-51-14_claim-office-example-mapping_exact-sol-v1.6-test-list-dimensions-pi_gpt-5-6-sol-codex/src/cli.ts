#!/usr/bin/env -S node --import tsx

import process from "node:process";
import { processScenario, type Scenario } from "./claim-office.js";

const input = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => (data += chunk));
  process.stdin.on("end", () => resolve(data));
});

const scenario = JSON.parse(input) as Scenario;
process.stdout.write(JSON.stringify(processScenario(scenario)));
