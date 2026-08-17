export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type QuoteStep = {
  op: "quote";
  items: Item[];
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
};

export type Step = QuoteStep | ClaimStep;

export type Customer = {
  yearsWithMHPCO: number;
};

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type ScenarioResults = {
  results: unknown[];
};

const sum = (amounts: number[]): number =>
  amounts.reduce((total, amount) => total + amount, 0);

const PROCESSING_FEE = 5;

// Binary floating point makes exact multiples land a hair off (100 * 1.1 + 5 =
// 115.00000000000001); snap to cent precision so only genuine fractions round.
const atCentPrecision = (amount: number): number => Number(amount.toFixed(6));

// The office rounds every amount its own way: premiums it collects go up,
// payouts it hands out go down.
const roundUpInMHPCOsFavour = (amount: number): number =>
  Math.ceil(atCentPrecision(amount));

const roundDownInMHPCOsFavour = (amount: number): number =>
  Math.floor(atCentPrecision(amount));

// One entry per insurable type: every fact the office knows about a type lives
// here, so adding a type is a single edit.
type ItemKind = {
  basePremium: number;
  insuranceValue: number;
  isComponent: boolean;
};

const ITEM_CATALOGUE: Record<string, ItemKind> = {
  sword: { basePremium: 100, insuranceValue: 1000, isComponent: false },
  amulet: { basePremium: 60, insuranceValue: 600, isComponent: false },
  staff: { basePremium: 80, insuranceValue: 800, isComponent: false },
  potion: { basePremium: 40, insuranceValue: 400, isComponent: false },
  rune: { basePremium: 25, insuranceValue: 250, isComponent: true },
  moonstone: { basePremium: 25, insuranceValue: 250, isComponent: true },
};

const kindOf = (item: Item): ItemKind => {
  const kind = ITEM_CATALOGUE[item.type];

  if (!kind) throw new Error(`The MHPCO does not insure "${item.type}" items.`);

  return kind;
};

const basePremiumOf = (item: Item): number => kindOf(item).basePremium;

const insuranceValueOf = (item: Item): number => kindOf(item).insuranceValue;

const isComponentOf = (item: Item): boolean => kindOf(item).isComponent;

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const groupByType = (items: Item[]): Item[][] => {
  const itemsByType = new Map<string, Item[]>();

  for (const item of items) {
    const sameTypeItems = itemsByType.get(item.type);
    if (sameTypeItems) sameTypeItems.push(item);
    else itemsByType.set(item.type, [item]);
  }

  return [...itemsByType.values()];
};

// A block is a special price for exactly 3 alike components; any other count,
// and any main item, is charged per item. Groups come from groupByType, which
// only ever emits non-empty ones, so the first item stands for the whole group.
const sameTypeBasePremiumOf = (sameTypeItems: Item[]): number =>
  sameTypeItems.length === BLOCK_SIZE && isComponentOf(sameTypeItems[0])
    ? BLOCK_BASE_PREMIUM
    : sum(sameTypeItems.map(basePremiumOf));

const policyBasePremiumOf = (items: Item[]): number =>
  sum(groupByType(items).map(sameTypeBasePremiumOf));

// Both rate tables stack the same way: every rule whose condition holds
// contributes its signed rate, and the rates add. Discounts carry a negative
// rate so a table sums without sign-juggling at the call site.
type RateRule<Subject> = {
  appliesTo: (subject: Subject) => boolean;
  rate: number;
};

const totalRateOf = <Subject>(
  rules: RateRule<Subject>[],
  subject: Subject,
): number =>
  sum(
    rules.filter(({ appliesTo }) => appliesTo(subject)).map(({ rate }) => rate),
  );

const HIGH_ENCHANTMENT_THRESHOLD = 5;

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const ITEM_SURCHARGES: RateRule<Item>[] = [
  { appliesTo: isCursed, rate: 0.5 },
  { appliesTo: isHighlyEnchanted, rate: 0.3 },
];

const itemSurchargeRateOf = (item: Item): number =>
  totalRateOf(ITEM_SURCHARGES, item);

// Item-specific surcharges are charged on that item's own base premium, not on
// the policy total.
const itemSurchargesOf = (item: Item): number =>
  basePremiumOf(item) * itemSurchargeRateOf(item);

// Everything outside the item list that a policy-wide modifier may depend on:
// who is asking, and where this quote sits in their history with the office.
type QuoteContext = {
  customer: Customer;
  precedingQuotes: number;
};

const LOYALTY_YEARS_THRESHOLD = 2;

const isLoyal = ({ customer }: QuoteContext): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const isFollowUpContract = ({ precedingQuotes }: QuoteContext): boolean =>
  precedingQuotes > 0;

// The first-insurance surcharge is unconditional: it is on every policy the
// office writes, so its condition is the constantly-true one.
const isInsuredWithMHPCO = (): boolean => true;

const POLICY_MODIFIERS: RateRule<QuoteContext>[] = [
  { appliesTo: isInsuredWithMHPCO, rate: 0.1 },
  { appliesTo: isLoyal, rate: -0.2 },
  { appliesTo: isFollowUpContract, rate: -0.15 },
];

// Policy-wide modifiers are charged on the base premium alone, never on base +
// item surcharges: a cursed sword quotes at 100 + 50 + 10 + 5 = 165, where the
// 10 is 10 % of 100 rather than of 150.
const policyModifierRateOf = (context: QuoteContext): number =>
  totalRateOf(POLICY_MODIFIERS, context);

