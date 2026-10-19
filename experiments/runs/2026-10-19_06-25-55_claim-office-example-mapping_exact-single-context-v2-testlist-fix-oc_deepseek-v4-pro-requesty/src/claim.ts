const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 8;

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

export interface PolicyItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export function insuranceSum(items: PolicyItem[]): number {
  return items.reduce((sum, item) => {
    assertKnownType(item.type);
    return sum + INSURANCE_VALUE[item.type];
  }, 0);
}

export function processClaim(
  items: PolicyItem[],
  remainingCap: number,
  damages: Damage[],
): ClaimResult {
  validateDamages(items, damages);

  const raw = damages.reduce((sum, damage) => {
    const item = items.find((i) => i.type === damage.itemType)!;
    return sum + reimbursement(item, damage.amount);
  }, 0);

  const payout = Math.min(Math.floor(raw), remainingCap);
  return { payout, remainingCap: remainingCap - payout };
}

function validateDamages(items: PolicyItem[], damages: Damage[]): void {
  const remaining: Record<string, number> = {};
  for (const item of items) {
    assertKnownType(item.type);
    remaining[item.type] = (remaining[item.type] ?? 0) + 1;
  }

  for (const damage of damages) {
    if (damage.amount < 0) throw new Error(`negative damage amount: ${damage.amount}`);
    const count = remaining[damage.itemType] ?? 0;
    if (count === 0) throw new Error(`item not covered by policy: ${damage.itemType}`);
    remaining[damage.itemType] = count - 1;
  }
}

function assertKnownType(type: string): void {
  if (!(type in INSURANCE_VALUE)) {
    throw new Error(`unknown item type: ${type}`);
  }
}

function reimbursement(item: PolicyItem, amount: number): number {
  const rate =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? HIGH_ENCHANTMENT_REIMBURSEMENT
      : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}