export interface CustomerHistory {
  yearsWithMHPCO: number;
  previousContracts: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const MAIN_ITEM_BASE_PREMIUMS: Readonly<Record<string, number>> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const INSURANCE_VALUES: Readonly<Record<string, number>> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"] as const;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function mainItemBasePremium(type: string): number {
  return MAIN_ITEM_BASE_PREMIUMS[type] ?? 0;
}

function initialInsuranceAssessment(basePremium: number): number {
  return basePremium * INITIAL_ASSESSMENT_RATE;
}

function cursedItemSurcharges(items: Item[]): number {
  return items
    .filter((item) => item.cursed)
    .reduce((total, item) => total + mainItemBasePremium(item.type) * CURSE_SURCHARGE_RATE, 0);
}

function loyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
}

function highEnchantmentSurcharges(items: Item[]): number {
  return items
    .filter((item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD)
    .reduce((total, item) => total + mainItemBasePremium(item.type) * HIGH_ENCHANTMENT_SURCHARGE_RATE, 0);
}

function followUpContractDiscount(basePremium: number, previousContracts: number): number {
  return previousContracts > 0 ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
}

function isComponentType(type: string): boolean {
  return COMPONENT_TYPES.some((componentType) => componentType === type);
}

function componentTypeBasePremium(items: Item[], type: string): number {
  const count = items.filter((item) => item.type === type).length;
  return count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * mainItemBasePremium(type);
}

function policyBasePremium(items: Item[]): number {
  const mainItemsPremium = items
    .filter((item) => !isComponentType(item.type))
    .reduce((total, item) => total + mainItemBasePremium(item.type), 0);
  return COMPONENT_TYPES.reduce(
    (total, type) => total + componentTypeBasePremium(items, type), mainItemsPremium,
  );
}

export function quote(items: Item[], customer: CustomerHistory): number {
  if (items.some((item) => MAIN_ITEM_BASE_PREMIUMS[item.type] === undefined)) {
    throw new Error("Unknown item type in quote");
  }
  const basePremium = policyBasePremium(items);
  return Math.ceil(
    basePremium + cursedItemSurcharges(items) + highEnchantmentSurcharges(items)
      + initialInsuranceAssessment(basePremium) - loyaltyDiscount(basePremium, customer.yearsWithMHPCO)
      - followUpContractDiscount(basePremium, customer.previousContracts) + PROCESSING_FEE,
  );
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Step {
  op: "quote" | "claim";
  items?: Item[];
  policy?: number;
  incident?: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function reimbursableDamage(item: Item | undefined, amount: number): number {
  if ((item?.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD) {
    return amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return amount;
}

function requireValidDamageAmounts(damages: Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) throw new Error("Damage amount cannot be negative");
}

function settleClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  requireValidDamageAmounts(damages);
  const unmatchedItems = [...policy.items];
  const desired = damages.reduce((sum, damage) => {
    const itemIndex = unmatchedItems.findIndex((covered) => covered.type === damage.itemType);
    if (itemIndex < 0) throw new Error("Damage item is not covered by the policy");
    const [item] = unmatchedItems.splice(itemIndex, 1);
    return sum + Math.max(0, reimbursableDamage(item, damage.amount) - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: object[] } {
  const policies = new Map<number, Policy>();
  const results: object[] = [];
  let previousContracts = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      const items = step.items ?? [];
      results.push({ premium: quote(items, { ...scenario.customer, previousContracts }) });
      policies.set(stepIndex, createPolicy(items));
      previousContracts += 1;
      return;
    }
    const policy = policies.get(step.policy ?? -1);
    if (!policy) throw new Error("Claim references an unknown policy");
    results.push(settleClaim(policy, step.incident?.damages ?? []));
  });
  return { results };
}
