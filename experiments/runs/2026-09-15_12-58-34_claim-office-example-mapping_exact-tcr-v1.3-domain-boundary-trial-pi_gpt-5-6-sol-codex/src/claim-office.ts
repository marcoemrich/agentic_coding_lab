export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface QuoteStep { op: "quote"; items: Item[] }
interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
type Step = QuoteStep | ClaimStep;
interface Damage { itemType: string; amount: number }

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const COMPONENT_PREMIUMS: Record<string, number> = { rune: 25, moonstone: 25 };
const ITEM_BASE_PREMIUMS = { ...MAIN_ITEM_PREMIUMS, ...COMPONENT_PREMIUMS };
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const ENCHANTED_REIMBURSEMENT_RATE = 0.5;

const COMPONENT_BLOCK_DISCOUNT = 15;
const COMPONENT_BLOCK_SIZE = 3;

const COMPONENT_TYPES = Object.keys(COMPONENT_PREMIUMS);

function componentBlockDiscount(items: Item[]): number {
  return COMPONENT_TYPES.reduce((discount, type) => {
    const alikeCount = items.filter((item) => item.type === type).length;
    return discount + (alikeCount === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_DISCOUNT : 0);
  }, 0);
}

function itemBasePremium(item: Item): number {
  const premium = ITEM_BASE_PREMIUMS[item.type];
  if (premium === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return premium;
}

function policyBasePremium(items: Item[]): number {
  const itemTotal = items.reduce((total, item) => total + itemBasePremium(item), 0);
  return itemTotal - componentBlockDiscount(items);
}

function itemSurcharge(items: Item[], applies: (item: Item) => boolean, rate: number): number {
  return items
    .filter(applies)
    .reduce((total, item) => total + ITEM_BASE_PREMIUMS[item.type] * rate, 0);
}

function cursedSurcharge(items: Item[]): number {
  return itemSurcharge(items, (item) => item.cursed === true, CURSE_RATE);
}

function enchantmentSurcharge(items: Item[]): number {
  return itemSurcharge(
    items,
    (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL,
    HIGH_ENCHANTMENT_RATE,
  );
}

function loyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
}

function followUpDiscount(basePremium: number, contractIndex: number): number {
  return contractIndex > 0 ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, contractIndex: number): number {
  const basePremium = policyBasePremium(items);
  return Math.ceil(
    basePremium + cursedSurcharge(items) + enchantmentSurcharge(items) + basePremium * FIRST_INSURANCE_RATE
      - loyaltyDiscount(basePremium, yearsWithMHPCO) - followUpDiscount(basePremium, contractIndex) + PROCESSING_FEE,
  );
}

interface Policy { items: Item[]; remainingCap: number }
type Result = { premium: number } | { payout: number; remainingCap: number };

function newPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function reimbursableAmount(damage: Damage, item: Item): number {
  if ((item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL) {
    return damage.amount * ENCHANTED_REIMBURSEMENT_RATE;
  }
  if (item.material === "dragon") return damage.amount;
  return damage.amount;
}

function assertValidDamage(damage: Damage): void {
  if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
}

function damagePayout(damage: Damage, item: Item): number {
  assertValidDamage(damage);
  return Math.max(0, reimbursableAmount(damage, item) - DEDUCTIBLE);
}

function takeInsuredItem(availableItems: Item[], damage: Damage): Item {
  const matchIndex = availableItems.findIndex((candidate) => candidate.type === damage.itemType);
  if (matchIndex < 0) throw new Error(`Damage item is not covered: ${damage.itemType}`);
  return availableItems.splice(matchIndex, 1)[0];
}

function settleClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const availableItems = [...policy.items];
  const desiredPayout = damages.reduce(
    (total, damage) => total + damagePayout(damage, takeInsuredItem(availableItems, damage)),
    0,
  );
  const payout = Math.min(Math.floor(desiredPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let quoteIndex = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteIndex++) });
      policies.set(stepIndex, newPolicy(step.items));
    } else {
      results.push(settleClaim(policies.get(step.policy)!, step.incident.damages));
    }
  });
  return { results };
}
