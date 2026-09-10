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

const FIRST_INSURANCE_SURCHARGE = 0.1;

// The two figures MHPCO keeps per insurable item type. They belong in one row:
// a type the office will quote is a type it will also pay out on, and holding
// the pair together means a new item type cannot be given a premium but no
// insurance value (or the reverse) by editing only one of two tables.
const CATALOGUE: Record<string, { basePremium: number; insuranceValue: number }> =
  {
    sword: { basePremium: 100, insuranceValue: 1000 },
    amulet: { basePremium: 60, insuranceValue: 600 },
    staff: { basePremium: 80, insuranceValue: 800 },
    potion: { basePremium: 40, insuranceValue: 400 },
    rune: { basePremium: 25, insuranceValue: 250 },
    moonstone: { basePremium: 25, insuranceValue: 250 },
  };

const catalogueEntryFor = (type: string) => {
  const entry = CATALOGUE[type];
  if (entry === undefined) throw new Error(`unknown item type: ${type}`);
  return entry;
};

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_DISCOUNT = 0.15;
const LOYALTY_YEARS = 2;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const PREMIUM_SURCHARGE_ENCHANTMENT_LEVEL = 5;

const sumOf = <T>(values: T[], amountOf: (value: T) => number): number =>
  values.reduce((total, value) => total + amountOf(value), 0);

// The block rule prices alike items together, so a policy's items are tallied
// by type before any base premium is worked out.
const countByType = (items: Item[]): Map<string, number> =>
  items.reduce(
    (counts, item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1),
    new Map<string, number>(),
  );

const basePremiumOf = (type: string): number =>
  catalogueEntryFor(type).basePremium;

const alikeItemsBasePremium = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * basePremiumOf(type);

const policyBasePremium = (items: Item[]): number =>
  sumOf([...countByType(items)], ([type, count]) =>
    alikeItemsBasePremium(type, count),
  );

// Deliberately `amount + amount * rate`, not `amount * (1 + rate)`:
// `1 + 0.1` is inexact in binary floating point, so the latter yields
// 110.00000000000001 for 100 G. Since premiums round UP (in MHPCO's favor),
// that epsilon would overcharge by a whole Gold piece.
const withFirstInsuranceSurcharge = (amount: number): number =>
  amount + amount * FIRST_INSURANCE_SURCHARGE;

// "In the MHPCO's favor" means opposite directions on either side of the
// ledger: money coming in rounds up, money going out rounds down.
const roundPremiumInMHPCOsFavor = (premium: number): number => Math.ceil(premium);
const roundPayoutInMHPCOsFavor = (payout: number): number => Math.floor(payout);

const enchantmentOf = (item: Item): number => item.enchantment ?? 0;

const isEnchantedEnoughForPremiumSurcharge = (item: Item): boolean =>
  enchantmentOf(item) >= PREMIUM_SURCHARGE_ENCHANTMENT_LEVEL;

// Both surcharges are a rate on the item's *own* base premium — never on the
// policy base, which may have been reduced by a block discount.
const surchargeOn = (item: Item, rate: number): number =>
  basePremiumOf(item.type) * rate;

const curseSurcharge = (item: Item): number =>
  item.cursed ? surchargeOn(item, CURSE_SURCHARGE) : 0;

const highEnchantmentSurcharge = (item: Item): number =>
  isEnchantedEnoughForPremiumSurcharge(item)
    ? surchargeOn(item, HIGH_ENCHANTMENT_SURCHARGE)
    : 0;

const itemSurchargesTotal = (items: Item[]): number =>
  sumOf(items, (item) => curseSurcharge(item) + highEnchantmentSurcharge(item));

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS;

// Like the surcharges, the loyalty discount is a rate on the policy base —
// not on the base already grown by the first-insurance surcharge.
const loyaltyDiscount = (policyBase: number, customer: Customer): number =>
  isLoyal(customer) ? policyBase * LOYALTY_DISCOUNT : 0;

const isFollowUpContract = (previousContracts: number): boolean =>
  previousContracts > 0;

const followUpContractDiscount = (
  policyBase: number,
  previousContracts: number,
): number =>
  isFollowUpContract(previousContracts) ? policyBase * FOLLOW_UP_DISCOUNT : 0;

