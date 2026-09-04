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

export interface ScenarioResults {
  results: (QuoteResult | ClaimResult)[];
}

const sumBy = <T>(items: T[], amountOf: (item: T) => number): number =>
  items.reduce((total, item) => total + amountOf(item), 0);

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const BASE_PREMIUMS = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
} as const satisfies Record<string, number>;

// Internal to the price list, not part of the module's contract. Callers pass
// item types as plain strings and learn insurability from basePremiumForType's
// refusal; narrowing to this union would imply a compile-time check the module
// does not offer and would duplicate the price list at the boundary.
type InsurableItemType = keyof typeof BASE_PREMIUMS;

// The MHPCO's price list is the authority on what it will insure: a type it
// does not list cannot be quoted at all.
const basePremiumForType = (type: string): number => {
  const basePremium = BASE_PREMIUMS[type as InsurableItemType];
  if (basePremium === undefined) {
    throw new Error(`the MHPCO does not insure a ${type}`);
  }
  return basePremium;
};

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

// Items of one type, quoted together. A group of exactly 3 forms a building
// block and is offered at a flat base premium; any other size is priced per
// item. "Alike" means the same item type — 2 runes + 1 moonstone is two
// groups, so neither is a block.
type AlikeGroup = [type: string, items: Item[]];

const intoAlikeGroups = (items: Item[]): AlikeGroup[] => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    groups.set(item.type, [...(groups.get(item.type) ?? []), item]);
  }
  return [...groups];
};

const isBuildingBlock = ([, items]: AlikeGroup): boolean =>
  items.length === BLOCK_SIZE;

const basePremiumForGroup = (group: AlikeGroup): number => {
  const [type, items] = group;
  return isBuildingBlock(group)
    ? BLOCK_PREMIUM
    : items.length * basePremiumForType(type);
};

const sumBasePremiums = (items: Item[]): number =>
  sumBy(intoAlikeGroups(items), basePremiumForGroup);

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

// Item-specific modifiers apply to the base premium of the affected item, not
// to the policy total.
const surchargeRateForItem = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_RATE : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);

// Surcharges are charged against the item's own base premium, ignoring any
// building-block discount the item may be part of.
const surchargeForItem = (item: Item): number =>
  basePremiumForType(item.type) * surchargeRateForItem(item);

const sumItemSurcharges = (items: Item[]): number =>
  sumBy(items, surchargeForItem);

// Every amount is rounded in the MHPCO's favour, which cuts in opposite
// directions on either side of the ledger: a premium owed to the office rounds
// up, a payout owed by it rounds down. Only the final figure is rounded;
// intermediate amounts stay fractional.
const roundPremiumInMHPCOsFavour = Math.ceil;
const roundPayoutInMHPCOsFavour = Math.floor;

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

// Policy-wide modifiers are summed into one net rate, not compounded. The net
// is signed: a loyal customer's discount can outweigh the surcharge.
//
// The first insurance surcharge applies to every quote — each item in a quote
// is treated as a first insurance, regardless of customer history — so it is
// not cancelled by the follow-up contract discount.
const policyModifierRateFor = (
  customer: Customer,
  precedingContracts: number,
): number =>
  FIRST_INSURANCE_SURCHARGE_RATE -
  (isLoyal(customer) ? LOYALTY_DISCOUNT_RATE : 0) -
  (precedingContracts > 0 ? FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0);

// Charged against the policy base premium — the sum of all item base premiums —
// and added to it, mirroring how surchargeForItem works per item.
const policyModifierFor = (
  basePremium: number,
  customer: Customer,
  precedingContracts: number,
): number => basePremium * policyModifierRateFor(customer, precedingContracts);

const quotePremium = (
  items: Item[],
  customer: Customer,
  precedingContracts: number,
): number => {
  const basePremium = sumBasePremiums(items);
  const itemSurcharges = sumItemSurcharges(items);
  const policyModifier = policyModifierFor(
    basePremium,
    customer,
    precedingContracts,
  );
  return roundPremiumInMHPCOsFavour(
    basePremium + itemSurcharges + policyModifier + PROCESSING_FEE,
  );
};

// An item's insured worth, distinct from what it costs to insure.
const INSURANCE_VALUES = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
} as const satisfies Record<InsurableItemType, number>;

