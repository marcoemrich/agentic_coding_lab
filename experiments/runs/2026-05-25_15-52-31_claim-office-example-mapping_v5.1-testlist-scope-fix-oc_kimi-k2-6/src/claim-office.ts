const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUM_RATES: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const VALID_ITEM_TYPES = new Set(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

function calculateBasePremium(items: Item[]): number {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] || 0) + 1;
  }

  let base = 0;
  for (const [type, count] of Object.entries(counts)) {
    if (COMPONENT_TYPES.has(type) && count === 3) {
      base += 60;
    } else {
      base += (BASE_PREMIUM_RATES[type] || 0) * count;
    }
  }

  return base;
}

function calculateItemSurcharges(items: Item[]): number {
  let surcharge = 0;
  for (const item of items) {
    const itemBase = BASE_PREMIUM_RATES[item.type] || 0;
    if (item.cursed) {
      surcharge += itemBase * 0.5;
    }
    if (!COMPONENT_TYPES.has(item.type) && (item.enchantment ?? 0) >= 5) {
      surcharge += itemBase * 0.3;
    }
  }
  return surcharge;
}

function calculatePolicyModifiers(
  years: number,
  isFollowUp: boolean,
): number {
  let modifiers = 10; // first insurance surcharge
  if (years >= 2) {
    modifiers -= 20; // loyalty discount
  }
  if (isFollowUp) {
    modifiers -= 15; // follow-up contract discount
  }
  return modifiers;
}

function calculateInsuranceSum(items: Item[]): number {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] || 0) + 1;
  }
  let sum = 0;
  for (const [type, count] of Object.entries(counts)) {
    sum += (INSURANCE_VALUES[type] || 0) * count;
  }
  return sum;
}

function processClaim(
  policy: Policy,
  damages: Array<{ itemType: string; amount: number }>,
): { payout: number; remainingCap: number } {
  const policyItemCounts: Record<string, number> = {};
  for (const item of policy.items) {
    policyItemCounts[item.type] = (policyItemCounts[item.type] || 0) + 1;
  }

  const damageItemCounts: Record<string, number> = {};
  for (const damage of damages) {
    damageItemCounts[damage.itemType] = (damageItemCounts[damage.itemType] || 0) + 1;
  }

  for (const [type, count] of Object.entries(damageItemCounts)) {
    if (!VALID_ITEM_TYPES.has(type)) {
      throw new Error(`Unknown item type in damage: ${type}`);
    }
    if (count > (policyItemCounts[type] || 0)) {
      throw new Error(`More damages for ${type} than policy covers`);
    }
  }

  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error("Damage amount cannot be negative");
    }
  }

  let totalPayout = 0;
  for (const damage of damages) {
    const matchingItem = policy.items.find((i) => i.type === damage.itemType);
    let damageAmount = damage.amount;
    if (matchingItem && (matchingItem.enchantment ?? 0) >= 8) {
      damageAmount *= 0.5;
    }
    totalPayout += damageAmount - 100;
  }

  const payout = Math.min(Math.max(0, Math.floor(totalPayout)), policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
}

export function processScenario(input: unknown): unknown {
  const scenario = input as {
    customer: { yearsWithMHPCO: number };
    steps: Array<{
      op: string;
      items?: Item[];
      policy?: number;
      incident?: { cause: string; damages: Array<{ itemType: string; amount: number }> };
    }>;
  };

  const results: Array<{ premium: number } | { payout: number; remainingCap: number }> = [];
  const policies: Policy[] = [];

  for (const step of scenario.steps) {
    if (step.op === "quote" && step.items) {
      for (const item of step.items) {
        if (!VALID_ITEM_TYPES.has(item.type)) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }
      if (step.items.length === 0) {
        results.push({ premium: 5 });
        const insuranceSum = 0;
        policies.push({
          items: [],
          insuranceSum,
          cap: 0,
          remainingCap: 0,
        });
        continue;
      }
      const base = calculateBasePremium(step.items);
      const surcharges = calculateItemSurcharges(step.items);
      const isFollowUp = results.some((r) => "premium" in r);
      const modifiers = calculatePolicyModifiers(
        scenario.customer.yearsWithMHPCO,
        isFollowUp,
      );
      let premium = base + surcharges + modifiers + 5;
      results.push({ premium: Math.ceil(premium) });

      const insuranceSum = calculateInsuranceSum(step.items);
      policies.push({
        items: step.items,
        insuranceSum,
        cap: insuranceSum * 2,
        remainingCap: insuranceSum * 2,
      });
    } else if (step.op === "claim" && step.policy !== undefined && step.incident) {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error("Policy not found");
      }
      const result = processClaim(policy, step.incident.damages);
      results.push(result);
      policy.remainingCap = result.remainingCap;
    }
  }

  return { results };
}
