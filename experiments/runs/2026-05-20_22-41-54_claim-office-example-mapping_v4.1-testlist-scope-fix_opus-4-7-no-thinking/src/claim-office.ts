const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

export function quote(input: { customer: { yearsInsured: number; previousContracts: number }; items: Array<{ type: string; cursed?: boolean; enchantment?: number }> }): { premium: number } {
  if (input.items.length === 0) return { premium: PROCESSING_FEE };

  for (const item of input.items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  const componentCounts: Record<string, number> = {};
  let base = 0;
  let itemSubtotal = 0;
  for (const item of input.items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      const itemBase = BASE_PREMIUMS[item.type];
      base += itemBase;
      itemSubtotal += itemBase + (item.cursed ? 0.5 * itemBase : 0) + ((item.enchantment ?? 0) >= 5 ? 0.3 * itemBase : 0);
    }
  }
  for (const [type, count] of Object.entries(componentCounts)) {
    const componentBase = count === 3 ? 60 : count * BASE_PREMIUMS[type];
    base += componentBase;
    itemSubtotal += componentBase;
  }

  const loyalty = input.customer.yearsInsured >= 2 ? -0.2 * base : 0;
  const followUp = input.customer.previousContracts >= 1 ? -0.15 * base : 0;
  return { premium: Math.ceil(itemSubtotal + base * FIRST_INSURANCE_RATE + loyalty + followUp + PROCESSING_FEE) };
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

export function claim(input: { items: Array<{ type: string; material?: string; enchantment?: number }>; damages: Array<{ itemType: string; amount: number }>; priorPaid?: number }): { payout: number; remainingCap: number } {
  for (const damage of input.damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount`);
    }
  }
  const itemCounts: Record<string, number> = {};
  for (const item of input.items) {
    itemCounts[item.type] = (itemCounts[item.type] ?? 0) + 1;
  }
  const damageCounts: Record<string, number> = {};
  for (const damage of input.damages) {
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
  }
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (itemCounts[type] ?? 0)) {
      throw new Error(`more ${type} damages than insured`);
    }
  }
  let payout = 0;
  for (const damage of input.damages) {
    const item = input.items.find((i) => i.type === damage.itemType);
    let amount = damage.amount;
    if (item && (item.enchantment ?? 0) >= 8) amount = amount * 0.5;
    payout += Math.max(0, amount - 100);
  }
  const insuranceSum = input.items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
  const cap = 2 * insuranceSum;
  const priorPaid = input.priorPaid ?? 0;
  const capRemaining = Math.max(0, cap - priorPaid);
  const rawPayout = Math.floor(payout);
  const finalPayout = Math.min(rawPayout, capRemaining);
  return { payout: finalPayout, remainingCap: Math.max(0, cap - priorPaid - finalPayout) };
}
