export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause?: string;
  damages: DamageEntry[];
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

const MAIN_ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const MAIN_ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_INSURANCE_VALUE = 250;

const isMainItem = (item: Item): boolean => item.type in MAIN_ITEM_BASE_PREMIUM;
const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);
const isKnownItem = (item: Item): boolean => isMainItem(item) || isComponent(item);
const isKnownItemType = (type: string): boolean =>
  type in MAIN_ITEM_BASE_PREMIUM || COMPONENT_TYPES.has(type);

const SCALE = 100;

const mainItemBaseScaled = (item: Item): number => MAIN_ITEM_BASE_PREMIUM[item.type] * SCALE;

const mainItemSurchargesScaled = (item: Item): number => {
  const base = mainItemBaseScaled(item);
  let surcharge = 0;
  if (item.cursed === true) {
    surcharge += base / 2; // +50%
  }
  if ((item.enchantment ?? 0) >= 5) {
    surcharge += (base * 3) / 10; // +30%
  }
  return surcharge;
};

const componentsBaseScaled = (items: Item[]): number => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  let total = 0;
  for (const count of counts.values()) {
    total += (count === 3 ? 60 : count * 25) * SCALE;
  }
  return total;
};

const ceilUpToG = (scaled: number): number => Math.ceil(scaled / SCALE);
const floorDownToG = (scaled: number): number => Math.floor(scaled / SCALE);

interface PolicyState {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

const computeInsuranceSum = (items: Item[]): number => {
  let sum = 0;
  for (const item of items) {
    if (isMainItem(item)) {
      sum += MAIN_ITEM_INSURANCE_VALUE[item.type];
    } else if (isComponent(item)) {
      sum += COMPONENT_INSURANCE_VALUE;
    }
  }
  return sum;
};

const quotePremium = (
  step: QuoteStep,
  customer: Customer,
  contractIndex: number,
): number => {
  for (const item of step.items) {
    if (!isKnownItem(item)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
  const mainItems = step.items.filter(isMainItem);
  const components = step.items.filter(isComponent);
  const mainBase = mainItems.reduce((sum, item) => sum + mainItemBaseScaled(item), 0);
  const compBase = componentsBaseScaled(components);
  const policyBase = mainBase + compBase;
  const itemSurcharges = mainItems.reduce((sum, item) => sum + mainItemSurchargesScaled(item), 0);

  let policyMods = 0;
  if (customer.yearsWithMHPCO >= 2) {
    policyMods -= (policyBase * 20) / 100;
  }
  if (step.items.length > 0) {
    policyMods += (policyBase * 10) / 100;
  }
  if (contractIndex >= 1) {
    policyMods -= (policyBase * 15) / 100;
  }

  const subtotalScaled = policyBase + itemSurcharges + policyMods;
  return ceilUpToG(subtotalScaled) + 5;
};

const itemPayoutScaled = (item: Item, damageAmount: number): number => {
  const damageScaled = damageAmount * SCALE;
  const isDragon = item.material === "dragon";
  const isHighEnch = (item.enchantment ?? 0) >= 8;
  let baseScaled: number;
  if (isHighEnch) {
    // 50 % rule wins when both apply
    baseScaled = damageScaled / 2;
  } else if (isDragon) {
    baseScaled = damageScaled;
  } else {
    baseScaled = damageScaled;
  }
  // 100 G deductible per damage event
  return Math.max(0, baseScaled - 100 * SCALE);
};

const processClaim = (step: ClaimStep, policy: PolicyState): ClaimResult => {
  // Count remaining items by type for this claim's damages
  const itemsByType = new Map<string, Item[]>();
  for (const item of policy.items) {
    const arr = itemsByType.get(item.type) ?? [];
    arr.push(item);
    itemsByType.set(item.type, arr);
  }

  // Validate each damage entry
  const damageQueues = new Map<string, Item[]>();
  for (const [type, items] of itemsByType) {
    damageQueues.set(type, [...items]);
  }

  let totalPayoutScaled = 0;
  for (const dmg of step.incident.damages) {
    if (!isKnownItemType(dmg.itemType)) {
      throw new Error(`unknown item type in damage: ${dmg.itemType}`);
    }
    if (dmg.amount < 0) {
      throw new Error(`negative damage amount: ${dmg.amount}`);
    }
    const queue = damageQueues.get(dmg.itemType);
    if (!queue || queue.length === 0) {
      throw new Error(`damage references item not in policy: ${dmg.itemType}`);
    }
    const item = queue.shift()!;
    totalPayoutScaled += itemPayoutScaled(item, dmg.amount);
  }

  // Apply cap
  const capScaledRemaining = policy.remainingCap * SCALE;
  const cappedScaled = Math.min(totalPayoutScaled, capScaledRemaining);
  const payout = floorDownToG(cappedScaled);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (input: Scenario): { results: StepResult[] } => {
  const policies = new Map<number, PolicyState>();
  let contractIndex = 0;
  const results: StepResult[] = input.steps.map((step, index) => {
    if (step.op === "quote") {
      const premium = quotePremium(step, input.customer, contractIndex);
      contractIndex += 1;
      const insuranceSum = computeInsuranceSum(step.items);
      policies.set(index, {
        items: step.items,
        insuranceSum,
        remainingCap: insuranceSum * 2,
      });
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (!policy) {
      throw new Error(`claim references unknown policy index: ${step.policy}`);
    }
    return processClaim(step, policy);
  });
  return { results };
};
