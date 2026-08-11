export interface Item {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
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
  /** Zero-based index of the quote step that created the policy. */
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Customer {
  yearsWithMHPCO: number;
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

export interface ScenarioOutput {
  results: (QuoteResult | ClaimResult)[];
}

const PROCESSING_FEE = 5;

// Item-scoped rates: applied to the affected item's own base premium.
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

// Policy-scoped rates: applied to the policy base premium (sum of all items).
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;

/** The MHPCO price list for main items, in the order the tariff publishes it. */
const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

/** Insurance values, which drive the payout cap (not the premium). */
const MAIN_ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const SEVERE_ENCHANTMENT_THRESHOLD = 8;
const SEVERE_ENCHANTMENT_REIMBURSEMENT = 0.5;

/** Components (runes, moonstones, ...) all carry the same per-piece premium. */
const COMPONENT_PREMIUM = 25;
const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const ROUNDING_PRECISION = 6;

/**
 * Clears binary drift so a whole amount like 115.00000000000001 does not creep
 * up to 116 when rounded.
 */
function exact(amount: number): number {
  return Number(amount.toFixed(ROUNDING_PRECISION));
}

/** Premiums round up — the MHPCO's favour. */
function roundUpPremium(amount: number): number {
  return Math.ceil(exact(amount));
}

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

function isKnownType(item: Item): boolean {
  return isComponent(item) || item.type in MAIN_ITEM_PREMIUMS;
}

function assertKnownItems(items: Item[]): void {
  for (const item of items) {
    if (!isKnownType(item)) throw new Error(`Unknown item type: ${item.type}`);
  }
}

function mainItemBasePremium(item: Item): number {
  return MAIN_ITEM_PREMIUMS[item.type];
}

/**
 * One item's own base premium. Components use the plain per-piece rate: the
 * block discount is a property of a *group*, so it never applies to a single
 * item's surcharges.
 */
function itemBasePremium(item: Item): number {
  return isComponent(item) ? COMPONENT_PREMIUM : mainItemBasePremium(item);
}

/** A building block of exactly 3 *alike* components is offered at a flat rate. */
function alikeComponentsBasePremium(count: number): number {
  if (count === BLOCK_SIZE) return BLOCK_PREMIUM;
  return count * COMPONENT_PREMIUM;
}

/** Each set of alike (same-type) components is priced as its own group. */
function componentsBasePremium(components: Item[]): number {
  const types = new Set(components.map((component) => component.type));
  return [...types]
    .map((type) => components.filter((component) => component.type === type).length)
    .reduce((sum, count) => sum + alikeComponentsBasePremium(count), 0);
}

/** The policy base premium: the sum of all item base premiums. */
function policyBasePremium(items: Item[]): number {
  const components = items.filter(isComponent);
  const mainItemsBase = items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + mainItemBasePremium(item), 0);
  return mainItemsBase + componentsBasePremium(components);
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

/** Item-specific risk surcharges; each applies to the affected item's own base premium. */
const ITEM_SURCHARGES: { applies: (item: Item) => boolean; rate: number }[] = [
  { applies: (item) => item.cursed === true, rate: CURSE_SURCHARGE },
  { applies: isHighlyEnchanted, rate: HIGH_ENCHANTMENT_SURCHARGE },
];

function itemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => {
    const base = itemBasePremium(item);
    const rate = ITEM_SURCHARGES.filter(({ applies }) => applies(item)).reduce(
      (total, { rate }) => total + rate,
      0,
    );
    return sum + base * rate;
  }, 0);
}

/**
 * Modifiers stack per the spec: item-specific surcharges apply to the affected
 * item's base premium, policy-wide modifiers to the policy base premium, and
 * the processing fee is added last.
 */
/**
 * Policy-wide modifiers; each applies to the policy base premium. Discounts are
 * negative rates, so the whole set simply sums.
 */
interface QuoteContext {
  customer: Customer;
  /** How many quotes the customer already took in this scenario. */
  previousQuotes: number;
}

const POLICY_MODIFIERS: { applies: (context: QuoteContext) => boolean; rate: number }[] = [
  // Every quote counts as a first insurance, regardless of customer history.
  { applies: () => true, rate: FIRST_INSURANCE_SURCHARGE },
  {
    applies: ({ customer }) => customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS,
    rate: -LOYALTY_DISCOUNT,
  },
  { applies: ({ previousQuotes }) => previousQuotes > 0, rate: -FOLLOW_UP_DISCOUNT },
];

