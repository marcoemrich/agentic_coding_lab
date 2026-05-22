import { quote, claim } from "./claim-office.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main() {
  const input = await readStdin();
  const scenario = JSON.parse(input);
  const yearsWithMHPCO = scenario.customer.yearsWithMHPCO;
  const results: Array<Record<string, number>> = [];
  const quoteItemsByStep: Record<number, Array<{ type: string; material?: string; enchantment?: number; cursed?: boolean }>> = {};
  const priorPaidByPolicy: Record<number, number> = {};
  let quoteCounter = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      const result = quote({
        customer: { yearsInsured: yearsWithMHPCO, previousContracts: quoteCounter },
        items: step.items,
      });
      quoteItemsByStep[i] = step.items;
      quoteCounter++;
      results.push({ premium: result.premium });
    } else if (step.op === "claim") {
      const policyItems = quoteItemsByStep[step.policy];
      const priorPaid = priorPaidByPolicy[step.policy] ?? 0;
      const result = claim({
        items: policyItems,
        damages: step.incident.damages,
        priorPaid,
      });
      priorPaidByPolicy[step.policy] = priorPaid + result.payout;
      results.push({ payout: result.payout, remainingCap: result.remainingCap });
    }
  }

  process.stdout.write(JSON.stringify({ results }));
}

main().catch((err) => {
  process.stderr.write(String(err.message ?? err) + "\n");
  process.exit(1);
});
