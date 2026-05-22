const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const INITIAL_ASSESSMENT_MULTIPLIER = 1.1;
const SUBSEQUENT_CONTRACT_MULTIPLIER = 0.85;
const ALIKE_BUNDLE_DISCOUNT = 15;
const CURSED_SURCHARGE_MULTIPLIER = 1.5;
const HIGH_ENCHANTMENT_SURCHARGE_MULTIPLIER = 1.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_FACTOR = 0.5;
const LOYALTY_DISCOUNT_MULTIPLIER = 0.8;
const LOYALTY_THRESHOLD = 2;
const COMPONENT_TYPES = ["rune", "moonstone"];
const DRAGON_MATERIAL = "dragon";

type Item = { type: string; material?: string; cursed?: boolean; enchantment?: number };

function ceilToWholeGold(amount: number): number {
  return Math.ceil(Math.round(amount * 1e6) / 1e6);
}

function basePremiumFor(itemType: string): number {
  return BASE_PREMIUMS[itemType] ?? 0;
}

function enchantmentLevel(item: Item): number {
  return item.enchantment ?? 0;
}

function isHighlyEnchanted(item: Item): boolean {
  return enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function qualifiesForHighEnchantmentClaim(item: Item | undefined): boolean {
  return item !== undefined && enchantmentLevel(item) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

function itemPremium(item: Item): number {
  const base = basePremiumFor(item.type);
  const cursedMultiplier = item.cursed ? CURSED_SURCHARGE_MULTIPLIER : 1;
  const enchantmentMultiplier = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_MULTIPLIER : 1;
  return base * cursedMultiplier * enchantmentMultiplier;
}

function countOfType(items: Array<Item>, itemType: string): number {
  return items.filter((item) => item.type === itemType).length;
}

function alikeBundleDiscount(items: Array<Item>): number {
  const bundleCount = COMPONENT_TYPES.reduce(
    (sum, componentType) => sum + Math.floor(countOfType(items, componentType) / 3),
    0,
  );
  return bundleCount * ALIKE_BUNDLE_DISCOUNT;
}

function contractHistoryMultiplierFor(previousQuotes: number): number {
  return previousQuotes >= 1 ? SUBSEQUENT_CONTRACT_MULTIPLIER : INITIAL_ASSESSMENT_MULTIPLIER;
}

function loyaltyMultiplierFor(yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_THRESHOLD ? LOYALTY_DISCOUNT_MULTIPLIER : 1;
}

export function quote(input: { items: Array<Item>; previousQuotes?: number; yearsWithMHPCO?: number }): number {
  const itemPremiumSum = input.items.reduce((sum, item) => sum + itemPremium(item), 0);
  const itemsTotal = itemPremiumSum - alikeBundleDiscount(input.items);
  const contractHistoryMultiplier = contractHistoryMultiplierFor(input.previousQuotes ?? 0);
  const loyaltyMultiplier = loyaltyMultiplierFor(input.yearsWithMHPCO ?? 0);
  const total = itemsTotal * contractHistoryMultiplier * loyaltyMultiplier + PROCESSING_FEE;
  return ceilToWholeGold(total);
}

type Damage = { itemType: string; amount: number };

function isDragonMaterial(item: Item | undefined): boolean {
  return item?.material === DRAGON_MATERIAL;
}

function reimbursableAmount(damage: Damage, policyItem: Item | undefined): number {
  const factor = qualifiesForHighEnchantmentClaim(policyItem) ? HIGH_ENCHANTMENT_CLAIM_FACTOR : 1;
  return damage.amount * factor;
}

type QuoteStep = { op: "quote"; items: Array<Item> };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause?: string; damages: Array<Damage> };
};
type ScenarioStep = QuoteStep | ClaimStep;
type ScenarioResult = { premium: number } | { payout: number };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Array<ScenarioStep> };

function countQuotesBefore(steps: Array<ScenarioStep>, index: number): number {
  return steps.slice(0, index).filter((step) => step.op === "quote").length;
}

export function runScenario(scenario: Scenario): { results: Array<ScenarioResult> } {
  const results = scenario.steps.map<ScenarioResult>((step, index) => {
    if (step.op === "quote") {
      return {
        premium: quote({
          items: step.items,
          yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
          previousQuotes: countQuotesBefore(scenario.steps, index),
        }),
      };
    }
    const policyStep = scenario.steps[step.policy] as QuoteStep;
    return { payout: claim(step.incident, { items: policyStep.items }) };
  });
  return { results };
}

export function claim(
  incident: { damages: Array<Damage> },
  policy: { items: Array<Item> },
): number {
  const totals = incident.damages.reduce(
    (acc, damage) => {
      const policyItem = policy.items.find((item) => item.type === damage.itemType);
      return isDragonMaterial(policyItem)
        ? { ...acc, dragon: acc.dragon + damage.amount }
        : { ...acc, other: acc.other + reimbursableAmount(damage, policyItem) };
    },
    { dragon: 0, other: 0 },
  );
  return totals.dragon + Math.max(0, totals.other - DEDUCTIBLE);
}
