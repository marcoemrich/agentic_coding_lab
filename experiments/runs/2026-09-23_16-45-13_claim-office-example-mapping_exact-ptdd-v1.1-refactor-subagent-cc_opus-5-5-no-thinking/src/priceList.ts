import { ScenarioRejection } from "./rejection.js";

interface Price {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEM_PRICES: Record<string, Price> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_PRICE: Price = { insuranceValue: 250, basePremium: 25 };

const PRICE_LIST: Record<string, Price> = {
  ...MAIN_ITEM_PRICES,
  ...Object.fromEntries(COMPONENT_TYPES.map((type) => [type, COMPONENT_PRICE])),
};

export class UnknownItemTypeError extends ScenarioRejection {
  constructor(type: string) {
    super(`Unknown item type "${type}" is not on the MHPCO price list`);
  }
}

function priceOf(type: string): Price {
  const price = PRICE_LIST[type];
  if (price === undefined) throw new UnknownItemTypeError(type);
  return price;
}

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.includes(type);
}

export function insuranceValue(type: string): number {
  return priceOf(type).insuranceValue;
}

export function basePremium(type: string): number {
  return priceOf(type).basePremium;
}
