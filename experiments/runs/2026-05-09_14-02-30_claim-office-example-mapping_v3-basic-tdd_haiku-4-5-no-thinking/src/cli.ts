#!/usr/bin/env node

import { stdin as input, stdout as output, stderr } from "process";
import type {
  ScenarioInput,
  ScenarioOutput,
  QuoteResult,
  ClaimResult,
  PolicyData,
} from "./types";
import { calculatePremium, calculateInsuranceSum } from "./pricing";
import { processClaim } from "./claims";

interface PolicyStore {
  [key: number]: PolicyData;
}

async function readInput(): Promise<ScenarioInput> {
  return new Promise((resolve, reject) => {
    let data = "";
    input.setEncoding("utf8");
    input.on("data", (chunk) => {
      data += chunk;
    });
    input.on("end", () => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
    input.on("error", reject);
  });
}

function writeOutput(result: ScenarioOutput): void {
  output.write(JSON.stringify(result));
}

function isQuoteResult(result: unknown): result is QuoteResult {
  return typeof result === "object" && result !== null && "premium" in result;
}

function isClaimResult(result: unknown): result is ClaimResult {
  return (
    typeof result === "object" &&
    result !== null &&
    "payout" in result &&
    "remainingCap" in result
  );
}

async function main(): Promise<void> {
  try {
    const input = await readInput();
    const results: Array<QuoteResult | ClaimResult> = [];
    const policies: PolicyStore = {};

    for (let stepIndex = 0; stepIndex < input.steps.length; stepIndex++) {
      const step = input.steps[stepIndex];

      if (step.op === "quote") {
        try {
          const premium = calculatePremium(
            step.items,
            input.customer.yearsWithMHPCO,
            stepIndex === 0, // First insurance for new customers or new items
            stepIndex > 0 // Follow-up contract if not the first step
          );

          const insuranceSum = calculateInsuranceSum(step.items);
          const cap = insuranceSum * 2;

          policies[stepIndex] = {
            items: step.items,
            insuranceSum,
            cap,
            payout: 0,
          };

          results.push({ premium });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          stderr.write(`Error processing quote: ${message}\n`);
          process.exit(1);
        }
      } else if (step.op === "claim") {
        try {
          const policyIndex = step.policy;
          if (!(policyIndex in policies)) {
            throw new Error(`Policy ${policyIndex} not found`);
          }

          const policy = policies[policyIndex];
          const currentCapRemaining = policy.cap - policy.payout;
          const { payout, remainingCap } = processClaim(
            policy.items,
            step.incident,
            currentCapRemaining
          );

          policy.payout += payout;

          results.push({ payout, remainingCap });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          stderr.write(`Error processing claim: ${message}\n`);
          process.exit(1);
        }
      }
    }

    writeOutput({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    stderr.write(`Error: ${message}\n`);
    process.exit(1);
  }
}

main();
