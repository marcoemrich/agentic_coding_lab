import process from "node:process";
import { executeScenario, type Scenario } from "./claim-office.js";

const chunks: Buffer[] = [];
for await (const chunk of process.stdin) {
  chunks.push(chunk);
}
const input = JSON.parse(Buffer.concat(chunks).toString("utf8")) as Scenario;
process.stdout.write(JSON.stringify(executeScenario(input)));
