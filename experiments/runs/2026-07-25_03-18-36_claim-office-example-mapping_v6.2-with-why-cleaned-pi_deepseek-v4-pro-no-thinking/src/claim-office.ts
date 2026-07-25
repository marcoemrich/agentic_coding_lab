// Quote and claim processing logic
interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

type Step = QuoteStep | ClaimStep;

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

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

const ITEM_PRICES: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const BLOCK_PRICE_COMPONENTS = new Set(["rune", "moonstone"]);
const BLOCK_PRICE = 60;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const EXACT_BLOCK_COUNT = 3;
const PROCESSING_FEE = 5;
const ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CLAIM_DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

interface PolicyInfo {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

const calculateQuote = (items: Item[]): { baseSum: number; itemSurcharges: number } => {
  const componentCounts: Record<string, number> = {};
  let baseSum = 0;
  let itemSurcharges = 0;

  for (const item of items) {
    if (!(item.type in ITEM_PRICES)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    if (BLOCK_PRICE_COMPONENTS.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    } else {
      const basePrice = ITEM_PRICES[item.type] || 0;
      baseSum += basePrice;
      if (item.cursed) {
        itemSurcharges += basePrice * CURSED_SURCHARGE_RATE;
      }
      if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
        itemSurcharges += basePrice * HIGH_ENCHANTMENT_SURCHARGE_RATE;
      }
    }
  }

  for (const [type, count] of Object.entries(componentCounts)) {
    const price = ITEM_PRICES[type] || 0;
    if (count === EXACT_BLOCK_COUNT) {
      baseSum += BLOCK_PRICE;
    } else {
      baseSum += count * price;
    }
  }

  return { baseSum, itemSurcharges };
};

export const processScenario = (scenario: Scenario): unknown => {
  const results: unknown[] = [];
  const policyByStep: Map<number, PolicyInfo> = new Map();
  let quoteCount = 0;
  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      const { baseSum, itemSurcharges } = calculateQuote(step.items);
      let quotePremium = baseSum + itemSurcharges;
      quotePremium += baseSum * FIRST_INSURANCE_SURCHARGE_RATE;
      if (scenario.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
        quotePremium -= baseSum * LOYALTY_DISCOUNT_RATE;
      }
      quoteCount++;
      if (quoteCount > 1) {
        quotePremium -= baseSum * FOLLOW_UP_DISCOUNT_RATE;
      }
      const premium = Math.ceil(quotePremium + PROCESSING_FEE);

      let insuranceSum = 0;
      for (const item of step.items) {
        insuranceSum += ITEM_INSURANCE_VALUES[item.type] || 0;
      }
      const cap = insuranceSum * 2;
      policyByStep.set(i, { items: step.items, insuranceSum, remainingCap: cap });
      results.push({ premium });
    } else if (step.op === "claim") {
      const policy = policyByStep.get(step.policy);
      if (!policy) {
        throw new Error("Policy not found");
      }

      let payout = 0;

      // Validate damage counts vs insured counts
      const damageCounts: Record<string, number> = {};
      for (const damage of step.incident.damages) {
        damageCounts[damage.itemType] = (damageCounts[damage.itemType] || 0) + 1;
      }
      const insuredCounts: Record<string, number> = {};
      for (const item of policy.items) {
        insuredCounts[item.type] = (insuredCounts[item.type] || 0) + 1;
      }
      for (const [itemType, count] of Object.entries(damageCounts)) {
        if ((insuredCounts[itemType] || 0) < count) {
          throw new Error(`More damage entries than insured items of type: ${itemType}`);
        }
      }

      for (const damage of step.incident.damages) {
        const insuredItem = policy.items.find((item: Item) => item.type === damage.itemType);
        if (!insuredItem) {
          throw new Error("Item not in policy");
        }

        if (damage.amount < 0) {
          throw new Error("Negative damage amount");
        }

        let reimbursable = damage.amount;
        const enchantment = insuredItem.enchantment || 0;
        const isDragonMaterial = insuredItem.material === "dragon";

        if (enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
          reimbursable = damage.amount * HIGH_ENCHANTMENT_CLAIM_RATE;
        } else if (isDragonMaterial) {
          // Full reimbursement
        }

        reimbursable -= CLAIM_DEDUCTIBLE;
        if (reimbursable < 0) reimbursable = 0;
        payout += reimbursable;
      }

      if (payout > policy.remainingCap) {
        payout = policy.remainingCap;
      }
      payout = Math.floor(payout);
      policy.remainingCap -= payout;

      results.push({ payout, remainingCap: policy.remainingCap });
    }
  }
  return { results };
};