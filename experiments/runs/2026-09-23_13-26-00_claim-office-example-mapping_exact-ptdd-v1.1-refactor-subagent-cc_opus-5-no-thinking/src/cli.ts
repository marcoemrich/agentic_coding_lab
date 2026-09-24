#!/usr/bin/env node
import { runScenario, type Scenario } from "./claim-office.js";

// The claim-office CLI translates between the MHPCO's JSON documents and its
// domain operations: a scenario arrives on stdin and its results leave on
// stdout. A rejected scenario is reported on stderr with a non-zero exit code.
function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let document = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk: string) => (document += chunk));
    process.stdin.on("end", () => {
      resolve(document);
    });
    process.stdin.on("error", reject);
  });
}

// The scenario document is taken on trust: the MHPCO's clerks are assumed to
// file a document matching the published schema. This adapter checks only that
// the text is JSON at all -- a document that parses but carries the wrong shape
// is passed to the domain as-is, and whatever it throws is reported as the
// rejection. Specifying schema validation would be new behavior, not a
// translation this adapter is asked to perform.
function assumeScenario(document: string): Scenario {
  return JSON.parse(document) as Scenario;
}

async function main(): Promise<void> {
  const scenario = assumeScenario(await readStdin());
  process.stdout.write(JSON.stringify(runScenario(scenario)));
}

main().catch((reason: unknown) => {
  process.stderr.write(`${reason instanceof Error ? reason.message : String(reason)}\n`);
  process.exitCode = 1;
});
