// MHPCO Claim Office: prices insurance quotes and pays out claims.
// The scenario engine in runScenario walks a sequence of quote/claim
// steps; quotes create policies (kept in PolicyRegistry by step index)
// and claims draw down each policy's remainingCap.

// ---------- Types ----------

type ItemType = "sword" | "amulet" | "staff" | "potion" | "rune" | "moonstone";
type Item = { type: ItemType; cursed?: boolean; enchantment?: number; material?: string };
type Damage = { itemType: ItemType; amount: number };

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;

type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };

// A policy is the underwriting record created by a quote step.
// Carries items + remainingCap that must persist across claim events.
type Policy = { items: Item[]; remainingCap: number };

// ---------- Pricing constants ----------

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_RATE = 0.2;

const FOLLOW_UP_CONTRACT_RATE = 0.15;

const BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES: ItemType[] = ["rune", "moonstone"];

const BASE_PREMIUM: Record<ItemType, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// ---------- Claim constants ----------

const INSURANCE_VALUE: Record<ItemType, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;
// Deductible applied to each damage event independently (per the spec: "deductible per damage event")
const DEDUCTIBLE_PER_DAMAGE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

// ---------- Generic helpers ----------

function countBy<T, K>(items: T[], keyOf: (item: T) => K): Map<K, number> {
  const counts = new Map<K, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function countItemsByType(items: Item[]): Map<ItemType, number> {
  return countBy(items, (item) => item.type);
}

// ---------- Premium calculation ----------

function isComponentBlock(type: ItemType, count: number): boolean {
  return COMPONENT_TYPES.includes(type) && count === BLOCK_SIZE;
}

function basePremiumForGroup(type: ItemType, count: number): number {
  if (isComponentBlock(type, count)) return COMPONENT_BLOCK_PREMIUM;
  return count * BASE_PREMIUM[type];
}

function calculateBasePremium(items: Item[]): number {
  let total = 0;
  for (const [type, count] of countItemsByType(items)) {
    total += basePremiumForGroup(type, count);
  }
  return total;
}

// MHPCO rounds premiums in its own favor: always up to the next whole gold piece.
function roundPremiumInMHPCOFavor(amount: number): number {
  return Math.ceil(amount);
}

// MHPCO rounds payouts in its own favor: always down to the previous whole gold piece.
function roundPayoutInMHPCOFavor(amount: number): number {
  return Math.floor(amount);
}

function enchantmentLevel(item: Item): number {
  return item.enchantment ?? 0;
}

function curseSurcharge(item: Item): number {
  return item.cursed ? BASE_PREMIUM[item.type] * CURSE_RATE : 0;
}

function highEnchantmentSurcharge(item: Item): number {
  if (enchantmentLevel(item) < HIGH_ENCHANTMENT_THRESHOLD) return 0;
  return BASE_PREMIUM[item.type] * HIGH_ENCHANTMENT_RATE;
}

function itemSurcharge(item: Item): number {
  return curseSurcharge(item) + highEnchantmentSurcharge(item);
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((total, item) => total + itemSurcharge(item), 0);
}

function loyaltyDiscount(basePremium: number, customer: Customer): number {
  if (customer.yearsWithMHPCO < LOYALTY_THRESHOLD_YEARS) return 0;
  return basePremium * LOYALTY_RATE;
}

function followUpContractDiscount(basePremium: number, quoteNumber: number): number {
  if (quoteNumber === 0) return 0;
  return basePremium * FOLLOW_UP_CONTRACT_RATE;
}

function policyDiscounts(
  basePremium: number,
  customer: Customer,
  quoteNumber: number,
): number {
  return loyaltyDiscount(basePremium, customer) + followUpContractDiscount(basePremium, quoteNumber);
}

function validateKnownItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function quoteStep(
  step: QuoteStep,
  customer: Customer,
  quoteNumber: number,
): { premium: number } {
  validateKnownItemTypes(step.items);
  const basePremium = calculateBasePremium(step.items);
  const surcharges = itemSurcharges(step.items);
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_RATE;
  const discounts = policyDiscounts(basePremium, customer, quoteNumber);
  const premium = basePremium + surcharges + firstInsuranceSurcharge - discounts + PROCESSING_FEE;
  return { premium: roundPremiumInMHPCOFavor(premium) };
}

// ---------- Policy creation ----------

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
}

function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: insuranceSum(items) * CAP_MULTIPLIER };
}

// ---------- Claim payout ----------

function reimbursableAmount(damage: Damage, item: Item): number {
  if (enchantmentLevel(item) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD) {
    return damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATE;
  }
  return damage.amount;
}

function payoutForDamage(damage: Damage, item: Item): number {
  return Math.max(0, reimbursableAmount(damage, item) - DEDUCTIBLE_PER_DAMAGE);
}

function findItem(items: Item[], itemType: ItemType): Item | undefined {
  return items.find((i) => i.type === itemType);
}

function payoutForDamageOnPolicy(damage: Damage, policy: Policy): number {
  const item = findItem(policy.items, damage.itemType);
  if (!item) return 0;
  return payoutForDamage(damage, item);
}

function validateNonNegativeDamageAmounts(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
}

function validateDamageCountsAgainstPolicy(damages: Damage[], policy: Policy): void {
  const insuredCounts = countItemsByType(policy.items);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [type, count] of damageCounts) {
    if ((insuredCounts.get(type) ?? 0) < count) {
      throw new Error(`More ${type} damages (${count}) than insured items`);
    }
  }
}

function validateDamagesAgainstPolicy(damages: Damage[], policy: Policy): void {
  validateNonNegativeDamageAmounts(damages);
  validateDamageCountsAgainstPolicy(damages, policy);
}

// Pure: computes what a claim would pay out and the resulting cap,
// without touching the input policy. runScenario is responsible for
// persisting the new cap into the registry.
function claimStep(
  step: ClaimStep,
  policy: Policy,
): { payout: number; remainingCap: number } {
  validateDamagesAgainstPolicy(step.incident.damages, policy);
  const rawPayout = step.incident.damages.reduce(
    (sum, damage) => sum + payoutForDamageOnPolicy(damage, policy),
    0,
  );
  const payout = roundPayoutInMHPCOFavor(Math.min(rawPayout, policy.remainingCap));
  return { payout, remainingCap: policy.remainingCap - payout };
}

// ---------- Scenario engine ----------

class PolicyRegistry {
  private readonly byStepIndex = new Map<number, Policy>();

  register(stepIndex: number, policy: Policy): void {
    this.byStepIndex.set(stepIndex, policy);
  }

  lookup(policyId: number): Policy {
    return this.byStepIndex.get(policyId) ?? createPolicy([]);
  }

  updateCap(policyId: number, remainingCap: number): void {
    const policy = this.byStepIndex.get(policyId);
    if (policy) policy.remainingCap = remainingCap;
  }
}

export function runScenario(input: unknown): unknown {
  const scenario = input as Scenario;
  const policies = new PolicyRegistry();
  let quoteNumber = 0;

  const handleQuote = (step: QuoteStep, stepIndex: number) => {
    policies.register(stepIndex, createPolicy(step.items));
    const result = quoteStep(step, scenario.customer, quoteNumber);
    quoteNumber += 1;
    return result;
  };

  const handleClaim = (step: ClaimStep) => {
    const result = claimStep(step, policies.lookup(step.policy));
    policies.updateCap(step.policy, result.remainingCap);
    return result;
  };

  const results = scenario.steps.map((step, stepIndex) =>
    step.op === "quote" ? handleQuote(step, stepIndex) : handleClaim(step),
  );
  return { results };
}
