export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

const PROCESSING_FEE = 5;
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
};

function basePremiumFor(type: string): number {
  const basePremium = BASE_PREMIUMS[type];
  if (basePremium === undefined) {
    throw new Error(`The MHPCO does not insure items of type "${type}".`);
  }
  return basePremium;
}

const COMPONENT_INSURANCE_VALUE = 250;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: COMPONENT_INSURANCE_VALUE,
  moonstone: COMPONENT_INSURANCE_VALUE,
};

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function basePremiumForAlikeItems(type: string, count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * basePremiumFor(type);
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function surchargeRateFor(item: Item): number {
  const curse = item.cursed === true ? CURSE_SURCHARGE_RATE : 0;
  const enchantment = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return curse + enchantment;
}

function itemSurcharges(items: Item[]): number {
  return items.reduce(
    (total, item) => total + basePremiumFor(item.type) * surchargeRateFor(item),
    0,
  );
}

function isLoyal(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;
}

function policyModifierRate(customer: Customer, previousContracts: number): number {
  const loyalty = isLoyal(customer) ? -LOYALTY_DISCOUNT_RATE : 0;
  const followUp = previousContracts > 0 ? -FOLLOW_UP_DISCOUNT_RATE : 0;
  return loyalty + followUp + FIRST_INSURANCE_SURCHARGE_RATE;
}

export function quote(customer: Customer, items: Item[], previousContracts = 0): number {
  let policyBasePremium = 0;
  for (const [type, count] of countByType(items)) {
    policyBasePremium += basePremiumForAlikeItems(type, count);
  }
  const policyModifiers = policyBasePremium * policyModifierRate(customer, previousContracts);
  return policyBasePremium + itemSurcharges(items) + policyModifiers + PROCESSING_FEE;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Step {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: Incident;
}

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

function roundPremiumInMHPCOsFavour(premium: number): number {
  return Math.ceil(premium);
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const REDUCED_REIMBURSEMENT_THRESHOLD = 8;
const FULL_REIMBURSEMENT_RATE = 1;

interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0);
}

// The high-enchantment clause is tested first: where it meets the dragon-material
// clause, the 50 % rule wins. Dragon material reimburses in full, as does the
// standard case, so both reach FULL_REIMBURSEMENT_RATE.
function reimbursementRateFor(item: Item | undefined): number {
  if ((item?.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_THRESHOLD) {
    return REDUCED_REIMBURSEMENT_RATE;
  }
  return FULL_REIMBURSEMENT_RATE;
}

function payoutFor(damage: Damage, item: Item | undefined): number {
  return damage.amount * reimbursementRateFor(item) - DEDUCTIBLE;
}

function assertDamageAmountsArePositive(incident: Incident): void {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`A damage amount cannot be negative: ${damage.amount}.`);
    }
  }
}

function assertDamagesAreCovered(incident: Incident, policy: Policy): void {
  const insuredCounts = countByType(policy.items);
  for (const [itemType, damaged] of countByType(
    incident.damages.map((damage) => ({ type: damage.itemType })),
  )) {
    if (damaged > (insuredCounts.get(itemType) ?? 0)) {
      throw new Error(
        `The policy does not cover ${damaged} damaged item(s) of type "${itemType}".`,
      );
    }
  }
}

function roundPayoutInMHPCOsFavour(payout: number): number {
  return Math.floor(payout);
}

function settleClaim(incident: Incident, policy: Policy): ClaimResult {
  assertDamageAmountsArePositive(incident);
  assertDamagesAreCovered(incident, policy);

  const desiredPayout = incident.damages.reduce(
    (total, damage) =>
      total + payoutFor(damage, policy.items.find((item) => item.type === damage.itemType)),
    0,
  );
  const payout = roundPayoutInMHPCOsFavour(Math.min(desiredPayout, policy.remainingCap));
  return { payout, remainingCap: policy.remainingCap - payout };
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  let contracts = 0;
  const policies = new Map<number, Policy>();

  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "quote") {
      const items = step.items ?? [];
      const premium = quote(scenario.customer, items, contracts);
      contracts += 1;
      policies.set(index, { items, remainingCap: insuranceSum(items) * CAP_MULTIPLE });
      return { premium: roundPremiumInMHPCOsFavour(premium) };
    }

    const policyIndex = step.policy ?? 0;
    const incident = step.incident ?? { cause: "", damages: [] };
    const policy = policies.get(policyIndex) ?? { items: [], remainingCap: 0 };
    const result = settleClaim(incident, policy);
    policies.set(policyIndex, { ...policy, remainingCap: result.remainingCap });
    return result;
  });

  return { results };
}
