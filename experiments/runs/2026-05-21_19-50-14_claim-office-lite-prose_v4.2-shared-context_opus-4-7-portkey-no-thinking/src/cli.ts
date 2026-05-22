import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

process.stdout.write(
  JSON.stringify(runScenario(JSON.parse(readFileSync(0, "utf8")))),
);
