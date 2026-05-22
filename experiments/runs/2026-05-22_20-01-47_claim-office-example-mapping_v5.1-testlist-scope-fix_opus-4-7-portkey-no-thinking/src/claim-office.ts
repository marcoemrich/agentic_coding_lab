interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}
type Step = QuoteStep | ClaimStep;
interface QuoteStep {
  op: "quote";
  items: Item[];
}
interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
interface Damage {
  itemType: string;
  amount: number;
}
interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;
const MAIN_ITEM_BASE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const COMPONENT_BASE_PER_UNIT = 25;
const COMPONENT_BLOCK_BASE = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const MAIN_ITEM_INSURANCE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;
const DRAGON_MATERIAL = "dragon";

interface PricedItem {
  item: Item;
  base: number;
}

function componentBaseForCount(count: number): number {
  if (count === 3) return COMPONENT_BLOCK_BASE;
  return count * COMPONENT_BASE_PER_UNIT;
}

function priceItems(items: Item[]): PricedItem[] {
  const priced: PricedItem[] = [];
  const componentBuckets: Record<string, Item[]> = {};
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      (componentBuckets[item.type] ??= []).push(item);
    } else if (item.type in MAIN_ITEM_BASE) {
      priced.push({ item, base: MAIN_ITEM_BASE[item.type] });
    } else {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
  for (const [, bucket] of Object.entries(componentBuckets)) {
    const groupBase = componentBaseForCount(bucket.length);
    const perItem = groupBase / bucket.length;
    for (const item of bucket) priced.push({ item, base: perItem });
  }
  return priced;
}

function itemSurcharge(priced: PricedItem): number {
  let surcharge = 0;
  if (priced.item.cursed) surcharge += priced.base * CURSE_SURCHARGE;
  if ((priced.item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += priced.base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

function policyModifierRate(customer: { yearsWithMHPCO: number }, stepIndex: number): number {
  let rate = FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) rate -= LOYALTY_DISCOUNT;
  if (stepIndex >= 1) rate -= FOLLOW_UP_DISCOUNT;
  return rate;
}

function computeQuote(
  step: QuoteStep,
  customer: { yearsWithMHPCO: number },
  stepIndex: number,
): { premium: number } {
  const priced = priceItems(step.items);
  const policyBase = priced.reduce((sum, p) => sum + p.base, 0);
  const itemSurcharges = priced.reduce((sum, p) => sum + itemSurcharge(p), 0);
  const policyModifiers = policyBase * policyModifierRate(customer, stepIndex);
  const premium = policyBase + itemSurcharges + policyModifiers + PROCESSING_FEE;
  return { premium: Math.ceil(premium) };
}

function itemInsuranceValue(item: Item): number {
  if (COMPONENT_TYPES.has(item.type)) return COMPONENT_INSURANCE;
  if (item.type in MAIN_ITEM_INSURANCE) return MAIN_ITEM_INSURANCE[item.type];
  throw new Error(`unknown item type: ${item.type}`);
}

interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

function createPolicy(step: QuoteStep): Policy {
  const insuranceSum = step.items.reduce((sum, it) => sum + itemInsuranceValue(it), 0);
  return { items: step.items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function reimbursableAmount(item: Item, damageAmount: number): number {
  const highEnch = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
  const dragon = item.material === DRAGON_MATERIAL;
  if (highEnch) return damageAmount * HIGH_ENCHANTMENT_CLAIM_RATE;
  if (dragon) return damageAmount;
  return damageAmount;
}

function computeClaim(step: ClaimStep, policy: Policy): { payout: number; remainingCap: number } {
  const availableByType: Record<string, Item[]> = {};
  for (const item of policy.items) (availableByType[item.type] ??= []).push(item);
  let totalPayout = 0;
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) throw new Error(`negative damage amount: ${damage.amount}`);
    const pool = availableByType[damage.itemType];
    if (!pool || pool.length === 0) {
      throw new Error(`damage references item not in policy: ${damage.itemType}`);
    }
    const item = pool.shift()!;
    const reimbursable = reimbursableAmount(item, damage.amount);
    const afterDeductible = reimbursable - DEDUCTIBLE;
    totalPayout += Math.max(0, afterDeductible);
  }
  const cappedPayout = Math.min(totalPayout, policy.remainingCap);
  const finalPayout = Math.floor(cappedPayout);
  policy.remainingCap -= finalPayout;
  return { payout: finalPayout, remainingCap: policy.remainingCap };
}

export function runScenario(input: Scenario): unknown {
  const policies: Record<number, Policy> = {};
  const results = input.steps.map((step, i) => {
    if (step.op === "quote") {
      policies[i] = createPolicy(step);
      return computeQuote(step, input.customer, i);
    }
    const policy = policies[step.policy];
    return computeClaim(step, policy);
  });
  return { results };
}
