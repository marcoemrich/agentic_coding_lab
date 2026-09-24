interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { damages: Array<{ itemType: string; amount: number }> };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const DEDUCTIBLE = 100;
const INSURANCE_VALUE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

function basePremiumFor(item: Item): number {
  return BASE_PREMIUM[item.type] ?? 0;
}

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function premiumForType(type: string, count: number): number {
  if (COMPONENT_TYPES.has(type) && count === BLOCK_SIZE) return BLOCK_PREMIUM;
  return basePremiumFor({ type }) * count;
}

function policyBasePremium(items: Item[]): number {
  const counts = items.reduce<Record<string, number>>((result, { type }) => {
    result[type] = (result[type] ?? 0) + 1;
    return result;
  }, {});
  return Object.entries(counts).reduce((total, [type, count]) => total + premiumForType(type, count), 0);
}

function highEnchantmentSurcharge(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
    ? basePremiumFor(item) * HIGH_ENCHANTMENT_RATE
    : 0;
}

function itemRiskSurcharge(items: Item[]): number {
  return items.reduce((total, entry) => {
    const curse = entry.cursed ? basePremiumFor(entry) * CURSE_RATE : 0;
    return total + curse + highEnchantmentSurcharge(entry);
  }, 0);
}

function loyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
}

function followUpDiscount(basePremium: number, isFollowUp: boolean): number {
  return isFollowUp ? basePremium * FOLLOW_UP_RATE : 0;
}

function quote(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): { premium: number } {
  const basePremium = policyBasePremium(items);
  const premium = basePremium + itemRiskSurcharge(items) + basePremium * FIRST_INSURANCE_RATE
    - loyaltyDiscount(basePremium, yearsWithMHPCO) - followUpDiscount(basePremium, isFollowUp) + PROCESSING_FEE;
  return { premium: Math.ceil(premium) };
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function damagePayout(item: Item, amount: number): number {
  const rate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_REIMBURSEMENT : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}

function validateDamages(policy: Policy, step: ClaimStep): void {
  const insuredCounts = policy.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
    return counts;
  }, {});
  const damageCounts: Record<string, number> = {};
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) throw new Error("Damage amount must not be negative");
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
    if (damageCounts[damage.itemType] > (insuredCounts[damage.itemType] ?? 0)) {
      throw new Error(`Damage item is not covered: ${damage.itemType}`);
    }
  }
}

function payoutForMatchedDamages(policy: Policy, step: ClaimStep): number {
  const unmatchedItems = [...policy.items];
  return step.incident.damages.reduce((total, entry) => {
    const itemIndex = unmatchedItems.findIndex(({ type }) => type === entry.itemType);
    const [insuredItem] = unmatchedItems.splice(itemIndex, 1);
    return total + damagePayout(insuredItem, entry.amount);
  }, 0);
}

function processClaim(policy: Policy, step: ClaimStep) {
  validateDamages(policy, step);
  const rawPayout = payoutForMatchedDamages(policy, step);
  const payout = Math.floor(Math.min(rawPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function validateQuoteItems(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) throw new Error(`Unknown item type: ${item.type}`);
  }
}

function initialCap(items: Item[]): number {
  const insuranceSum = items.reduce((sum, entry) => sum + (INSURANCE_VALUE[entry.type] ?? 0), 0);
  return insuranceSum * CAP_MULTIPLIER;
}

export function processScenario(scenario: Scenario) {
  const policies: Policy[] = [];
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") return processClaim(policies[step.policy], step);
    validateQuoteItems(step.items);
    policies[index] = { items: step.items, remainingCap: initialCap(step.items) };
    return quote(step.items, scenario.customer.yearsWithMHPCO, index > 0);
  });
  return { results };
}
