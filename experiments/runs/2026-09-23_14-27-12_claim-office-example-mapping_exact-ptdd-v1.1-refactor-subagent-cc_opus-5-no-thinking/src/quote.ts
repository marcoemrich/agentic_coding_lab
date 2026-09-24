import { type Item, basePremiumOf, isComponent } from "./price-list.js";
import { amountOwedToMHPCO } from "./rounding.js";

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const LOYALTY_YEARS_THRESHOLD = 2;

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

/** "Alike" resolved as exactly the same component type, not the same family. */
function alikenessOf(component: Item): string {
  return component.type;
}

/** The alike components of one alikeness, which are priced together. */
interface AlikeGroup {
  member: Item;
  count: number;
}

function groupAlike(components: Item[]): AlikeGroup[] {
  const groups = new Map<string, AlikeGroup>();
  for (const component of components) {
    const alikeness = alikenessOf(component);
    const group = groups.get(alikeness);
    if (group === undefined) {
      groups.set(alikeness, { member: component, count: 1 });
    } else {
      group.count += 1;
    }
  }
  return [...groups.values()];
}

/** A block is exactly 3 alike components -- 4 alike do not form a block. */
function formsBlock(alikeCount: number): boolean {
  return alikeCount === BLOCK_SIZE;
}

function alikeGroupBasePremiumOf(group: AlikeGroup): number {
  return formsBlock(group.count) ? BLOCK_BASE_PREMIUM : group.count * basePremiumOf(group.member);
}

function componentsBasePremiumOf(components: Item[]): number {
  return groupAlike(components).reduce((total, group) => total + alikeGroupBasePremiumOf(group), 0);
}

function mainItemsBasePremiumOf(mainItems: Item[]): number {
  return mainItems.reduce((total, item) => total + basePremiumOf(item), 0);
}

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

interface RiskSurcharge {
  appliesTo: (item: Item) => boolean;
  rate: number;
}

const ITEM_RISK_SURCHARGES: RiskSurcharge[] = [
  { appliesTo: isCursed, rate: CURSE_SURCHARGE_RATE },
  { appliesTo: isHighlyEnchanted, rate: HIGH_ENCHANTMENT_SURCHARGE_RATE },
];

function itemRiskSurchargeOf(item: Item): number {
  const applicableRate = ITEM_RISK_SURCHARGES.filter((surcharge) => surcharge.appliesTo(item)).reduce(
    (total, surcharge) => total + surcharge.rate,
    0,
  );
  return basePremiumOf(item) * applicableRate;
}

function itemSurchargesOf(items: Item[]): number {
  return items.reduce((total, item) => total + itemRiskSurchargeOf(item), 0);
}

function policyBasePremiumOf(items: Item[]): number {
  const mainItems = items.filter((item) => !isComponent(item));
  const components = items.filter(isComponent);
  return mainItemsBasePremiumOf(mainItems) + componentsBasePremiumOf(components);
}

/** What MHPCO knows about the customer at the moment this quote is written. */
interface CustomerHistory {
  customer: Customer;
  previousContracts: number;
}

function isLongStanding(history: CustomerHistory): boolean {
  return history.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

function isFollowUpContract(history: CustomerHistory): boolean {
  return history.previousContracts > 0;
}

function loyaltyDiscountOf(history: CustomerHistory, policyBasePremium: number): number {
  return isLongStanding(history) ? policyBasePremium * LOYALTY_DISCOUNT_RATE : 0;
}

/** Every quoted item is a first insurance, regardless of the customer's history. */
function firstInsuranceSurchargeOf(policyBasePremium: number): number {
  return policyBasePremium * FIRST_INSURANCE_SURCHARGE_RATE;
}

function followUpDiscountOf(history: CustomerHistory, policyBasePremium: number): number {
  return isFollowUpContract(history) ? policyBasePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
}

function policyModifiersOf(history: CustomerHistory, policyBasePremium: number): number {
  return (
    firstInsuranceSurchargeOf(policyBasePremium) -
    loyaltyDiscountOf(history, policyBasePremium) -
    followUpDiscountOf(history, policyBasePremium)
  );
}

export function quote(customer: Customer, items: Item[], previousContracts = 0): number {
  const history: CustomerHistory = { customer, previousContracts };
  const policyBasePremium = policyBasePremiumOf(items);
  return amountOwedToMHPCO(
    policyBasePremium +
    itemSurchargesOf(items) +
    policyModifiersOf(history, policyBasePremium) +
    PROCESSING_FEE,
  );
}
