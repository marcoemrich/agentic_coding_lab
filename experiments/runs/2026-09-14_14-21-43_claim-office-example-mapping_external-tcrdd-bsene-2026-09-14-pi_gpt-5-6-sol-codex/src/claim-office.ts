export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: 'quote'; items: Item[] } | ClaimStep>;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Array<{ itemType: string; amount: number }> };
}

const premiums: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const insuranceValues: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = ['rune', 'moonstone'];
const BLOCK_SIZE = 3;
const BLOCK_SAVING = 15;
const CURSE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_PERCENT = 30;
const LOYALTY_YEARS = 2;
const LOYALTY_PERCENT = 20;
const FOLLOW_UP_PERCENT = 15;
const BASE_AND_INITIAL_PERCENT = 110;
const PERCENT_SCALE = 100;
const SCALED_FEE = 500;
const POLICY_CAP_FACTOR = 2;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const CLAIM_ENCHANTMENT_FACTOR = 0.5;
const DEDUCTIBLE = 100;

type Policy = { items: Item[]; remainingCap: number };

function quotePremium(items: Item[], yearsWithMHPCO: number, followUp: boolean): number {
  let base = items.reduce((sum, item) => sum + premiums[item.type], 0);
  for (const component of COMPONENT_TYPES) {
    if (items.filter((item) => item.type === component).length === BLOCK_SIZE) base -= BLOCK_SAVING;
  }
  const curseSurcharge = items.filter((item) => item.cursed)
    .reduce((sum, item) => sum + premiums[item.type] * CURSE_PERCENT, 0);
  const enchantmentSurcharge = items.filter((item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL)
    .reduce((sum, item) => sum + premiums[item.type] * HIGH_ENCHANTMENT_PERCENT, 0);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_PERCENT : 0;
  const followUpDiscount = followUp ? base * FOLLOW_UP_PERCENT : 0;
  const scaledPremium = base * BASE_AND_INITIAL_PERCENT + curseSurcharge + enchantmentSurcharge
    - loyaltyDiscount - followUpDiscount + SCALED_FEE;
  return Math.ceil(scaledPremium / PERCENT_SCALE);
}

function processClaim(step: ClaimStep, policy: Policy): Record<string, number> {
  const damagedCounts = new Map<string, number>();
  const desiredPayout = step.incident.damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
    const matchingItems = policy.items.filter((candidate) => candidate.type === damage.itemType);
    if (matchingItems.length === 0) throw new Error(`Item type is not insured: ${damage.itemType}`);
    const occurrence = damagedCounts.get(damage.itemType) ?? 0;
    const item = matchingItems[occurrence];
    if (!item) throw new Error(`More damages than insured items: ${damage.itemType}`);
    damagedCounts.set(damage.itemType, occurrence + 1);
    const factor = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL ? CLAIM_ENCHANTMENT_FACTOR : 1;
    return sum + Math.max(0, damage.amount * factor - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Array<Record<string, number>> } {
  const results: Array<Record<string, number>> = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === 'quote') {
      for (const item of step.items) {
        if (!(item.type in premiums)) throw new Error(`Unknown item type: ${item.type}`);
      }
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
      const insuranceSum = step.items.reduce((sum, item) => sum + insuranceValues[item.type], 0);
      policies.set(stepIndex, { items: step.items, remainingCap: insuranceSum * POLICY_CAP_FACTOR });
      quoteCount += 1;
    } else {
      results.push(processClaim(step, policies.get(step.policy)!));
    }
  });
  return { results };
}
