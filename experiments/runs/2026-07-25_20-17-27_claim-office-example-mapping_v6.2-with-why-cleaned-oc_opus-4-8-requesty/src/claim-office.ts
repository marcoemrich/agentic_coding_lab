export interface Customer {
  yearsWithMHPCO: number;
  contractCount: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

// Sum a numeric projection over a list. Names the recurring
// "add up a value derived from each element" pattern used throughout
// premium, surcharge, insurance-value, and payout calculations.
const sumBy = <T>(items: T[], value: (item: T) => number): number =>
  items.reduce((sum, item) => sum + value(item), 0);

const PROCESSING_FEE = 5;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// A "block" is a bulk-pricing rule for components (runes/moonstones):
// exactly COMPONENT_BLOCK_SIZE of the same component type is priced at a
// flat COMPONENT_BLOCK_PREMIUM instead of the per-item sum. Blocks apply only
// to components — a group of three main items (e.g. three swords) is priced
// per item, not as a block.
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

// A cursed item costs an extra surcharge of this fraction of its base premium.
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

// Look up a per-type value in a strategy table, rejecting unknown types with a
// clear error instead of letting an undefined leak into the arithmetic as NaN.
// Shared by every "value indexed by item type" table (base premium, insurance).
const valueForItemType = (
  table: Record<string, number>,
  item: Item,
): number => {
  const value = table[item.type];
  if (value === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return value;
};

const basePremiumForItem = (item: Item): number =>
  valueForItemType(BASE_PREMIUM_BY_TYPE, item);

const groupByType = (items: Item[]): Item[][] => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return [...groups.values()];
};

const sumPerItemPremium = (group: Item[]): number =>
  sumBy(group, basePremiumForItem);

const isComponentType = (type: string): boolean => COMPONENT_TYPES.has(type);

// A group comes from groupByType, so every item shares one type. It is a
// component block only when that shared type is a component AND the group has
// exactly the block size — otherwise it is priced per item.
const basePremiumForGroup = (group: Item[]): number => {
  const isComponentBlock =
    isComponentType(group[0].type) && group.length === COMPONENT_BLOCK_SIZE;
  return isComponentBlock ? COMPONENT_BLOCK_PREMIUM : sumPerItemPremium(group);
};

export const basePremium = (items: Item[]): number =>
  sumBy(groupByType(items), basePremiumForGroup);

// A policy-wide adjustment adds a signed fraction of the policy's base premium
// when a customer condition holds. Surcharges use positive rates, discounts
// negative rates. Mirrors the ITEM_SURCHARGES strategy-table pattern.
const adjustmentWhen = (
  applies: (customer: Customer) => boolean,
  rate: number,
): ((customer: Customer, policyBase: number) => number) => {
  return (customer, policyBase) =>
    applies(customer) ? policyBase * rate : 0;
};

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const isReturning = (customer: Customer): boolean =>
  customer.contractCount >= 1;

const POLICY_ADJUSTMENTS: Array<(customer: Customer, policyBase: number) => number> = [
  adjustmentWhen(() => true, FIRST_INSURANCE_RATE),
  adjustmentWhen(isLoyal, -LOYALTY_DISCOUNT_RATE),
  adjustmentWhen(isReturning, -FOLLOW_UP_DISCOUNT_RATE),
];

const totalPolicyAdjustment = (customer: Customer, policyBase: number): number =>
  sumBy(POLICY_ADJUSTMENTS, (adjustment) => adjustment(customer, policyBase));

// Fractional gold always lands in MHPCO's favor, but "favor" points opposite ways
// for money owed to MHPCO versus money paid out by MHPCO:
//   - premiums round UP   (MHPCO collects the extra fraction)
//   - payouts  round DOWN (MHPCO keeps the fraction, paying the customer less)
const roundPremiumInMHPCOFavor = (amount: number): number => Math.ceil(amount);
const roundPayoutInMHPCOFavor = (amount: number): number => Math.floor(amount);

export const quote = (customer: Customer, items: Item[]): number => {
  const policyBase = basePremium(items);
  const policyAdjustments = totalPolicyAdjustment(customer, policyBase);
  return roundPremiumInMHPCOFavor(
    premiumWithItemModifiers(items) + policyAdjustments + PROCESSING_FEE,
  );
};

// A surcharge adds a fraction of an item's base premium when a condition holds.
const surchargeWhen = (
  applies: (item: Item) => boolean,
  rate: number,
): ((item: Item) => number) => {
  return (item) => (applies(item) ? basePremiumForItem(item) * rate : 0);
};

const isCursed = (item: Item): boolean => item.cursed === true;

const hasHighEnchantment = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const ITEM_SURCHARGES: Array<(item: Item) => number> = [
  surchargeWhen(isCursed, CURSE_SURCHARGE_RATE),
  surchargeWhen(hasHighEnchantment, HIGH_ENCHANTMENT_SURCHARGE_RATE),
];

const totalSurchargeForItem = (item: Item): number =>
  sumBy(ITEM_SURCHARGES, (surcharge) => surcharge(item));

export const premiumWithItemModifiers = (items: Item[]): number => {
  const surcharges = sumBy(items, totalSurchargeForItem);
  return basePremium(items) + surcharges;
};

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  damages: Damage[];
}

