export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: Incident };

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const FIRST_INSURANCE_RATE = 0.1;

// Kept as a separate additive term rather than folded into a `policyBase * 1.1`
// factor: that is not float-equivalent (100 * 1.1 === 110.00000000000001), and
// the final rounding-up turns the stray ulp into a whole extra gold piece.
// Do not "simplify".
const firstInsuranceSurcharge = (policyBase: number): number =>
  policyBase * FIRST_INSURANCE_RATE;

// The MHPCO rounds premiums in its own favour: up.
const premiumRoundedInMHPCOsFavour = (premium: number): number =>
  Math.ceil(premium);

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const basePremiumOf = (item: Item): number => {
  const basePremium = BASE_PREMIUM_BY_TYPE[item.type];
  if (basePremium === undefined) {
    throw new Error(`${item.type} is not on the MHPCO price list`);
  }
  return basePremium;
};

// An unenchanted item may leave `enchantment` unset; absent means level 0.
const enchantmentLevelOf = (item: Item): number => item.enchantment ?? 0;

// A group is every item of one single type, so a group is always non-empty
// and homogeneous — the block rule below relies on both.
interface TypeGroup {
  type: string;
  items: Item[];
}

const groupByType = (items: Item[]): TypeGroup[] =>
  [
    ...items.reduce(
      (groups, item) =>
        groups.set(item.type, [...(groups.get(item.type) ?? []), item]),
      new Map<string, Item[]>(),
    ),
  ].map(([type, groupedItems]) => ({ type, items: groupedItems }));

const formsComponentBlock = (group: TypeGroup): boolean =>
  group.items.length === COMPONENT_BLOCK_SIZE && COMPONENT_TYPES.has(group.type);

const sumOfItemBasePremiums = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumOf(item), 0);

const groupBasePremium = (group: TypeGroup): number =>
  formsComponentBlock(group)
    ? COMPONENT_BLOCK_PREMIUM
    : sumOfItemBasePremiums(group.items);

const policyBasePremium = (items: Item[]): number =>
  groupByType(items).reduce((sum, group) => sum + groupBasePremium(group), 0);

const CURSE_SURCHARGE_RATE = 0.5;

// Item-specific modifiers are charged on the affected item's own base premium,
// unlike the policy-wide modifiers which apply to the sum of all of them.
const curseSurcharge = (item: Item): number =>
  item.cursed ? basePremiumOf(item) * CURSE_SURCHARGE_RATE : 0;

// The surcharge threshold below and the reimbursement threshold further down
// are two unrelated rules that happen to share the word "enchantment". They
// are named apart on purpose: neither is the general case of the other, and
// they are deliberately not the same number.
const SURCHARGE_ENCHANTMENT_LEVEL = 5;
const SURCHARGE_ENCHANTMENT_RATE = 0.3;

const isEnchantedEnoughToSurcharge = (item: Item): boolean =>
  enchantmentLevelOf(item) >= SURCHARGE_ENCHANTMENT_LEVEL;

const enchantmentSurcharge = (item: Item): number =>
  isEnchantedEnoughToSurcharge(item)
    ? basePremiumOf(item) * SURCHARGE_ENCHANTMENT_RATE
    : 0;

const itemSurcharge = (item: Item): number =>
  curseSurcharge(item) + enchantmentSurcharge(item);

const totalItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharge(item), 0);

const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

const loyaltyDiscount = (customer: Customer, policyBase: number): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS
    ? policyBase * LOYALTY_DISCOUNT_RATE
    : 0;

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

// Every contract after the customer's first is a follow-up. Which contract
// this is depends on how many quotes preceded it in the scenario, not on the
// customer record.
const followUpDiscount = (precedingQuotes: number, policyBase: number): number =>
  precedingQuotes > 0 ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;

// Everything a step needs beyond its own payload: who is buying, where in the
// scenario the step sits, and the surrounding steps a claim resolves its
// `policy` reference against. Bundled so callers thread one named value rather
// than a trail of bare parameters.
interface StepContext {
  customer: Customer;
  precedingQuotes: number;
  steps: Step[];
  // Cap left on each policy that has already been claimed against; a policy
  // absent from the map has its full cap available.
  remainingCapByPolicy: Map<number, number>;
}

// Policy-wide modifiers are charged on the sum of all item base premiums,
// unlike the item-specific ones above. Each returns a signed adjustment:
// surcharges positive, discounts negative.
const policyModifiers = (policyBase: number, context: StepContext): number =>
  firstInsuranceSurcharge(policyBase) -
  loyaltyDiscount(context.customer, policyBase) -
  followUpDiscount(context.precedingQuotes, policyBase);

const quotePremium = (items: Item[], context: StepContext): number => {
  const policyBase = policyBasePremium(items);
  return premiumRoundedInMHPCOsFavour(
    policyBase +
      policyModifiers(policyBase, context) +
      totalItemSurcharges(items) +
      PROCESSING_FEE,
  );
};

const DEDUCTIBLE = 100;
const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const CAP_MULTIPLE = 2;

// And payouts in its own favour too: down.
const payoutRoundedInMHPCOsFavour = (payout: number): number =>
  Math.floor(payout);

