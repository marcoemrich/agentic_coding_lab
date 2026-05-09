#!/usr/bin/env node

import { Scenario, Policy, Output, Result, QuoteResult, ClaimResult } from './types.js';
import { calculatePremium, calculateInsuranceSum } from './pricing.js';
import { processClaimForPolicy } from './claims.js';

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

async function main() {
  try {
    const input = await readStdin();
    const scenario: Scenario = JSON.parse(input);

    const results: Result[] = [];
    const policies: Policy[] = [];
    let quoteCount = 0;

    for (const step of scenario.steps) {
      if (step.op === 'quote') {
        const isFirstInsurance = quoteCount === 0;
        const premium = calculatePremium(step.items, scenario.customer, isFirstInsurance);
        const insuranceSum = calculateInsuranceSum(step.items);
        const totalPayoutCap = insuranceSum * 2;

        // Store policy for potential claims
        policies.push({
          items: step.items,
          insuranceSum: insuranceSum,
          totalPayoutCap: totalPayoutCap,
          usedPayout: 0,
        });

        results.push({ premium } as QuoteResult);
        quoteCount++;
      } else if (step.op === 'claim') {
        const policy = policies[step.policy];
        if (!policy) {
          throw new Error(`Policy ${step.policy} not found`);
        }

        const { payout, remainingCap } = processClaimForPolicy(policy, step.incident.damages);

        // Update used payout
        policy.usedPayout += payout;

        results.push({
          payout: payout,
          remainingCap: remainingCap,
        } as ClaimResult);
      }
    }

    const output: Output = { results };
    console.log(JSON.stringify(output));
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