export interface Policy {
  items: Item[];
  remainingCap: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;
const CAP_MULTIPLIER = 2;

// The insured value per item type — the assessed worth used to derive a
// policy's payout cap. Mirrors the BASE_PREMIUM_BY_TYPE strategy table.
const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};

// Look up an item's insured value, rejecting unknown types the same way base
// premiums are — the two strategy tables share one lookup, so a missing type
// surfaces as a clear error instead of a silent NaN in the cap.
const insuranceValueForItem = (item: Item): number =>
  valueForItemType(INSURANCE_VALUE_BY_TYPE, item);

export const insuranceSum = (items: Item[]): number =>
  sumBy(items, insuranceValueForItem);

// A policy's payout cap is a fixed multiple of its total insured value.
export const cap = (items: Item[]): number =>
  insuranceSum(items) * CAP_MULTIPLIER;

// A highly-enchanted item is only partially covered: the volatile magic makes
// full restoration risky, so the claim clause caps its covered amount at a
// fraction of the assessed damage. This threshold (8) is distinct from the
// quote-side high-enchantment surcharge threshold (5) — different domain rules.
// The clause depends only on enchantment level, not material: a steel sword at
// ench 9 is reduced just like a dragon-material one (confirmed by tests).
const qualifiesForHighEnchantmentClaim = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

// The deductible is applied per damage event: each damaged item is reimbursed
// for its covered amount minus a flat deductible. The covered amount is the
// assessed damage scaled by a reimbursement rate — full (1) by default, or a
// reduced fraction for items whose clause limits coverage.
const reimbursementForResolvedItem = (damage: Damage, item: Item): number => {
  const reimbursementRate = qualifiesForHighEnchantmentClaim(item)
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;
  const coveredAmount = damage.amount * reimbursementRate;
  return coveredAmount - DEDUCTIBLE;
};

// Locate the insured item a damage refers to. This runs only after
// validateDamagesCovered has confirmed the policy covers every damaged type
// (unknown types have an insured count of 0 and are rejected there), so a match
// is guaranteed. The explicit guard documents that invariant instead of hiding
// it behind a silent cast — and turns any future violation into a clear error.
const findInsuredItem = (policy: Policy, itemType: string): Item => {
  const insuredItem = policy.items.find((item) => item.type === itemType);
  if (insuredItem === undefined) {
    throw new Error(`No insured ${itemType} in policy`);
  }
  return insuredItem;
};

// The reimbursement for a single damage: locate the insured item it refers to,
// then apply that item's coverage clause and the per-event deductible.
const reimbursementForDamage = (policy: Policy, damage: Damage): number =>
  reimbursementForResolvedItem(damage, findInsuredItem(policy, damage.itemType));

