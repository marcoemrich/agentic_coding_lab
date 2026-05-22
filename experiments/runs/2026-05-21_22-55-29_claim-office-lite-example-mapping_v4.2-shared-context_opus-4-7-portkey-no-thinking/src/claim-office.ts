interface QuoteItem {
  type: string;
  cursed?: boolean;
  enchantment?: number;
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
  incident: {
    cause: string;
    damages: DamageEntry[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

type QuoteResult = { premium: number };
type ClaimResult = { payout: number };
type StepResult = QuoteResult | ClaimResult;

const BASE_PREMIUM: Record<string, number> = {
  amulet: 60,
  sword: 100,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const KNOWN_ITEM_TYPES = new Set(Object.keys(BASE_PREMIUM));

const FIRST_INSURANCE_RATE = 0.1;
const PROCESSING_FEE = 5;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

// Component-block pricing: 3 alike components of the same type (e.g. 3 runes
// or 3 moonstones) sold together are priced as a 60 G block instead of
// 3 × 25 = 75 G. Adjustment is applied to policy base for each component
// type with exactly 3 instances.
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];

function sumOver<T>(xs: T[], f: (x: T) => number): number {
  return xs.reduce((total, x) => total + f(x), 0);
}

// MHPCO rounds quote premiums UP (in the office's favor).
function roundUpInFavorOfOffice(amount: number): number {
  return Math.ceil(amount);
}

// MHPCO rounds claim payouts DOWN (in the office's favor) — symmetric
// counterpart of `roundUpInFavorOfOffice` for premiums.
function roundDownInFavorOfOffice(amount: number): number {
  return Math.floor(amount);
}

function basePremium(type: string): number {
  return BASE_PREMIUM[type] ?? 0;
}

function itemBasePremium(item: QuoteItem): number {
  return basePremium(item.type);
}

// Per-type adjustment when exactly COMPONENT_BLOCK_SIZE items of `type` are
// present in the step: replace raw N × base with the flat block price.
function componentBlockAdjustment(items: QuoteItem[]): number {
  return sumOver(COMPONENT_TYPES, (type) => {
    const count = items.filter((x) => x.type === type).length;
    return count === COMPONENT_BLOCK_SIZE
      ? COMPONENT_BLOCK_PRICE - COMPONENT_BLOCK_SIZE * basePremium(type)
      : 0;
  });
}

function itemSurcharges(item: QuoteItem): number {
  const base = itemBasePremium(item);
  const curseSurcharge = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const highEnchantmentSurcharge =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return curseSurcharge + highEnchantmentSurcharge;
}

function priceQuoteStep(
  step: QuoteStep,
  yearsWithMHPCO: number,
  isFollowUp: boolean,
): QuoteResult {
  const policyBase =
    sumOver(step.items, itemBasePremium) + componentBlockAdjustment(step.items);
  const itemSurchargeTotal = sumOver(step.items, itemSurcharges);
  const firstInsurance = policyBase * FIRST_INSURANCE_RATE;
  const loyaltyDiscount =
    yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
      ? policyBase * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscount = isFollowUp
    ? policyBase * FOLLOW_UP_DISCOUNT_RATE
    : 0;
  const premium = roundUpInFavorOfOffice(
    policyBase +
      itemSurchargeTotal +
      firstInsurance -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE,
  );
  return { premium };
}

const DEDUCTIBLE_PER_DAMAGE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

// Payout for a single damage entry: full reimbursement minus a flat
// per-damage deductible. Upcoming clauses (high-enchantment 50%,
// dragon-material) will compose here, mirroring how `itemSurcharges` is
// the home for per-item surcharges in `priceQuoteStep`.
function damagePayout(damage: DamageEntry, insuredItem: QuoteItem): number {
  const reimbursement =
    (insuredItem.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
      ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
      : damage.amount;
  return reimbursement - DEDUCTIBLE_PER_DAMAGE;
}

// Resolves which insured item a damage entry refers to, by matching item
// type. Returns undefined if the damage's itemType isn't on the policy —
// upcoming validation tests (claim referencing item not in policy) will
// turn this into an explicit error path.
function insuredItemFor(
  damage: DamageEntry,
  policyItems: QuoteItem[],
): QuoteItem | undefined {
  return policyItems.find((item) => item.type === damage.itemType);
}

function processClaimStep(step: ClaimStep, policyItems: QuoteItem[]): ClaimResult {
  const payout = roundDownInFavorOfOffice(
    sumOver(step.incident.damages, (damage) =>
      damagePayout(damage, insuredItemFor(damage, policyItems)!),
    ),
  );
  return { payout };
}

// Validates that every item in a quote step has a known type. Throws a
// descriptive Error if not — the canonical home for quote-side input
// guards. Upcoming validation tests (negative amounts, etc.) should
// compose additional guards here.
function validateQuoteStep(step: QuoteStep): void {
  for (const item of step.items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

// Validates a claim step's damage entries. Throws a descriptive Error on
// any damage with a negative amount — the canonical home for claim-side
// input guards (will absorb future "unknown itemType in damage" and
// "more damages than insured" checks).
function validateClaimStep(step: ClaimStep, policyItems: QuoteItem[]): void {
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
  const damagedTypes = new Set(step.incident.damages.map((d) => d.itemType));
  for (const itemType of damagedTypes) {
    const damageCount = step.incident.damages.filter(
      (d) => d.itemType === itemType,
    ).length;
    const insuredCount = policyItems.filter((x) => x.type === itemType).length;
    if (damageCount > insuredCount) {
      throw new Error(
        `More ${itemType} damages than insured: ${damageCount} > ${insuredCount}`,
      );
    }
  }
}

export function runScenario(scenario: Scenario): {
  results: StepResult[];
} {
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      validateQuoteStep(step);
      return priceQuoteStep(step, scenario.customer.yearsWithMHPCO, index > 0);
    }
    const policyStep = scenario.steps[step.policy] as QuoteStep;
    validateClaimStep(step, policyStep.items);
    return processClaimStep(step, policyStep.items);
  });
  return { results };
}
