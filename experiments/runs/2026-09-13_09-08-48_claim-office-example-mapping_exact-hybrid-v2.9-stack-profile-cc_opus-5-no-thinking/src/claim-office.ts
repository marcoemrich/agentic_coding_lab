const PROCESSING_FEE = 5;

// Modifiers are percentages OF THE UNMODIFIED BASE PREMIUM, summed additively
// rather than compounded — see the spec's integration examples, where a cursed
// sword is 100 base + 50 curse + 10 first insurance (10% of 100, not of 150).
//
// Rates are kept as integer percents and divided only once, at the point of
// use: percentOf(100, 10) is (100 * 10) / 100 = exactly 10, whereas a 0.1
// multiplier would give 10.000000000000002 and inflate Math.ceil.
const percentOf = (amount: number, percent: number): number => (amount * percent) / 100;

const FIRST_INSURANCE_PERCENT = 10;
const FOLLOW_UP_PERCENT = 15;
const LOYALTY_PERCENT = 20;
const LOYALTY_THRESHOLD_YEARS = 2;
const CURSE_PERCENT = 50;
const HIGH_ENCHANTMENT_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

// The price list prices each main item individually...
const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

// ...whereas every component is flat-rated at the same base premium,
// regardless of which component it is.
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_TYPES = ["rune", "moonstone"];

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

// Claims are settled against the insured VALUE of an item, which the price
// list states separately from its base premium.
const MAIN_ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;

// Claims use their OWN enchantment threshold, distinct from the premium
// surcharge's threshold of 5: the spec reimburses damage to items enchanted
// to 8 or above at half the damage amount.
const REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

const BASE_PREMIUMS: Record<string, number> = {
  ...MAIN_ITEM_BASE_PREMIUMS,
  ...Object.fromEntries(COMPONENT_TYPES.map((type) => [type, COMPONENT_BASE_PREMIUM])),
};

const INSURANCE_VALUES: Record<string, number> = {
  ...MAIN_ITEM_INSURANCE_VALUES,
  ...Object.fromEntries(COMPONENT_TYPES.map((type) => [type, COMPONENT_INSURANCE_VALUE])),
};

type Item = { type: string; cursed?: boolean; enchantment?: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };

const countItemsByType = (items: Item[]): Map<string, number> =>
  items.reduce(
    (counts, item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1),
    new Map<string, number>(),
  );

// A building block of exactly 3 alike components is offered at a special
// rate; any other count is priced per component.
const basePremiumForType = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * BASE_PREMIUMS[type];

const stepBasePremium = (step: QuoteStep): number =>
  [...countItemsByType(step.items)].reduce(
    (total, [type, count]) => total + basePremiumForType(type, count),
    0,
  );

// The PREMIUM-side enchantment rule. Distinct from the claim-side
// reimbursement rule below, which keys off the same field at its own, higher
// threshold: an item enchanted to 6 is surcharged here but is NOT reimbursed
// at half. Components carry no enchantment level at all, so a missing value
// is simply not enchanted enough to be surcharged.
const isSurchargedForEnchantment = (item: Item): boolean =>
  item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD;

// Item-specific modifiers apply to the base premium of the affected item,
// so they are computed per item rather than from the grouped totals. A
// cursed, highly enchanted item takes both surcharges.
const itemSurcharge = (item: Item): number => {
  const basePremium = BASE_PREMIUMS[item.type];
  const curseSurcharge = item.cursed ? percentOf(basePremium, CURSE_PERCENT) : 0;
  const enchantmentSurcharge = isSurchargedForEnchantment(item)
    ? percentOf(basePremium, HIGH_ENCHANTMENT_PERCENT)
    : 0;

  return curseSurcharge + enchantmentSurcharge;
};

const totalItemSurcharges = (items: Item[]): number =>
  items.reduce((total, item) => total + itemSurcharge(item), 0);

const isLongStanding = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

// Policy-wide modifiers apply to the policy base premium (the sum of all
// item base premiums). Discounts are negative terms in the same sum.
const netPolicyModifier = (
  basePremium: number,
  customer: Customer,
  isFollowUpContract: boolean,
): number => {
  const firstInsurance = percentOf(basePremium, FIRST_INSURANCE_PERCENT);
  const loyaltyDiscount = isLongStanding(customer)
    ? percentOf(basePremium, LOYALTY_PERCENT)
    : 0;
  const followUpDiscount = isFollowUpContract
    ? percentOf(basePremium, FOLLOW_UP_PERCENT)
    : 0;

  return firstInsurance - loyaltyDiscount - followUpDiscount;
};

