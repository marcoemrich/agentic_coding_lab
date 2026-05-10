type Item = { type: string; cursed?: boolean; enchantment?: number };
type Customer = { yearsWithMHPCO: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Array<Damage> };
type Step = { op: string; items?: Array<Item>; policy?: number; incident?: Incident };
type Scenario = { customer?: Customer; steps: Array<Step> };

const DEDUCTIBLE_PER_DAMAGE = 100;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;

function computeInsuranceSum(items: Array<Item>): number {
  return items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
}

function withFirstInsuranceSurcharge(basePremium: number): number {
  return basePremium + basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
}

function surchargeIf(condition: boolean, basePremium: number, rate: number): number {
  return condition ? basePremium * rate : 0;
}

function hasEnchantmentAtLeast(item: Item | undefined, threshold: number): boolean {
  return (item?.enchantment ?? 0) >= threshold;
}

function getBasePremium(itemType: string): number {
  const basePremium = BASE_PREMIUMS[itemType];
  if (basePremium === undefined) {
    throw new Error(`Unknown item type: ${itemType}`);
  }
  return basePremium;
}

function quoteItem(item: Item): number {
  const basePremium = getBasePremium(item.type);
  const cursedSurcharge = surchargeIf(item.cursed === true, basePremium, CURSED_SURCHARGE_RATE);
  const highEnchantmentSurcharge = surchargeIf(
    hasEnchantmentAtLeast(item, HIGH_ENCHANTMENT_THRESHOLD),
    basePremium,
    HIGH_ENCHANTMENT_SURCHARGE_RATE,
  );
  return withFirstInsuranceSurcharge(basePremium) + cursedSurcharge + highEnchantmentSurcharge;
}

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_OF_THREE_BASE = 60;

function countBy<T>(values: Array<T>, keyOf: (value: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const value of values) {
    const key = keyOf(value);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

function countByType(items: Array<Item>): Record<string, number> {
  return countBy(items, (item) => item.type);
}

function isLoyalCustomer(customer: Customer | undefined): boolean {
  return (customer?.yearsWithMHPCO ?? 0) >= LOYALTY_YEARS_THRESHOLD;
}

function quoteItems(items: Array<Item>): { itemsPremium: number; sumOfBases: number } {
  const counts = countByType(items);
  let itemsPremium = 0;
  let sumOfBases = 0;
  const bundledTypes = new Set<string>();

  for (const componentType of COMPONENT_TYPES) {
    if (counts[componentType] === 3) {
      itemsPremium += withFirstInsuranceSurcharge(BLOCK_OF_THREE_BASE);
      sumOfBases += BLOCK_OF_THREE_BASE;
      bundledTypes.add(componentType);
    }
  }

  for (const item of items) {
    if (bundledTypes.has(item.type)) continue;
    itemsPremium += quoteItem(item);
    sumOfBases += getBasePremium(item.type);
  }

  return { itemsPremium, sumOfBases };
}

type Policy = { items: Array<Item>; capRemaining: number };

const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function computeDamagePayout(damage: Damage, policy: Policy | undefined): number {
  const item = policy?.items.find((i) => i.type === damage.itemType);
  const reimbursableAmount = hasEnchantmentAtLeast(item, HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD)
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;
  return Math.max(0, reimbursableAmount - DEDUCTIBLE_PER_DAMAGE);
}

function computePayout(incident: Incident | undefined, policy: Policy | undefined): number {
  const damages = incident?.damages ?? [];
  return damages.reduce((total, damage) => total + computeDamagePayout(damage, policy), 0);
}

type StepResult = { premium?: number; payout?: number; remainingCap?: number };

function assertDamageAmountIsNonNegative(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
}

function assertDamageIsCoveredByPolicy(damage: Damage, policy: Policy | undefined): void {
  if (!policy?.items.some((item) => item.type === damage.itemType)) {
    throw new Error(`Item type not in policy: ${damage.itemType}`);
  }
}

function assertDamageCountsDoNotExceedPolicy(
  incident: Incident | undefined,
  policy: Policy | undefined,
): void {
  const damageCounts = countBy(incident?.damages ?? [], (damage) => damage.itemType);
  const policyCounts = countByType(policy?.items ?? []);
  for (const [itemType, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[itemType] ?? 0)) {
      throw new Error(`More damages than items of type ${itemType} in policy`);
    }
  }
}

function assertDamagesAreValid(incident: Incident | undefined, policy: Policy | undefined): void {
  const damages = incident?.damages ?? [];
  for (const damage of damages) {
    assertDamageAmountIsNonNegative(damage);
    assertDamageIsCoveredByPolicy(damage, policy);
  }
  assertDamageCountsDoNotExceedPolicy(incident, policy);
}

function handleClaim(step: Step, policies: Map<number, Policy>): StepResult {
  const policy = policies.get(step.policy ?? 0);
  assertDamagesAreValid(step.incident, policy);
  const desired = Math.floor(computePayout(step.incident, policy));
  const capRemaining = policy?.capRemaining ?? Infinity;
  const actualPayout = Math.min(desired, capRemaining);
  const newCapRemaining = capRemaining - actualPayout;
  if (policy) policy.capRemaining = newCapRemaining;
  return { payout: actualPayout, remainingCap: newCapRemaining };
}

function handleQuote(
  step: Step,
  stepIndex: number,
  customer: Customer | undefined,
  policies: Map<number, Policy>,
): StepResult {
  const items = step.items ?? [];
  policies.set(stepIndex, {
    items,
    capRemaining: CAP_MULTIPLIER * computeInsuranceSum(items),
  });
  const { itemsPremium, sumOfBases } = quoteItems(items);
  const loyaltyDiscount = isLoyalCustomer(customer) ? sumOfBases * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = stepIndex >= 1 ? sumOfBases * FOLLOWUP_DISCOUNT_RATE : 0;
  const premium = Math.ceil(itemsPremium - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
  return { premium };
}

export function processScenario(scenario: unknown): { results: Array<StepResult> } {
  const { customer, steps } = scenario as Scenario;
  const policies = new Map<number, Policy>();
  const results = steps.map((step, stepIndex) =>
    step.op === "claim"
      ? handleClaim(step, policies)
      : handleQuote(step, stepIndex, customer, policies),
  );
  return { results };
}
