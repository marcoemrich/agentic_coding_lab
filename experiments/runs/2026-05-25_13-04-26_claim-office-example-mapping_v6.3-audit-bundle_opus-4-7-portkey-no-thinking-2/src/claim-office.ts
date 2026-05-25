const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

interface Item {
  type: string;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: QuoteStep[];
}

const withFirstInsuranceSurcharge = (base: number): number =>
  base + base * FIRST_INSURANCE_SURCHARGE_RATE;

const itemPremium = (item: Item): number =>
  withFirstInsuranceSurcharge(BASE_PREMIUM_BY_TYPE[item.type]);

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_BASE_PREMIUM = 60;
const BLOCK_SIZE = 3;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);
const isNonComponent = (item: Item): boolean => !isComponent(item);

const sumPremiums = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemPremium(item), 0);

const componentsPremium = (components: Item[]): number =>
  components.length === BLOCK_SIZE
    ? withFirstInsuranceSurcharge(BLOCK_BASE_PREMIUM)
    : sumPremiums(components);

const sumItemPremiums = (items: Item[]): number =>
  componentsPremium(items.filter(isComponent)) +
  sumPremiums(items.filter(isNonComponent));

const quoteStep = ({ items }: QuoteStep) => ({
  premium: Math.ceil(sumItemPremiums(items) + PROCESSING_FEE),
});

export const processScenario = ({ steps }: Scenario): unknown => ({
  results: steps.map(quoteStep),
});
