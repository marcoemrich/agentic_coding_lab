// --- Pricing policy (all amounts in G) ---
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_MIN_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

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

// --- Claim policy ---
const DEDUCTIBLE_PER_DAMAGE_EVENT = 100;
const CAP_MULTIPLIER = 2;

// A building block: exactly 3 alike components, priced as a flat bundle.
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_PREMIUM = 60;

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

interface DamageEntry {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: DamageEntry[] };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface Policy {
  items: QuoteItem[];
  remainingCap: number;
}

type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

const isBuildingBlock = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === BUILDING_BLOCK_SIZE;

const basePremiumFor = (items: QuoteItem[]): number => {
  const countByType = new Map<string, number>();
  for (const item of items) {
    countByType.set(item.type, (countByType.get(item.type) ?? 0) + 1);
  }
  let sum = 0;
  for (const [type, count] of countByType) {
    sum += isBuildingBlock(type, count)
      ? BUILDING_BLOCK_PREMIUM
      : count * BASE_PREMIUMS[type];
  }
  return sum;
};

// A conditional share: rate x amount when the condition holds, else nothing.
// Used per-item (surcharges) and policy-wide (discounts).
const conditionalShare = (
  applies: boolean,
  rate: number,
  amount: number,
): number => (applies ? amount * rate : 0);

// A surcharge: rate x item base premium, summed over items matching `applies`.
const surchargeFor = (
  items: QuoteItem[],
  rate: number,
  applies: (item: QuoteItem) => boolean,
): number =>
  items.reduce(
    (sum, item) =>
      sum + conditionalShare(applies(item), rate, BASE_PREMIUMS[item.type]),
    0,
  );

const curseSurchargeFor = (items: QuoteItem[]): number =>
  surchargeFor(items, CURSE_SURCHARGE_RATE, (item) => item.cursed ?? false);

const highEnchantmentSurchargeFor = (items: QuoteItem[]): number =>
  surchargeFor(
    items,
    HIGH_ENCHANTMENT_SURCHARGE_RATE,
    (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
  );

// A policy-wide discount: a share of the base premium, applied only when its condition holds.
const loyaltyDiscountFor = (
  yearsWithMHPCO: number,
  basePremium: number,
): number =>
  conditionalShare(
    yearsWithMHPCO >= LOYALTY_MIN_YEARS,
    LOYALTY_DISCOUNT_RATE,
    basePremium,
  );

const followUpContractDiscountFor = (
  isFollowUpContract: boolean,
  basePremium: number,
): number =>
  conditionalShare(
    isFollowUpContract,
    FOLLOW_UP_CONTRACT_DISCOUNT_RATE,
    basePremium,
  );

const assertKnownItemTypes = (items: QuoteItem[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const quotePremium = (
  items: QuoteItem[],
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number => {
  const basePremium = basePremiumFor(items);
  const curseSurcharge = curseSurchargeFor(items);
  const highEnchantmentSurcharge = highEnchantmentSurchargeFor(items);
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = loyaltyDiscountFor(yearsWithMHPCO, basePremium);
  const followUpContractDiscount = followUpContractDiscountFor(
    isFollowUpContract,
    basePremium,
  );
  return Math.ceil(
    basePremium +
      curseSurcharge +
      highEnchantmentSurcharge +
      firstInsuranceSurcharge -
      loyaltyDiscount -
      followUpContractDiscount +
      PROCESSING_FEE,
  );
};

const insuranceSumFor = (items: QuoteItem[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

// Each damage event contributes its amount minus the deductible, clamped at
// zero (damage below the deductible is ignored, never subtracted).
const payoutFor = (damages: DamageEntry[], remainingCap: number): number => {
  const desiredPayout = damages.reduce(
    (sum, damage) =>
      sum + Math.max(damage.amount - DEDUCTIBLE_PER_DAMAGE_EVENT, 0),
    0,
  );
  return Math.floor(Math.min(desiredPayout, remainingCap));
};

export const processScenario = (
  scenario: Scenario,
): { results: StepResult[] } => {
  const policies = new Map<number, Policy>();
  let priorQuotes = 0;
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === "quote") {
        assertKnownItemTypes(step.items);
        const isFollowUpContract = priorQuotes > 0;
        priorQuotes += 1;
        policies.set(index, {
          items: step.items,
          remainingCap: CAP_MULTIPLIER * insuranceSumFor(step.items),
        });
        return {
          premium: quotePremium(
            step.items,
            scenario.customer.yearsWithMHPCO,
            isFollowUpContract,
          ),
        };
      }
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`No policy at step index ${step.policy}`);
      }
      const payout = payoutFor(step.incident.damages, policy.remainingCap);
      policy.remainingCap -= payout;
      return { payout, remainingCap: policy.remainingCap };
    }),
  };
};
