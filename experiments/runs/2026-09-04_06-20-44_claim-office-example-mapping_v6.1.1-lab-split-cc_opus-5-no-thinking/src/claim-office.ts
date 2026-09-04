export type Item = {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
};

export type QuoteStep = {
  op: string;
  items: Item[];
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type ClaimStep = {
  op: string;
  policy: number;
  incident: Incident;
};

export type Step = QuoteStep | ClaimStep;

export type Customer = {
  yearsWithMHPCO: number;
};

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteResult = {
  premium: number;
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

export type StepResult = QuoteResult | ClaimResult;

export type ScenarioOutcome = {
  results: StepResult[];
};

const PROCESSING_FEE = 5;

// The MHPCO price list. The spec states an insurance value and a base premium
// per item as a PAIR, so they live in one row rather than two parallel tables:
// a new item type cannot be added to one column and forgotten in the other.
//
// The two columns happen to sit at a 10:1 ratio for every current item, but the
// spec never states that as a rule — it lists both numbers for each item. So
// the premium is not derived from the insurance value; a future item priced off
// that ratio has somewhere to go.
const PRICE_LIST = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
} satisfies Record<string, { insuranceValue: number; basePremium: number }>;

type InsurableType = keyof typeof PRICE_LIST;

const isInsurableType = (type: string): type is InsurableType =>
  type in PRICE_LIST;

const FIRST_INSURANCE_PERCENT = 10;

// Multiply before dividing: `amount * 1.1` drifts (115.00000000000001) and
// Math.ceil turns the drift into a whole extra gold piece. The spec requires
// intermediates to stay exact, so every percentage goes through here.
const PERCENT_WHOLE = 100;

const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / PERCENT_WHOLE;

// Rounding always favours MHPCO: premiums round up, payouts round down.
const roundPremium = (amount: number): number => Math.ceil(amount);

// The cast is safe by construction: rejectIfUnknownItemTypes runs before any
// pricing, so every type reaching a price lookup is on the list.
const priceOfType = (type: string) => PRICE_LIST[type as InsurableType];

const basePremiumOfType = (type: string): number =>
  priceOfType(type).basePremium;

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

// Tallies how often each type name appears. Callers pass the type strings they
// want counted, so nothing has to be dressed up as an Item just to be tallied.
const countByType = (types: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const type of types) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

// The two sides of a claim name their type differently: an insured item calls
// it `type`, a damage entry calls it `itemType`. Both project to the same
// vocabulary so countByType can compare insured against damaged.
const insuredTypesOf = (items: Item[]): string[] =>
  items.map((item) => item.type);

const damagedTypesOf = (damages: Damage[]): string[] =>
  damages.map((damage) => damage.itemType);

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

// A building block is exactly 3 alike components. Blocks are only offered on
// components, never on main items, and only at exactly 3 — 4 runes are priced
// per item, not as a block plus one.
const formsBuildingBlock = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === BLOCK_SIZE;

// A group of alike items is priced as a building block if it forms one, and
// per item otherwise.
const groupBasePremiumOf = (type: string, count: number): number =>
  formsBuildingBlock(type, count)
    ? BLOCK_BASE_PREMIUM
    : count * basePremiumOfType(type);

// The policy base premium is the sum of the base premiums of each group of
// alike items.
const policyBasePremiumOf = (items: Item[]): number =>
  [...countByType(insuredTypesOf(items))].reduce(
    (total, [type, count]) => total + groupBasePremiumOf(type, count),
    0,
  );

// Item-specific surcharges are additive percentages of the affected item's OWN
// base premium — they never compound with each other, and never apply to the
// policy total.
const CURSE_PERCENT = 50;
const HIGH_ENCHANTMENT_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const surchargePercentOf = (item: Item): number =>
  (isCursed(item) ? CURSE_PERCENT : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_PERCENT : 0);

const itemSurchargesOf = (items: Item[]): number =>
  items.reduce(
    (total, item) =>
      total + percentOf(basePremiumOfType(item.type), surchargePercentOf(item)),
    0,
  );

const LOYALTY_PERCENT = 20;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_CONTRACT_PERCENT = 15;

const isLongStanding = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

// Policy-wide modifiers are additive percentages of the policy base premium:
// they never compound with each other. A discount is simply a negative
// percentage, so surcharges and discounts sum in a single list.
const policyModifierPercentOf = (
  customer: Customer,
  isFollowUpContract: boolean,
): number =>
  FIRST_INSURANCE_PERCENT +
  (isLongStanding(customer) ? -LOYALTY_PERCENT : 0) +
  (isFollowUpContract ? -FOLLOW_UP_CONTRACT_PERCENT : 0);

// Only items on the MHPCO price list can be insured. This runs before any
// pricing, so every later PRICE_LIST lookup is guaranteed to hit a row.
const rejectIfUnknownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!isInsurableType(item.type)) {
      throw new Error(`unknown item type ${item.type}`);
    }
  }
};

const processQuote = (
  step: QuoteStep,
  customer: Customer,
  isFollowUpContract: boolean,
): QuoteResult => {
  rejectIfUnknownItemTypes(step.items);

  const basePremium = policyBasePremiumOf(step.items);
  const policyModifiers = percentOf(
    basePremium,
    policyModifierPercentOf(customer, isFollowUpContract),
  );

  return {
    premium: roundPremium(
      basePremium +
        itemSurchargesOf(step.items) +
        policyModifiers +
        PROCESSING_FEE,
    ),
  };
};

