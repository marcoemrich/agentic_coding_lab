const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const ENCHANTED_REIMBURSEMENT_RATE = 0.5;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_PREMIUM = 60;
const COMPONENT_VALUE = 250;
const DEDUCTIBLE = 100;
const POLICY_CAP_MULTIPLIER = 2;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: COMPONENT_VALUE, moonstone: COMPONENT_VALUE,
};
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

interface Item {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
}
interface QuoteStep { op: "quote"; items: Item[] }
interface Damage { itemType: string; amount: number }
interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
type Step = QuoteStep | ClaimStep;
interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}
type Result = { premium: number } | { payout: number; remainingCap: number };

function itemBasePremium(item: Item): number {
  const premium = BASE_PREMIUM[item.type];
  if (premium === undefined) throw new Error(`unknown item type: ${item.type}`);
  return premium;
}

function componentBasePremium(items: Item[]): number {
  const counts = items.reduce<Record<string, number>>((result, item) => {
    if (COMPONENT_TYPES.has(item.type)) result[item.type] = (result[item.type] ?? 0) + 1;
    return result;
  }, {});
  return Object.values(counts).reduce(
    (total, count) => total + (count === BUILDING_BLOCK_SIZE ? BUILDING_BLOCK_PREMIUM : count * BASE_PREMIUM.rune),
    0,
  );
}

function policyBasePremium(items: Item[]): number {
  const mainItemPremium = items
    .filter((item) => !COMPONENT_TYPES.has(item.type))
    .reduce((total, item) => total + itemBasePremium(item), 0);
  return mainItemPremium + componentBasePremium(items);
}

function itemRiskRate(item: Item): number {
  return (item.cursed ? CURSE_RATE : 0)
    + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_RATE : 0);
}

function itemRiskSurcharge(items: Item[]): number {
  return items.reduce((total, item) => total + itemBasePremium(item) * itemRiskRate(item), 0);
}

function loyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
}

function followUpDiscount(basePremium: number, isFollowUp: boolean): number {
  return isFollowUp ? basePremium * FOLLOW_UP_RATE : 0;
}

function quote(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const basePremium = policyBasePremium(items);
  return Math.ceil(
    basePremium + itemRiskSurcharge(items) + basePremium * FIRST_INSURANCE_RATE
      - loyaltyDiscount(basePremium, yearsWithMHPCO) - followUpDiscount(basePremium, isFollowUp) + PROCESSING_FEE,
  );
}

function policyCap(items: Item[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0) * POLICY_CAP_MULTIPLIER;
}

function damageReimbursement(item: Item, damage: Damage): number {
  const rate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL ? ENCHANTED_REIMBURSEMENT_RATE : 1;
  return Math.max(0, damage.amount * rate - DEDUCTIBLE);
}

function insuredItemFor(policy: QuoteStep, damage: Damage): Item {
  return policy.items.find(({ type }) => type === damage.itemType) as Item;
}

function validateDamageAmounts(damages: Damage[]): void {
  if (damages.some(({ amount }) => amount < 0)) throw new Error("damage amount must not be negative");
}

function validateDamageCoverage(policy: QuoteStep, damages: Damage[]): void {
  const available = policy.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
    return counts;
  }, {});
  damages.forEach((damage) => {
    available[damage.itemType] = (available[damage.itemType] ?? 0) - 1;
    if (available[damage.itemType] < 0) throw new Error("damage entry is not covered by the policy");
  });
}

function claim(step: ClaimStep, policy: QuoteStep, priorPayout: number): { payout: number; remainingCap: number } {
  validateDamageAmounts(step.incident.damages);
  validateDamageCoverage(policy, step.incident.damages);
  const desired = step.incident.damages.reduce(
    (sum, damage) => sum + damageReimbursement(insuredItemFor(policy, damage), damage),
    0,
  );
  const available = policyCap(policy.items) - priorPayout;
  const payout = Math.floor(Math.min(desired, available));
  return { payout, remainingCap: available - payout };
}

export function processScenario(input: unknown): { results: Result[] } {
  const scenario = input as Scenario;
  const paidByPolicy = new Map<number, number>();
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === "quote") {
      const previousQuotes = scenario.steps.slice(0, index).filter(({ op }) => op === "quote").length;
      return { premium: quote(step.items, scenario.customer.yearsWithMHPCO, previousQuotes > 0) };
    }
    const policy = scenario.steps[step.policy] as QuoteStep;
    const result = claim(step, policy, paidByPolicy.get(step.policy) ?? 0);
    paidByPolicy.set(step.policy, (paidByPolicy.get(step.policy) ?? 0) + result.payout);
    return result;
  });
  return { results };
}
