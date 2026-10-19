// --- Price list: insurance values and base premiums ---

/** The price list states one insurance value and one base premium per item kind. */
interface ListedPrice {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEM_PRICE_LIST: Record<string, ListedPrice> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_PRICE: ListedPrice = { insuranceValue: 250, basePremium: 25 };
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

// --- Premium modifiers ---
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const SURCHARGED_ENCHANTMENT_LEVEL = 5;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const PROCESSING_FEE = 5;

// --- Claim processing ---
const DEDUCTIBLE_PER_DAMAGE = 100;
const PAYOUT_CAP_MULTIPLE = 2;
const HALF_REIMBURSED_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT = 0.5;
const FULLY_REIMBURSED_MATERIAL = "dragon";
const FULL_REIMBURSEMENT = 1;
/** What a damage is reimbursed at when no special clause applies. */
const STANDARD_REIMBURSEMENT = 1;

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

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface ScenarioResults {
  results: unknown[];
}

const COMPONENT_TYPES = ["rune", "moonstone"];

/**
 * An item that names no enchantment carries none: a rune has no enchantment
 * level at all, and the MHPCO reads that as level 0 wherever a clause draws an
 * enchantment line.
 */
function enchantmentLevelOf(item: Item): number {
  return item.enchantment ?? 0;
}

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

/** Everything the price list prices individually, as opposed to by alike group. */
function isMainItem(item: Item): boolean {
  return item.type in MAIN_ITEM_PRICE_LIST;
}

/** The MHPCO insures an item only if its type is named in the price list. */
function isInsurable(item: Item): boolean {
  return isMainItem(item) || isComponent(item);
}

/**
 * Admission is the MHPCO's decision about what it is willing to cover at all,
 * taken before the contract is opened or priced: an item the price list does
 * not name cannot be covered, so the whole policy is refused.
 */
function admitToPolicy(items: Item[]): void {
  for (const item of items) {
    if (!isInsurable(item)) {
      throw new Error(`The MHPCO price list covers no item of type "${item.type}".`);
    }
  }
}

/** Components are "alike" when they share a component type. */
function groupAlikeComponents(components: Item[]): Map<string, number> {
  const groupSizes = new Map<string, number>();
  for (const component of components) {
    const alikeness = component.type;
    groupSizes.set(alikeness, (groupSizes.get(alikeness) ?? 0) + 1);
  }
  return groupSizes;
}

/** A building block of 3 alike components is offered at a special base premium. */
function alikeComponentGroupBasePremium(groupSize: number): number {
  return groupSize === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_BASE_PREMIUM
    : groupSize * COMPONENT_PRICE.basePremium;
}

function mainItemsBasePremium(mainItems: Item[]): number {
  return mainItems.reduce((sum, item) => sum + MAIN_ITEM_PRICE_LIST[item.type].basePremium, 0);
}

function componentsBasePremium(components: Item[]): number {
  let premium = 0;
  for (const groupSize of groupAlikeComponents(components).values()) {
    premium += alikeComponentGroupBasePremium(groupSize);
  }
  return premium;
}

function policyBasePremium(items: Item[]): number {
  return (
    mainItemsBasePremium(items.filter(isMainItem)) +
    componentsBasePremium(items.filter(isComponent))
  );
}

/**
 * An item-specific surcharge is a rate on the affected item's own base premium,
 * not on the policy's. Only main items carry a per-item base premium; a
 * component's belongs to its alike group, so the specification fixes no
 * surcharge for a cursed or highly enchanted component.
 *
 * Open question -- no example in the specification gives a component a `cursed`
 * or `enchantment` field, and no test pins the outcome, so the behaviour here
 * is undefined rather than decided. A cursed or highly enchanted component
 * reaching this lookup finds no price-list entry and the read of `basePremium`
 * throws a TypeError, which the CLI reports as an unexplained refusal. That is
 * an accident of the lookup, not an MHPCO decision; settle it with a test
 * before relying on it.
 */
function surchargeOnOwnBasePremium(item: Item, rate: number): number {
  return MAIN_ITEM_PRICE_LIST[item.type].basePremium * rate;
}

function curseSurcharge(item: Item): number {
  return item.cursed === true ? surchargeOnOwnBasePremium(item, CURSE_SURCHARGE) : 0;
}

/**
 * The premium surcharge for a highly enchanted item, from enchantment level 5
 * upwards. The claim side draws its own, higher enchantment line at level 8 for
 * half reimbursement -- two separate clauses, not one threshold used twice.
 */
function highEnchantmentSurcharge(item: Item): number {
  return enchantmentLevelOf(item) >= SURCHARGED_ENCHANTMENT_LEVEL
    ? surchargeOnOwnBasePremium(item, HIGH_ENCHANTMENT_SURCHARGE)
    : 0;
}

/** Item-specific surcharges apply to the base premium of the affected item. */
function itemSurcharges(items: Item[]): number {
  return items.reduce(
    (sum, item) => sum + curseSurcharge(item) + highEnchantmentSurcharge(item),
    0,
  );
}

/** A customer is long-standing from 2 years of business with MHPCO onwards. */
function loyaltyDiscount(basePremium: number, customer: Customer): number {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_DISCOUNT : 0;
}

/**
 * Every item in a quote is treated as a first insurance, regardless of customer
 * history, so the initial assessment surcharge carries no condition.
 */
function firstInsuranceSurcharge(basePremium: number): number {
  return basePremium * FIRST_INSURANCE_SURCHARGE;
}

/** Customers receive a discount on each contract after their first. */
function followUpContractDiscount(basePremium: number, contractOrdinal: number): number {
  return contractOrdinal > 1 ? basePremium * FOLLOW_UP_CONTRACT_DISCOUNT : 0;
}

/** Policy-wide modifiers apply to the policy base premium (the sum of all item base premiums). */
function policyWideModifiers(
  basePremium: number,
  customer: Customer,
  contractOrdinal: number,
): number {
  return (
    firstInsuranceSurcharge(basePremium) -
    loyaltyDiscount(basePremium, customer) -
    followUpContractDiscount(basePremium, contractOrdinal)
  );
}

/**
 * Which side of the MHPCO's ledger an amount sits on. The office is owed a
 * premium and owes a payout, and that is the only thing that distinguishes how
 * the two are rounded.
 */
type LedgerSide = "owedToMHPCO" | "owedByMHPCO";

/**
 * All amounts are rounded to whole G in the MHPCO's favour. One rule, one home:
 * the direction is not a second decision but a consequence of which side of the
 * ledger the amount is on -- the office keeps the fraction either way, rounding
 * up what it is owed and down what it owes. Change the office's idea of its own
 * favour here and both the premium and the payout follow.
 */
function roundedInMHPCOsFavour(amount: number, side: LedgerSide): number {
  return side === "owedToMHPCO" ? Math.ceil(amount) : Math.floor(amount);
}

/**
 * The MHPCO prices a policy in one order: the policy base premium, then the
 * modifiers at their own scopes, then the processing fee at the very end.
 * Item-specific modifiers are charged against the base premium of the affected
 * item; policy-wide modifiers against the policy base premium. Only this final
 * amount is rounded -- intermediate amounts stay fractional.
 *
 * Pricing assumes an admitted policy: every item is named in the price list,
 * because admission is decided before a contract is opened or priced at all.
 */
function quotePremium(items: Item[], customer: Customer, contractOrdinal: number): number {
  const basePremium = policyBasePremium(items);
  return roundedInMHPCOsFavour(
    basePremium +
      itemSurcharges(items) +
      policyWideModifiers(basePremium, customer, contractOrdinal) +
      PROCESSING_FEE,
    "owedToMHPCO",
  );
}

/**
 * How many contracts the customer has taken out with MHPCO up to and including
 * this one. A contract is opened by a quote, so only quote steps advance the
 * count: a claim settles an existing contract and does not add one. The present
 * discount is a flat rate on every contract after the first and so cannot tell
 * a second contract from a third, but the ordinal is the MHPCO's count of
 * contracts, not of steps, and is derived as such.
 */
function contractOrdinalAfterOpening(contractsOpenedSoFar: number): number {
  return contractsOpenedSoFar + 1;
}

/**
 * What the price list says one insured item is worth. This is the item's
 * unmodified value: premium modifiers price the risk of covering the item and
 * never change what it is worth, and the block offered on 3 alike components
 * is a premium offer, so each component is still insured at its own value.
 */
function insuranceValueOf(item: Item): number {
  return isComponent(item)
    ? COMPONENT_PRICE.insuranceValue
    : MAIN_ITEM_PRICE_LIST[item.type].insuranceValue;
}

/** What the MHPCO would have to pay out if every insured item were destroyed. */
function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
}


