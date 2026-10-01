export type ItemKind = 'main' | 'component';

export interface ItemSpec {
  insuranceValue: number;
  basePremium: number;
  kind: ItemKind;
}

const COMPONENT: ItemSpec = { insuranceValue: 250, basePremium: 25, kind: 'component' };

const PRICE_LIST: Record<string, ItemSpec> = {
  sword: { insuranceValue: 1000, basePremium: 100, kind: 'main' },
  amulet: { insuranceValue: 600, basePremium: 60, kind: 'main' },
  staff: { insuranceValue: 800, basePremium: 80, kind: 'main' },
  potion: { insuranceValue: 400, basePremium: 40, kind: 'main' },
  rune: COMPONENT,
  moonstone: COMPONENT,
};

export function itemSpec(type: string): ItemSpec | undefined {
  return PRICE_LIST[type];
}
