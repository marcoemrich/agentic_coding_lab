import { componentsBasePremium } from "./component-block.js";
import type { Customer, Item } from "./insured-item.js";
import { amountOwedToMhpco } from "./mhpcos-favor.js";
import { isComponent, itemBasePremium } from "./price-list.js";

const PROCESSING_FEE = 5;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

function mainItemsBasePremium(mainItems: Item[]): number {
  return mainItems
    .map(itemBasePremium)
    .reduce((sum, premium) => sum + premium, 0);
}

function policyBasePremium(items: Item[]): number {
  return (
    mainItemsBasePremium(items.filter((item) => !isComponent(item))) +
    componentsBasePremium(items.filter(isComponent))
  );
}

interface ItemRisk {
  applies: (item: Item) => boolean;
  surchargeRate: number;
}

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;

const ITEM_RISKS: ItemRisk[] = [
  { applies: isCursed, surchargeRate: CURSE_SURCHARGE_RATE },
  { applies: isHighlyEnchanted, surchargeRate: HIGH_ENCHANTMENT_SURCHARGE_RATE },
];

function itemRiskSurcharge(item: Item): number {
  return ITEM_RISKS.filter((risk) => risk.applies(item))
    .map((risk) => itemBasePremium(item) * risk.surchargeRate)
    .reduce((sum, surcharge) => sum + surcharge, 0);
}

function itemRiskSurcharges(items: Item[]): number {
  return items
    .map(itemRiskSurcharge)
    .reduce((sum, surcharge) => sum + surcharge, 0);
}

// Every item in a quote is insured for the first time, so the initial assessment
// surcharge applies to every quote -- it does not depend on the customer's history.
function initialAssessmentOnEveryQuote(basePremium: number): number {
  return basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
}

interface CustomerStanding {
  yearsWithMHPCO: number;
  previousContracts: number;
}

interface CustomerStandingDiscount {
  earnedBy: (standing: CustomerStanding) => boolean;
  discountRate: number;
}

const isLongStanding = (standing: CustomerStanding): boolean =>
  standing.yearsWithMHPCO >= LOYALTY_YEARS;

const isFollowUpContract = (standing: CustomerStanding): boolean =>
  standing.previousContracts > 0;

const CUSTOMER_STANDING_DISCOUNTS: CustomerStandingDiscount[] = [
  { earnedBy: isLongStanding, discountRate: LOYALTY_DISCOUNT_RATE },
  { earnedBy: isFollowUpContract, discountRate: FOLLOW_UP_CONTRACT_DISCOUNT_RATE },
];

function customerStandingDiscounts(
  standing: CustomerStanding,
  basePremium: number,
): number {
  return CUSTOMER_STANDING_DISCOUNTS.filter((discount) =>
    discount.earnedBy(standing),
  )
    .map((discount) => basePremium * discount.discountRate)
    .reduce((sum, amount) => sum + amount, 0);
}

function policyWideModifiers(
  standing: CustomerStanding,
  basePremium: number,
): number {
  return (
    initialAssessmentOnEveryQuote(basePremium) -
    customerStandingDiscounts(standing, basePremium)
  );
}

export function quote(
  customer: Customer,
  items: Item[],
  previousContracts: number,
): number {
  const basePremium = policyBasePremium(items);
  const standing = { ...customer, previousContracts };
  const premium =
    basePremium +
    itemRiskSurcharges(items) +
    policyWideModifiers(standing, basePremium) +
    PROCESSING_FEE;
  // A premium is owed to the MHPCO, so its fraction is rounded up.
  return amountOwedToMhpco(premium);
}
