// ─── Public types ──────────────────────────────────────────────────────────

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioOutput {
  results: StepResult[];
}

// ─── Price list (MHPCO bureaucracy) ────────────────────────────────────────

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_UNIT_PREMIUM = 25;
const COMPONENT_BUNDLE_PREMIUM = 60;
const COMPONENT_BUNDLE_SIZE = 3;

// ─── Quote constants ──────────────────────────────────────────────────────

const PROCESSING_FEE = 5;
const CURSED_SURCHARGE = 1.5;
const HIGH_ENCHANTMENT_SURCHARGE = 1.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const INITIAL_ASSESSMENT_SURCHARGE = 1.1;
const AFTER_FIRST_DISCOUNT = 0.85;
const LOYALTY_DISCOUNT = 0.8;
const LOYALTY_MIN_YEARS = 2;

// ─── Claim constants ──────────────────────────────────────────────────────

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const DRAGON_MATERIAL = "dragon";

// ─── Shared helpers ───────────────────────────────────────────────────────

const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

// Round up to whole G "in MHPCO's favor"; epsilon strips FP artifacts.
const roundInFavor = (amount: number): number => Math.ceil(amount - 1e-9);

// ─── Quoting ──────────────────────────────────────────────────────────────

const itemRiskAdjustedPremium = (item: Item): number => {
  let premium = BASE_PREMIUM_BY_TYPE[item.type] ?? 0;
  if (item.cursed) premium *= CURSED_SURCHARGE;
  if (enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD) premium *= HIGH_ENCHANTMENT_SURCHARGE;
  return premium;
};

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const componentGroupPremium = (count: number): number => {
  const bundles = Math.floor(count / COMPONENT_BUNDLE_SIZE);
  const singles = count % COMPONENT_BUNDLE_SIZE;
  return bundles * COMPONENT_BUNDLE_PREMIUM + singles * COMPONENT_UNIT_PREMIUM;
};

const itemsBasePremium = (items: Item[]): number => {
  const componentCounts: Record<string, number> = {};
  let total = 0;
  for (const item of items) {
    if (isComponent(item)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      total += itemRiskAdjustedPremium(item);
    }
  }
  for (const count of Object.values(componentCounts)) {
    total += componentGroupPremium(count);
  }
  return total;
};

const contractAdjustmentFor = (quoteIndex: number): number =>
  quoteIndex === 0 ? INITIAL_ASSESSMENT_SURCHARGE : AFTER_FIRST_DISCOUNT;

const loyaltyFactor = (customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS ? LOYALTY_DISCOUNT : 1;

const quotePremium = (step: QuoteStep, customer: Customer, quoteIndex: number): QuoteResult => {
  const itemsSum = itemsBasePremium(step.items);
  const adjusted = itemsSum * contractAdjustmentFor(quoteIndex) * loyaltyFactor(customer);
  return { premium: roundInFavor(adjusted) + PROCESSING_FEE };
};

// ─── Claims ───────────────────────────────────────────────────────────────

interface PolicyState {
  items: Item[];
  remainingCap: number;
}

const policyInsuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + (INSURANCE_VALUE_BY_TYPE[item.type] ?? 0), 0);

const isDragonMaterial = (item: Item): boolean => item.material === DRAGON_MATERIAL;
const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentLevel(item) >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD;

const reimbursementRate = (item: Item | undefined): number => {
  if (!item) return 1;
  if (isDragonMaterial(item)) return 1;
  if (isHighlyEnchanted(item)) return CLAIM_HIGH_ENCHANTMENT_REIMBURSEMENT;
  return 1;
};

const reimbursableAmount = (damage: Damage, items: Item[]): number => {
  const item = items.find((i) => i.type === damage.itemType);
  return damage.amount * reimbursementRate(item);
};

const claimResult = (step: ClaimStep, policy: PolicyState): ClaimResult => {
  const reimbursable = step.incident.damages.reduce(
    (s, d) => s + reimbursableAmount(d, policy.items),
    0,
  );
  const rawPayout = Math.max(reimbursable - DEDUCTIBLE, 0);
  const payout = Math.min(rawPayout, policy.remainingCap);
  const remainingCap = policy.remainingCap - payout;
  policy.remainingCap = remainingCap;
  return { payout, remainingCap };
};

// ─── Scenario dispatcher ──────────────────────────────────────────────────

export const runScenario = (scenario: Scenario): ScenarioOutput => {
  const results: StepResult[] = [];
  const policies: PolicyState[] = [];
  let quoteIndex = 0;
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      results.push(quotePremium(step, scenario.customer, quoteIndex));
      policies.push({
        items: step.items,
        remainingCap: CAP_MULTIPLIER * policyInsuranceSum(step.items),
      });
      quoteIndex += 1;
    } else {
      results.push(claimResult(step, policies[step.policy]));
    }
  }
  return { results };
};
