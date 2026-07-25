#!/usr/bin/env node

import { calculateQuote, processClaim } from "./claim-office.js";

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type Customer = {
  yearsWithMHPCO: number;
};

type QuoteStep = {
  op: "quote";
  items: Item[];
};

type Damage = {
  itemType: string;
  amount: number;
};

type Incident = {
  cause: string;
  damages: Damage[];
};

type ClaimStep = {
  op: "claim";
  policy: number;
  incident: Incident;
};

type Step = QuoteStep | ClaimStep;

type Input = {
  customer: Customer;
  steps: Step[];
};

type QuoteResult = {
  premium: number;
};

type ClaimResult = {
  payout: number;
  remainingCap: number;
};

type Result = QuoteResult | ClaimResult;

type Output = {
  results: Result[];
};

function main() {
  let input = '';
  process.stdin.on('data', chunk => {
    input += chunk;
  });

  process.stdin.on('end', () => {
    try {
      const parsedInput: Input = JSON.parse(input);
      const output: Output = { results: [] };

      // Process each step
      for (const step of parsedInput.steps) {
        if (step.op === "quote") {
          const premium = calculateQuote(parsedInput.customer, step.items, output.results.filter(r => 'premium' in r).length);
          output.results.push({ premium });
        } else if (step.op === "claim") {
          // For now, we'll just return a placeholder
          output.results.push({ payout: 0, remainingCap: 0 });
        }
      }

      process.stdout.write(JSON.stringify(output) + '\n');
    } catch (error) {
      process.stderr.write(`Error: ${error.message}\n`);
      process.exit(1);
    }
  });
}

main();
