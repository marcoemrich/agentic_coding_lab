export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Step {
  op: "quote" | "claim";
  items?: Item[];
  policy?: number;
  incident?: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

const ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const ITEM_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

interface CreatedPolicy {
  items: Item[];
  cap: number;
}

export function runScenario(scenario: Scenario): { results: any[] } {
  const results: any[] = [];
  let quoteCount = 0;
  const policies: CreatedPolicy[] = [];

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      results.push(processQuote(step, scenario.customer, ++quoteCount, policies));
    } else if (step.op === "claim") {
      results.push(processClaim(step, policies));
    }
  }
  return { results };
}

function processQuote(
  step: Step,
  customer: { yearsWithMHPCO: number },
  quoteNumber: number,
  policies: CreatedPolicy[]
): { premium: number } {
  if (!step.items || step.items.length === 0) {
    policies.push({ items: [], cap: 0 });
    return { premium: 5 };
  }

  let basePremium = 0;
  let itemSurcharges = 0;
  let insuranceSum = 0;
  const components: Record<string, number> = {};

  for (const item of step.items) {
    if (ITEM_VALUES[item.type] === undefined) {
      throw new Error(`Unknown item type: ${item.type}`);
    }

    insuranceSum += ITEM_VALUES[item.type];

    if (item.type === "rune" || item.type === "moonstone") {
      components[item.type] = (components[item.type] || 0) + 1;
    } else {
      const itemBase = ITEM_BASE_PREMIUMS[item.type] || 0;
      basePremium += itemBase;
      if (item.cursed) {
        itemSurcharges += itemBase * 0.5;
      }
      if (item.enchantment !== undefined && item.enchantment >= 5) {
        itemSurcharges += itemBase * 0.3;
      }
    }
  }

  // Calculate components base premium with blocks of 3 alike components
  for (const [type, count] of Object.entries(components)) {
    if (count === 3) {
      basePremium += 60;
    } else {
      basePremium += count * 25;
    }
  }

  // Policy-wide modifiers
  let policyModifiers = 0;
  if (customer.yearsWithMHPCO >= 2) {
    policyModifiers -= basePremium * 0.2;
  }
  policyModifiers += basePremium * 0.1;
  if (quoteNumber > 1) {
    policyModifiers -= basePremium * 0.15;
  }

  const premium = Math.ceil(basePremium + itemSurcharges + policyModifiers) + 5;

  policies.push({
    items: step.items,
    cap: insuranceSum * 2
  });

  return { premium };
}

function processClaim(step: Step, policies: CreatedPolicy[]): { payout: number; remainingCap: number } {
  const policyIndex = step.policy ?? 0;
  const policy = policies[policyIndex];
  if (!policy) {
    throw new Error(`Policy at index ${policyIndex} not found`);
  }

  if (!step.incident || !step.incident.damages) {
    return { payout: 0, remainingCap: policy.cap };
  }

  const damageCounts: Record<string, number> = {};
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
    if (ITEM_VALUES[damage.itemType] === undefined) {
      throw new Error(`Unknown item type in damages: ${damage.itemType}`);
    }
    const matchedItem = policy.items.find(item => item.type === damage.itemType);
    if (!matchedItem) {
      throw new Error(`Damage references an item type not covered by the policy: ${damage.itemType}`);
    }
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] || 0) + 1;
  }

  const policyCounts: Record<string, number> = {};
  for (const item of policy.items) {
    policyCounts[item.type] = (policyCounts[item.type] || 0) + 1;
  }

  for (const [itemType, count] of Object.entries(damageCounts)) {
    const policyCount = policyCounts[itemType] || 0;
    if (count > policyCount) {
      throw new Error(`Damages contain more entries of ${itemType} than the policy covers`);
    }
  }

  let totalPayout = 0;
  for (const damage of step.incident.damages) {
    const matchedItem = policy.items.find(item => item.type === damage.itemType);
    let rate = 1.0;
    if (matchedItem) {
      if (matchedItem.enchantment !== undefined && matchedItem.enchantment >= 8) {
        rate = 0.5;
      }
    }

    const payoutRaw = damage.amount * rate;
    const payout = Math.max(0, payoutRaw - 100);
    totalPayout += payout;
  }

  const roundedPayout = Math.floor(totalPayout);
  if (roundedPayout > policy.cap) {
    const actualPayout = policy.cap;
    policy.cap = 0;
    return { payout: actualPayout, remainingCap: 0 };
  } else {
    policy.cap -= roundedPayout;
    return { payout: roundedPayout, remainingCap: policy.cap };
  }
}
