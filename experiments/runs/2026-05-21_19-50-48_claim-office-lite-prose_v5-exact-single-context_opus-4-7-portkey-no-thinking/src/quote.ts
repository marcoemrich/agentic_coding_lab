export interface Customer {
  yearsWithMHPCO: number;
  contractCount: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteResult {
  premium: number;
}

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const PROCESSING_FEE = 5;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_PREMIUM = 60;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const itemBasePremium = (item: Item): number => {
  let p = BASE_PREMIUM[item.type];
  if (item.cursed) p = p * 3 / 2;
  if ((item.enchantment ?? 0) >= 5) p = p * 13 / 10;
  return p;
};

const sumBasePremium = (items: Item[]): number => {
  const components: Item[] = [];
  const mainItems: Item[] = [];
  for (const item of items) {
    if (isComponent(item)) components.push(item);
    else mainItems.push(item);
  }

  let total = 0;
  for (const item of mainItems) {
    total += itemBasePremium(item);
  }

  const byType = new Map<string, Item[]>();
  for (const c of components) {
    const arr = byType.get(c.type) ?? [];
    arr.push(c);
    byType.set(c.type, arr);
  }
  for (const [, list] of byType) {
    const blocks = Math.floor(list.length / 3);
    const singles = list.length % 3;
    total += blocks * COMPONENT_BLOCK_PREMIUM;
    for (let i = list.length - singles; i < list.length; i++) {
      total += itemBasePremium(list[i]);
    }
  }

  return total;
};

export const quote = (customer: Customer, items: Item[]): QuoteResult => {
  const basePremium = sumBasePremium(items);
  let runningTimes100 = basePremium * 100;
  if (customer.contractCount === 0) {
    runningTimes100 = (runningTimes100 * 110) / 100;
  } else {
    runningTimes100 = (runningTimes100 * 85) / 100;
  }
  if (customer.yearsWithMHPCO >= 2) {
    runningTimes100 = (runningTimes100 * 80) / 100;
  }
  const totalTimes100 = runningTimes100 + PROCESSING_FEE * 100;
  return { premium: Math.ceil(totalTimes100 / 100) };
};
