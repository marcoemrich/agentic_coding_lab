import { quote, claim } from "./claim-office.js";

const run = (): void => {
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => { input += chunk; });
  process.stdin.on("end", () => {
    try {
      const scenario = JSON.parse(input);
      const customer = scenario.customer;
      const results: unknown[] = [];
      const policies: { items: unknown[]; remainingCap: number }[] = [];

      for (const step of scenario.steps) {
        if (step.op === "quote") {
          const premium = quote(customer, step.items);
          const insuranceValues: Record<string, number> = {
            sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250,
          };
          const insuranceSum = step.items.reduce(
            (sum: number, item: { type: string }) => sum + (insuranceValues[item.type] ?? 0), 0
          );
          policies.push({ items: step.items, remainingCap: insuranceSum * 2 });
          results.push({ premium });
        } else if (step.op === "claim") {
          const policy = policies[step.policy];
          const result = claim(customer, { item: step.incident.damages[0], remainingCap: policy.remainingCap }, step.incident);
          policy.remainingCap = result.remainingCap;
          results.push({ payout: result.payout, remainingCap: result.remainingCap });
        }
      }

      process.stdout.write(JSON.stringify({ results }) + "\n");
    } catch (err) {
      process.stderr.write((err instanceof Error ? err.message : String(err)) + "\n");
      process.exit(1);
    }
  });
};

run();