// The MHPCO insures only what its price list names; anything else is
// rejected outright rather than quoted at an unknown rate. Insurability is
// derived from the price list itself, so the two cannot drift apart.
const assertInsurable = (item: Item): void => {
  if (!(item.type in BASE_PREMIUMS)) {
    throw new Error(`unknown item type: ${item.type}`);
  }
};

// Rounded in the MHPCO's favour: premiums round up.
const quotePremium = (step: QuoteStep, customer: Customer, isFollowUpContract: boolean): number => {
  step.items.forEach(assertInsurable);

  const basePremium = stepBasePremium(step);

  return Math.ceil(
    basePremium +
      totalItemSurcharges(step.items) +
      netPolicyModifier(basePremium, customer, isFollowUpContract) +
      PROCESSING_FEE,
  );
};

// The policy's cap is twice the insurance sum of everything it covers.
const policyCap = (policy: QuoteStep): number =>
  CAP_MULTIPLE *
  policy.items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

// Components carry no enchantment level, so a missing value is simply not
// enchanted enough to trigger the reimbursement clause.
const isReimbursedAtHalf = (item: Item): boolean =>
  item.enchantment !== undefined &&
  item.enchantment >= REIMBURSEMENT_ENCHANTMENT_THRESHOLD;

// Special clauses reduce the reimbursed amount BEFORE the deductible is
// subtracted: a 1000 G loss on a highly enchanted item reimburses 500, then
// pays 400. A deductible applies per damage event, i.e. once per damaged
// item. Rounded in the MHPCO's favour: payouts round down.
const damagePayout = (damage: Damage, item: Item): number => {
  const reimbursed = isReimbursedAtHalf(item)
    ? percentOf(damage.amount, HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT)
    : damage.amount;

  return Math.floor(reimbursed - DEDUCTIBLE);
};

const countDamagesByType = (damages: Damage[]): Map<string, number> =>
  damages.reduce(
    (counts, damage) => counts.set(damage.itemType, (counts.get(damage.itemType) ?? 0) + 1),
    new Map<string, number>(),
  );

// A damage is a loss, never a windfall: a negative amount would have the
// MHPCO charging for the claim and refunding cap it never paid out.
const assertDamageIsALoss = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(`damage amount must not be negative: ${damage.amount}`);
  }
};

// A claim can only be settled against something the policy covers, and a
// policy covering one sword answers for one damaged sword, not two: the whole
// claim is rejected rather than settled for the part that is covered. The two
// rejections are one rule counted at different depths, but they are reported
// apart because a customer who owns no amulet needs to hear that, not an
// arithmetic comparison against zero.
const assertDamagesAreCovered = (policy: QuoteStep, incident: Incident): void => {
  const insured = countItemsByType(policy.items);

  countDamagesByType(incident.damages).forEach((damaged, type) => {
    const covered = insured.get(type) ?? 0;

    if (covered === 0) {
      throw new Error(`damaged item not insured: ${type}`);
    }
    if (damaged > covered) {
      throw new Error(`more damages than insured items of type: ${type}`);
    }
  });
};

// Safe by construction: assertDamagesAreCovered has already established that
// the policy holds at least one item of every damaged type.
const insuredItemFor = (policy: QuoteStep, damage: Damage): Item =>
  policy.items.find((item) => item.type === damage.itemType) as Item;

// A claim is settled against the cap of the policy it names, which is
// consumed across successive claims on that policy.
const settleClaim = (
  step: ClaimStep,
  steps: Step[],
  capRemaining: Map<number, number>,
): { payout: number; remainingCap: number } => {
  const policy = steps[step.policy] as QuoteStep;

  step.incident.damages.forEach(assertDamageIsALoss);
  assertDamagesAreCovered(policy, step.incident);

  const capBeforeClaim = capRemaining.get(step.policy) ?? policyCap(policy);
  const warrantedPayout = step.incident.damages.reduce(
    (total, damage) => total + damagePayout(damage, insuredItemFor(policy, damage)),
    0,
  );

  // What the damages warrant is reduced to what the cap still allows.
  const payout = Math.min(warrantedPayout, capBeforeClaim);
  const remainingCap = capBeforeClaim - payout;

  capRemaining.set(step.policy, remainingCap);

  return { payout, remainingCap };
};

export const runScenario = (scenario: unknown): { results: unknown[] } => {
  const { customer, steps } = scenario as Scenario;
  const capRemaining = new Map<number, number>();

  // Every contract after the customer's first is a follow-up.
  const results = steps.map((step, index) =>
    step.op === "claim"
      ? settleClaim(step, steps, capRemaining)
      : { premium: quotePremium(step, customer, index > 0) },
  );

  return { results };
};