const insuranceValueOfType = (type: string): number =>
  priceOfType(type).insuranceValue;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

// Rounding always favours MHPCO: payouts round down.
const roundPayout = (amount: number): number => Math.floor(amount);

const insuranceSumOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueOfType(item.type), 0);

// A policy is created by a quote step and accumulates claims against its cap.
type Policy = {
  items: Item[];
  remainingCap: number;
};

// The cap is twice the insurance sum of the covered items. It is derived from
// the UNMODIFIED insurance values: neither premium surcharges nor the building
// block discount move it, so it is computed from the items alone.
const openPolicyFor = (items: Item[]): Policy => ({
  items,
  remainingCap: CAP_MULTIPLIER * insuranceSumOf(items),
});

const isClaimStep = (step: Step): step is ClaimStep => step.op === "claim";

// Distinct from HIGH_ENCHANTMENT_THRESHOLD (5) above, which bands an item as
// risky enough to carry a premium SURCHARGE. This higher bar marks an item as
// volatile: MHPCO caps its exposure by reimbursing only half the damage. Two
// unrelated rules that happen to both read the enchantment level — they are
// free to move independently, so they get independent names and constants.
const VOLATILE_ENCHANTMENT_THRESHOLD = 8;
const VOLATILE_REIMBURSEMENT_PERCENT = 50;

const isVolatilelyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= VOLATILE_ENCHANTMENT_THRESHOLD;

const DRAGON_MATERIAL = "dragon";
const FULL_REIMBURSEMENT_PERCENT = 100;

const isDragonMaterial = (item: Item): boolean =>
  item.material === DRAGON_MATERIAL;

// Special clauses in precedence order: where an item is both dragon material
// and volatilely enchanted, the 50 % rule wins.
//
// The dragon branch returns what the default returns, so no test can tell it
// from the fallthrough. It is kept because the spec states dragon material as
// its own rule — if full reimbursement ever stops being the default, dragon
// material should stay full rather than silently follow it.
const reimbursementPercentFor = (item: Item): number => {
  if (isVolatilelyEnchanted(item)) return VOLATILE_REIMBURSEMENT_PERCENT;
  if (isDragonMaterial(item)) return FULL_REIMBURSEMENT_PERCENT;
  return FULL_REIMBURSEMENT_PERCENT;
};

// The deductible is withheld once per damaged item, so it is subtracted per
// damage entry rather than once from the incident total. Special clauses reduce
// the reimbursement first; the deductible always comes last.
const netPayableFor = (damage: Damage, item: Item): number =>
  percentOf(damage.amount, reimbursementPercentFor(item)) - DEDUCTIBLE;

// The insured item a damage entry refers to. The cast is safe by construction:
// rejectIfOverclaimed runs before any payout is computed and throws for any
// damage type whose damaged count exceeds its insured count. An uninsured type
// has an insured count of 0, so a single damage entry naming it is already
// overclaimed and never reaches here — every type that does reach here has at
// least one matching item in the policy.
const insuredItemFor = (damage: Damage, policy: Policy): Item =>
  policy.items.find((item) => item.type === damage.itemType) as Item;

// Named for what it sums: each entry has already had its deductible withheld
// by netPayableFor, so this is the payable total, not the reimbursement total.
const totalPayableFor = (incident: Incident, policy: Policy): number =>
  incident.damages.reduce(
    (total, damage) =>
      total + netPayableFor(damage, insuredItemFor(damage, policy)),
    0,
  );

// A policy covers a fixed set of items, so a claim cannot report more damaged
// items of a type than the policy actually covers.
const rejectIfOverclaimed = (incident: Incident, policy: Policy): void => {
  const insured = countByType(insuredTypesOf(policy.items));
  const damaged = countByType(damagedTypesOf(incident.damages));

  for (const [type, damagedCount] of damaged) {
    const insuredCount = insured.get(type) ?? 0;
    if (damagedCount > insuredCount) {
      throw new Error(
        `claim reports ${damagedCount} damaged ${type}(s) but the policy covers ${insuredCount}`,
      );
    }
  }
};

const rejectIfNegativeDamage = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(
        `damage to ${damage.itemType} has a negative amount ${damage.amount}`,
      );
    }
  }
};

// Pure: reports what the claim pays and what the cap would be left at. The
// caller owns writing the depleted cap back to the policy.
const processClaim = (step: ClaimStep, policy: Policy): ClaimResult => {
  rejectIfNegativeDamage(step.incident);
  rejectIfOverclaimed(step.incident, policy);

  const uncappedPayout = roundPayout(totalPayableFor(step.incident, policy));
  // The total payout per policy is capped; a claim gets whatever cap is left.
  const payout = Math.min(uncappedPayout, policy.remainingCap);

  return { payout, remainingCap: policy.remainingCap - payout };
};

export const runScenario = (scenario: Scenario): ScenarioOutcome => {
  const policies = new Map<number, Policy>();
  let quotesSoFar = 0;

  const results = scenario.steps.map((step, index): StepResult => {
    if (isClaimStep(step)) {
      const policy = policies.get(step.policy);
      if (policy === undefined) {
        throw new Error(`no policy was created by step ${step.policy}`);
      }

      const result = processClaim(step, policy);
      // Claims deplete the cap for every later claim against this policy.
      policy.remainingCap = result.remainingCap;
      return result;
    }

    const result = processQuote(step, scenario.customer, quotesSoFar > 0);
    quotesSoFar += 1;
    policies.set(index, openPolicyFor(step.items));
    return result;
  });

  return { results };
};
