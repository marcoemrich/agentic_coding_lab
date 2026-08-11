export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface InsuredItem {
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

/** A request to price a set of items. Becomes a policy the claims refer back to. */
export interface QuoteStep {
  op: "quote";
  items: InsuredItem[];
}

/** A claim against an earlier quote step, identified by its index. */
export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

/**
 * The two things a scenario can ask for. Discriminating on `op` lets the
 * compiler guarantee a claim has an incident and a quote has items, so
 * neither dispatch arm needs a non-null assertion or a defaulted field.
 */
export type Step = QuoteStep | ClaimStep;

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResults {
  results: StepResult[];
}

/** What the price list knows about one kind of item. */
interface ListedItem {
  basePremium: number;
  insuranceValue: number;
}

/**
 * The price list. Premium and insurance value are one fact per item kind — the
 * two are always looked up for the same type — so they are listed together
 * rather than in two records that must be kept in step.
 */
const PRICE_LIST: Record<string, ListedItem> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

/**
 * An item kind the price list does not name is worth nothing and costs nothing
 * to insure. The lookup is defaulted rather than left unchecked because the
 * type comes from the input: an unlisted kind used to read back `undefined` and
 * carry a NaN through every premium and payout in the scenario, turning one
 * unknown item into a wholly unusable answer.
 */
const UNLISTED: ListedItem = { basePremium: 0, insuranceValue: 0 };

const listingFor = (item: InsuredItem): ListedItem =>
  PRICE_LIST[item.type] ?? UNLISTED;

const PROCESSING_FEE = 5;

const WHOLE_PERCENT = 100;

/**
 * Adjusts an amount by a percentage. A positive percent is a surcharge, a
 * negative one a discount.
 *
 * Multiplying before dividing keeps the arithmetic exact. A 1.1 multiplier
 * would not: floating-point `100 * 1.1` is 110.00000000000001, which rounds
 * up to 111 and yields a 116 G premium instead of 115 G.
 */
const adjustByPercent = (amount: number, percent: number): number =>
  (amount * (WHOLE_PERCENT + percent)) / WHOLE_PERCENT;

/** All rounding is in the MHPCO's favor — always up. */
const roundInMHPCOsFavor = Math.ceil;

const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_PREMIUM = 60;

/** Item kinds are compared by type — both grouping and claims match on it. */
const isOfType =
  (type: string) =>
  (item: InsuredItem): boolean =>
    item.type === type;

/** Only items of one and the same kind group into a block. */
const areAllTheSameKind = ([first, ...rest]: InsuredItem[]): boolean =>
  first !== undefined && rest.every(isOfType(first.type));

/**
 * How many flat-rate blocks this list forms. A mixed list forms none — only
 * alike items group — and so does any list too short to fill one block.
 */
const countCompleteBlocks = (items: InsuredItem[]): number =>
  areAllTheSameKind(items) ? Math.floor(items.length / BUILDING_BLOCK_SIZE) : 0;

const CURSED_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

/**
 * Enchantment drives two unrelated rules at two different levels, so each
 * threshold is named for the rule it belongs to rather than for the adjective
 * the spec happens to use. Level 5 makes an item dearer to insure; level 8
 * makes damage to it cheaper to reimburse. Neither level should ever be
 * substituted for the other.
 */
const SURCHARGEABLE_ENCHANTMENT_LEVEL = 5;

/** A risk rule contributes its percent only when the item trips it. */
const percentWhen = (applies: boolean, percent: number): number =>
  applies ? percent : 0;

const enchantmentOf = (item: InsuredItem): number => item.enchantment ?? 0;

const attractsEnchantmentSurcharge = (item: InsuredItem): boolean =>
  enchantmentOf(item) >= SURCHARGEABLE_ENCHANTMENT_LEVEL;

/** Risk surcharges add to the base premium; they do not compound. */
const riskSurchargePercentFor = (item: InsuredItem): number =>
  percentWhen(item.cursed === true, CURSED_SURCHARGE_PERCENT) +
  percentWhen(
    attractsEnchantmentSurcharge(item),
    HIGH_ENCHANTMENT_SURCHARGE_PERCENT,
  );

/** An item's list price with its own risk surcharges applied. */
const riskAdjustedPremiumFor = (item: InsuredItem): number =>
  adjustByPercent(listingFor(item).basePremium, riskSurchargePercentFor(item));

/**
 * Prices an item list: alike items are grouped into building blocks sold at a
 * flat rate, and whatever is left over is priced item by item, each at its own
 * risk-adjusted premium.
 */
const priceItems = (items: InsuredItem[]): number => {
  const blocks = countCompleteBlocks(items);
  const leftovers = items.slice(blocks * BUILDING_BLOCK_SIZE);

  return (
    blocks * BUILDING_BLOCK_PREMIUM +
    leftovers.reduce((sum, item) => sum + riskAdjustedPremiumFor(item), 0)
  );
};

/** Discounts are negative adjustments — long-standing customers pay 20% less. */
const LOYALTY_DISCOUNT_PERCENT = -20;
const LOYALTY_YEARS = 2;
const REPEAT_CONTRACT_DISCOUNT_PERCENT = -15;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;

const isLongStanding = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS;

/** The first contract is assessed; every later one earns a discount instead. */
const contractPercentFor = (isFirstContract: boolean): number =>
  isFirstContract
    ? FIRST_INSURANCE_SURCHARGE_PERCENT
    : REPEAT_CONTRACT_DISCOUNT_PERCENT;

/**
 * The customer's own standing modifies the item price. Unlike the risk
 * surcharges, which add up before being applied once, these modifiers
 * COMPOUND: each applies to the result of the last. A 20% discount followed
 * by a 10% surcharge is 100 -> 80 -> 88, not 100 -> 90.
 */
const applyCustomerModifiers = (
  price: number,
  customer: Customer,
  isFirstContract: boolean,
): number => {
  const afterLoyalty = adjustByPercent(
    price,
    percentWhen(isLongStanding(customer), LOYALTY_DISCOUNT_PERCENT),
  );

  return adjustByPercent(afterLoyalty, contractPercentFor(isFirstContract));
};

/**
 * The premium pipeline, in the order the spec states it: price the items,
 * apply the customer's modifiers, round, then add the processing fee last.
 */
const quotePremium = (
  items: InsuredItem[],
  customer: Customer,
  isFirstContract: boolean,
): QuoteResult => ({
  premium:
    roundInMHPCOsFavor(
      applyCustomerModifiers(priceItems(items), customer, isFirstContract),
    ) + PROCESSING_FEE,
});

/**
 * Which step opens the customer's first contract.
 *
 * Contracts are counted by quote step, not by step position — a scenario may
 * open with a claim, and the quote that follows is still the customer's first
 * contract. So this is the first *quote's* index, not 0.
 *
 * Contract order is a property of the steps alone: it depends on how many
 * quotes precede a step, never on what any claim did. So it is settled once,
 * before the traversal, rather than tracked as running state alongside the cap
 * ledger — which does depend on the order claims are settled in.
 */
const firstContractStep = (steps: Step[]): number =>
  steps.findIndex((step) => step.op === "quote");

const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;

const insuranceSumOf = (items: InsuredItem[]): number =>
  items.reduce((sum, item) => sum + listingFor(item).insuranceValue, 0);

/**
 * Stands in for a damage whose item type the policy does not list. Its bare
 * attributes trip no rate rule, so such a damage reimburses in full.
 */
const UNCOVERED_ITEM: InsuredItem = { type: "" };

/** See SURCHARGEABLE_ENCHANTMENT_LEVEL — a different rule at a different level. */
const HALVING_ENCHANTMENT_LEVEL = 8;
const HALF = 0.5;
const IN_FULL = 1;

const DRAGON_MATERIAL = "dragon";

const isDragonMade = (item: InsuredItem): boolean =>
  item.material === DRAGON_MATERIAL;

/** The mirror of attractsEnchantmentSurcharge, at the halving rule's level. */
const attractsEnchantmentHalving = (item: InsuredItem): boolean =>
  enchantmentOf(item) >= HALVING_ENCHANTMENT_LEVEL;

/**
 * Damage to an item enchanted this far is only half reimbursed — unless it is
 * dragon-made, which the MHPCO always makes good in full whatever else is true
 * of the item. Dragon material is checked first because it overrides halving,
 * not the other way round.
 */
const reimbursementRateFor = (item: InsuredItem): number =>
  attractsEnchantmentHalving(item) && !isDragonMade(item) ? HALF : IN_FULL;

/**
 * The damaged item's entry in the policy. A damage naming something the policy
 * does not cover reimburses in full — no rate rule can trip without an item to
 * read it from.
 */
const damagedItemIn = (
  damage: Damage,
  insuredItems: InsuredItem[],
): InsuredItem => insuredItems.find(isOfType(damage.itemType)) ?? UNCOVERED_ITEM;

const reimbursableAmountOf = (
  damage: Damage,
  insuredItems: InsuredItem[],
): number =>
  damage.amount * reimbursementRateFor(damagedItemIn(damage, insuredItems));

/** One incident is one deductible, so the damages are totalled before it applies. */
const totalDamageOf = (
  incident: Incident,
  insuredItems: InsuredItem[],
): number =>
  incident.damages.reduce(
    (sum, damage) => sum + reimbursableAmountOf(damage, insuredItems),
    0,
  );

/** The MHPCO never owes a negative amount; below the deductible it owes nothing. */
const OWES_NOTHING = 0;

/**
 * What the incident itself puts the MHPCO on the hook for. The customer bears
 * the deductible, so only the damage above it is owed — and an incident that
 * stays within the deductible is owed nothing rather than turning the shortfall
 * into a debt.
 *
 * This is the incident's own figure, taking no account of the policy it is
 * claimed against. What the policy can actually pay out is a separate question,
 * answered by `limitedByRemainingCover`.
 */
const amountOwedFor = (
  incident: Incident,
  insuredItems: InsuredItem[],
): number =>
  Math.max(OWES_NOTHING, totalDamageOf(incident, insuredItems) - DEDUCTIBLE);

/**
 * What the policy can still pay, whatever the incident owes. Cover is a finite
 * pot shared by every claim on the policy, so a claim is paid only as far as
 * the pot reaches.
 *
 * The counterpart of the deductible floor in `amountOwedFor`: that one bounds
 * the incident from below, this one bounds the policy from above. Two separate
 * rules, so two separate names.
 */
const limitedByRemainingCover = (
  amountOwed: number,
  remainingCover: number,
): number => Math.min(amountOwed, remainingCover);

const settleClaim = (
  incident: Incident,
  insuredItems: InsuredItem[],
  capBefore: number,
): ClaimResult => {
  const payout = limitedByRemainingCover(
    amountOwedFor(incident, insuredItems),
    capBefore,
  );

  return { payout, remainingCap: capBefore - payout };
};

/** A policy's total cover: twice the insurance sum, shared by all its claims. */
const capOf = (insuredItems: InsuredItem[]): number =>
  CAP_MULTIPLE * insuranceSumOf(insuredItems);

/** A claim's policy index must name a quote step; anything else covers nothing. */
const NOTHING_COVERED: InsuredItem[] = [];

/**
 * A claim names the quote step it is made against; the items on that step are
 * the ones the policy covers.
 *
 * The lookup is optional-chained because the index comes from the input, not
 * from us: it may point past the end of the steps, where the declared `Step`
 * type is a lie (`noUncheckedIndexedAccess` is off) and a plain `.op` would
 * throw. An index naming no quote covers nothing, however it fails to name one.
 */
const itemsCoveredBy = (claim: ClaimStep, steps: Step[]): InsuredItem[] => {
  const policy: Step | undefined = steps[claim.policy];

  return policy?.op === "quote" ? policy.items : NOTHING_COVERED;
};

/**
 * The running cover left on each policy, keyed by the quote step that opened
 * it. A policy absent from the ledger has not been claimed against yet, so its
 * remaining cover is still the full cap.
 */
type CapLedger = Map<number, number>;

/**
 * Settles one claim against the ledger and draws the payout down from the
 * policy's remaining cover. This is the one step kind whose result depends on
 * the steps before it, so it is also the only one that writes to the ledger.
 */
const settleClaimAgainstLedger = (
  claim: ClaimStep,
  steps: Step[],
  remainingCaps: CapLedger,
): ClaimResult => {
  const insuredItems = itemsCoveredBy(claim, steps);
  const capBefore = remainingCaps.get(claim.policy) ?? capOf(insuredItems);
  const result = settleClaim(claim.incident, insuredItems, capBefore);

  remainingCaps.set(claim.policy, result.remainingCap);

  return result;
};

/**
 * Works the scenario's steps in order, returning one result per step.
 *
 * The traversal is order-dependent: each claim draws down a cap that later
 * claims on the same policy read back. `map` visits left to right by
 * specification, so the ledger sees the steps in scenario order — the
 * sequencing lives in the ledger writes themselves, not in the shape of the
 * traversal.
 */
export const runScenario = ({
  customer,
  steps,
}: Scenario): ScenarioResults => {
  const remainingCaps: CapLedger = new Map();
  const firstContract = firstContractStep(steps);

  return {
    results: steps.map((step, index) =>
      step.op === "quote"
        ? quotePremium(step.items, customer, index === firstContract)
        : settleClaimAgainstLedger(step, steps, remainingCaps),
    ),
  };
};
