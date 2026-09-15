export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

interface QuoteStep { op: "quote"; items: Item[] }
interface Damage { itemType: string; amount: number }
interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
type Step = QuoteStep | ClaimStep;
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
type Result = { premium: number } | { payout: number; remainingCap: number };
interface Policy { items: Item[]; remainingCap: number }

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const FOLLOW_UP_RATE = 0.15;
const BLOCK_SIZE = 3;
const BLOCK_SAVING = 15;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const ENCHANTED_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};

function assertKnownItemType(type: string): void {
  if (!(type in BASE_PREMIUMS)) throw new Error(`Unknown item type: ${type}`);
}

function quotePremium(items: Item[], yearsWithMHPCO: number, contractIndex: number): number {
  items.forEach((item) => assertKnownItemType(item.type));
  const listedPremium = items.reduce((total, item) => total + BASE_PREMIUMS[item.type], 0);
  const componentTypes = ["rune", "moonstone"];
  const blockCount = componentTypes.filter(
    (type) => items.filter((item) => item.type === type).length === BLOCK_SIZE,
  ).length;
  const basePremium = listedPremium - blockCount * BLOCK_SAVING;
  const curseSurcharge = items.filter((item) => item.cursed)
    .reduce((total, item) => total + BASE_PREMIUMS[item.type] * CURSE_RATE, 0);
  const enchantmentSurcharge = items.filter((item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL)
    .reduce((total, item) => total + BASE_PREMIUMS[item.type] * HIGH_ENCHANTMENT_RATE, 0);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
  const followUpDiscount = contractIndex > 0 ? basePremium * FOLLOW_UP_RATE : 0;
  return Math.ceil(basePremium + curseSurcharge + enchantmentSurcharge + basePremium * INITIAL_ASSESSMENT_RATE
    - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

function policyCap(items: Item[]): number {
  return items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0) * CAP_MULTIPLIER;
}

function desiredDamage(damage: Damage, item: Item): number {
  const rate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL ? ENCHANTED_REIMBURSEMENT_RATE : 1;
  return Math.max(0, damage.amount * rate - DEDUCTIBLE);
}

function validateDamageCounts(damages: Damage[], items: Item[]): void {
  damages.forEach((damage, index) => {
    assertKnownItemType(damage.itemType);
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
    const priorCount = damages.slice(0, index + 1).filter((entry) => entry.itemType === damage.itemType).length;
    const insuredCount = items.filter((item) => item.type === damage.itemType).length;
    if (priorCount > insuredCount) throw new Error(`Damage entries outnumber insured ${damage.itemType} items`);
  });
}

function processClaim(step: ClaimStep, policy: Policy): { payout: number; remainingCap: number } {
  validateDamageCounts(step.incident.damages, policy.items);
  const desired = step.incident.damages.reduce((total, damage) => {
    const item = policy.items.find((candidate) => candidate.type === damage.itemType)!;
    return total + desiredDamage(damage, item);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      policies.set(index, { items: step.items, remainingCap: policyCap(step.items) });
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount) });
      quoteCount += 1;
    } else {
      results.push(processClaim(step, policies.get(step.policy)!));
    }
  });
  return { results };
}
