#!/usr/bin/env -S npx tsx
import { ClaimOffice } from "./claim-office.js";
import type { ClaimResult, Customer, Incident, Item } from "./claim-office.js";

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };
type StepResult = { premium: number } | ClaimResult;

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (input += chunk));
    process.stdin.on("end", () => resolve(input));
    process.stdin.on("error", reject);
  });
}

function runStep(office: ClaimOffice, step: Step): StepResult {
  if (step.op === "quote") {
    return { premium: office.quote(step.items) };
  }
  return office.claim(step.policy, step.incident);
}

function runScenario(scenario: Scenario): StepResult[] {
  const office = new ClaimOffice(scenario.customer);
  return scenario.steps.map((step) => runStep(office, step));
}

async function main(): Promise<void> {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  process.stdout.write(JSON.stringify({ results: runScenario(scenario) }));
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
