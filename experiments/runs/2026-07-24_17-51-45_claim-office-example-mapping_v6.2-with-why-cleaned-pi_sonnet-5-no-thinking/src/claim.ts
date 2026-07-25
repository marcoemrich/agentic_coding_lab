export interface PolicyItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
  insuranceValue: number;
}

export interface Policy {
  items: PolicyItem[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimInput {
  policy: Policy;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE_GOLD = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const CAP_MULTIPLIER = 2;

export interface ClaimContext {
  capAlreadyUsed?: number;
}

const calculateInsuranceCap = (policy: Policy): number => {
  const insuranceSum = policy.items.reduce((sum, item) => sum + item.insuranceValue, 0);
  return insuranceSum * CAP_MULTIPLIER;
};

export const calculatePayout = (
  input: ClaimInput,
  context: ClaimContext = {}
): ClaimResult => {
  const payoutForDamage = (damage: Damage): number => {
    const item = input.policy.items.find((i) => i.type === damage.itemType);

    const hasHighEnchantmentClause = (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
    const reimbursement = hasHighEnchantmentClause
      ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
      : damage.amount;

    return reimbursement - DEDUCTIBLE_GOLD;
  };

  const desiredPayout = input.damages.reduce((sum, damage) => sum + payoutForDamage(damage), 0);

  const cap = calculateInsuranceCap(input.policy);
  const capRemainingBeforeClaim = cap - (context.capAlreadyUsed ?? 0);

  const payout = Math.floor(Math.min(desiredPayout, capRemainingBeforeClaim));
  const remainingCap = capRemainingBeforeClaim - payout;

  return { payout, remainingCap };
};
