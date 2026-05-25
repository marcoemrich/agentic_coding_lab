import { Customer, Item } from "./types.js";
import { policyBasePremiums } from "./items.js";

const PROCESSING_FEE = 5;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCH_SURCHARGE_RATE = 0.3;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const HIGH_ENCH_PREMIUM_THRESHOLD = 5;
const LOYALTY_YEARS_THRESHOLD = 2;

function itemSurchargeRate(item: Item): number {
  let rate = 0;
  if (item.cursed === true) rate += CURSE_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCH_PREMIUM_THRESHOLD) {
    rate += HIGH_ENCH_SURCHARGE_RATE;
  }
  return rate;
}

function policyModifierRate(customer: Customer, isFollowUpContract: boolean): number {
  let rate = FIRST_INSURANCE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) rate -= LOYALTY_DISCOUNT_RATE;
  if (isFollowUpContract) rate -= FOLLOW_UP_DISCOUNT_RATE;
  return rate;
}

export function computePremium(
  customer: Customer,
  items: Item[],
  isFollowUpContract: boolean,
): number {
  const { perItemBase, totalBase } = policyBasePremiums(items);

  const itemSurcharges = items.reduce(
    (sum, item, i) => sum + perItemBase[i] * itemSurchargeRate(item),
    0,
  );
  const policyAdjustment = totalBase * policyModifierRate(customer, isFollowUpContract);

  return Math.ceil(totalBase + itemSurcharges + policyAdjustment + PROCESSING_FEE);
}
