interface Customer { yearsWithMHPCO: number }
interface Item { type: string; cursed?: boolean; enchantment?: number; [key: string]: unknown }

const COMPONENT_PREMIUM = 25;
const BLOCK_OF_THREE_PREMIUM = 60;
const DEDUCTIBLE = 100;
const QUOTE_ENCHANTMENT_THRESHOLD = 5;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_PREMIUM,
};

export const quote = (customer: Customer, items: Item[], { isFollowUp = false }: { isFollowUp?: boolean } = {}): number => {
  const { itemCountsByType, itemSurcharges } = items.reduce(
    ({ itemCountsByType, itemSurcharges }, item) => {
      const base = BASE_PREMIUMS[item.type];
      return {
        itemCountsByType: { ...itemCountsByType, [item.type]: (itemCountsByType[item.type] ?? 0) + 1 },
        itemSurcharges: itemSurcharges + (item.cursed ? base / 2 : 0) + ((item.enchantment ?? 0) >= QUOTE_ENCHANTMENT_THRESHOLD ? base * 3 / 10 : 0),
      };
    },
    { itemCountsByType: {} as Record<string, number>, itemSurcharges: 0 }
  );
  const policyBase = Object.entries(itemCountsByType).reduce((sum, [type, count]) => {
    const base = BASE_PREMIUMS[type];
    return sum + (count === 3 && base === COMPONENT_PREMIUM ? BLOCK_OF_THREE_PREMIUM : base * count);
  }, 0);
  const loyaltyDiscount = customer.yearsWithMHPCO >= 2 ? policyBase / 5 : 0;
  const followUpDiscount = isFollowUp ? policyBase * 3 / 20 : 0;
  const firstInsuranceSurcharge = policyBase / 10;
  return Math.ceil(policyBase + itemSurcharges + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount + 5);
};

export const claim = (policy: any, incident: any): { payout: number; remainingCap: number } => {
  const damage = incident.damages[0];
  const item = policy.items.find((policyItem: any) => policyItem.type === damage.itemType);
  const reimbursable = (item?.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD ? damage.amount / 2 : damage.amount;
  const uncappedPayout = Math.floor(reimbursable - DEDUCTIBLE);
  const payout = Math.min(uncappedPayout, policy.remainingCap);
  const remainingCap = policy.remainingCap - payout;
  return { payout, remainingCap };
};
