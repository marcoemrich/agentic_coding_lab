interface Customer {
  yearsWithMHPCO: number;
}

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Incident {
  cause?: string;
  damages: Damage[];
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  rune: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};

const BUILDING_BLOCK_PREMIUM = 60;

const getBasePremium = (itemType: string): number => {
  return BASE_PREMIUMS[itemType] ?? 0;
};

const isBuildingBlock = (items: Item[]): boolean => {
  if (items.length !== 3) return false;
  const allSameType = items.every(item => item.type === items[0].type);
  return allSameType && items[0].type === "rune";
};

const calculateBasePremium = (items: Item[]): number => {
  if (isBuildingBlock(items)) {
    return BUILDING_BLOCK_PREMIUM;
  }

  return items.reduce(
    (sum, item) => sum + getBasePremium(item.type),
    0
  );
};

export const quote = (customer: Customer, items: Item[]): number => {
  const totalBasePremium = calculateBasePremium(items);

  return totalBasePremium + PROCESSING_FEE;
};

const DEDUCTIBLE = 100;

const calculatePayout = (damageAmount: number): number => {
  return Math.max(0, damageAmount - DEDUCTIBLE);
};

const calculateCappedPayout = (damageAmount: number, insuranceValue: number): { payout: number; remainingCap: number } => {
  const cap = insuranceValue * 2;
  const uncappedPayout = calculatePayout(damageAmount);
  const payout = Math.min(uncappedPayout, cap);

  return {
    payout,
    remainingCap: cap - payout
  };
};

export const claim = (customer: Customer, policyIndex: number, incident: Incident): ClaimResult => {
  const damage = incident.damages[0];
  const insuranceValue = INSURANCE_VALUES[damage.itemType] ?? 0;

  return calculateCappedPayout(damage.amount, insuranceValue);
};
