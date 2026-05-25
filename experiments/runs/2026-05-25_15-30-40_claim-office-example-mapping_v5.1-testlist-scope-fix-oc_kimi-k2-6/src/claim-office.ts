interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

const MAIN_ITEMS: Record<string, { value: number; base: number }> = {
  sword: { value: 1000, base: 100 },
  amulet: { value: 600, base: 60 },
  staff: { value: 800, base: 80 },
  potion: { value: 400, base: 40 },
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_VALUE = 250;
const COMPONENT_BASE = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE = 60;

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.includes(type);
}

function getBasePremium(items: Item[]): number {
  let total = 0;
  const components: Record<string, number> = {};
  const mainItems: Item[] = [];

  for (const item of items) {
    if (isComponent(item.type)) {
      components[item.type] = (components[item.type] || 0) + 1;
    } else {
      mainItems.push(item);
    }
  }

  for (const item of mainItems) {
    const info = MAIN_ITEMS[item.type];
    if (!info) throw new Error(`Unknown item type: ${item.type}`);
    total += info.base;
  }

  for (const [type, count] of Object.entries(components)) {
    if (count === BLOCK_SIZE) {
      total += BLOCK_BASE;
    } else {
      total += count * COMPONENT_BASE;
    }
  }

  return total;
}

function getInsuranceValue(items: Item[]): number {
  let total = 0;
  const components: Record<string, number> = {};

  for (const item of items) {
    if (isComponent(item.type)) {
      components[item.type] = (components[item.type] || 0) + 1;
    } else {
      const info = MAIN_ITEMS[item.type];
      if (!info) throw new Error(`Unknown item type: ${item.type}`);
      total += info.value;
    }
  }

  for (const count of Object.values(components)) {
    total += count * COMPONENT_VALUE;
  }

  return total;
}

function calculateQuotePremium(
  items: Item[],
  customer: { yearsWithMHPCO: number },
  quoteIndex: number
): number {
  if (items.length === 0) {
    return 5;
  }

  const policyBase = getBasePremium(items);
  let total = policyBase;

  // Item-specific modifiers
  for (const item of items) {
    const info = MAIN_ITEMS[item.type];
    if (!info) continue; // components don't have item-specific modifiers
    if (item.cursed) {
      total += info.base * 0.5;
    }
    if ((item.enchantment ?? 0) >= 5) {
      total += info.base * 0.3;
    }
  }

  // Policy-wide modifiers
  if (customer.yearsWithMHPCO >= 2) {
    total -= policyBase * 0.2;
  }
  total += policyBase * 0.1; // first insurance
  if (quoteIndex > 0) {
    total -= policyBase * 0.15; // follow-up discount
  }

  total += 5; // processing fee

  return Math.ceil(total);
}

interface Policy {
  items: Item[];
  cap: number;
  remainingCap: number;
}

function calculateClaimPayout(
  policy: Policy,
  damages: Damage[]
): { payout: number; remainingCap: number } {
  let payout = 0;

  // Count items in policy by type
  const policyCounts: Record<string, number> = {};
  for (const item of policy.items) {
    policyCounts[item.type] = (policyCounts[item.type] || 0) + 1;
  }

  // Count damages by type
  const damageCounts: Record<string, number> = {};
  for (const dmg of damages) {
    damageCounts[dmg.itemType] = (damageCounts[dmg.itemType] || 0) + 1;
  }

  // Validate damage counts don't exceed policy counts
  for (const [type, count] of Object.entries(damageCounts)) {
    if (!policyCounts[type] || count > policyCounts[type]) {
      throw new Error(`Invalid damage: ${type}`);
    }
  }

  // Create a lookup for item properties
  const itemProps: Record<string, Item> = {};
  for (const item of policy.items) {
    itemProps[item.type] = item;
  }

  for (const dmg of damages) {
    if (dmg.amount < 0) {
      throw new Error("Negative damage amount");
    }

    const item = itemProps[dmg.itemType];
    let damageAmount = dmg.amount;

    if (item && !isComponent(item.type)) {
      const enchantment = item.enchantment ?? 0;
      const isDragon = item.material === "dragon";

      if (enchantment >= 8) {
        damageAmount = damageAmount * 0.5;
      } else if (isDragon) {
        // full reimbursement
      }
      // If both apply, 50% rule wins (handled by checking enchantment first)
    }

    let itemPayout = damageAmount - 100;
    if (itemPayout < 0) itemPayout = 0;

    payout += itemPayout;
  }

  // Round payout down
  payout = Math.floor(payout);

  // Apply cap
  if (payout > policy.remainingCap) {
    payout = policy.remainingCap;
  }

  const remainingCap = policy.remainingCap - payout;

  return { payout, remainingCap };
}

export function processScenario(scenario: Scenario): unknown {
  const results: Array<{ premium: number } | { payout: number; remainingCap: number }> = [];
  const policies: Policy[] = [];
  let quoteCount = 0;

  for (let stepIndex = 0; stepIndex < scenario.steps.length; stepIndex++) {
    const step = scenario.steps[stepIndex];

    if (step.op === "quote") {
      for (const item of step.items) {
        if (!isComponent(item.type) && !MAIN_ITEMS[item.type]) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }

      const premium = calculateQuotePremium(step.items, scenario.customer, quoteCount);
      results.push({ premium });

      const insuranceValue = getInsuranceValue(step.items);
      policies.push({
        items: step.items,
        cap: insuranceValue * 2,
        remainingCap: insuranceValue * 2,
      });

      quoteCount++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error(`Invalid policy reference: ${step.policy}`);
      }

      const { payout, remainingCap } = calculateClaimPayout(policy, step.incident.damages);
      results.push({ payout, remainingCap });
      policy.remainingCap = remainingCap;
    }
  }

  return { results };
}
