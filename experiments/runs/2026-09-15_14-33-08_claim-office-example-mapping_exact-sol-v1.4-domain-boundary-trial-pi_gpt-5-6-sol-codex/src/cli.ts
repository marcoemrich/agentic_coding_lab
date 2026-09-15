import { runScenario, type Scenario } from "./claim-office.js";

const chunks: Buffer[] = [];
for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
const scenario = JSON.parse(Buffer.concat(chunks).toString("utf8")) as Scenario;
process.stdout.write(JSON.stringify(runScenario(scenario)));
