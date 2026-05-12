import { quotePremium, processClaim } from "./mhpco.js";

interface Scenario {
  customer: {
    yearsWithMHPCO: number;
  };
  steps: Array<{
    op: "quote" | "claim";
    items?: Array<{
      type: string;
      material: string;
      enchantment: number;
      cursed: boolean;
      insuranceValue?: number;
    }>;
    policy?: number;
    incident?: {
      cause: string;
      damages: Array<{
        itemType: string;
        amount: number;
        material?: string;
        enchantment?: number;
      }>;
    };
  }>;
}

interface Result {
  premium?: number;
  payout?: number;
  remainingCap?: number;
}

async function main() {
  let input = "";

  // Read from stdin
  process.stdin.setEncoding("utf-8");
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  try {
    const scenario: Scenario = JSON.parse(input);
    const results: Result[] = [];
    const policies: any[] = [];

    for (const step of scenario.steps) {
      if (step.op === "quote") {
        const premium = quotePremium(scenario.customer, step.items || [], true);
        results.push({ premium });
        policies.push({ items: step.items });
      } else if (step.op === "claim") {
        const policyIndex = step.policy ?? 0;
        const policy = policies[policyIndex];
        const result = processClaim(scenario.customer, policy, step.incident);
        results.push({
          payout: result.payout,
          remainingCap: result.remainingCap
        });
      }
    }

    const output = { results };
    console.log(JSON.stringify(output));
  } catch (error) {
    console.error("Error processing scenario:", error);
    process.exit(1);
  }
}

main();
