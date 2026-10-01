import {
  type Item,
  type PriceListEntry,
  premiumRoundedInMHPCOsFavour,
  priceListEntryOf,
} from "./office-statutes.js";

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

/** A policy's items of one and the same type -- what the office calls "alike". */
interface AlikeItems {
  type: string;
  items: Item[];
}

/**
 * The office groups a policy's items into groups of alike items, because its
 * building-block offer is priced per group rather than per item. "Alike" means
 * the same item type.
 */
function groupAlikeItems(items: Item[]): AlikeItems[] {
  const groups = new Map<string, AlikeItems>();
  for (const item of items) {
    const group = groups.get(item.type);
    if (group === undefined) {
      groups.set(item.type, { type: item.type, items: [item] });
    } else {
      group.items.push(item);
    }
  }
  return [...groups.values()];
}

/**
 * A building block of exactly 3 alike components is offered at a special base
 * premium instead of the catalogue rate; any other count is priced per component.
 */
function isBuildingBlock(priceList: PriceListEntry, count: number): boolean {
  return priceList.class === "component" && count === BLOCK_SIZE;
}

/**
 * What the office charges for one group of alike items covered by the same policy:
 * its building-block offer where the group qualifies, and otherwise the catalogue
 * rate for every item in it. One reading of the group's price-list row settles both.
 */
function alikeItemsBasePremiumOf({ type, items }: AlikeItems): number {
  const priceList = priceListEntryOf(type);
  return isBuildingBlock(priceList, items.length)
    ? BLOCK_BASE_PREMIUM
    : items.length * priceList.basePremium;
}

const HIGH_ENCHANTMENT_LEVEL = 5;

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

/** The office considers an item highly enchanted from enchantment level 5 upwards. */
function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

/**
 * One clause of the office's risk schedule: the risk it looks for in a single
 * item, and the surcharge it levies on that item's base premium when it finds it.
 */
interface ItemRiskClause {
  appliesTo: (item: Item) => boolean;
  surchargeRate: number;
}

/** The office's schedule of item-specific risks, as written in its statutes. */
const ITEM_RISK_CLAUSES: ItemRiskClause[] = [
  { appliesTo: isCursed, surchargeRate: 0.5 },
  { appliesTo: isHighlyEnchanted, surchargeRate: 0.3 },
];

/**
 * Item-specific risk surcharges are charged on the base premium of the affected
 * item alone, never on the policy total. An item that carries several risks is
 * surcharged for each of them, the office adding the rates together.
 */
function itemRiskSurchargeRateOf(item: Item): number {
  return ITEM_RISK_CLAUSES.filter((clause) => clause.appliesTo(item)).reduce(
    (rate, clause) => rate + clause.surchargeRate,
    0,
  );
}

/**
 * How much of a group's base premium each alike item is held to carry. Group
 * offers such as the building block are priced per group, so the office has to
 * decide what an individual item inside a group is worth before it can charge an
 * item-specific surcharge on it. The office's reading: alike items are
 * interchangeable, so each carries an equal share of the group's base premium
 * (20 G each inside a 60 G block). Shares are kept as exact fractions.
 */
function apportionedBasePremiumOf(alikeItems: AlikeItems): number {
  return alikeItemsBasePremiumOf(alikeItems) / alikeItems.items.length;
}

/** One item paired with the base premium the office holds it to carry. */
interface ItemBasePremium {
  item: Item;
  basePremium: number;
}

/** What each item of a group contributes to the policy base premium. */
function itemBasePremiumsOf(alikeItems: AlikeItems): ItemBasePremium[] {
  const basePremium = apportionedBasePremiumOf(alikeItems);
  return alikeItems.items.map((item) => ({ item, basePremium }));
}

/** What an item's own risks add to its base premium, in G. */
function itemRiskSurchargeOf({ item, basePremium }: ItemBasePremium): number {
  return basePremium * itemRiskSurchargeRateOf(item);
}

/**
 * How the office rates the items of one policy. The two quantities are kept
 * apart because the office rates its policy-wide terms against one of them and
 * not the other: the policy base premium is their rating basis, while item risk
 * surcharges ride on top of it untouched by any policy-wide term.
 */
interface ItemRating {
  policyBasePremium: number;
  itemRiskSurcharges: number;
}

