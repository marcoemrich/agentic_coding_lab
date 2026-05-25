interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

function getBasePremium(itemType: string): number {
  switch (itemType) {
    case "sword": return 100;
    case "amulet": return 60;
    case "staff": return 80;
    case "potion": return 40;
    default: return 25;
  }
}

function getInsuranceValue(itemType: string): number {
  switch (itemType) {
    case "sword": return 1000;
    case "amulet": return 600;
    case "staff": return 800;
    case "potion": return 400;
    default: return 250;
  }
}

function calculateBasePremium(items: Item[]): number {
  const mainItems = items.filter((item) =>
    ["sword", "amulet", "staff", "potion"].includes(item.type)
  );
  const components = items.filter((item) =>
    !["sword", "amulet", "staff", "potion"].includes(item.type)
  );

  let total = mainItems.reduce((sum, item) => sum + getBasePremium(item.type), 0);

  const componentGroups = new Map<string, number>();
  for (const comp of components) {
    componentGroups.set(comp.type, (componentGroups.get(comp.type) || 0) + 1);
  }

  for (const [type, count] of componentGroups) {
    if (count === 3) {
      total += 60;
    } else {
      total += count * 25;
    }
  }

  return total;
}

function isMainItem(itemType: string): boolean {
  return ["sword", "amulet", "staff", "potion"].includes(itemType);
}

function calculateItemModifiers(items: Item[]): number {
  let modifierSum = 0;
  for (const item of items) {
    if (!isMainItem(item.type)) continue;
    const base = getBasePremium(item.type);
    if (item.cursed) {
      modifierSum += base * 0.5;
    }
    if (item.enchantment !== undefined && item.enchantment >= 5) {
      modifierSum += base * 0.3;
    }
  }
  return modifierSum;
}

function calculatePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const policyBasePremium = calculateBasePremium(items);
  const itemModifierSum = calculateItemModifiers(items);
  let premiumBeforeFee = policyBasePremium + itemModifierSum;
  const firstInsuranceSurcharge = policyBasePremium * 0.1;
  premiumBeforeFee += firstInsuranceSurcharge;
  if (yearsWithMHPCO >= 2) {
    premiumBeforeFee -= policyBasePremium * 0.2;
  }
  if (isFollowUp) {
    premiumBeforeFee -= policyBasePremium * 0.15;
  }
  return Math.ceil(premiumBeforeFee + 5);
}

function processClaim(
  policy: { items: Item[]; cap: number; usedCap: number },
  damages: Damage[]
): { payout: number; remainingCap: number } {
  let totalPayout = 0;

  const damageCounts = new Map<string, number>();
  for (const damage of damages) {
    damageCounts.set(damage.itemType, (damageCounts.get(damage.itemType) || 0) + 1);
  }

  const policyCounts = new Map<string, number>();
  for (const item of policy.items) {
    policyCounts.set(item.type, (policyCounts.get(item.type) || 0) + 1);
  }

  for (const [itemType, count] of damageCounts) {
    const policyCount = policyCounts.get(itemType) || 0;
    if (count > policyCount) {
      throw new Error(`More damage entries for ${itemType} than policy covers`);
    }
  }

  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error("Damage amount cannot be negative");
    }
    if (!VALID_ITEM_TYPES.includes(damage.itemType)) {
      throw new Error(`Unknown item type: ${damage.itemType}`);
    }
    const item = policy.items.find((i) => i.type === damage.itemType);
    if (!item) {
      throw new Error(`Item ${damage.itemType} not found in policy`);
    }

    let damageAmount = damage.amount;

    if (item.enchantment !== undefined && item.enchantment >= 8) {
      damageAmount *= 0.5;
    } else if (item.material === "dragon") {
      // full reimbursement - no reduction
    }

    damageAmount -= 100;
    if (damageAmount < 0) damageAmount = 0;

    totalPayout += damageAmount;
  }

  const remainingCap = policy.cap - policy.usedCap;
  if (totalPayout > remainingCap) {
    totalPayout = remainingCap;
  }

  const payout = Math.floor(totalPayout);
  policy.usedCap += payout;

  return { payout, remainingCap: remainingCap - payout };
}

function calculateInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + getInsuranceValue(item.type), 0);
}

const VALID_ITEM_TYPES = ["sword", "amulet", "staff", "potion", "rune", "moonstone"];

function validateItems(items: Item[]): void {
  for (const item of items) {
    if (!VALID_ITEM_TYPES.includes(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

export function processScenario(input: Scenario): unknown {
  const results: { premium?: number; payout?: number; remainingCap?: number }[] = [];
  const quoteSteps: { items: Item[]; cap: number; usedCap: number }[] = [];

  for (const step of input.steps) {
    if (step.op === "quote") {
      validateItems(step.items);
      const isFollowUp = quoteSteps.length > 0;
      const premium = calculatePremium(step.items, input.customer.yearsWithMHPCO, isFollowUp);
      results.push({ premium });
      const insuranceSum = calculateInsuranceSum(step.items);
      quoteSteps.push({ items: step.items, cap: insuranceSum * 2, usedCap: 0 });
    } else if (step.op === "claim") {
      const policy = quoteSteps[step.policy];
      const { payout, remainingCap } = processClaim(policy, step.incident.damages);
      results.push({ payout, remainingCap });
    }
  }

  return { results };
}
