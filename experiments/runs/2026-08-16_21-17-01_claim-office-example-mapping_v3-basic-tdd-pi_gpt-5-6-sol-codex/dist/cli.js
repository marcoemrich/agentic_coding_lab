#!/usr/bin/env node
import { processScenario } from "./claim-office.js";
async function main() {
    try {
        const chunks = [];
        for await (const chunk of process.stdin)
            chunks.push(Buffer.from(chunk));
        const input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        process.stdout.write(`${JSON.stringify(processScenario(input))}\n`);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        process.stderr.write(`claim-office: ${message}\n`);
        process.exitCode = 1;
    }
}
void main();
