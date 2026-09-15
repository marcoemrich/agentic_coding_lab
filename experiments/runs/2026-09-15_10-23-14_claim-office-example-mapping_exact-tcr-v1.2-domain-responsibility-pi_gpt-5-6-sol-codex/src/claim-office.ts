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
  incident: { cause: string; damages: Array<{ itemType: string; amount: number }> };
}

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

const PRICE_LIST: Record<string, { basePremium: number; insuranceValue: number }> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};
const ASSESSED_PERCENT = 110;
const PERCENT = 100;
const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];
const CURSE_PERCENT = 50;
const LOYALTY_YEARS = 2;
const LOYALTY_PERCENT = 20;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_PERCENT = 30;
const FOLLOW_UP_PERCENT = 15;
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_PERCENT = 50;

function policyBasePremium(items: QuoteStep["items"]): number {
  const unknownItem = items.find((item) => PRICE_LIST[item.type] === undefined);
  if (unknownItem) throw new Error(`Unknown item type: ${unknownItem.type}`);
  const mainItems = items.filter((item) => !COMPONENT_TYPES.includes(item.type));
  const mainPremium = mainItems.reduce((total, item) => total + PRICE_LIST[item.type].basePremium, 0);
  const componentPremium = COMPONENT_TYPES.reduce((total, type) => {
    const count = items.filter((item) => item.type === type).length;
    return total + (count === BLOCK_SIZE ? BLOCK_PREMIUM : count * PRICE_LIST[type].basePremium);
  }, 0);
  return mainPremium + componentPremium;
}

function affectedItemSurcharge(
  items: QuoteStep["items"],
  isAffected: (item: QuoteStep["items"][number]) => boolean,
  rate: number,
): number {
  return items.filter(isAffected)
    .reduce((total, item) => total + PRICE_LIST[item.type].basePremium * rate / PERCENT, 0);
}

function quotePremium(items: QuoteStep["items"], yearsWithMHPCO: number, contractIndex: number): number {
  const basePremium = policyBasePremium(items);
  const curseSurcharge = affectedItemSurcharge(items, (item) => item.cursed === true, CURSE_PERCENT);
  const enchantmentSurcharge = affectedItemSurcharge(
    items, (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL, ENCHANTMENT_PERCENT,
  );
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS
    ? basePremium * LOYALTY_PERCENT / PERCENT
    : 0;
  const followUpDiscount = contractIndex > 0 ? basePremium * FOLLOW_UP_PERCENT / PERCENT : 0;
  return Math.ceil(basePremium * ASSESSED_PERCENT / PERCENT
    + curseSurcharge + enchantmentSurcharge - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

type Result = { premium: number } | { payout: number; remainingCap: number };
interface Policy { items: Item[]; remainingCap: number }

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + PRICE_LIST[item.type].insuranceValue, 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function damagePayout(policy: Policy, damage: ClaimStep["incident"]["damages"][number]): number {
  const item = policy.items.find((insured) => insured.type === damage.itemType)!;
  const reimbursement = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? damage.amount * REDUCED_REIMBURSEMENT_PERCENT / PERCENT
    : damage.amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function validateDamages(policy: Policy, damages: ClaimStep["incident"]["damages"]): void {
  const negativeDamage = damages.find((damage) => damage.amount < 0);
  if (negativeDamage) throw new Error(`Invalid damage amount: ${negativeDamage.amount}`);
  const excessiveDamage = damages.find((damage) => {
    const insuredCount = policy.items.filter((item) => item.type === damage.itemType).length;
    const damageCount = damages.filter((entry) => entry.itemType === damage.itemType).length;
    return damageCount > insuredCount;
  });
  if (excessiveDamage) throw new Error(`Damage exceeds insured ${excessiveDamage.itemType} count`);
}

function settleClaim(policy: Policy, damages: ClaimStep["incident"]["damages"]): Result {
  validateDamages(policy, damages);
  const desired = damages.reduce((sum, damage) => sum + damagePayout(policy, damage), 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount++);
      policies.set(index, createPolicy(step.items));
      results.push({ premium });
      return;
    }
    const policy = policies.get(step.policy)!;
    results.push(settleClaim(policy, step.incident.damages));
  });
  return { results };
}
