const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

export function quote(input: { customer: { yearsWithMHPCO: number; previousContract: boolean }; items: { type: string; cursed?: boolean; enchantment?: number }[] }): number {
  if (input.items.length === 0) return PROCESSING_FEE;
  const groups = new Map<string, { type: string; cursed?: boolean; enchantment?: number }[]>();
  for (const item of input.items) {
    if (BASE_PREMIUM_BY_TYPE[item.type] === undefined) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    const list = groups.get(item.type) ?? [];
    list.push(item);
    groups.set(item.type, list);
  }
  let policyBaseUnmodified = 0;
  let itemSurcharges = 0;
  let firstInsurance = 0;
  for (const [type, items] of groups) {
    const count = items.length;
    if (COMPONENT_TYPES.has(type) && count === 3) {
      policyBaseUnmodified += 60;
      firstInsurance += 60 * FIRST_INSURANCE_RATE;
    } else {
      for (const item of items) {
        const itemBase = BASE_PREMIUM_BY_TYPE[type];
        policyBaseUnmodified += itemBase;
        if (item.cursed) {
          itemSurcharges += itemBase * 0.5;
        }
        if ((item.enchantment ?? 0) >= 5) {
          itemSurcharges += itemBase * 0.3;
        }
        firstInsurance += itemBase * FIRST_INSURANCE_RATE;
      }
    }
  }
  let loyalty = 0;
  if (input.customer.yearsWithMHPCO >= 2) {
    loyalty = policyBaseUnmodified * 0.2;
  }
  let followUp = 0;
  if (input.customer.previousContract) {
    followUp = policyBaseUnmodified * 0.15;
  }
  return Math.ceil(policyBaseUnmodified + itemSurcharges + firstInsurance - loyalty - followUp + PROCESSING_FEE);
}

export const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

export function policyCap(items: { type: string }[]): number {
  let sum = 0;
  for (const item of items) {
    sum += INSURANCE_VALUE_BY_TYPE[item.type];
  }
  return 2 * sum;
}

export function claim(
  policy: { remainingCap: number; items: { type: string; enchantment?: number }[] },
  incident: { damages: { itemType: string; amount: number }[] }
): { payout: number; remainingCap: number } {
  const damagesByType: Record<string, number> = {};
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    damagesByType[damage.itemType] = (damagesByType[damage.itemType] ?? 0) + 1;
  }
  const insuredByType: Record<string, number> = {};
  for (const item of policy.items) {
    insuredByType[item.type] = (insuredByType[item.type] ?? 0) + 1;
  }
  for (const type of Object.keys(damagesByType)) {
    if (damagesByType[type] > (insuredByType[type] ?? 0)) {
      throw new Error(`More damages of type ${type} than insured items`);
    }
  }
  let payout = 0;
  for (const damage of incident.damages) {
    const item = policy.items.find((i) => i.type === damage.itemType);
    let amount = damage.amount;
    if (item && (item.enchantment ?? 0) >= 8) {
      amount = amount * 0.5;
    }
    payout += Math.max(0, amount - 100);
  }
  payout = Math.min(payout, policy.remainingCap);
  payout = Math.floor(payout);
  return { payout, remainingCap: policy.remainingCap - payout };
}
