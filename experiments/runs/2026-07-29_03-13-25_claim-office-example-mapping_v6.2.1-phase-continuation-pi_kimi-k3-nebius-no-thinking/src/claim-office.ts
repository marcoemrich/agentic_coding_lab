const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const LOYALTY_MIN_YEARS = 2;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;
// Claim-side clause: items with enchantment level >= 8 are
// reimbursed at 50% of the damage amount.
const HIGH_ENCHANTMENT_CLAUSE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

interface ItemSpec {
  basePremium: number;
  component: boolean;
  // Insurance value feeds the payout cap, not the premium.
  insuranceValue: number;
}

// Single source of truth for per-type knowledge: base premium, whether
// the type counts as a component for block pricing, and insurance value.
// Unknown types are absent.
const ITEM_SPECS: Record<string, ItemSpec> = {
  sword: { basePremium: 100, component: false, insuranceValue: 1000 },
  amulet: { basePremium: 60, component: false, insuranceValue: 600 },
  staff: { basePremium: 80, component: false, insuranceValue: 800 },
  potion: { basePremium: 40, component: false, insuranceValue: 400 },
  rune: { basePremium: 25, component: true, insuranceValue: 250 },
  moonstone: { basePremium: 25, component: true, insuranceValue: 250 },
};

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

// Guards against floating-point noise so exact integers are not rounded up further.
const FLOAT_EPSILON = 1e-9;

// Premiums are rounded up to whole gold.
const roundUp = (amount: number): number => Math.ceil(amount - FLOAT_EPSILON);

// Payouts are rounded down to whole gold.
const roundDown = (amount: number): number => Math.floor(amount + FLOAT_EPSILON);

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
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

interface ScenarioResult {
  results: (QuoteResult | ClaimResult)[];
}

interface Policy {
  items: Item[];
  cap: number;
  paidOut: number;
}

// Fallback for unknown types; quote steps throw before reaching here.
const basePremiumFor = (type: string): number =>
  ITEM_SPECS[type]?.basePremium ?? 0;

const isComponent = (item: Item): boolean =>
  ITEM_SPECS[item.type]?.component ?? false;

// Main (non-component) items are priced individually, not in blocks.
const isMainItem = (item: Item): boolean => !isComponent(item);

const isCursed = (item: Item): boolean => item.cursed ?? false;

// Missing enchantment counts as level 0.
const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD;

// A block of exactly 3 alike components costs 60 instead of 3 x 25.
const componentsBasePremium = (items: Item[]): number => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  let total = 0;
  for (const [type, count] of counts) {
    total +=
      count === COMPONENT_BLOCK_SIZE
        ? COMPONENT_BLOCK_PREMIUM
        : count * basePremiumFor(type);
  }
  return total;
};

// Total base premium of a set of items, without any surcharges.
const sumBasePremium = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumFor(item.type), 0);

// A surcharge applies a rate to the total base premium of matching items.
const surchargeFor = (
  items: Item[],
  matches: (item: Item) => boolean,
  rate: number,
): number => sumBasePremium(items.filter(matches)) * rate;

// A discount applies a rate to the total base premium when a condition holds.
const discountFor = (
  applies: boolean,
  totalBasePremium: number,
  rate: number,
): number => (applies ? totalBasePremium * rate : 0);

const quotePremium = (
  items: Item[],
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number => {
  const mainItems = items.filter(isMainItem);
  const components = items.filter(isComponent);
  const totalBasePremium =
    sumBasePremium(mainItems) + componentsBasePremium(components);
  const cursedSurcharge = surchargeFor(items, isCursed, CURSED_SURCHARGE_RATE);
  const highEnchantmentSurcharge = surchargeFor(
    items,
    isHighlyEnchanted,
    HIGH_ENCHANTMENT_SURCHARGE_RATE,
  );
  const firstInsuranceSurcharge = totalBasePremium * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = discountFor(
    yearsWithMHPCO >= LOYALTY_MIN_YEARS,
    totalBasePremium,
    LOYALTY_DISCOUNT_RATE,
  );
  const followUpDiscount = discountFor(
    isFollowUpContract,
    totalBasePremium,
    FOLLOW_UP_DISCOUNT_RATE,
  );
  return roundUp(
    totalBasePremium +
      cursedSurcharge +
      highEnchantmentSurcharge +
      firstInsuranceSurcharge -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE,
  );
};

const insuranceValueOf = (item: Item): number =>
  ITEM_SPECS[item.type]?.insuranceValue ?? 0;

const createPolicy = (items: Item[]): Policy => {
  const insuranceSum = items.reduce(
    (sum, item) => sum + insuranceValueOf(item),
    0,
  );
  return {
    items,
    cap: insuranceSum * CAP_MULTIPLE_OF_INSURANCE_SUM,
    paidOut: 0,
  };
};

// The high-enchantment clause halves the damage amount before the
// per-entry deductible is subtracted.
const enchantmentAdjustedAmount = (item: Item, amount: number): number =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_CLAUSE_THRESHOLD
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : amount;

// Each damage entry is matched to the next unmatched insured item of its
// type; the deductible applies once per damage entry.
const claimableAmount = (item: Item, damage: Damage): number =>
  Math.max(enchantmentAdjustedAmount(item, damage.amount) - DEDUCTIBLE_PER_DAMAGE, 0);

// A damage entry paired with the insured item it consumes.
type MatchedDamage = [item: Item, damage: Damage];

const matchDamagesToItems = (
  items: Item[],
  damages: Damage[],
): MatchedDamage[] => {
  const unmatchedItems = [...items];
  return damages.map((damage) => {
    const index = unmatchedItems.findIndex(
      (item) => item.type === damage.itemType,
    );
    if (index === -1) {
      throw new Error(
        `Damage entry for item type not covered by the policy: ${damage.itemType}`,
      );
    }
    const item = unmatchedItems[index];
    unmatchedItems.splice(index, 1);
    return [item, damage];
  });
};

const remainingCap = (policy: Policy): number => policy.cap - policy.paidOut;

// A damage amount must not be negative.
const assertNonNegativeAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
};

const processClaim = (policy: Policy, damages: Damage[]): ClaimResult => {
  assertNonNegativeAmounts(damages);
  const totalClaimable = matchDamagesToItems(policy.items, damages).reduce(
    (sum, [item, damage]) => sum + claimableAmount(item, damage),
    0,
  );
  const payout = roundDown(Math.min(totalClaimable, remainingCap(policy)));
  policy.paidOut += payout;
  return { payout, remainingCap: remainingCap(policy) };
};

const assertKnownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in ITEM_SPECS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies = new Map<number, Policy>();
  const results: (QuoteResult | ClaimResult)[] = [];
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      assertKnownItemTypes(step.items);
      const isFollowUpContract = index > 0;
      policies.set(index, createPolicy(step.items));
      results.push({
        premium: quotePremium(
          step.items,
          scenario.customer.yearsWithMHPCO,
          isFollowUpContract,
        ),
      });
    } else {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`No policy created at step ${step.policy}`);
      }
      results.push(processClaim(policy, step.incident.damages));
    }
  });
  return { results };
};
