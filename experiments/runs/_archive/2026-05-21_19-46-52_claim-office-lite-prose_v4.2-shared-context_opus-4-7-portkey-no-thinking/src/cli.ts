// CLI entry point — reads scenario JSON from stdin, writes results JSON to stdout.
import { runScenario } from "./claim-office.js";

const chunks: string[] = [];
process.stdin.setEncoding("utf-8");
for await (const chunk of process.stdin) chunks.push(chunk as string);
process.stdout.write(JSON.stringify(runScenario(JSON.parse(chunks.join("")))));
