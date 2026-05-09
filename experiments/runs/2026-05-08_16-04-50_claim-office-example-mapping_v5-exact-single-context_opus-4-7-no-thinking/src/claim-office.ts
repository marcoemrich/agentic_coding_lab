export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause?: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

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

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_DISCOUNT = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const MAIN_ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

const KNOWN_ITEM_TYPES = new Set([
  "sword",
  "amulet",
  "staff",
  "potion",
  "rune",
  "moonstone",
]);

const validateItemTypes = (items: Item[]): void => {
  for (const it of items) {
    if (!KNOWN_ITEM_TYPES.has(it.type)) {
      throw new Error(`Unknown item type: ${it.type}`);
    }
  }
};

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const componentsBasePremium = (items: Item[]): number => {
  const counts = new Map<string, number>();
  for (const it of items) {
    counts.set(it.type, (counts.get(it.type) ?? 0) + 1);
  }
  let total = 0;
  for (const count of counts.values()) {
    if (count === COMPONENT_BLOCK_SIZE) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * COMPONENT_BASE_PREMIUM;
    }
  }
  return total;
};

// Returns a list of [item, base premium] pairs. For components, the base premium of a 3-block
// is split equally across its three components for per-item modifier purposes; this isn't
// directly used yet but keeps the structure clear.
const itemBasePremiums = (items: Item[]): Array<{ item: Item; base: number }> => {
  const components: Item[] = [];
  const main: Item[] = [];
  for (const it of items) {
    if (isComponent(it)) components.push(it);
    else main.push(it);
  }
  const mainPairs = main.map((it) => ({ item: it, base: MAIN_ITEM_BASE_PREMIUM[it.type] ?? 0 }));

  // Distribute component base evenly within each type group, accounting for blocks.
  const componentPairs: Array<{ item: Item; base: number }> = [];
  const byType = new Map<string, Item[]>();
  for (const it of components) {
    const arr = byType.get(it.type) ?? [];
    arr.push(it);
    byType.set(it.type, arr);
  }
  for (const arr of byType.values()) {
    const groupBase =
      arr.length === COMPONENT_BLOCK_SIZE
        ? COMPONENT_BLOCK_PREMIUM
        : arr.length * COMPONENT_BASE_PREMIUM;
    const perItem = groupBase / arr.length;
    for (const it of arr) componentPairs.push({ item: it, base: perItem });
  }

  return [...mainPairs, ...componentPairs];
};

const itemSurcharge = (item: Item, base: number): number => {
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
};

const quoteStep = (
  step: QuoteStep,
  customer: Customer,
  isFirstContract: boolean,
): QuoteResult => {
  const pairs = itemBasePremiums(step.items);
  const policyBase = pairs.reduce((s, p) => s + p.base, 0);
  const itemSurcharges = pairs.reduce((s, p) => s + itemSurcharge(p.item, p.base), 0);
  const firstInsurance = policyBase * FIRST_INSURANCE_SURCHARGE;
  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? policyBase * LOYALTY_DISCOUNT : 0;
  const followup = isFirstContract ? 0 : policyBase * FOLLOWUP_DISCOUNT;
  const premium =
    policyBase + itemSurcharges + firstInsurance - loyalty - followup + PROCESSING_FEE;
  return { premium: Math.ceil(premium) };
};

interface PolicyState {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

const insuranceSum = (items: Item[]): number =>
  items.reduce((s, it) => s + (ITEM_INSURANCE_VALUE[it.type] ?? 0), 0);

const damagePayout = (item: Item, amount: number): number => {
  const reimbursable = (item.enchantment ?? 0) >= 8 ? amount * 0.5 : amount;
  return Math.max(0, reimbursable - DEDUCTIBLE);
};

const claimStep = (step: ClaimStep, policy: PolicyState): ClaimResult => {
  // Validate: damage entries by type must not exceed insured items by type
  const insuredCount = new Map<string, number>();
  for (const it of policy.items) {
    insuredCount.set(it.type, (insuredCount.get(it.type) ?? 0) + 1);
  }
  const damageCount = new Map<string, number>();
  for (const dmg of step.incident.damages) {
    if (dmg.amount < 0) {
      throw new Error(`Negative damage amount: ${dmg.amount}`);
    }
    damageCount.set(dmg.itemType, (damageCount.get(dmg.itemType) ?? 0) + 1);
  }
  for (const [type, count] of damageCount) {
    const insured = insuredCount.get(type) ?? 0;
    if (count > insured) {
      throw new Error(
        `Damage entries for ${type} exceed insured items (${count} > ${insured})`,
      );
    }
  }

  let totalPayout = 0;
  let cap = policy.remainingCap;
  // Pair each damage with an insured item (consume order)
  const remainingItems = [...policy.items];
  for (const dmg of step.incident.damages) {
    const idx = remainingItems.findIndex((it) => it.type === dmg.itemType);
    if (idx === -1) continue;
    const item = remainingItems[idx];
    remainingItems.splice(idx, 1);
    const want = damagePayout(item, dmg.amount);
    const granted = Math.min(want, cap);
    totalPayout += granted;
    cap -= granted;
  }
  policy.remainingCap = cap;
  return { payout: Math.floor(totalPayout), remainingCap: Math.floor(cap) };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  let quoteCount = 0;
  const policies = new Map<number, PolicyState>();
  const results: StepResult[] = scenario.steps.map((step, idx) => {
    if (step.op === "quote") {
      validateItemTypes(step.items);
      const isFirst = quoteCount === 0;
      quoteCount += 1;
      const sum = insuranceSum(step.items);
      policies.set(idx, {
        items: step.items,
        insuranceSum: sum,
        remainingCap: sum * CAP_MULTIPLIER,
      });
      return quoteStep(step, scenario.customer, isFirst);
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Unknown policy index: ${step.policy}`);
    return claimStep(step, policy);
  });
  return { results };
};
