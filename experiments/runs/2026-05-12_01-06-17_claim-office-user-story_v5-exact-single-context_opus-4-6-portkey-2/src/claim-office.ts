interface Item {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
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
    damages: { itemType: string; amount: number }[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface ScenarioResult {
  results: Record<string, number>[];
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const FIRST_INSURANCE_SURCHARGE = 10;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const CURSED_SURCHARGE = 50;
const ENCHANTMENT_SURCHARGE = 30;
const ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 20;
const LOYALTY_THRESHOLD = 2;
const MULTI_CONTRACT_DISCOUNT = 15;
const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_PREMIUM = 60;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 50;
const DRAGON_MATERIAL = "dragon";

function sumItemPremiums(items: Item[]): number {
  const componentCounts: Record<string, number> = {};
  let total = 0;

  for (const item of items) {
    const mainPremium = BASE_PREMIUMS[item.type];
    if (mainPremium !== undefined) {
      let itemPremium = mainPremium;
      if (item.cursed) {
        itemPremium = Math.ceil(itemPremium * (100 + CURSED_SURCHARGE) / 100);
      }
      if (item.enchantment >= ENCHANTMENT_THRESHOLD) {
        itemPremium = Math.ceil(itemPremium * (100 + ENCHANTMENT_SURCHARGE) / 100);
      }
      total += itemPremium;
    } else {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    }
  }

  for (const count of Object.values(componentCounts)) {
    const blocks = Math.floor(count / BUILDING_BLOCK_SIZE);
    const remainder = count % BUILDING_BLOCK_SIZE;
    total += blocks * BUILDING_BLOCK_PREMIUM + remainder * COMPONENT_BASE_PREMIUM;
  }

  return total;
}

function sumInsuranceValues(items: Item[]): number {
  return items.reduce(
    (total, item) => total + (INSURANCE_VALUES[item.type] ?? COMPONENT_INSURANCE_VALUE),
    0,
  );
}

export function processScenario(scenario: Scenario): ScenarioResult {
  let quoteCount = 0;
  const policies: { insuranceSum: number; remainingCap: number; items: Item[] }[] = [];
  const results = scenario.steps.map((step) => {
    if (step.op === "claim") {
      const policy = policies[step.policy];
      const reimbursableAmount = step.incident.damages.reduce((sum, d) => {
        const policyItem = policy.items.find((i) => i.type === d.itemType);
        let effectiveDamage = d.amount;
        if (policyItem && policyItem.material !== DRAGON_MATERIAL && policyItem.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
          effectiveDamage = Math.floor(effectiveDamage * HIGH_ENCHANTMENT_REIMBURSEMENT / 100);
        }
        return sum + effectiveDamage;
      }, 0);
      const afterDeductible = Math.max(0, reimbursableAmount - DEDUCTIBLE);
      const payout = Math.min(afterDeductible, policy.remainingCap);
      policy.remainingCap -= payout;
      return { payout, remainingCap: policy.remainingCap };
    }
    const insuranceSum = sumInsuranceValues(step.items);
    let adjustedPremium = sumItemPremiums(step.items);
    if (scenario.customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) {
      adjustedPremium = Math.floor(adjustedPremium * (100 - LOYALTY_DISCOUNT) / 100);
    }
    let contractPremium: number;
    if (quoteCount === 0) {
      contractPremium =
        Math.ceil(adjustedPremium * (100 + FIRST_INSURANCE_SURCHARGE) / 100);
    } else {
      contractPremium =
        Math.floor(adjustedPremium * (100 - MULTI_CONTRACT_DISCOUNT) / 100);
    }
    quoteCount++;
    policies.push({ insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER, items: step.items });
    const premium = contractPremium + PROCESSING_FEE;
    return { premium };
  });
  return { results };
}