// Tally how many elements fall into each type bucket. Each caller supplies the
// projection to its own type field (Item.type vs Damage.itemType), keeping this
// helper honest about what it groups on — no shared union, no unsafe cast.
const countByType = <T>(items: T[], typeOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const type = typeOf(item);
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

// A damage's assessed amount must be non-negative: MHPCO never reimburses a
// "negative loss". Rejecting it early keeps downstream payout math honest.
const validateDamageAmountsNonNegative = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }
};

// A policy only covers as many damaged items of a type as it insures: you can't
// claim for three swords on a two-sword policy. Unknown types have an insured
// count of 0, so any damage to them is rejected here too.
const validateDamageCountsWithinInsured = (policy: Policy, incident: Incident): void => {
  const insuredCounts = countByType(policy.items, (item) => item.type);
  const damageCounts = countByType(incident.damages, (damage) => damage.itemType);
  for (const [itemType, damageCount] of damageCounts) {
    if (damageCount > (insuredCounts.get(itemType) ?? 0)) {
      throw new Error(`More ${itemType} damages than insured`);
    }
  }
};

// A claim is only payable if every damage is well-formed and within coverage.
// This orchestrator names the full set of coverage validations; each concern
// lives in its own helper so the name-to-body mapping stays honest.
const validateDamagesCovered = (policy: Policy, incident: Incident): void => {
  validateDamageAmountsNonNegative(incident);
  validateDamageCountsWithinInsured(policy, incident);
};

// A policy only ever pays out what its remaining cap allows: the desired
// payout is limited to the cap, and whatever is paid is drawn down from it.
// Once the cap is exhausted, later claims can pay nothing.
const limitToRemainingCap = (desiredPayout: number, remainingCap: number): ClaimResult => {
  const payout = Math.min(desiredPayout, remainingCap);
  return { payout, remainingCap: remainingCap - payout };
};

const desiredPayout = (policy: Policy, incident: Incident): number =>
  roundPayoutInMHPCOFavor(
    sumBy(incident.damages, (damage) => reimbursementForDamage(policy, damage)),
  );

export const claim = (policy: Policy, incident: Incident): ClaimResult => {
  validateDamagesCovered(policy, incident);
  return limitToRemainingCap(desiredPayout(policy, incident), policy.remainingCap);
};

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

// A scenario is replayed as a running ledger: each quote registers a new policy
// and advances the customer's contract history, and each claim draws down an
// existing policy's cap. This mutable state threads that history through the
// steps so later steps see the effects of earlier ones.
interface ScenarioState {
  yearsWithMHPCO: number;
  policies: Policy[];
  contractCount: number;
}

// A quote step prices the customer's items at their current contract history,
// then registers the resulting policy (with its full cap) and records that the
// customer now holds one more contract — so the next quote is a follow-up.
const handleQuoteStep = (state: ScenarioState, step: QuoteStep): StepResult => {
  const customer: Customer = {
    yearsWithMHPCO: state.yearsWithMHPCO,
    contractCount: state.contractCount,
  };
  const premium = quote(customer, step.items);
  state.policies.push({ items: step.items, remainingCap: cap(step.items) });
  state.contractCount += 1;
  return { premium };
};

// A claim step settles an incident against a previously-quoted policy and
// persists the reduced cap back onto that policy, so a later claim on the same
// policy sees the drawn-down remaining cap.
const handleClaimStep = (state: ScenarioState, step: ClaimStep): StepResult => {
  const policy = state.policies[step.policy];
  const result = claim(policy, step.incident);
  policy.remainingCap = result.remainingCap;
  return result;
};

const runStep = (state: ScenarioState, step: Step): StepResult =>
  step.op === "quote"
    ? handleQuoteStep(state, step)
    : handleClaimStep(state, step);

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const state: ScenarioState = {
    yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
    policies: [],
    contractCount: 0,
  };
  const results = scenario.steps.map((step) => runStep(state, step));
  return { results };
};
