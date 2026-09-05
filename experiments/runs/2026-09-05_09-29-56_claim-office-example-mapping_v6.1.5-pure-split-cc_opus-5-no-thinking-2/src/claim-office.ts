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

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const BLOCK_SIZE = 3;

const BLOCK_BASE_PREMIUM = 60;

// Every figure in a policy is a sum over some collection, so the fold itself
// is named once and the call sites say only what each element contributes.
const sumOf = <T>(items: T[], valueOf: (item: T) => number): number =>
  items.reduce((sum, item) => sum + valueOf(item), 0);

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();

  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }

  return counts;
};

const typeGroupBasePremiumOf = ([type, count]: [string, number]): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * BASE_PREMIUMS[type];

const policyBasePremiumOf = (items: Item[]): number =>
  sumOf([...countByType(items)], typeGroupBasePremiumOf);

const HIGH_ENCHANTMENT_THRESHOLD = 5;

// An item surcharge hits every item the predicate accepts, charging its rate
// against that item's own base premium.
interface ItemSurcharge {
  appliesTo: (item: Item) => boolean;
  rate: number;
}

const ITEM_SURCHARGES: ItemSurcharge[] = [
  { appliesTo: (item) => item.cursed === true, rate: 0.5 },
  {
    appliesTo: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    rate: 0.3,
  },
];

// One surcharge, totalled across every item it accepts.
const surchargeAcrossItems = (
  items: Item[],
  { appliesTo, rate }: ItemSurcharge,
): number =>
  sumOf(items.filter(appliesTo), (item) => BASE_PREMIUMS[item.type] * rate);

const itemSurchargesOf = (items: Item[]): number =>
  sumOf(ITEM_SURCHARGES, (surcharge) => surchargeAcrossItems(items, surcharge));

const LOYALTY_DISCOUNT_RATE = -0.2;

const LOYALTY_YEARS_THRESHOLD = 2;

const FOLLOW_UP_DISCOUNT_RATE = -0.15;

// The context a policy-wide modifier is judged against: who the customer is,
// and how many quotes they have already been given in this scenario.
interface PolicyContext {
  customer: Customer;
  precedingQuotes: number;
}

// A policy modifier hits the whole policy when the predicate accepts it,
// charging its rate against the policy base premium. Discounts are negative
// rates, so surcharges and discounts sum uniformly.
interface PolicyModifier {
  appliesTo: (context: PolicyContext) => boolean;
  rate: number;
}

const POLICY_MODIFIERS: PolicyModifier[] = [
  { appliesTo: () => true, rate: FIRST_INSURANCE_SURCHARGE_RATE },
  {
    appliesTo: ({ customer }) =>
      customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
    rate: LOYALTY_DISCOUNT_RATE,
  },
  {
    appliesTo: ({ precedingQuotes }) => precedingQuotes >= 1,
    rate: FOLLOW_UP_DISCOUNT_RATE,
  },
];

// Policy-wide modifiers apply to the policy base premium, so they are computed
// from the base alone — item-specific modifiers are not part of their base.
const policyModifiersOf = (policyBase: number, context: PolicyContext): number =>
  sumOf(
    POLICY_MODIFIERS.filter(({ appliesTo }) => appliesTo(context)),
    ({ rate }) => policyBase * rate,
  );

const isInsurable = (item: Item): boolean => item.type in BASE_PREMIUMS;

// MHPCO only writes policies over item types it has a price for, so an
// unpriceable item is rejected before any of it is quoted.
const rejectUninsurableItems = (items: Item[]): void => {
  const uninsurableItem = items.find((item) => !isInsurable(item));

  if (uninsurableItem)
    throw new Error(`unknown item type: ${uninsurableItem.type}`);
};

