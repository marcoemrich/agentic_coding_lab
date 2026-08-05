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

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

// The MHPCO only insures the item types on its price list.
const priceListPremiumFor = (type: string): number => {
  const basePremium = BASE_PREMIUMS[type];
  if (basePremium === undefined) {
    throw new Error(`the MHPCO does not insure items of type ${type}`);
  }
  return basePremium;
};

const countOccurrences = (values: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
};

const countItemsByType = (items: Item[]): Map<string, number> =>
  countOccurrences(items.map((item) => item.type));

const countDamagesByType = (damages: Damage[]): Map<string, number> =>
  countOccurrences(damages.map((damage) => damage.itemType));

// Exactly three alike components are insured together as one cheaper block.
const formsComponentBlock = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE;

const premiumForItemType = (type: string, count: number): number =>
  formsComponentBlock(type, count) ? COMPONENT_BLOCK_PREMIUM : count * priceListPremiumFor(type);

const policyBasePremiumFor = (items: Item[]): number =>
  [...countItemsByType(items)].reduce(
    (sum, [type, count]) => sum + premiumForItemType(type, count),
    0,
  );

// Premiums are rounded in the office's favour, i.e. up to whole gold.
const roundPremiumInOfficeFavour = (premium: number): number => Math.ceil(premium);

// Item-specific surcharge rates stack with each other.
const surchargeRateFor = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_RATE : 0) +
  ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);

// An item is surcharged on its own base premium, not on the whole policy.
const itemSurchargeFor = (item: Item): number =>
  priceListPremiumFor(item.type) * surchargeRateFor(item);

const itemSurchargesFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurchargeFor(item), 0);

// Policy-wide rates apply to the whole policy's base premium and stack additively;
// surcharges count positive, discounts negative.
const policyRateFor = (customer: Customer, isFollowUpContract: boolean): number =>
  FIRST_INSURANCE_SURCHARGE_RATE -
  (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? LOYALTY_DISCOUNT_RATE : 0) -
  (isFollowUpContract ? FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0);

const quotePremium = (items: Item[], customer: Customer, isFollowUpContract: boolean): number => {
  const basePremium = policyBasePremiumFor(items);
  return roundPremiumInOfficeFavour(
    basePremium +
      basePremium * policyRateFor(customer, isFollowUpContract) +
      itemSurchargesFor(items) +
      PROCESSING_FEE,
  );
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;

// An item is insured for ten times its base premium.
const INSURANCE_VALUE_MULTIPLIER = 10;

// Payouts are rounded in the office's favour, i.e. down to whole gold.
const roundPayoutInOfficeFavour = (payout: number): number => Math.floor(payout);

// The component block is a premium discount only: it does not lower what the
// items are insured for, so the insurance sum ignores blocks and counts each item.
const insuranceSumFor = (items: Item[]): number =>
  INSURANCE_VALUE_MULTIPLIER * items.reduce((sum, item) => sum + priceListPremiumFor(item.type), 0);

// A policy pays out at most twice the unmodified insurance sum of its items.
const capFor = (items: Item[]): number => CAP_MULTIPLIER * insuranceSumFor(items);

const HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

// Damage to a very highly enchanted item is only reimbursed by half.
const reimbursementRateFor = (item: Item | undefined): number =>
  (item?.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD
    ? HALF_REIMBURSEMENT_RATE
    : 1;

const damagedItemIn = (insuredItems: Item[], damage: Damage): Item | undefined =>
  insuredItems.find((item) => item.type === damage.itemType);

// The deductible is withheld once per damaged item, not once per incident.
const reimbursementFor = (damage: Damage, insuredItems: Item[]): number =>
  damage.amount * reimbursementRateFor(damagedItemIn(insuredItems, damage)) -
  DEDUCTIBLE_PER_DAMAGE;

// What the incident entitles the claimant to before the policy's cap is applied.
const reimbursementClaimedFor = (incident: Incident, insuredItems: Item[]): number =>
  roundPayoutInOfficeFavour(
    incident.damages.reduce((total, damage) => total + reimbursementFor(damage, insuredItems), 0),
  );

interface Policy {
  insuredItems: Item[];
  remainingCap: number;
}

const NO_POLICY: Policy = { insuredItems: [], remainingCap: 0 };

// A claim may not report more damaged items of a type than the policy covers.
const rejectMoreDamagesThanInsuredItems = (incident: Incident, insuredItems: Item[]): void => {
  const insuredCounts = countItemsByType(insuredItems);
  const damagedCounts = countDamagesByType(incident.damages);
  for (const [type, damagedCount] of damagedCounts) {
    if (damagedCount > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`the policy does not cover ${damagedCount} items of type ${type}`);
    }
  }
};

// A damage report must state a non-negative amount of damage.
const rejectNegativeDamageAmounts = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`a damage amount cannot be negative: ${damage.amount}`);
    }
  }
};

// A claim is checked for admissibility as a whole before any money is computed:
// the office never pays out on a report it would have refused.
const rejectInadmissibleClaim = (incident: Incident, insuredItems: Item[]): void => {
  rejectNegativeDamageAmounts(incident);
  rejectMoreDamagesThanInsuredItems(incident, insuredItems);
};

// A policy is identified by the index of the quote step that created it.
// Every quote after the customer's first one is a follow-up contract.
export const runScenario = (scenario: Scenario): ScenarioResults => {
  const policies = new Map<number, Policy>();

  const quote = (step: QuoteStep, policyId: number): QuoteResult => {
    policies.set(policyId, { insuredItems: step.items, remainingCap: capFor(step.items) });
    return { premium: quotePremium(step.items, scenario.customer, policyId > 0) };
  };

  const claim = (step: ClaimStep): ClaimResult => {
    const policy = policies.get(step.policy) ?? NO_POLICY;
    rejectInadmissibleClaim(step.incident, policy.insuredItems);
    const claimed = reimbursementClaimedFor(step.incident, policy.insuredItems);
    // A policy never pays out more than the cap it has left.
    const payout = Math.min(claimed, policy.remainingCap);
    const remainingCap = policy.remainingCap - payout;
    policies.set(step.policy, { ...policy, remainingCap });
    return { payout, remainingCap };
  };

  return {
    results: scenario.steps.map((step, stepIndex) =>
      step.op === "quote" ? quote(step, stepIndex) : claim(step),
    ),
  };
};
