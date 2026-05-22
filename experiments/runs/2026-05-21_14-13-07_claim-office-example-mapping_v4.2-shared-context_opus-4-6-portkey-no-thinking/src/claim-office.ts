type PolicyItem = { type: string; cursed?: boolean; enchantment?: number; material?: string };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.10;
const DEDUCTIBLE = 100;
const INSURANCE_CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BLOCK_OF_THREE_PRICE = 60;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const BASE_PRICE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

function surchargeFor(item: PolicyItem): number {
  const base = BASE_PRICE[item.type];
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * CURSED_SURCHARGE_RATE;
  }
  if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
}

function itemPremiums(items: PolicyItem[]): { baseSum: number; total: number } {
  const countsByType: Record<string, number> = {};
  for (const item of items) {
    countsByType[item.type] = (countsByType[item.type] || 0) + 1;
  }

  let baseSum = 0;
  for (const type in countsByType) {
    const count = countsByType[type];
    const isBlockOfThree = count === 3;
    if (isBlockOfThree) {
      baseSum += BLOCK_OF_THREE_PRICE;
    } else {
      baseSum += count * BASE_PRICE[type];
    }
  }

  let surcharges = 0;
  for (const item of items) {
    surcharges += surchargeFor(item);
  }

  return { baseSum, total: baseSum + surcharges };
}

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

export function quote(
  policy: { customer: { years: number }; items: PolicyItem[] },
  options: { isFollowUp: boolean }
): { premium: number } {
  const { baseSum, total } = itemPremiums(policy.items);
  let premium = total;
  premium += baseSum * FIRST_INSURANCE_RATE;
  if (policy.customer.years >= LOYALTY_THRESHOLD_YEARS) {
    premium -= baseSum * LOYALTY_DISCOUNT_RATE;
  }
  if (options.isFollowUp) {
    premium -= baseSum * FOLLOW_UP_DISCOUNT_RATE;
  }
  return { premium: Math.ceil(premium + PROCESSING_FEE) };
}

export function claim(
  policy: { customer: { years: number }; items: PolicyItem[] },
  damages: { type: string; amount: number }[]
): { payout: number; remainingCap: number } {
  let insuranceSum = 0;
  for (const item of policy.items) {
    insuranceSum += INSURANCE_VALUE[item.type];
  }
  const insuranceCap = INSURANCE_CAP_MULTIPLIER * insuranceSum;

  let payout = 0;
  for (const damage of damages) {
    const policyItem = policy.items.find(item => item.type === damage.type);
    const isHighEnchantment = policyItem !== undefined
      && policyItem.enchantment !== undefined
      && policyItem.enchantment >= CLAIM_ENCHANTMENT_THRESHOLD;
    let reimbursement = damage.amount;
    if (isHighEnchantment) {
      reimbursement = damage.amount * CLAIM_ENCHANTMENT_REIMBURSEMENT_RATE;
    }
    payout += reimbursement - DEDUCTIBLE;
  }

  payout = Math.floor(payout);
  return { payout, remainingCap: insuranceCap - payout };
}

export function runScenario(): undefined {
  return undefined;
}