/**
 * A policy created by a quote step: the MHPCO's remaining obligation under one
 * contract, measured two ways. `insuredItems` is the fixed coverage the contract
 * was written against; `remainingCap` is the money left under it, derived from
 * that coverage at opening and drawn down by each claim. They belong together
 * because the cap is a function of the coverage, not an unrelated counter.
 */
interface Policy {
  insuredItems: Item[];
  remainingCap: number;
}

function openPolicy(items: Item[]): Policy {
  return { insuredItems: items, remainingCap: insuranceSum(items) * PAYOUT_CAP_MULTIPLE };
}

/**
 * Damage to an item of enchantment level 8 or more is reimbursed at half the
 * damage amount. This is the claim side's own enchantment line, above the
 * level 5 that earns a premium surcharge.
 */
function isHalfReimbursed(item: Item): boolean {
  return enchantmentLevelOf(item) >= HALF_REIMBURSED_ENCHANTMENT_LEVEL;
}

/** Damage to an item made of dragon material is fully reimbursed. */
function isFullyReimbursed(item: Item): boolean {
  return item.material === FULLY_REIMBURSED_MATERIAL;
}

/**
 * The fraction of a damage amount the reimbursement clauses allow for this
 * item, before the deductible is taken. This is the one place a clause is
 * chosen, and the order is the specification's precedence rule rather than an
 * accident of writing: where both special clauses cover an item, "the 50 %
 * rule wins", so half reimbursement is tested first. Failing both, the damage
 * is reimbursed at the standard rate.
 *
 * The two clauses draw on separate knowledge and can change apart -- one reads
 * an enchantment level, the other a material -- so that full reimbursement
 * currently equals the standard rate is a coincidence of the present price
 * book, not one fact written twice. The clause says "full reimbursement is
 * owed here"; the standard rate says "no clause applies". No example can tell
 * them apart today, which is why the dragon clause is stated and not inferred.
 */