const quote = ({ items }: QuoteStep, context: PolicyContext): QuoteResult => {
  rejectUninsurableItems(items);

  const policyBase = policyBasePremiumOf(items);

  const premiumBeforeRounding =
    policyBase +
    itemSurchargesOf(items) +
    policyModifiersOf(policyBase, context) +
    PROCESSING_FEE;

  return { premium: Math.ceil(premiumBeforeRounding) };
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;

const CAP_MULTIPLE = 2;

// A policy created by a quote step: what it covers, and how much of its
// payout cap is still available.
interface Policy {
  items: Item[];
  remainingCap: number;
}

const policyFor = (items: Item[]): Policy => {
  const insuranceSum = sumOf(items, (item) => INSURANCE_VALUES[item.type]);

  return { items, remainingCap: CAP_MULTIPLE * insuranceSum };
};

const HALVED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;

const HALF_REIMBURSEMENT_RATE = 0.5;

const FULL_REIMBURSEMENT_RATE = 1;

// Damage to a highly enchanted item is reimbursed at half, before the
// deductible is taken off.
const reimbursementRateFor = (item: Item): number =>
  (item.enchantment ?? 0) >= HALVED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD
    ? HALF_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

const payoutForDamage = (damage: Damage, damagedItem: Item): number =>
  damage.amount * reimbursementRateFor(damagedItem) - DEDUCTIBLE;

// Settling a claim both reports a result and draws down the policy's cap.
interface Settlement {
  result: ClaimResult;
  updatedPolicy: Policy;
}

// A damage matched to the insured item it settles against.
interface MatchedDamage {
  damage: Damage;
  damagedItem: Item;
}

// A claim only pays against items the policy actually covers, so a damage with
// no still-available item of its type is rejected before any of it is settled.
// Removes the matched item from `available`, so it cannot be matched twice.
const takeInsuredItemFor = (damage: Damage, available: Item[]): Item => {
  const index = available.findIndex((item) => item.type === damage.itemType);

  if (index < 0)
    throw new Error(`damaged item is not insured: ${damage.itemType}`);

  return available.splice(index, 1)[0];
};

// Each damage settles against a distinct insured item, so a policy covering
// two swords can absorb two sword damages — one per insured sword. Matching an
// item consumes it, leaving it unavailable to later damages.
const matchDamagesToItems = (
  damages: Damage[],
  items: Item[],
): MatchedDamage[] => {
  const available = [...items];

  return damages.map((damage) => ({
    damage,
    damagedItem: takeInsuredItemFor(damage, available),
  }));
};

// MHPCO does not entertain damage reports it would have to pay backwards.
const rejectNegativeDamages = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);

  if (negative) throw new Error(`damage amount is negative: ${negative.amount}`);
};

// The total payout per policy is capped, so a claim pays at most what the
// policy has left. Rounded down in the MHPCO's favour, so the cap is drawn
// down by whole G and both reported figures stay integers.
const payableUpTo = (remainingCap: number, desiredPayout: number): number =>
  Math.floor(Math.min(desiredPayout, remainingCap));

const claim = ({ incident }: ClaimStep, policy: Policy): Settlement => {
  rejectNegativeDamages(incident.damages);

  const desiredPayout = sumOf(
    matchDamagesToItems(incident.damages, policy.items),
    ({ damage, damagedItem }) => payoutForDamage(damage, damagedItem),
  );

  const payout = payableUpTo(policy.remainingCap, desiredPayout);

  const remainingCap = policy.remainingCap - payout;

  return {
    result: { payout, remainingCap },
    updatedPolicy: { ...policy, remainingCap },
  };
};

export const runScenario = ({ customer, steps }: Scenario): ScenarioResult => {
  const results: StepResult[] = [];

  const policies = new Map<number, Policy>();

  let precedingQuotes = 0;

  steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push(quote(step, { customer, precedingQuotes }));
      policies.set(index, policyFor(step.items));
      precedingQuotes += 1;

      return;
    }

    const { result, updatedPolicy } = claim(step, policies.get(step.policy)!);

    results.push(result);
    policies.set(step.policy, updatedPolicy);
  });

  return { results };
};
