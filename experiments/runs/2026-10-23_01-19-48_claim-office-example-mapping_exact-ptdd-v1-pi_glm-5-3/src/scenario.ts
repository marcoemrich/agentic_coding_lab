export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<Record<string, unknown>>;
}

/** Rejection of a step for a reason the MHPCO bureaucracy records. */
export class ScenarioError extends Error {}

/** Smallest coin of account the MHPCO needs: a twentieth of a G. */
const TWENTIETHS_PER_G = 20;

/** Processing fee added to every premium, in G. */
const PROCESSING_FEE_G = 5;
const PROCESSING_FEE_TWENTIETHS = PROCESSING_FEE_G * TWENTIETHS_PER_G;

/** Base-premium catalogue of insurable items, in G. */
const ITEM_BASE_PREMIUMS_G: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

/** Component types that can form a building block of 3 alike pieces. */
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

/** Base premium of a building block of exactly 3 alike components, in G. */
const BLOCK_OF_3_PREMIUM_G = 60;

/** Size of a component building block. */
const BLOCK_SIZE = 3;

/** Risk surcharge for cursed items, in twentieths of the item's base premium. */
const CURSED_SURCHARGE_RATE = 10;

/** Risk surcharge for highly enchanted items, in twentieths of the item's base premium. */
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 6;

/** Enchantment level from which an item counts as highly enchanted. */
const HIGH_ENCHANTMENT_MIN_LEVEL = 5;

/** Loyalty discount for long-standing customers, in twentieths of the policy base premium. */
const LOYALTY_DISCOUNT_RATE = 4;

/** Years of business from which a customer counts as long-standing. */
const LONG_STANDING_MIN_YEARS = 2;

/** Initial assessment surcharge for a first insurance, in twentieths of the policy base premium. */
const FIRST_INSURANCE_SURCHARGE_RATE = 2;

/** Discount on each contract after the customer's first, in twentieths of the policy base premium. */
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 3;

interface QuoteStep {
  op: "quote";
  items: Array<Record<string, unknown>>;
}

interface Customer {
  yearsWithMHPCO: number;
}

/**
 * Base premium of the components in a quote. A building block of exactly
 * 3 alike components costs a special block premium; everything else is
 * priced per component at its catalogue base premium.
 */
function componentsBasePremiumG(components: Array<Record<string, unknown>>): number {
  const byType = new Map<string, number>();
  for (const component of components) {
    const type = component.type as string;
    byType.set(type, (byType.get(type) ?? 0) + 1);
  }
  let total = 0;
  for (const [type, count] of byType) {
    total += count === BLOCK_SIZE ? BLOCK_OF_3_PREMIUM_G : count * ITEM_BASE_PREMIUMS_G[type];
  }
  return total;
}

/** Unmodified policy base premium: the sum of all item base premiums, in G. */
function policyBasePremiumG(step: QuoteStep): number {
  const components = step.items.filter((item) => COMPONENT_TYPES.has(item.type as string));
  const mainItems = step.items.filter((item) => !COMPONENT_TYPES.has(item.type as string));
  const mainTotal = mainItems.reduce(
    (sum, item) => sum + (ITEM_BASE_PREMIUMS_G[item.type as string] ?? 0),
    0,
  );
  return mainTotal + componentsBasePremiumG(components);
}

/** Item-specific risk surcharges (cursed, high enchantment), in twentieths of G. */
function itemRiskSurchargeTwentieths(item: Record<string, unknown>): number {
  const base = ITEM_BASE_PREMIUMS_G[item.type as string] ?? 0;
  let rate = 0;
  if (item.cursed === true) {
    rate += CURSED_SURCHARGE_RATE;
  }
  if (typeof item.enchantment === "number" && item.enchantment >= HIGH_ENCHANTMENT_MIN_LEVEL) {
    rate += HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return base * rate;
}

/** Policy-wide modifiers (first insurance, follow-up contract, loyalty), in twentieths of G. */
function policyWideAdjustmentTwentieths(policyBaseG: number, customer: Customer, isFirst: boolean): number {
  let rate = FIRST_INSURANCE_SURCHARGE_RATE;
  if (!isFirst) {
    rate -= FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
  }
  if (customer.yearsWithMHPCO >= LONG_STANDING_MIN_YEARS) {
    rate -= LOYALTY_DISCOUNT_RATE;
  }
  return policyBaseG * rate;
}

function quotePremium(step: QuoteStep, customer: Customer, isFirst: boolean): number {
  const baseG = policyBasePremiumG(step);
  const riskTwentieths = step.items
    .filter((item) => !COMPONENT_TYPES.has(item.type as string))
    .reduce((sum, item) => sum + itemRiskSurchargeTwentieths(item), 0);
  const totalTwentieths =
    baseG * TWENTIETHS_PER_G +
    riskTwentieths +
    policyWideAdjustmentTwentieths(baseG, customer, isFirst) +
    PROCESSING_FEE_TWENTIETHS;
  return Math.ceil(totalTwentieths / TWENTIETHS_PER_G);
}

/** Insurance value catalogue, in G. */
const ITEM_INSURANCE_VALUES_G: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

/** Deductible per damage event, in G. */
const DEDUCTIBLE_G = 100;

/** Enchantment level from which damage is reimbursed at half. */
const HIGH_ENCHANTMENT_DAMAGE_MIN_LEVEL = 8;

/** Reimbursement fraction for damage to highly enchanted items (level >= 8). */
const HIGH_ENCHANTMENT_DAMAGE_FRACTION = 0.5;

/** A policy's payout cap is twice its insurance sum. */
const CAP_MULTIPLE = 2;

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Array<{ itemType: string; amount: number }>;
  };
}