function reimbursementRateFor(damagedItem: Item): number {
  if (isHalfReimbursed(damagedItem)) return HALF_REIMBURSEMENT;
  if (isFullyReimbursed(damagedItem)) return FULL_REIMBURSEMENT;
  return STANDARD_REIMBURSEMENT;
}

/** The share of a damage the MHPCO reimburses before the deductible is taken. */
function reimbursableDamage(damage: Damage, damagedItem: Item): number {
  return damage.amount * reimbursementRateFor(damagedItem);
}

/**
 * The deductible is the claimant's own share of each damage event: the MHPCO
 * reimburses what the damage exceeds it by.
 *
 * Adopted reading -- the specification says only that "a deductible of 100 G
 * applies per damage event", and fixes no outcome for a damage smaller than
 * the deductible. A deductible reduces a reimbursement; it does not bill the
 * claimant, so a genuine loss too small to clear it is reimbursed at nothing
 * rather than charged back. The floor earns its place on those losses -- a
 * 50 G damage is a real, admitted claim that simply falls under the
 * deductible -- and not on negative amounts, which admission refuses before a
 * clause is reached. Settle it against the MHPCO before relying on it.
 */
function reimbursementAfterDeductible(damage: Damage, damagedItem: Item): number {
  const excessOverDeductible = reimbursableDamage(damage, damagedItem) - DEDUCTIBLE_PER_DAMAGE;
  return Math.max(excessOverDeductible, 0);
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

/** The policy covers a damage entry only if it insures an item of that type. */
function coversItemType(policy: Policy, itemType: string): boolean {
  return policy.insuredItems.some((insured) => insured.type === itemType);
}

/** How many items of one type the policy insures -- the coverage the contract was written for. */
function insuredCountOfType(policy: Policy, itemType: string): number {
  return policy.insuredItems.filter((insured) => insured.type === itemType).length;
}

/**
 * How many items of one type the incident damaged. Each damage entry is a
 * separate damaged item, so the entries of a type are counted, not merged.
 */
function damagedCountOfType(incident: Incident, itemType: string): number {
  return incident.damages.filter((damage) => damage.itemType === itemType).length;
}

/** The item types the incident damaged, each named once. */
function damagedItemTypes(incident: Incident): string[] {
  return [...new Set(incident.damages.map((damage) => damage.itemType))];
}

/**
 * Coverage is sufficient for a type when the policy insures at least as many
 * items of it as the incident damaged. This is a decision about the incident as
 * a whole, not about one damage entry: two sword damages are admissible only
 * against two insured swords.
 */
function coversEveryDamagedItemOfType(policy: Policy, incident: Incident, itemType: string): boolean {
  return damagedCountOfType(incident, itemType) <= insuredCountOfType(policy, itemType);
}

/**
 * A damage entry states a loss. An amount below zero is not a loss the MHPCO
 * can settle -- there is nothing to reimburse and the office does not bill a
 * claimant for an improvement -- so the entry is inadmissible on its own terms,
 * before the policy is consulted at all.
 */
function isSettleableLoss(damage: Damage): boolean {
  return damage.amount >= 0;
}

/**
 * Whether the MHPCO will settle the losses this incident reports at all. This
 * reads only the incident: a loss is admissible or not on its own terms,
 * whatever policy it is claimed against.
 */
function admitReportedLosses(incident: Incident): void {
  for (const damage of incident.damages) {
    if (!isSettleableLoss(damage)) {
      throw new Error(`A damage of ${String(damage.amount)} G is not a loss the MHPCO can settle.`);
    }
  }
}

/**
 * Whether the policy covers what the incident damaged. Two refusals, both
 * decided per damaged item type against the contract's coverage: the policy
 * must name the type at all, and it must insure enough items of it.
 */
function admitAgainstCoverage(policy: Policy, incident: Incident): void {
  for (const itemType of damagedItemTypes(incident)) {
    if (!coversItemType(policy, itemType)) {
      throw new Error(`The policy covers no item of type "${itemType}".`);
    }
    if (!coversEveryDamagedItemOfType(policy, incident, itemType)) {
      throw new Error(
        `The policy covers fewer items of type "${itemType}" than the incident damaged.`,
      );
    }
  }
}

/**
 * Admission is the MHPCO's decision about whether it will settle an incident at
 * all, taken before any clause is applied -- the claim-side counterpart of
 * admitting items to a policy. Any refusal refuses the whole claim rather than
 * settling it in part.
 *
 * The clause reads in two stages, and they are separate decisions rather than
 * one list at two granularities: the office first asks whether the incident
 * reports losses it settles at all, which needs no contract to answer, and only
 * then whether this policy covers them. The first stage changes with the
 * office's idea of a loss, the second with what a contract can cover.
 */
function admitClaim(policy: Policy, incident: Incident): void {
  admitReportedLosses(incident);
  admitAgainstCoverage(policy, incident);
}

/**
 * The insured item a damage entry refers to. Where the policy covers several
 * items of one type, every damage of that type is settled against the first of
 * them; the specification's only such example insures two identical swords, so
 * it fixes no answer for two that differ in material or enchantment.
 *
 * Settling assumes an admitted incident: every damage names a covered item,
 * because admission is decided before any clause is applied, so the throw here
 * is unreachable and keeps the lookup total for the type system rather than
 * stating an MHPCO decision.
 */
function damagedItemIn(policy: Policy, damage: Damage): Item {
  const item = policy.insuredItems.find((insured) => insured.type === damage.itemType);
  if (item === undefined) {
    throw new Error(`The policy covers no item of type "${damage.itemType}".`);
  }
  return item;
}

/** What the policy's clauses owe for an incident, before the cap is consulted. */
function reimbursementOwed(policy: Policy, incident: Incident): number {
  return incident.damages.reduce(
    (sum, damage) => sum + reimbursementAfterDeductible(damage, damagedItemIn(policy, damage)),
    0,
  );
}

/**
 * What the policy is still permitted to pay. The total payout per policy is
 * capped, so a claim for more than the cap still carries is not refused -- the
 * owed amount is reduced to what remains.
 *
 * This is the cap's own decision, separate from what the clauses owe: the two
 * answer different questions ("what does this damage deserve?" against "how
 * much of the contract is left?") and change on separate occasions.
 */
function payoutPermittedByCap(owed: number, remainingCap: number): number {
  return Math.min(owed, remainingCap);
}

/**
 * Settling an incident both pays the claimant and uses up part of the cap the
 * policy carries for the rest of its life, so the settled policy is the second
 * half of the outcome rather than a side effect: a claim leaves the policy in a
 * new state, and later claims against it see that state.
 */
function settleClaim(policy: Policy, incident: Incident): { result: ClaimResult; policy: Policy } {
  admitClaim(policy, incident);
  const payout = roundedInMHPCOsFavour(
    payoutPermittedByCap(reimbursementOwed(policy, incident), policy.remainingCap),
    "owedByMHPCO",
  );
  const remainingCap = policy.remainingCap - payout;
  return {
    result: { payout, remainingCap },
    policy: { ...policy, remainingCap },
  };
}

export function runScenario(scenario: Scenario): ScenarioResults {
  /** Policies opened so far, addressed the way the input does: by the index of the quote step that opened each. */
  const policies = new Map<number, Policy>();

  /**
   * A claim naming a step that opened no policy is outside the specification --
   * no example and no test describes it -- so this guard exists only to keep the
   * lookup total for the type system.
   */
  const policyOpenedBy = (quoteStepIndex: number): Policy => {
    const policy = policies.get(quoteStepIndex);
    if (policy === undefined) {
      throw new Error(`No policy was created by step ${String(quoteStepIndex)}.`);
    }
    return policy;
  };

  let contractsOpened = 0;
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      const { result, policy } = settleClaim(policyOpenedBy(step.policy), step.incident);
      policies.set(step.policy, policy);
      return result;
    }
    admitToPolicy(step.items);
    policies.set(stepIndex, openPolicy(step.items));
    const contractOrdinal = contractOrdinalAfterOpening(contractsOpened);
    contractsOpened += 1;
    return {
      premium: quotePremium(step.items, scenario.customer, contractOrdinal),
    };
  });
  return { results };
}
