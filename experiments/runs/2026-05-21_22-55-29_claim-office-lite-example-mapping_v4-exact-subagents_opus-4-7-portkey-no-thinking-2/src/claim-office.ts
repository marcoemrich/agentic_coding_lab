const PROCESSING_FEE = 5;

const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

type Item = { type: string; cursed?: boolean; enchantment?: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type Step = { op?: string; items?: Item[]; policy?: number; incident?: Incident };
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_BASE_PREMIUM = 60;

function computeQuotePremium(
  items: Item[],
  customer: Customer,
  quoteIndex: number,
): number {
  const componentCountsByType = new Map<string, number>();
  let itemAdjustedSum = 0;
  let policyBasePremium = 0;
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM_BY_ITEM_TYPE)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    if (COMPONENT_TYPES.has(item.type)) {
      componentCountsByType.set(
        item.type,
        (componentCountsByType.get(item.type) ?? 0) + 1,
      );
    } else {
      const base = BASE_PREMIUM_BY_ITEM_TYPE[item.type] ?? 0;
      let itemPremium = base;
      if (item.cursed) {
        itemPremium += base * 0.5;
      }
      if (item.enchantment !== undefined && item.enchantment >= 5) {
        itemPremium += base * 0.3;
      }
      itemPremium += base * 0.1;
      itemAdjustedSum += itemPremium;
      policyBasePremium += base;
    }
  }
  for (const [type, count] of componentCountsByType) {
    if (count === 3) {
      itemAdjustedSum += BLOCK_BASE_PREMIUM + BLOCK_BASE_PREMIUM * 0.1;
      policyBasePremium += BLOCK_BASE_PREMIUM;
    } else {
      const componentBase = BASE_PREMIUM_BY_ITEM_TYPE[type] ?? 0;
      itemAdjustedSum += count * (componentBase + componentBase * 0.1);
      policyBasePremium += count * componentBase;
    }
  }
  let loyaltyDiscount = 0;
  if (customer.yearsWithMHPCO >= 2) {
    loyaltyDiscount = policyBasePremium * 0.2;
  }
  let followUpDiscount = 0;
  if (quoteIndex >= 1) {
    followUpDiscount = policyBasePremium * 0.15;
  }
  return Math.ceil(
    itemAdjustedSum - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
  );
}

const DEDUCTIBLE = 100;

function computeClaimPayout(incident: Incident, items: Item[]): number {
  const damageCountsByType = new Map<string, number>();
  for (const damage of incident.damages) {
    damageCountsByType.set(
      damage.itemType,
      (damageCountsByType.get(damage.itemType) ?? 0) + 1,
    );
  }
  for (const [type, count] of damageCountsByType) {
    const insuredCount = items.filter((i) => i.type === type).length;
    if (count > insuredCount) {
      throw new Error(`Damages of type ${type} exceed insured quantity`);
    }
  }
  let payout = 0;
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    const item = items.find((i) => i.type === damage.itemType);
    if (item === undefined) {
      throw new Error(`Claim references item not in policy: ${damage.itemType}`);
    }
    let reimbursable = damage.amount;
    if (item.enchantment !== undefined && item.enchantment >= 8) {
      reimbursable = damage.amount * 0.5;
    }
    payout += reimbursable - DEDUCTIBLE;
  }
  return Math.floor(payout);
}

export function processScenario(scenario: unknown): unknown {
  const { customer, steps } = scenario as Scenario;
  const results: ({ premium: number } | { payout: number })[] = [];
  const policyItems: Item[][] = [];
  let quoteIndex = 0;
  for (const step of steps) {
    if (step.op === "claim") {
      const policyIdx = step.policy ?? 0;
      const items = policyItems[policyIdx] ?? [];
      const payout = computeClaimPayout(step.incident as Incident, items);
      results.push({ payout });
      continue;
    }
    const premium = computeQuotePremium(step.items ?? [], customer, quoteIndex);
    results.push({ premium });
    policyItems.push(step.items ?? []);
    quoteIndex += 1;
  }
  return { results };
}
