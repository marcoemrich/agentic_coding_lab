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

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

// A quote step is answered with a premium, a claim step with a payout and the
// cap the policy has left. Each arm is named so a consumer (e.g. the CLI) can
// discriminate on `"premium" in result` and still refer to the arm it picked.
export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const BASE_PREMIUM_RATES: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

// The office insures exactly the types it prices. Both the quote desk and the
// claim desk ask this same question, so it gets one answer here.
const isInsurableType = (type: string): boolean => type in BASE_PREMIUM_RATES;

const validateInsurableType = (type: string): void => {
  if (!isInsurableType(type)) {
    throw new Error(`Unknown item type: ${type}`);
  }
};

// A claim's damages are checked before any of them is priced, so a malformed
// claim is rejected outright rather than half-processed.
const validateDamage = (damage: Damage): void => {
  validateInsurableType(damage.itemType);
  if (damage.amount < 0) {
    throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
  }
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_ENCHANTMENT = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const countByType = (items: Item[]): Map<string, number> =>
  items.reduce(
    (counts, item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1),
    new Map<string, number>(),
  );

const basePremiumForGroup = (type: string, itemCount: number): number =>
  itemCount === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : itemCount * BASE_PREMIUM_RATES[type];

// The policy base premium: the sum of all item base premiums, EXCLUDING
// item-specific surcharges. Policy-wide modifiers are percentages of this.
const policyBasePremium = (items: Item[]): number =>
  [...countByType(items)].reduce(
    (sum, [type, itemCount]) => sum + basePremiumForGroup(type, itemCount),
    0,
  );

const itemSurchargeRate = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_RATE : 0) +
  ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0);

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce(
    (sum, item) =>
      sum + BASE_PREMIUM_RATES[item.type] * itemSurchargeRate(item),
    0,
  );

// Premiums round in the MHPCO's favor, i.e. up.
const roundPremiumInMHPCOsFavor = (premium: number): number =>
  Math.ceil(premium);

// Payouts round in the MHPCO's favor too — which for money leaving the office
// means down.
const roundPayoutInMHPCOsFavor = (payout: number): number =>
  Math.floor(payout);

// What the office knows about the customer at the moment a quote is drawn up.
// Policy-wide modifiers are decided entirely by this context.
interface QuoteContext {
  customer: Customer;
  precedingQuoteCount: number;
}

// Each policy-wide modifier is a signed percentage of the policy base premium:
// surcharges positive, discounts negative.
const policyWideModifierRates = ({
  customer,
  precedingQuoteCount,
}: QuoteContext): number[] => [
  FIRST_INSURANCE_SURCHARGE_RATE,
  ...(customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? [-LOYALTY_DISCOUNT_RATE]
    : []),
  ...(precedingQuoteCount > 0 ? [-FOLLOW_UP_CONTRACT_DISCOUNT_RATE] : []),
];

// Each rate is multiplied out against the base premium SEPARATELY and then
// summed. Summing the rates first and doing a single multiply is algebraically
// equal but not equal in floating point — 100 * (1 + 0.1) is 110.00000000000001
// — and rounding up turns that into a spurious extra gold piece.
const sumPolicyWideModifiers = (
  basePremium: number,
  context: QuoteContext,
): number =>
  policyWideModifierRates(context).reduce(
    (sum, rate) => sum + basePremium * rate,
    0,
  );

const quote = (items: Item[], context: QuoteContext): QuoteResult => {
  items.forEach(({ type }) => validateInsurableType(type));

  const basePremium = policyBasePremium(items);

  return {
    premium: roundPremiumInMHPCOsFavor(
      basePremium +
        sumItemSurcharges(items) +
        sumPolicyWideModifiers(basePremium, context) +
        PROCESSING_FEE,
    ),
  };
};

const policyInsuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

// How much of a damage the office reimburses, before the deductible.
//
// Full reimbursement is the default, which is also what the dragon-material
// clause grants — so that clause needs no branch of its own. The only clause
// that moves the rate off the default is high enchantment, and the spec makes
// it win outright when both apply, so testing it alone is the whole rule.
const reimbursementRate = (item: Item): number =>
  (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT
    ? HALF_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

// The deductible bites once per damaged item, after the rate, and never turns
// a payout negative — the office does not bill the customer for small damages.
const payoutForDamage = (damage: Damage, item: Item): number =>
  Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE_PER_DAMAGE);

// Each damage entry claims one distinct insured item, so a matched item is
// consumed: two sword damages need two insured swords. Pairing every damage
// with its item up front separates "which item was hit" from "what is it worth",
// and lets a bad claim be rejected before any money is computed.
const matchDamagesToInsuredItems = (
  damages: Damage[],
  policyItems: Item[],
): [Damage, Item][] => {
  const unclaimed = [...policyItems];

  return damages.map((damage) => {
    validateDamage(damage);
    const index = unclaimed.findIndex(({ type }) => type === damage.itemType);
    if (index === -1) {
      throw new Error(
        `Damaged item is not covered by the policy: ${damage.itemType}`,
      );
    }
    const [damagedItem] = unclaimed.splice(index, 1);

    return [damage, damagedItem];
  });
};

const sumDamagePayouts = (damages: Damage[], policyItems: Item[]): number =>
  matchDamagesToInsuredItems(damages, policyItems).reduce(
    (sum, [damage, item]) => sum + payoutForDamage(damage, item),
    0,
  );

// The cap is twice the policy's insurance sum, i.e. what the office will pay
// out over the policy's whole life. Premium modifiers do not move it.
const policyCap = (policyItems: Item[]): number =>
  policyInsuranceSum(policyItems) * CAP_MULTIPLIER;

// A policy, with the cap it has left. The cap is consumed by every claim
// against the policy, so it lives with the policy rather than the claim.
interface Policy {
  items: Item[];
  remainingCap: number;
}

// A claim never pays out more than the policy has cap left. Settling one
// produces both the money paid and the policy as it stands afterwards — the
// office's record of the policy IS the record of what is left to pay, so the
// remaining cap is carried by the policy alone rather than reported twice.
interface Settlement {
  payout: number;
  policy: Policy;
}

const settleClaim = (
  incident: ClaimStep["incident"],
  policy: Policy,
): Settlement => {
  const desired = roundPayoutInMHPCOsFavor(
    sumDamagePayouts(incident.damages, policy.items),
  );
  const payout = Math.min(desired, policy.remainingCap);

  return {
    payout,
    policy: { ...policy, remainingCap: policy.remainingCap - payout },
  };
};

// Policies the office has written so far, keyed by the step index of the quote
// that created them — that index is how a later claim step refers to a policy.
// The number of entries is also exactly the number of preceding quotes, which
// is what decides the follow-up contract discount; deriving it here keeps the
// two facts from drifting apart.
type PoliciesSoFar = Map<number, Policy>;

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies: PoliciesSoFar = new Map();

  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      const claimed = policies.get(step.policy);
      if (!claimed) {
        throw new Error(`No policy was created by step ${step.policy}`);
      }
      const { payout, policy } = settleClaim(step.incident, claimed);
      policies.set(step.policy, policy);

      return { payout, remainingCap: policy.remainingCap };
    }

    const result = quote(step.items, {
      customer: scenario.customer,
      precedingQuoteCount: policies.size,
    });
    policies.set(stepIndex, {
      items: step.items,
      remainingCap: policyCap(step.items),
    });

    return result;
  });

  return { results };
};
