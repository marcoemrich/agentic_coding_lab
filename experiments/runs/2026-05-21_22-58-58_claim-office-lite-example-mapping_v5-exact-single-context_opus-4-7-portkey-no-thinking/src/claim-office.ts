export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
export type Damage = { itemType: string; amount: number };
export type Incident = { cause: string; damages: Damage[] };
export type QuoteStep = { op: "quote"; items: Item[] };
export type ClaimStep = { op: "claim"; policy: number; incident: Incident };
export type Step = QuoteStep | ClaimStep;
export type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
export type Result = { premium: number } | { payout: number };

const MAIN_BASE: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40 };
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_UNIT_BASE = 25;
const COMPONENT_BLOCK_BASE = 60;

const MAIN_INSURANCE_VALUE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400 };
const COMPONENT_INSURANCE_VALUE = 250;

const DEDUCTIBLE = 100;

type ItemBase = { item: Item | null; base: number };

const itemBases = (items: Item[]): ItemBase[] => {
  const bases: ItemBase[] = [];
  const componentBuckets: Record<string, Item[]> = {};
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      (componentBuckets[item.type] ??= []).push(item);
    } else if (item.type in MAIN_BASE) {
      bases.push({ item, base: MAIN_BASE[item.type] });
    } else {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  for (const bucket of Object.values(componentBuckets)) {
    if (bucket.length === 3) {
      bases.push({ item: null, base: COMPONENT_BLOCK_BASE });
    } else {
      for (const item of bucket) {
        bases.push({ item, base: COMPONENT_UNIT_BASE });
      }
    }
  }
  return bases;
};

const itemSurcharge = (item: Item | null, base: number): number => {
  if (!item) return 0;
  let surcharge = 0;
  if (item.cursed) surcharge += base * 0.5;
  if ((item.enchantment ?? 0) >= 5) surcharge += base * 0.3;
  return surcharge;
};

const isKnownItemType = (type: string): boolean =>
  type in MAIN_BASE || COMPONENT_TYPES.has(type);

const computePremium = (
  items: Item[],
  isLoyal: boolean,
  isFollowUp: boolean
): number => {
  const bases = itemBases(items);
  const policyBase = bases.reduce((s, b) => s + b.base, 0);
  const itemSurcharges = bases.reduce((s, b) => s + itemSurcharge(b.item, b.base), 0);
  const loyaltyDiscount = isLoyal ? policyBase * 0.2 : 0;
  const firstInsurance = policyBase * 0.1;
  const followUpDiscount = isFollowUp ? policyBase * 0.15 : 0;
  const total = policyBase + itemSurcharges - loyaltyDiscount + firstInsurance - followUpDiscount + 5;
  return Math.ceil(total);
};

const matchDamageToItem = (damage: Damage, available: Item[]): Item => {
  if (!isKnownItemType(damage.itemType)) {
    throw new Error(`Unknown item type in damage: ${damage.itemType}`);
  }
  const idx = available.findIndex((it) => it.type === damage.itemType);
  if (idx === -1) {
    throw new Error(`Damaged item ${damage.itemType} is not insured by this policy`);
  }
  const [item] = available.splice(idx, 1);
  return item;
};

const computeItemPayout = (item: Item, damage: Damage): number => {
  const insuranceValue = COMPONENT_TYPES.has(item.type)
    ? COMPONENT_INSURANCE_VALUE
    : MAIN_INSURANCE_VALUE[item.type];
  const capped = Math.min(damage.amount, insuranceValue);
  const highEnch = (item.enchantment ?? 0) >= 8;
  return highEnch ? capped * 0.5 : capped;
};

const computeClaimPayout = (incident: Incident, items: Item[]): number => {
  for (const d of incident.damages) {
    if (d.amount < 0) throw new Error(`Negative damage amount: ${d.amount}`);
  }
  const available = items.slice();
  let total = 0;
  for (const damage of incident.damages) {
    const item = matchDamageToItem(damage, available);
    const reimbursement = computeItemPayout(item, damage);
    const afterDeductible = Math.max(0, reimbursement - DEDUCTIBLE);
    total += afterDeductible;
  }
  return Math.floor(total);
};

export const runScenario = (input: Scenario): { results: Result[] } => {
  let quoteCount = 0;
  const isLoyal = input.customer.yearsWithMHPCO >= 2;
  const policies: Item[][] = [];
  const results: Result[] = input.steps.map((step) => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount += 1;
      policies.push(step.items);
      return { premium: computePremium(step.items, isLoyal, isFollowUp) };
    }
    const items = policies[step.policy];
    if (!items) throw new Error(`Policy ${step.policy} not found`);
    return { payout: computeClaimPayout(step.incident, items) };
  });
  return { results };
};
