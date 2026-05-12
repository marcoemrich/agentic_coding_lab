export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Customer = {
  yearsWithMHPCO: number;
  contractCount: number;
};

export type QuoteInput = {
  items: Item[];
  customer: Customer;
};

const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_PREMIUM = 60;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const roundPremiumInMhpcoFavor = (amount: number): number => Math.ceil(amount);
const roundPayoutInMhpcoFavor = (amount: number): number => Math.floor(amount);

const isAlikeBlock = (items: Item[]): boolean =>
  items.length === 3 && items.every(i => i.type === items[0].type);

const itemSurcharge = (item: Item): number => {
  const rawBase = BASE_PREMIUMS[item.type];
  const curseSurcharge = item.cursed ? rawBase * 0.5 : 0;
  const enchantmentSurcharge = (item.enchantment ?? 0) >= 5 ? rawBase * 0.3 : 0;
  return curseSurcharge + enchantmentSurcharge;
};

type Premiums = { raw: number; adjusted: number };

const computePremiums = (items: Item[]): Premiums => {
  if (isAlikeBlock(items)) return { raw: COMPONENT_BLOCK_PREMIUM, adjusted: COMPONENT_BLOCK_PREMIUM };
  return items.reduce(
    (acc, item) => {
      const base = BASE_PREMIUMS[item.type];
      if (base === undefined) throw new Error(`Unknown item type: ${item.type}`);
      return {
        raw: acc.raw + base,
        adjusted: acc.adjusted + base + itemSurcharge(item),
      };
    },
    { raw: 0, adjusted: 0 }
  );
};

export const quote = ({ items, customer }: QuoteInput): number => {
  const { adjusted, raw } = computePremiums(items);
  const loyaltyDiscount = customer.yearsWithMHPCO >= 2 ? raw * 0.2 : 0;
  const firstInsuranceSurcharge = raw * 0.1;
  const followUpDiscount = customer.contractCount >= 1 ? raw * 0.15 : 0;
  return roundPremiumInMhpcoFavor(adjusted - loyaltyDiscount + firstInsuranceSurcharge - followUpDiscount + PROCESSING_FEE);
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type Policy = {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
};

export type ClaimInput = {
  policy: Policy;
  incident: Incident;
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

const DEDUCTIBLE = 100;

const damageReimbursement = (damage: Damage, items: Item[]): number => {
  if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
  const item = items.find(it => it.type === damage.itemType);
  if (!item) throw new Error(`Item not in policy: ${damage.itemType}`);
  const reimbursable = (item.enchantment ?? 0) >= 8 ? damage.amount * 0.5 : damage.amount;
  return reimbursable - DEDUCTIBLE;
};

const assertDamagesWithinPolicy = (damages: Damage[], policyItems: Item[]): void => {
  const damageCounts = damages.reduce((acc, d) => ({ ...acc, [d.itemType]: (acc[d.itemType] ?? 0) + 1 }), {} as Record<string, number>);
  for (const [itemType, count] of Object.entries(damageCounts)) {
    const insuredCount = policyItems.filter(it => it.type === itemType).length;
    if (count > insuredCount) throw new Error(`More damages than insured items of type: ${itemType}`);
  }
};

export const claim = ({ policy, incident }: ClaimInput): ClaimResult => {
  assertDamagesWithinPolicy(incident.damages, policy.items);
  const rawPayout = incident.damages.reduce((sum, damage) => sum + damageReimbursement(damage, policy.items), 0);
  const payout = roundPayoutInMhpcoFavor(Math.min(rawPayout, policy.remainingCap));
  return { payout, remainingCap: policy.remainingCap - payout };
};
