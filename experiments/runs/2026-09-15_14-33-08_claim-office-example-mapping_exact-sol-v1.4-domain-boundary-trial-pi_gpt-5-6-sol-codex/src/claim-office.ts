const PROCESSING_FEE = 5;
const SWORD_BASE_PREMIUM = 100;
const AMULET_BASE_PREMIUM = 60;
const STAFF_BASE_PREMIUM = 80;
const POTION_BASE_PREMIUM = 40;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const HIGH_CLAIM_ENCHANTMENT = 8;
const HIGH_CLAIM_REIMBURSEMENT_RATE = 0.5;
const DEDUCTIBLE = 100;
const POLICY_CAP_MULTIPLIER = 2;
const COMPONENT_INSURANCE_VALUE = 250;
const SWORD_INSURANCE_VALUE = 1000;
const AMULET_INSURANCE_VALUE = 600;
const STAFF_INSURANCE_VALUE = 800;
const POTION_INSURANCE_VALUE = 400;

const MAIN_BASE_PREMIUM: Record<string, number> = {
  sword: SWORD_BASE_PREMIUM,
  amulet: AMULET_BASE_PREMIUM,
  staff: STAFF_BASE_PREMIUM,
  potion: POTION_BASE_PREMIUM,
};
const MAIN_INSURANCE_VALUE: Record<string, number> = {
  sword: SWORD_INSURANCE_VALUE,
  amulet: AMULET_INSURANCE_VALUE,
  staff: STAFF_INSURANCE_VALUE,
  potion: POTION_INSURANCE_VALUE,
};

export interface Item {
  type: string;
  cursed?: boolean;
  material?: string;
  enchantment?: number;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

type Result = { premium: number } | { payout: number; remainingCap: number };
interface Policy { items: Item[]; remainingCap: number }

function componentPremium(items: Item[], componentType: string): number {
  const count = items.filter(({ type }) => type === componentType).length;
  return count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * COMPONENT_BASE_PREMIUM;
}

export function basePremium(items: Item[]): number {
  const componentTotal = componentPremium(items, "rune") + componentPremium(items, "moonstone");
  return items.reduce((total, item) => total + (MAIN_BASE_PREMIUM[item.type] ?? 0), componentTotal);
}

function isComponentType(type: string): boolean {
  return type === "rune" || type === "moonstone";
}

function nominalItemPremium(item: Item): number {
  const mainPremium = MAIN_BASE_PREMIUM[item.type];
  if (mainPremium !== undefined) return mainPremium;
  if (isComponentType(item.type)) return COMPONENT_BASE_PREMIUM;
  throw new Error(`Unknown item type: ${item.type}`);
}

function riskSurcharge(items: Item[], isAffected: (item: Item) => boolean, rate: number): number {
  return items
    .filter(isAffected)
    .reduce((total, item) => total + nominalItemPremium(item), 0) * rate;
}

export function itemAdjustedPremium(items: Item[]): number {
  const curse = riskSurcharge(items, ({ cursed }) => cursed === true, CURSE_SURCHARGE_RATE);
  const enchanted = riskSurcharge(
    items,
    ({ enchantment }) => (enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL,
    ENCHANTMENT_SURCHARGE_RATE,
  );
  return basePremium(items) + curse + enchanted;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const policyBase = basePremium(items);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS
    ? policyBase * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  const premium = itemAdjustedPremium(items)
    + policyBase * FIRST_INSURANCE_RATE - loyaltyDiscount - followUpDiscount + PROCESSING_FEE;
  return Math.ceil(premium);
}

function insuranceValue(item: Item): number {
  const mainValue = MAIN_INSURANCE_VALUE[item.type];
  if (mainValue !== undefined) return mainValue;
  if (isComponentType(item.type)) return COMPONENT_INSURANCE_VALUE;
  throw new Error(`Unknown item type: ${item.type}`);
}

function reimbursementRate(item: Item | undefined): number {
  if ((item?.enchantment ?? 0) >= HIGH_CLAIM_ENCHANTMENT) {
    return HIGH_CLAIM_REIMBURSEMENT_RATE;
  }
  // Dragon-material and standard damage are both fully reimbursed at present.
  return 1;
}

function validateDamage(damage: Damage): void {
  if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
}

function matchDamages(policy: Policy, damages: Damage[]): Array<{ damage: Damage; item: Item }> {
  const usedByType = new Map<string, number>();
  return damages.map((damage) => {
    validateDamage(damage);
    const used = usedByType.get(damage.itemType) ?? 0;
    const item = policy.items.filter(({ type }) => type === damage.itemType)[used];
    if (!item) throw new Error(`Damage item is not covered: ${damage.itemType}`);
    usedByType.set(damage.itemType, used + 1);
    return { damage, item };
  });
}

function desiredPayout(policy: Policy, damages: Damage[]): number {
  const payout = matchDamages(policy, damages).reduce(
    (total, { damage, item }) => total + Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE),
    0,
  );
  return Math.floor(payout);
}

function processClaim(policy: Policy, damages: Damage[]): Result {
  const payout = Math.min(desiredPayout(policy, damages), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === "claim") return processClaim(policies.get(step.policy)!, step.incident.damages);
    const cap = step.items.reduce((total, item) => total + insuranceValue(item), 0) * POLICY_CAP_MULTIPLIER;
    policies.set(index, { items: step.items, remainingCap: cap });
    const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
    quoteCount += 1;
    return { premium };
  });
  return { results };
}