// Unguarded lookup, unlike `basePremiumOf` above. Not an oversight: a claim
// resolves its items out of an already-quoted policy, so every item reaching
// here has passed that function's price-list check. An unknown type is
// rejected at quote time and never gets as far as an insurance value.
const totalInsuredValue = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE_BY_TYPE[item.type], 0);

const capOf = (items: Item[]): number => totalInsuredValue(items) * CAP_MULTIPLE;

// Unrelated to the surcharge threshold above — see the note there.
const HALVED_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HALVED_REIMBURSEMENT_RATE = 0.5;

// Highly enchanted items are notoriously hard to appraise, so the MHPCO
// reimburses only half their damage.
const isEnchantedEnoughToHalve = (item: Item): boolean =>
  enchantmentLevelOf(item) >= HALVED_REIMBURSEMENT_ENCHANTMENT_LEVEL;

const coveredAmount = (damage: Damage, item: Item): number =>
  isEnchantedEnoughToHalve(item)
    ? damage.amount * HALVED_REIMBURSEMENT_RATE
    : damage.amount;

const reimbursement = (damage: Damage, item: Item): number =>
  coveredAmount(damage, item) - DEDUCTIBLE;

// Both ways a single damage entry can be inadmissible. They are checked
// together, at the one place that already walks every entry, because they are
// the same kind of rule — an entry the policy cannot answer — and either one
// rejects the whole claim before any money is computed.
const rejectUnmatchedDamage = (damage: Damage, matchIndex: number): void => {
  if (matchIndex === -1) {
    throw new Error(`${damage.itemType} is not insured by this policy`);
  }
};

const rejectNegativeDamage = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(`damage amount ${damage.amount} is negative`);
  }
};

// Each damage entry is answered by one insured item, which that entry uses up:
// two damaged swords need two insured swords. An entry with no item left to
// match rejects the whole claim.
//
// Pairing is kept separate from summing so that each half states one rule: this
// function owns "which item answers which damage, and is this entry one the
// policy can answer at all", and the caller owns "what does each pair pay".
const pairDamagesWithInsuredItems = (
  damages: Damage[],
  insuredItems: Item[],
): { damage: Damage; item: Item }[] => {
  const unclaimedItems = [...insuredItems];
  return damages.map((damage) => {
    const index = unclaimedItems.findIndex(
      ({ type }) => type === damage.itemType,
    );
    rejectUnmatchedDamage(damage, index);
    rejectNegativeDamage(damage);
    const [item] = unclaimedItems.splice(index, 1);
    return { damage, item };
  });
};

const claimPayout = (incident: Incident, insuredItems: Item[]): number =>
  payoutRoundedInMHPCOsFavour(
    pairDamagesWithInsuredItems(incident.damages, insuredItems).reduce(
      (total, { damage, item }) => total + reimbursement(damage, item),
      0,
    ),
  );

// A claim's `policy` is an index into the scenario's own steps, so it can miss
// in two ways: point past the end, or point at another claim. Both are the same
// mistake — a policy reference that no policy answers — and both are reported
// here rather than left to surface as a bare property access on `undefined`.
// (`steps[policy]` is typed `Step`, but only because `noUncheckedIndexedAccess`
// is off; at runtime an out-of-range index really is `undefined`.)
const insuredItemsOf = (steps: Step[], policy: number): Item[] => {
  const policyStep = steps.at(policy);
  if (policyStep === undefined || policyStep.op !== "quote") {
    throw new Error(`step ${policy} is not a quote`);
  }
  return policyStep.items;
};

const runQuote = (items: Item[], context: StepContext): StepResult => ({
  premium: quotePremium(items, context),
});

// A claim both reports its remaining cap and spends it: the cap it leaves
// behind is what the policy's next claim may draw on, so this writes the
// figure back into the running context as well as returning it.
const runClaim = (
  policy: number,
  incident: Incident,
  context: StepContext,
): StepResult => {
  const insuredItems = insuredItemsOf(context.steps, policy);
  const availableCap =
    context.remainingCapByPolicy.get(policy) ?? capOf(insuredItems);
  const payout = Math.min(claimPayout(incident, insuredItems), availableCap);
  const remainingCap = availableCap - payout;
  context.remainingCapByPolicy.set(policy, remainingCap);
  return { payout, remainingCap };
};

const runStep = (step: Step, context: StepContext): StepResult =>
  step.op === "quote"
    ? runQuote(step.items, context)
    : runClaim(step.policy, step.incident, context);

export const runScenario = (scenario: Scenario): ScenarioResult => {
  // Steps are run in order because later ones depend on earlier ones: a quote
  // makes every following quote a follow-up contract, and a claim spends cap
  // that every following claim on the same policy has to do without.
  const remainingCapByPolicy = new Map<number, number>();
  let precedingQuotes = 0;
  const results = scenario.steps.map((step) => {
    const result = runStep(step, {
      customer: scenario.customer,
      precedingQuotes,
      steps: scenario.steps,
      remainingCapByPolicy,
    });
    if (step.op === "quote") {
      precedingQuotes += 1;
    }
    return result;
  });
  return { results };
};
