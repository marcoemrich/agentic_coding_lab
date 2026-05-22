type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const MAIN_ITEMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_INSURANCE = 250;

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function isKnownType(type: string): boolean {
  return type in MAIN_ITEMS || isComponent(type);
}

function itemBasePremium(item: Item): number {
  if (isComponent(item.type)) return COMPONENT_PREMIUM;
  if (item.type in MAIN_ITEMS) return MAIN_ITEMS[item.type];
  throw new Error(`Unknown item type: ${item.type}`);
}

function itemInsuranceValue(type: string): number {
  if (isComponent(type)) return COMPONENT_INSURANCE;
  if (type in INSURANCE_VALUES) return INSURANCE_VALUES[type];
  throw new Error(`Unknown item type: ${type}`);
}

function itemsBasePremium(items: Item[]): number {
  let total = 0;
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else if (item.type in MAIN_ITEMS) {
      total += MAIN_ITEMS[item.type];
    } else {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  for (const count of Object.values(componentCounts)) {
    if (count === 3) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * COMPONENT_PREMIUM;
    }
  }
  return total;
}

function itemSurcharges(item: Item): number {
  const base = itemBasePremium(item);
  let surcharge = 0;
  if (item.cursed) surcharge += base * 0.5;
  if ((item.enchantment ?? 0) >= 5) surcharge += base * 0.3;
  return surcharge;
}

type Policy = {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
};

function buildPolicy(items: Item[]): Policy {
  let insuranceSum = 0;
  for (const item of items) {
    insuranceSum += itemInsuranceValue(item.type);
  }
  return { items, insuranceSum, cap: insuranceSum * 2, remainingCap: insuranceSum * 2 };
}

function damagePayout(damage: Damage, item: Item): number {
  if (damage.amount < 0) throw new Error(`Damage amount cannot be negative`);
  let reimbursable = damage.amount;
  const highEnch = (item.enchantment ?? 0) >= 8;
  if (highEnch) {
    reimbursable = damage.amount * 0.5;
  }
  return Math.max(0, reimbursable - 100);
}

export function runScenario(input: Scenario): { results: StepResult[] } {
  let quoteCount = 0;
  const policies: Record<number, Policy> = {};
  const results: StepResult[] = input.steps.map((step, idx) => {
    if (step.op === "quote") {
      const policyBase = itemsBasePremium(step.items);
      const surcharges = step.items.reduce((sum, item) => sum + itemSurcharges(item), 0);
      const firstInsurance = policyBase * 0.1;
      const loyaltyDiscount = input.customer.yearsWithMHPCO >= 2 ? policyBase * 0.2 : 0;
      const followUpDiscount = quoteCount >= 1 ? policyBase * 0.15 : 0;
      const subtotal = policyBase + surcharges + firstInsurance - loyaltyDiscount - followUpDiscount;
      const premium = Math.ceil(subtotal) + 5;
      quoteCount++;
      policies[idx] = buildPolicy(step.items);
      return { premium };
    } else {
      const policy = policies[step.policy];
      if (!policy) throw new Error(`Policy ${step.policy} not found`);
      const remainingItems = [...policy.items];
      let totalPayout = 0;
      for (const damage of step.incident.damages) {
        if (!isKnownType(damage.itemType)) throw new Error(`Unknown item type: ${damage.itemType}`);
        const matchIdx = remainingItems.findIndex((i) => i.type === damage.itemType);
        if (matchIdx === -1) throw new Error(`Item ${damage.itemType} not insured by policy (or more damage entries than insured items)`);
        const item = remainingItems[matchIdx];
        remainingItems.splice(matchIdx, 1);
        totalPayout += damagePayout(damage, item);
      }
      totalPayout = Math.min(totalPayout, policy.remainingCap);
      const finalPayout = Math.floor(totalPayout);
      policy.remainingCap -= finalPayout;
      return { payout: finalPayout, remainingCap: policy.remainingCap };
    }
  });
  return { results };
}
