import { quote, claim, type Item } from "./claim-office.js";

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { damages: { itemType: string; amount: number }[] };
};
type Step = QuoteStep | ClaimStep;

const chunks: Buffer[] = [];
process.stdin.on("data", (c) => chunks.push(c));
const KNOWN_TYPES = ["sword", "amulet", "staff", "potion", "rune", "moonstone"];
process.stdin.on("end", () => {
  const input = JSON.parse(Buffer.concat(chunks).toString("utf-8"));
  const customer = input.customer;
  const policies: Record<number, { items: Item[]; remainingCap: number | undefined }> = {};
  const results: unknown[] = [];
  for (let i = 0; i < (input.steps as Step[]).length; i++) {
    const step = (input.steps as Step[])[i];
    if (step.op === "quote") {
      const unknown = step.items.find((it) => !KNOWN_TYPES.includes(it.type));
      if (unknown) {
        process.stderr.write(`Unknown item type: ${unknown.type}\n`);
        process.exit(1);
      }
      policies[i] = { items: step.items, remainingCap: undefined };
      results.push({ premium: quote({ items: step.items, customer }) });
    } else {
      const policy = policies[step.policy];
      const policyTypes = policy.items.map((it) => it.type);
      const badDamage = step.incident.damages.find((d) => !policyTypes.includes(d.itemType));
      if (badDamage) {
        process.stderr.write(`Damage references item not in policy: ${badDamage.itemType}\n`);
        process.exit(1);
      }
      const negativeDamage = step.incident.damages.find((d) => d.amount < 0);
      if (negativeDamage) {
        process.stderr.write(`Damage amount must be non-negative: ${negativeDamage.amount}\n`);
        process.exit(1);
      }
      const itemCounts: Record<string, number> = {};
      for (const it of policy.items) itemCounts[it.type] = (itemCounts[it.type] ?? 0) + 1;
      const damageCounts: Record<string, number> = {};
      for (const d of step.incident.damages) damageCounts[d.itemType] = (damageCounts[d.itemType] ?? 0) + 1;
      for (const t of Object.keys(damageCounts)) {
        if (damageCounts[t] > (itemCounts[t] ?? 0)) {
          process.stderr.write(`Too many damage entries for type ${t}: ${damageCounts[t]} > ${itemCounts[t] ?? 0}\n`);
          process.exit(1);
        }
      }
      const out = claim({
        items: policy.items,
        damages: step.incident.damages,
        remainingCap: policy.remainingCap,
      });
      policy.remainingCap = out.remainingCap;
      results.push({ payout: out.payout, remainingCap: out.remainingCap });
    }
  }
  process.stdout.write(JSON.stringify({ results }));
});
