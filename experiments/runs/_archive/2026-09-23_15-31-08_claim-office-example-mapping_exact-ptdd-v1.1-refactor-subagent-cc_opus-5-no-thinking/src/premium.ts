/** The premium office: what the MHPCO charges to take a list of items on risk.
 *  Every decision here belongs to the tariff -- the price list, the building
 *  block, the risk surcharges, the customer's standing, the processing fee, and
 *  the rounding that falls the office's way. It changes when the tariff is
 *  revised, independently of how claims are settled. */

import { alikeKey, basePremium, type Item } from "./item-catalog.js";
import { amountCollectedInMHPCOsFavour } from "./rounding.js";

export interface Customer {
  yearsWithMHPCO: number;
}

/** The MHPCO price list offers a building block of 3 alike items at a
 *  special base premium instead of the sum of the per-item prices. The
 *  price list states the rule for components; the office has not yet ruled
 *  on whether a block of 3 alike main items is granted the same price. */
const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_BASE_PREMIUM = 60;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const PROCESSING_FEE = 5;

/** Whether a group of alike items qualifies for the special building-block
 *  price. The MHPCO grants the block only for a group of exactly 3 -- a
 *  fourth alike item forfeits the special price for the whole group. */
function formsBuildingBlock(alikeItems: Item[]): boolean {
  return alikeItems.length === BUILDING_BLOCK_SIZE;
}

/** The base premium the price list charges for one group of alike items:
 *  the special block price when the group forms a building block, otherwise
 *  the per-item price of every item in the group. */
function alikeGroupBasePremium(alikeItems: Item[]): number {
  if (formsBuildingBlock(alikeItems)) {
    return BUILDING_BLOCK_BASE_PREMIUM;
  }
  return alikeItems.reduce((sum, item) => sum + basePremium(item), 0);
}

/** The items of a quote, partitioned into groups of alike items. */
function groupAlikeItems(items: Item[]): Item[][] {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const key = alikeKey(item);
    const alike = groups.get(key) ?? [];
    alike.push(item);
    groups.set(key, alike);
  }
  return [...groups.values()];
}

/** The policy base premium: the sum of the base premiums of all insured
 *  items, before any modifier. */
function policyBasePremium(items: Item[]): number {
  return groupAlikeItems(items).reduce(
    (sum, alikeGroup) => sum + alikeGroupBasePremium(alikeGroup),
    0,
  );
}

/** A cursed item carries a risk surcharge for that item alone, not for the
 *  policy. */
function isCursed(item: Item): boolean {
  return item.cursed === true;
}

/** An item counts as highly enchanted from enchantment level 5 upwards. */
function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

/** The risk surcharges an item carries on its own base premium. An item may
 *  carry several risks at once, and the MHPCO charges every one of them in
 *  full: the surcharges accumulate, each measured on the item's *unmodified*
 *  base premium, so a cursed and highly enchanted sword pays 50 % + 30 %. */
function itemRiskSurcharge(item: Item): number {
  const base = basePremium(item);
  const curse = isCursed(item) ? base * CURSE_SURCHARGE_RATE : 0;
  const enchantment = isHighlyEnchanted(item) ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return curse + enchantment;
}

/** The risk surcharges of all insured items. */
function policyRiskSurcharge(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemRiskSurcharge(item), 0);
}

/** How the customer stands with the MHPCO at the moment of this quote: the
 *  length of the business relationship and the number of contracts that
 *  precede this one in the customer's scenario. The policy-wide discounts are
 *  decisions about this standing, not about the insured items. */
interface CustomerStanding {
  customer: Customer;
  previousContracts: number;
}

/** A customer is long-standing from 2 years of business with the MHPCO. */
function isLongStanding(standing: CustomerStanding): boolean {
  return standing.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

/** Every contract after the customer's first earns the follow-up discount. */
function isFollowUpContract(standing: CustomerStanding): boolean {
  return standing.previousContracts >= 1;
}

/** The net policy-wide modifier, which the MHPCO charges against the
 *  *unmodified* policy base premium -- item risk surcharges do not raise the
 *  amount these modifiers are measured on. All three policy-wide modifiers are
 *  measured on that same base and accumulated here: the initial assessment
 *  surcharge, the loyalty discount, and the follow-up contract discount. Every
 *  quote is treated as a first insurance and carries the initial assessment
 *  surcharge, regardless of customer history -- so a long-standing customer's
 *  follow-up contract for a new item carries both the surcharge and both
 *  discounts. */
function policyModifierAdjustment(policyBase: number, standing: CustomerStanding): number {
  const firstInsurance = policyBase * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyalty = isLongStanding(standing) ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const followUp = isFollowUpContract(standing)
    ? policyBase * FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    : 0;
  return firstInsurance - loyalty - followUp;
}

/** The policy premium with all modifiers applied, before the processing fee:
 *  the price-list base premium, plus the risk surcharges the individual items
 *  carry, plus the policy-wide modifiers. */
function modifiedPolicyPremium(items: Item[], standing: CustomerStanding): number {
  const policyBase = policyBasePremium(items);
  return (
    policyBase + policyRiskSurcharge(items) + policyModifierAdjustment(policyBase, standing)
  );
}

/** The settlement the MHPCO bills for a premium it has calculated: the office
 *  adds its processing fee to every premium, last of all and after every
 *  modifier, and then bills the whole G in its own favour. What the
 *  office charges on top of the calculated risk changes independently of how
 *  the premium itself was arrived at; in whose favour the fraction falls is the
 *  office's own tradition, kept in one place for both counters. */
function settledPremium(modifiedPremium: number): number {
  return amountCollectedInMHPCOsFavour(modifiedPremium + PROCESSING_FEE);
}

/** The premium the MHPCO charges a customer for insuring a list of items:
 *  the modified policy premium, settled by the office. */
export function quote(customer: Customer, items: Item[], previousContracts: number): number {
  return settledPremium(modifiedPolicyPremium(items, { customer, previousContracts }));
}
