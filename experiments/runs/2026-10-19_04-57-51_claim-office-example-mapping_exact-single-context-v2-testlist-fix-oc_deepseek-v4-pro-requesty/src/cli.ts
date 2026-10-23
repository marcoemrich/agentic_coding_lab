export function runClaimOffice(input: string): { results: unknown[] } {
  const scenario = JSON.parse(input);
  const customer = scenario.customer;
  const results: unknown[] = [];
  const policies = new Map<number, { sum: number; cap: number; items: any[] }>();
  let quoteCount = 0;
  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      quoteCount += 1;
      validateItems(step.items);
      const premium = quotePremium(step.items, customer, quoteCount);
      const sum = insuranceSum(step.items);
      policies.set(i, { sum, cap: sum * 2, items: step.items });
      results.push({ premium });
    } else {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`unknown policy: ${step.policy}`);
      }
      validateClaim(step.incident, policy);
      const payout = claimPayout(step.incident, policy);
      policy.cap -= payout;
      results.push({ payout, remainingCap: policy.cap });
    }
  }
  return { results };
}

const INSURANCE_VALUE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400 };

function validateItems(items: { type: string }[]): void {
  for (const item of items) {
    if (!(item.type in INSURANCE_VALUE) && !COMPONENT_TYPES.has(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
}

function validateClaim(incident: { damages: { itemType: string; amount: number }[] }, policy: { items: any[] }): void {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
    const covered = policy.items.filter((p) => p.type === damage.itemType).length;
    const requested = incident.damages.filter((d) => d.itemType === damage.itemType).length;
    if (covered === 0) {
      throw new Error(`item not in policy: ${damage.itemType}`);
    }
    if (requested > covered) {
      throw new Error(`more damages than covered: ${damage.itemType}`);
    }
  }
}

function insuranceSum(items: { type: string }[]): number {
  let total = 0;
  for (const item of items) {
    total += INSURANCE_VALUE[item.type] ?? 250;
  }
  return total;
}

function claimPayout(incident: { damages: { itemType: string; amount: number }[] }, policy: { sum: number; cap: number; items: any[] }): number {
  let payout = 0;
  for (const damage of incident.damages) {
    const item = policy.items.find((p) => p.type === damage.itemType);
    const reimbursement = damageReimbursement(item, damage.amount);
    payout += Math.max(0, reimbursement - 100);
  }
  return Math.min(Math.floor(payout), policy.cap);
}

function damageReimbursement(item: { enchantment?: number; material?: string }, amount: number): number {
  if ((item.enchantment ?? 0) >= 8) {
    return amount * 0.5;
  }
  return amount;
}

function quotePremium(items: { type: string; cursed?: boolean; enchantment?: number }[], customer: { yearsWithMHPCO: number }, quoteCount: number): number {
  if (items.length === 0) {
    return 5;
  }
  const policyBase = policyBasePremium(items);
  const itemModifiers = itemModifierSum(items);
  const firstInsurance = policyBase * 0.1;
  const loyalty = customer.yearsWithMHPCO >= 2 ? -policyBase * 0.2 : 0;
  const followUp = quoteCount > 1 ? -policyBase * 0.15 : 0;
  const total = policyBase + itemModifiers + firstInsurance + loyalty + followUp + 5;
  return Math.ceil(total);
}

const MAIN_BASE: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40 };
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function policyBasePremium(items: { type: string; cursed?: boolean }[]): number {
  const componentCounts = new Map<string, number>();
  let total = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += MAIN_BASE[item.type];
    }
  }
  for (const count of componentCounts.values()) {
    total += count === 3 ? 60 : count * 25;
  }
  return total;
}

function itemModifierSum(items: { type: string; cursed?: boolean; enchantment?: number }[]): number {
  let total = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      continue;
    }
    if (item.cursed) {
      total += MAIN_BASE[item.type] * 0.5;
    }
    if ((item.enchantment ?? 0) >= 5) {
      total += MAIN_BASE[item.type] * 0.3;
    }
  }
  return total;
}

export function main(): void {
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk: string) => {
    input += chunk;
  });
  process.stdin.on("end", () => {
    try {
      const result = runClaimOffice(input);
      process.stdout.write(JSON.stringify(result));
    } catch (error) {
      process.stderr.write(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
  });
}

if (process.argv[1] && import.meta.url.endsWith("cli.ts")) {
  main();
}