function policyModifierRate(context: QuoteContext): number {
  return POLICY_MODIFIERS.filter(({ applies }) => applies(context)).reduce(
    (total, { rate }) => total + rate,
    0,
  );
}

function quotePremium(step: QuoteStep, context: QuoteContext): number {
  assertKnownItems(step.items);
  const policyBase = policyBasePremium(step.items);
  const policyModifiers = policyBase * policyModifierRate(context);
  return roundUpPremium(
    policyBase + itemSurcharges(step.items) + policyModifiers + PROCESSING_FEE,
  );
}

/**
 * Deliberately independent of the premium calculation: the block discount and
 * the premium modifiers affect what the customer pays, never the insurance sum
 * (and so never the cap). Do not merge this with the premium lookup.
 */
function insuranceValue(item: Item): number {
  if (isComponent(item)) return COMPONENT_INSURANCE_VALUE;
  return MAIN_ITEM_INSURANCE_VALUES[item.type];
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValue(item), 0);
}

/** Payouts round down — also the MHPCO's favour. */
function roundDownPayout(amount: number): number {
  return Math.floor(exact(amount));
}

function isSeverelyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= SEVERE_ENCHANTMENT_THRESHOLD;
}

/**
 * How much of a damage is reimbursed.
 *
 * The spec names two clauses: severely enchanted items (level >= 8) are
 * reimbursed at 50 %, and dragon-material items in full. Full reimbursement is
 * already the default here, and the spec's examples show the 50 % rule winning
 * when both apply — so an explicit dragon-material branch could never change a
 * result, and `material` is deliberately not consulted.
 */
function reimbursement(damage: Damage, item: Item): number {
  return isSeverelyEnchanted(item)
    ? damage.amount * SEVERE_ENCHANTMENT_REIMBURSEMENT
    : damage.amount;
}

/**
 * The payout the damages entitle the customer to, before the policy cap.
 * The deductible applies once per damage event, not once per claim.
 */
/**
 * Takes the insured item a damage refers to out of `unclaimed`, so each damage
 * entry is matched to a distinct insured item. Rejects damages the policy
 * cannot account for.
 */
function takeDamagedItem(damage: Damage, unclaimed: Item[], policyItems: Item[]): Item {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
  const index = unclaimed.findIndex((candidate) => candidate.type === damage.itemType);
  if (index === -1) {
    const insured = policyItems.some((item) => item.type === damage.itemType);
    throw new Error(
      insured
        ? `More ${damage.itemType} damages than the policy insures`
        : `Damaged item is not part of the policy: ${damage.itemType}`,
    );
  }
  return unclaimed.splice(index, 1)[0];
}

function desiredPayout(step: ClaimStep, policyItems: Item[]): number {
  const unclaimed = [...policyItems];
  return step.incident.damages.reduce((total, damage) => {
    const item = takeDamagedItem(damage, unclaimed, policyItems);
    return total + Math.max(0, reimbursement(damage, item) - DEDUCTIBLE);
  }, 0);
}

/** Resolves the `policy` reference of a claim to the quote step that created it. */
function policyAt(steps: Step[], index: number): QuoteStep {
  const step = steps[index];
  if (step?.op !== "quote") {
    throw new Error(`Claim references step ${index}, which is not a quote`);
  }
  return step;
}

/** The total payout a policy may ever produce is twice its insurance sum. */
function policyCap(policy: QuoteStep): number {
  return insuranceSum(policy.items) * CAP_MULTIPLIER;
}

/** Settles one claim against the cap left on its policy. */
function settleClaim(step: ClaimStep, policy: QuoteStep, capBefore: number): ClaimResult {
  const payout = Math.min(roundDownPayout(desiredPayout(step, policy.items)), capBefore);
  return { payout, remainingCap: capBefore - payout };
}

export function runScenario(scenario: Scenario): ScenarioOutput {
  /** Cap left on each policy, keyed by the step index that created it. */
  const remainingCaps = new Map<number, number>();
  const results: (QuoteResult | ClaimResult)[] = [];
  let previousQuotes = 0;

  for (const step of scenario.steps) {
    if (step.op === "claim") {
      const policy = policyAt(scenario.steps, step.policy);
      const capBefore = remainingCaps.get(step.policy) ?? policyCap(policy);
      const result = settleClaim(step, policy, capBefore);
      remainingCaps.set(step.policy, result.remainingCap);
      results.push(result);
    } else {
      results.push({
        premium: quotePremium(step, { customer: scenario.customer, previousQuotes }),
      });
      previousQuotes += 1;
    }
  }

  return { results };
}