const quotePremium = (
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number => {
  const policyBase = policyBasePremium(items);
  // Not a delta: this is the policy base *after* the policy-wide surcharge and
  // discounts, which the item surcharges and the flat fee are then added to.
  const adjustedPolicyBase =
    withFirstInsuranceSurcharge(policyBase) -
    loyaltyDiscount(policyBase, customer) -
    followUpContractDiscount(policyBase, previousContracts);
  return roundPremiumInMHPCOsFavor(
    adjustedPolicyBase + itemSurchargesTotal(items) + PROCESSING_FEE,
  );
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;

const insuranceValueOf = (type: string): number =>
  catalogueEntryFor(type).insuranceValue;

const policyInsuranceSum = (items: Item[]): number =>
  sumOf(items, (item) => insuranceValueOf(item.type));

const HALVED_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

// A *higher* bar than the premium surcharge's level 5: an item can be enchanted
// enough to cost more to insure without being enchanted enough to pay out less.
const isEnchantedEnoughForHalvedReimbursement = (item: Item): boolean =>
  enchantmentOf(item) >= HALVED_REIMBURSEMENT_ENCHANTMENT_LEVEL;

// The special clause reduces the damage amount first; the deductible is taken
// from what the clause leaves.
const damagePayout = (damage: Damage, damagedItem: Item): number => {
  const reimbursed = isEnchantedEnoughForHalvedReimbursement(damagedItem)
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;
  return reimbursed - DEDUCTIBLE;
};

// The cap is twice the policy's insurance sum — driven by the insured items'
// values alone, never by the premium the customer happened to be quoted.
const policyCap = (insuredItems: Item[]): number =>
  policyInsuranceSum(insuredItems) * CAP_MULTIPLE;

// A claim never pays more than the policy's cap has left, so its result is
// both the payout and the cap the *next* claim on that policy starts from.
interface ClaimResult {
  payout: number;
  remainingCap: number;
}

// A policy covering one sword answers for one damaged sword, so each damage
// entry claims a *distinct* insured item. Pairing them off is what enforces
// that: a damage left without a partner names something the policy does not
// insure — an uninsured type, an unknown type, or one sword too many — and the
// whole claim is rejected.
const damagesPairedWithInsuredItems = (
  damages: Damage[],
  insuredItems: Item[],
): [Damage, Item][] => {
  const unclaimed = [...insuredItems];
  return damages.map((damage) => {
    const index = unclaimed.findIndex((item) => item.type === damage.itemType);
    if (index < 0) {
      throw new Error(`policy does not cover a damaged ${damage.itemType}`);
    }
    return [damage, ...unclaimed.splice(index, 1)] as [Damage, Item];
  });
};

const rejectNegativeAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must not be negative: ${damage.amount}`);
    }
  }
};

const claimResult = (
  incident: Incident,
  insuredItems: Item[],
  capRemaining: number,
): ClaimResult => {
  rejectNegativeAmounts(incident.damages);
  const desiredPayout = sumOf(
    damagesPairedWithInsuredItems(incident.damages, insuredItems),
    ([damage, damagedItem]) => damagePayout(damage, damagedItem),
  );
  const payout = roundPayoutInMHPCOsFavor(Math.min(desiredPayout, capRemaining));
  return { payout, remainingCap: capRemaining - payout };
};

const isQuote = (step: Step): boolean => step.op === "quote";

// A quote's premium depends on how many contracts precede it, so each step is
// run against the quotes that came before it rather than a mutable counter.
const contractsBefore = (steps: Step[], index: number): number =>
  steps.slice(0, index).filter(isQuote).length;

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const insuredItemsOf = (policyIndex: number): Item[] => {
    const policyStep = scenario.steps[policyIndex];
    if (policyStep?.op !== "quote") {
      throw new Error(`step ${policyIndex} is not a quote`);
    }
    return policyStep.items;
  };

  // Each policy's cap is consumed across successive claims, so the remaining
  // cap is the one piece of state that has to survive from step to step. It is
  // threaded through the claim branch alone — a quote neither reads nor writes
  // it, and so is never handed a placeholder cap to ignore.
  const capRemainingByPolicy = new Map<number, number>();
  const settleClaim = (policyIndex: number, incident: Incident): ClaimResult => {
    const insuredItems = insuredItemsOf(policyIndex);
    const capRemaining =
      capRemainingByPolicy.get(policyIndex) ?? policyCap(insuredItems);
    const result = claimResult(incident, insuredItems, capRemaining);
    capRemainingByPolicy.set(policyIndex, result.remainingCap);
    return result;
  };

  const runStep = (step: Step, index: number): StepResult =>
    step.op === "quote"
      ? {
          premium: quotePremium(
            step.items,
            scenario.customer,
            contractsBefore(scenario.steps, index),
          ),
        }
      : settleClaim(step.policy, step.incident);

  return { results: scenario.steps.map(runStep) };
};