const quote = (step: QuoteStep, context: QuoteContext): number => {
  const policyBasePremium = policyBasePremiumOf(step.items);
  const itemSurcharges = sum(step.items.map(itemSurchargesOf));
  const policyModifiers = policyBasePremium * policyModifierRateOf(context);

  return roundUpInMHPCOsFavour(
    policyBasePremium + itemSurcharges + policyModifiers + PROCESSING_FEE,
  );
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

const insuranceSumOf = (items: Item[]): number =>
  sum(items.map(insuranceValueOf));

const REDUCED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const REDUCED_REIMBURSEMENT_SHARE = 0.5;

// Heavily enchanted items are notoriously hard to appraise, so the office only
// reimburses half of the damage before applying the deductible.
const reimbursementShareOf = (item: Item): number =>
  (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD
    ? REDUCED_REIMBURSEMENT_SHARE
    : 1;

const rejectImpossibleDamage = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(
      `A damage cannot be worth less than nothing, but ${damage.amount} G was claimed for a "${damage.itemType}".`,
    );
  }
};

const payoutForDamage = (damage: Damage, damagedItem: Item): number => {
  rejectImpossibleDamage(damage);

  return (
    damage.amount * reimbursementShareOf(damagedItem) - DEDUCTIBLE_PER_DAMAGE
  );
};

// A claim points at the quote step that issued its policy. Every scenario under
// test points at a real quote, and the cast says so.
//
// DEFERRED, and deliberately not fixed here: a claim referencing a claim, or an
// out-of-range index, would read `.items` off the wrong thing and surface a
// TypeError — a stack trace, which is the one thing the CLI contract promises a
// refusal never is. The fix is a guard that refuses in the office's own voice,
// but choosing that wording is choosing behaviour, and no example asks for it
// yet. Left as a cast so the gap stays visible rather than silently decided.
const policyOf = (scenario: Scenario, step: ClaimStep): QuoteStep =>
  scenario.steps[step.policy] as QuoteStep;

// A damage names the type it hit; the clauses that shape its payout live on the
// insured item itself. Each damage claims one distinct insured item, so a policy
// covering one sword cannot absorb two sword damages: the items are handed out
// one at a time and never handed out twice. Both rejections fall out of that one
// mechanism — an uncovered type never matches, an over-claim finds none left.
type ClaimedDamage = { damage: Damage; damagedItem: Item };

const matchDamagesToInsuredItems = (
  damages: Damage[],
  insuredItems: Item[],
): ClaimedDamage[] => {
  const unclaimedItems = [...insuredItems];

  return damages.map((damage) => {
    const damagedItemIndex = unclaimedItems.findIndex(
      (item) => item.type === damage.itemType,
    );

    if (damagedItemIndex === -1) {
      throw new Error(
        `The policy does not cover a "${damage.itemType}" that is still unclaimed in this incident.`,
      );
    }

    return { damage, damagedItem: unclaimedItems.splice(damagedItemIndex, 1)[0] };
  });
};

const claim = (step: ClaimStep, policy: QuoteStep, remainingCap: number) => {
  const claimedDamages = matchDamagesToInsuredItems(
    step.incident.damages,
    policy.items,
  );
  const desiredPayout = roundDownInMHPCOsFavour(
    sum(
      claimedDamages.map(({ damage, damagedItem }) =>
        payoutForDamage(damage, damagedItem),
      ),
    ),
  );
  const payout = Math.min(desiredPayout, remainingCap);

  return { payout, remainingCap: remainingCap - payout };
};

const capOf = (policy: QuoteStep): number =>
  insuranceSumOf(policy.items) * CAP_MULTIPLE_OF_INSURANCE_SUM;

// A policy's cap is consumed by every claim against it, so what is left has to
// survive from one step to the next. The ledger owns that carrying-over: it
// starts a policy at its full cap on first sight, and remembers each drawdown.
const createCapLedger = () => {
  const remainingCapByPolicy = new Map<number, number>();

  return {
    remainingCapFor: (policyIndex: number, policy: QuoteStep): number =>
      remainingCapByPolicy.get(policyIndex) ?? capOf(policy),
    recordDrawdown: (policyIndex: number, remainingCap: number): void => {
      remainingCapByPolicy.set(policyIndex, remainingCap);
    },
  };
};

export const runScenario = (scenario: Scenario): ScenarioResults => {
  const capLedger = createCapLedger();

  const settleClaim = (step: ClaimStep) => {
    const policy = policyOf(scenario, step);
    const result = claim(
      step,
      policy,
      capLedger.remainingCapFor(step.policy, policy),
    );

    capLedger.recordDrawdown(step.policy, result.remainingCap);

    return result;
  };

  // The follow-up discount turns on the customer's quote history, so quotes are
  // what gets counted — claims sit in between and must not push a first
  // contract into looking like a second.
  let precedingQuotes = 0;

  const issueQuote = (step: QuoteStep) => {
    const premium = quote(step, {
      customer: scenario.customer,
      precedingQuotes,
    });

    precedingQuotes += 1;

    return { premium };
  };

  return {
    results: scenario.steps.map((step) =>
      step.op === "claim" ? settleClaim(step) : issueQuote(step),
    ),
  };
};
