import {
  COMPONENT_BASE_PREMIUM,
  isComponent,
  listedBasePremium,
  mainItemBasePremium,
  type Item,
} from "./item-catalogue.js";

export type { Item };

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

function sum(amounts: number[]): number {
  return amounts.reduce((total, amount) => total + amount, 0);
}

function alikeComponentsBasePremium(alikeComponents: Item[]): number {
  return alikeComponents.length === BLOCK_SIZE
    ? BLOCK_BASE_PREMIUM
    : alikeComponents.length * COMPONENT_BASE_PREMIUM;
}

// "Alike" components are components of exactly the same type, not merely of
// the same family; only alike components can form a building block.
function alikeKey(component: Item): string {
  return component.type;
}

function groupAlikeComponents(components: Item[]): Item[][] {
  const groups = new Map<string, Item[]>();
  for (const component of components) {
    const key = alikeKey(component);
    const group = groups.get(key) ?? [];
    group.push(component);
    groups.set(key, group);
  }
  return [...groups.values()];
}

function componentsBasePremium(components: Item[]): number {
  return sum(groupAlikeComponents(components).map(alikeComponentsBasePremium));
}

export function policyBasePremium(items: Item[]): number {
  const components = items.filter(isComponent);
  const mainItems = items.filter((item) => !isComponent(item));
  return (
    sum(mainItems.map(mainItemBasePremium)) + componentsBasePremium(components)
  );
}

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

// An item bears every risk factor it qualifies for; a cursed, highly enchanted
// item therefore carries both surcharges.
function itemRiskSurchargeRate(item: Item): number {
  const curse = isCursed(item) ? CURSE_SURCHARGE_RATE : 0;
  const highEnchantment = isHighlyEnchanted(item)
    ? HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curse + highEnchantment;
}

// A surcharge is assessed on the item's own list price, deliberately not on
// its share of the policy base premium: the block discount is a policy pricing
// rule, so a rune in a block is still assessed on the full 25 G.
function itemRiskSurcharge(item: Item): number {
  return listedBasePremium(item) * itemRiskSurchargeRate(item);
}

// Item-specific modifiers apply to the base premium of the affected item.
function itemRiskSurcharges(items: Item[]): number {
  return sum(items.map(itemRiskSurcharge));
}

// The customer's standing with MHPCO, as far as the premium is concerned.
interface CustomerStanding {
  customer: Customer;
  previousContracts: number;
}

// Every item in a quote is treated as a first insurance, regardless of the
// customer's history, so this surcharge does not depend on the customer.
function firstInsuranceSurcharge(basePremium: number): number {
  return basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
}

function isLongStanding({ customer }: CustomerStanding): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function loyaltyDiscount(
  standing: CustomerStanding,
  basePremium: number,
): number {
  return isLongStanding(standing) ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
}

// Every contract after the customer's first is a follow-up contract.
function isFollowUpContract({ previousContracts }: CustomerStanding): boolean {
  return previousContracts > 0;
}

function followUpContractDiscount(
  standing: CustomerStanding,
  basePremium: number,
): number {
  return isFollowUpContract(standing)
    ? basePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    : 0;
}

// Policy-wide modifiers (first insurance, loyalty, follow-up contract) all
// apply to the policy base premium. Returns the net adjustment: surcharges
// positive, discounts negative. Each modifier is applied to the base premium
// separately rather than as a summed rate, so that intermediate amounts match
// the per-modifier figures in the MHPCO's own worked examples.
function policyWideModifiers(
  standing: CustomerStanding,
  basePremium: number,
): number {
  return (
    firstInsuranceSurcharge(basePremium) -
    loyaltyDiscount(standing, basePremium) -
    followUpContractDiscount(standing, basePremium)
  );
}

// All amounts are rounded to whole G in the MHPCO's favour. For a premium --
// money flowing to MHPCO -- its favour is upwards. A payout rounds the other
// way, and settlement policy owns that direction itself: the shared principle
// is "never to MHPCO's disadvantage", but the direction is a fact about this
// kind of amount, so each side keeps its own. Intermediate amounts are kept as
// fractions; only the final premium is rounded.
function roundPremiumInMhpcoFavor(premium: number): number {
  return Math.ceil(premium);
}

// The premium the MHPCO assesses for the policy itself: the policy base
// premium adjusted by the item-specific and policy-wide modifiers. The
// processing fee is not part of the assessment; it is added at the very end.
function assessedPremium(standing: CustomerStanding, items: Item[]): number {
  const basePremium = policyBasePremium(items);
  return (
    basePremium +
    itemRiskSurcharges(items) +
    policyWideModifiers(standing, basePremium)
  );
}

export function quote(
  customer: Customer,
  items: Item[],
  previousContracts = 0,
): number {
  const standing = { customer, previousContracts };
  return roundPremiumInMhpcoFavor(
    assessedPremium(standing, items) + PROCESSING_FEE,
  );
}
