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

export interface ScenarioOutput {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

// Money the MHPCO collects and money it pays out are both rounded to whole
// gold, always in the MHPCO's favor. That single rule points in opposite
// directions depending on which way the coin is travelling, so it gets one
// named function per direction rather than a bare Math.ceil/Math.floor at the
// call site: the name says *why*, the operator only says *what*.
const roundIncomingInMHPCOFavor = (amount: number): number => Math.ceil(amount);

const roundOutgoingInMHPCOFavor = (amount: number): number => Math.floor(amount);

// The price list: one row per insurable item type. The two numbers are
// independent columns — the premium is what the customer pays to insure the
// item, the insured value is what the MHPCO would owe for it.
interface ItemSpec {
  basePremium: number;
  insuredValue: number;
}

const ITEM_SPECS: Record<string, ItemSpec> = {
  sword: { basePremium: 100, insuredValue: 1000 },
  amulet: { basePremium: 60, insuredValue: 600 },
  staff: { basePremium: 80, insuredValue: 800 },
  potion: { basePremium: 40, insuredValue: 400 },
  rune: { basePremium: 25, insuredValue: 250 },
  moonstone: { basePremium: 25, insuredValue: 250 },
};

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

// Tallies a collection into "key → how many". Both the premium path (items by
// item type) and the claim path (damages by damaged type) ask this same
// question, they just reach for the key in a different field.
const countBy = <T>(values: T[], keyOf: (value: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = keyOf(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countItemsByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const countDamagesByType = (damages: Damage[]): Map<string, number> =>
  countBy(damages, (damage) => damage.itemType);

// The single point where an item type is resolved. Every price lookup goes
// through here, so an unknown type cannot slip into any calculation.
const specOfType = (type: string): ItemSpec => {
  const spec = ITEM_SPECS[type];
  if (spec === undefined) {
    throw new Error(`unknown item type: ${type}`);
  }
  return spec;
};

const basePremiumOfType = (type: string): number => specOfType(type).basePremium;

const insuredValueOfType = (type: string): number => specOfType(type).insuredValue;

const basePremiumOfAlikeItems = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * basePremiumOfType(type);

const policyBasePremium = (items: Item[]): number =>
  [...countItemsByType(items)].reduce(
    (total, [type, count]) => total + basePremiumOfAlikeItems(type, count),
    0,
  );

const firstInsuranceSurcharge = (policyBase: number): number =>
  policyBase * FIRST_INSURANCE_SURCHARGE_RATE;

const itemBasePremium = (item: Item): number => basePremiumOfType(item.type);

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const curseSurcharge = (item: Item): number =>
  isCursed(item) ? itemBasePremium(item) * CURSE_SURCHARGE_RATE : 0;

const highEnchantmentSurcharge = (item: Item): number =>
  isHighlyEnchanted(item)
    ? itemBasePremium(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;

const itemSurchargeTotal = (items: Item[]): number =>
  items.reduce(
    (total, item) => total + curseSurcharge(item) + highEnchantmentSurcharge(item),
    0,
  );

const loyaltyDiscount = (policyBase: number, customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
    ? policyBase * LOYALTY_DISCOUNT_RATE
    : 0;

const followUpContractDiscount = (policyBase: number, previousQuotes: number): number =>
  previousQuotes > 0 ? policyBase * FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0;

const policyWideAdjustments = (
  policyBase: number,
  customer: Customer,
  previousQuotes: number,
): number =>
  firstInsuranceSurcharge(policyBase) -
  loyaltyDiscount(policyBase, customer) -
  followUpContractDiscount(policyBase, previousQuotes);

const quote = (
  step: QuoteStep,
  customer: Customer,
  previousQuotes: number,
): QuoteResult => {
  const policyBase = policyBasePremium(step.items);
  // Intermediate amounts stay fractional; the premium is rounded once, here.
  const exactPremium =
    policyBase +
    itemSurchargeTotal(step.items) +
    policyWideAdjustments(policyBase, customer, previousQuotes) +
    PROCESSING_FEE;
  return { premium: roundIncomingInMHPCOFavor(exactPremium) };
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

const insuranceSum = (items: Item[]): number =>
  items.reduce((total, item) => total + insuredValueOfType(item.type), 0);

const isHalfCovered = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD;

// How much of the damage the policy covers, before the deductible is taken off.
const coveredAmount = (damage: Damage, item: Item): number =>
  isHalfCovered(item) ? damage.amount * HALF_REIMBURSEMENT_RATE : damage.amount;

const payoutForDamage = (damage: Damage, item: Item): number =>
  Math.max(0, coveredAmount(damage, item) - DEDUCTIBLE_PER_DAMAGE);

const damagedItem = (policy: Policy, damage: Damage): Item => {
  const item = policy.items.find((insured) => insured.type === damage.itemType);
  if (item === undefined) {
    throw new Error(`damaged item is not covered by the policy: ${damage.itemType}`);
  }
  return item;
};

// Every reason an incident can be rejected lives here, so the pricing functions
// below can assume they are working on a valid incident. Throws on the first
// problem found; nothing has been paid out or decremented at this point.
// Returns each damage paired with the insured item it resolved to, so the
// pricing pass does not have to look the items up a second time.
const validateIncident = (
  incident: Incident,
  policy: Policy,
): { damage: Damage; item: Item }[] => {
  const insuredCounts = countItemsByType(policy.items);
  for (const [type, damaged] of countDamagesByType(incident.damages)) {
    const insured = insuredCounts.get(type);
    // An entirely uninsured type is reported by damagedItem below, which gives
    // a clearer message than an over-count would.
    if (insured !== undefined && damaged > insured) {
      throw new Error(`more damages than insured items: ${type}`);
    }
  }

  return incident.damages.map((damage) => {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
    return { damage, item: damagedItem(policy, damage) };
  });
};

// A claim is all-or-nothing: the whole incident is validated before any pricing
// happens and before the cap is touched, so a claim that turns out to be
// invalid cannot leave a partial decrement behind for later steps to inherit.
const claim = (step: ClaimStep, policy: Policy): ClaimResult => {
  const exactPayout = validateIncident(step.incident, policy)
    .map(({ damage, item }) => payoutForDamage(damage, item))
    .reduce((total, amount) => total + amount, 0);

  // Intermediate amounts stay fractional; the payout is rounded once, here,
  // after the cap has clamped it — so the figure charged to the cap is the
  // same whole number the claimant is handed.
  const payout = roundOutgoingInMHPCOFavor(
    Math.min(exactPayout, policy.remainingCap),
  );
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const policyFor = (items: Item[]): Policy => ({
  items,
  remainingCap: insuranceSum(items) * CAP_MULTIPLIER,
});

const countQuotesBefore = (steps: Step[], stepIndex: number): number =>
  steps.slice(0, stepIndex).filter((step) => step.op === "quote").length;

export const runScenario = (scenario: Scenario): ScenarioOutput => {
  // A policy is registered under the index of the step that quoted it; that
  // step index is the id later claim steps refer to. Claims mutate their
  // policy's remainingCap, so the register carries state across steps.
  const policies = new Map<number, Policy>();

  const results = scenario.steps.map((step, stepIndex): StepResult => {
    if (step.op === "claim") {
      return claim(step, policies.get(step.policy)!);
    }
    policies.set(stepIndex, policyFor(step.items));
    return quote(
      step,
      scenario.customer,
      countQuotesBefore(scenario.steps, stepIndex),
    );
  });

  return { results };
};
