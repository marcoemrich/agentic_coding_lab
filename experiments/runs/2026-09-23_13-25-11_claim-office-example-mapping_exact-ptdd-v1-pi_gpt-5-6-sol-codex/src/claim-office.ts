interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

interface QuoteStep { op: "quote"; items: Item[] }
interface Damage { itemType: string; amount: number }
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
interface PolicyState { items: Item[]; remainingCap: number }


const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const ENCHANTED_REIMBURSEMENT_RATE = 0.5;
const CATALOGUE: Record<string, { premium: number; value: number }> = {
  sword: { premium: 100, value: 1000 },
  amulet: { premium: 60, value: 600 },
  staff: { premium: 80, value: 800 },
  potion: { premium: 40, value: 400 },
  rune: { premium: 25, value: 250 },
  moonstone: { premium: 25, value: 250 },
};

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function premiumForType(items: Item[], type: string): number {
  const count = items.filter((item) => item.type === type).length;
  if ((type === "rune" || type === "moonstone") && count === BLOCK_SIZE) return BLOCK_PREMIUM;
  return count * CATALOGUE[type].premium;
}

export function basePremium(items: Item[]): number {
  const types = [...new Set(items.map((item) => item.type))];
  return types.reduce((sum, type) => sum + premiumForType(items, type), 0);
}

const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;

function curseSurcharge(item: Item): number {
  return item.cursed ? CATALOGUE[item.type].premium * CURSE_RATE : 0;
}

function enchantmentSurcharge(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
    ? CATALOGUE[item.type].premium * HIGH_ENCHANTMENT_RATE : 0;
}

function itemRiskSurcharge(item: Item): number {
  return curseSurcharge(item) + enchantmentSurcharge(item);
}

export function itemAdjustedPremium(items: Item[]): number {
  return basePremium(items) + items.reduce((sum, item) => sum + itemRiskSurcharge(item), 0);
}

export function insuranceValue(items: Item[]): number {
  return items.reduce((sum, item) => sum + CATALOGUE[item.type].value, 0);
}

function loyaltyDiscount(policyBase: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? policyBase * LOYALTY_RATE : 0;
}

function followUpDiscount(policyBase: number, isFollowUp: boolean): number {
  return isFollowUp ? policyBase * FOLLOW_UP_RATE : 0;
}

export function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const policyBase = basePremium(items);
  return roundPremium(itemAdjustedPremium(items) + policyBase * INITIAL_ASSESSMENT_RATE
    - loyaltyDiscount(policyBase, yearsWithMHPCO) - followUpDiscount(policyBase, isFollowUp)
    + PROCESSING_FEE);
}

function assertKnownItems(items: Item[]): void {
  for (const item of items) {
    if (!CATALOGUE[item.type]) throw new Error(`Unknown item type: ${item.type}`);
  }
}

function reimbursementRate(item: Item): number {
  if ((item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL) return ENCHANTED_REIMBURSEMENT_RATE;
  if (item.material === "dragon") return 1;
  return 1;
}

function damageReimbursement(damage: Damage, item: Item): number {
  return Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);
}

function matchedItems(damages: Damage[], coveredItems: Item[]): Item[] {
  const available = [...coveredItems];
  return damages.map((damage) => {
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index < 0) throw new Error(`Damage item is not covered: ${damage.itemType}`);
    return available.splice(index, 1)[0];
  });
}

export function roundPayout(amount: number): number {
  return Math.floor(amount);
}

function consumeCap(desired: number, policy: PolicyState): Result {
  const payout = roundPayout(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function assertValidDamages(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
  }
}

function processClaim(step: ClaimStep, policy: PolicyState): Result {
  assertValidDamages(step.incident.damages);
  const items = matchedItems(step.incident.damages, policy.items);
  const desired = step.incident.damages.reduce((sum, damage, index) =>
    sum + damageReimbursement(damage, items[index]!), 0);
  return consumeCap(desired, policy);
}

export function executeScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, PolicyState>();
  const results: Result[] = [];
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "claim") {
      results.push(processClaim(step, policies.get(step.policy)!));
      return;
    }
    assertKnownItems(step.items);
    results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
    policies.set(index, { items: step.items, remainingCap: insuranceValue(step.items) * CAP_MULTIPLIER });
    quoteCount += 1;
  });
  return { results };
}
