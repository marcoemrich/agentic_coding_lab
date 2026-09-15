type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { damages: Damage[] } };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type Result = QuoteResult | ClaimResult;
type Policy = { items: Item[]; remainingCap: number };

const BASE_PREMIUMS: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const INSURANCE_VALUES: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_DIVISOR = 10;
const CURSE_SURCHARGE_DIVISOR = 2;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_DIVISOR = 5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const ENCHANTMENT_SURCHARGE_PERCENT = 30;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const PERCENT = 100;
const DEDUCTIBLE = 100;
const POLICY_CAP_MULTIPLIER = 2;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function policyBasePremium(items: Item[]): number {
  const counts = new Map<string, number>();
  items.forEach((item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1));
  return [...counts].reduce((total, [type, count]) => {
    if (COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE) return total + COMPONENT_BLOCK_PREMIUM;
    return total + BASE_PREMIUMS[type] * count;
  }, 0);
}

function itemRiskSurcharge(items: Item[]): number {
  return items.reduce((total, item) => {
    const basePremium = BASE_PREMIUMS[item.type];
    const curse = item.cursed ? basePremium / CURSE_SURCHARGE_DIVISOR : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? basePremium * ENCHANTMENT_SURCHARGE_PERCENT / PERCENT : 0;
    return total + curse + enchantment;
  }, 0);
}

function quote(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): QuoteResult {
  const basePremium = policyBasePremium(items);
  const initialAssessment = basePremium / INITIAL_ASSESSMENT_DIVISOR;
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium / LOYALTY_DISCOUNT_DIVISOR : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_PERCENT / PERCENT : 0;
  return { premium: Math.ceil(basePremium + initialAssessment + itemRiskSurcharge(items) - loyaltyDiscount - followUpDiscount + PROCESSING_FEE) };
}

function openPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((total, item) => {
    if (!(item.type in INSURANCE_VALUES)) throw new Error(`Unknown item type: ${item.type}`);
    return total + INSURANCE_VALUES[item.type];
  }, 0);
  return { items, remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER };
}

function reimbursableDamage(item: Item, amount: number): number {
  return (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL ? amount / POLICY_CAP_MULTIPLIER : amount;
}

function claim(step: ClaimStep, policy: Policy): ClaimResult {
  const availableItems = [...policy.items];
  const desired = step.incident.damages.reduce((total, damage) => {
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
    if (!(damage.itemType in INSURANCE_VALUES)) throw new Error(`Unknown damage item type: ${damage.itemType}`);
    const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Damage to ${damage.itemType} exceeds insured items`);
    const [item] = availableItems.splice(itemIndex, 1);
    return total + Math.max(0, reimbursableDamage(item, damage.amount) - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(input: unknown): { results: Result[] } {
  const scenario = input as Scenario;
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === "quote") {
      policies.set(index, openPolicy(step.items));
      const result = quote(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
      quoteCount += 1;
      return result;
    }
    return claim(step, policies.get(step.policy)!);
  });
  return { results };
}