/**
 * The item side of the premium: it depends on the items alone and knows nothing
 * of who brings them.
 */
function itemRatingOf(items: Item[]): ItemRating {
  const itemBasePremiums = groupAlikeItems(items).flatMap(itemBasePremiumsOf);
  return {
    policyBasePremium: itemBasePremiums.reduce((total, { basePremium }) => total + basePremium, 0),
    itemRiskSurcharges: itemBasePremiums.reduce(
      (total, itemBasePremium) => total + itemRiskSurchargeOf(itemBasePremium),
      0,
    ),
  };
}

const LOYALTY_DISCOUNT_RATE = -0.2;
const LOYALTY_YEARS = 2;

/** The office calls a customer long-standing after 2 years of business. */
function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

/**
 * Everything the office knows when it rates the policy-wide terms of one
 * contract: the customer it is writing for, and its own history of contracts
 * already written for them. Terms are earned by either, so a clause of the
 * office's schedule is rated against the pair rather than against one of them.
 */
export interface PolicyCircumstances {
  customer: Customer;
  contractsAlreadyWritten: number;
}

/**
 * The office grants its follow-up discount on each contract it writes for a
 * customer after their first, so the term is earned by the contracts already
 * written rather than by the customer's record.
 */
function isFollowUpContract({ contractsAlreadyWritten }: PolicyCircumstances): boolean {
  return contractsAlreadyWritten > 0;
}

/**
 * One clause of the office's schedule of policy-wide terms: the circumstances it
 * looks for in the contract before it, and the rate it then applies to the policy
 * base premium. Surcharges carry a positive rate, discounts a negative one -- the
 * office's own arithmetic, which adds its policy-wide rates together.
 */
interface PolicyModifierClause {
  appliesTo: (circumstances: PolicyCircumstances) => boolean;
  modifierRate: number;
}

/**
 * Each quoted item is a first insurance whatever the customer's history, so the
 * office's initial assessment is earned by no record and withheld from none --
 * the one scheduled term whose circumstances are always met.
 */
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = -0.15;

/**
 * The office's schedule of policy-wide terms: the initial assessment it levies on
 * every contract it writes, what a long-standing record entitles the customer to,
 * and what the standing of this contract in their history grants them.
 */
const POLICY_MODIFIER_CLAUSES: PolicyModifierClause[] = [
  { appliesTo: () => true, modifierRate: FIRST_INSURANCE_SURCHARGE_RATE },
  {
    appliesTo: ({ customer }) => isLongStandingCustomer(customer),
    modifierRate: LOYALTY_DISCOUNT_RATE,
  },
  { appliesTo: isFollowUpContract, modifierRate: FOLLOW_UP_CONTRACT_DISCOUNT_RATE },
];

/**
 * Every policy-wide term the office rates on the policy base premium -- the sum of
 * all item base premiums -- never on a single item: whichever scheduled terms the
 * circumstances of this contract earn, the office adding their rates together.
 */
function policyModifierRateOf(circumstances: PolicyCircumstances): number {
  return POLICY_MODIFIER_CLAUSES.filter((clause) => clause.appliesTo(circumstances)).reduce(
    (rate, clause) => rate + clause.modifierRate,
    0,
  );
}

/**
 * What the items and the contract's circumstances come to before the office writes
 * the figure down: what the items themselves are worth, adjusted by the policy-wide
 * terms the circumstances earn, with the processing fee added at the very end. Kept
 * as an exact fraction -- the office rounds the premium and nothing on the way to it.
 */
function exactPolicyPremiumOf(itemRating: ItemRating, circumstances: PolicyCircumstances): number {
  const { policyBasePremium, itemRiskSurcharges } = itemRating;
  const modifierRate = policyModifierRateOf(circumstances);
  return (
    policyBasePremium + itemRiskSurcharges + policyBasePremium * modifierRate + PROCESSING_FEE
  );
}

/**
 * The premium the office charges for covering those items under this contract: what
 * the terms come to, rounded to whole G in the office's favour. The office quotes
 * whole G, so rounding is part of the premium it decides on and not a later dressing
 * up of the figure.
 */
export function policyPremiumOf(items: Item[], circumstances: PolicyCircumstances): number {
  return premiumRoundedInMHPCOsFavour(exactPolicyPremiumOf(itemRatingOf(items), circumstances));
}