interface Policy {
  items: Array<Record<string, unknown>>;
  remainingCapG: number;
}

/** Reimbursement of a single damage against a covered item, after special clauses and deductible, in twentieths of G. */
function damagePayoutTwentieths(
  damage: { itemType: string; amount: number },
  coveredItem: Record<string, unknown>,
): number {
  const enchantment = coveredItem.enchantment;
  const rate =
    typeof enchantment === "number" && enchantment >= HIGH_ENCHANTMENT_DAMAGE_MIN_LEVEL
      ? HIGH_ENCHANTMENT_DAMAGE_FRACTION
      : 1;
  return damage.amount * rate * TWENTIETHS_PER_G - DEDUCTIBLE_G * TWENTIETHS_PER_G;
}

/** Reject a claim whose damage entries exceed what the policy covers or carry invalid amounts. */
function rejectUncoveredDamages(step: ClaimStep, coveredCounts: Map<string, number>): void {
  const damageCounts = new Map<string, number>();
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) {
      throw new ScenarioError("claim rejected: damage amount must not be negative");
    }
    damageCounts.set(damage.itemType, (damageCounts.get(damage.itemType) ?? 0) + 1);
  }
  for (const [type, count] of damageCounts) {
    if ((coveredCounts.get(type) ?? 0) < count) {
      throw new ScenarioError(
        `claim rejected: policy covers fewer items of type '${type}' than damages reported`,
      );
    }
  }
}

function claimResult(step: ClaimStep, policies: Policy[]): Record<string, number> {
  const policy = policies[step.policy];
  const coveredCounts = new Map<string, number>();
  for (const item of policy.items) {
    const type = item.type as string;
    coveredCounts.set(type, (coveredCounts.get(type) ?? 0) + 1);
  }
  rejectUncoveredDamages(step, coveredCounts);
  let payoutTwentieths = 0;
  const remainingByType = new Map(coveredCounts);
  for (const damage of step.incident.damages) {
    const coveredItem = policy.items.find(
      (item) => item.type === damage.itemType && (remainingByType.get(item.type as string) ?? 0) > 0,
    );
    remainingByType.set(damage.itemType, (remainingByType.get(damage.itemType) ?? 0) - 1);
    payoutTwentieths += damagePayoutTwentieths(damage, coveredItem ?? {});
  }
  const payoutG = Math.floor(payoutTwentieths / TWENTIETHS_PER_G);
  const cappedPayoutG = Math.min(payoutG, policy.remainingCapG);
  policy.remainingCapG -= cappedPayoutG;
  return { payout: cappedPayoutG, remainingCap: policy.remainingCapG };
}

function newPolicy(step: QuoteStep): Policy {
  const insuranceSumG = step.items.reduce(
    (sum, item) => sum + (ITEM_INSURANCE_VALUES_G[item.type as string] ?? 0),
    0,
  );
  return { items: step.items, remainingCapG: insuranceSumG * CAP_MULTIPLE };
}

/** Reject a quote that names an item outside the MHPCO catalogue. */
function rejectUnknownItems(step: QuoteStep): void {
  for (const item of step.items) {
    if (!(item.type as string in ITEM_BASE_PREMIUMS_G)) {
      throw new ScenarioError(`quote rejected: unknown item type '${String(item.type)}'`);
    }
  }
}

export function runScenario(scenario: Scenario): Array<Record<string, number>> {
  let isFirstContract = true;
  const policies: Policy[] = [];
  return scenario.steps.map((step) => {
    if (step.op === "quote") {
      const quote = step as unknown as QuoteStep;
      rejectUnknownItems(quote);
      const premium = quotePremium(quote, scenario.customer, isFirstContract);
      isFirstContract = false;
      policies.push(newPolicy(quote));
      return { premium };
    }
    if (step.op === "claim") {
      return claimResult(step as unknown as ClaimStep, policies);
    }
    throw new Error("unsupported step");
  });
}
