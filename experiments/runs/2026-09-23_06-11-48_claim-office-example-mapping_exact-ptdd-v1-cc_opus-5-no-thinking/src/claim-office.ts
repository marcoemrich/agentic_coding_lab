const PROCESSING_FEE = 5;
const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_FACTOR = 2;
const REDUCED_REIMBURSEMENT = 0.5;
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const COMPONENT_BASE_PREMIUM = 25;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];

const COMPONENT_INSURANCE_VALUE = 250;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: COMPONENT_INSURANCE_VALUE,
  moonstone: COMPONENT_INSURANCE_VALUE,
};

const PRICE_LIST: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
};

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
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

export interface ScenarioResults {
  results: StepResult[];
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function basePremiumOf(item: Item): number {
  const basePremium = PRICE_LIST[item.type];
  if (basePremium === undefined) {
    throw new Error(`MHPCO does not insure items of type ${item.type}`);
  }
  return basePremium;
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function componentGroupBasePremium(type: string, count: number): number {
  if (count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return count * basePremiumOf({ type });
}

function policyBasePremium(items: Item[]): number {
  const components = items.filter((item) => COMPONENT_TYPES.includes(item.type));
  const mainItems = items.filter((item) => !COMPONENT_TYPES.includes(item.type));
  let total = mainItems.reduce((sum, item) => sum + basePremiumOf(item), 0);
  for (const [type, count] of countByType(components)) {
    total += componentGroupBasePremium(type, count);
  }
  return total;
}

function roundPremiumInMHPCOsFavour(premium: number): number {
  return Math.ceil(premium);
}

function roundPayoutInMHPCOsFavour(payout: number): number {
  return Math.floor(payout);
}

function insuranceSumOf(items: Item[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
}

function reimbursementRateFor(item: Item): number {
  if ((item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL) {
    return REDUCED_REIMBURSEMENT;
  }
  return 1;
}

function payoutForDamage(damage: Damage, item: Item): number {
  if (damage.amount < 0) {
    throw new Error(`Damage amount ${damage.amount} is not a valid loss`);
  }
  const reimbursed = damage.amount * reimbursementRateFor(item);
  return Math.max(0, reimbursed - DEDUCTIBLE_PER_DAMAGE);
}

function claimDamagedItem(uncovered: Item[], damage: Damage): Item {
  const index = uncovered.findIndex((candidate) => candidate.type === damage.itemType);
  if (index === -1) {
    throw new Error(`Item ${damage.itemType} is not covered by this policy`);
  }
  return uncovered.splice(index, 1)[0];
}

function settleClaim(step: ClaimStep, policy: Policy): ClaimResult {
  const unclaimed = [...policy.items];
  const desired = step.incident.damages.reduce(
    (sum, damage) => sum + payoutForDamage(damage, claimDamagedItem(unclaimed, damage)),
    0,
  );
  const payout = roundPayoutInMHPCOsFavour(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function surchargeRateFor(item: Item): number {
  const curse = item.cursed === true ? CURSE_SURCHARGE : 0;
  const enchantment = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE : 0;
  return curse + enchantment;
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => sum + basePremiumOf(item) * surchargeRateFor(item), 0);
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function policyModifierRate(customer: Customer, previousContracts: number): number {
  const loyalty = isLongStanding(customer) ? -LOYALTY_DISCOUNT : 0;
  const followUp = previousContracts > 0 ? -FOLLOW_UP_CONTRACT_DISCOUNT : 0;
  return FIRST_INSURANCE_SURCHARGE + loyalty + followUp;
}

function premiumFor(step: QuoteStep, customer: Customer, previousContracts: number): number {
  const policyBase = policyBasePremium(step.items);
  const policyModifiers = policyBase * policyModifierRate(customer, previousContracts);
  const surcharges = itemSurcharges(step.items);
  return roundPremiumInMHPCOsFavour(policyBase + surcharges + policyModifiers + PROCESSING_FEE);
}

export function runScenario(scenario: Scenario): ScenarioResults {
  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push({ premium: premiumFor(step, scenario.customer, policies.size) });
      policies.set(index, {
        items: step.items,
        remainingCap: insuranceSumOf(step.items) * CAP_FACTOR,
      });
      return;
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`No policy created by step ${step.policy}`);
    }
    results.push(settleClaim(step, policy));
  });

  return { results };
}
