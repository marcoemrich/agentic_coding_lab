export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const INITIAL_ASSESSMENT_RATE = 0.1;
const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSE_RATE = 0.5;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_RATE = 0.3;
const FOLLOW_UP_RATE = 0.15;
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HIGH_CLAIM_ENCHANTMENT = 8;
const HIGH_CLAIM_REIMBURSEMENT_RATE = 0.5;

interface Policy {
  items: Item[];
  remainingCap: number;
}

function policyBasePremium(items: Item[]): number {
  const counts = items.reduce<Record<string, number>>((byType, item) => {
    byType[item.type] = (byType[item.type] ?? 0) + 1;
    return byType;
  }, {});
  return Object.entries(counts).reduce((sum, [type, count]) => {
    const isComponentBlock = (type === "rune" || type === "moonstone") && count === BLOCK_SIZE;
    return sum + (isComponentBlock ? COMPONENT_BLOCK_PREMIUM : BASE_PREMIUMS[type] * count);
  }, 0);
}

function itemRiskSurcharge(item: Item): number {
  const basePremium = BASE_PREMIUMS[item.type];
  const curseSurcharge = item.cursed ? basePremium * CURSE_RATE : 0;
  const enchantmentSurcharge =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? basePremium * ENCHANTMENT_RATE : 0;
  return curseSurcharge + enchantmentSurcharge;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const basePremium = policyBasePremium(items);
  const riskSurcharge = items.reduce((sum, item) => sum + itemRiskSurcharge(item), 0);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_RATE : 0;
  return Math.ceil(
    basePremium +
      riskSurcharge +
      basePremium * INITIAL_ASSESSMENT_RATE -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE,
  );
}

function validateItems(items: Item[]): void {
  const unknownItem = items.find((item) => BASE_PREMIUMS[item.type] === undefined);
  if (unknownItem) throw new Error(`Unknown item type: ${unknownItem.type}`);
}

function insuranceCap(items: Item[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0) * CAP_MULTIPLIER;
}

function damagePayout(item: Item, amount: number): number {
  const reimbursedDamage =
    (item.enchantment ?? 0) >= HIGH_CLAIM_ENCHANTMENT ? amount * HIGH_CLAIM_REIMBURSEMENT_RATE : amount;
  return Math.max(0, reimbursedDamage - DEDUCTIBLE);
}

function coveredItemsForDamages(policy: Policy, damages: Damage[]): Item[] {
  const availableItems = [...policy.items];
  return damages.map((damage) => {
    const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex === -1) throw new Error("Damage item is not covered by the policy");
    return availableItems.splice(itemIndex, 1)[0];
  });
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  if (damages.some((damage) => damage.amount < 0)) throw new Error("Damage amount cannot be negative");
  const coveredItems = coveredItemsForDamages(policy, damages);
  const desiredPayout = damages.reduce((sum, damage, index) => {
    return sum + damagePayout(coveredItems[index], damage.amount);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const policies: Record<number, Policy> = {};
  let quoteCount = 0;
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === "quote") {
      validateItems(step.items);
      policies[index] = { items: step.items, remainingCap: insuranceCap(step.items) };
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
      quoteCount += 1;
      return { premium };
    }
    return processClaim(policies[step.policy], step.incident.damages);
  });
  return { results };
}
