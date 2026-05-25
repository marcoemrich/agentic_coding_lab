interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Incident {
  cause: string;
  damages: Damage[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

type StepResult = QuoteResult | ClaimResult;

interface ScenarioResult {
  results: StepResult[];
}

const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const MAIN_ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_DAMAGE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_DAMAGE_FACTOR = 0.5;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT = 0.15;

function isComponent(item: QuoteItem): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function mainItemBase(item: QuoteItem): number {
  return MAIN_ITEM_BASE_PREMIUMS[item.type] ?? 0;
}

function itemSurcharges(item: QuoteItem): number {
  const base = mainItemBase(item);
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * CURSE_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

function componentsBasePremium(items: QuoteItem[]): number {
  // Group by type and apply block discount only when exactly BLOCK_SIZE alike.
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  let total = 0;
  for (const count of counts.values()) {
    if (count === BLOCK_SIZE) {
      total += BLOCK_BASE_PREMIUM;
    } else {
      total += count * COMPONENT_BASE_PREMIUM;
    }
  }
  return total;
}

interface Customer {
  yearsWithMHPCO: number;
}

function isKnownItem(item: QuoteItem): boolean {
  return isComponent(item) || item.type in MAIN_ITEM_BASE_PREMIUMS;
}

function calculateQuote(
  step: QuoteStep,
  customer: Customer,
  priorQuoteCount: number,
): QuoteResult {
  for (const item of step.items) {
    if (!isKnownItem(item)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  const mainItems = step.items.filter((item) => !isComponent(item));
  const componentItems = step.items.filter(isComponent);

  const mainBase = mainItems.reduce((sum, item) => sum + mainItemBase(item), 0);
  const componentBase = componentsBasePremium(componentItems);
  const policyBase = mainBase + componentBase;

  const itemSurchargeTotal = mainItems.reduce(
    (sum, item) => sum + itemSurcharges(item),
    0,
  );

  const firstInsurance = policyBase * FIRST_INSURANCE_SURCHARGE;
  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
      ? policyBase * LOYALTY_DISCOUNT
      : 0;
  const followUp =
    priorQuoteCount > 0 ? policyBase * FOLLOW_UP_DISCOUNT : 0;

  const premium =
    policyBase +
    itemSurchargeTotal +
    firstInsurance -
    loyalty -
    followUp +
    PROCESSING_FEE;
  return { premium: Math.ceil(premium) };
}

function itemInsuranceValue(item: QuoteItem): number {
  if (isComponent(item)) return COMPONENT_INSURANCE_VALUE;
  return MAIN_ITEM_INSURANCE_VALUES[item.type] ?? 0;
}

function policyInsuranceSum(items: QuoteItem[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

interface Policy {
  items: QuoteItem[];
  remainingCap: number;
}

function reimbursementAmount(damage: Damage, item: QuoteItem): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_DAMAGE_THRESHOLD) {
    return damage.amount * HIGH_ENCHANTMENT_DAMAGE_FACTOR;
  }
  // Dragon material is fully reimbursed; standard is also full reimbursement.
  return damage.amount;
}

function findItemForDamage(damage: Damage, policy: Policy): QuoteItem | undefined {
  return policy.items.find((it) => it.type === damage.itemType);
}

function countByType(items: { type?: string; itemType?: string }[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = item.type ?? item.itemType ?? "";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function validateClaimAgainstPolicy(step: ClaimStep, policy: Policy): void {
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative, got ${damage.amount}`);
    }
  }
  const policyCounts = countByType(policy.items);
  const damageCounts = countByType(step.incident.damages);
  for (const [type, count] of damageCounts) {
    if ((policyCounts.get(type) ?? 0) < count) {
      throw new Error(
        `Claim references ${count} ${type} damage(s) but policy covers only ${policyCounts.get(type) ?? 0}`,
      );
    }
  }
}

function processClaim(step: ClaimStep, policies: Map<number, Policy>): ClaimResult {
  const policy = policies.get(step.policy);
  if (!policy) {
    throw new Error(`Policy at step ${step.policy} not found`);
  }
  validateClaimAgainstPolicy(step, policy);
  let totalPayout = 0;
  for (const damage of step.incident.damages) {
    const item = findItemForDamage(damage, policy);
    if (!item) {
      throw new Error(
        `Damage references item type ${damage.itemType} not in policy`,
      );
    }
    const reimbursable = reimbursementAmount(damage, item) - DEDUCTIBLE;
    if (reimbursable > 0) totalPayout += reimbursable;
  }
  const actualPayout = Math.min(totalPayout, policy.remainingCap);
  const roundedPayout = Math.floor(actualPayout);
  policy.remainingCap -= roundedPayout;
  return { payout: roundedPayout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  let priorQuoteCount = 0;
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push(calculateQuote(step, scenario.customer, priorQuoteCount));
      const cap = policyInsuranceSum(step.items) * CAP_MULTIPLIER;
      policies.set(index, {
        items: step.items,
        remainingCap: cap,
      });
      priorQuoteCount++;
    } else if (step.op === "claim") {
      results.push(processClaim(step, policies));
    }
  });
  return { results };
}
