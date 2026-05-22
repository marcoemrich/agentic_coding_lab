type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

const MAIN_ITEM_INSURANCE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_PER_ITEM = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const COMPONENT_BASE_PER_ITEM = 25;
const COMPONENT_BLOCK_BASE = 60;
const COMPONENT_BLOCK_SIZE = 3;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

const MAIN_ITEM_BASE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function componentGroupBase(count: number): number {
  if (count === COMPONENT_BLOCK_SIZE) return COMPONENT_BLOCK_BASE;
  return count * COMPONENT_BASE_PER_ITEM;
}

function isKnownItem(item: Item): boolean {
  return isComponent(item) || item.type in MAIN_ITEM_BASE;
}

function mainItemBase(item: Item): number {
  return MAIN_ITEM_BASE[item.type] ?? 0;
}

function itemSurcharges(item: Item): number {
  const base = mainItemBase(item);
  let surcharges = 0;
  if (item.cursed) surcharges += base * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharges += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharges;
}

function policyBase(items: Item[]): number {
  let base = 0;
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (isComponent(item)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      base += mainItemBase(item);
    }
  }
  for (const count of componentCounts.values()) {
    base += componentGroupBase(count);
  }
  return base;
}

function policyItemSurcharges(items: Item[]): number {
  return items.reduce((sum, it) => sum + itemSurcharges(it), 0);
}

function roundPremiumUp(amount: number): number {
  return Math.ceil(amount);
}

function quotePremium(
  items: Item[],
  yearsWithMHPCO: number,
  isFirstContract: boolean,
): number {
  const base = policyBase(items);
  const itemSur = policyItemSurcharges(items);
  const firstIns = base * FIRST_INSURANCE_SURCHARGE;
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? base * LOYALTY_DISCOUNT : 0;
  const followUp = isFirstContract ? 0 : base * FOLLOW_UP_DISCOUNT;
  return roundPremiumUp(base + itemSur + firstIns - loyalty - followUp + PROCESSING_FEE);
}

function itemInsuranceValue(item: Item): number {
  if (isComponent(item)) return COMPONENT_INSURANCE_PER_ITEM;
  return MAIN_ITEM_INSURANCE[item.type] ?? 0;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, it) => sum + itemInsuranceValue(it), 0);
}

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATIO = 0.5;

function damagePayout(damage: Damage, item: Item): number {
  let reimbursable = damage.amount;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    reimbursable = reimbursable * HIGH_ENCHANTMENT_CLAIM_RATIO;
  }
  return Math.max(0, reimbursable - DEDUCTIBLE);
}

type Policy = {
  items: Item[];
  cap: number;
  remainingCap: number;
};

export function runScenario(input: unknown): unknown {
  const scenario = input as Scenario;
  const policies: Policy[] = [];
  let quoteCount = 0;
  const results = scenario.steps.map((step) => {
    if (step.op === "quote") {
      for (const item of step.items) {
        if (!isKnownItem(item)) {
          throw new Error(`unknown item type: ${item.type}`);
        }
      }
      const isFirstContract = quoteCount === 0;
      quoteCount++;
      const cap = insuranceSum(step.items) * CAP_MULTIPLIER;
      policies.push({ items: step.items, cap, remainingCap: cap });
      return {
        premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, isFirstContract),
      };
    }
    // claim
    const policy = policies[step.policy];
    const insuredCounts = new Map<string, number>();
    for (const it of policy.items) {
      insuredCounts.set(it.type, (insuredCounts.get(it.type) ?? 0) + 1);
    }
    const damageCounts = new Map<string, number>();
    for (const damage of step.incident.damages) {
      damageCounts.set(damage.itemType, (damageCounts.get(damage.itemType) ?? 0) + 1);
    }
    for (const [type, count] of damageCounts) {
      if (count > (insuredCounts.get(type) ?? 0)) {
        throw new Error(`damage references more ${type} items than insured`);
      }
    }
    let payout = 0;
    for (const damage of step.incident.damages) {
      if (damage.amount < 0) {
        throw new Error(`damage amount cannot be negative: ${damage.amount}`);
      }
      const item = policy.items.find((it) => it.type === damage.itemType);
      if (!item) throw new Error(`damage references item not in policy: ${damage.itemType}`);
      payout += damagePayout(damage, item);
    }
    payout = Math.min(payout, policy.remainingCap);
    payout = Math.floor(payout);
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
}