// Keyed off the price list rather than being an independent authority: the
// price list decides what is insurable, this table only says what an insurable
// item is worth. Reaching it with an uninsurable type means a quote was priced
// without being validated, which is a bug in the caller, not bad input — hence
// the distinct message.
const insuranceValueForType = (type: string): number => {
  const insuranceValue = INSURANCE_VALUES[type as InsurableItemType];
  if (insuranceValue === undefined) {
    throw new Error(`the MHPCO holds no insurance value for a ${type}`);
  }
  return insuranceValue;
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;

// A quote step creates a policy; later claim steps refer to it by that step's
// index. The cap is consumed as claims are paid.
interface Policy {
  items: Item[];
  remainingCap: number;
}

// The policy's total insured worth.
const insuranceSumFor = (items: Item[]): number =>
  sumBy(items, (item) => insuranceValueForType(item.type));

// The most the policy will ever pay out, derived from the plain item values.
// Nothing that moves the premium moves the cap: item surcharges cannot inflate
// it, and the building-block discount cannot deflate it.
const capFor = (items: Item[]): number =>
  CAP_MULTIPLE * insuranceSumFor(items);

// The policy owns its item list: it is copied out of the step so that draining
// a claim's pool can never reach back into the caller's scenario.
const openPolicy = (items: Item[]): Policy => ({
  items: [...items],
  remainingCap: capFor(items),
});

// Claims use their own, higher enchantment threshold — unrelated to the
// premium-side high-enchantment surcharge.
const REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HEAVY_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const isHeavilyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= REIMBURSEMENT_ENCHANTMENT_THRESHOLD;

// Damage to a heavily enchanted item is only half reimbursed.
//
// The spec's dragon-material clause is deliberately absent, not forgotten: it
// grants full reimbursement, which is already the default, and the heavy
// enchantment rule overrides it where both apply. No input exists for which
// reading `material` would change the payout, so a branch on it would be dead
// code. Reinstate one only if a rule makes dragon material differ from the
// default.
const reimbursementRateFor = (item: Item): number =>
  isHeavilyEnchanted(item)
    ? HEAVY_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

// Each damage entry is charged against one insured item, which no later entry
// may reuse — two sword damages need two insured swords. `unclaimed` is drained
// as entries are matched.
//
// This guard is also what rejects a damage entry naming a type the MHPCO does
// not insure at all. Such a type can never have reached a policy —
// basePremiumForType refuses it at quote time — so "not insured anywhere" is a
// strict subset of "not in this policy", and a separate unknown-type check here
// would be unreachable.
const claimInsuredItem = (unclaimed: Item[], damage: Damage): Item => {
  const at = unclaimed.findIndex((item) => item.type === damage.itemType);
  if (at === -1) {
    throw new Error(
      `the policy does not cover a ${damage.itemType} for this damage`,
    );
  }
  return unclaimed.splice(at, 1)[0];
};

// A damage report describes harm done, so a negative amount is not a small
// claim but a malformed one.
const damageAmountOf = (damage: Damage): number => {
  if (damage.amount < 0) {
    throw new Error(
      `a ${damage.itemType} cannot be damaged by ${damage.amount} G`,
    );
  }
  return damage.amount;
};

// The reimbursement rate applies to the damage first; the deductible comes off
// what remains, once per damage event rather than once per claim.
const payoutForDamage = (item: Item, damage: Damage): number =>
  damageAmountOf(damage) * reimbursementRateFor(item) - DEDUCTIBLE;

// Settling a claim consumes the policy's cap, so the policy carries less cover
// into the next claim. Kept separate from settleClaim so the state change is
// visible where the policy is held rather than hidden behind a pure-looking call.
const consumeCap = (policy: Policy, result: ClaimResult): Policy => ({
  ...policy,
  remainingCap: result.remainingCap,
});

const settleClaim = (policy: Policy, damages: Damage[]): ClaimResult => {
  const unclaimed = [...policy.items];
  // Per-damage amounts stay fractional; the claim total is rounded once, before
  // the cap is applied — rounding a capped figure would round the cap itself.
  const roundedClaimTotal = roundPayoutInMHPCOsFavour(
    sumBy(damages, (damage) =>
      payoutForDamage(claimInsuredItem(unclaimed, damage), damage),
    ),
  );
  // The cap limits what the policy will pay, so a claim beyond it is paid out
  // only as far as the cap reaches.
  const payout = Math.min(roundedClaimTotal, policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
};

// A claim names the quote step that opened its policy. An index matching no
// such step is a claim against cover that was never taken out.
const policyClaimedAgainst = (
  policies: Map<number, Policy>,
  quoteStepIndex: number,
): Policy => {
  const policy = policies.get(quoteStepIndex);
  if (policy === undefined) {
    throw new Error(
      `step ${quoteStepIndex} did not open a policy to claim against`,
    );
  }
  return policy;
};

// What a step is run against, as opposed to the step itself, which says what to
// do. `customer` and `precedingContracts` are a snapshot taken for this step;
// `policies` is the scenario's live ledger, which runStep writes through — a
// quote adds the policy it opens, a claim records the cap it consumed.
interface ScenarioContext {
  customer: Customer;
  precedingContracts: number;
  policies: Map<number, Policy>;
}

const runStep = (
  step: Step,
  { customer, precedingContracts, policies }: ScenarioContext,
  stepIndex: number,
): QuoteResult | ClaimResult => {
  switch (step.op) {
    case "quote": {
      // Priced before the policy is opened, so an uninsurable type is refused
      // by the price list — the authority on insurability — rather than by
      // insuranceValueForType, whose refusal reports a caller bug. The two are
      // otherwise independent: neither reads the other's effects.
      const premium = quotePremium(step.items, customer, precedingContracts);
      policies.set(stepIndex, openPolicy(step.items));
      return { premium };
    }
    case "claim": {
      const policy = policyClaimedAgainst(policies, step.policy);
      const result = settleClaim(policy, step.incident.damages);
      policies.set(step.policy, consumeCap(policy, result));
      return result;
    }
  }
};

// Each quote in a scenario forms a contract, so every quote after the first is
// a follow-up. Steps are run in order and a step sees only the contracts that
// precede it. Only quote steps create contracts.
export const runScenario = (scenario: Scenario): ScenarioResults => {
  const results: (QuoteResult | ClaimResult)[] = [];
  const policies = new Map<number, Policy>();
  let contractsSoFar = 0;
  scenario.steps.forEach((step, stepIndex) => {
    const context: ScenarioContext = {
      customer: scenario.customer,
      precedingContracts: contractsSoFar,
      policies,
    };
    results.push(runStep(step, context, stepIndex));
    if (step.op === "quote") contractsSoFar += 1;
  });
  return { results };
};
